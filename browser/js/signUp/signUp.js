app.config(function ($stateProvider) {
    $stateProvider.state('signUp', {
        url: '/',
        templateUrl: 'js/signUp/signUp.html',
        controller: 'signUp'
    });
});

app.controller('signUp', function($scope, $state, $document, gameSetupFactory) {
  $document.ready(function() {
    if (localStorage.getItem('mindMeld') !== null) {
      gameSetupFactory.currentPlayer = JSON.parse(localStorage.getItem('mindMeld')).id;
      $state.go('gameRoom');
    }
  });


  $scope.isFormShowing = false;
  $scope.isSignedIn = false;
  $scope.showForm = function() {
    $scope.isFormShowing = true;
  }

  $scope.signUp = function() {
    gameSetupFactory.signUp($scope.signUpInfo).then(function(user) {
      localStorage.setItem('mindMeld', JSON.stringify({id: user._id, playerNum: 0}));
      gameSetupFactory.currentPlayer = localStorage.getItem('mindMeld').id;
    });
    $scope.isFormShowing = false;
    $scope.isSignedIn = true;
    console.log("GOING TO GAME ROOM NOW");
    $state.go('gameRoom');
  }
});



app.factory('gameSetupFactory', function($http) {
  var factory = {};

  factory.signUp = function(signUpInfo){
    return $http.post('/api/users', signUpInfo)
    .then(function(user) {
      return user.data;
    });
  }

  factory.joinGame = function(gameId) {
    return $http.put('/api/game/' + gameId, {player2: factory.currentPlayer})
    .then(function(game) {
      console.log(game,"PLAYER 2 JOINED : ", game);
      var localPlayerData = JSON.parse(localStorage.getItem('mindMeld'));
      localPlayerData.playerNum = 2;
      localStorage.setItem('mindMeld', JSON.stringify(localPlayerData));
      return game;
    })
  }

  factory.getOpenGames = function(){
    return $http.get('/api/game')
    .then(function(response) {
      var openGames = response.data.filter(function(game) {
        return game.isStarted === false;
      });
      return openGames;
    });
  }

  factory.createGame = function(player1Id) {
    return $http.post('/api/game', {player1: player1Id})
    .then(function(game) {
      console.log("FACTORY GAME: ", game.data);
      return game.data;
    });
  }

  return factory;

});

