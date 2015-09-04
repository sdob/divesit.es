(function () {
  angular.module('divesitesApp').directive('infoCard', function () {
    return {
      templateUrl: 'views/partials/info-card.html',
      controller: 'InfoCardController',
      controllerAs: 'ib',
      scope: true,
      link: function (scope) {
        console.info('infoCard.link()');
      }
    }
  });
})();
