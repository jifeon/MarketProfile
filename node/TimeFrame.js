/**
 * @class TimeFrame
 */
var TimeFrame = module.exports = function (row) {
    this.date = row[0];
    this.time = row[1];
    this.open = parseFloat(row[2]);
    this.max = parseFloat(row[3]);
    this.min = parseFloat(row[4]);
    this.close = parseFloat(row[5]);
    this.volume = parseFloat(row[6]);
};