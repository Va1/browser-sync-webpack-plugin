const { every, filter, get, keys } = require('lodash')

function isCssOnlyEmission (stats) {
  const assetsStatsMapping = get(stats, 'compilation.assets', {})
  const assetsNames = keys(assetsStatsMapping)

  const emittedAssetsNames = filter(assetsNames, assetName =>
    get(assetsStatsMapping, [assetName, 'emitted'], false)
  )

  const isCssOnly = every(emittedAssetsNames, assetName =>
    assetName.includes('.css')
  )

  return isCssOnly && emittedAssetsNames
}

module.exports = isCssOnlyEmission
