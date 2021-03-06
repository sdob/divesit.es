// Karma configuration
// Generated on Sun Mar 15 2015 17:31:07 GMT+0000 (GMT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    // We don't need requirejs, and it's been a world of hurt, so goodbye 
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      //'test-main.js',
      'public/libs/angular/angular.js',
      'public/libs/angular-mocks/angular-mocks.js',
      'public/libs/angular-route/angular-route.js',
      'public/libs/angular-resource/angular-resource.js',
      {pattern: 'public/libs/angular-google-maps/dist/*.js', included: true},
      'public/libs/angular-local-storage/dist/angular-local-storage.js',
      'public/libs/angular-ui-router/release/angular-ui-router.js',
      'public/libs/underscore/underscore.js',
      'public/libs/angular-bootstrap/ui-bootstrap-tpls.js',
      'public/libs/lb-ng/lb-services.js',
      'public/libs/satellizer/satellizer.js',
      'public/libs/angular-file-upload/dist/angular-file-upload.min.js',
      {pattern: 'public/scripts/**/*.js', included: true},
      {pattern: 'public/scripts/*.js', included: true},
      'test/jasmine/**/*.coffee'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // Exclude lb-services.js from coverage checking, since it doesn't belong to us
      "public/scripts/**/*.js": 'coverage',
      "**/*.coffee": "coffee"
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['coverage', 'spec'],

    coverageReporter: {
      type: 'lcovonly',
      subdir: 'jasmine'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: false,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
