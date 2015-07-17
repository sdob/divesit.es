'use strict';

angular.module('divesitesApp').controller('MainController', function ($scope, User) {

  function dismissInfoBox(e) {
    $scope.visibilityControl.infoBox = false;
  }

  function dismissSignInBox(e) {
    console.log('MainController::dismissSignInBox');
    $scope.visibilityControl.signInBox = false;
    $scope.visibilityControl.filterMenu = true;
  }

  function isAuthenticated() {
    return User.isAuthenticated();
  }

  function showInfoBox(e) {
    $scope.visibilityControl.editBox = false;
    $scope.visibilityControl.infoBox = true;
  }

  function showAddSiteBox(e, data) {
    $scope.visibilityControl.addSiteBox = true;
    $scope.visibilityControl.addSiteButton = false;
    $scope.visibilityControl.filterMenu = false;
    $scope.visibilityControl.infoBox = false;
  }

  function showEditBox(e, data) {
    console.info('MainController: summoning the edit box');
    console.log(data);
    $scope.site = data;
    $scope.visibilityControl.editBox = true;
    $scope.visibilityControl.infoBox = false;
  }

  function showSignInBox(e, data) {
    console.info('MainController::showSignInBox');
    $scope.visibilityControl.signInBox = true;
    $scope.visibilityControl.filterMenu = false;
  }

  // Set up the mutually exclusive visibilities for the various UI bits
  $scope.$on('event:adding-started', showAddSiteBox);

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

  $scope.$on('event:edit-box-dismissed', showInfoBox);
  $scope.$on('event:edit-box-summoned', showEditBox);
  $scope.$on('event:info-box-dismissed', dismissInfoBox);
  $scope.$on('event:sign-in-cancelled', dismissSignInBox);
  $scope.$on('event:sign-in-initiated', showSignInBox);
  $scope.$on('event:sign-in-successful', dismissSignInBox);

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
