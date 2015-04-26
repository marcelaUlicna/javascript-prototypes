/**
 * Created by MUlicna on 3/22/2015.
 */

/// #source 1 1 /dateFormat.js
/// external component to convert .net / momentjs datetime formats
/// https://github.com/stevegreatrex/DateFormat

///<reference path="typing/jquery.d.ts" />
///<reference path="typing/moment.d.ts" />
///<reference path="typing/app.d.ts" />

module DateFormatter {
    "use strict";


    /**
     * This is a main class of whole component. Initializes plugin with public methods.
     *
     * @class DateConventer
     * @property {DateFormat} dateFormat - Momentjs and .NET formats
     */
    export class DateConventer {
        dateFormat: DateFormat;

        constructor(){
            this.dateFormat = new DateFormat();
        }

        /**
        * Converts UTC date time to local
         *
         * @method userTime
         *
         * @param {Date} date - Date object in UTC
         * @returns {Date} - Date time in local timezone
        */
        userTime(date: Date): Date {
            // make sure that object User exists
            try {
                var offsetMs = date.getTimezoneOffset() * 60000;
                if (moment(date).isDST() && User.IsDaylight) {
                    offsetMs += 3600000;
                }
                offsetMs += User.Offset;
                return new Date(date.getTime() + offsetMs);
            } catch (e) {
                return date;
            }
        }

        /**
         * Converts local date time to UTC
         *
         * @method utcFromUserTime
         *
         * @param {Date} date - Date object in local date time
         * @returns {Date} - UTC date time
         */
        utcFromUserTime(date: Date): Date {
            var offsetMs = date.getTimezoneOffset() * 60000;
            try {
                if (moment(date).isDST() && User.IsDaylight) {
                    offsetMs += 3600000;
                }
                return (new Date(date.getTime() - User.Offset - offsetMs));
            } catch (e) {
                return date;
            }
        }

        /**
         * Gets string representation of date time based on user format
         *
         * @method utcUserFormat
         * @param {Date} date - Date time object
         * @param {string} format - User date time format
         * @param {string} [local] - Local code to localize days and months
         * @returns {string} - Date time in string format
         */
        utcUserFormat(date: Date, format: string, local?: string): string {
            var actualDate = moment(date);
            if(local && local.length) {
                actualDate.locale(local);
            }
            return actualDate.format(this.dateFormat.convert(format));
        }

        /**
         * Converts UTC to local date time and gets string format representation
         * of local date time based on user format
         *
         * @method userTimeAndFormat
         * @param {Date} date - Date time object in UTC
         * @param {string} format - User date time format
         * @param {string} [local] - Local code to localize days and months
         * @returns {string} - Date time in string format
         */
        userTimeAndFormat(date: Date, format: string, local?: string): string {
            var ut = this.userTime(date),
                actualDate = moment(ut);

            if(local && local.length) {
                actualDate.locale(local);
            }
            return actualDate.format(this.dateFormat.convert(format));
        }

        /**
         * Momentjs format for user - converts .NET format to momentjs one
         *
         * @method userMomentFormat
         * @param {string} format - .NET date time format
         * @returns {string} - Date time string format in momentjs format
         */
        userMomentFormat(format: string): string {
            return this.dateFormat.convert(format);
        }
    }


    /**
     * Token placeholder object for replacing the parts of format strings
     * in .NET format to momentjs date time format
     *
     * @interface IToken
     *
     * @property {string} value
     * @property {string} key
     * @property {number} id
    */
    export interface IToken {
        value: string;
        key: string;
        id: number;
    }

    /**
     * Get a list of all tokens on the source that exist on the target,
     * ordered by reverse token length
     *
     * @class DateFormat
     * @property {string[]} placeholders - Array of string that are not a part of date, e.g. ' de ' in spanish date time format
    */
    export class DateFormat {
        placeholders: string[] = [];

        /**
         * Converts .NET format to momentjs format
         *
         * @method convert
         * @param {string} format - .NET format
         * @returns {string} - momentjs format
        */
        convert(format: string): string {
            var from = this.dotnet,
                to = this.moment;

            // create placeholders
            format = this.createPlaceholder(format);

            var sourceTokens = this.getSortedTokens(from, to);

            for (var i = 0; i < sourceTokens.length; i++) {
                format = format.replace(
                    new RegExp(sourceTokens[i].value, "g"),
                    "{" + sourceTokens[i].id + "}");
            }

            for (var j = 0; j < sourceTokens.length; j++) {
                format = format.replace(
                    new RegExp("\\{" + sourceTokens[j].id + "\\}", "g"),
                    to[sourceTokens[j].key]);
            }

            // replace placeholder with origin placeholder format
            for(var k = 0; k < this.placeholders.length; k++) {
                format = format.replace("_" + k, this.placeholders[k]);
            }

            return format;
        }

