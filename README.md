# jQuery range

The powerful jQuery plugin that creates a series of progress bar. <a href="http://amazingsurge.github.io/jquery-range/">Project page and demos</a><br />
Download: <a href="https://github.com/amazingSurge/jquery-range/archive/master.zip">jquery-range-master.zip</a>

***

## Features

* **Different styles support** — range provides a variety of progress bar for user
* **Lightweight size** — 1 kb gzipped

## Dependencies
* <a href="http://jquery.com/" target="_blank">jQuery 1.83+</a>

## Usage

Import this libraries:
* jQuery
* jquery-range.min.js

And CSS:
* range.css - desirable if you have not yet connected one


Create base html element:
```html
	<div class="example">
		<div class="range-single"></div>
	</div>
```

Initialize range:
```javascript
$(".range-single").range({skin: 'skin-1'});
```

Or you can also use <code>input</code>
```html
	<div class="example">
		<form method="post">
			<input class="range-input" type="range" min="0" max="10" name="points" step="0.01" />
			<button class="submit">submit</button>
		</form>
	</div>
```

Initialize range:
```javascript
$(".range-input").range({skin: 'skin-1'});
```

Or initialize tabs with custom settings:
```javascript

$(".range-single").range({
 		namespace: 'range',
        skin: null,
        max: 100,
        min: 0,
        value: [0, 20],
        step: 10,
        pointer: 2,
        limit: true,
        orientation: 'v',
        tip: true,
        scale: false,
        format: function(value) {
            return value;
        },
        onChange: function(instance) {},
        callback: function() {}
});
```

the most important thing is you should set skin value to let plugin load specified skin file

## Settings

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>namespace</td>
            <td>"range"</td>
            <td>Optional property, set a namspace for css class, for example, we have <code>.range_active</code> class for active effect, if namespace set to 'as-range', then it will be <code>.as-range_active</code></td>
        </tr>
        <tr>
            <td>skin</td>
            <td>null</td>
            <td>Compulsory property, set transition effect, it works after you load specified skin file</td>
        </tr>
        <tr>
            <td>max</td>
            <td>100</td>
            <td>Optional property, set the maximum range value of the progress bar</td>
        </tr>
        <tr>
            <td>min</td>
            <td>0</td>
            <td>Optional property, set the initial value of the progress bar</td>
        </tr>
        <tr>
            <td>value</td>
            <td><code>[0,20]</code></td>
            <td>Optional property, set the pointer to the initial position</td>
        </tr>
        <tr>
            <td>step</td>
            <td>10</td>
            <td>Optional property, set up the moving step at a time</td>
        </tr>
        <tr>
            <td>pointer</td>
            <td>2</td>
            <td>Optional property, set the number of pointer</td>
        </tr>
        <tr>
            <td>limit</td>
            <td>true</td>
            <td>Optional property, if true, limit the range of the pointer moving</td>
        </tr>
        <tr>
            <td>orientation</td>
            <td>'v'</td>
            <td>Optional property, set the direction for the progress bar ,'v' for vertical and 'h' for horizontal</td>
        </tr>
		<tr>
            <td>tip</td>
            <td>true</td>
            <td>Optional property, if true, the component of tip will  display and follow the pointer</td>
        </tr>
		<tr>
            <td>scale</td>
            <td>false</td>
            <td>Optional property, if false, the component of scale will be initialized</td>
        </tr>
		<tr>
            <td>format</td>
            <td><code>function(value) {return value;}</code></td>
            <td>Optional property, a function of formatting output </td>
        </tr>
		<tr>
            <td>onChange</td>
            <td><code>function(instance) {}</code></td>
            <td>Optional property, according to your need, it can be as a function of the extended interface</td>
        </tr>  
		<tr>
            <td>callback</td>
            <td><code>function() {}</code></td>
            <td>Optional property, if it's a funciton, will be called when mouseup</td>
        </tr>   
    </tbody>
</table>

## Public methods

jquery range has different methods , we can use it as below :
```javascript

// get the value of pointer
$(".range-single").range("getValue");

// set value
$(".range-single").range("setValue");

// set the range of the progree bar
$(".range-single").range("setInterval");

// add a enable class to range element
$(".range-single").range("enable");

// remove enable class
$(".range-single").range("disable");

// remove range Dom emement and unbound all events 
$(".range-single").range("destroy");

```

## Event / Callback

* <code>change</code>: trigger when the position of pointer is changed
* <code>end</code>: trigger when mouse up

how to use event:
```javascript
p.$element.on('change', function(e, pointer) {
    // pointer means current pointer 
    // some stuff
});
p.$element.on('end', function(e, pointer) {
	//pointer means current pointer
	//some stuff
});
```

## Browser support
jquery-range is verified to work in Internet Explorer 7+, Firefox 2+, Opera 9+, Google Chrome and Safari browsers. Should also work in many others.

Mobile browsers (like Opera mini, Chrome mobile, Safari mobile, Android browser and others) is coming soon.

## Changes

| Version | Notes                                                            |
|---------|------------------------------------------------------------------|
|     ... | ...                                                              |


## Author
[amazingSurge](http://amazingSurge.com)

## License
jQuery-range plugin is released under the <a href="https://github.com/amazingSurge/jquery-range/blob/master/LICENCE.GPL" target="_blank">GPL licence</a>.


