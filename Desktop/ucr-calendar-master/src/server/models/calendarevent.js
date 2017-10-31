let mongoose = require('mongoose');

let CalendarEventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, time: {
        type: String,
        required: true
    }, description: {
        type: String,
        required: false
    }, public: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

let CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema);
module.exports = CalendarEvent;