/*
* Test data for demonstration of various timezones and cultures
*/

var American = {
    Culture: "en-US",
    FullLongFormat: "dddd, MMMM d, yyyy h:mm:ss tt",
    FullShortFormat: "M/d/yyyy h:mm tt",
    LongDate: "dddd, MMMM d, yyyy",
    LongTime: "h:mm:ss tt",
    ShortDate: "M/d/yyyy",
    ShortTime: "h:mm tt",
    Timezone: "Pacific Standard Time",
    Offset: -28800000,
    IsDaylight: false,
    OffsetHours: -8
};

var French = {
    Culture: "fr-FR",
    FullLongFormat: "dddd d MMMM yyyy HH:mm:ss",
    FullShortFormat: "dd/MM/yyyy HH:mm",
    LongDate: "dddd d MMMM yyyy",
    LongTime: "HH:mm:ss",
    ShortDate: "dd/MM/yyyy",
    ShortTime: "HH:mm",
    Timezone: "Romance Standard Time",
    Offset: 3600000,
    IsDaylight: false,
    OffsetHours: 1
};

var Spanish = {
    Culture: "es-ES",
    FullLongFormat: "dddd, d' de 'MMMM' de 'yyyy H:mm:ss",
    FullShortFormat: "dd/MM/yyyy H:mm",
    LongDate: "dddd, d' de 'MMMM' de 'yyyy",
    LongTime: "H:mm:ss",
    ShortDate: "dd/MM/yyyy",
    ShortTime: "H:mm",
    Timezone: "Romance Standard Time",
    Offset: 3600000,
    IsDaylight: false,
    OffsetHours: 1
};

var Chinese = {
    Culture: "zh",
    FullLongFormat: "yyyy'年'M'月'd'日' H:mm:ss",
    FullShortFormat: "yyyy/M/d H:mm",
    LongDate: "yyyy'年'M'月'd'日'",
    LongTime: "H:mm:ss",
    ShortDate: "yyyy/M/d",
    ShortTime: "H:mm",
    Timezone: "China Standard Time",
    Offset: 28800000,
    IsDaylight: false,
    OffsetHours: 8
};

var Czech = {
    Culture: "cs-CZ",
    FullLongFormat: "d. MMMM yyyy H:mm:ss",
    FullShortFormat: "d. M. yyyy H:mm",
    LongDate: "d. MMMM yyyy",
    LongTime: "H:mm:ss",
    ShortDate: "d. M. yyyy",
    ShortTime: "H:mm",
    Timezone: "Central Europe Standard Time",
    Offset: 3600000,
    IsDaylight: false,
    OffsetHours: 1
};

var Korean = {
    Culture: "ko",
    FullLongFormat: "yyyy'년' M'월' d'일' dddd tt h:mm:ss",
    FullShortFormat: "yyyy-MM-dd tt h:mm",
    LongDate: "yyyy'년' M'월' d'일' dddd",
    LongTime: "tt h:mm:ss",
    ShortDate: "yyyy-MM-dd",
    ShortTime: "tt h:mm",
    Timezone: "Korea Standard Time",
    Offset: 32400000,
    IsDaylight: false,
    OffsetHours: 9
};

var Russian = {
    Culture: "ru",
    FullLongFormat: "d MMMM yyyy 'г.' H:mm:ss",
    FullShortFormat: "dd.MM.yyyy H:mm",
    LongDate: "d MMMM yyyy 'г.'",
    LongTime: "H:mm:ss",
    ShortDate: "dd.MM.yyyy",
    ShortTime: "H:mm",
    Timezone: "Russian Standard Time",
    Offset: 10800000,
    IsDaylight: false,
    OffsetHours: 3
};

var Canadian = {
    Culture: "fr-CA",
    FullLongFormat: "d MMMM yyyy HH:mm:ss",
    FullShortFormat: "yyyy-MM-dd HH:mm",
    LongDate: "d MMMM yyyy",
    LongTime: "HH:mm:ss",
    ShortDate: "yyyy-MM-dd",
    ShortTime: "HH:mm",
    Timezone: "Eastern Standard Time",
    Offset: -18000000,
    IsDaylight: false,
    OffsetHours: -5
};

var British = {
    Culture: "en-GB",
    FullLongFormat: "dd MMMM yyyy HH:mm:ss",
    FullShortFormat: "dd/MM/yyyy HH:mm",
    LongDate: "dd MMMM yyyy",
    LongTime: "HH:mm:ss",
    ShortDate: "dd/MM/yyyy",
    ShortTime: "HH:mm",
    Timezone: "GMT Standard Time",
    Offset: 0,
    IsDaylight: false,
    OffsetHours: 0
};

var TestUsers = {};
TestUsers["American"] = American;
TestUsers["French"] = French;
TestUsers["Spanish"] = Spanish;
TestUsers["Chinese"] = Chinese;
TestUsers["Czech"] = Czech;
TestUsers["Korean"] = Korean;
TestUsers["Russian"] = Russian;
TestUsers["Canadian"] = Canadian;
TestUsers["British"] = British;

// Current user

var User = TestUsers["British"];

/** Offset
 * =========================================================
 * 0 => 0 Timezone: "UTC"
 * 3600000 => +1 Timezone: "Central Europe Standard Time"
 * 10800000 => +3 Timezone: "Russian Standard Time"
 * 21600000 => +6 Timezone: "Bangladesh Standard Time"
 * -21600000 => -6 Timezone: "Central America Standard Time"
 * -28800000 => -8 Timezone: "Pacific Standard Time"
 */
