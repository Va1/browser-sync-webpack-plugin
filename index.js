const { extend, get, isFunction } = require('lodash')
const browserSync = require('browser-sync')

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

function isCssOnlyEmission(stats) {
  const assetsStatsMapping = get(stats, 'compilation.assets', {})
  const assetsNames = Object.keys(assetsStatsMapping)

  return (
    assetsNames
      .map(assetName => ({ name: assetName, wasEmitted: get(assetsStatsMapping, [assetName, 'emitted'], false) }))
      .filter(asset => asset.wasEmitted)
      .every(asset => asset.name.includes('.css'))
  )
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
