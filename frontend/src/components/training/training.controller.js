(function() {
    'use strict';

    angular
        .module('axonApp')
        .controller('TrainingController', TrainingController)

    TrainingController.$inject = ['axonUrls', '$websocket', '$routeParams'];
    function TrainingController(axonUrls, $websocket, $routeParams) {
        var vm = this;
        vm.rawText = "";

        var trainId = $routeParams.id;
        var client = $websocket(axonUrls.wsUrl);

        // Signal the log we wish to subscribe to.
        client.onOpen(function() {
            client.send(trainId);
        });

        client.onMessage(function(msg) {
            // Convert the data to something else.
            var outputHtml = clean(msg.data);
            vm.rawText += msg.data;
        });
    }
})();
