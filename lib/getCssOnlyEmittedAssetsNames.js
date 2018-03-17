const { get } = require('lodash')

function getCssOnlyEmittedAssetsNames (stats) {
  const assetsStatsMapping = get(stats, 'compilation.assets', {})
  const assetsNames = Object.keys(assetsStatsMapping)
  const emittedAssetsNames = assetsNames.filter(assetName => get(assetsStatsMapping, [assetName, 'emitted'], false))
  const isCssOnlyEmission = emittedAssetsNames.every(assetName => assetName.includes('.css'))

  return isCssOnlyEmission && emittedAssetsNames
}

module.exports = getCssOnlyEmittedAssetsNames
