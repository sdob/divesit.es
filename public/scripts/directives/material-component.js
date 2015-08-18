(function () {
  'use strict';
  angular.module('divesitesApp').directive('materialComponent', function () {
    return {
      restrict: 'A',
      link: function () {
        console.info('material-component.link()');
        // apply MDL behaviour
        componentHandler.upgradeAllRegistered();
      }
    };
  });
})();