        /**
         * Replaces .NET placeholder ' placeholder ' to momentjs placeholder [ placeholder ]
         *
         * @method createPlaceholder
         * @private
         * @param {string} token - Token from .NET string format surrounded by commas, e.g. ' de '
         * @returns {string} - Placeholder that cannot be determined as a part of the date time format
        */
        private createPlaceholder(token: string): string {
            var ret: string[] = [];

            if ( /'/.test( token ) ){
                ret = token.match( /'(.*?)'/g );
            }

            this.placeholders = ret.map((p) => {
                return "[" + p.substring(1, p.length - 1) + "]";
            });

            for(var i = 0; i < ret.length; i++) {
                token = token.replace(ret[i], "_" + i);
            }

            return token;
        }

        /**
         * Gets tokens to be repalces
         *
         * @method getSortedTokens
         * @private
         * @param {any} sourceDefinition - .NET array definitions
         * @param {any} targetDefinition - momentjs array definitions
         * @returns {IToken[]} - Array of tokens that is used for converting to momentjs format
        */
        private getSortedTokens(sourceDefinition: any, targetDefinition: any): IToken[]{
            var tokens: IToken[] = [];
            var id: number = 0;

            for (var key in sourceDefinition) {
                if (!sourceDefinition.hasOwnProperty(key)) {
                    continue;
                }

                //skip things that we can't replace
                if (!targetDefinition[key]) {
                    continue;
                }

                tokens.push({
                    value: sourceDefinition[key],
                    key: key,
                    id: id++
                });
            }

            tokens.sort(function (lhs, rhs) {
                return rhs.value.length - lhs.value.length;
            });

            return tokens;
        }

        private dotnet = {
            "day-of-month-1": "d",
            "day-of-month-2": "dd",
            "day-of-week-abbr": "ddd",
            "day-of-week": "dddd",
            "month-1": "M",
            "month-2": "MM",
            "month-name-abbr": "MMM",
            "month-name": "MMMM",
            "year-2": "yy",
            "year-3": "yyy",
            "year-4": "yyyy",
            "am-pm-2": "tt",
            "am-pm-1": "t",
            "time-24h-1": "H",
            "time-24h-2": "HH",
            "time-12h-1": "h",
            "time-12h-2": "hh",
            "minutes-1": "m",
            "minutes-2": "mm",
            "seconds-1": "s",
            "seconds-2": "ss",
            "deciseconds-optional": "F",
            "centiseconds-optional": "FF",
            "milliseconds-optional": "FFF",
            "microseconds-optional": "FFFF",
            "nanoseconds-optional": "FFFFF",
            "picoseconds-optional": "FFFFFF",
            "femtoseconds-optional": "FFFFFFF",
            "deciseconds": "f",
            "centiseconds": "ff",
            "milliseconds": "fff",
            "microseconds": "ffff",
            "nanoseconds": "fffff",
            "picoseconds": "ffffff",
            "femtoseconds": "fffffff",
            "timezone-1": "z",
            "timezone-2": "zz",
            "timezone-3": "zzz"
        };

        private moment = {
            "day-of-month-1": "D",
            "day-of-month-2": "DD",
            "day-of-week-abbr": "ddd",
            "day-of-week": "dddd",
            "month-1": "M",
            "month-2": "MM",
            "month-name-abbr": "MMM",
            "month-name": "MMMM",
            "year-2": "YY",
            "year-3": "YYY",
            "year-4": "YYYY",
            "am-pm-2": "A",
            "am-pm-1": "a",
            "time-24h-1": "H",
            "time-24h-2": "HH",
            "time-12h-1": "h",
            "time-12h-2": "hh",
            "minutes-1": "m",
            "minutes-2": "mm",
            "seconds-1": "s",
            "seconds-2": "ss",
            "deciseconds-optional": "S",
            "centiseconds-optional": "SS",
            "milliseconds-optional": "SSS",
            "microseconds-optional": "SSSS",
            "nanoseconds-optional": "SSSSS",
            "picoseconds-optional": "SSSSSS",
            "femtoseconds-optional": "SSSSSSS",
            "deciseconds": "S",
            "centiseconds": "SS",
            "milliseconds": "SSS",
            "microseconds": "SSSS",
            "nanoseconds": "SSSSS",
            "picoseconds": "SSSSSS",
            "femtoseconds": "SSSSSSS",
            "timezone-1": "Z",
            "timezone-2": "ZZ",
            "timezone-3": "ZZZ"
        };
    }
}

(function(window){
    formatConventer = new DateFormatter.DateConventer();
})(window);
