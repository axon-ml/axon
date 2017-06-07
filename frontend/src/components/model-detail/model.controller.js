(function () {

    'use strict';

    angular
        .module('axonApp')
        .controller('ModelDetailController', ModelController);

    ModelController.$inject = ['compileService', '$http', '$routeParams', '$location', 'dataService', 'starService'];

    function ModelController(compileService, $http, $routeParams, $location, dataService, starService) {

        var vm = this;
        vm.username = $routeParams.username;
        vm.model = $routeParams.model;

        vm.renderMarkdown = false;
        vm.star = star;
        vm.starCount = undefined;

        // Get the initial star count.
        dataService.id(vm.username, vm.model, function(err, res) {
            if (err) {
                throw err;
            }
            starService.count(res.id, function(err, res) {
                vm.starCount = res.count;
            });
        });

        function star() {
            // Grab the ID of the currently active model, send a star request.
            dataService.id(vm.username, vm.model, function(err, res) {
                // Star that model.
                starService.star(res.id, function(newStars) {
                    vm.starCount++;
                });
            });
        }

        // begin old graph-editor.controller.js

        var layerTypes = {
            "Input" : {
                params: ["dimensions"],
                color: "#96ceb4",
            },
            "FullyConnected" : {
                params: ["activation", "output_units"],
                color: "#e92a28",
            },
            "Conv2D" : {
                params: ["activation", "filters", "kernel_size", "padding"],
                color: "#ff6f69",
            },
            "Pool2D" : {
                params: ["pool_size", "stride"],
                color: "#6f5d7e",
            },
            "Dropout" : {
                params: ["probability"],
                color: "#88d8b0",
            },
            "ZeroPad" : {
                params: ["top", "bottom", "left", "right"],
                color: "#345978",
            },
            "Flatten" : {
                params: [],
                color: "#c36882",
            }
        };

        var listParams = new Set(["dimensions", "pool_size"]);       // Params that must be in list format
        var possibleListParams = new Set(["kernel_size", "stride"]); // Params that may be either a number or list
        var stringParams = new Set(["activation", "padding"]);       // Params supposed to be in string format

        vm.stringMapParams = {                                       // Dropdown values for string params
            "activation": ["sigmoid", "tanh", "relu", "softmax"],
            "loss": ["xent", "mse"],
            "padding": ["same", "valid"],
        };

        vm.graph = {};
      	vm.graph.itemSelected = null;
        vm.graph.containers =  [
            {                                                        // Init graph editing pane (to input layer)
                "items" : [{
                        "name" : "Input",
                        "opts" : ["dimensions"],
                        "input" : {},
                        "color" : layerTypes["Input"].color,
                    }],
                "class" : "layers"
            }, {                                                     // Init layer library (to empty list)
                "items" : [],
                "class" : "sidebar"
            }
        ];

        /**
         * Parse a string as a list of floats
         */
        function parseNumberList(s) {
            return (s + '')
                .split(',')
                .map(parseFloat);
        }

        /**
         * Parse a string as a number or list of floats
         */
        function parsePossibleNumberList(s) {
            if ((s + '').indexOf(',') === -1) {
                return +(s);
            }
            return parseNumberList(s);
        }

        /**
         * Convert the input fields from the graph editor into JSON formatted for the
         * compile service
         */
        function formatModel(layerList) {
            console.log(layerList);
            var model = {};

            model.layers = [];
            for (var i = 0; i < layerList.length; i++) {
                var formattedLayer = {
                    "name" : 'layer' + i, // TODO: use better names
                    "kind" : layerList[i].name,
                    "params" : layerList[i].input
                };

                // Convert params to correct type
                if (formattedLayer.params === undefined) {
                    formattedLayer.params = {};
                }
                for (var key in formattedLayer.params) {
                    if (!formattedLayer.params.hasOwnProperty(key)) continue;
                    if (listParams.has(key)) {              // is a list of numbers
                        formattedLayer.params[key] = parseNumberList(layerList[i].input[key]);
                    }
                    else if (possibleListParams.has(key)) { // is a list of numbers or a number
                        formattedLayer.params[key] = parsePossibleNumberList(layerList[i].input[key]);
                    }
                    else if (!stringParams.has(key)) {      // is number
                        formattedLayer.params[key] = parseFloat(formattedLayer.params[key]);
                    }
                }
                model.layers.push(formattedLayer);
            }
            model.input = [3, 2, 1]; // TODO: use real values
            model.connections = [{
                head: 'layer0',
                tail: 'layer' + (layerList.length - 1),
            }];
            return model;
        }

        vm.graph.compile = function() {
            // Note: all of params necessary to generate code are contained within object
            console.log('formatted', formatModel(vm.graph.containers[0].items));
            var compiled = JSON.parse(angular.toJson(formatModel(vm.graph.containers[0].items)));
            compileService.gen(compiled, function(err, res) {
                if (err) {
                    console.log('error');
                    vm.graph.compiledCode = 'Compilation error!';
                } else {
                    console.log(res);
                    vm.graph.compiledCode = res; // update view model with compiled code
                }
            });
        };

	    // Generate initial model
        for(var key in layerTypes) {
            if (layerTypes.hasOwnProperty(key)) {
                vm.graph.containers[1].items.push({
                    "name" : key,
                    "opts" : layerTypes[key].params,
                    "input" : {},
                    "color": layerTypes[key].color,
                });
            }
        }


    }
})();
