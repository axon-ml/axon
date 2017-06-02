(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('CreateModelController', LoginRegisterController);

    LoginRegisterController.$inject = ['$http', '$location'];

    function LoginRegisterController($http, $location) {
        var vm = this;

        vm.registerModel = function(modelName) {
            // Make backend call to create new model 

            // Navigate to the model editor page 
            $location.path('/graph-editor/'.concat(modelName));
        }
      

    }
})();