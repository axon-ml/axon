(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('AxonController', AxonController);

    AxonController.$inject = ['credentialsService', 'searchService', '$rootScope', '$location', '$resource', '$http'];
    function AxonController(credentialsService, searchService, $rootScope, $location, $resource, $http) {
        var vm = this;

        if (!$rootScope.root) {
            $rootScope.root = {};
            $rootScope.root.loggedIn = false;
            $rootScope.root.username = 'unknown';
        }

        $rootScope.root.getMatches = getMatches;
        $rootScope.root.redirect = redirect;


        $rootScope.root.logout = logout;

        $rootScope.root.createModel = function() {
            console.log('creating model');
            $location.path('/create-model');
        };

        function logout() {
            $http.defaults.headers.common.Authorization = '';
            $rootScope.root = {};
            credentialsService.clear();
            $location.path("/login");
        };

        /**
         * For search box
         */
        function getMatches(searchQuery) {
            return searchService.getModelsPromise(searchQuery);
        }

        function redirect(item) {
            if (item) {
                $location.path(item.handle + '/' + item.model);
            }
        }
    }

})();
