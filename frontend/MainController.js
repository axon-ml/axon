'use strict';

let app = angular.module('app', ['ngRoute', 'ngResource', 'ngMaterial']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login-register', {
                templateUrl: 'components/login-register/template.html',
                controller: 'LoginRegisterController'
            }).
            otherwise({
                redirectTo: '/login-register'
            });
    }]);

app.controller("MainController", ["$scope", "$rootScope", "$location", "$resource", "$http",
    function ($scope, $rootScope, $location, $resource, $http) {
        $scope.main = {};
        $scope.main.title = 'Users';
        $scope.main.loggedIn = true;
        $scope.main.username = "admin";

        $scope.$on('SuccessfulLogin', function() {
            $scope.main.isLoggedin = true;
        });

        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
          if (!$scope.main.isLoggedin) {
            if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
                $scope.main.context = "Please Log In";
                $location.path("/login-register");
            }
          }
       });

        $scope.main.viewRecentActivity = function() {
            $location.path('/recent-activity');
        };

        $scope.main.logout = function() {
            $resource("/admin/logout").save({});
            $scope.main.isLoggedIn = false;
            $location.path("/login-register");
        };
    }]);
