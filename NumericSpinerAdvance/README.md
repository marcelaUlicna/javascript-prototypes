# Advanced numeric spinner

This is jQuery plugin written in TypeScript that allows users simply increase and decrease a number value at input field. It extends simple Numeric spinner component with date and time functionality.

### Requirements
* bootstrap.css
* font-awesome.css
* numeric.spiner.css
* jquery-2.1.1.js
* jquery.mousewheel.js
* numeric.spinner.advance.js

### References
* Style references
```
<link href="lib/css/bootstrap.css" rel="stylesheet" />
<link href="lib/css/font-awesome.css" rel="stylesheet">
<link href="numeric.spiner.css" rel="stylesheet">
```

* javascript references
```javascript
<script src="lib/js/jquery-2.1.1.js"></script>
<script src="lib/js/jquery.mousewheel.js"></script>
<script src="numeric.spinner.advance.js"></script>
```

### Usage
* Basic usage
```javascript
var spinner = new Numeric.Spinner($("#spinner"));
```

* Using options
```javascript
var spinner = new Numeric.Spinner($("#spinner"), {
  step: 10,
  spinnerType: Numeric.NumberSpinner,
  width: 200,
  scrollable: true,
  min: 0
});
```

### Options
Plugin contains several options to customize component.
* `spinnerType` - defines the type of input data (number or date)
  - namespace: `Numeric`
  - options: `NumberSpinner`, `DateSpinner`, `TimeSpinner`, `DateTimeSpinner`
  - default: `NumberSpinner`
* `precision` - defines the precision of number in input field, for `NumberSpinner` type
  - type: `number`
  - default: `0`
* `scrollable` - defines whether value in input field should be changed by scrolling the mouse wheel when element has focus
  - type: `boolean`
  - default: `false`
* `width` - the with of input element
  - type: `number`
  - default: `90`
* `step` - defines the step of changing value
  - type: `number`
  - default: `1`
* `dateFormat` - defines string of date format for all types except `NumberSpinner` type
  - type: `string`
  - default:
    - `DateSpinner` - MM/DD/YYYY
    - `TimeSpinner` - h:mm:ss A
    - `DateTimeSpinner` - MM/DD/YYYY h:mm:ss A
* `stepUnit` - defines the part of date or time that is used for increasing and decreasing the value, for all types except `NumberSpinner` type
  - type: `enum`
  - namespace: `Numeric`
  - options: `StepUnit.Days`, `StepUnit.Months`, `StepUnit.Years`, `StepUnit.Hours`, `StepUnit.Minutes`, `StepUnit.Seconds`
  - default:
    - `DateSpinner` - StepUnit.Days
    - `TimeSpinner` - StepUnit.Hours
    - `DateTimeSpinner` - StepUnit.Days
* `min` - minimum value
  - type: `number` or `string`, depends on spinner type
  - default: not specified
* `max` - maximum value
  - type: `number` or `string`, depends on spinner type
  - default: not specified
* `valueChanged(newValue)` - function which is called once value in input field is changed. Parameter contains actual (changed) value
  - type: `function`
  - default: empty
  - example:
  
    ````javascript
    var spinner = new Numeric.Spinner($("#spinner"), {
            step: 10,
            spinnerType: Numeric.NumberSpinner,
            width: 200,
            scrollable: true,
            valueChanged: function(newValue) {
                var actualValue = newValue;
                // do stuff with actual value
            }
        });
    ````
