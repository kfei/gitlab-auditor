app

.controller("UserCtrl",
        ["$scope", "$translate", "$mdBottomSheet", 
        function($scope, $translate, $mdBottomSheet) {

    $scope.users = [];
    $scope.logid = false;
    $scope.logs = "";

    $scope.fetchUsers = function() {
        $scope.loading.add("list-users");
        $scope.gitlab.callapi("GET", "/users?per_page=1000")
            .then(function(res) {
                $scope.users = res.data;
                for (var i in $scope.users) {
                    if ($scope.users[i]["avatar_url"] == null) {
                        $scope.users[i]["avatar_url"] = "assets/images/no_avatar.png";
                    }
                }
            }, function(res) {
                // TODO
            })
            .finally(function() {
                $scope.loading.del("list-users");
            });
    };

    $scope.fetchUsers();

    $scope.fetchUserLogs = function(uid) {
        $scope.loading.add("fetch-user-logs");
        $scope.logs = "";
        $scope.backend.callapi("GET", "/user/" + uid)
            .then(function(res) {
                $scope.logs = res.data.logs;
            }, function(res) {
                // TODO
            })
            .finally(function() {
                $scope.loading.del("fetch-user-logs");
            });
    };

    $scope.listUserLogs = function(uid) {
        $scope.logid = uid;
        $scope.fetchUserLogs(uid);
    };

}])

;
