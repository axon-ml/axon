(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('ProfileController', ['$routeParams', profileController]);

    function profileController($routeParams) {
        var vm = this;
        vm.displayName = $routeParams.username;
    }

})();