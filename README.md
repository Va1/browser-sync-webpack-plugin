# [BrowserSync](http://www.browsersync.io/) plugin for [Webpack](http://webpack.github.io/)

Easily use BrowserSync in your Webpack project.

## Install:

```bash
$ npm install --save-dev browser-sync-webpack-plugin
```

## Usage:

In your `webpack.config.js`:

```javascript
var BrowserSyncPlugin = require('extract-text-webpack-plugin');

module.exports = {
    ...
    plugins: [
        new BrowserSyncPlugin({ host: 'localhost', port: 3000, server: { baseDir: ['public'] })
    ]
}
```

BrowserSync will start only when you run Webpack in [watch mode](http://webpack.github.io/docs/tutorials/getting-started/#watch-mode):

```bash
$ webpack --watch
```

## Options:

Plugin accepts any [BrowserSync options](http://www.browsersync.io/docs/options/).

## Licence:

[MIT](http://en.wikipedia.org/wiki/MIT_License)
