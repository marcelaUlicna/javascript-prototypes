/**
 * Created by Marcela on 26. 1. 2015.
 */
/// <reference path="typing/jquery.d.ts" />
/// <reference path="typing/moment.d.ts" />
/// <reference path="Spinner.ts" />

module Numeric {
    var interval;

    /**
     * Interface for all spinner events.
     *
     * @inteface IEvents
     * @param {JQueryEventObject} mousedown - Mousedown event
     * @param {JQueryEventObject} mouseup - Mouseup event
     * @param {JQueryEventObject} mousewheel - Mousewheel event
     * @param {string} changeValue - Increases or decreases input value
    */
    interface IEvents {
        mousedown(e: JQueryEventObject): void;
        mouseup(e: JQueryEventObject): void;
        mousewheel(e: JQueryEventObject): void;
        changeValue(direction: string): void;
    }

    /**
     * Base class that implements IEvents interface. It provides basic implementation
     * of all events. It contains virtual method "changeValue" which is overridden
     * in each inherited class.
     *
     * @class SpinnerEvents
     * @implements {IEvents}
     *
     * @param {Spinner} spinner - Class that contains all necessary properties
     * @param {string} direction - Value "up" or "down" defines increasing or decreasing value
     * @param {string} value - Input value
     * @param {boolean} startDown - Private property that identifies whether mouse down is holding
    */
    export class SpinnerEvents implements IEvents {
        spinner: Spinner;
        direction: string;
        value: string;
        private startDown: boolean = false;

        constructor(spinner: Spinner) {
            this.spinner = spinner;

            this.spinner.inputElement.on("mousewheel", (e: JQueryEventObject) => this[e.type](e));
            this.spinner.buttonElement.on("mousedown mouseup", "button", (e: JQueryEventObject) => this[e.type](e));
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
                value = this.spinner.inputElement.val();

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
         * Mouse wheel event provides changing value.
         * This uses jquery.mousewheel.js library to detect
         * direction of user's mouse wheel.
         *
         * @method mousewheel
         * @param {JQueryEventObject} e - Event handler
         */
        mousewheel(e: JQueryEventObject): void {
            if(this.spinner.scrollable && this.spinner.inputElement.is(":focus")) {
                e.preventDefault();
                var direction = e.deltaY === 1 ? "up" : "down";
                this.changeValue(direction);
            }
        }

        /**
         * Virtual method to be overridden.
         *
         * @param {string} direction - Value "up" or "down" defines increasing or decreasing value
        */
        changeValue(direction: string) {
            throw "Virtual method";
        }
    }

    /*
    * This class provides functionality for NUMBER values. It extends base class
    * and has implemented own method "changeValue".
    *
    * @class NumberSpinner
    * @extends {SpinnerEvents}
    *
    * */
    export class NumberSpinner extends SpinnerEvents {
        constructor(spinner: Spinner) {
            super(spinner);
        }

        /**
         * In class that provides functionality for NUMBER values.
         * This function changes value based on direction and step
         * and rounds value according to precision.
         *
         * @override
         * @method changeValue
         * @param {string} direction - Direction of changing value ("up" for increase, "down" for decrease)
         */
        changeValue(direction: string) {
            var value = Number(this.spinner.inputElement.val()),
                step = this.spinner.step,
                precision = this.spinner.precision;

            if(direction === "up") {
                value += step;
            } else {
                value -= step;
            }

            this.value = value.toFixed(precision);
            this.spinner.inputElement.val(this.value);
        }
    }

    /*
     * This class provides functionality for DATE values. It extends base class
     * and has implemented own method "changeValue". This class needs properties
     * dateFormat to display date in input field and stepUnit to define unit for changing
     * value.
     * Values of dateFormat are based on moment.js date formats, default
     * format is used in en-us date format "MM/DD/YYYY".
     * Values of stepUnit property are days, months or years, default unit is "days".
     *
     * @class NumberSpinner
     * @extends {SpinnerEvents}
     *
     * */
    export class DateSpinner extends SpinnerEvents {
        constructor(spinner: Spinner) {
            super(spinner);
            if(!spinner.dateFormat) {
                spinner.dateFormat = "MM/DD/YYYY";
            }
            if(!spinner.stepUnit) {
                spinner.stepUnit = "days";
            }
        }

        /**
         * In class that provides functionality for DATE values. It extends base class
         * and has implemented own method "changeValue". This class needs properties
         * dateFormat to display date in input field and stepUnit to define unit for changing
         * value.
         * Values of dateFormat are based on moment.js date formats, default
         * format is used in en-us date format "MM/DD/YYYY".
         * Values of stepUnit property are days, months or years, default unit is "days".
         *
         * This function changes value based on direction, unit and step
         * and set new value to input field in custom date format.
         *
         * @override
         * @method changeValue
         * @param {string} direction - Direction of changing value ("up" for increase, "down" for decrease)
         */
        changeValue(direction: string) {
            var value = this.spinner.inputElement.val(),
                momentDate = moment(value),
                format = this.spinner.dateFormat,
                step = this.spinner.step,
                unit = this.spinner.stepUnit;

            if(!momentDate.isValid()) {
                momentDate = moment();
            }

            if(direction === "up") {
                momentDate.add(step, unit)
            } else {
                momentDate.subtract(step, unit);
            }

            this.value = momentDate.format(format);
            this.spinner.inputElement.val(this.value);
        }
    }

