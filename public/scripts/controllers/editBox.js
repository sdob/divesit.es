angular.module('divesitesApp').controller('EditBoxController', function EditBoxController($scope, $location, $auth, User, LoopBackAuth, Divesite, uiGmapIsReady, FileUploader, $rootScope, Container) {
  console.log('Initializing EditBoxController');
  console.log($scope.site);
  $scope.rendered = false;

  $scope.uploader = new FileUploader({
    scope: $scope,
    url: '/api/containers/container1/upload',
    headers: {
      'Authorization': LoopBackAuth.accessTokenId
    },
    queueLimit: 1,
    onAfterAddingFile: function (item) {
      item.file.name = uploadUtilities.randomFilename(item);
    }
  });

  $scope.submit = function () {
    $scope.site.loc = {
      lat: Number($scope.map.center.latitude),
      lng: Number($scope.map.center.longitude)
    };
    $scope.site
    .$save()
    .then(
      // Handle success
      function editSuccess(res) {
        // Close the box and broadcast a site-edited event
        $rootScope.$broadcast('event:site-edited', res);
      },
      // Handle failure
      function editError(res) {
        console.log("Failed to update the site");
      }
    )
  };

  function cancel() {
    $rootScope.$broadcast('event:edit-box-dismissed');
  }

  $scope.delete = function () {
    if (confirm("Are you sure you want to delete this site? This can't be undone.")) {
      // FIXME: What do we want to do with the orphaned DivesiteImages?
      // Convert them on the back-end to ordinary (unattached) Images?
      Divesite.deleteById({id: $scope.site.id})
      .$promise
      .then(function (res) {
        $rootScope.$broadcast('event:site-deleted', res);
      });
    }
  };

  $scope.events = {
    onEditBoxSummoned: function (e, data) {
      console.log('I strongly suspect I never fire');
      //$scope.site = data;
      if ($scope.site.images && $scope.site.images[0]) {
        // TODO: load the thumbnail, then let the user delete the image if they
        // want to and add a replacement
      }
    }
  };

  $scope.initialize = function () {
    $scope.$on('event:edit-box-summoned', $scope.events.onEditBoxSummoned);
    $scope.cancel = cancel;
    $scope.title = "Edit this site";
    $scope.map = {
      center: {
        latitude: $scope.site.loc.lat,
        longitude: $scope.site.loc.lng
      },
      zoom: 14,
      events: {
        idle: function (map) {
          $scope.$apply();
          if (!$scope.rendered) {
            $scope.rendered = true;
            google.maps.event.trigger(map, 'resize');
            $scope.map.center = {
              latitude: $scope.site.loc.lat,
              longitude: $scope.site.loc.lng
            };
            $scope.map.zoom = 14;
            $('<div/>').addClass('centreMarker').appendTo(map.getDiv());
          }
        }
      }
    };
  };
  $scope.initialize();
});