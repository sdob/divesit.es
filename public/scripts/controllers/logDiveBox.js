angular.module('divesitesApp')
.controller('LogDiveBoxController', function LogDiveBoxController($rootScope, $scope) {
  function cancel() {
    $rootScope.$broadcast('event:logging-cancelled');
  }

  $scope.initialize = function initializeLogDiveBoxController() {
    $scope.cancel = cancel;
    $scope.dive = {};
    console.info('LogDiveBoxController: initializing');
  }
  $scope.initialize();
});
