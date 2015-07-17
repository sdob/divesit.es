'use strict';

angular.module('divesitesApp').directive('filterMenu', function () {
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
