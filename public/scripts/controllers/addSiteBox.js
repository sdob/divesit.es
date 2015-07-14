angular.module('divesitesApp')
.controller('AddSiteBoxController', function ($rootScope, $scope, cfg, localStorageService, uploadUtilities, Divesite, FileUploader, LoopBackAuth) {

  function cancel(e) {
    // FIXME: I've dummied out the confirm for development
    if (true || confirm('Are you sure you want to cancel adding this site?')) {
      $rootScope.$broadcast('event:adding-finished', null);
    }
  }

  function mapIdle(map) {
    // FIXME: this probably shouldn't run *every* time the map idles, but it appears
    // to fix the stupid angular-google-maps bug.
    if (google) {
      google.maps.event.trigger(map, 'resize');
    }
    if (!$scope.addSite.rendered) {
      $scope.$apply(function () {
        $('<div/>').addClass('centreMarker').appendTo(map.getDiv());
        console.info('unrendered');
        $scope.addSite.rendered = true;
        $scope.addSite.map.zoom = localStorageService.get('map.zoom');
      });
    }
  }

  function save() {
    console.info('data to save:');
    console.info($scope.addSite.site);
    // Save the new site
    if (false) Divesite.create($scope.addSite.site)
      .$promise
    .then(
      function createSuccess(res) {
        console.info("Saved the site.");
        $timeout(function () {
          $rootScope.$broadcast('event:new-site-created', res);
          $rootScope.$broadcast('event:adding-finished', $scope.addSite.site);
        });
      },
      function createError(res) {
        console.error("Failed to save the new site.");
      }
    );
  }

  function upload() {
    console.log('uploada');
  }

  function validateEntry() {
    // One of either 'boat' or 'shore' must be checked
    return !($scope.addSite.site.boatEntry || $scope.addSite.site.shoreEntry);
  }

  function validateExperienceLevel() {
    // One of the experience level options must be checked
    return $scope.addSite.minimumLevel === undefined;
  }

  function validateDepth() {
    return !(Number($scope.addSite.depth) >= 0 && Number($scope.addSite.depth) <= 100);
  }

  $scope.$on('event:adding-started', function () {
    //$scope.initialize();
    //$scope.addSite.rendered = false;
    $('#addSite-name-container').removeClass('is-invalid');
    console.log($('#addSite-name-container'));
  });

  $scope.initialize = function () {
    console.log('Initializing AddSiteBoxController');
    $scope.addSite = {
      cancel: cancel,
      map: {
        center: {
          latitude: localStorageService.get('map.center.latitude'),
          longitude: localStorageService.get('map.center.longitude')
        },
        events: {
          idle: mapIdle
        },
        zoom: localStorageService.get('map.center.longitude')
      },
      rendered: false,
      save: save,
      site: {
        boatEntry: false,
        shoreEntry: false
      },
      upload: upload,
      uploader: new FileUploader({
        scope: $scope,
        url: cfg.S3_BUCKET_URL,
        headers: {
          'Authorization': LoopBackAuth.accessTokenId
        },
        queueLimit: 1,
        onAfterAddingFile: function (item) {
          item.file.name = uploadUtilities.randomFilename(item);
          console.info('new filename: ' + item.file.name);
        }
      }),
      validateEntry: validateEntry,
      validateExperienceLevel: validateExperienceLevel,
      validateDepth: validateDepth
    };

    console.info($scope.addSite.map.center);

    /* Remove the 'is-invalid' classes from the form elements */
    $('#addSite-name-container').removeClass('is-invalid');

  }
  $scope.initialize();
});
