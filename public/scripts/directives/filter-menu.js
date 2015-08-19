(function () {
  'use strict';
  angular.module('divesitesApp').directive('filterMenu', function () {
    return {
      templateUrl: 'views/partials/filter-menu.html',
      restrict: 'A',
      controller: 'FilterMenuController',
      link: function (scope, elem, attrs, ctrl) {
        console.info('filterMenu.link()');
        angular.element(elem).ready(function () {
          // Set the filter menu states before MDL handles them --- not sure if this
          // is possible through $scope.$apply.
          $('#filter-boat-entry').prop('checked', scope.filterPreferences.boatEntry);
          $('#filter-shore-entry').prop('checked', scope.filterPreferences.shoreEntry);
          $('#filter-experience-' + scope.filterPreferences.maximumLevel).prop('checked', true);
          // Apply MDL behaviours
          componentHandler.upgradeAllRegistered();
          // Put the slider in the correct position
          document.querySelector('#filter-maxDepth').MaterialSlider.change(scope.filterPreferences.depthRange[1]);
        });
      }
    }
  })
})();
