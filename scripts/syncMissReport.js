const parser = require("@babel/parser");
const { default: traverse } = require('@babel/traverse');
const { default: generate } = require('@babel/generator');
const { default: template } = require('@babel/template');
const { isIdentifier, callExpression, importSpecifier, identifier } = require('@babel/types');
const fs  = require('fs');
const path = require('path');
const prettier = require("prettier");
const glob = require('glob');

const prettierConfig = prettier.resolveConfig.sync(path.resolve(__dirname, '../.prettierrc'));
const projectDir = path.resolve(__dirname, '..');
const srcFileGlob =  'src/**/*.{js,jsx,ts,tsx}';
const ignoreGlob = 'src/locale/**/*.*';
const REPORT_MISS_FN_NAME = 'reportMiss';
const DEFINE_FN_NAME = 'd';
const TRANSLATE_FN_NAME = 't';
const REPORT_MISS_REGEX = new RegExp(`\\b${REPORT_MISS_FN_NAME}\\b`);
const REPORT_MISS_FILE_PATH_REGEX = /\/locale\/LocaleManager\b/;

/**
 * @param {string} filePath 
 * @param {(info: { id: string, en: string, loc: string }) => boolean} filter 
 * @return {void}
 */
function syncSingleMissReport(filePath, filter) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!REPORT_MISS_REGEX.test(content)) return;
  const ast = parser.parse(content, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
    ]
  });
  let reportMissReferenceCount = 0;
  let reportMissReplaceCount = 0;
  let isImportedDefine = false;
  let isImportedTranslate = false;
  
  traverse(ast, {
    ImportDeclaration(path) {
      if (!REPORT_MISS_FILE_PATH_REGEX.test(path.node.source.value)) return;
      path.node.specifiers.forEach(specifier => {
        if (!isIdentifier(specifier.imported)) return;
        if (specifier.imported.name === DEFINE_FN_NAME) isImportedDefine = true;
        if (specifier.imported.name === TRANSLATE_FN_NAME) isImportedTranslate = true;
      });
    },
    CallExpression(path) {
      const { node: { callee, arguments: [description, ...translateArgs] }, key, listKey, parent } = path;
      if (!isIdentifier(callee) || callee.name !== REPORT_MISS_FN_NAME) return;
      reportMissReferenceCount += 1;
      const memberExpressionTranslate = template.expression('d(%%description%%).t')({ description });
      const callExpressionTranslate = callExpression(memberExpressionTranslate, translateArgs);
      const [{ value: langKey, loc: { start } }] = translateArgs;
      const { value: langValue } = description;
      const loc = `${path}:${start.line}:${start.column}`;
      if (!filter({ id: langKey, en: langValue, loc })) return;
      if (listKey) {
        parent[listKey][key] = callExpressionTranslate;
      } else {
        parent[key] = callExpressionTranslate;
      }
      reportMissReplaceCount += 1;
    }
  });
  if (reportMissReplaceCount === 0) return; 
  if (reportMissReplaceCount < reportMissReferenceCount && isImportedTranslate && isImportedTranslate) return;
  traverse(ast, {
    ImportSpecifier(path) {
      if (path.node.imported.name !== REPORT_MISS_FN_NAME) return;
      const { key, listKey, parent } = path;
      if (reportMissReplaceCount === reportMissReferenceCount) parent[listKey].splice(key, 1);
      if (!isImportedDefine) parent[listKey].push(importSpecifier(identifier(DEFINE_FN_NAME), identifier(DEFINE_FN_NAME)));
      if (!isImportedTranslate) parent[listKey].push(importSpecifier(identifier(TRANSLATE_FN_NAME), identifier(TRANSLATE_FN_NAME)));
    }
  });
  const { code } = generate(ast);
  fs.writeFileSync(path, prettier.format(code, { ...prettierConfig, parser: 'typescript'}));
  console.log(`Successfully updated file: ${path}`);
}

/** 
 * @param {Array<{id: string, en: string, type: string, content: string}>} onlineEnData
 * @return {Array<{id: string, en: string, loc: string}>}
 */
function syncMissReport(onlineEnData) {
  const missCollect = {};
  const conflictCollect = [];
  glob.sync(srcFileGlob, { cwd: projectDir, absolute: true, ignore: ignoreGlob }).forEach(filePath => {
    syncSingleMissReport(filePath, (info) => {
      const { langKey } = info;
      if (onlineEnData.hasOwnProperty(langKey)) return true;
      if (missCollect.hasOwnProperty(langKey)) conflictCollect.push(info);
      missCollect[langKey] = info;
    });
  });
  if (conflictCollect.length > 0) {
    const msg = 'Conflict Id by MissReport: \n' + conflictCollect.map(info => `id: ${info.id}, file: ${info.loc}`).join('\n');
    throw new Error(msg)
  }
  return Object.values(missCollect);
}

module.exports = {
  syncMissReport
}