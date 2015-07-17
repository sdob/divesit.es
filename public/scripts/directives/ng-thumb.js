'use strict';

angular.module('divesitesApp').directive('ngThumb', ['$window', function ($window) {
  var helper = {
    support: !!($window.FileReader && $window.CanvasRenderingContext2D),
    isFile: function (item) {
      return angular.isObject(item) && item instanceof $window.File;
    },
    isImage: function (file) {
      var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }
  };
  return {
    restrict: 'A',
    template: '<canvas/>',
    link: function (scope, element, attributes) {
      if (!helper.support) {
        console.error('not supported');
        return;
      }
      console.info('uploading');

      var params = scope.$eval(attributes.ngThumb);

      console.info('params.file:');
      console.info(params.file);

      if (!helper.isFile(params.file)) {
        console.error('not a file');
        return;
      }
      console.info('identified a file');

      if (!helper.isImage(params.file)) {
        console.error('not an image');
        return;
      }
      console.info('identified an image');

      var canvas = element.find('canvas');
      var reader = new FileReader();
      reader.onload = onLoadFile;
      reader.readAsDataURL(params.file);

      //console.log(canvas.parent().width());

      function onLoadFile(event) {
        console.log("onLoadFile");
        var img = new Image();
        img.onload = onLoadImage;
        img.src = event.target.result;
      }

      function onLoadImage() {
        /* jshint validthis:true */
        console.log("onLoadImage");
        //var width = params.width || this.width / this.height * params.height;
        var width = canvas.parent().width();
        //var height = params.height || this.height / this.width * params.width;
        var height = this.height / this.width * width;
        canvas.attr({width: width, height: height});
        canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
        $('.thumbnail-container').css({'height': height});
      }
    }
  };
}]);
