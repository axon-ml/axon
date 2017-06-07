(function() {
    'use strict';

    angular
        .module('axonApp')
        .service('searchService', SearchService);

    SearchService.$inject = ['axonUrls', '$http'];

    function SearchService(axonUrls, $http) {
        this.baseUrl = axonUrls.apiBaseUrl + '/data';
        this.$http = $http;
    }

    /**
     * Fuzzy search for model names (user/model)
     */
    SearchService.prototype.getModels = function(query, cb) {
        var URL = this.baseUrl + '/search/model/' + query;
        this.$http.get(URL).then(successCb, errorCb);

        function successCb(response) {
            cb(null, response.data);
        }

        function errorCb(err) {
            cb(err, null);
        }
    }

    /**
     * Fuzzy search for model names (user/model) [promise version]
     */
    SearchService.prototype.getModelsPromise = function(query, cb) {
        var URL = this.baseUrl + '/search/model/' + query;
        return this.$http.get(URL).then(function(response) {
            return response.data;
        });
    }

})();
