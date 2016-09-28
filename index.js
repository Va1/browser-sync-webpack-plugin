var _ = require('lodash');
var ansiToHtml = require('ansi-to-html');
var convert = new ansiToHtml();
var browserSync = require('browser-sync');

function BrowserSyncPlugin(browserSyncOptions, pluginOptions) {
  var self = this;

  var defaultBrowserSyncOptions = {
    plugins: ['bs-fullscreen-message']
  }

  var defaultPluginOptions = {
    reload: true,
    name: 'bs-webpack-plugin',
    callback: undefined
  };

  self.browserSyncOptions = _.extend({}, defaultBrowserSyncOptions, browserSyncOptions);
  self.options = _.extend({}, defaultPluginOptions, pluginOptions);

  self.browserSync = browserSync.create(self.options.name);
  self.isWebpackWatching = false;
  self.isBrowserSyncRunning = false;
}

BrowserSyncPlugin.prototype.apply = function (compiler) {
  var self = this;

  compiler.plugin('done', function (stats) {
    if (stats.hasErrors() || stats.hasWarnings()) {
      var error = stats.toString('minimal')
      return self.browserSync.sockets.emit('fullscreen:message', {
        title: 'Webpack Error:',
        body: convert.toHtml(error),
      })
    } else {
      if (self.options.reload) {
        self.browserSync.reload();
      }

      return self.browserSync.sockets.emit('fullscreen:message:clear')
    }
  })

  compiler.plugin('watch-run', function (watching, callback) {
    self.isWebpackWatching = true;
    callback(null, null);
  });

  compiler.plugin('compilation', function () {
    if (self.isBrowserSyncRunning) {
      self.browserSync.notify('Rebuilding...');
    }
  });

  compiler.plugin('done', function (stats) {
    if (self.isWebpackWatching) {
      if (!self.isBrowserSyncRunning) {
        if (_.isFunction(self.options.callback)) {
          self.browserSync.init(self.browserSyncOptions, self.options.callback);
        } else {
          self.browserSync.init(self.browserSyncOptions);
        }

        self.isBrowserSyncRunning = true;
      }
    }
  });
};

module.exports = BrowserSyncPlugin;
