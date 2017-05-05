(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('LoginRegisterController', LoginRegisterController);

    LoginRegisterController.$inject = ['$authService', '$cookies', '$http', '$location', '$rootScope'];

    /**
     * Controller for login/registration component.
     */
    function LoginRegisterController($authService, $cookies, $http, $location, $rootScope) {
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
            $authService.login(params, callback);

            function callback(err, jwt) {
                if (err) {
                    $location.url("/login?err");
                } else {
                    $cookies.put('username', vm.handle);
                    $cookies.put('jwt', jwt);

                    $rootScope.root.loggedIn = true;
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + jwt;
                    $location.url("/" + vm.handle);
                }
            }
        }
    }
})();
