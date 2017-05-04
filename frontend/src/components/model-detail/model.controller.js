(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('ModelDetailController', ['$routeParams', '$location', '$scope', modelController]);

    function modelController($routeParams, $location, $scope) {
        $scope.vm = {}
        $scope.vm.username = $routeParams.username;
        $scope.vm.model = $routeParams.model;

        $scope.vm.renderMarkdown = false; 

        // TODO write function that saves markdown to database 


    }

})();