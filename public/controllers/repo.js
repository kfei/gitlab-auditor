app

.controller("RepoCtrl",
        ["$scope", "$translate", "$mdBottomSheet",
        function($scope, $translate, $mdBottomSheet) {

    $scope.repos = [];
    $scope.logid = false;
    $scope.logs = "";

    $scope.fetchRepos = function() {
        $scope.loading.add("list-repos");
        $scope.gitlab.callapi("GET", "/projects?per_page=1000")
            .then(function(res) {
                $scope.repos = res.data;
                for (var i in $scope.repos) {
                    if ($scope.repos[i]["namespace"]["avatar"]["url"] == null) {
                        $scope.repos[i]["namespace"]["avatar"]["url"] = "assets/images/gitlab_logo.png";
                    } else {
                        $scope.repos[i]["namespace"]["avatar"]["url"] = $scope.gitlab.imageUrl($scope.repos[i]["namespace"]["avatar"]["url"]);
                    }
                }
            }, function(res) {
                // TODO
            })
            .finally(function() {
                $scope.loading.del("list-repos");
            });
    };

    $scope.fetchRepos();

    $scope.fetchRepoLogs = function(repo) {
        $scope.loading.add("fetch-repo-logs");
        $scope.logs = "";
        $scope.backend.callapi("GET", "/repo/" + repo.replace("/", "+"))
            .then(function(res) {
                $scope.logs = res.data.logs;
            }, function(res) {
                // TODO
            })
            .finally(function() {
                $scope.loading.del("fetch-repo-logs");
            });
    };

    $scope.listRepoLogs = function(rid) {
        $scope.logid = rid;
        $scope.fetchRepoLogs(rid);
    };

}])

;
