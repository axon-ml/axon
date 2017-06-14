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

        vm.redirectToLogin = redirectToLogin;

        function redirectToLogin() {
            $location.path('/login');
        }
    }
})();
