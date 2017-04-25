var _ = require('lodash');
var browserSync = require('browser-sync');

function BrowserSyncPlugin(browserSyncOptions, pluginOptions) {
  var self = this;

  var defaultPluginOptions = {
    reload: true,
    name: 'bs-webpack-plugin',
    callback: undefined
  };

  self.browserSyncOptions = _.extend({}, browserSyncOptions);
  self.options = _.extend({}, defaultPluginOptions, pluginOptions);

  self.browserSync = browserSync.create(self.options.name);
  self.isWebpackWatching = false;
  self.isBrowserSyncRunning = false;
}

BrowserSyncPlugin.prototype.apply = function (compiler) {
  var self = this;

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

    // assets contains all the compiled assets
    var assets = _.keys(stats.compilation.assets),
        isCSS = _(assets)
          // organize the assets for cleaner use
          .map(function(asset){
            return {
              name: asset,
              emitted: stats.compilation.assets[asset].emitted
            }
          })
          // remove asset files that have not been emitted
          .filter(function(asset){ return asset.emitted })
          // true if all assets contain .css, false for anything else (.js, .img, etc)
          .every(function(asset){
            return asset.name.match('.css') !== null;
          });

    if (self.isWebpackWatching) {
      if (self.isBrowserSyncRunning) {
        if (self.options.reload) {
          if (isCSS)
            // inject css if all compiled assets are css
            self.browserSync.reload('*.css');
          else
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
