"use strict";

const app = angular.module('axonApp', ['ngRoute', 'ngResource', 'ngMaterial']);

app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        // Use HTML5 URLs, so we can get history API, frontend routing, etc.
        $locationProvider.html5Mode(true);

        $routeProvider.when('/login-register', {
            templateUrl: '/src/components/login-register/login.html',
            controller: 'LoginRegisterController'
        }).when('/:username', {
            templateUrl: '/src/components/profile/profile.html',
            controller: 'ProfileController'
        }).when('/:username/:model', {
            templateUrl: '/src/components/model-detail/model-detail.html',
            controller: 'ModelDetailController'
        }).otherwise({
            redirectTo: '/login-register'
        });
    }]);

app.controller("AxonController", ["$scope", "$rootScope", "$location", "$resource", "$http",
    function ($scope, $rootScope, $location, $resource, $http) {
        console.log("Starting AxonController");
        $scope.main = {
            title: "Users",
            loggedIn: true,
            username: "elonmusk",
            models: ["googlenet", "resnet"] /* List of models */
        };

        // $scope.$on('SuccessfulLogin', function () {
        //     $scope.main.loggedIn = true;
        // });

        $scope.main.logout = function () {
            $scope.main.loggedIn = false;
            $location.path("/login-register");
        };
    }]);
