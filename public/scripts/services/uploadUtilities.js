'use strict';

angular.module('divesitesApp').factory('uploadUtilities', function () {
  return {
    randomFilename: function (item) {
      var fileExtension = item.file.name.split('.').pop();
      return Math.random().toString(36).substring(7) +
        new Date().getTime() + '.' + fileExtension;
    }
  };
});
