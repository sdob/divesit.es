describe "NewSiteModalController", ->
  beforeEach module "divesitesApp"
  $rootScope = {}
  $scope = {}
  $modalInstance = {}
  beforeEach inject (_$rootScope_, _$modalInstance_, $controller) ->
    $rootScope = _$rootScope_
    $scope = $rootScope.$new()
    $modalInstance = _$modalInstance_
    $controller = $controller 'NewSiteModalController', {
      $scope: $scope
      $rootScope: $rootScope
      $modalInstance: $modalInstance
    }
