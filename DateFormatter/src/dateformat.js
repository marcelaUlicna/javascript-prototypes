/**
 * Created by MUlicna on 3/22/2015.
 */
///<reference path="typing/jquery.d.ts" />
///<reference path="typing/moment.d.ts" />
///<reference path="typing/app.d.ts" />
var DateFormatter;
(function (DateFormatter) {
    "use strict";
    var DateConventer = (function () {
        function DateConventer() {
            this.dateFormat = new DateFormat();
        }
        /*
        * Local user time from UTC
        */
        DateConventer.prototype.userTime = function (date) {
            try {
                var offsetMs = date.getTimezoneOffset() * 60000;
                if (moment(date).isDST() && User.IsDaylight) {
                    offsetMs += 3600000;
                }
                offsetMs += User.Offset;
                return new Date(date.getTime() + offsetMs);
            }
            catch (e) {
                return date;
            }
        };
        /*
         * UTC time from local user time
         */
        DateConventer.prototype.utcFromUserTime = function (date) {
            var offsetMs = date.getTimezoneOffset() * 60000;
            try {
                if (moment(date).isDST() && User.IsDaylight) {
                    offsetMs += 3600000;
                }
                return (new Date(date.getTime() - User.Offset - offsetMs));
            }
            catch (e) {
                return date;
            }
        };
        /**
         * Utc time in user format
         */
        DateConventer.prototype.utcUserFormat = function (date, format) {
            return moment(date).format(this.dateFormat.convert(format));
        };
        /**
         * Locale time in user format
         */
        DateConventer.prototype.userTimeAndFormat = function (date, format) {
            var ut = this.userTime(date);
            return moment(ut).format(this.dateFormat.convert(format));
        };
        /**
         * Moment format for user - converts dotnet format to moment one
         */
        DateConventer.prototype.userMomentFormat = function (format) {
            return this.dateFormat.convert(format);
        };
        return DateConventer;
    })();
    DateFormatter.DateConventer = DateConventer;
    // get a list of all tokens on the source that exist on the target,
    // ordered by reverse token length
    var DateFormat = (function () {
        function DateFormat() {
            this.placeholders = [];
            this.dotnet = {
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
            this.moment = {
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
        DateFormat.prototype.convert = function (format) {
            var from = this.dotnet, to = this.moment;
            // create placeholders
            format = this.createPlaceholder(format);
            var sourceTokens = this.getSortedTokens(from, to);
            for (var i = 0; i < sourceTokens.length; i++) {
                format = format.replace(new RegExp(sourceTokens[i].value, "g"), "{" + sourceTokens[i].id + "}");
            }
            for (var j = 0; j < sourceTokens.length; j++) {
                format = format.replace(new RegExp("\\{" + sourceTokens[j].id + "\\}", "g"), to[sourceTokens[j].key]);
            }
            for (var k = 0; k < this.placeholders.length; k++) {
                format = format.replace("_" + k, this.placeholders[k]);
            }
            return format;
        };
        // replace dotnet placeholder ' placeholder ' to moment placeholder [ placeholder ]
        DateFormat.prototype.createPlaceholder = function (token) {
            var ret = [];
            if (/'/.test(token)) {
                ret = token.match(/'(.*?)'/g);
            }
            this.placeholders = ret.map(function (p) {
                return "[" + p.substring(1, p.length - 1) + "]";
            });
            for (var i = 0; i < ret.length; i++) {
                token = token.replace(ret[i], "_" + i);
            }
            return token;
        };
        DateFormat.prototype.getSortedTokens = function (sourceDefinition, targetDefinition) {
            var tokens = [];
            var id = 0;
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
        };
        return DateFormat;
    })();
    DateFormatter.DateFormat = DateFormat;
})(DateFormatter || (DateFormatter = {}));
(function (window) {
    formatConventer = new DateFormatter.DateConventer();
})(window);
//# sourceMappingURL=dateformat.js.map