(function () {
    'use strict';

    angular
        .module('axonApp')
        .config(axonConfig)
        .constant('axonUrls', (function() {
            var domain = 'localhost';
            var apiPort = 3000;
            var wsPort = 3002;

            return {
                apiBaseUrl: 'http://' + domain + ':' + apiPort,
                wsUrl: 'ws://' + domain + ':' + wsPort,
            };
        })())
        .run(axonRun);

    axonConfig.$inject = ['$routeProvider', '$locationProvider'];
    function axonConfig($routeProvider, $locationProvider) {
        // Use HTML5 URLs, so we can get pretty URLs.
        $locationProvider.html5Mode(true);

        $routeProvider.when('/login', {
            templateUrl: '/src/components/login-register/login.html',
            controller: 'LoginRegisterController',
            controllerAs: 'vm',
        }).when('/create-model', {
            templateUrl: '/src/components/model-create/model-create.html',
            controller: 'CreateModelController',
            controllerAs: 'vm',
        }).when('/explore', {
            templateUrl: '/src/components/profile/profile.html',
            controller: 'ProfileController',
            controllerAs: 'vm',
        }).when('/:username/:model', {
            templateUrl: '/src/components/model-detail/model-detail.html',
            controller: 'ModelDetailController',
            controllerAs: 'vm',
        }).otherwise({
            redirectTo: '/login',
        });
    }

    /**
     * On first run of the module after a refresh, restore the user state for logged in user.
     * For logged-out user, redirect to login page.
     */
    axonRun.$inject = ['credentialsService', '$rootScope', '$location', '$http'];
    function axonRun(credentialsService, $rootScope, $location, $http) {
        // Set loggedIn on the rootscope.
        $rootScope.root = {};
        if (credentialsService.getToken()) {
            $rootScope.root.loggedIn = true;
            $rootScope.root.username = credentialsService.getUsername();
            $http.defaults.headers.common['Authorization'] = credentialsService.getBearer();
            console.log("Set bearer to:", credentialsService.getBearer());
        }

        console.log("Logged In:", $rootScope.root.loggedIn);
        $rootScope.$on('$locationChangeStart', function (ev, next, curr) {
            if (!$location.url().startsWith('/login') && !$rootScope.root.loggedIn) {
                $location.path('/login');
            }
        });

        if ($location.path() == '/' && $rootScope.root.loggedIn) {
            $location.path('/explore');
        }
    }
})();
