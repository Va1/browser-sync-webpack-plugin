const { extend } = require("lodash");
const browserSync = require("browser-sync");
const isCssOnlyEmission = require("./isCssOnlyEmission");

const defaultPluginOptions = {
  reload: true,
  name: "bs-webpack-plugin",
  callback: undefined,
  injectCss: true
};

class BrowserSyncPlugin {
  constructor(browserSyncOptions, pluginOptions) {
    this.browserSyncOptions = extend({}, browserSyncOptions);
    this.options = extend({}, defaultPluginOptions, pluginOptions);

    this.browserSync = browserSync.create(this.options.name);
    this.isWebpackWatching = false;
    this.isBrowserSyncRunning = false;
  }

  apply(compiler) {
    compiler.hooks.watchRun.tap(BrowserSyncPlugin.name, compiler => {
      this.isWebpackWatching = true;
    });

    compiler.hooks.compilation.tap(BrowserSyncPlugin.name, () => {
      if (this.isBrowserSyncRunning && this.browserSyncOptions.notify) {
        this.browserSync.notify("Rebuilding...");
      }
    });

    compiler.hooks.done.tap(BrowserSyncPlugin.name, stats => {
      if (!this.isWebpackWatching) return;

      if (!this.isBrowserSyncRunning) {
        this.browserSync.init(this.browserSyncOptions, this.options.callback);
        this.isBrowserSyncRunning = true;
      }

      if (this.options.reload) {
        this.browserSync.reload(
          this.options.injectCss && isCssOnlyEmission(stats)
        );
      }
    });
  }
}

module.exports = BrowserSyncPlugin;
