'use strict';

angular.module('divesitesApp').directive('infoBox', function () {
  return {
    templateUrl: 'views/partials/info-box.html',
    restrict: 'E',
    controller: 'InfoBoxController',
    link: function (scope, elem, attrs, ctrl) {
      angular.element(elem).ready(function () {
        // Let MDL get funky
        componentHandler.upgradeAllRegistered();
      });
    }
  }
});

