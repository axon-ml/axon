(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('AxonController', AxonController);

    AxonController.$inject = ['$credentialsService', '$rootScope', '$location', '$resource', '$http'];
    function AxonController($credentialsService, $rootScope, $location, $resource, $http) {
        if ($rootScope.root === undefined) {
            $rootScope.root = {
                loggedIn: false,
                username: '',
            };
        }
        $rootScope.root.logout = logout;

        function logout() {
            $http.defaults.headers.common.Authorization = '';
            $rootScope.root = {};
            $credentialsService.clear();
            $location.path("/login");
        };
    }
})();
