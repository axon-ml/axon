(function () {
    'use strict';

    angular
        .module('axonApp')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$location', '$routeParams', 'dataService', '$http', 'axonUrls'];
    function ProfileController($location, $routeParams, dataService, $http, axonUrls) {
        var vm = this;
        vm.displayName = $routeParams.username;

        function rotateTileStyle(j, tile) {
            // Start: code derived from angularJS dynamic tiles template code
            switch(j+1) {
              case 1:
                tile.background = "red";
                tile.span.row = tile.span.col = 2;
                break;

              case 2: tile.background = "green";         break;
              case 3: tile.background = "darkBlue";      break;
              case 4:
                tile.background = "blue";
                tile.span.col = 2;
                break;

              case 5:
                tile.background = "yellow";
                tile.span.row = tile.span.col = 2;
                break;

              case 6: tile.background = "pink";          break;
              case 7: tile.background = "darkBlue";      break;
              case 8: tile.background = "purple";        break;
              case 9: tile.background = "deepBlue";      break;
              case 10: tile.background = "lightPurple";  break;
              case 11: tile.background = "yellow";       break;
            }
            // End
            return tile;
        }

        vm.viewModel = function(username, modelname) {
            $location.path('/' + username + '/' + modelname);
        };


        vm.tiles = (function(){
            var tile, results = [ ];

            $http.get(axonUrls.apiBaseUrl.concat('/data/models/all')).then(
                function(response) {
                    //resp = JSON.parse(JSON.stringify(response));
                    try {
                        for (var j=0; j<response.data.rowCount; j++) {

                            // Start: inspired by angularjs dynamic tiles
                            tile = {};
                            tile.modelname = response.data.rows[j].modelname;
                            tile.username = response.data.rows[j].username;
                            tile.fullname = response.data.rows[j].fullname;
                            tile.span  = { row : 1, col : 1 };
                            // End

                            tile = rotateTileStyle(j, tile);

                            results.push(tile);
                        }
                    } catch(err) { console.log('error parsing models'); }
                }, function(err) { console.log(err); });
            return results;
        })();
    }
})();
