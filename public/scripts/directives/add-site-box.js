'use strict';

angular.module('divesitesApp').directive('addSiteBox', function () {
  return {
    templateUrl: 'views/partials/site-box.html',
    restrict: 'E',
    controller: 'AddSiteBoxController',
    link: function (scope, elem, attrs, ctrl) {
      console.log("Cloning EditBoxController");
      angular.element(elem).ready(function () {
        // Hacky way to set the initial 'checked' value on the checkboxes before
        // MDL has its wicked way with them
        $('#boat-entry').prop('checked', scope.site.boatEntry);
        $('#shore-entry').prop('checked', scope.site.shoreEntry);
        // Do the same with the minimumLevel radio button
        console.log($('#site-experience-' + scope.site.minimumLevel));
        $('#site-experience-' + scope.site.minimumLevel).prop('checked', true);
        // Now let MDL get funky
        componentHandler.upgradeAllRegistered();
      });
    }
  };
});
