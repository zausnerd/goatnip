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



app.controller('BoardController', function($scope, TurnFactory, gameId) {
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
      $scope.tags = response;
    })
  }
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

