# [BrowserSync](http://www.browsersync.io/) plugin for [Webpack](http://webpack.github.io/)

Easily use BrowserSync in your Webpack project.

## Install:

```bash
$ npm install --save-dev browser-sync-webpack-plugin
```

## Usage:

BrowserSync will start only when you run Webpack in [watch mode](http://webpack.github.io/docs/tutorials/getting-started/#watch-mode):

```bash
$ webpack --watch
```

### Basic:

In your `webpack.config.js`:

```javascript
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    // ...
    plugins: [
        new BrowserSyncPlugin({
          host: 'localhost',
          port: 3000,
          server: { baseDir: ['public'] }
        })
    ]
}
```

### Advanced:

In your `webpack.config.js`:

```javascript
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    // ...
    plugins: [
        new BrowserSyncPlugin(
          // browserSync options
          // http://www.browsersync.io/docs/options/
          {
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['public'] }
          },
          // plugin options
          {
            // browserSync instance name
            // http://www.browsersync.io/docs/api/#api-name
            name: 'my-awesome-bs-instance',
            // browserSync instance init callback
            // http://www.browsersync.io/docs/api/#api-cb
            callback: function () {
              console.log('browserSync started!');
            },
            // determines if browserSync should take care
            // of reload (defaults to true). switching it off
            // might be useful if you combine this plugin
            // with webpack-dev-server to reach
            // Hot Loader/Hot Module Replacement tricks
            reload: true,

            // Configure the browserSync instance by calling "use" with the supplied value(s).
            // eg. use: require('browser-sync-spa')()
            use: function || [function]
          }
        )
    ]
}
```

## Contributing:

Feel free to open issues to propose stuff and participate. Pull requests are also welcome.

## Licence:

[MIT](http://en.wikipedia.org/wiki/MIT_License)
