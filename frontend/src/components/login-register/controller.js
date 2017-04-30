'use strict';

app.controller('LoginRegisterController', ['$scope', "$rootScope",
  "$location", '$routeParams', '$resource',
  function ($scope, $rootScope, $location, $routeParams, $resource) {

    $scope.loginRegister = {};
    $scope.loginRegister.login = function (userName, password) { };
    $scope.loginRegister.register = function (newUser) { };
  }]);
