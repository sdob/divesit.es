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

  describe "$scope.initialize()", ->
    beforeEach ->
      spyOn $scope, '$on'
      $scope.initialize()
    it "listens for 'event:site-loaded' events", ->
      expect($scope.$on).toHaveBeenCalledWith 'event:site-loaded', $scope.events.siteLoaded
