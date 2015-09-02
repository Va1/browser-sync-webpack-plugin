var _ = require('lodash');
var browserSync = require('browser-sync');

function Plugin(browserSyncOptions, options) {
  var self = this;

  var defaultOptions = {
    reload: true,
    name: 'bs-webpack-plugin',
    callback: undefined
  };

  self.browserSyncOptions = _.extend({}, browserSyncOptions);
  self.options = _.extend({}, defaultOptions, options);

  self.browserSync = browserSync.create(self.options.name);
  self.webpackIsWatching = false;
  self.browserSyncIsRunning = false;
}

Plugin.prototype.apply = function (compiler) {
  var self = this;

  compiler.plugin('watch-run', function (watching, callback) {
    self.webpackIsWatching = true;
    callback(null, null);
  });

  compiler.plugin('done', function (stats) {
    if (self.webpackIsWatching) {
      if (self.browserSyncIsRunning) {
        if (self.options.reload) {
          self.browserSync.reload();
        }
      } else {
        if (_.isFunction(self.options.callback)) {
          self.browserSync.init(self.browserSyncOptions, self.options.callback);
        } else {
          self.browserSync.init(self.browserSyncOptions);
        }

        self.browserSyncIsRunning = true;
      }
    }
  });
};

module.exports = Plugin;
