(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('ModelDetailController', ['$routeParams', modelController]);

    function modelController($routeParams) {
        var vm = this;
        vm.username = $routeParams.username;
        vm.model = $routeParams.model;
    }

})();