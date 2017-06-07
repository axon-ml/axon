(function() {
    'use strict';

    angular
        .module('axonApp')
        .service('trainService', TrainService);

    TrainService.$inject = ['$http', 'axonUrls'];

    function TrainService($http, axonUrls) {
        this.$http = $http;
        this.startUrl = axonUrls.apiBaseUrl + '/train/start';
    }

    TrainService.prototype.start = function(code, dataset, cb) {
        if (typeof dataset === 'function') {
            cb = dataset;
            dataset = 'mnist';
        }

        console.log("POST " + this.startUrl);
        this.$http.post(this.startUrl, {
            code: code,
            dataset: dataset,
        }).then(successCb, errorCb);

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
