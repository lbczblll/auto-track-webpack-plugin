# auto-track-webpack-plugin

For automatic buried points based on the button permissions, only supports Vue2.

## Installation

### NPM

```
npm i -D auto-track-webpack-plugin
```

## Import

### ES6/TypeScript

```js
import { AutoTrackPlugin } from 'auto-track-webpack-plugin';
```

### CJS

```js
const { AutoTrackPlugin } = require('auto-track-webpack-plugin');
```

## Usage

**vue.config.js**

```js
module.exports = defineConfig({
  configureWebpack: {
    plugins: [new AutoTrackPlugin({ buriedPoint: 'this.$common.buriedFun' })]
  }
});
```

## Options

### `buriedPoint`

The buried point function will insert the inside of the click event based on the button permissions.

## Examples

This is a page that needs to be buried.
<img src="https://github.com/lbczblll/auto-track-webpack-plugin/screenshots/build_before.jpg" />
And use the plugin.

<img src="https://github.com/lbczblll/auto-track-webpack-plugin/screenshots/build_example.jpg" />
