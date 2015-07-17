'use strict';

angular.module('divesitesApp').
  controller('InfoBoxController', function InfoBoxController($scope, $rootScope, LoopBackAuth, User) {

  function dismiss() {
    // Ask MainController to hide the infobox
    $rootScope.$broadcast('event:info-box-dismissed');
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
    $scope.site = data;
    console.info("InfoBoxController.onSiteLoaded");
    console.info($scope.site);
    if ($scope.site.dives !== undefined) {
      var numDives = $scope.site.dives.length;
      $scope.site.numDivesString = numDives + " dive" + (numDives === 1 ? "" : "s");
    }
  }

  function summonEditBox() {
    $rootScope.$broadcast('event:edit-box-summoned', $scope.site);
  }

  $scope.initialize = function initializeInfoBox() {
    $scope.events = {
      // Handle a newly-logged dive
      diveCreated: onDiveCreated,
      markerClicked: onMarkerClicked,
      siteDeleted: onSiteDeleted,
      siteLoaded: onSiteLoaded
    };
    $scope.infoBox = {
      dismiss: dismiss
    };
    $scope.isAuthenticated = isAuthenticated
    $scope.isOwner = isOwner;
    $scope.site = {};
    $scope.summonEditBox = summonEditBox;

    // Listen for events
    $scope.$on('event:site-loaded', $scope.events.siteLoaded);
    $scope.$on('event:site-deleted', $scope.events.siteDeleted);
    $scope.$on('event:marker-clicked', $scope.events.markerClicked);
    $scope.$on('event:dive-created', $scope.events.diveCreated);
  };

  $scope.initialize();

});
