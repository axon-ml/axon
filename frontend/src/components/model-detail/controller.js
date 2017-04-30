app.controller("ModelDetailController", ["$scope", "$routeParams", function($scope, $routeParams) {
    $scope.model = {};
    $scope.model.username = $routeParams.username;
    $scope.model.model = $routeParams.model;
}]);
