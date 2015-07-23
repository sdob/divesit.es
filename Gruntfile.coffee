module.exports = (grunt) ->
  (require 'load-grunt-tasks') grunt

  ## Application paths
  appConfig =
    dist: 'dist'
    public: 'public'
    common: 'common'
    server: 'server'

  grunt.initConfig

    cfg: appConfig


    buildcontrol:
      options:
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
        commit: true
        push: true
      heroku:
        options:
          remote: 'https://git.heroku.com/quiet-garden-6841.git'
          remoteBranch: 'master'
      openshift:
        options:
          remote: 'https://divesites-sdob.rhcloud.com/~/git/divesites.git/'
          remoteBranch: 'master'

    # Check JS style
    jshint:
      all:
        src: [
          'server/**/*.js'
          'common/**/*.js'
          'public/scripts/**/*.js'
        ]
      options:
        jshintrc: ".jshintrc"


    # Compile LESS to CSS
    less:
      "public/styles/style.css": "public/less/style.less"


    # Karma (Jasmine) tests for the Angular front-end
    karma:
      unit:
        configFile: 'karma.conf.js'
        singleRun: true
  

    # Mocha tests for the back-end
    mochaTest:
      test:
        options:
          require: 'coffee-script/register'
          clearRequireCache: true
          timeout: 5000
        src: ['test/mocha/**/*.coffee']


    # Mocha test + coverage
    mocha_istanbul:
      coverage:
        src: 'test/mocha'


    # Watch files for changes and run tasks
    watch:
      # watch for LESS changes and compile
      styles:
        files: ['public/less/*.less']
        tasks: ['less']
      # Run the front-end (and only the front-end) tests automatically
      karma:
        files: ['public/**/*.js', 'test/jasmine/**/*.coffee']
        tasks: ['js', 'karma']


    # Empty the dist/ folder to start fresh
    clean:
      dist:
        files: [{
          dot: true
          src: [
            '<%= cfg.dist %>/{,*/}*'
            '!<%= cfg.dist %>/.git{,*/}*'
          ]
        }]


    # Look for usemin blocks
    useminPrepare:
      html: '<%= cfg.public %>/index.html'
      options:
        dest: '<%= cfg.dist %>/<%= cfg.public %>'
        flow:
          html:
            steps:
              js: ['concat', 'uglifyjs']
              css: ['cssmin']
            post: {}


    # usemin
    usemin:
      html: ['<%= cfg.dist %>/{,*/}*.html']
      css: ['<%= cfg.dist %>/styles/{,*/}*.css']


    # Try to make the Angular code for minification
    # by using long-form dependency injection
    ngAnnotate:
      dist:
        files: [{
          expand: true
          cwd: '.tmp/concat/scripts'
          src: ['*.js']
          dest: '.tmp/concat/scripts'
        }]


    # Copy files over to the dist/ directory
    copy:
      options:
        mode: true
      dist:
        files: [
          '<%= cfg.dist %>/package.json': 'package.json'
          '<%= cfg.dist %>/bower.json': 'bower.json'
          '<%= cfg.dist %>/regenerate-lbServices.sh': 'regenerate-lbServices.sh'
          {
            expand: true
            dot: true
            cwd: '<%= cfg.public %>'
            dest: '<%= cfg.dist %>/<%= cfg.public %>'
            src: [
              '*.html'
              'views/{,*/}*.html'
              'template/{,*/}*.html'
              'img/*'
            ]
          }
          {
            expand: true
            cwd: '<%= cfg.common %>'
            dest: '<%= cfg.dist %>/<%= cfg.common %>'
            src: [
              '**/*.js*'
            ]
          }
          {
            expand: true
            cwd: '<%= cfg.server %>'
            dest: '<%= cfg.dist %>/<%= cfg.server %>'
            src: ['**/*.js*']
          }
        ]
      styles:
        expand: true
        cwd: '<%= cfg.public %>/styles'
        dest: '.tmp/styles/'
        src: '{,*/}*.css'


    # Minify HTML
    htmlmin:
      dist:
        options:
          collapseWhitespace: true
          conservativeCollapse: true
          collapseBooleanAttributes: true
          removeCommentsFromCDATA: true
          removeOptionalTags: true
        files: [{
          expand: true
          cwd: '<%= cfg.dist %>/<%= cfg.public %>'
          src: ['index.html'] # holy shit, htmlmin is slow
          dest: '<%= cfg.dist %>/<%= cfg.public %>'
        }]


  grunt.loadNpmTasks 'grunt-env'
  grunt.registerTask 'js', ['jshint:all']
  grunt.registerTask 'build', [
    'less'
    'clean:dist'
    'useminPrepare'
    'copy:styles'
    'concat'
    'ngAnnotate:dist'
    'copy:dist'
    'cssmin'
    'uglify'
    'usemin'
    'htmlmin'
  ]
  grunt.registerTask 'test', [
    #'mochaTest'
    'karma'
    'mocha_istanbul:coverage'
  ]
  grunt.registerTask 'default', [
    'test'
    'build'
  ]
