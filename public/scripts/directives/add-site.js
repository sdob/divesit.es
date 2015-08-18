(function () {
  'use strict';
  angular.module('divesitesApp').directive('addSite', function () {
    return {
      restrict: 'A',
      link: function (scope) {
        console.info('add-site link()');
        componentHandler.upgradeAllRegistered();
        document.querySelector('#add-site-depth-slider').MaterialSlider.change(scope.site.depth);
      }
    };
  });
})();
