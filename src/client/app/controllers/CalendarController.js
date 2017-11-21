angular.module('CalendarController', ['ngCookies', 'angularMoment', 'ngMaterial', 'ngMessages', 'ui.timepicker'])
.config(($mdDateLocaleProvider) => {
    // Overwrites the default format with 'l' -> MM/DD/YYYY' flexible (month/day can have one digit)
    $mdDateLocaleProvider.parseDate = function(dateString) {
        let format = 'l';
        let m = moment(dateString, format, true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    }
})
.controller('CalendarController', CalendarController);

function CalendarController($scope, $cookies, $window, UserService, CalendarEventService, FriendService, $mdDialog, $mdToast) {

    $scope.$on('showEvent', function(ev, event) {
        console.log(event);

        //
        $scope.eventDetails(event);
    });

    // $scope.$on('showEvent', function(test, ))
    
    var masterEvent = [];
    var tempArray = [];
    var masterCalendar = [];
    var dateObject = {
      month: "month",
      day: 0,
      year: 2017
    }

    for ( i = 0; i < 42; ++i ) { // initialize all arrays for events
        let todos_i = '$scope.todos' + i;
        eval(todos_i + '= [];');
        
        tempArray.push([]);
        masterEvent.push(eval(todos_i));
    }
    console.log(tempArray);
    $scope.currMoment = moment(); // used to keep track of current month UI
    $scope.currentDate = moment(); // used to keep track of current date

    render(); // init render of current month

    function render() {

        for ( i = 0; i < 42; ++i ){ //clear tetmpArray
            while(tempArray[i].length > 0){
                tempArray[i].pop()
            }
        }

        $scope.monthName = $scope.currMoment.startOf("month").format('MMMM');
        $scope.yearDate = $scope.currMoment.format('YYYY');


        var lastMonth = $scope.currMoment.subtract(1,'months').endOf('month').format('DD');
        var nextMonth = $scope.currMoment.add(1,'months').endOf('month').format('DD');

        var firstDay = $scope.currMoment.startOf('month').day(); // Returns the first day of the month
        firstDay = parseInt(firstDay);
        var lastDay = $scope.currMoment.endOf('month').day(); // Returns the last day of the month
        lastDay = parseInt(lastDay);

        var numberOfDays = $scope.currMoment.daysInMonth(); // Returns number of days
        var i,tempFirstDay;
        var prevMonthDay = lastMonth - firstDay + 1;
        let token = $cookies.get('token');

       CalendarEventService.getEvents(token).then(function(res) {
        let dayCnt = 0;
        for (let i = 0; i < 42; i++) {
            let rowPosition = 'col' + i;
            $scope[rowPosition + 'IsNextMonth'] = false;
            $scope[rowPosition + 'IsPrevMonth'] = false;
            $scope[rowPosition + 'IsActiveDay'] = false;
        }
       for (i = 0; i < firstDay; i++) { //prev month
        var rowPosition = 'col' + i;
        $scope[rowPosition] = prevMonthDay;
        $scope[rowPosition + 'IsPrevMonth'] = true;
        let prevMonth = parseInt($scope.currMoment.format('M'));
        let prevYear = parseInt($scope.currMoment.format('Y'));
        if ( prevMonth == 1 ) { //if curr month is january
            prevMonth = 12;
            prevYear--;
        }
        else {
            prevMonth--;
        }

         for (j = 0; j < res.data.events.length; ++j) {//check if event is on that day

            let eventStart = moment(parseInt(res.data.events[j].startTime))
            let eventEnd = moment(parseInt(res.data.events[j].endTime))
            let tempCurrDay = moment(prevMonthDay + '/' + prevMonth + '/' + prevYear, "DD-MM-YYYY")

            if ( (eventStart <= tempCurrDay && eventEnd >= tempCurrDay) ||
                 ( eventStart.format('D') == tempCurrDay.format('D') &&
                     eventStart.format('M') == tempCurrDay.format('M') &&
                     eventStart.format('Y') == tempCurrDay.format('Y') ) ){

                // console.log(res.data.events[j].description);
                // console.log(moment(parseInt(res.data.events[j].startTime)).format("MMM Do YY"));
                // masterEvent[dayCnt].push(res.data.events[j])
                tempArray[dayCnt].push(res.data.events[j])
            }
         }
        prevMonthDay++;
        dayCnt++

        var dateObject = {
          month: "month",
          day: 0,
          year: 2017
        }
        dateObject.month = String(prevMonth);
        dateObject.day = String(prevMonthDay - 1);
        dateObject.year = String(prevYear);
        masterCalendar.push(dateObject);
       }
       tempFirstDay = firstDay;

       for (i = 1; i <= numberOfDays; i++) { //curr month
         rowPosition = "col" + tempFirstDay;
         tempFirstDay = tempFirstDay + 1;
         $scope[rowPosition] = i;
         if (i == $scope.currentDate.format('D') && $scope.currMoment.format("M")
                 == $scope.currentDate.format("M") &&
                 $scope.currMoment.format("YY") == $scope.currentDate.format("YY")) {
           $scope[rowPosition + 'IsActiveDay'] = true;
         }

        for (j = 0; j < res.data.events.length; ++j) {//check if event is on that day

            let eventStart = moment(parseInt(res.data.events[j].startTime))
            let eventEnd = moment(parseInt(res.data.events[j].endTime))
            let tempCurrDay = moment(i + '/' + $scope.currMoment.format('M') + '/' + $scope.currMoment.format('Y'), "DD-MM-YYYY")

            if ( (eventStart <= tempCurrDay && eventEnd >= tempCurrDay) ||
                 ( eventStart.format('D') == tempCurrDay.format('D') &&
                     eventStart.format('M') == tempCurrDay.format('M') &&
                     eventStart.format('Y') == tempCurrDay.format('Y') ) ){

                // console.log(res.data.events[j].description);
                // console.log(moment(parseInt(res.data.events[j].startTime)).format("MMM Do YY"));
                tempArray[dayCnt].push(res.data.events[j])
            }

         }
         dayCnt++

         var dateObject = {
           month: "month",
           day: 0,
           year: 2017
         }
         dateObject.month = $scope.currMoment.format('M');
         dateObject.day = String(i);
         dateObject.year = $scope.currMoment.format('Y');
         masterCalendar.push(dateObject);
       }

       for (i = 1; i <= 42 - numberOfDays - firstDay; ++i) { //nxt month

        rowPosition = "col" + tempFirstDay;
        tempFirstDay = tempFirstDay + 1;
        $scope[rowPosition + 'IsNextMonth'] = true;
        let nxtMonth = parseInt($scope.currMoment.format('M'));
        let nxtYear = parseInt($scope.currMoment.format('Y'));
        $scope[rowPosition] = i;
        if ( nxtMonth == 12 ) { //if curr month is january
            nxtMonth = 1;
            nxtYear++;
        }
        else {
            nxtMonth++;
         }
         for (j = 0; j < res.data.events.length; ++j) { //check if event is on that day
            let eventStart = moment(parseInt(res.data.events[j].startTime))
            let eventEnd = moment(parseInt(res.data.events[j].endTime))
            let tempCurrDay = moment(i + '/' + nxtMonth + '/' + nxtYear, "DD-MM-YYYY")

            if ( (eventStart <= tempCurrDay && eventEnd >= tempCurrDay) ||
                 ( eventStart.format('D') == tempCurrDay.format('D') &&
                     eventStart.format('M') == tempCurrDay.format('M') &&
                     eventStart.format('Y') == tempCurrDay.format('Y') ) ){

                // console.log(res.data.events[j].description);
                // console.log(moment(parseInt(res.data.events[j].startTime)).format("MMM Do YY"));
                tempArray[dayCnt].push(res.data.events[j])
            }
         }
         dayCnt++

         var dateObject = {
           month: "month",
           day: 0,
           year: 2017
         }
         dateObject.month = String(nxtMonth);
         dateObject.day = String(i);
         dateObject.year = String(nxtYear);

         masterCalendar.push(dateObject);
       }
       for (let i = 0; i < 42; i++) {
           while( masterEvent[i].length > 0){
               masterEvent[i].pop()
           }
           for (let j = 0; j < tempArray[i].length; j++){
               masterEvent[i].push(tempArray[i][j]);
           }
       }
       });
     }

    $scope.next = function(){ // next toggle button
        $scope.currMoment.add(1, 'months');
        masterCalendar =[];
        render();
    }

    $scope.previous = function(){ // prev toggle button
        $scope.currMoment.subtract(1, 'months');
        masterCalendar= [];
        render();
    }

    $scope.calendarPage = true;

    $scope.eventStatusPrivate = 'Private';
    $scope.eventStatusPublic = "Public";
    $scope.objStatus = "";

    $scope.createEvent = function(ev) {

      $scope.startDate = $scope.startTime = roundNext15Min(moment());
      $scope.endDate = $scope.endTime = roundNext15Min(moment().add('30', 'm'));

        $mdDialog.show({
          controller: CreateEventController,
          templateUrl: 'create-event-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          focusOnOpen: false,
          fullscreen: $scope.customFullscreen,
          token: $scope.token,
          startDate: $scope.startDate,
          startTime: $scope.startTime,
          endDate: $scope.endDate,
          endTime: $scope.endTime

        });
    };

    $scope.eventDetails = function(item) {
      $mdDialog.show({
          controller: ShowEventController,
          templateUrl: 'show-event.html',
          parent: angular.element(document.body),
          targetEvent: item,
          clickOutsideToClose:true,
          focusOnOpen: false,
          fullscreen: $scope.customFullscreen,
          token: $scope.token,
          currentEvent: item
      });

    };

    function ShowEventController($scope, $mdDialog, token, currentEvent) {
      $scope.eventName = currentEvent.name;
      $scope.startDate = moment(parseInt(currentEvent.startTime))
      $scope.endDate = moment(parseInt(currentEvent.endTime))
      $scope.startTime = moment(parseInt(currentEvent.startTime))
      $scope.endTime = moment(parseInt(currentEvent.endTime))
      $scope.description = currentEvent.description;

      $scope.cancel = function() {
          $mdDialog.cancel();
      };

    }

    $scope.createEventBoxClick = function(ev, clickDayIndex) {

      let d = masterCalendar[clickDayIndex].day;
      let m = masterCalendar[clickDayIndex].month;
      let y = masterCalendar[clickDayIndex].year;

      $scope.startDate = moment({year: y, month: m - 1, day: d});
      $scope.startTime = moment({hour: 12, minute: 0});
      $scope.endDate = moment({year: y, month: m - 1, day: d});
      $scope.endTime = moment({hour: 12, minute: 30});
      //console.log(moment.format(month + '/' + day + '/' + year, "MMM Do YYYY"));

      $mdDialog.show({
        controller: CreateEventController,
        templateUrl: 'create-event-dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        focusOnOpen: false,
        fullscreen: $scope.customFullscreen,
        token: $scope.token,
        startDate: $scope.startDate,
        startTime: $scope.startTime,
        endDate: $scope.endDate,
        endTime: $scope.endTime
      });
    }

    function CreateEventController($scope, $mdDialog, token, startDate, startTime, endDate, endTime) {
        $scope.startDate = startDate;
        $scope.startTime = startTime;
        $scope.endDate = endDate;
        $scope.endTime = endTime;

        $scope.timePickerOptions = {
            scrollDefault: 'now',
            asMoment: true
        }
        $scope.eventName = "Untitled Event";

        let currDate = new Date();
        $scope.minDate = new Date(currDate.getFullYear() -  1000, currDate.getMonth(), currDate.getDate());
        $scope.maxDate = new Date(currDate.getFullYear() +  1000, currDate.getMonth(), currDate.getDate());

        //$scope.startDate = $scope.startTime = roundNext15Min(moment());
        //$scope.endDate = $scope.endTime = roundNext15Min(moment().add('30', 'm'));

        $scope.startTimeChange = function() {
            let newMoment = new moment($scope.startDate);
            newMoment.minute(moment($scope.startTime).minute());
            newMoment.hour(moment($scope.startTime).hour());
            $scope.startDate = $scope.startTime = newMoment;
        }

        $scope.endTimeChange = function() {
            let newMoment = new moment($scope.endDate);
            newMoment.minute(moment($scope.endTime).minute());
            newMoment.hour(moment($scope.endTime).hour());
            $scope.endDate = $scope.endTime = newMoment;
        }

        $scope.eventStatusPrivate = false;
        $scope.eventStatusPublic = true;
        $scope.objStatus = $scope.eventStatusPublic;

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.createEvent = function() {
            let $dates = angular.element(document.querySelectorAll('.dateform input'));
            let startDate = angular.element($dates[0]).val();
            let startTime = angular.element($dates[1]).val();
            let endDate = angular.element($dates[2]).val();
            let endTime = angular.element($dates[3]).val();
            let eventName = angular.element(document.querySelector('.eventnameform input')).val();
            let eventDescription =  angular.element(document.querySelector('.eventdescription textarea')).val();

            // check validity
            const format = 'l';
            let error = false;

            $scope.createEventError = '';
            if (!moment(startDate, format, true).isValid() || !moment(endDate, format, true).isValid()) {
                if (!error) $scope.createEventError = "Invalid calendar date.";
                error = true;
            }
            // check empty name
            if (eventName === '') {
                if (!error) $scope.createEventError = "Empty event name.";
                error = true;
            }

            // make sure the events are in the right other
            let startMoment = moment(startDate + ' ' + startTime, 'MM/DD/YYYY h:mma');
            let endMoment = moment(endDate + ' ' + endTime, 'MM/DD/YYYY h:mma');
            if (endMoment.isSameOrBefore(startMoment)) {
                if (!error) $scope.createEventError = "Event end date must be after start date.";
                error =  true;
            }

            if (!error) {
                // should have a way to toggle private and public... do this later
                console.log($scope.objStatus)
                CalendarEventService.createEvent(eventName, startMoment.valueOf(), endMoment.valueOf(), eventDescription, $scope.objStatus, token)
                 .then(function(res) {
                    console.log(res);
                    $mdToast.show($mdToast.simple().textContent('Event Successfully Created!').position('bottom left'));
                    $mdDialog.cancel();
                    render();
                }).catch(function(err) {
                    console.log(err);
                });
            } else {
                // show the error message
            }
        }

        /*
        function roundNext15Min(moment) {
            var intervals = Math.floor(moment.minutes() / 15);
            if (moment.minutes() % 15 != 0) {
                intervals++;
                if (intervals == 4) {
                    moment.add(1, 'hours');
                    intervals = 0;
                }
                moment.minutes(intervals * 15);
                moment.seconds(0);
            }
            return moment;
            */
        }

        function roundNext15Min(moment) {
            var intervals = Math.floor(moment.minutes() / 15);
            if (moment.minutes() % 15 != 0) {
                intervals++;
                if (intervals == 4) {
                    moment.add(1, 'hours');
                    intervals = 0;
                }
                moment.minutes(intervals * 15);
                moment.seconds(0);
            }
            return moment;
    }

}
