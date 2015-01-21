/**
 * Created by Marcela on 20. 1. 2015.
 */

/// <reference path="js/jquery.d.ts" />

/*
* @module Numeric
*/
module Numeric {
    /**
     * Numeric spiner interface - declare default properties.
     *
     * @interface INumericSpiner
     * @param {boolean} scrollable - Add and subtract value by mouse scrolling
     * @param {number} precision - Number precision
     * @param {number} step - How much to increase or decrease the value
     */
    interface INumericSpiner {
        scrollable: boolean;
        precision: number;
        step: number;
    }

    /**
     * Initial class that sets defaults from options.
     *
     * @class Spiner
     * @param {SpinerEvent} spinerEvent - Reference to class with plugin logic
     */
    export class Spiner {
        spinerEvent: SpinerEvent;

        constructor(element: JQuery, options: INumericSpiner) {
            var settings: INumericSpiner = {
                scrollable:  options && options.scrollable ? options.scrollable : false,
                precision: options && options.precision ? options.precision : 0,
                step: options && options.step ? options.step : 1
            };

            this.spinerEvent = new Numeric.SpinerEvent(element, settings);
        }
    }

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
    export class SpinerEvent {
        element: JQuery;
        numberPicker: JQuery;
        settings: INumericSpiner;
        value: string;
        private startDown: boolean = false;

        constructor(element: JQuery, settings: INumericSpiner) {
            this.element = element;
            this.settings = settings;

            this.value = this.element.val() || 0;
            this.element.val(this.value);
            this.element.addClass("form-control spiner");

            this.numberPicker = $('<div class="input-group-btn-vertical"/>');
            this.numberPicker
                .append(NumericButton.render("up", "fa fa-caret-up"))
                .append(NumericButton.render("down", "fa fa-caret-down"));

            this.element.after(this.numberPicker);

            this.element.on("mousewheel", (e: JQueryEventObject) => this[e.type](e));
            this.numberPicker.on("mousedown mouseup", "button", (e: JQueryEventObject) => this[e.type](e));
        }

        /**
        * Mouse wheel event provides changing value.
         * This uses jquery.mousewheel.js library to detect
         * direction of user's mouse wheel.
         *
         * @method mousewheel
         * @param {JQueryEventObject} e - Event handler
        */
        mousewheel(e: JQueryEventObject): void {
            if(this.settings.scrollable && this.element.is(":focus")) {
                e.preventDefault();
                var direction = e.deltaY === 1 ? "up" : "down";
                this.changeValue(direction);
            }
        }

        /**
         * Mouse down event sets property startDown to true
         * and calls 'changeValue' function.
         * The call is produced repeatedly until
         * event 'mouseup' occurs.
         *
         * @method mousedown
         * @param {JQueryEventObject} e - Event handler
         */
        mousedown(e: JQueryEventObject): void {
            this.startDown = true;
            var el = $(e.target).closest('button'),
                direction = el.attr('data-direction'),
                value = this.element.val();

            if(!isNaN(value) && value !== this.value) {
                this.value = value;
            }

            this.changeValue(direction);
            interval = setInterval(() => this.changeValue(direction), 400);
        }

        /**
         * Mouse up event sets property startDown to false
         * and clears interval.
         *
         * @method mouseup
         * @param {JQueryEventObject} e - Event handler
         */
        mouseup(e: JQueryEventObject): void {
            this.startDown = false;
            clearInterval(interval);
        }

        /**
        * This function changes value based on direction and step
        * and rounds value according to precision.
        *
        * @method changeValue
        * @param {string} direction - Direction of changing value ("up" for increase, "down" for decrease)
        */
        changeValue(direction: string): void {
            var value = Number(this.value),
                step = this.settings.step,
                precision = this.settings.precision;

            if(direction === "up") {
                value += step;
            } else {
                value -= step;
            }

            this.value = value.toFixed(precision);
            this.element.val(value.toString());
        }
    }

    /**
    * This contains one static method to render button.
    *
    * @class NumericButton
    */
    export class NumericButton {
        /**
        * Renders numeric button.
        *
        * @function render
        * @static
        */
        static render(direction, icon): JQuery {
            return $('<button class="btn btn-default" data-direction="' + direction +'"><i class="' + icon + '"></i></button>');
        }
    }
}