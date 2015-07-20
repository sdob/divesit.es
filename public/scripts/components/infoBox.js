'use strict';

angular.module('divesitesApp').
  controller('InfoBoxController', function InfoBoxController($scope, $rootScope, LoopBackAuth, User) {


  function dismiss() {
    // Ask MainController to hide the infobox
    //$rootScope.$broadcast('event:info-box-dismissed');
    $scope.$parent.dismissInfoBox();
  }

  function isAuthenticated() {
    return User.isAuthenticated();
  }

  function isOwner() {
    return $scope.isAuthenticated() && LoopBackAuth.currentUserId == $scope.site.userId;
  }

  function onDiveCreated(event, data) {
    console.log($scope.site.id);
    if ($scope.site && data.siteId === $scope.site.id) {
      // The dive has been logged for the site that the info box is
      // currently showing. This should *usually* be the case, since
      // the link to log a dive comes from the info box.
      // 
      // TODO: re-load the dive site info
    }
  }

  function onMarkerClicked(event, data) {
    if (!!$scope.site) {
      $scope.site.imgSrc = null;
    }
  }

  function onSiteDeleted (event, data) {
    // After the user deletes a divesite, hide the info box
    $scope.dismissInfoBox();
  }

  function onSiteLoaded(event, data) {
    // Only handle the infobox's responsiblities here. Visibility
    // is controlled by MainController.
    //$scope.site = data;
    console.info("InfoBoxController.onSiteLoaded");
    console.info($scope.site);
    if ($scope.site.dives !== undefined) {
      var numDives = $scope.site.dives.length;
      $scope.site.numDivesString = numDives + " dive" + (numDives === 1 ? "" : "s");
    }
    if ($scope.site.imgSrc) {
      // We can't triply nest quotes in CSS/HTML so we need to build the CSS url() here
      $scope.site.background = 'url("' + $scope.site.imgSrc + '") center / cover';
      console.log($scope.site.background);
    }
    console.log($scope.site.imgSrc);
  }

  function summonEditBox() {
    console.info('InfoBoxController.summonEditBox()');
    //$rootScope.$broadcast('event:edit-box-summoned', $scope.site);
  }

  function summonLogDiveBox() {
    console.info('InfoBoxController.summonLogDiveBox()');
    $rootScope.$broadcast('event:log-dive-box-summoned');
  }

  /////////////////////////////////////////////////////////////////////////////
  // Initialization
  /////////////////////////////////////////////////////////////////////////////

  console.info('InfoBoxController:initializing');

  $scope.dismiss = dismiss;
  $scope.events = {
    // Handle a newly-logged dive
    diveCreated: onDiveCreated,
    markerClicked: onMarkerClicked,
    siteDeleted: onSiteDeleted,
    siteLoaded: onSiteLoaded
  };
  $scope.isAuthenticated = isAuthenticated
  $scope.isOwner = isOwner;
  $scope.summonEditBox = summonEditBox;
  $scope.summonLogDiveBox = summonLogDiveBox;

})
.directive('infoBox', function () {
  return {
    templateUrl: 'views/partials/info-box.html',
    restrict: 'E',
    controller: 'InfoBoxController',
    link: function (scope, elem, attrs, ctrl) {
      angular.element(elem).ready(function () {
        // Upgrade MDL components
        componentHandler.upgradeAllRegistered();
      });
    }
  }
});

