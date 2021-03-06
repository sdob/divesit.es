(function () {
'use strict';

angular.module('divesitesApp').controller('MapController', function ($document, $scope, $rootScope, localStorageService, $http, uiGmapIsReady, Divesite, $modal) {


  /////////////////////////////////////////////////////////////////////////////
  // Constants
  /////////////////////////////////////////////////////////////////////////////

  var MIN_ZOOM = 3;
  var MAX_ZOOM = 14;

  var rendered = false;

  /////////////////////////////////////////////////////////////////////////////
  // Function defs
  /////////////////////////////////////////////////////////////////////////////

  function dismissInfoCard() {
    $scope.infoCardIsVisible = false;
  }

  function mapIdleEventHandler(map) {
    // On idle, put recent map view settings into local storage
    $scope.$apply(function () {
      localStorageService.set('map.zoom', map.zoom);
      localStorageService.set('map.center.latitude', map.center.lat());
      localStorageService.set('map.center.longitude', map.center.lng());
    });
    // FIXME: Find somewhere better to put this. Currently it fires on *every*
    // idle event, which is not what we want --- it's got to be terrible for
    // performance.
    // TODO: Run this when the DOM is ready
    //google.maps.event.trigger(map, 'resize');
    $scope.map.center = {
      latitude: localStorageService.get('map.center.latitude') || 53.5,
      longitude: localStorageService.get('map.center.longitude') || -8
    };
    //}
  }

  function mapZoomChangedEventHandler(map) {
    // Constrain the zoom level
    if (map.zoom < MIN_ZOOM) {
      map.setZoom(MIN_ZOOM);
    }
  }

  function centerChangedEventHandler(map) {
    var data = {center: {latitude: map.getCenter().lat(), longitude: map.getCenter().lng()}, zoom: map.getZoom()};
    $rootScope.$broadcast('event:center_changed', data);
  }

  function markerClickEventHandler(marker, event, model, args) {
    console.info('MapController.markerClickEventHandler()');
    //$rootScope.$broadcast("event:marker-clicked");
    var id = model.id;
    Divesite.findById(
      {id: id},
      function findSuccess(site) {
        site.imgSrc = undefined;
        if (site.images && site.images[0]) {
          site.imgSrc = site.images[0].url;
        }
        console.info('imgSrc: ' + site.imgSrc);
        // Put the site data into scope
        $scope.site = site;
        // Reveal the info card if it was previously hidden
        $scope.infoCardIsVisible = true;
      },
      function findError(error) {
      });
  }

  $scope.uiGmapIsReady = function (maps) {
    $scope.map.events.idle = mapIdleEventHandler;
    maps.forEach(function (inst) {
      //google.maps.event.trigger(inst.map, 'resize');
    });
    $rootScope.$broadcast('event:map-is-ready');
    console.info('MapController.uiGmapIsReady()');
  };

  $scope.checkMinimumLevel = function (marker, data) {
    return marker.minimumLevel <= data.maximumLevel;
  };

  $scope.checkEntryTypes = function (m, data) {
    return (m.boatEntry && data.boatEntry) || (m.shoreEntry && data.shoreEntry);
  };

  function updateVisibilityOnFilter (marker) {
    var shouldBeVisible = Object.keys(marker.filterVisibility).every(function (x) {return marker.filterVisibility[x];});
    marker.options.visible = shouldBeVisible;
  }

  $scope.filterMarker = function (m, data) {
    function isWithinDepthRange (depth, range) {
      return depth >= range[0] && depth <= range[1];
    }
    m.filterVisibility.minimumLevel = $scope.checkMinimumLevel(m, data);
    m.filterVisibility.depthRange = isWithinDepthRange(m.depth, data.depthRange);
    m.filterVisibility.entryType = $scope.checkEntryTypes(m, data);
    updateVisibilityOnFilter(m);
  };

  $scope.filterPreferences = function (event, data) {
    $scope.map.markers.forEach(function (m) {$scope.filterMarker(m, data)});
  };

  $scope.onNewSiteCreated = function (event, data) {
    console.log("map controller received new site event");
    // Reload the list of divesites
    $scope.retrieveDivesites();
    // Summon the 'do you want to log a dive?' modal
    // Dummied out for the moment
    // $scope.summonLogDiveOfferModal();
  };

  $scope.summonLogDiveOfferModal = function () {
    $modal.open({
      templateUrl: 'views/partials/log-dive-offer-modal.html',
      controller: 'LogDiveOfferModalController',
      //backdrop: 'static',
      size: 'sm',
      scope: $scope
    });
  };

  $scope.retrieveDivesites = function () {
    Divesite.find(
      {},
      function (sites) {
        $scope.map.markers = sites.map(function (e) {
          return {
            id: e.id,
            title: e.name,
            loc: {
              latitude: e.loc.lat,
              longitude: e.loc.lng
            },
            depth: e.depth,
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
            boatEntry: e.boatEntry,
            shoreEntry: e.shoreEntry,
            minimumLevel: e.minimumLevel,
            description: e.description,
            options: { // Google Maps MarkerOptions
              visible: false // initially false, switched on when filtered
            },
            icon: '/img/ic_place_black_18dp.png', // Map icon URL
            filterVisibility: {
              entryType: false,
              depthRange: false,
              minimumLevel: false
            }
          }
        });
        $rootScope.$broadcast('event:divesites-loaded');
      },
      function (errorResponse) {
        console.log(errorResponse);
      }
    );
  };



  /////////////////////////////////////////////////////////////////////////////
  // Controller initialization
  /////////////////////////////////////////////////////////////////////////////

  console.info('MapController.initialize()');
  $scope.dismissInfoCard = dismissInfoCard;
  $scope.infoCardIsVisible = false;
  $scope.map = {
    events: {
      idle: mapIdleEventHandler,
      zoom_changed: mapZoomChangedEventHandler,
      center_changed: centerChangedEventHandler,
    },
    center: {
      latitude: localStorageService.get('map.center.latitude') || 53.5,
      longitude: localStorageService.get('map.center.longitude') || -8
    },
    zoom: localStorageService.get('map.zoom') || 7,
    markers: [],
    options: {
      scrollwheel: true,
      disableDefaultUI: true,
      mapTypeId: 'roadmap'
    },
    markerEvents: {
      click: markerClickEventHandler // fires on marker click
    },
    rendered: false
  };
  $scope.mapControl = {};
  $scope.markerControl = {};

  $scope.events = {
    filterPreferences: $scope.filterPreferences, // fires on 'event:filter-preferences'
    siteCreated: $scope.onNewSiteCreated,
    mapIsReady: $scope.retrieveDivesites, // fires on 'event:map-is-ready'
    siteEdited: $scope.retrieveDivesites,
    siteDeleted: $scope.retrieveDivesites
  };

  // Listen for filter events
  $scope.$on('event:filter-preferences', $scope.events.filterPreferences);
  // Listen for map-ready events (to load divesites)
  $scope.$on('event:map-is-ready', $scope.events.mapIsReady);
  // Listen for new-site-created events (coming from NewSiteModalController)
  $scope.$on('event:new-site-created', $scope.events.siteCreated);
  // Listen for edit events
  $scope.$on('event:site-edited', $scope.events.siteEdited);
  // Listen for deletion events
  $scope.$on('event:site-deleted', $scope.events.siteDeleted);

  uiGmapIsReady.promise().then($scope.uiGmapIsReady);

})}());
