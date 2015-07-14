'use strict';

angular.module('divesitesApp').directive('addSiteButton', function () {
  return {
    templateUrl: 'views/partials/add-site-button.html',
    restrict: 'E',
    controller: 'AddSiteButtonController'
  }
});


