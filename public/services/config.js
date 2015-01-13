app

.factory("Config",
        ["$rootScope", "localStorageService",
        function($rootScope, localStorageService) {

    if ($rootScope.Config) {
        return $rootScope.Config;
    }

    var defConf = {
        gitlabUrl: "http://12.34.56.78",
        gitlabToken: ""
    };

    function Config() {}

    $rootScope.Config = new Config();

    angular.forEach(defConf, function(value, key) {
        $rootScope.Config[key] = localStorageService.get(key) || value;
        $rootScope.$watch("Config." + key, function() {
            if ($rootScope.Config[key] === value) {
                localStorageService.remove(key);
            } else {
                localStorageService.set(key, $rootScope.Config[key]);
            }
        });
    });

    return $rootScope.Config;
}])

;
