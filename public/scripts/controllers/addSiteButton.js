angular.module('divesitesApp')
.controller('AddSiteButtonController', function ($scope, $rootScope, User) {
  $scope.summonAddSiteBox = function () {
    $rootScope.$broadcast('event:adding-started');
  };
  $scope.isAuthenticated = function () {
    return User.isAuthenticated();
  }
});
