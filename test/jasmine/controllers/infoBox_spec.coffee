describe "InfoBoxController", ->
  beforeEach module "divesitesApp"
  $rootScope = {}
  $scope = {}
  localStorageService = {}
  beforeEach inject (_$rootScope_, _localStorageService_, $controller) ->
    $rootScope = _$rootScope_
    $scope = $rootScope.$new()
    localStorageService = _localStorageService_
    spyOn $rootScope, '$broadcast'
      .and.callThrough()
    spyOn localStorageService, 'set'
      .and.callThrough()
    $controller = $controller 'InfoBoxController', {
      $scope: $scope
      $rootScope: $rootScope
      localStorageService: localStorageService
    }
