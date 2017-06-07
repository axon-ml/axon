(function() {
    'use strict';

    angular
        .module('axonApp')
        .controller('TrainingController', TrainingController)

    TrainingController.$inject = ['axonUrls', '$websocket', '$routeParams'];
    function TrainingController(axonUrls, $websocket, $routeParams) {
        var vm = this;
        vm.rawText = "";
        vm.lines = [];

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
            vm.lines = vm.rawText.split('\n');
        });

        function clean(rawOutput) {
            var lines = rawOutput.split('\n');
            var output = lines.map(function(l) {
                return '<p>' + l + '</p>';
            }).join('\n');
            return output;
        }
    }
})();
