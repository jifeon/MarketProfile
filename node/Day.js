var Ofio = require('ofio');

/**
 * @class Day
 */
var Day = module.exports = Ofio.extend({
    _init: function () {
        this._timeFrames = [];
        
        this.min = 0;
        this.max = 0;
        this.date = null;
    },

    addTimeFrame: function (timeFrame) {
        this.min = this._timeFrames.length ? Math.min(timeFrame.min, this.min) : timeFrame.min;
        this.max = this._timeFrames.length ? Math.max(timeFrame.max, this.max) : timeFrame.max;
        if (!this.date) {
            this.date = timeFrame.date;
        }
        
        this._timeFrames.unshift(timeFrame);
    },

    /**
     * @param {function(TimeFrame)} cb
     */
    eachTimeFrame: function (cb) {
        this._timeFrames.forEach(cb);
    }
});

