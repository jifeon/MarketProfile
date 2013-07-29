requirejs.config({
    baseUrl: 'scripts',
    paths: {
        ofio: '../../node_modules/ofio',
        vendor: '../vendor',
        jquery: '../vendor/jquery.min'
    },
    shim: {
        jquery: {
            exports: '$'
        }
    }
});

requirejs(['MarketProfileBuilder', 'jquery'], function (MarketProfileBuilder, $) {
    window.builder = new MarketProfileBuilder({
        el: $('.marketProfileChart')
    });
});