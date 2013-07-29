define(['ofio/ofio', 'jquery', 'DayProfile', 'ofio/ofio.jquery'], function (Ofio, $, DayProfile) {
    /**
     * @extends Ofio
     * @class MarketProfileBuilder
     */
    var MarketProfileBuilder = Ofio.extend({
        modules: arguments
    },{
        _init: function () {
            this._super();

            var MarketProfileDataParser = require('../node/MarketProfileDataParser');
            this._parser = new MarketProfileDataParser({
                csvFile: 'data.csv'
            });

            this._pipsStep = 0.0002;
            this._min = null;
            this._max = null;
            this._$tbody = this.$el.find('tbody');
            this._parser
                .on('error', alert)
                .on('ready', this._build.bind(this));
        },

        _events: function () {
            return {
                'click a': this._buildLastDay
            };
        },

        _build: function () {
            for(var i = 0; i < 10; i++) this._buildLastDay();
        },

        _buildLastDay: function () {
            var day = this._parser.getLastDayData();
            this._prepareTableForDay(day);

            var dayProfile = new DayProfile({
                day: day,
                el: this._$tbody,
                pipsStep: this._pipsStep
            });
            dayProfile.build();
        },

        _prepareTableForDay: function (day) {
            var min = Math.round(day.min / this._pipsStep) * this._pipsStep,
                max = Math.round(day.max / this._pipsStep) * this._pipsStep;

            if (this._min === null) {
                this._min = min;
                this._max = max;

                this._$tbody.html(this._generatePrices(min, max));
            }
            else {
                if (min < this._min) {
                    this._$tbody.append($(this._generatePrices(min, this._min - this._pipsStep)));
                    this._min = min;
                }
                else {
                    this._insertSpaces(this._min, min - this._pipsStep);
                }

                if (max > this._max) {
                    this._$tbody.prepend($(this._generatePrices(this._max + this._pipsStep, max)));
                    this._max = max;
                }
                else {
                    this._insertSpaces(max + this._pipsStep, this._max);
                }
            }
        },

        /**
         * @param {number} min
         * @param {number} max
         * @returns {string}
         * @private
         */
        _generatePrices: function (min, max) {
            var html = [];
            for (var price = max; price >= min; price -= this._pipsStep) {
                var priceStr = price.toFixed(5);
                html.push('<tr class="tr', priceStr.replace('.', '_'), '"><th>', priceStr, '</th></tr>');
            }
            return html.join('');
        },

        _insertSpaces: function (min, max) {
            for (var price = min; price <= max; price += this._pipsStep) {
                var priceStr = price.toFixed(5),
                    $row = this.$('.tr' + priceStr.replace('.', '_'));

                $('<td></td>').insertAfter($row.find('th:first'));
            }
        }
    });

    return MarketProfileBuilder;
});