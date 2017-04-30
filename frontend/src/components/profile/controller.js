app.controller("ProfileController", ["$scope", "$routeParams", function($scope, $routeParams) {
    console.log("Loading profile controller");
    $scope.profile = {};
    $scope.profile.displayName = $routeParams.username;
}]);
