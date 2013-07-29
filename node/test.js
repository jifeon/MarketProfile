var MarketProfileDataParser = require('./MarketProfileDataParser');
var parser = new MarketProfileDataParser({
    csvFile: 'data.csv'
});

parser.on('error', function () {
    console.log('Error while reading CVS file');
});

parser.on('ready', function () {
    console.log(parser.getLastDayData());
    console.log(parser.getLastDayData());
});