(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('GraphEditorController', ['$routeParams', '$location', '$scope', modelController]);

    function modelController($routeParams, $location, $scope) {
        var layerTypes = {"Input" : ["dimensions"], "Fully Connected" : ["activation", "output_units"],
                 "Conv2D" : ["activation", "filters", "kernel_size", "padding"], "Pool2D" : ["pool_size", "stride"],
                  "Dropout" : ["probability"]}; 
        $scope.graph = {}; 
      	$scope.graph.itemSelected = null;
        $scope.graph.containers =  [ {"items" : [{"name" : "Input"}], "class" : "layers"}, 
                {"items" : [], "class" : "sidebar"}];

        $scope.graph.compile = function() {
            // Note: all of params necessary to generate code are contained within object 
            console.log($scope.graph.containers[0].items);
        };

	    // Generate initial model
        for(var key in layerTypes) {
            if(layerTypes.hasOwnProperty(key)) {
                $scope.graph.containers[1].items.push({"name" : key, "opts" : layerTypes[key], "input" : {}}); 
            }
        }


            
    }

})();