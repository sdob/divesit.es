angular.module('divesitesApp').directive('depth', function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      ctrl.$validators.depth = function (modelValue, viewValue) {
        var POSITIVE_REGEXP = /^[0-9]{1,2}(\.[0-9]+)?$/;
        if (POSITIVE_REGEXP.test(viewValue)) {
          // Match: valid
          return true;
        }
        // Otherwise, it's invalid
        return false;
      };
    }
  }
});
