(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$routeParams', '$userService'];
    function ProfileController($routeParams, $userService) {
        var vm = this;
        vm.displayName = $routeParams.username;

        // Set the models statically.
        $userService.getModels(vm.displayName, function(err, response) {
            if (err) {
                console.error("Error executing $userService.getModels:", err);
                vm.models = [];
            } else {
                vm.models = response.data.models;
            }
        });
    }
})();
