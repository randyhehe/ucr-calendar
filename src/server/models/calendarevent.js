let mongoose = require('mongoose');

let CalendarEventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, user: {
        type: String,
        required: true
    }, startTime: {
        type: String,
        required: true
    }, endTime: {
        type: String,
        required: true
    }, description: {
        type: String,
        required: false
    }, public: {
        type: Boolean,
        required: true
    }, notify: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

let CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema);
module.exports = CalendarEvent;
