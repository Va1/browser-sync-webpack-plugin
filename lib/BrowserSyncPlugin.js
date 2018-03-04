const { extend, isFunction } = require('lodash')
const browserSync = require('browser-sync')
const isCssOnlyEmission = require('./isCssOnlyEmission')

function BrowserSyncPlugin(browserSyncOptions, pluginOptions) {
  const defaultPluginOptions = {
    reload: true,
    name: 'bs-webpack-plugin',
    callback: undefined,
    injectCss: false
  }

  this.browserSyncOptions = extend({}, browserSyncOptions)
  this.options = extend({}, defaultPluginOptions, pluginOptions)

  this.browserSync = browserSync.create(this.options.name)
  this.isWebpackWatching = false
  this.isBrowserSyncRunning = false
}

BrowserSyncPlugin.prototype.apply = function (compiler) {

  const watchCb = (watching, callback) => {
    this.isWebpackWatching = true
    callback(null, null)
  };

  const compilationCb = () => {
    if (this.isBrowserSyncRunning && this.browserSyncOptions.notify) {
      this.browserSync.notify('Rebuilding...')
    }
  };

  const doneCb = stats => {
    if (this.isWebpackWatching) {
      if (this.isBrowserSyncRunning) {
        if (this.options.reload) {
          if (this.options.injectCss && isCssOnlyEmission(stats)) {
            this.browserSync.reload('*.css')
          } else {
            this.browserSync.reload()
          }
        }
      } else {
        if (isFunction(this.options.callback)) {
          this.browserSync.init(this.browserSyncOptions, this.options.callback)
        } else {
          this.browserSync.init(this.browserSyncOptions)
        }

        this.isBrowserSyncRunning = true
      }
    }
  };

  if (compiler.hooks) {
    compiler.hooks.watchRun.tapAsync('BrowserSyncPlugin', watchCb);

    compiler.hooks.compilation.tap('BrowserSyncPlugin', compilationCb);

    compiler.hooks.done.tap('BrowserSyncPlugin', doneCb);
  } else {
    compiler.plugin('watch-run', watchCb);

    compiler.plugin('compilation', compilationCb);

    compiler.plugin('done', doneCb);
  }
}

module.exports = BrowserSyncPlugin
