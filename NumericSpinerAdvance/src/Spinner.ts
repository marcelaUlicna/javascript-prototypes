/**
 * Created by Marcela on 26. 1. 2015.
 */
/// <reference path="typing/jquery.d.ts" />
/// <reference path="SpinnerEvents.ts" />

module Numeric {

    /**
     * Numeric spiner interface - declare default properties.
     *
     * @interface ISpinner
     * @param {SpinnerEvents} spinnerType - Defines type of input
     * @param {boolean} scrollable - Adds and subtracts value by mouse scrolling
     * @param {number} precision - Number precision
     * @param {number} step - How much to increase or decrease the value
     * @param {number} width - Input width
     * @param {string} dateFormat - Custom format of date and/or time based on moment.js component
     * @param {string} stepUnit - This defines which unit (day, hour...) should be used for changing value
     */
    interface ISpinner {
        spinnerType: SpinnerEvents;
        precision: number;
        step: number;
        scrollable: boolean;
        width: number;
        dateFormat: string;
        stepUnit: string;
        min: any;
        max: any;
    }

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
     * @param {string} stepUnit - This defines which unit (day, hour...) should be used for changing value
     * @param {any} min - Minimal value
     * @param {any} max - Maximal value
     */
    export class Spinner implements ISpinner{
        inputElement: JQuery;
        buttonElement: JQuery;
        width: number;
        spinnerType: SpinnerEvents;
        precision: number = 0;
        step: number = 1
        scrollable: boolean = false;
        value: string;
        dateFormat: string;
        stepUnit: string;
        min: any;
        max: any;

        constructor(el: JQuery, options: ISpinner) {
            $.extend(this, options);

            this.inputElement = $(el);
            this.value = this.inputElement.val() || 0;
            this.inputElement.val(this.value);
            this.inputElement.addClass("form-control spiner");
            if(options.width) {
                this.inputElement.css({"width": options.width});
            }

            this.buttonElement = $('<div class="input-group-btn-vertical"/>');
            if(this.inputElement.next('.input-group-addon').length) {
                this.buttonElement.addClass('spinner-addon');
            }
            this.buttonElement
                .append(NumericButton.render("up", "fa fa-caret-up"))
                .append(NumericButton.render("down", "fa fa-caret-down"));

            this.inputElement.after(this.buttonElement);

            var events;
            if(this.spinnerType && typeof this.spinnerType === "function") {
                events = new this.spinnerType(this);
            } else {
                events = new NumberSpinner(this);
            }
        }
    }

    /**
     * This contains one static method to render button.
     *
     * @class NumericButton
     */
    class NumericButton {
        /**
         * Renders numeric button.
         *
         * @function render
         * @static
         * @returns {jQuery}
         */
        static render(direction, icon): JQuery {
            return $('<button type="button" class="btn btn-default" data-direction="' + direction +'"><i class="' + icon + '"></i></button>');
        }
    }
}


