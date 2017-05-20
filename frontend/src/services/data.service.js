(function() {
    'use strict';

    angular
        .module('axonApp')
        .service('dataService', DataService);

    DataService.$inject = ['$apiBaseUrl', '$http'];

    function DataService($apiBaseUrl, $http) {
        this.baseUrl = $apiBaseUrl + '/data';
        this.$http = $http;
    }

    DataService.prototype.getModels = function(user, cb) {
        var URL = this.baseUrl + '/models/' + user;
        this.$http.get(URL).then(successCb, errorCb);

        function successCb(response) {
            cb(null, response.data);
        }

        function errorCb(err) {
            cb(err, null);
        }
    }

    /**
     * Reverse-lookup of UserID's and ModelID's.
     *
     * When called as dataService.id('root') => returns user ID
     * When called as dataService.id('root', 'root-net') => returns model ID
     */
    DataService.prototype.id = function(username, modelname, cb) {
        var URL;

        if (typeof modelname === "string") {
            // Treat the modelname as nothing
            URL = this.baseUrl + '/id/' + username + '/' + modelname;
        } else {
            URL = this.baseUrl + '/id/' + username;
            cb = modelname;
        }
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
