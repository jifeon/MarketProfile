define(['ofio/ofio', 'jquery', 'ofio/ofio.jquery'], function (Ofio, $) {
    /**
     * @class DayProfile
     */
    var DayProfile = Ofio.extend({
        modules: arguments
    }, /**@lends DayProfile*/{
        /**
         * @constructor
         * @protected
         */
        _init: function () {
            this._day = this._options.day;

            this._rows = {};
            this._pipsStep = this._options.pipsStep;
            this._controlPoints = [];
            this._maxLength = 0;
        },

        /**
         * @public
         */
        build: function () {
            this._day.eachTimeFrame(this._buildTimeFrame.bind(this));
            this.render();
        },

        /**
         * @param {TimeFrame} timeFrame
         * @param {number} index
         * @private
         */
        _buildTimeFrame: function (timeFrame, index) {
            var min = Math.round(timeFrame.min / this._pipsStep) * this._pipsStep,
                max = Math.round(timeFrame.max / this._pipsStep) * this._pipsStep,
                letter = String.fromCharCode('A'.charCodeAt() + index);

            for (var price = min; price <= max; price += this._pipsStep) {
                var priceStr = price.toFixed(5);
                if (!this._rows[priceStr]) {
                    this._rows[priceStr] = [];
                }

                var l = this._rows[priceStr].push(letter);
                if (l > this._maxLength) {
                    this._controlPoints = [price];
                    this._maxLength = l;
                }
                else if (l == this._maxLength) {
                    this._controlPoints.push(price);
                }
            }
        },

        render: function () {
            var center = (this._day.min + this._day.max) / 2;
            console.log(this._controlPoints);
            var controlPoint = this._controlPoints.reduce(function (a, b) {
                return Math.abs(center-a) < Math.abs(center-b) ? a : b;
            }).toFixed(5);

            for (var price in this._rows) {
                if (!this._rows.hasOwnProperty(price)) {
                    continue;
                }

                var $row = this.$('.tr' + price.replace('.', '_')),
                    $td = $('<td></td>'),
                    html = [];
                this._rows[price].forEach(function (letter) {
                    html.push('<span>', letter, '</span>');
                });
                if (price == controlPoint) {
                    $td.addClass('control_point');
                }
                $td.html(html.join('')).insertAfter($row.find('th:first'));
            }
        }
    });

    return DayProfile;
});