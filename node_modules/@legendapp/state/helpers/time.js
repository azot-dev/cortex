'use strict';

var state = require('@legendapp/state');

const MSPerMinute = 60000;
function clearTime(date) {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);
    return date;
}
let time = new Date();
const currentTime = state.observable(time);
const currentDay = state.observable(clearTime(time));
const timeToSecond = (60 - time.getSeconds() + 1) * 1000;
function update() {
    const now = new Date();
    currentTime.set(now);
    if (now.getDate() !== time.getDate()) {
        currentDay.set(clearTime(now));
    }
    time = now;
}
setTimeout(() => {
    update();
    setInterval(update, MSPerMinute);
}, timeToSecond);

exports.currentDay = currentDay;
exports.currentTime = currentTime;
//# sourceMappingURL=time.js.map
