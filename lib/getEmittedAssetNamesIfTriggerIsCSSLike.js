function wasCompilationAboutCSS(compiler, expressionConfirmingCompilationWasAboutCSS){
  const { watchFileSystem } = compiler;
  const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher;
  const files = Object.keys(watcher.mtimes);
  return files.every(file => expressionConfirmingCompilationWasAboutCSS.test(file));
}

function CSSEmittedAssetNames(stats) {
  const assets = stats.compilation.assets;
  return Object.keys(assets).filter(fileName => {
    return assets[fileName].emitted && fileName.includes('.css');
  });
}

module.exports = { wasCompilationAboutCSS, CSSEmittedAssetNames }
