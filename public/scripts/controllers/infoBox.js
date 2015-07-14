'use strict';

angular.module('divesitesApp').
  controller('InfoBoxController', function ($scope, $rootScope, LoopBackAuth, $modal) {

  function dismiss() {
    // Ask MainController to hide the infobox
    $rootScope.$broadcast('event:info-box-dismissed');
  }

  $scope.summonEditBox = function () {
    // Send out a start-editing event
    $rootScope.$broadcast('event:edit-box-summoned', $scope.site);
  };

  $scope.isOwner = function () {
    return $scope.isAuthenticated() && LoopBackAuth.currentUserId == $scope.site.userId;
  };

  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  $scope.events = {
    // Handle a newly-logged dive
    diveCreated: function (event, data) {
      console.log($scope.site.id);
      if ($scope.site && data.siteId === $scope.site.id) {
        // The dive has been logged for the site that the info box is
        // currently showing. This should *usually* be the case, since
        // the link to log a dive comes from the info box.
        // 
        // TODO: re-load the dive site info

      }
    },
    markerClicked: function (event, data) {
      if (!!$scope.site) {
        $scope.site.imgSrc = null;
      }
    },
    siteDeleted: function (event, data) {
      // After the user deletes a divesite, hide the info box
      $scope.dismissInfoBox();
    },
    siteLoaded: function (event, data) {
      // Only handle the infobox's responsiblities here. Visibility
      // is controlled by MainController.
      $scope.site = data;
      if ($scope.site.dives !== undefined) {
        var numDives = $scope.site.dives.length;
        $scope.site.numDivesString = numDives + " dive" + (numDives === 1 ? "" : "s");
      }
    }
  };

  $scope.initialize = function () {
    $scope.infoBox = {
      dismiss: dismiss
    };
    $scope.site = {};
    // Listen for events
    $scope.$on('event:site-loaded', $scope.events.siteLoaded);
    $scope.$on('event:site-deleted', $scope.events.siteDeleted);
    $scope.$on('event:marker-clicked', $scope.events.markerClicked);
    $scope.$on('event:dive-created', $scope.events.diveCreated);
  };

  $scope.initialize();

});
