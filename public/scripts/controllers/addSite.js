(function () {
  'use strict';
  angular.module('divesitesApp')
  .controller('AddSiteController', function ($location, $rootScope, $scope, cfg, localStorageService, uploadUtilities, Divesite, FileUploader, LoopBackAuth) {

    function cancel(e) {
      // FIXME: I've dummied out the confirm for development
      if (true || confirm('Are you sure you want to cancel adding this site?')) {
        $location.path('/');
      }
    }

    function cancelUpload() {
      console.info('cancelling file upload');
      $scope.uploader.queue[0].remove();
      $scope.siteHasImage = false;
    }

    function createUploader() {
      return new FileUploader({
        scope: $scope,
        url: cfg.S3_BUCKET_URL,
        headers: {
          'Authorization': LoopBackAuth.accessTokenId
        },
        queueLimit: 1,
        onAfterAddingFile: function (item) {
          item.file.name = uploadUtilities.randomFilename(item);
          console.info('new filename: ' + item.file.name);
          console.info(item.file);
          $scope.$apply(function () {
            $scope.siteHasImage = true;
          });
        },
        onCompleteAll: function () {
          // We only close the box when the file has uploaded successfully
          console.info("successfully uploaded file");
          $timeout(function () {
            $rootScope.$broadcast('event:new-site-created', res);
            $rootScope.$broadcast('event:adding-finished', $scope.site);
          }, 500);
        },
        onErrorItem: function (item, response, status, headers) {
          console.error('problem with upload:');
          console.error(item);
          console.error(response);
          console.error(status);
          console.error(headers);
        }
      });
    }

    function mapIdle(map) {
      // FIXME: this probably shouldn't run *every* time the map idles, but it appears
      // to fix the stupid angular-google-maps bug.
      /*
      if (google) {
        google.maps.event.trigger(map, 'resize');
      }
     */
      if (!$scope.rendered) {
        $scope.$apply(function () {
          $('<div/>').addClass('centre-marker').appendTo(map.getDiv());
          $scope.rendered = true;
          $scope.zoom = localStorageService.get('map.zoom');
        });
      }
    }

    function save() {
      console.info($scope.siteForm);
      // Re-format the loc property so that LoopBack will understand it to
      // be a geopoint
      $scope.site.loc = {
        lat: Number($scope.map.center.latitude),
        lng: Number($scope.map.center.longitude)
      };
      console.info('data to save:');
      console.info($scope.site);
      // Save the new site
      Divesite.create($scope.site)
      .$promise
      .then(
        function createSuccess(res) {
          console.info("Saved the site.");
          $rootScope.$broadcast('event:new-site-created', res);
          $rootScope.$broadcast('event:adding-finished', $scope.site);
          if ($scope.uploader.queue[0]) {
            console.info("Saving the image...");
            // Upload the image
            $scope.uploader.queue[0].headers.divesite = res.id;
            return $scope.uploader.queue[0].upload();
          }
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
      return !($scope.site.boatEntry || $scope.site.shoreEntry);
    }

    function validateExperienceLevel() {
      // One of the experience level options must be checked
      return $scope.site.minimumLevel === undefined;
    }

    function validateDepth() {
      return !(Number($scope.depth) >= 0 && Number($scope.depth) <= 100);
    }

    $scope.$on('event:adding-started', function () {
      //$('#addSite-name-container').removeClass('is-invalid');
      //console.log($('#addSite-name-container'));
    });

    $scope.initialize = function () {
      console.log('AddSiteController.initialize()');
      $scope.cancel = cancel;
      // In the new-site interface, removing the image cancels the upload
      $scope.removeImage = cancelUpload;
      $scope.map = {
        center: {
          latitude: localStorageService.get('map.center.latitude'),
          longitude: localStorageService.get('map.center.longitude')
        },
        events: {
          idle: mapIdle
        },
        zoom: localStorageService.get('map.zoom')
      };
      $scope.rendered = false;
      $scope.save = save;
      $scope.site = {
        boatEntry: false,
        shoreEntry: false,
        depth: 100
      };
      $scope.siteHasImage = false;
      $scope.title = 'Add a new site';
      $scope.uploader = createUploader();
      $scope.validateEntry = validateEntry;
      $scope.validateExperienceLevel = validateExperienceLevel;
      $scope.validateDepth = validateDepth;

      console.info($scope.uploader);

      /* Remove the 'is-invalid' classes from the form elements */
      //$('#addSite-name-container').removeClass('is-invalid');

    }
    $scope.initialize();
  })}());
