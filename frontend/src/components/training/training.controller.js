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
            // Convert the data to strip ANSI char codes
            // From: http://www.mudbytes.net/forum/comment/68949/
            // var encoded = JSON.stringify(msg.data)
            vm.rawText += msg.data;
        });
    }
})();
