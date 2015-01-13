app

.factory("gitlab",
        ["$http", "$q", "Config",
        function($http, $q, Config) {

    function gitlab() {}

    gitlab.prototype.imageUrl = function(path) {
        return Config.gitlabUrl.replace(/\/*$/, "") + path;
    };

    gitlab.prototype.callapi = function(method, path) {
        var deferred = $q.defer();
        var url = Config.gitlabUrl.replace(/\/*$/, "") + '/api/v3' + path;

        $http({
            url: url,
            method: method,
            headers: {
                'SUDO': 'root',
                'PRIVATE-TOKEN': Config.gitlabToken
            }
        })
        .success(function(data, status, headers, config) {
            deferred.resolve({
                data: data,
                status: status,
                headers: headers,
                config: config
            });
        })
        .error(function(data, status, headers, config) {
            deferred.reject({
                data: data,
                status: status,
                headers: headers,
                config: config
            });
        });

        return deferred.promise;
    };

    return new gitlab();
}])

;
