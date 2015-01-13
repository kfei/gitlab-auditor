app

.controller("ConfigCtrl",
        ["$rootScope", "$state", "Config",
        function($rootScope, $state, Config) {

    $rootScope.Config = Config;
}])

;
