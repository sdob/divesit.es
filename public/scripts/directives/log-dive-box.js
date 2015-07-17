'use strict';

angular.module('divesitesApp').directive('logDiveBox', function () {
  return {
    templateUrl: 'views/partials/log-dive-box.html',
    restrict: 'E',
    controller: 'LogDiveBoxController',
    link: function (scope, elem, attrs, ctrl) {
      console.log("Cloning LogDiveBoxController");
      angular.element(elem).ready(function () {
        // We need to hack the time picker a bit to make it nice and Materially

        // Handle timepicker up/down buttons
        $('#logDive-timepicker-container .glyphicon.glyphicon-chevron-up').addClass('material-icons').html('expand_less');
        $('#logDive-timepicker-container .glyphicon.glyphicon-chevron-down').addClass('material-icons').html('expand_more');
        $('#logDive-timepicker-container .glyphicon-chevron-up, .glyphicon-chevron-down').parent().addClass('mdl-button mdl-js-button mdl-button--icon');

        // Handle timepicker textfields
        //$('[ng-model=hours]').addClass('mdl-textfield mdl-js-textfield');
        // Now let MDL get funky
        componentHandler.upgradeAllRegistered();
      });
    }
  }
});
