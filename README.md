# [BrowserSync](https://browsersync.io/) plugin for [Webpack](https://webpack.js.org/)

Easily use BrowserSync in your Webpack project.

## Install:

```bash
$ npm install --save-dev browser-sync-webpack-plugin
```
or
```bash
$ yarn add --dev browser-sync-webpack-plugin
```

With release of 2.0.0 the plugin is expected to be used in Node v4+ environment.
Support for Node v3 and lower was dropped, but you can install and use the plugin version of 1.2.0 in older environments.

## Usage:

BrowserSync will start only when you run Webpack in [watch mode](http://webpack.github.io/docs/tutorials/getting-started/#watch-mode):

```bash
$ webpack --watch
```

### Basic:

If you're not using Webpack Dev Server, you can make BrowserSync to serve your project.
The setup is pretty easy: just pass the [BrowserSync options](http://www.browsersync.io/docs/options/) to the plugin as the first argument.

In your `webpack.config.js`:

```javascript
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
  // ...
  plugins: [
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['public'] }
    })
  ]
}
```

### Advanced:

The advanced usage is about using [Webpack Dev Server](https://github.com/webpack/webpack-dev-server) with BrowserSync in order to use awesome features of both.

To achieve this, BrowserSync offers the [proxy](http://www.browsersync.io/docs/options/#option-proxy) option.
So, basically, you are about to proxy the output from the Webpack Dev Server through BrowserSync to get the best out of both.

In your `webpack.config.js`:

```javascript
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
  // ...
  plugins: [
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:3100/)
        // through BrowserSync
        proxy: 'http://localhost:3100/'
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: false
      }
    )
  ]
}
```

---

Other supported plugin options are:

* `name` - default: `bs-webpack-plugin`, BrowserSync [instance name](http://www.browsersync.io/docs/api/#api-name)
* `callback` - default: `undefined`, BrowserSync [instance init callback](http://www.browsersync.io/docs/api/#api-cb).
* `injectCss` - default: `false`, allows BrowserSync to inject changes inplace instead of reloading the page when changed chunks are all CSS files

## Contributing:

Feel free to open issues to propose stuff and participate. Pull requests are also welcome.

## Licence:

[MIT](http://en.wikipedia.org/wiki/MIT_License)
