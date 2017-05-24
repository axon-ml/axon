(function() {
    'use strict';

    angular
        .module('axonApp')
        .service('compileService', CompileService);

    CompileService.$inject = ['$apiBaseUrl', '$http'];

    function CompileService($apiBaseUrl, $http) {
        this.genUrl = $apiBaseUrl + '/compile/gen';
    }

    /**
     * Provide a method that can either be used for sending a model to the frontend,
     * or be used for compiling a model with a given ID.
     */
    CompileService.prototype.gen = function(modelOrId, cb) {
        if (modelOrId === undefined) {
            throw "modelOrId must be specified to compileService.gen() as first argument";
        }

        if (typeof modelOrId === "object") {
            // Send a POST request with the object as the body.
            $http.post(this.genUrl, modelOrId).then(success, error);
        } else if (typeof modelOrId === "string") {
            // Send a GET request to compile the model with the given string ID.
            var url = this.genUrl + '/' + modelOrId;
            $http.get(url).then(success, error);
        }

        function success(response) {
            cb(null, response.data);
        }

        function error(err) {
            cb(err.data, null);
        }
    };

})();
