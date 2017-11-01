angular.module('CalendarController', ['ngCookies', 'angularMoment']).controller('CalendarController', function($scope, $cookies, $window, UserService, CalendarEventService, FriendService, HeaderService, moment) {
    $scope.monthName = moment().startOf("month").format('MMMM'); // string output of current month
    $scope.yearDate = moment().format('YYYY');
    $scope.currentDate = moment().date(); // used to highlight current date

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    var lastMonth = moment().subtract(1,'months').endOf('month').format('DD')
    var nextMonth = moment().add(1,'months').endOf('month').format('DD')


    var firstDay = moment(firstDay).day(); // Returns the first day of the month
    var lastDay = moment(lastDay).day(); // Returns the last day of the month
    var numberOfDays = moment(date).daysInMonth(); // Returns number of days
    var i;

    for (i = lastMonth; i > lastMonth - firstDay; i--) {
        var newLI = document.createElement("li"), // create a new li
          displayDates = document.getElementById("prevDays") // cache the unordered list
          newContent = document.createTextNode([i]); // grab the spelling list item

          newLI.appendChild(newContent);
          displayDates.appendChild(newLI);
    }

    for (i = 1; i <= numberOfDays; i++) {
        var newLI = document.createElement("li"), // create a new li
          displayDates = document.getElementById("days") // cache the unordered list
          newContent = document.createTextNode([i]); // grab the spelling list item

          newLI.appendChild(newContent);
          displayDates.appendChild(newLI);
    }

    for (i = 1; i <= 44 - numberOfDays - lastDay; i++) {
        var newNextLI = document.createElement("li"), // create a new li
          displayNextDates = document.getElementById("nextDays") // cache the unordered list
          newNextContent = document.createTextNode([i]); // grab the spelling list item

          newNextLI.appendChild(newNextContent);
          displayNextDates.appendChild(newNextLI);

    }
    var momentVar = moment();
    $scope.next = function(){
      $scope.monthName = momentVar.add(1,'months').startOf("month").format('MMMM');
      console.log($scope.monthName)
      if ($scope.monthName = "December") {
        console.log("next Year");
      }
    }

    $scope.previous = function(){
      $scope.monthName = momentVar.add(1,'months').startOf("month").format('MMMM');
      if ($scope.monthName = "Janurary") {
        console.log("prev Year");
      }
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
