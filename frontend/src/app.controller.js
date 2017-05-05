(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('AxonController', AxonController);

    AxonController.$inject = ['$cookies', '$rootScope', '$location', '$resource', '$http'];
    function AxonController($cookies, $rootScope, $location, $resource, $http) {
        if ($rootScope.root === undefined) {
            $rootScope.root = {
                loggedIn: false,
                username: '',
            };
        }
        $rootScope.root.logout = logout;

        function logout() {
            $rootScope.root = {};
            $cookies.remove('jwt');
            $cookies.remove('username');
            $location.path("/login");
        };
    }
})();
