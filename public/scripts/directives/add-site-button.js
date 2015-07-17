'use strict';

angular.module('divesitesApp').directive('addSiteButton', function () {
  return {
    templateUrl: 'views/partials/add-site-button.html',
    restrict: 'E',
    controller: 'AddSiteButtonController',
    link: function (scope, elem, attrs, ctrl) {
      angular.element(elem).ready(function () {
        // Let MDL get funky
        componentHandler.upgradeAllRegistered();
      });
    }
  }
});


