app.config(function ($stateProvider) {
    $stateProvider.state('board', {
        url: '/board/:gameId',
        templateUrl: 'js/home/board.html',
        controller: 'BoardController',
        resolve: {
          gameId : function($stateParams) {
            return $stateParams.gameId;
          }
        }
    });
});



app.controller('BoardController', function($scope, TurnFactory, gameId, $interval,$http, $document) {

  $document.ready(function() {
    var localPlayerData = JSON.parse(localStorage.getItem('mindMeld'));
    $scope.playerNum = localPlayerData.playerNum;
    $scope.turns = 0;
    $scope.matchPercent = 0;
  });

  $scope.isPlayable = true;
  $scope.isWon = false;
  $scope.urlSubmit = function() {
    if (TurnFactory.isValidImageType($scope.url)) {
      $scope.leftImage = $scope.url;
      $scope.getTags();
    } else {
      alert("invalid image, try again");
        $scope.url = '';
    }
  }

  $scope.tags = 'No tags! use an image url to submit the image';
  $scope.leftImage = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
  $scope.getTags = function() {
    var localPlayerData = JSON.parse(localStorage.getItem('mindMeld'));
    TurnFactory.getTags($scope.url, gameId, localPlayerData.playerNum)
    .then(function(response) {
      console.log(response,'TAGS');
      $scope.tags = response;
      $scope.isPlayable = false;
      $interval(function() {
        $scope.canIPlay();
      },3000);
    })
  }



  $scope.canIPlay = function() {

    $http.get('/api/game/' + gameId)
    .then(function(game) {
      if (game.data.isPlayer1Turn && $scope.playerNum == 1) {
        $scope.isPlayable = true;
      }
      else if (!game.data.isPlayer1Turn && $scope.playerNum == 2) {
        $scope.isPlayable = true;
      }
      $scope.turns = game.data.turns;
      if (game.data.submissions % 2 === 0 && game.data.submissions !== 0) {
        $scope.matchPercent = game.data.turns[game.data.turns.length - 1];
        if ($scope.playerNum == 2) {
          $scope.rightImage = game.data.player1URL[game.data.player1URL.length - 1];
        } $scope.partnerTags = game.data.player1Tags[game.data.player1Tags.length - 1];
        if ($scope.playerNum == 1) {
          $scope.rightImage = game.data.player2URL[game.data.player2URL.length - 1];
          $scope.partnerTags = game.data.player2Tags[game.data.player2Tags.length - 1];
          console.log(partnerTags);
        }
      }
      if ($scope.matchPercent > 60) {
        $scope.isWon = true;
      }
      $scope.$evalAsync();
    });
  };

});

app.factory('TurnFactory', function($http, $log) {
  var factory = {};
  var approvedImageTypes = ['jpg', 'png', 'gif', 'svg', 'gifv', 'jpeg'];

  factory.isValidImageType = function(url) {
    if (approvedImageTypes.indexOf(url.slice(-3)) === -1) { return false; }
    return true;
  }

  factory.getTags = function(url, gameId, playerNum) {
    // $http({
    //   method: 'POST',
    //   url: 'https://api.clarifai.com/v1/tag/',
    //   headers: {Authorization: 'Bearer tQkyp8Viuk3tsALgWrbuUUC0TJ5bW8'},
    //   data: {url: url}
    // })
    //return $http.post('https://api.clarifai.com/v1/tag/', {url: url}, {headers: {Authorization: 'Bearer 8lRommUKT8s7NBDfylzR5PHestdCnG'}})
    var localPlayerData = JSON.parse(localStorage.getItem('mindMeld'));
    var request = {playerNum : localPlayerData.playerNum, url: url, playerId: localPlayerData.id};
    console.log("GET TAGS", gameId, request);
    return $http.post('/api/game/' + gameId,request)
    .then(function(response) {
      console.log("RESPONSE FROM CLARIFAI", response);
      return response.data;
    });
  }
  return factory;
});

