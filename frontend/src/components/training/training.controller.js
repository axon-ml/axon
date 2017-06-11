(function() {
    'use strict';

    angular
        .module('axonApp')
        .controller('TrainingController', TrainingController)

    TrainingController.$inject = ['axonUrls', '$websocket', '$routeParams', '$rootScope'];
    function TrainingController(axonUrls, $websocket, $routeParams, $rootScope) {
        // True when a training session has already occurred.
        var self = this;
        self.rawText = "";
        self.running = true;

        console.log('in training controller');

        var trainId = $routeParams.id;
        var client = $websocket(axonUrls.wsUrl);

        // Signal the log we wish to subscribe to.
        client.onOpen(function() {
            console.log($rootScope.root.trainId);
            client.send($rootScope.root.trainId);
            // console.log(trainId);
            // client.send(trainId);
        });

        client.onClose(function() {
            console.log("Webosocket stream closed.");
            self.running = false;
        });

        client.onMessage(function(msg) {
            // Convert the data to strip ANSI char codes
            // From: http://www.mudbytes.net/forum/comment/68949/
            // var encoded = JSON.stringify(msg.data)
            self.rawText += msg.data;
        });
    }
})();
