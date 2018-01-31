const { get } = require('lodash')

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

module.exports = isCssOnlyEmission
