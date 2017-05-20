(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$routeParams', 'dataService'];
    function ProfileController($routeParams, dataService) {
        var vm = this;
        vm.displayName = $routeParams.username;

        // Set the models statically.
        dataService.getModels(vm.displayName, function(err, response) {
            if (err) {
                console.error("Error executing dataService.getModels:", err);
                vm.models = [];
            } else {
                vm.models = response.models;
                // Store the currently accessed model at the top-level.
            }
        });
    }
})();
