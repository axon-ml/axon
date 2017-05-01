(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('AxonController', ['$scope', '$rootScope', '$location', '$resource', '$http',
            axonController]);

    function axonController($scope, $rootScope, $location, $resource, $http) {
        console.log('Starting AxonController');
        $scope.main = {
            title: 'Users',
            loggedIn: true,
            username: 'elonmusk',
            models: ['googlenet', 'resnet'] /* List of models */
        };

        $scope.main.logout = function () {
            $scope.main.loggedIn = false;
            $location.path('/login-register');
        };
    }

})();