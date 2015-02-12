/**
 * Created by Marcela on 26. 1. 2015.
 */
/// <reference path="typing/jquery.d.ts" />
/// <reference path="SpinnerEvents.ts" />
var Numeric;
(function (Numeric) {
    /**
     * Initial class that sets defaults from options.
     *
     * @class Spinner
     * @implements {ISpinner}
     *
     * @param {JQuery} inputElement - Input element
     * @param {JQuery} buttonElement - Buttons element
     * @param {number} width - Input width
     * @param {SpinnerEvents} spinnerType - Defines type of input
     * @param {boolean} scrollable - Adds and subtracts value by mouse scrolling
     * @param {number} precision - Number precision
     * @param {number} step - How much to increase or decrease the value
     * @param {string} value - Input value
     * @param {string} dateFormat - Custom format of date and/or time based on moment.js component
     * @param {StepUnit} stepUnit - This defines which unit (day, hour...) should be used for changing value
     * @param {any} min - Minimal value
     * @param {any} max - Maximal value
     */
    var Spinner = (function () {
        function Spinner(el, options) {
            this.precision = 0;
            this.step = 1;
            this.scrollable = false;
            this.stepUnit = 0 /* Days */;
            this.valueChanged = function (newValue) {
            };
            $.extend(this, options);
            this.inputElement = $(el);
            this.value = this.inputElement.val() || 0;
            this.inputElement.val(this.value);
            this.inputElement.addClass("form-control spiner");
            if (options.width) {
                this.inputElement.css({ "width": options.width });
            }
            this.buttonElement = $('<div class="input-group-btn-vertical"/>');
            if (this.inputElement.next('.input-group-addon').length) {
                this.buttonElement.addClass('spinner-addon');
            }
            this.buttonElement.append(NumericButton.render("up", "fa fa-caret-up")).append(NumericButton.render("down", "fa fa-caret-down"));
            this.inputElement.after(this.buttonElement);
            var events;
            if (this.spinnerType && typeof this.spinnerType === "function") {
                events = new this.spinnerType(this);
            }
            else {
                events = new Numeric.NumberSpinner(this);
            }
        }
        return Spinner;
    })();
    Numeric.Spinner = Spinner;
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
         * @returns {jQuery}
         */
        NumericButton.render = function (direction, icon) {
            return $('<button type="button" class="btn btn-default" data-direction="' + direction + '"><i class="' + icon + '"></i></button>');
        };
        return NumericButton;
    })();
})(Numeric || (Numeric = {}));
//# sourceMappingURL=Spinner.js.map