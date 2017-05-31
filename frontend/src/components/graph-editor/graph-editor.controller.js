(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('GraphEditorController', ['compileService', '$http', '$routeParams', '$location', ModelController]);

    ModelController.$inject = ['compileService', '$http', '$routeParams', '$location'];

    function ModelController(compileService, $http, $routeParams, $location) {
        var vm = this;
        var layerTypes = {
            "Input" : ["dimensions"],
            "Fully Connected" : ["activation", "output_units"],
            "Conv2D" : ["activation", "filters", "kernel_size", "padding"],
            "Pool2D" : ["pool_size", "stride"],
            "Dropout" : ["probability"],
            "ZeroPad" : ["top", "bottom", "left", "right"],
            "Flatten" : []};

        var listParams = new Set(["dimension", "pool_size"]); // Params that must be in list format
        var possibleListParams = new Set(["kernel_size", "stride"]); // Params that may be either a number or list
        var stringParams = new Set(["activation", "padding"]); // Params supposed to be in string format
        //var layerTypes = [{"name" : "", "kind" : "", "params" : { "dimensions" : "" }}]
        vm.graph = {};
      	vm.graph.itemSelected = null;
        vm.graph.containers =  [ {"items" : [{"name" : "Input", "opts" : ["dimension"], "input" : {}}], "class" : "layers"},
                {"items" : [], "class" : "sidebar"}];

        /* Convert the input fields from the graph editor into JSON formatted for the
        compile service */
        function formatLayers(layerList) {
            var formattedLayers = [];
            for(var i = 0; i < layerList.length; i++) {
                var formattedLayer = {"name" : i, "kind" : layerList[i].name, "params" : layerList[i].input };

                // Convert params to correct type
                if(formattedLayer.params === undefined) {
                    formattedLayer.params = {};
                }
                for(var key in formattedLayer.params) {
                    if(!formattedLayer.params.hasOwnProperty(key)) continue;
                    if(listParams.has(key)) {
                        // @Wilbur TODO: parse list

                    } else if(possibleListParams.has(key)) {
                        // @Wilbur TODO: parse list or possible number
                    } else if(!stringParams.has(key)) { // ie, is number
                        formattedLayer.params[key] = parseFloat(formattedLayer.params[key]);
                    }
                }
                console.log(formattedLayer);
                formattedLayers.push(formattedLayer);
            }
            return formattedLayers;
        }

        vm.graph.compile = function() {
            // Note: all of params necessary to generate code are contained within object
            console.log('compiling');
            console.log(vm.graph.containers[0].items);
            console.log(angular.toJson(formatLayers(vm.graph.containers[0].items)));
            var compiled = JSON.parse(angular.toJson(formatLayers(vm.graph.containers[0].items)));
            console.log(compiled);
            console.log(typeof compiled);
            compileService.gen(compiled, function(err, res) {
                console.log(err, res);
            });
        };

	    // Generate initial model
        for(var key in layerTypes) {
            if(layerTypes.hasOwnProperty(key)) {
                vm.graph.containers[1].items.push({"name" : key, "opts" : layerTypes[key], "input" : {}});
            }
        }

    }

})();
