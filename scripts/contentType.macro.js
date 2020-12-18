const { createMacro, MacroError } = require('babel-plugin-macros');
const { default: template } = require('@babel/template');
const path = require('path');
const { readdirSync, lstatSync, existsSync } = require('fs');
const { stringLiteral } = require('@babel/types');

const name = 'contentTypeMacro';
const publicDir = path.resolve(__dirname, '../public/h5p');
const librariesDir = path.resolve(publicDir, 'libraries');
const coreDir = path.resolve(publicDir, 'core');
const cacheLibIds = {};
const cacheLibAssets = {};

let libHashExpression;
let coreAssetsExpression;

const contentTypeExpression = template.expression(`
  (function(){
    const libHash = %%libHash%%;
    const core = %%coreAssets%%;
    const library = {
      scripts: core.scripts.concat(libHash[%%libId%%].scripts),
      styles: core.styles.concat(libHash[%%libId%%].styles),
    };
    return { core, library };
  }())
`);

const requireExpression = template.expression(`require(%%path%%)`);

module.exports = createMacro(contentTypeMacro)

function contentTypeMacro({references, state, babel}) {
  references.default.forEach(nodePath => {
    if (nodePath.parent.type !== "CallExpression") return;
    if (nodePath.parent.arguments.length !== 1) throw new MacroError(`${name} should be called with one parameters!`);
    const [libIdExpression] = nodePath.parent.arguments;
    const targetExpression = contentTypeExpression({ libHash: libHashExpression, libId: libIdExpression, coreAssets: coreAssetsExpression });
    nodePath.parentPath.replaceWith(targetExpression);
  })
}

function semanticsForEach(semantics, handler) {
  semantics.forEach((semanticItem) => {
    switch(semanticItem.type) {
      case 'list':
        return semanticsForEach([semanticItem.field], handler);
      case 'group':
        return semanticsForEach(semanticItem.fields, handler);
      default:
        return handler(semanticItem);
    }
  });
};

function createDeppendancyLibraries(libraryId) {
  if (cacheLibIds[libraryId]) return cacheLibIds[libraryId];
  const libraryFile = path.resolve(librariesDir, libraryId, 'library.json');
  const semanticsFile = path.resolve(librariesDir, libraryId, 'semantics.json');
  if (!existsSync(libraryFile)) {
    throw new MacroError(`${semanticsFile} not exist!`)
  }
  const library = require(libraryFile);
  const semantics = existsSync(semanticsFile) ? require(semanticsFile) : [];
  const { preloadedDependencies = [] } = library;
  const libIds = preloadedDependencies.map(x => `${x.machineName}-${x.majorVersion}.${x.minorVersion}`);
  semanticsForEach(semantics, (item) => {
    if (item.type === 'library') {
      libIds.push(...item.options.map(name => name.replace(' ', '-')));
    }; 
  });
  const result = library ? libIds.concat([`${library.machineName}-${library.majorVersion}.${library.minorVersion}`]) : libIds;
  (new Set(libIds)).forEach(libId => {
    result.unshift(...createDeppendancyLibraries(libId)); 
  })
  cacheLibIds[libraryId] = [...new Set(result)];
  return cacheLibIds[libraryId];
}

function relative(...pathList) {
    return path.relative(publicDir, path.resolve(...pathList));
}

function createDependancyAssets(libraryId) {
  const dependancyLibs = createDeppendancyLibraries(libraryId);
  const scripts = [];
  const styles = [];
  dependancyLibs.forEach((libId) => {
    const library = require(path.resolve(librariesDir, libId, 'library.json'));
    if (library.preloadedJs) scripts.push(...library.preloadedJs.map(x => relative(librariesDir, libId, x.path)));
    if (library.preloadedCss) styles.push(...library.preloadedCss.map(x => relative(librariesDir, libId, x.path)));
  });
  return { scripts, styles };
}

function createCoreDependencyAssets() {
  const coreAssets = require(path.resolve(coreDir, 'asset.json'));
  const scripts = coreAssets.scripts.map(filePath => relative(coreDir, filePath));
  const styles = coreAssets.styles.map(filePath => relative(coreDir, filePath));
  return { scripts, styles };
}

function resolveAssetsExpression(assetsExpression) {
  assetsExpression.properties.forEach(theObjectProperty => {
    const prefix = theObjectProperty.key.name === 'styles' ? '!!file-loader!extract-loader!css-loader!' : '!!file-loader!';
    const elements = theObjectProperty.value.elements.map(theStringLiteral => {
      return requireExpression({ path: stringLiteral(`${prefix}${theStringLiteral.value}`) })
    });
    theObjectProperty.value.elements = elements;
  })
}

function checkAssests(libHash) {
  for (const [id, lib] of Object.entries(libHash)) {
    lib.scripts.concat(lib.styles).forEach(filePath => {
      const assetPath = path.resolve(publicDir, filePath);
      if(!existsSync(assetPath)) throw new MacroError(`Error: asset ${assetPath} does not exit, but required by '${id}'`);
    });
  }
}

function onModuleLoad() {
  readdirSync(librariesDir)
    .filter(fileName => fileName !== 'content' && lstatSync(path.resolve(librariesDir, fileName)).isDirectory())
    .forEach((libraryId) => {
      cacheLibAssets[libraryId] = createDependancyAssets(libraryId);
    })
  ;
  const coreAssets = createCoreDependencyAssets();
  checkAssests(cacheLibAssets);
  checkAssests({ core: coreAssets });
  libHashExpression = template.expression(JSON.stringify(cacheLibAssets))();
  coreAssetsExpression = template.expression(JSON.stringify(coreAssets))();
}

onModuleLoad();