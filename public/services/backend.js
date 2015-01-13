app

.factory("backend",
        ["$http", "$q", "$location",
        function($http, $q, $location) {

    function backend() {
        this.host = $location.host();
        this.port = $location.port();
    }

    backend.prototype.makeApiUrl = function(path) {
        return "http://" + this.host + ":" + this.port + path;
    };

    backend.prototype.callapi = function(method, path) {
        var deferred = $q.defer();
        var url = this.makeApiUrl(path);
        $http({
            url: url,
            method: method,
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

    return new backend();
}])

;
