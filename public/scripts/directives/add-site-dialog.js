(function () {
  'use strict';
  angular.module('divesitesApp').directive('addSiteDialog', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs, ctrl) {
        componentHandler.upgradeAllRegistered();
      }
    };
  });
})();
