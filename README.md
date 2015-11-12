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

## Overview:

It is important to understand how the combination of Webpack and BrowserSync actually serve your site.
Even though the BrowserSync plugin is installed in Webpack, the Webpack Dev Server is still the one serving your site.
And that is good, because it provides you with hot module reloading and other goodness.

### So what about BrowserSync then?

The main point in having BrowserSync in the mix is to add its capability of syncing browsers
without losing all the goodness delivered by the Webpack Dev Server.

To achive this BrowserSync offers the `proxy` option. So basically we are proxying the output from the Webpack Dev Server
through BrowserSync to get the best out of both.

### Basic:

In your `webpack.config.js`:

```javascript
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    // ...
    plugins: [
        new BrowserSyncPlugin({
          // browse to http://localhost:3000 during develpment
          host: 'localhost',
          port: 3000,
          // proxy the webpack dev server endpoint
          // through BrowserSync 
          proxy: 'http://localhost:8080/'
        },
        {
          // let webpack dev server take care
          // of the automatic and hot reloading
          reload: false
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
            // browse to http://localhost:3000 during develpment
            host: 'localhost',
            port: 3000,
            // proxy the webpack dev server endpoint
            // through BrowserSync 
            proxy: 'http://localhost:8080/'
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
            reload: false
          }
        )
    ]
}
```

## iFrame:

Another interesting option is to proxy a complete different site through BrowserSync.
If this other site is hosting your site via an iFrame you still get all the goodness
from Webpack Dev Server and BrowserSync while developing your site within its final
container. Isn't that amazing ;)

## Contributing:

Feel free to open issues to propose stuff and participate. Pull requests are also welcome.

## Licence:

[MIT](http://en.wikipedia.org/wiki/MIT_License)
