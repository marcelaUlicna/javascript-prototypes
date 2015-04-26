# Date converter

The main reason for writing date converter plugin is that client side components often use momentjs library for manipulating with dates. Unfortunately, C# string representation of date based on user culture is not compatible with momentjs formats that javascript componets such as bootstrap datepicker utilize. This plugin provides two basic functionality:
* converts dotnet date/time formats to momentjs ones
* converts local time to utc and vise versa
* additionaly provides localization of date/time based on momentjs library

### Object User
For the correct functionality of plugin it is necessary to create global object `User` with following properties:
* `IsDaylight` [boolean] - the culture daylight
* `Offset` [number] - offset from utc timezone in milliseconds

Example of getting offset in C#:
```c#
TimeZoneInfo tz = TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time");
double offset = tz.BaseUtcOffset.TotalMilliseconds;
```


Example of `User` object for `Pacific Standard Time` timezone (offset in hours: -8)
```javascript
var User = {
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
```

### Functions
#### userTime(date: Date): Date
Convers utc time to local time.

Takes a javascript utc `Date` object.

Returns javascript `Date` object in local time.

#### utcFromUserTime(date: Date): Date
Convers local time to utc.

Takes a javascript local `Date` object.

Returns javascript `Date` object in utc.

#### utcUserFormat(date: Date, format: string): string
Takes a javascript `Date` object and `string` format.

Returns `string` representation of utc date in defined format.

#### userTimeAndFormat(date: Date, format: string): string
Takes a javascript `Date` object and `string` format.

Returns `string` representation of local date based on `User` timezone in defined format.

#### userMomentFormat(format: string): string
Converts dotnet date/time format to moment one.

Takes a dotnet format `string`.

Returns moment format `string`.


### Usage
* javascript references:
```javascript
<script src="lib/js/jquery-2.1.1.js"></script>
<script src="lib/js/moment.js"></script>
<script src="lib/js/moment-with-locales.js"></script> <!--optional-->
<script src="dist/dateformat.js"></script>
```

* call functions - namespace `formatConventer`
```javascript
// convert dotnet format to momentjs format
var dotnetFormat = "dddd, MMMM d, yyyy h:mm:ss tt";
var momentFormat = formatConventer.userMomentFormat(dotnetFormat); 
    // => "dddd, MMMM D, YYYY h:mm:ss A"

// examples for Pacific Standard Time (-8 hours):
// Note: not necessary convert to momentjs format, it is implemented in plugin.
var utcDateString = "2015-03-17 10:41:00.0000000 +00:00";
var date = new Date(utcDateString);
var localDate = formatConventer.userTime(date); 
    // => Tue Mar 17 2015 02:41:00 GMT-0800 (Pacific Standard Time)
var localStringDate = formatConventer.userTimeAndFormat(date, dotnetFormat) 
    // => "Tuesday, March 17, 2015 2:41:00 AM"
```

* use moment locales - necessary to include moment-with-locales.js
```javascript
var spanishDotnetFormat = "dddd, d' de 'MMMM' de 'yyyy";
var spanishDate = formatConventer.userTimeAndFormat(new Date(), spanishDotnetFormat, "es-ES")
    // => domingo, 26 de abril de 2015
```
