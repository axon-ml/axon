(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('ModelDetailController', ModelController);

    ModelController.$inject = ['$routeParams', '$location', 'dataService', 'starService'];

    function ModelController($routeParams, $location, dataService, starService) {
        var vm = this;
        vm.username = $routeParams.username;
        vm.model = $routeParams.model;

        vm.renderMarkdown = false;
        vm.star = star;
        vm.starCount = undefined;
        console.log("vm", vm);

        // Get the initial star count.
        dataService.id(vm.username, vm.model, function(err, res) {
            if (err) {
                console.error("Error!", err);
                return;
            }
            console.log("res", res);
            starService.count(res.id, function(err, res) {
                console.log("Setting count to", res.count);
                vm.starCount = res.count;
            });
        });

        function star() {
            // Grab the ID of the currently active model, send a star request.
            dataService.id(vm.username, vm.model, function(err, res) {
                // Star that model.
                starService.star(res.id, function(newStars) {
                    vm.starCount++;
                });
            });
        }
    }
})();
