# gitlab-auditor

Auditing users' push/fetch events on GitLab.

## Screenshots

![image]()

## Installation

**Option 1**: Just download the [released tar
ball](https://github.com/kfei/gitlab-auditor/releases) from GitHub:

```bash
mkdir -p gitlab-auditor
tar xjvf gitlab-auditor-x64.tar.bz -C gitlab-auditor
cd gitlab-auditor
./gitlab-auditor
```

**Option 2**: Clone this repository and build it by yourself:

```bash
git clone https://github.com/kfei/gitlab-auditor
cd gitlab-auditor
go build
./gitlab-auditor
```

Note that **gitlab-auditor** will search
`/var/log/gitlab/gitlab-shell/gitlab-shell.log` by default. To use a different
log file, run `./gitlab-auditor -f <file>` instead.

## Apply patches to GitLab services

To have **gitlab-shell** logging users' ID, we have to patch GitLab, both the
Rails application and the SSH shell parts.

**Step 1**: (Patch)[docs/gitlab-rails.diff?raw=true] GitLab, so that the
internal *discover* API can expose users' ID.

Then run `gitlab-ctl restart` to restart GitLab services.

**Step 2**: (Patch)[docs/gitlab-shell.diff?raw=true] *gitlab-shell* so that it
can log users' ID and IP.

## Usage

Visit `http://<your-server-ip>:3000` through a web browser, and click the
`config` button to paste your GitLab's API token on. Now the web application is
ready to use.

## Todo

Instead of always inefficiently parsing a log file, send them to a persistent
database with index enabled. In the mean time, you might want to set the log
file's rotate frequency to as long as you can by
`logging['logrotate_frequency'] = "yearly"` or even longer.

## Furthermore

In case your nonsense boss ask you to disable all methods to download code from
the GitLab web, have a look at [another document](docs/DIRTYPATCH.md).
