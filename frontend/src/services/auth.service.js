(function() {
    'use strict';

    angular
        .module('axonApp')
        .service('$authService', AuthService);

    AuthService.$inject = ['$apiBaseUrl', '$http'];

    /**
     * AuthService connects to the AuthService provided by the backend.
     *
     * Constructor arguments:
     *  $http: The HTTP service injected by Angular.
     *  $apiBaseUrl: A constant service that returns the base URL for the backend API.
     */
    function AuthService($apiBaseUrl, $http) {
        this.$apiBaseUrl = $apiBaseUrl;
        this.$http = $http;
    }

    /**
     * Attempts to login using the given params object.
     * cb is a callback of the form cb(jwt, error), where error is falsey if successful.
     */
    AuthService.prototype.login = function(loginParams, cb) {
        const URL = this.$apiBaseUrl + '/auth/login';
        this.$http.post(URL, loginParams).then(successCb, errorCb);

        function successCb(response) {
            cb(null, response);
        }

        function errorCb(response) {
            cb(response, null);
        }
    }
})();
