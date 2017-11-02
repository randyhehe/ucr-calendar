angular.module('CalendarController', ['ngCookies', 'angularMoment']).controller('CalendarController', function($scope, $cookies, $window, UserService, CalendarEventService, FriendService, HeaderService, moment) {
    $scope.monthName = moment().startOf("month").format('MMMM'); // string output of current month
    $scope.yearDate = moment().format('YYYY');
    $scope.currentDate = moment().date(); // used to highlight current date
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    var currMoment = moment();

    //console.log(currMoment)
    render(currMoment) // init render of current month


    function render(currMoment) {

      var lastMonth = currMoment.subtract(1,'months').endOf('month').format('DD');
      var nextMonth = currMoment.add(1,'months').endOf('month').format('DD');

      var firstDay = currMoment.startOf('month').day(); // Returns the first day of the month
      firstDay = parseInt(firstDay);
      var lastDay = currMoment.endOf('month').day(); // Returns the last day of the month
      lastDay = parseInt(lastDay);

      var numberOfDays = currMoment.daysInMonth(); // Returns number of days
      var i,tempFirstDay;
      //console.log(lastMonth);
      //console.log(firstDay);
      var x = lastMonth;
      for (i = firstDay-1; i >= 0; --i) {
        rowPosition = "col" + i;
        document.getElementById(rowPosition).innerHTML = x;
        x = x - 1;
      }
      tempFirstDay = firstDay;
      for (i = 1; i <= numberOfDays; i++) {
        rowPosition = "col" + tempFirstDay;
        tempFirstDay = tempFirstDay + 1;

        if (i == $scope.currentDate) {
          var newSpan = document.createElement('span');
          newSpan.setAttribute('class', 'active');
        }
        document.getElementById(rowPosition).innerHTML = i
      }
      //console.log(tempFirstDay);

      for (i = 1; i <= 42 - numberOfDays - firstDay; ++i) {
        rowPosition = "col" + tempFirstDay;
        tempFirstDay = tempFirstDay + 1;
         document.getElementById(rowPosition).innerHTML = i;
      }

    }

    $scope.next = function(){ // next toggle button
      $scope.monthName = currMoment.add(1,'months').startOf("month").format('MMMM');
      if ($scope.monthName == "January") {
        $scope.yearDate = currMoment.add(0,'years').format('YYYY');
      }
      render(currMoment)
    }

    $scope.previous = function(){ // prev toggle button
      $scope.monthName = currMoment.subtract(1,'months').startOf("month").format('MMMM');
      if ($scope.monthName == "December") {
        $scope.yearDate = currMoment.subtract(0,'years').format('YYYY');
      }
      render(currMoment)
    }

    $scope.calendarPage = true;

    let token = $cookies.get('token');
    console.log(token); // this is the current logged in user
    if (token === undefined) {
        $window.location.href = "/";
    }

    UserService.getUser(token).then(function(res) {
        // valid user. populate the calendar UI.
        console.log(res);
    }, function(err) {
        $window.location.href = "/";
    });

    $scope.signOut = HeaderService.signOut;

});

/*
 * Example of using API to get all events
 */
// CalendarEventService.getEvents(token).then(function(res) {
//     console.log(res.data.events);
// }, function(err) {
//     console.log(err);
// });

/*
 * Example of using API to create an event
 */
// CalendarEventService.createEvent("eventName", "eventTime", "eventDescription", true, token).then(function(res) {
//     console.log("Event created!");
// }, function(err) {
//     console.log("Event failed to be created!");
// });

/*
 * Example of using API to add friend
 */
// FriendService.addFriend("email", token).then(function(res) {
//     console.log(res);
// }, function(err) {
//     console.log(err); // email is same as current account, or email is already their friend
// });
