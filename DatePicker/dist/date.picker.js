/**
 * Created by Marcela on 14. 2. 2015.
 */
/// <reference path="typing/jquery.d.ts" />
/// <reference path="typing/moment.d.ts" />
/// <reference path="typing/spinner.d.ts" />
var Datepicker;
(function (Datepicker) {
    var UIPicker = (function () {
        function UIPicker(element, options) {
            var _this = this;
            this.showNavigation = true;
            this.showDateInput = true;
            this.showTimeInput = true;
            this.dateFormat = "MM/DD/YYYY";
            this.timeFormat = "h:mm A";
            this.wholeFormat = "MM/DD/YYYY h:mm A";
            this.uuid = "picker_" + new Date().getTime();
            this.element = element;
            this.element.addClass("ui-datetime-edit").attr("data-picker", "pick");
            var date = element[0].innerText || element.val(), today = moment(), current = moment(date);
            this.currentDate = current.isValid() ? current : null;
            this.selectedDate = current.isValid() ? current : today;
            $.extend(this, options);
            this.wholeFormat = this.showDateInput && this.showTimeInput ? this.dateFormat + " " + this.timeFormat : this.dateFormat;
            this.pickerInst = new Picker(this, this.uuid);
            this.pickerEvents = new PickerEvents(this, this.element);
            this.element.on("click", function () { return _this.element.next(".ui-datetime").toggleClass("hide"); });
            $(document).on("mousedown", function (e) { return _this.externalClick(e); });
        }
        UIPicker.prototype.externalClick = function (e) {
            var instUuid, pickerInstUuid, target = $(e.target), picker = target.closest(".ui-datetime"), openedPickers = $(".ui-datetime:visible");
            if (target.hasClass("ui-datetime-edit")) {
                pickerInstUuid = target.next(".ui-datetime").attr("data-inst");
                this.closePickers(openedPickers, pickerInstUuid);
                return;
            }
            if (picker && picker.length) {
                instUuid = picker.attr("data-inst");
            }
            this.closePickers(openedPickers, instUuid);
        };
        UIPicker.prototype.closePickers = function (pickers, uuid) {
            pickers.each(function (index, pic) {
                if ($(pic).attr("data-inst") != uuid) {
                    $(pic).addClass("hide");
                }
            });
        };
        return UIPicker;
    })();
    Datepicker.UIPicker = UIPicker;
    /* Picker.ts */
    var Picker = (function () {
        function Picker(picker, uuid) {
            this.picker = picker;
            this.element = picker.element;
            this.pickerElement = $("<div class='picker-dropdown ui-datetime hide' data-inst='" + uuid + "'/>");
            this.element.after(this.pickerElement);
            // Navigation
            if (this.picker.showNavigation) {
                this.renderNavigation();
            }
            this.pickerElement.append($('<div class="picker-datetime-body" />'));
            // Date/Time input
            if (this.picker.showDateInput) {
                this.renderDateTimeInput();
            }
            // Inline picker
            this.renderInlinePicker();
        }
        Picker.prototype.renderNavigation = function () {
            this.pickerElement.append($("<div />").addClass("header-nav").css("margin-top", "5px"));
            new Navigation(this.picker, this.pickerElement);
        };
        Picker.prototype.renderDateTimeInput = function () {
            this.inputPickerInst = new PickerInput(this.picker, this.pickerElement);
        };
        Picker.prototype.renderInlinePicker = function () {
            this.inlinePickerInst = new InlinePicker(this.picker, this.pickerElement);
        };
        return Picker;
    })();
    Datepicker.Picker = Picker;
    /* Navigation.ts */
    var Navigation = (function () {
        function Navigation(picker, parent) {
            var _this = this;
            this.date = new Date().getDate().toString();
            this.templates = {
                "today": [
                    "<div class='nav-icon' data-action='today'>",
                    "   <span class='fa-stack fa-lg' title='Today'>",
                    "       <i class='fa fa-calendar-o fa-stack-2x'></i>",
                    "       <i class='fa fa-stack-1x fa-today'>" + this.date + "</i>",
                    "   </span>",
                    "</div>"
                ].join(""),
                "tomorrow": [
                    "<div class='nav-icon simple-icon' data-action='tomorrow'>",
                    "   <i class='fa fa-sun-o fa-2x' title='Tomorrow'></i>",
                    "</div>"
                ].join(""),
                "week": [
                    "<div class='nav-icon' data-action='week'>",
                    "   <span class='fa-stack fa-lg' title='Next week'>",
                    "       <i class='fa fa-calendar-o fa-stack-2x'></i>",
                    "       <i class='fa fa-angle-double-right fa-stack-1x fa-next-week'></i>",
                    "   </span>",
                    "</div>"
                ].join(""),
                "month": [
                    "<div class='nav-icon simple-icon' data-action='month'>",
                    "   <i class='fa fa-moon-o fa-2x' title='In 1 month'></i>",
                    "</div>"
                ].join("")
            };
            this.picker = picker;
            this.parent = parent.find(".header-nav");
            this.render();
            this.parent.on('click', 'i', function (e) { return _this.click(e); });
        }
        Navigation.prototype.click = function (e) {
            e.stopPropagation();
            var actionName = $(e.target).closest('.nav-icon').attr("data-action");
            this[actionName]();
        };
        Navigation.prototype.today = function (e) {
            this.setNewDate(moment());
        };
        Navigation.prototype.tomorrow = function (e) {
            var tomorrow = moment().add(1, "day");
            this.setNewDate(tomorrow);
        };
        Navigation.prototype.week = function (e) {
            var nextWeek = moment().add(7, "day");
            this.setNewDate(nextWeek);
        };
        Navigation.prototype.month = function (e) {
            var nextMonth = moment().add(1, "month");
            this.setNewDate(nextMonth);
        };
        Navigation.prototype.setNewDate = function (date) {
            var selectedDate = this.picker.currentDate;
            this.picker.currentDate = moment([date.year(), date.month(), date.date(), selectedDate.hour(), selectedDate.minute(), selectedDate.second()]);
            this.picker.pickerEvents.setLabel(this.picker.currentDate);
            this.picker.pickerEvents.setInput(this.picker.currentDate);
            this.picker.pickerInst.inlinePickerInst.markNewDateSelected();
        };
        Navigation.prototype.render = function () {
            this.parent.append($(this.templates.today)).append($(this.templates.tomorrow)).append($(this.templates.week)).append($(this.templates.month));
        };
        return Navigation;
    })();
    Datepicker.Navigation = Navigation;
    /* PickerInput.ts */
    var PickerInput = (function () {
        function PickerInput(picker, parent) {
            this.templates = {
                "dateInput": [
                    '<table class="input-picker-datetime">',
                    '   <thead>',
                    '       <tr>',
                    '           <th>Date</th>',
                    '       </tr>',
                    '   </thead>',
                    '   <tbody>',
                    '       <tr>',
                    '           <td>',
                    '               <input class="ui-datetime-date ui-datetime-single-input form-control spinner" type="text" data-picker-action="wheelDate" data-picker-event="mousewheel" data-picker-action2="changeDate" data-picker-event2="change">',
                    '           </td>',
                    '       </tr>',
                    '   </tbody>',
                    '</table>'
                ].join(""),
                "dateTimeInput": [
                    '<table class="input-picker-datetime">',
                    '   <thead>',
                    '       <tr>',
                    '           <th>Date</th>',
                    '           <th>Time</th>',
                    '       </tr>',
                    '   </thead>',
                    '   <tbody>',
                    '       <tr>',
                    '           <td>',
                    '               <input class="ui-datetime-date form-control" type="text" data-picker-action="wheelDate" data-picker-event="mousewheel" data-picker-action2="changeDate" data-picker-event2="change">',
                    '           </td>',
                    '           <td>',
                    '               <input class="ui-datetime-time form-control" type="text" data-picker-action="wheelTime" data-picker-event="mousewheel" data-picker-action2="changeTime" data-picker-event2="change">',
                    '           </td>',
                    '       </tr>',
                    '   </tbody>',
                    '</table>'
                ].join("")
            };
            this.picker = picker;
            this.parent = parent;
            if (this.picker.showDateInput && this.picker.showTimeInput) {
                this.renderDateTime();
            }
            else {
                this.renderSimpleInput();
            }
        }
        PickerInput.prototype.renderDateTime = function () {
            var _this = this;
            this.parent.find(".picker-datetime-body").append($(this.templates.dateTimeInput));
            this.dateInput = this.parent.find(".ui-datetime-date");
            this.timeInput = this.parent.find(".ui-datetime-time");
            var currentDate = this.picker.currentDate, dateFormat = this.picker.dateFormat, timeFormat = this.picker.timeFormat;
            this.dateInput.val(currentDate.format(dateFormat));
            this.timeInput.val(currentDate.format(timeFormat));
            new Numeric.Spinner(this.dateInput, {
                spinnerType: Numeric.DateSpinner,
                scrollable: true,
                width: 100,
                dateFormat: dateFormat,
                valueChanged: function (actualValue) {
                    _this.valueDateChanged(actualValue);
                }
            });
            new Numeric.Spinner(this.timeInput, {
                spinnerType: Numeric.TimeSpinner,
                scrollable: true,
                width: 100,
                dateFormat: timeFormat,
                valueChanged: function (actualValue) {
                    _this.valueTimeChanged(actualValue);
                }
            });
        };
        PickerInput.prototype.renderSimpleInput = function () {
            var _this = this;
            this.parent.find(".picker-datetime-body").append($(this.templates.dateInput));
            this.dateInput = this.parent.find(".ui-datetime-single-input");
            var currentDate = this.picker.currentDate, dateFormat = this.picker.dateFormat, inputWidth = this.dateInput.width();
            this.dateInput.val(currentDate.format(dateFormat));
            new Numeric.Spinner(this.dateInput, {
                spinnerType: Numeric.DateSpinner,
                scrollable: true,
                width: inputWidth,
                dateFormat: dateFormat,
                valueChanged: function (actualValue) {
                    _this.valueDateChanged(actualValue);
                }
            });
        };
        PickerInput.prototype.valueDateChanged = function (actualValue) {
            var currentDate = this.picker.currentDate, newTime = moment(actualValue, this.picker.dateFormat);
            this.picker.currentDate = moment([newTime.year(), newTime.month(), newTime.date(), currentDate.hour(), currentDate.minute()]);
            this.picker.pickerEvents.setLabel(this.picker.currentDate);
            this.picker.pickerInst.inlinePickerInst.markNewDateSelected();
        };
        PickerInput.prototype.valueTimeChanged = function (actualValue) {
            var currentDate = this.picker.currentDate, newTime = moment(actualValue, this.picker.timeFormat);
            this.picker.currentDate = moment([currentDate.year(), currentDate.month(), currentDate.date(), newTime.hour(), newTime.minute()]);
            this.picker.pickerEvents.setLabel(this.picker.currentDate);
        };
        return PickerInput;
    })();
    Datepicker.PickerInput = PickerInput;
    /* InlinePicker.ts */
    var InlinePicker = (function () {
        function InlinePicker(picker, parent) {
            var _this = this;
            this.helper = new Helpers();
            this.templates = {
                "header": [
                    '<div class="ui-datepicker-header">',
                    '   <a class="ui-datepicker-prev" data-handler="prev" data-event="click" title="{{previous}}">',
                    '       <span class="">{{prev}}</span>',
                    '   </a>',
                    '   <a class="ui-datepicker-next" data-handler="next" data-event="click" title="{{next}}">',
                    '       <span class="">{{next}}</span>',
                    '   </a>',
                    '   <div class="ui-datepicker-title">',
                    '       <span class="ui-datepicker-month">{{month}}</span>&nbsp;',
                    '       <span class="ui-datepicker-year">{{year}}</span>',
                    '   </div>',
                    '</div>'
                ].join(""),
                "tableRowHead": function () {
                    var row = $('<tr />');
                    _this.helper.DaysShortMin.forEach(function (name, index) {
                        var fullName = _this.helper.Days[index];
                        var cell = $('<th><span title="' + fullName + '">' + name + '</span></th>');
                        if (index === 0 || index === 6) {
                            cell.addClass("ui-datepicker-week-end");
                        }
                        row.append(cell);
                    });
                    return $('<thead />').append(row);
                },
                "tableBody": function () {
                    var selectedDate = _this.picker.selectedDate, firstDay = moment(selectedDate.format("YYYY/MM/DD")).startOf("month"), dayInWeek = firstDay.day(), daysInMonth = selectedDate.daysInMonth(), dayIndex = 1;
                    var body = $('<tbody />');
                    for (var i = 0; i < 6; i++) {
                        var row = $('<tr />'), classEmpty = dayIndex > daysInMonth ? "ui-picker-empty" : "";
                        for (var j = 0; j < 7; j++) {
                            if (i == 0 && j < dayInWeek || dayIndex > daysInMonth) {
                                row.append($('<td class="ui-datepicker-other-month ui-datepicker-unselectable">&nbsp;</td>'));
                            }
                            else {
                                var cellTd = $('<td data-handler="selectDay" data-event="click" data-month="' + selectedDate.month() + '" data-year="' + selectedDate.year() + '" data-day="' + dayIndex + '" />');
                                var cellDay = $('<a class="ui-state-default" href="#">' + dayIndex + '</a>');
                                row.append(cellTd.append(cellDay));
                                dayIndex++;
                            }
                        }
                        body.append(row);
                        // row count according to content
                        if (dayIndex > daysInMonth)
                            i = 6;
                    }
                    return body;
                }
            };
            this.picker = picker;
            this.parent = parent;
            if (this.picker.showDateInput) {
                this.dateInput = this.parent.find(".ui-datetime-date");
            }
            if (this.picker.showTimeInput) {
                this.timeInput = this.parent.find(".ui-datetime-time");
            }
            this.element = $('<div class="inline-picker" />');
            this.render();
        }
        InlinePicker.prototype.fillHeaderDict = function () {
            var date = this.picker.selectedDate, dateMonthIndex = date.month(), dateYear = date.year();
            return {
                "next": this.helper.Next,
                "prev": this.helper.Prev,
                "previous": this.helper.Previous,
                "month": this.helper.Months[dateMonthIndex],
                "year": dateYear
            };
        };
        InlinePicker.prototype.render = function () {
            this.headerDict = this.fillHeaderDict();
            this.element.append($(Helpers.fmt(this.templates.header, this.headerDict))).append($('<table class="ui-datepicker-calendar" />').append(this.templates.tableRowHead()).append(this.templates.tableBody()));
            this.parent.find(".picker-datetime-body").append(this.element);
            this.markSelected();
            this.attachDatetimeHandlers();
        };
        InlinePicker.prototype.attachDatetimeHandlers = function () {
            var _this = this;
            this.element.find("[data-handler]").map(function (index, el) {
                var handler = {
                    prev: function () { return _this.changeMonth(-1); },
                    next: function () { return _this.changeMonth(1); },
                    selectDay: function (e) { return _this.selectDate(e); }
                };
                $(el).on(el.getAttribute("data-event"), handler[el.getAttribute("data-handler")]);
            });
        };
        InlinePicker.prototype.markSelected = function () {
            this.element.find('.ui-datepicker-selected-day').removeClass('ui-datepicker-selected-day');
            var selector, currentDate = this.picker.currentDate, selectedDate = this.picker.selectedDate, today = moment();
            if (currentDate && currentDate.month() == selectedDate.month() && currentDate.year() == selectedDate.year()) {
                selector = '[data-day="' + currentDate.date() + '"]';
            }
            else if (!currentDate && selectedDate.month() == today.month() && selectedDate.year() == today.year()) {
                selector = '[data-day="' + today.date() + '"]';
            }
            this.element.find(selector).addClass('ui-datepicker-selected-day');
        };
        InlinePicker.prototype.markNewDateSelected = function () {
            this.element.find('.ui-datepicker-selected-day').removeClass('ui-datepicker-selected-day');
            var selectedDate = this.picker.currentDate, year = selectedDate.year(), month = selectedDate.month(), day = selectedDate.date();
            this.element.find("[data-month=" + month + "][data-year=" + year + "][data-day=" + day + "]").addClass("ui-datepicker-selected-day");
        };
        InlinePicker.prototype.changeMonth = function (offset) {
            if (offset === 0)
                return;
            var selectedDate = this.picker.selectedDate, year = selectedDate.year(), nextMonth = selectedDate.month() + offset;
            if (nextMonth > 11) {
                nextMonth = 0;
                ++year;
            }
            else if (nextMonth < 0) {
                nextMonth = 11;
                --year;
            }
            this.picker.selectedDate = moment([year, nextMonth, selectedDate.date(), selectedDate.hour(), selectedDate.minute(), selectedDate.second()]);
            this.parent.find(".inline-picker").empty();
            this.render();
        };
        InlinePicker.prototype.selectDate = function (e) {
            var cell = $(e.target).closest('td');
            if (cell.hasClass("ui-datepicker-selected-day")) {
                return;
            }
            this.element.find(".ui-datepicker-selected-day").removeClass("ui-datepicker-selected-day");
            cell.addClass("ui-datepicker-selected-day");
            var selectedDate = this.picker.selectedDate, year = cell.attr("data-year"), month = cell.attr("data-month"), day = cell.attr("data-day");
            this.picker.selectedDate = moment([year, month, day, selectedDate.hour(), selectedDate.minute(), selectedDate.second()]);
            this.picker.currentDate = this.picker.selectedDate;
            this.picker.pickerEvents.setLabel(this.picker.currentDate);
            this.picker.pickerEvents.setInput(this.picker.currentDate);
        };
        return InlinePicker;
    })();
    Datepicker.InlinePicker = InlinePicker;
    /* PickerEvents.ts*/
    var PickerEvents = (function () {
        function PickerEvents(picker, element) {
            this.picker = picker;
            this.element = element;
            this.pickerElement = element.next('.ui-datetime');
        }
        PickerEvents.prototype.setLabel = function (date) {
            var el = this.element[0], label = date.format(this.picker.wholeFormat);
            if (label === "Invalid date") {
                label = this.formatCorrection(date, this.picker.wholeFormat);
            }
            if (el.tagName === "INPUT") {
                $(el).val(label);
            }
            else {
                el.innerText = label;
            }
        };
        PickerEvents.prototype.setInput = function (date) {
            var dateInputFormat = date.format(this.picker.dateFormat), timeInputFormat = date.format(this.picker.timeFormat);
            if (this.picker.showDateInput) {
                if (dateInputFormat === "Invalid date") {
                    dateInputFormat = this.formatCorrection(date, this.picker.dateFormat);
                }
                this.pickerElement.find('input.ui-datetime-date').val(dateInputFormat);
            }
            if (this.picker.showTimeInput) {
                if (timeInputFormat === "Invalid date") {
                    timeInputFormat = this.formatCorrection(date, this.picker.timeFormat);
                }
                this.pickerElement.find('input.ui-datetime-time').val(timeInputFormat);
            }
        };
        PickerEvents.prototype.formatCorrection = function (date, mFormat) {
            var momentCorrection = moment([date.year(), date.month(), date.date(), date.hour(), date.minute()]);
            return momentCorrection.format(mFormat);
        };
        return PickerEvents;
    })();
    Datepicker.PickerEvents = PickerEvents;
    /* Helpers.ts */
    var Helpers = (function () {
        function Helpers() {
            this.Months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];
            this.MonthsShort = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ];
            this.Days = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ];
            this.DaysShort = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat"
            ];
            this.DaysShortMin = [
                "Su",
                "Mo",
                "Tu",
                "We",
                "Th",
                "Fr",
                "Sa"
            ];
            this.Next = "Next";
            this.Prev = "Prev";
            this.Previous = "Previous";
        }
        Helpers.fmt = function (template, dict) {
            return template.replace(/\{\{(.*?)\}\}/g, function (match, key) {
                var value = dict, keys = key.split(".");
                for (var i = 0, length = keys.length; i < length; i++) {
                    if (typeof value === "undefined" || value === null) {
                        break;
                    }
                    value = value[keys[i]];
                }
                return typeof value === "undefined" ? "" : value;
            });
        };
        return Helpers;
    })();
    Datepicker.Helpers = Helpers;
})(Datepicker || (Datepicker = {}));
//# sourceMappingURL=date.picker.js.map