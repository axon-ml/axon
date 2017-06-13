(function() {
    'use strict';

    angular
        .module('axonApp')
        .service('authService', AuthService);

    AuthService.$inject = ['axonUrls', '$http'];

    /**
     * AuthService connects to the AuthService provided by the backend.
     */
    function AuthService(axonUrls, $http) {
        this.loginUrl = axonUrls.apiBaseUrl + '/auth/login';
        this.registerUrl = axonUrls.apiBaseUrl + '/auth/register';
        this.$http = $http;
    }

    /**
     * Attempts to login using the given params object.
     * cb is a callback of the form cb(jwt, error), where error is falsey if successful.
     */
    AuthService.prototype.login = function(loginParams, cb) {
        this.$http.post(this.loginUrl, loginParams).then(successCb, errorCb);

        function successCb(response) {
            cb(null, response);
        }

        function errorCb(err) {
            cb(err, null);
        }
    }

    AuthService.prototype.register = function(loginParams, cb) {
        this.$http.post(this.registerUrl, loginParams).then(success, error);

        function success(response) {
            cb(null, response.data);
        }

        function error(response) {
            cb(response.data, null);
        }
    }
})();
