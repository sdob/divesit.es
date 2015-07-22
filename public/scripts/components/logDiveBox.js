(function () {
  angular.module('divesitesApp')
  .controller('LogDiveBoxController', function LogDiveBoxController($rootScope, $scope, Divesite) {

    function cancel() {
      $rootScope.$broadcast('event:logging-cancelled');
    }

    function onDateChange(event) {
      console.log('date change: ' + $scope.dive.date);
      if ($scope.dive.date === null || $scope.dive.date === undefined) {
        // I've made the date field uneditable so the user can't (under normal conditions) clear
        // the textfield with the keyboard, so we don't need to respect their wish to do so.
        // (This is probably bad for accessibility though.)
        console.info('null or undefined date');
        $scope.dive.date = $scope.oldDate;
      }
    }

    function onDatepickerInputFocus(event) {
      event.preventDefault();
      event.stopPropagation();
      console.info("onDatepickerInputFocus");
      console.info(event);
      event.target.blur();
      return openDatepicker(event);
    }

    function openDatepicker(event) {
      // Open the datepicker
      console.info('LogDiveBoxController.open()');
      // prevent default and stop propagation (otherwise it
      // won't summon the datepicker; no idea why atm)
      event.preventDefault();
      event.stopPropagation();
      $scope.datepicker.opened = true;
      // Store a reference to the old date in case the user cancels
      $scope.oldDate = $scope.dive.date;
    }

    function save() {
      // Combine the date and time fields into a single date value
      var data = JSON.parse(JSON.stringify($scope.dive));
      var date = moment(data.date);
      var time = moment(data.time);
      var combined = moment({
        y: date.year(),
        M: date.month(),
        d: date.date(),
        h: time.hour(),
        m: time.minute()
      });
      data.date = combined;
      // Now delete the 'time' property
      delete data.time;
      console.info('info to save:');
      console.info(data);
      $rootScope.$broadcast('event:dive-created', data);
      // Now submit
      if (true) {
        Divesite.dives
        .create({id: $scope.site.id}, data)
        .$promise
        .then(
          function createSuccess(res) {
            console.info("Created a dive!");
            console.info(res);
            $rootScope.$broadcast('event:dive-created', res);
          },
          function createError(err) {
            console.error('Failed to create a dive');
            console.error(err);
          }
        );
      }
    }

    $scope.initialize = function initializeLogDiveBoxController() {
      $scope.cancel = cancel;
      $scope.datepicker = {
        format: 'dd MMMM yyyy',
        maxDate: new Date(),
        onInputFocus: onDatepickerInputFocus,
        open: openDatepicker,
        opened: false,
        options: {
          formatDayTitle: 'EEEE dd MMMM yyyy' // so that we can split this again
        }
      };
      $scope.dive = {
        date: new Date(),
        time: new Date()
      };
      $scope.onDateChange = onDateChange;
      $scope.save = save;
      console.info('LogDiveBoxController: initializing');
      //console.info("datepicker.opened? " + $scope.datepicker.opened);
    }
    $scope.initialize();

  })
  .directive('logDiveBox', function LogDiveBoxDirective() {

    return {
      templateUrl: 'views/partials/log-dive-box.html',
      restrict: 'E',
      controller: 'LogDiveBoxController',
      link: function link(scope, elem, attrs, ctrl) {
        //console.log("Cloning LogDiveBoxController");
        angular.element(elem).ready(function () {

          // Materialize the datepicker

          // We need to hack the time picker a bit to make it nice and Materially

          var container = $('#logDive-datepicker-container');
          // Change the 'done' button to a Material icon button 
          //console.info(container.find('.btn-success'))//.removeClass('btn btn-sm btn-success pull-right')
          //.addClass('mdl-button mdl-js-button mdl-button--icon').html('<i class="material-icons">close</i>');

          //datePickerContainer.find('table 

          // Handle timepicker up/down buttons
          //$('#logDive-timepicker-container .glyphicon.glyphicon-chevron-up').addClass('material-icons').html('expand_less');
          //$('#logDive-timepicker-container .glyphicon.glyphicon-chevron-down').addClass('material-icons').html('expand_more');
          //$('#logDive-timepicker-container .glyphicon-chevron-up, .glyphicon-chevron-down').parent().addClass('mdl-button mdl-js-button mdl-button--icon');


          // Materialize timepicker input fields
          //['hours', 'minutes'].forEach (function (model) {
          //$('[ng-model="' + model + '"]').removeClass('form-control text-center').addClass('mdl-textfield mdl-js-textfield');
          //});
          //$('[ng-model="hours"], [ng-model="minutes"]').removeClass('form-control text-center').addClass('mdl-textfield mdl-js-textfield').css('text-align', 'center');

          // Handle timepicker textfields
          //$('[ng-model=hours]').addClass('mdl-textfield mdl-js-textfield');
          // Now let MDL get funky
          componentHandler.upgradeAllRegistered();
        });
      }
    }
  })
  .filter('extractFromTitleString', function () {
    return function (titleString, part) {
      var parts = titleString.split(' ');
      return parts[part];
    };
  })
}());
