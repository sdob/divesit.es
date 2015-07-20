'use strict';

angular.module('divesitesApp')
.controller('FilterMenuController', function ($auth, $location, $rootScope, $scope, localStorageService, filterPreferenceRetrievalService, LoopBackAuth, User) {

  var MAX_DEPTH = 100;

  function isAuthenticated() {
    // Check whether the user is logged in
    return User.isAuthenticated();
  }

  function retrieveFilterPreferences() {
    console.info('FilterMenuController.retrieveFilterPreferences()');
    // Pull stored preferences from local storage, or use a default
    // (defaults and the retrieval methods are declared in filterPreferenceRetrievalService)
    // Explicitly check each key.
    var lsKeys = localStorageService.keys();
    $scope.filterPreferences.boatEntry = filterPreferenceRetrievalService.boatEntry();
    // Shore entry
    $scope.filterPreferences.shoreEntry = filterPreferenceRetrievalService.shoreEntry(lsKeys);
    // Depth range
    $scope.filterPreferences.depthRange = filterPreferenceRetrievalService.depthRange(lsKeys);
    // Minimum level
    $scope.filterPreferences.maximumLevel = filterPreferenceRetrievalService.maximumLevel(lsKeys);
    console.info($scope.filterPreferences);
  }

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

  function storeFilterPreferences() {
    // Store all set preferences in local storage
    localStorageService.set('filterPreferences.boatEntry', $scope.filterPreferences.boatEntry);
    localStorageService.set('filterPreferences.shoreEntry', $scope.filterPreferences.shoreEntry);
    localStorageService.set('filterPreferences.depthRange', $scope.filterPreferences.depthRange);
    localStorageService.set('filterPreferences.maximumLevel', $scope.filterPreferences.maximumLevel);
  }

  function updateAndSendFilterPreferences() {
    // Store filter preferences and broadcast an event containing the data
    // (to be picked up on by MapController)
    $scope.storeFilterPreferences();
    $rootScope.$broadcast('event:filter-preferences', $scope.filterPreferences);
  }

  function toggleMenu() {
    var menuBody = angular.element('.filter-menu-body')[0];
    //console.info(menuBody);
    $('.filter-menu').toggleClass('collapsed');
  }


  /////////////////////////////////////////////////////////////////////////////
  // Event listeners
  /////////////////////////////////////////////////////////////////////////////


  // Initialization
  /////////////////////////////////////////////////////////////////////////////

  console.info('FilterMenuController.initialize()');
  $scope.filterPreferences = {};
  $scope.isAuthenticated = isAuthenticated;
  $scope.retrieveFilterPreferences = retrieveFilterPreferences;
  $scope.signIn = signIn;
  $scope.signOut = signOut;
  $scope.storeFilterPreferences = storeFilterPreferences;
  $scope.toggleMenu = toggleMenu;
  $scope.updateAndSendFilterPreferences = updateAndSendFilterPreferences;

  $scope.retrieveFilterPreferences();

  // Wait for divesites to load before retrieving filter preferences
  $scope.$on('event:divesites-loaded', $scope.updateAndSendFilterPreferences);
})
.directive('filterMenu', function () {
  return {
    templateUrl: 'views/partials/filter-menu.html',
    restrict: 'E',
    controller: 'FilterMenuController',
    link: function (scope, elem, attrs, ctrl) {
      angular.element(elem).ready(function () {
        // Let MDL get funky
        //componentHandler.upgradeAllRegistered();
      });
    }
  }
});
