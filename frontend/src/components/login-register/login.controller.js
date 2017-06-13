(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('LoginRegisterController', LoginRegisterController);

    LoginRegisterController.$inject = ['authService', 'credentialsService', '$http', '$location', '$rootScope', '$mdToast'];

    /**
     * Controller for login/registration component.
     */
    function LoginRegisterController(authService, credentialsService, $http, $location, $rootScope, $mdToast) {
        var vm = this;
        vm.handle = '';
        vm.password = '';
        vm.newName = '';
        vm.newHandle = '';
        vm.newPassword = '';
        vm.login = login;
        vm.register = register;

        function login() {
            // Send the username and password up to server.
            var params = {
                username: vm.handle,
                password: vm.password,
            };
            authService.login(params, callback);

            function callback(err, token) {
                if (err) {
                    $mdToast.show($mdToast.simple()
                        .textContent('Username or password incorrect.')
                        .position('top right')
                        .hideDelay(3000));
                } else {
                    credentialsService.store(vm.handle, token.data);
                    $rootScope.root.loggedIn = true;
                    $rootScope.root.username = vm.handle;
                    $location.url("/explore");
                }
            }
        }

        function register() {
            // Send the username and password up to server.
            var params = {
                name: vm.newName,
                username: vm.newHandle,
                password: vm.newPassword,
            };
            authService.register(params, callback);

            function callback(err, token) {
                if (err) {
                    $mdToast.show($mdToast.simple()
                        .textContent('Username or password incorrect.')
                        .position('top right')
                        .hideDelay(3000));
                } else {
                    credentialsService.store(vm.newHandle, token.data);
                    $rootScope.root.loggedIn = true;
                    $rootScope.root.username = vm.newHandle;
                    $location.url("/explore");
                }
            }
        }
    }
})();
