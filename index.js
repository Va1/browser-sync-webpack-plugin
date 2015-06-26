var browserSync = require('browser-sync');


function Plugin(options) {
  var self = this;
  self.options = options;
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
        browserSync.reload();
      } else {
        browserSync(self.options);
        self.browserSyncIsRunning = true;
      }
    }
  });
};

module.exports = Plugin;
