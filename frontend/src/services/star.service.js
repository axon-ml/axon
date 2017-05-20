(function() {
    'use strict';

    angular
        .module('axonApp')
        .service('starService', StarService);

    StarService.$inject = ['$apiBaseUrl', '$http'];

    function StarService($apiBaseUrl, $http) {
        this.$apiBaseUrl = $apiBaseUrl;
        this.$http = $http;
    }

    /**
     * Makes the logged-in user place a star on the given model.
     */
    StarService.prototype.star = function(modelId, cb) {
        // Send a request to star the model with the given name.
        var URL = this.$apiBaseUrl + '/star/' + modelId;
        this.$http.post(URL).then(successCb, errorCb);

        function successCb(response) {
            if (cb) {
                cb(null, response);
            }
        }

        function errorCb(err) {
            if (cb) {
                cb(err, null);
            }
        }
    }

    /**
     * Boolean function, whether or not logged-in user has starred the specified model.
     */
    StarService.prototype.hasStarred = function(modelId, cb) {
        // Send a request to check if the user has starred a location.
    }

    StarService.prototype.count = function(modelId, cb) {
        var URL = this.$apiBaseUrl + '/star/count/' + modelId;
        this.$http.get(URL).then(success, error);

        function success(response) {
            if (cb) {
                cb(null, response.data);
            }
        }

        function error(err) {
            if (cb) {
                cb(err, null);
            }
        }
    }

})();