    /*
     * This class provides functionality for TIME values. It extends base class
     * and has implemented own method "changeValue". This class needs properties
     * dateFormat to display date in input field and stepUnit to define unit for changing
     * value.
     * Values of dateFormat are based on moment.js date formats, default
     * format is used in en-us time format with 12 hour's cycle "h:mm:ss A".
     * Values of stepUnit property are hours, minutes and seconds, default unit is "hours".
     *
     * @class NumberSpinner
     * @extends {SpinnerEvents}
     *
     * */
    export class TimeSpinner extends SpinnerEvents {
        constructor(spinner: Spinner) {
            super(spinner);
            if(!spinner.dateFormat) {
                spinner.dateFormat = "h:mm:ss A";
            }
            if(!spinner.stepUnit) {
                spinner.stepUnit = "hours";
            }
        }

        /**
         * In class that provides functionality for TIME values. It extends base class
         * and has implemented own method "changeValue". This class needs properties
         * dateFormat to display date in input field and stepUnit to define unit for changing
         * value.
         * Values of dateFormat are based on moment.js date formats, default
         * format is used in en-us time format with 12 hour's cycle "h:mm:ss A".
         * Values of stepUnit property are hours, minutes and seconds, default unit is "hours".
         *
         * This function changes value based on direction, unit and step
         * and set new value to input field in custom time format.
         *
         * @override
         * @method changeValue
         * @param {string} direction - Direction of changing value ("up" for increase, "down" for decrease)
         */
        changeValue(direction: string) {
            var value = this.spinner.inputElement.val(),
                format = this.spinner.dateFormat,
                step = this.spinner.step,
                unit = this.spinner.stepUnit;

            var momentDate = this.assembleMomentDate(value);
            if(direction === "up") {
                momentDate.add(step, unit)
            } else {
                momentDate.subtract(step, unit);
            }

            this.value = momentDate.format(format);
            this.spinner.inputElement.val(this.value);
        }

        /**
         * Since moment.js library does not allow manipulate only with time part of datetime
         * it is necessary to create valid value consisting of date and time.
         * This function assemble new datetime and uses actual value.
         * This is necessary for correct functionality of increasing and
         * decreasing time. Only time part of moment value is used for changing
         * and displaying value in input field.
         *
         * @method assembleMomentDate
         * @param {string} time - Original time value from input field
        * */
        assembleMomentDate(time: string) {
            var today = new Date(),
                momentTime = moment(time, this.spinner.dateFormat);

            if(!momentTime.isValid()) {
                return moment();
            }

            return moment([today.getFullYear(), today.getMonth(), today.getDate(), momentTime.hours(), momentTime.minutes(), momentTime.seconds()]);
        }
    }

    /*
     * This class provides functionality for DATETIME values. It extends base class
     * and has implemented own method "changeValue". This class needs properties
     * dateFormat to display date in input field and stepUnit to define unit for changing
     * value.
     * Values of dateFormat are based on moment.js date formats, default
     * format is used in en-us date time format "MM/DD/YYYY h:mm:ss A".
     * Values of stepUnit property are combination of date and time properties, that is
     * days, months, years, hours, minutes and seconds, default unit is "days".
     *
     * @class NumberSpinner
     * @extends {SpinnerEvents}
     *
     * */
    export class DateTimeSpinner extends SpinnerEvents {
        constructor(spinner: Spinner) {
            super(spinner);
            if(!spinner.dateFormat) {
                spinner.dateFormat = "MM/DD/YYYY h:mm:ss A";
            }
            if(!spinner.stepUnit) {
                spinner.stepUnit = "days";
            }
        }

        /**
         *
         * In class that provides functionality for DATETIME values. It extends base class
         * and has implemented own method "changeValue". This class needs properties
         * dateFormat to display date in input field and stepUnit to define unit for changing
         * value.
         * Values of dateFormat are based on moment.js date formats, default
         * format is used in en-us date time format "MM/DD/YYYY h:mm:ss A".
         * Values of stepUnit property are combination of date and time properties, that is
         * days, months, years, hours, minutes and seconds, default unit is "days".
         * This function changes value based on direction, unit and step
         * and set new value to input field in custom time format.
         *
         * @override
         * @method changeValue
         * @param {string} direction - Direction of changing value ("up" for increase, "down" for decrease)
         */
        changeValue(direction: string) {
            var value = this.spinner.inputElement.val(),
                momentDate = moment(value),
                format = this.spinner.dateFormat,
                step = this.spinner.step,
                unit = this.spinner.stepUnit;

            if(!momentDate.isValid()) {
                momentDate = moment();
            }

            if(direction === "up") {
                momentDate.add(step, unit)
            } else {
                momentDate.subtract(step, unit);
            }

            this.value = momentDate.format(format);
            this.spinner.inputElement.val(this.value);
        }
    }

}