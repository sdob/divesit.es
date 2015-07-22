(function () {
  'use strict';
  angular.module('divesitesApp')
  .controller('AddSiteButtonController', function ($scope, $rootScope, User) {
    $scope.summonAddSiteBox = function () {
      $rootScope.$broadcast('event:adding-started');
    };
    $scope.isAuthenticated = function () {
      return User.isAuthenticated();
    }
  })
  .directive('addSiteButton', function () {
    return {
      templateUrl: 'views/partials/add-site-button.html',
      restrict: 'E',
      controller: 'AddSiteButtonController',
      link: function (scope, elem, attrs, ctrl) {
        angular.element(elem).ready(function () {
          // Let MDL get funky
          componentHandler.upgradeAllRegistered();
        });
      }
    }
  })}());
