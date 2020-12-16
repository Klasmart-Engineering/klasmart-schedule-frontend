const { createMacro, MacroError } = require('babel-plugin-macros');
const { default: template } = require('@babel/template');
const path = require('path');
const { readdirSync, lstatSync, existsSync } = require('fs');

const name = 'contentTypeMacro';
const assetsDir = path.resolve(__dirname, '../src/assets/h5p');
const cacheLibIds = {};
const cacheLibAssets = {};

let libHashExpression;

const contentTypeExpression = template.expression(`
  (function(){
    const libHash = %%libHash%%;
    return libHash[%%libId%%];
  }())
`);

module.exports = createMacro(contentTypeMacro)

function contentTypeMacro({references, state, babel}) {
  references.default.forEach(nodePath => {
    if (nodePath.parent.type !== "CallExpression") return;
    if (nodePath.parent.arguments.length !== 1) throw new MacroError(`${name} should be called with one parameters!`);
    const [libIdExpression] = nodePath.parent.arguments;
    const targetExpression = contentTypeExpression({ libHash: libHashExpression, libId: libIdExpression });
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
  const libraryFile = path.resolve(assetsDir, libraryId, 'library.json');
  const semanticsFile = path.resolve(assetsDir, libraryId, 'semantics.json');
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
  const result = library ? [`${library.machineName}-${library.majorVersion}.${library.minorVersion}`].concat(libIds) : libIds;
  (new Set(libIds)).forEach(libId => {
    result.push(...createDeppendancyLibraries(libId)); 
  })
  cacheLibIds[libraryId] = [...new Set(result)];
  return cacheLibIds[libraryId];
}

function createDependancyAssets(libraryId) {
  const dependancyLibs = createDeppendancyLibraries(libraryId);
  const jsAssets = [];
  const cssAssets = [];
  dependancyLibs.forEach((libId) => {
    const library = require(path.resolve(assetsDir, libId, 'library.json'));
    if (library.preloadedJs) jsAssets.push(...library.preloadedJs.map(x => path.join(libId, x.path)));
    if (library.preloadedCss) cssAssets.push(...library.preloadedCss.map(x => path.join(libId, x.path)));
  });
  return { js: jsAssets, css: cssAssets };
}

function checkAssests(libHash) {
  for (const [id, lib] of Object.entries(libHash)) {
    lib.js.concat(lib.css).forEach(filePath => {
      const assetPath = path.resolve(assetsDir, filePath);
      if(!existsSync(assetPath)) throw new MacroError(`Error: asset ${assetPath} does not exit, but required by library '${id}'`);
    });
  }
}

function onModuleLoad() {
  readdirSync(assetsDir)
    .filter(fileName => fileName !== 'content' && lstatSync(path.resolve(assetsDir, fileName)).isDirectory())
    .forEach((libraryId) => {
      cacheLibAssets[libraryId] = createDependancyAssets(libraryId);
    })
  ;
  checkAssests(cacheLibAssets);
  libHashExpression = template.expression(JSON.stringify(cacheLibAssets))();
}

onModuleLoad();