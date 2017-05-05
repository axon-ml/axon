(function () {
    'use strict';

    angular
        .module('axonApp')
        .config(axonConfig)
        .constant('$apiBaseUrl', 'http://localhost:3000')
        .run(axonRun);

    axonConfig.$inject = ['$routeProvider', '$locationProvider'];
    function axonConfig($routeProvider, $locationProvider) {
        // Use HTML5 URLs, so we can get history API, frontend routing, etc.
        $locationProvider.html5Mode(true);

        $routeProvider.when('/login', {
            templateUrl: '/src/components/login-register/login.html',
            controller: 'LoginRegisterController',
            controllerAs: 'vm',
        }).when('/:username', {
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
    axonRun.$inject = ['$cookies', '$rootScope', '$location', '$http'];
    function axonRun($cookies, $rootScope, $location, $http) {
        // Set loggedIn on the rootscope.
        $rootScope.root = {};
        if ($cookies.get('jwt')) {
            $rootScope.root.loggedIn = true;
            $rootScope.root.username = $cookies.get('username');
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $cookies.get('jwt');
        }

        console.log("Logged In:", $rootScope.root.loggedIn);
        $rootScope.$on('$locationChangeStart', function (ev, next, curr) {
            if (!$location.url().startsWith('/login') && !$rootScope.root.loggedIn) {
                $location.path('/login');
            }
        });
    }

})();
