(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('CreateModelController', CreateModelController);

    CreateModelController.$inject = ['$rootScope', '$http', '$location'];

    function CreateModelController($rootScope, $http, $location) {
        var vm = this;

        vm.registerModel = function(modelName) {
            $location.path('/'.concat($rootScope.root.username).concat('/').concat(modelName));
        }
    }
})();
