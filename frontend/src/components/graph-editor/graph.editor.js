(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('GraphEditorController', ['$routeParams', '$location', '$scope', modelController]);

    function modelController($routeParams, $location, $scope) {
        $scope.graph = {}; 
      	$scope.graph.itemSelected = null;
        $scope.graph.containers =  [{"items" : [], "class" : "sidebar"}, {"items" : [], "class" : "nn-layer"}];

        console.log("hi2");
        console.log($scope.graph.containers.length);

	    // Generate initial model
	    for(var j = 0; j < $scope.graph.containers.length; j++) {
		    for (var i = 1; i <= 3; ++i) {
		    	console.log(j);
		        $scope.graph.containers[j].items.push({label: "Item A" + i});
		        $scope.graph.containers[j].items.push({label: "Item B" + i});
		    }
		}
    }

})();