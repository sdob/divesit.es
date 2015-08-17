(function () {
  'use strict';
  angular.module('divesitesApp').directive('addSiteButton', function () {
    return {
      templateUrl: 'views/partials/add-site-button.html',
      restrict: 'E',
      controller: 'AddSiteButtonController',
      link: function (scope, elem, attrs, ctrl) {
        console.info('addSiteButton.link()');
        //angular.element(elem).ready(function () {
          // Add MDL behaviour to UI elements
          componentHandler.upgradeAllRegistered();
        //});
      }
    }
  });
})();
