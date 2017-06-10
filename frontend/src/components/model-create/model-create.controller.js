(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('CreateModelController', CreateModelController);

    CreateModelController.$inject = ['$rootScope', '$http', '$location'];

    function CreateModelController($rootScope, $http, $location) {
        var vm = this;

        vm.registerModel = function(modelName) {
            // Make backend call to create new model
            //username, modelName, modelJson
            // $http.post('/models/save', {
            //     'modelName' : modelName,
            //     'username' : $rootScope.root.username,
            //     'modelJson' : {
            //             input: [3, 2, 1],
            //             connections: [{
            //                 head: "Input1",
            //                 tail: "Conv", }],
            //             layers: [{
            //                 kind: "Input",
            //                 name: "Input1",
            //                 params: {
            //                     dimensions: [1024, 1024],
            //                 },
            //             }, {
            //                 kind: "FullyConnected",
            //                 name: "myconnection",
            //                 params: {
            //                     activation: "tanh",
            //                     output_units: 4,
            //                 },
            //             }],
            //         },
            //     }).then(function(response) {
            // }, function(err) {
            //     console.log(err);
            // });

            // Navigate to the model editor page
            // TODO: CHANGE THIS URL TO BE /:userid/:graphid
            $location.path('/'.concat($rootScope.root.username).concat('/').concat(modelName));
        }
    }
})();
