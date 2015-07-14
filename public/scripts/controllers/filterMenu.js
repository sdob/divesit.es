'use strict';

angular.module('divesitesApp')
.controller('FilterMenuController', function ($scope, $rootScope, localStorageService, filterPreferenceRetrievalService, $auth, User, $modal) {

  var MAX_DEPTH = 100;

  $scope.hiddenBy = {
    addSite: false
  };
  $scope.checkVisibility = function () {
    return !$scope.hiddenBy.addSite;
  }

  // Store info about the main map here
  $scope.map = {};
  $scope.eventHandlers = {
    centerChanged: function (e, data) {
      $scope.map = data;
    },
    addingStarted: function (e, data) {
      $scope.hiddenBy.addSite = true;
      $scope.filterMenu.visible = $scope.checkVisibility();
    },
    addingFinished: function (e, data) {
      $scope.hiddenBy.addSite = false;
      $scope.filterMenu.visible = $scope.checkVisibility();
    }
  };

  // Store all set preferences in local storage
  $scope.storeFilterPreferences = function () {
    localStorageService.set('filterPreferences.boatEntry', $scope.filterPreferences.boatEntry);
    localStorageService.set('filterPreferences.shoreEntry', $scope.filterPreferences.shoreEntry);
    localStorageService.set('filterPreferences.depthRange', $scope.filterPreferences.depthRange);
    localStorageService.set('filterPreferences.maximumLevel', $scope.filterPreferences.maximumLevel);
  };

  // Store filter preferences and broadcast an event containing the data
  // (to be picked up on by the map controller)
  $scope.updateAndSendFilterPreferences = function () {
    $scope.storeFilterPreferences();
    $rootScope.$broadcast('event:filter-preferences', $scope.filterPreferences);
  };

  // Pull stored preferences from local storage, or use a default
  // (defaults and the retrieval methods are declared in filterPreferenceRetrievalService)
  // This fires on 'event:divesites-loaded'.
  $scope.retrieveFilterPreferences = function () { 
    // Retrieve filter preferences from local storage if they're there.
    // Explicitly check each key.
    var lsKeys = localStorageService.keys();
    $scope.filterPreferences.boatEntry = filterPreferenceRetrievalService.boatEntry();
    // Shore entry
    $scope.filterPreferences.shoreEntry = filterPreferenceRetrievalService.shoreEntry(lsKeys);
    // Depth range
    $scope.filterPreferences.depthRange = filterPreferenceRetrievalService.depthRange(lsKeys);
    // Minimum level
    $scope.filterPreferences.maximumLevel = filterPreferenceRetrievalService.maximumLevel(lsKeys);
  };

  // Check whether the user is logged in
  $scope.isAuthenticated = function () {
    return User.isAuthenticated();
  };

  $scope.summonNewSiteModal = function () {
    $modal.open({
      animation: false,
      templateUrl: 'views/partials/new-site-modal.html',
      controller: 'NewSiteModalController',
      backdrop: 'static',
      size: 'lg',
      scope: $scope
    });
  };

  // Slider options
  function prependSliderTrack(event, ui) {
    // Add a visible slider track. We can't do this in the markup
    // because ui-slider is creating the node for us
    $(event.target).prepend("<div class='ui-slider-track'></div>");
    $(event.target).prepend("<div class='ui-slider-track-on'></div>");
  }
  $scope.maximumLevelSlider = {
    create: prependSliderTrack,
    change: function (event, ui) {
      var width = $(event.target).children('.ui-slider-handle').css('left');
      $(event.target).children('.ui-slider-track-on').css({'width': width});
    }
  };
  $scope.depthRangeSlider = {
    range: true,
    create: prependSliderTrack
  }

  $scope.summonSignInModal = function () {
    $modal.open({
      animation: false,
      templateUrl: 'views/partials/sign-in-modal.html',
      controller: 'SignInModalCtrl',
      size: 'sm'
    });
  }
  /////////////////////////////////////////////////////////////////////////////
  // Initialization
  /////////////////////////////////////////////////////////////////////////////

  $scope.initialize = function () {
    $scope.filterMenu = {
      visible: $scope.checkVisibility()
    };
    $scope.filterPreferences = {};
    $scope.retrieveFilterPreferences();
    // Wait for divesites to load before retrieving filter preferences
    $scope.$on('event:divesites-loaded', $scope.updateAndSendFilterPreferences);
    // Listen for changes to the main map's centre and store them
    $scope.$on('event:center_changed', $scope.eventHandlers.centerChanged);
    // Listen for when the add-site box is summoned in order to hide the filter menu
    $scope.$on('event:adding-started', $scope.eventHandlers.addingStarted);
    // Do the same for when the add-site box is dismissed
    $scope.$on('event:adding-finished', $scope.eventHandlers.addingFinished);
  };

  $scope.initialize();
});
