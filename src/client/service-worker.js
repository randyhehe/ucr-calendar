self.importScripts("libs/moment/min/moment-with-locales.min.js")
self.addEventListener('activate', function (event) {
    self.events = [];
    console.log('success');
    var j;
});
self.addEventListener('message', function(event) {
    let data = (JSON.parse(event.data));
    if(self.events.length==0) {
        for(let i = 0; i<data.events.length; i++) {
            self.events.push(data.events[i]);
            let startTime=data.events[i].startTime;
            //let moment= require('moment');
            let notifTime=moment(startTime, 'x').subtract(30, 'minute');
            //let schedule = require('node-schedule');
            //let date = new Date(moment(notifTime, 'x').format(yyyy), )
            console.log(moment(notifTime, 'x').format('YYYY'));
            console.log(moment(notifTime, 'x').format('MM'));
            console.log(moment(notifTime, 'x').format('DD'));
            console.log(moment(notifTime, 'x').format('h:mma'));
        }
      }
    /*else {
        for(let i =0; i < data.events.length; i++) {
              if(listable(data.events[i]._id, self.events)) {
                  self.events.push(data.events[i]);
                  //schedule event
              }
        }
    }*/
});
self.addEventListener('installed', function(event) {
    self.events = [];
    console.log('installed');
    var j;
});
function listable(id, array) {
    let able = false;
    if(array.length==0) {
        return true;
    }
    for(let i = 0; i<array.length;i++) {
        if(id !== array[i]._id) {
            able = true;
        }
    }
    return able;
}
