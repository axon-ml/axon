(function () {
    'use strict';

    /* Constants */
    var USERNAME_KEY = 'username';
    var TOKEN_KEY = 'token';

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

    CredentialsService.prototype.store = function(username, token) {
        this.$cookies.put(USERNAME_KEY, username);
        this.$cookies.putObject(TOKEN_KEY, token);

        this.$http.defaults.headers.common['Authorization'] = this.getBearer();
    }

    CredentialsService.prototype.getUsername = function() {
        return this.$cookies.get(USERNAME_KEY);
    }

    CredentialsService.prototype.getToken = function() {
        return this.$cookies.getObject(TOKEN_KEY);
    }

    CredentialsService.prototype.getBearer = function() {
        var token = this.$cookies.getObject(TOKEN_KEY);
        return 'Bearer ' + btoa(JSON.stringify(token));
    }

    CredentialsService.prototype.clear = function() {
            this.$cookies.remove(USERNAME_KEY);
            this.$cookies.remove(TOKEN_KEY);
    }
})();
