package main

import (
	"bufio"
	"log"
	"os"
	"regexp"
	"strings"

	flag "github.com/docker/docker/pkg/mflag"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/cors"
	"github.com/martini-contrib/render"
)

var (
	h       bool
	logFile string

	/*
		The following regexes are only work when gitlab-shell's log format has
		customized like:

			# User identifier to be used in log messages.
			def log_username
			  "user-#{userid} (#{username}) with key #{@key_id} from #{@userip}"
			end

		Make sure gitlab-shell confirm this.
	*/

	regexTime     = regexp.MustCompile(`\[(.+)\.\d+\s#\d+\]`)
	regexFetch    = regexp.MustCompile(`git-upload-pack`)
	regexPush     = regexp.MustCompile(`git-receive-pack`)
	regexRepo     = regexp.MustCompile(`/repositories/(.+)[\.git]{0,1}>`)
	regexUserName = regexp.MustCompile(`\s\((.+)\)\s`)
	regexUserIP   = regexp.MustCompile(`from\s([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\.`)
)

type Log struct {
	IP        string `json:"userip"`
	Action    string `json:"action"`
	Timestamp string `json:"timestamp"`
	Info      string `json:"info"`
}

type UserLog struct {
	Logs []Log `json:"logs"`
}

type RepoLog struct {
	Logs []Log `json:"logs"`
}

func matchLogByUser(text, uid string) bool {
	var matched = false
	matched, _ = regexp.MatchString("user-"+uid+" ", text)
	return matched
}

func matchLogByRepo(text, repo string) bool {
	var matched = true
	matched, _ = regexp.MatchString(repo, text)
	return matched
}

func GetUserLogs(params martini.Params, r render.Render) {
	var logCursor Log
	var userLog UserLog

	file, err := os.Open(logFile)
	if err != nil {
		log.Fatal("Can not open the log file of gitlab-shell: " + logFile)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		text := scanner.Text()
		if matchLogByUser(text, params["id"]) {
			_timestamp := "Unknown Timestamp"
			_userIP := "Unknown Address"
			_repo := "Unknown Repository"

			if timestamp := regexTime.FindStringSubmatch(text); len(timestamp) != 0 {
				_timestamp = timestamp[1]
			}
			if userIP := regexUserIP.FindStringSubmatch(text); len(userIP) != 0 {
				_userIP = userIP[1]
			}
			if repo := regexRepo.FindStringSubmatch(text); len(repo) != 0 {
				_repo = repo[1]
			}

			switch {
			case regexFetch.MatchString(text):
				logCursor = Log{_userIP, "Fetch", _timestamp, _repo}
			case regexPush.MatchString(text):
				logCursor = Log{_userIP, "Push", _timestamp, _repo}
			default:
				continue
			}
			userLog.Logs = append(userLog.Logs, logCursor)
		}
	}

	r.JSON(200, userLog)
}

func GetRepoLogs(params martini.Params, r render.Render) {
	var logCursor Log
	var repoLog RepoLog
	var repo = strings.Replace(params["name"], "+", "/", -1)

	file, err := os.Open(logFile)
	if err != nil {
		log.Fatal("Can not open the log file of gitlab-shell: " + logFile)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		text := scanner.Text()
		if matchLogByRepo(text, repo) {
			_timestamp := "Unknown Timestamp"
			_userIP := "Unknown Address"
			_userName := "Unknown User"

			if timestamp := regexTime.FindStringSubmatch(text); len(timestamp) != 0 {
				_timestamp = timestamp[1]
			}
			if userIP := regexUserIP.FindStringSubmatch(text); len(userIP) != 0 {
				_userIP = userIP[1]
			}
			if userName := regexUserName.FindStringSubmatch(text); len(userName) != 0 {
				_userName = userName[1]
			}

			switch {
			case regexFetch.MatchString(text):
				logCursor = Log{_userIP, "Fetch", _timestamp, _userName}
			case regexPush.MatchString(text):
				logCursor = Log{_userIP, "Push", _timestamp, _userName}
			default:
				continue
			}
			repoLog.Logs = append(repoLog.Logs, logCursor)
		}
	}

	r.JSON(200, repoLog)
}

func init() {
	flag.BoolVar(&h,
		[]string{"h", "#help", "-help"},
		false,
		"display this help message")

	flag.StringVar(
		&logFile,
		[]string{"f"},
		"/var/log/gitlab/gitlab-shell/gitlab-shell.log",
		"path to gitlab-shell.log")

	flag.Parse()
}

func main() {
	switch {
	case h:
		flag.PrintDefaults()
	default:
		m := martini.Classic()

		m.Use(render.Renderer())

		m.Use(cors.Allow(&cors.Options{
			AllowOrigins: []string{"*"},
			AllowHeaders: []string{"Origin"},
		}))

		m.Get("/user/:id", GetUserLogs)
		m.Get("/repo/:name", GetRepoLogs)

		m.Run()
	}
}
