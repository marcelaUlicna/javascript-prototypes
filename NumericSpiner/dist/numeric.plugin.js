/**
 * Created by Marcela on 20. 1. 2015.
 */
/// <reference path="typing/jquery.d.ts" />
/*
* @module Numeric
*/
var Numeric;
(function (Numeric) {
    /**
     * Initial class that sets defaults from options.
     *
     * @class Spiner
     * @param {SpinerEvent} spinerEvent - Reference to class with plugin logic
     */
    var Spiner = (function () {
        function Spiner(element, options) {
            var settings = {
                scrollable: options && options.scrollable ? options.scrollable : false,
                precision: options && options.precision ? options.precision : 0,
                step: options && options.step ? options.step : 1
            };
            this.spinerEvent = new Numeric.SpinerEvent(element, settings);
        }
        return Spiner;
    })();
    Numeric.Spiner = Spiner;
    var interval;
    /**
    * This creates DOM element and provides logic for elements.
     * Class contains events for manipulating with buttons.
     *
     * @class SpinerEvent
     * @param {JQuery} element - Input element
     * @param {JQuery} numberPicker - Up and down button elements
     * @param {INumericSpiner} settings - Settings, implements INumericSpiner interface
     * @param {string} value - Input value
     * @param {boolean} startDown - Private property that identifies whether mouse down is holding
    */
    var SpinerEvent = (function () {
        function SpinerEvent(element, settings) {
            var _this = this;
            this.startDown = false;
            this.element = element;
            this.settings = settings;
            this.value = this.element.val() || 0;
            this.element.val(this.value);
            this.element.addClass("form-control spiner");
            this.numberPicker = $('<div class="input-group-btn-vertical"/>');
            this.numberPicker.append(NumericButton.render("up", "fa fa-caret-up")).append(NumericButton.render("down", "fa fa-caret-down"));
            this.element.after(this.numberPicker);
            this.element.on("mousewheel", function (e) { return _this[e.type](e); });
            this.numberPicker.on("mousedown mouseup", "button", function (e) { return _this[e.type](e); });
        }
        /**
        * Mouse wheel event provides changing value.
         * This uses jquery.mousewheel.js library to detect
         * direction of user's mouse wheel.
         *
         * @method mousewheel
         * @param {JQueryEventObject} e - Event handler
        */
        SpinerEvent.prototype.mousewheel = function (e) {
            if (this.settings.scrollable && this.element.is(":focus")) {
                e.preventDefault();
                var direction = e.deltaY === 1 ? "up" : "down";
                this.changeValue(direction);
            }
        };
        /**
         * Mouse down event sets property startDown to true
         * and calls 'changeValue' function.
         * The call is produced repeatedly until
         * event 'mouseup' occurs.
         *
         * @method mousedown
         * @param {JQueryEventObject} e - Event handler
         */
        SpinerEvent.prototype.mousedown = function (e) {
            var _this = this;
            this.startDown = true;
            var el = $(e.target).closest('button'), direction = el.attr('data-direction'), value = this.element.val();
            if (!isNaN(value) && value !== this.value) {
                this.value = value;
            }
            this.changeValue(direction);
            interval = setInterval(function () { return _this.changeValue(direction); }, 400);
        };
        /**
         * Mouse up event sets property startDown to false
         * and clears interval.
         *
         * @method mouseup
         * @param {JQueryEventObject} e - Event handler
         */
        SpinerEvent.prototype.mouseup = function (e) {
            this.startDown = false;
            clearInterval(interval);
        };
        /**
        * This function changes value based on direction and step
        * and rounds value according to precision.
        *
        * @method changeValue
        * @param {string} direction - Direction of changing value ("up" for increase, "down" for decrease)
        */
        SpinerEvent.prototype.changeValue = function (direction) {
            var value = Number(this.value), step = this.settings.step, precision = this.settings.precision;
            if (direction === "up") {
                value += step;
            }
            else {
                value -= step;
            }
            this.value = value.toFixed(precision);
            this.element.val(value.toString());
        };
        return SpinerEvent;
    })();
    Numeric.SpinerEvent = SpinerEvent;
    /**
    * This contains one static method to render button.
    *
    * @class NumericButton
    */
    var NumericButton = (function () {
        function NumericButton() {
        }
        /**
        * Renders numeric button.
        *
        * @function render
        * @static
        */
        NumericButton.render = function (direction, icon) {
            return $('<button class="btn btn-default" data-direction="' + direction + '"><i class="' + icon + '"></i></button>');
        };
        return NumericButton;
    })();
    Numeric.NumericButton = NumericButton;
})(Numeric || (Numeric = {}));
//# sourceMappingURL=numeric.plugin.js.map