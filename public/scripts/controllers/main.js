'use strict';

angular.module('divesitesApp').controller('MainController', function ($scope, User) {

  function isAuthenticated() {
    return User.isAuthenticated();
  }

  function showInfoBox(e) {
    $scope.visibilityControl.editBox = false;
    $scope.visibilityControl.infoBox = true;
  }

  function showEditBox(e, data) {
    console.info('MainController: summoning the edit box');
    console.log(data);
    $scope.site = data;
    $scope.visibilityControl.editBox = true;
    $scope.visibilityControl.infoBox = false;
  }

  // Set up the mutually exclusive visibilities for the various UI bits
  $scope.$on('event:adding-started', function () {
    // mutually exclusive visibilities
    $scope.visibilityControl.addSiteBox = true;
    $scope.visibilityControl.addSiteButton = false;
    $scope.visibilityControl.filterMenu = false;
  });

  $scope.$on('event:adding-finished', function (e) {
    console.log('MainController received: "' + e.name + '"');
    console.log(e);
    $scope.visibilityControl.addSiteBox = false;
    $scope.visibilityControl.addSiteButton = true;
    $scope.visibilityControl.filterMenu = true;
    console.log($scope.visibilityControl.addSiteBox);
  });

  $scope.$on('event:site-loaded', showInfoBox)

  $scope.$on('event:show-info-box', function (e) {
    $scope.visibilityControl.editBox = false;
    $scope.visibilityControl.infoBox = true;
  });

  $scope.$on('event:info-box-dismissed', function (e) {
    $scope.visibilityControl.infoBox = false;
  });

  $scope.$on('event:edit-box-dismissed', showInfoBox);
  $scope.$on('event:edit-box-summoned', showEditBox);

  $scope.initialize = function () {
    // Initial visibilities
    $scope.visibilityControl = {
      addSiteBox: false,
      addSiteButton: true,
      editBox: false,
      filterMenu: true,
      infoBox: false
    };
  }
  $scope.initialize();
});
