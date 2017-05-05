(function () {
    'use strict';

    /* Constants */
    var USERNAME_KEY = 'username';
    var JWT_KEY = 'jwt';

    angular
        .module('axonApp')
        .service('$credentialsService', CredentialsService);

    CredentialsService.$inject = ['$apiBaseUrl', '$cookies', '$http'];

    /**
     * CredentialsService serves to store and clear the credentials for the currently logged in user.
     */
    function CredentialsService($apiBaseUrl, $cookies, $http) {
        this.$apiBaseUrl = $apiBaseUrl;
        this.$cookies = $cookies;
        this.$http = $http;
    }

    CredentialsService.prototype.store = function(username, jwt) {
        this.$cookies.put(USERNAME_KEY, username);
        this.$cookies.put(JWT_KEY, jwt);

        this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + jwt;
    }

    CredentialsService.prototype.getUsername = function() {
        return this.$cookies.get(USERNAME_KEY);
    }

    CredentialsService.prototype.getJwt = function() {
        return this.$cookies.get(JWT_KEY);
    }

    CredentialsService.prototype.clear = function() {
            this.$cookies.remove(USERNAME_KEY);
            this.$cookies.remove(JWT_KEY);
    }
})();
