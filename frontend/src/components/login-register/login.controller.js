(function () {
  'use strict';

  angular
    .module('axonApp')
    .controller('LoginRegisterController', [loginRegisterController]);

  function loginRegisterController() {
    var vm = this;
    vm.login = login;
    vm.register = register;

    function login (username, password) {
      console.log(username, password);
    }

    function register (newUser) { }
  }

})();