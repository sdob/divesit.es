angular.module('divesitesApp')
.controller('LogDiveOfferModalController', function ($scope, $modal, $modalInstance, $timeout) {
  $scope.nope = function () {
    console.log('nope');
    $modalInstance.close();
  };
  $scope.ok = function () {
    console.log('ok');
    $modalInstance.close();
    $timeout(function () {
      $modal.open({
        animation: false,
        templateUrl: 'views/partials/log-dive-modal.html',
        controller: 'LogDiveModalController',
        backdrop: 'static',
        size: 'lg',
        scope: $scope
      });
    }, 200);
  };
});
