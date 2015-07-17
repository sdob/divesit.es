angular.module('divesitesApp')
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
});
