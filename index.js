var _ = require('lodash');
var stripAnsi = require('strip-ansi');
var browserSync = require('browser-sync');

function BrowserSyncPlugin(browserSyncOptions, pluginOptions) {
  var self = this;

  var defaultPluginOptions = {
    reload: true,
    name: 'bs-webpack-plugin',
    callback: undefined,
    plugins: ['bs-fullscreen-message']
  };

  self.browserSyncOptions = _.extend({}, browserSyncOptions);
  self.options = _.extend({}, defaultPluginOptions, pluginOptions);

  self.browserSync = browserSync.create(self.options.name);
  self.isWebpackWatching = false;
  self.isBrowserSyncRunning = false;
}

BrowserSyncPlugin.prototype.apply = function (compiler) {
  var self = this;

  compiler.plugin('done', function (stats) {
    if (stats.hasErrors() || stats.hasWarnings()) {
      return self.browserSync.sockets.emit('fullscreen:message', {
        title: 'Webpack Error:',
        body: stripAnsi(stats.toString()),
        timeout: 100000
      })
    }
    self.browserSync.reload()
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
      if (self.isBrowserSyncRunning) {
        if (self.options.reload) {
          self.browserSync.reload();
        }
      } else {
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
