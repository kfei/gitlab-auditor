app

.controller("IndexCtrl",
        ["$scope", "$translate", "$mdBottomSheet", "loading", "gitlab", "backend",
        function($scope, $translate, $mdBottomSheet, loading, gitlab, backend) {

    // Initialize services
    $scope.loading = loading;
    $scope.gitlab = gitlab;
    $scope.backend = backend;

    // Language selector
    $scope.showLangBottomSheet = function($event) {
        $mdBottomSheet.show({
            templateUrl: "partials/lang.html",
            controller: "LangCtrl",
            targetEvent: $event
        }).then(function(clickedItem) {
            $translate.use(clickedItem.lang);
        });
    };

}])

;
