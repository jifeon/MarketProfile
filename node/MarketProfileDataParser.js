/**
 * @type {Ofio}
 */
var Ofio = require('ofio'),
    TimeFrame = require('./TimeFrame'),
    Day = require('./Day'),
    csv = require('csv'),
    path = require('path');

/**
 * @class MarketProfileDataParser
 * @extends Ofio
 */
var MarketProfileDataParser = module.exports = Ofio.extend({
    extend: process.EventEmitter
},{
    _init: function () {
        this._csvFile = this._options.csvFile;
        this._cvs = null;
        this._data = [];
        this._readingFile = true;
        this._timeRange = [9, 17];

        this._loadCSV();
    },

    _loadCSV: function () {
        this._cvs = csv().from.path( path.join(__dirname, '../data', this._csvFile), { delimiter: ',', escape: '"' })
            .on('record', this._addRecord.bind(this))
            .on('end', this.emit.bind(this, 'ready'))
            .on('error', this.emit.bind(this, 'error'));
    },

    _addRecord: function (row, index) {
        this._data.push(row);
    },

    getLastDayData: function () {
        var row = this._findLastSuitableRow();
        if (!row) {
            return null;
        }

        var timeFrame = new TimeFrame(row),
            day = new Day();

        day.addTimeFrame(timeFrame);

        while(row = this._findLastSuitableRow(timeFrame.date)) {
            day.addTimeFrame(new TimeFrame(row));
        }

        return day;
    },

    _findLastSuitableRow: function (date) {
        var row;
        while (row = this._data.pop()) {
            if (date !== undefined && row[0] !== date) {
                this._data.push(row);
                return null;
            }

            var time = parseFloat(row[1].replace(':', '.'));
            if (time < this._timeRange[0] || time > this._timeRange[1]) {
                continue;
            }
            
            return row;
        }
        
        return null;
    }
});