app

.config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /index
    $urlRouterProvider.otherwise("/index");

    $stateProvider
        .state('index', {
            url: "/index",
            templateUrl: "partials/index.html",
            controller: 'IndexCtrl'
        })

        .state('config', {
            url: "/config",
            templateUrl: "partials/config.html",
            controller: 'ConfigCtrl'
        })

        .state('user', {
            url: "/user",
            templateUrl: "partials/user.html"
        })
            .state('user.list', {
                url: "/list",
                templateUrl: "partials/user.list.html",
                controller: 'UserCtrl'
            })

        .state('repo', {
            url: "/repo",
            templateUrl: "partials/repo.html"
        })
            .state('repo.list', {
                url: "/list",
                templateUrl: "partials/repo.list.html",
                controller: 'RepoCtrl'
            });
})

;
