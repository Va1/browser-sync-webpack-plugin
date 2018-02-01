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
  compiler.plugin('watch-run', (watching, callback) => {
    this.isWebpackWatching = true
    callback(null, null)
  })

  compiler.plugin('compilation', () => {
    if (this.isBrowserSyncRunning && this.browserSyncOptions.notify) {
      this.browserSync.notify('Rebuilding...')
    }
  })

  compiler.plugin('done', stats => {
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
  })
}

module.exports = BrowserSyncPlugin
