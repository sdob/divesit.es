(function () {
  angular.module('divesitesApp')
  .controller('SignInBoxController', function SignInBoxController($auth, $rootScope, $scope, LoopBackAuth) {
    function authenticate(provider) {
      console.log('logging in with ' + provider);
      $auth
      .authenticate(provider)
      .then(function (response) {
        console.log(response);
        var accessToken = response.data;
        LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
        LoopBackAuth.rememberMe = true;
        LoopBackAuth.save();
        $rootScope.$broadcast('event:sign-in-successful');
        return response.resource;
      });
    }

    function cancel() {
      console.log('cancelling signIn');
      $rootScope.$broadcast('event:sign-in-cancelled');
    }


    $scope.initialize = function initializeSignInBoxController() {
      console.info('Initializing SignInBoxController');
      $scope.authenticate = authenticate;
      $scope.cancel = cancel;
    };
    $scope.initialize();
  })
  .directive('signInBox', function () {
    return {
      templateUrl: 'views/partials/sign-in-box.html',
      restrict: 'E',
      controller: 'SignInBoxController',
      link: function (scope, elem, attrs, ctrl) {
        console.info('Cloning signInBox');
        $('.modal').addClass('visible');
        componentHandler.upgradeAllRegistered();
      }
    };
  })
}());
