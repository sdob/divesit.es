(function () {
  'use strict';

  angular.module('divesitesApp').
    controller('InfoCardController', function InfoCardController($modal, $scope, $rootScope, LoopBackAuth, User) {

    function dismiss() {
      // Ask MainController to hide the infobox
      //$rootScope.$broadcast('event:info-box-dismissed');
      // TODO: This seems like a terrible idea, frankly
      $scope.$parent.dismissInfoCard();
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
        // the link to log a dive comes from the info card.
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
      // Only handle the info card's responsiblities here. Visibility
      // is controlled by MainController.
      console.info("InfoCardController.onSiteLoaded");
      console.info($scope.site);
      if ($scope.site.dives !== undefined) {
        var numDives = $scope.site.dives.length;
        $scope.site.numDivesString = numDives + " dive" + (numDives === 1 ? "" : "s");
      }
      console.info($scope.site.imgSrc);
    }

    function summonLogDiveDialog() {
      console.info('InfoCardController.summonLogDiveDialog()');
      $modal.open({
        templateUrl: 'views/partials/log-dive-dialog.html',
        controller: 'LogDiveDialogController',
        scope: $scope, // inherit from this scope
        size: 'lg'
      });
      $rootScope.$broadcast('event:log-dive-box-summoned');
    }

    /////////////////////////////////////////////////////////////////////////////
    // Initialization
    /////////////////////////////////////////////////////////////////////////////


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

    $scope.isAuthenticated = isAuthenticated;
    console.info('InfoCardController:initializing');

  });
}());
