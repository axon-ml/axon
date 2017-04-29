'use strict';

app.controller('LoginRegisterController', ['$scope', "$rootScope",
     "$location", '$routeParams', '$resource',
  function ($scope, $rootScope, $location, $routeParams, $resource) {

  $scope.loginRegister = {};
  //$location.path('/users/'.concat(user._id));
  // $resource('/user').save( newUser, function() {
  //     $location.path('/login-register');
  //     $scope.loginRegister.statusMessage = "Successfully registered new user";

  //   }, function(err) {
  //     $scope.loginRegister.statusMessage = err.data;
  //   });

  $scope.loginRegister.login = function(userName, password) {};

  $scope.loginRegister.register = function(newUser) {};

  }]);
