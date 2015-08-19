(function () {
  angular.module('divesitesApp').directive('infoBox', function () {
    return {
      templateUrl: 'views/partials/info-box.html',
      controller: 'InfoBoxController',
      controllerAs: 'ib',
      scope: true,
      link: function (scope) {
        console.info('infoBox.link()');
        //console.info(scope);
        //console.info(scope.$parent.site);
      }
    }
  });
})();
