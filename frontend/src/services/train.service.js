(function() {
    'use strict';

    angular
        .module('axonApp')
        .service('trainService', TrainService);

    TrainService.$inject = ['$http', 'axonUrls'];

    function TrainService($http, axonUrls) {
        this.$http = $http;
        this.startUrl = axonUrls.apiBaseUrl + '/start';
    }

    TrainService.prototype.start = function(code, cb) {
        this.$http.post(this.startUrl).then(successCb, errorCb);

        function successCb(response) {
            var data = response.data;
            cb(null, data);
        }

        function errorCb(response) {
            var err = response.data;
            cb(err, null);
        }
    };

})();
