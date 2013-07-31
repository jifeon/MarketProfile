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
            this._valueArea = [0, 0];
            this._valueAreaK = 0.7;
            this._TPOs = 0;
        },

        /**
         * @public
         */
        build: function () {
            this._day.eachTimeFrame(this._buildTimeFrame.bind(this));
            var controlPoint = this._getControlPoint();
            this._calculateValueArea(controlPoint);
            this.render(controlPoint);
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
                var priceStr = this._price2str(price);
                if (!this._rows[priceStr]) {
                    this._rows[priceStr] = [];
                }

                var l = this._rows[priceStr].push(letter);
                this._checkForControlPoint(l, price);
                this._TPOs++;
            }
        },

        _checkForControlPoint: function (TPOs, price) {
            if (TPOs > this._maxLength) {
                this._controlPoints = [price];
                this._maxLength = TPOs;
            }
            else if (TPOs == this._maxLength) {
                this._controlPoints.push(price);
            }
        },

        render: function (controlPoint) {
            for (var priceStr in this._rows) {
                if (!this._rows.hasOwnProperty(priceStr)) {
                    continue;
                }

                var $row = this.$('.tr' + priceStr.replace('.', '_')),
                    $td = $('<td></td>'),
                    html = [];
                this._rows[priceStr].forEach(function (letter) {
                    html.push('<span>', letter, '</span>');
                });
                if (priceStr == controlPoint) {
                    $td.addClass('control_point');
                }
                if (this._priceInValueArea(priceStr)) {
                    $td.addClass('value_area');
                }
                $td.html(html.join('')).insertAfter($row.find('th:first'));
            }
        },

        _priceInValueArea: function (priceStr) {
            var price = this._str2price(priceStr);
            return price >= this._valueArea[0] && price <= this._valueArea[1];
        },

        _calculateValueArea: function (controlPoint) {
            var valueTPOs = Math.round(this._TPOs * this._valueAreaK);
            valueTPOs -= this._rows[controlPoint].length;

            var controlPointValue = this._str2price(controlPoint);
            this._valueArea = [controlPointValue, controlPointValue];
            
            while (valueTPOs > 0) {
                var bottom = this._createPriceDescriptor(this._valueArea[0] - this._pipsStep),
                    bottom2 = this._createPriceDescriptor(bottom.price - this._pipsStep),
                    top = this._createPriceDescriptor(this._valueArea[1] + this._pipsStep),
                    top2 = this._createPriceDescriptor(top.price + this._pipsStep);

                if (bottom.TPOs + bottom2.TPOs > top.TPOs + top2.TPOs) {
                    valueTPOs -= bottom.TPOs;
                    this._valueArea[0] = bottom.price;

                    if (valueTPOs > 0) {
                        valueTPOs -= bottom2.TPOs;
                        this._valueArea[0] = bottom2.price;
                    }
                }
                else {
                    valueTPOs -= top.TPOs;
                    this._valueArea[1] = top.price;

                    if (valueTPOs > 0) {
                        valueTPOs -= top2.TPOs;
                        this._valueArea[1] = top2.price;
                    }
                }
            }
        },

        _createPriceDescriptor: function (price) {
            var priceStr = this._price2str(price);
            return {
                price: price,
                TPOs: this._rows[priceStr] ? this._rows[priceStr].length : 0
            };
        },

        _getControlPoint: function () {
            var center = (this._day.min + this._day.max) / 2;
            return this._controlPoints.reduce(function (a, b) {
                // nearest to day center
                return Math.abs(center-a) < Math.abs(center-b) ? a : b;
            }).toFixed(5);
        },

        _price2str: function (price) {
            return price.toFixed(5);
        },

        _str2price: function (str) {
            return parseFloat(str);
        }
    });

    return DayProfile;
});