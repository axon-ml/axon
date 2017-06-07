(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('AxonController', AxonController);

    AxonController.$inject = ['credentialsService', 'searchService', '$rootScope', '$location', '$resource', '$http'];
    function AxonController(credentialsService, searchService, $rootScope, $location, $resource, $http) {
        var vm = this;
        $rootScope.root.getMatches = getMatches;

        if ($rootScope.root === undefined) {
            $rootScope.root = {
                loggedIn: false,
                username: '',
            };
        }
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
    }

})();
