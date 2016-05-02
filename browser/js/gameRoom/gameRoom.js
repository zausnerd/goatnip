app.config(function ($stateProvider) {
    $stateProvider.state('gameRoom', {
        url: '/gameRoom',
        templateUrl: 'js/gameRoom/gameRoom.html',
        controller: 'gameRoom',
         resolve: {
            openGames: function(gameSetupFactory) {
                return gameSetupFactory.getOpenGames();
            }
        }
    });
});

app.controller('gameRoom', function($scope, $state, $document, gameSetupFactory, openGames) {
  $scope.openGames = openGames;
  $scope.joinGame = function(gameId) {
    gameSetupFactory.joinGame(gameId)
    .then(function(game) {
      $state.go('board', {gameId: gameId});
    });
  };

  $scope.createGame = function() {
    var localPlayerData = JSON.parse(localStorage.getItem('mindMeld'));
    var player1Id = localPlayerData.id;
    localPlayerData.playerNum = 1;
    localStorage.setItem('mindMeld', JSON.stringify(localPlayerData));
    gameSetupFactory.createGame(player1Id)
    .then(function(game) {
      $scope.openGames.push(game);
      $state.go('board', {gameId: game._id});
    });
  };

});



