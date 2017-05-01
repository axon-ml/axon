(function () {
    'use strict';

    angular
        .module('axonApp')
        .config(['$routeProvider', '$locationProvider',
            axonConfig]);

    function axonConfig($routeProvider, $locationProvider) {
        // Use HTML5 URLs, so we can get history API, frontend routing, etc.
        $locationProvider.html5Mode(true);

        $routeProvider.when('/login-register', {
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
            redirectTo: '/login-register',
        });
    }

})();