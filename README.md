# [jQuery asRange](https://github.com/amazingSurge/jquery-asRange) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jquery plugin to convert input into range slider.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-asRange.js
├── jquery-asRange.es.js
├── jquery-asRange.min.js
└── css/
    ├── asRange.css
    └── asRange.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-asRange/master/dist/jquery-asRange.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-asRange/master/dist/jquery-asRange.min.js) - minified

#### Install From Bower
```sh
bower install jquery-asRange --save
```

#### Install From Npm
```sh
npm install jquery-asRange --save
```

#### Install From Yarn
```sh
yarn add jquery-asRange
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-asRange.git
cd jquery-asRange
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-asRange` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/asRange.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-asRange.js"></script>
```

#### Required HTML structure

```html
<input class="example" type="range" min="0" max="10" name="points" step="0.01" />
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.example').asRange(); 
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-asRange/tree/master/examples).

## Options
`jquery-asRange` can accept an options object to alter the way it behaves. You can see the default options by call `$.asRange.setDefaults()`. The structure of an options object is as follows:

```
{
  namespace: 'asRange',
  skin: null,
  max: 100,
  min: 0,
  value: null,
  step: 10,
  limit: true,
  range: false,
  direction: 'h', // 'v' or 'h'
  keyboard: true,
  replaceFirst: false, // false, 'inherit', {'inherit': 'default'}
  tip: true,
  scale: true,
  format(value) {
    return value;
  }
}
```


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
            <td>"asRange"</td>
            <td>Optional property, set a namspace for css class, for example, we have <code>.asRange_active</code> class for active effect, if namespace set to 'as-range', then it will be <code>.as-range_active</code></td>
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
            <td><code>null</code></td>
            <td>Optional property, set the pointer to the initial position</td>
        </tr>
        <tr>
            <td>step</td>
            <td>10</td>
            <td>Optional property, set up the moving step at a time</td>
        </tr>
        <tr>
            <td>limit</td>
            <td>true</td>
            <td>Optional property, if true, limit the range of the pointer moving</td>
        </tr>
        <tr>
            <td>range</td>
            <td>false</td>
            <td>Optional property, if true, allow to set min and max</td>
        </tr>
        <tr>
            <td>direction</td>
            <td>'v'</td>
            <td>Optional property, set the direction for the progress bar ,'v' for vertical and 'h' for horizontal</td>
        </tr>
        <tr>
            <td>keyboard</td>
            <td>true</td>
            <td>Optional property, if true, allow to change value using keyboard</td>
        </tr>
        <tr>
            <td>replaceFirst</td>
            <td>false</td>
            <td>Optional property, set the default value when value is set as min.</td>
        </tr>
        <tr>
            <td>tip</td>
            <td>true</td>
            <td>Optional property, if true, the component of tip will  display and follow the pointer</td>
        </tr>
        <tr>
            <td>scale</td>
            <td>Object</td>
            <td>Optional property, values means the value you want to add to scale; gap means how many parts you want to division between value; grid means how many small parts in the part</td>
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
    </tbody>
</table>

## Methods
Methods are called on asRange instances through the asRange method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().asRange('destroy');

// or
var api = $().data('asRange');
api.destroy();
```

#### val(value)
Set the range if value is defined or get the value.
```javascript
// set the val
$().asRange('val', '5');

// get the val
var value = $().asRange('val');
```

#### set(value)
Set the range value.
```javascript
$().asRange('set', '5');
```

#### get()
Get the range value.
```javascript
var value = $().asRange('get');
```

#### enable()
Enable the range functions.
```javascript
$().asRange('enable');
```

#### disable()
Disable the range functions.
```javascript
$().asRange('disable');
```

#### destroy()
Destroy the range instance.
```javascript
$().asRange('destroy');
```

## Events
`jquery-asRange` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('asRange::ready', function (e) {
  // on instance ready
});

```

Event   | Description
------- | -----------
init    | Fires when the instance is setup for the first time.
ready   | Fires when the instance is ready for API use.
enable  | Fires immediately when the `enable` instance method has been called.
disable | Fires immediately when the `disable` instance method has been called.
change  | Fires when the position of pointer is changed.
end     | Fires when mouse up.
destroy | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.asRange.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-asRange.js"></script>
<script>
  $.asRange.noConflict();
  // Code that uses other plugin's "$().asRange" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-asRange` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-asRange` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-asRange/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-asRange.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-asRange/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-asRange.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-asRange
[license]: https://img.shields.io/npm/l/jquery-asRange.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-asRange.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-asRange
