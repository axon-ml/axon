(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('LoginRegisterController', LoginRegisterController);

    LoginRegisterController.$inject = ['authService', 'credentialsService', '$http', '$location', '$rootScope'];

    /**
     * Controller for login/registration component.
     */
    function LoginRegisterController(authService, credentialsService, $http, $location, $rootScope) {
        var vm = this;
        vm.handle = '';
        vm.password = '';
        vm.login = login;

        function login() {
            // Send the username and password up to server.
            var params = {
                username: vm.handle,
                password: vm.password,
            };
            authService.login(params, callback);

            function callback(err, token) {
                if (err) {
                    $location.url("/login?err");
                } else {
                    credentialsService.store(vm.handle, token.data);
                    $rootScope.root.loggedIn = true;
                    $location.url("/explore");
                }
            }
        }
    }
})();
