(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('LandingController', LandingController);

    LandingController.$inject = ['authService', 'credentialsService', '$http', '$location', '$rootScope', '$mdToast'];

    /**
     * Controller for landing component.
     */
    function LandingController(authService, credentialsService, $http, $location, $rootScope, $mdToast) {
        var vm = this;

        vm.register = register;

        function register() {
            $location.path('/login');
        }
    }
})();
