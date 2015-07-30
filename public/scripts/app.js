(function () {
  'use strict';
  var app = angular.module('divesitesApp', [
    'ngResource',
    'ngRoute',
    'lbServices',
    'LocalStorageModule',
    'satellizer',
    'ui.bootstrap',
    'ui.router',
    'uiGmapgoogle-maps',
    'angularFileUpload'
  ])
  .config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {

    $urlRouterProvider.otherwise('/');
    $stateProvider
    // The main view state, showing the map, filter menu, and dismissible info box
    .state('main', {
      url: '/',
      views: {
        drawer: {
          templateUrl: 'views/partials/filter-menu.html',
          controller: 'FilterMenuController'
        },
        main: {
          templateUrl: 'views/map.html'
        }
      }
    })
    // The 'add a new site' view state
    .state('add', {
      url: '/add',
      views: {
        /*drawer: {
          templateUrl: 'views/add-menu.html'
        },*/
        main: {
          templateUrl: 'views/add-site.html',
          controller: 'AddSiteBoxController'
        }
      }
    });

    uiGmapGoogleMapApiProvider.configure({
      //    key: 'your api key',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    });

  })
  .constant('cfg', {
    S3_BUCKET_URL: '/api/Containers/sdob-bukkit/upload'
  })
  .config(['satellizer.config', '$authProvider', function (config, $authProvider) {
    config.authHeader = 'Satellizer';
    config.httpInterceptor = false;
    $authProvider.facebook({
      clientId: '1542355859342321'
    });
    $authProvider.google({
      clientId: '930190391486-hd4l5c4uatuur1kf4foa43noibtm9r02.apps.googleusercontent.com',
      scope: ['https://www.googleapis.com/auth/plus.login', 'email']
    });
  }]);
}());
