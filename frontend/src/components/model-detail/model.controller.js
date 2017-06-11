(function () {

    'use strict';

    angular
        .module('axonApp')
        .controller('ModelDetailController', ModelDetailController);

    ModelController.$inject = ['compileService', '$http', '$routeParams', '$location', 'dataService', 'starService', 'trainService', '$rootScope', 'axonUrls'];

    function ModelDetailController(compileService, $http, $routeParams, $location, dataService, starService, trainService, $rootScope, axonUrls) {
        var vm = this;
        vm.username = $routeParams.username;
        vm.model = $routeParams.model;

        vm.renderMarkdown = false;
        vm.star = star;
        vm.starCount = undefined;

        vm.leftNav = 'editor';
        vm.rightNav = 'model';

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

        // vm.inputLayer = {
        //         params: ["dimensions", "loss", "optimizer"],
        //         color: "#96ceb4",
        // }};
        vm.inputParams = ["dimensions", "loss", "optimizer"]
        vm.input = {};

        var layerTypes = {
            // "Input" : {
            //     params: ["dimensions"],
            //     color: "#96ceb4",
            // },
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
            "loss" : ["xent", "mse"],
            "optimizer" : ["adam", "sgd", "adadelta", "adagrad"],
        };

        vm.graph = {};
      	vm.graph.itemSelected = null;
        vm.graph.containers =  [
            {                                                        // Init graph editing pane (to input layer)
                "items" : [],
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
            //console.log(layerList);
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
            model.input = parseNumberList(vm.input.dimensions); // TODO: use real values
            model.loss = vm.input.loss;
            model.optimizer = vm.input.optimizer;
            model.connections = [{
                head: 'layer0',
                tail: 'layer' + (layerList.length - 1),
            }];
            return model;
        }

        // Generate this into a format embeddable in vm.graph.containers[0].items
        function generateModel(repr) {
            console.log("Building from repr:", repr);
            repr = JSON.parse(repr);
            if(!repr.layers) {
                return [];
            } else {
                var layers = [];
                repr.layers.forEach(function(layer) {
                    var key = layer.kind;
                    console.log("key", key);
                    if (layerTypes.hasOwnProperty(key)) {
                        layers.push({
                            "name" : key,
                            "opts" : layerTypes[key].params,
                            "input" : layer.params,
                            "color": layerTypes[key].color,
                        });
                    }
                });
            }
            return layers;
        }

        function generateInputParams(repr) {
            repr = JSON.parse(repr);

            var inputDims = "";
            if (typeof repr.input === "object") {
                inputDims = repr.input.join(", ");
            } else if (typeof repr.input === "string") {
                inputDims = repr.input;
            } else if (typeof repr.input === "number") {
                inputDims = "" + repr.input;
            }
            return {
                dimensions: inputDims,
                loss: repr.loss,
                optimizer: repr.optimizer,
            };
        }

        console.log('testing');
        $http.get(axonUrls.apiBaseUrl + '/data/models/' + vm.username + '/' + vm.model, {}).then(
            function(response) {
                try {
                    console.log('before resp');
                    console.log(response);

                    // Set the layers.
                    vm.graph.containers[0].items = generateModel(response.data.rows[0].repr);

                    // Also set the input parameters.
                    vm.input = generateInputParams(response.data.rows[0].repr);
                    console.log("Inputs:", vm.input);

                    vm.markdown = response.data.rows[0].markdown;
                } catch(err) {
                    console.log(err);
                };
        }, function(err) {
             console.log('error retrieving model');
        });

        var modelRepr = function() {
            return JSON.parse(angular.toJson(formatModel(vm.graph.containers[0].items)));
        }

        vm.graph.compile = function() {
            // Note: all of params necessary to generate code are contained within object
            //console.log('formatted', formatModel(vm.graph.containers[0].items));
            var compiled = modelRepr();
            console.log(angular.toJson(compiled));
            compileService.gen(compiled, function(err, res) {
                if (err) {
                    console.log('error');
                    console.log(err);
                    vm.graph.errorMessage = 'Compilation error!';
                } else {
                    console.log('success!!');
                    console.log(res);
                    // console.log(err);
                    vm.graph.compiledCode = res; // update view model with compiled code
                    vm.rightUrl = '/src/components/model-detail/code.html'
                }
            });
        };

        vm.rightUrl = '/src/components/model-detail/graph-editor.html';

        vm.graph.save = function() {
            if(vm.markdown === undefined) {
                vm.markdown = "";
            }
             $http.post(axonUrls.apiBaseUrl.concat('/data/models/save'), {
                "username" : vm.username,
                "modelName" : vm.model,
                "modelJson" : angular.toJson(modelRepr()),
                "markdown" : vm.markdown,
            }).then(function(response) {
                console.log('successful save');
                console.log(response);
            }, function(err) {
                console.log('failed save');
            });
            // TODO: Implement saving of models so we can restore them later from the JSON.
        };


        vm.graph.train = function() {
            // Train this
            if (vm.graph.compiledCode) {
                trainService.start(vm.graph.compiledCode, "mnist", function(err, containerId) {
                    if (err) {
                        console.error("Error when training:", err);
                    } else {
                        // Redirect to the training output.
                        console.log('containerid = ' + containerId);
                        $rootScope.root.trainId = containerId;
                        //$location.path('/train/' + containerId);
                        vm.rightUrl = '/src/components/training/training.html';
                    }
                });
            }
        }

        // Generate initial options
         for (var key in layerTypes) {
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
