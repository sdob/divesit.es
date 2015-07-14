'use strict';

angular.module('divesitesApp').directive('addSiteBox', function () {
  return {
    templateUrl: 'views/partials/site-box.html',
    restrict: 'E',
    controller: 'AddSiteBoxController'
  };
});
