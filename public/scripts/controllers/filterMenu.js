'use strict';

angular.module('divesitesApp')
.controller('FilterMenuController', function ($auth, $location, $rootScope, $scope, localStorageService, filterPreferenceRetrievalService, LoopBackAuth, User) {

  function signIn() {
    $rootScope.$broadcast('event:sign-in-initiated');
  }

  function signOut() {
    User
    .logout()
    .$promise
    .then(function signOutSuccess(res) {
      LoopBackAuth.clearUser();
      LoopBackAuth.save();
      $location.path('/');
    })
    .catch(function signOutError(res) {
      LoopBackAuth.clearUser();
      LoopBackAuth.save();
      localStorageService.clearAll(); // FIXME: Not sure about nuking everything
      $location.path('/');
    });
  }

  var MAX_DEPTH = 100;

  // Store info about the main map here
  $scope.map = {};
  $scope.eventHandlers = {
    centerChanged: function (e, data) {
      $scope.map = data;
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
  // (to be picked up on by MapController)
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
    // force MDL to upgrade the components
    //componentHandler.upgradeAllRegistered();
    console.info('filter preferences loaded:');
    console.info($scope.filterPreferences);
  };

  // Check whether the user is logged in
  $scope.isAuthenticated = function () {
    return User.isAuthenticated();
  };

  $scope.updateMdlSliders = function () {
    console.log('FilterMenuController::updateMdlSliders()');
    //console.log(MaterialSlider);
  };

  /////////////////////////////////////////////////////////////////////////////
  // Initialization
  /////////////////////////////////////////////////////////////////////////////

  $scope.initialize = function () {
    $scope.filterPreferences = {};
    $scope.signIn = signIn;
    $scope.signOut = signOut;
    $scope.retrieveFilterPreferences();
    //$scope.updateMdlSliders();
    // Wait for divesites to load before retrieving filter preferences
    $scope.$on('event:divesites-loaded', $scope.updateAndSendFilterPreferences);
    // Listen for changes to the main map's centre and store them
    $scope.$on('event:center_changed', $scope.eventHandlers.centerChanged);
  };

  $scope.initialize();
});
