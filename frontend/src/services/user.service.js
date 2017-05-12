(function() {
    'use strict';

    angular
        .module('axonApp')
        .service('$userService', UserService);

    UserService.$inject = ['$apiBaseUrl', '$http'];

    function UserService($apiBaseUrl, $http) {
        this.$apiBaseUrl = $apiBaseUrl;
        this.$http = $http;
    }

    UserService.prototype.getModels = function(user, cb) {
        const URL = this.$apiBaseUrl + '/data/models/' + user;
        this.$http.get(URL).then(successCb, errorCb);

        function successCb(response) {
            cb(null, response);
        }

        function errorCb(response) {
            cb(response, null);
        }
    }
})();
