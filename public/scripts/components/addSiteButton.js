(function () {
  'use strict';
  angular.module('divesitesApp')
  .controller('AddSiteButtonController', function ($location, $modal, $scope, $rootScope, User) {
    $scope.isAuthenticated = function () {
      return User.isAuthenticated();
    }
    $scope.summonAddSiteDialog = function () {
      /*
      console.info('AddSiteButtonController.summonAddSiteDialog()');
      //$rootScope.$broadcast('event:adding-started');
      $modal.open({
        templateUrl: 'views/partials/site-box.html',
        controller: 'AddSiteDialogController',
        scope: $scope, // inherit from this scope
        size: 'lg'
      });
     */
    $location.path('/add');
    };
  })
  }());
