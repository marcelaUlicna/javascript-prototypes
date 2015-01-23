# Numeric spiner

This is jQuery plugin allow users simply increase and decrease a number value at input field. Moreover, there is supported changing value by scrolling the mouse wheel. Component is written as jQuery plugin as well as TypeScript plugin.

### Requirements
* bootstrap.css
* font-awesome.css
* numeric.spiner.css
* jquery-2.1.1.js
* jquery.mousewheel.js
* numeric.spiner.js (jQuery plugin)
* numeric.plugin.js (javascript plugin generated from TypeScript)

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
```

### jQuery plugin
* add references on plugin
```javascript 
<script src="numeric.spiner.js"></script>
```
* create plugin
```javascript
$("#spiner").spiner();
```

### TypeScript plugin
* add references on plugin
```javascript 
<script src="numeric.plugin.js"></script>
```
* create plugin
```javascript
var spiner = new Numeric.Spiner($("#spinerPlugin"));
```
* create plugin with settings
```javascript
var spiner = new Numeric.Spiner($("#spinerPlugin"), {
    scrollable: true,
    step: 0.02,
    precision: 2
});
```
