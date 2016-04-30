app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'BoardController'
    });
});



app.controller('BoardController', function($scope, TurnFactory) {
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
    TurnFactory.getTags($scope.url)
    .then(function(response) {
      console.log(response.data.results[0].result.tag.classes,'***');
      $scope.tags = response.data.results[0].result.tag.classes;
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

  factory.getTags = function(url) {
    // $http({
    //   method: 'POST',
    //   url: 'https://api.clarifai.com/v1/tag/',
    //   headers: {Authorization: 'Bearer tQkyp8Viuk3tsALgWrbuUUC0TJ5bW8'},
    //   data: {url: url}
    // })
    return $http.post('https://api.clarifai.com/v1/tag/', {url: url}, {headers: {Authorization: 'Bearer tQkyp8Viuk3tsALgWrbuUUC0TJ5bW8'}})
    .then(function(response) {
      return response;
    });
  }
  return factory;
});

