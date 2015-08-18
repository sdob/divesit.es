(function () {
  'use strict';
  angular.module('divesitesApp').directive('materialComponent', function () {
    return {
      restrict: 'A',
      link: function () {
        // apply MDL behaviour
        componentHandler.upgradeAllRegistered();
      }
    };
  });
})();
