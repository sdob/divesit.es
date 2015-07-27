(function () {
'use strict';
angular.module('divesitesApp')
.controller('AuthController', function ($auth, $location, $modal, $scope, LoopBackAuth, User) {
  console.info('AuthController initializing');
  console.info(localStorage);
  var modalInstance;
  $scope.authenticate = function (provider) {
    console.info('AuthController.authenticate(\'' + provider + '\')');
    // TODO: change the modal's appearance to show the user that we're
    // logging them in
    $auth
    .authenticate(provider)
    .then(function authenticateSuccess(response) {
      var accessToken = response.data;
      LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
      LoopBackAuth.rememberMe = true;
      LoopBackAuth.save();
      // Close the modal instance
      modalInstance.close();
      return response.resource;
    })
    .catch(function authenticateError(response) {
      // TODO: change the modal's appearance to show that there's been an
      // error
    });
  };

  $scope.isAuthenticated = function () {
    // Just expose this method to the scope
    return User.isAuthenticated();
  }

  $scope.signOut = function () {
    // Tell the server that we're logging the user out
    console.info('AuthController.signOut()');
    User
    .logout()
    .$promise
    .then(function signOutSuccess(res) {
      // Everything is OK with the backend; clear the client's user data
      console.info('signOutSuccess');
      LoopBackAuth.clearUser();
      LoopBackAuth.save();
      $location.path('/');
    })
    .catch(function signOutError(res) {
      // There's been a problem on the backend, so just nuke the user
      // data stored on the client
      console.error('signOutError:');
      console.error(res);
      LoopBackAuth.clearUser();
      LoopBackAuth.save();
      // FIXME: don't nuke everything --- just the LoopBack auth stuff
      //localStorageService.clearAll();
      //localStorageService.remove('satellizer_token');
      localStorage.clear();
      $location.path('/');
    });
  }

  $scope.summonAuthenticationDialog = function () {
    // Bring up the authentication modal
    console.info('AuthController.summonAuthenticationDialog()');
    modalInstance = $modal.open({
      templateUrl: '/views/partials/authentication-dialog.html',
      scope: $scope,
      size: 'sm'
    });
  };
})
}());
