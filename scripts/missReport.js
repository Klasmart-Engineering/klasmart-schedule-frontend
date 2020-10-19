const parser = require("@babel/parser");
const { default: traverse } = require('@babel/traverse');
const { default: generate } = require('@babel/generator');
const { default: template } = require('@babel/template');
const { isIdentifier, callExpression, importSpecifier, identifier, stringLiteral } = require('@babel/types');
const fs  = require('fs');
const path = require('path');
const glob = require('glob');
const { formatTs } = require('./format');
const chalk = require('chalk');

const projectDir = path.resolve(__dirname, '..');
const srcFileGlob =  'src/**/*.{js,jsx,ts,tsx}';
const ignoreGlob = 'src/locale/**/*.*';
const REPORT_MISS_FN_NAME = 'reportMiss';
const DEFINE_FN_NAME = 'd';
const TRANSLATE_FN_NAME = 't';
const REPORT_MISS_REGEX = new RegExp(`\\b${REPORT_MISS_FN_NAME}\\b`);
const REPORT_MISS_FILE_PATH_REGEX = /\/locale\/LocaleManager\b/;
const r = chalk.bold.red;
const g = chalk.bold.green;
const y = chalk.bold.yellow;

/**
 * @param {string} filePath 
 * @param {(info: { id: string, en: string, loc: string }) => false | { id, en }} filter 
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
      const { node: { callee, arguments: [originDescription, ...translateArgs] }, key, listKey, parent } = path;
      if (!isIdentifier(callee) || callee.name !== REPORT_MISS_FN_NAME) return;
      reportMissReferenceCount += 1;
      const [{ value: originId, loc: { start } }] = translateArgs;
      const { value: en } = originDescription;
      const loc = `${filePath}:${start.line}:${start.column}`;
      const { id, en: description } = filter({ id: originId, en, loc }) || {};
      if (!id) return;
      const memberExpressionTranslate = template.expression('d(%%description%%).t')({ description: stringLiteral(description) });
      const callExpressionTranslate = callExpression(memberExpressionTranslate, [stringLiteral(id), ...translateArgs.slice(1)]);
      if (listKey) {
        parent[listKey][key] = callExpressionTranslate;
      } else {
        parent[key] = callExpressionTranslate;
      }
      reportMissReplaceCount += 1;
    }
  });
  if (reportMissReplaceCount === 0) return; 
  if (reportMissReplaceCount === reportMissReferenceCount || !isImportedTranslate || !isImportedTranslate) {
    traverse(ast, {
      ImportSpecifier(path) {
        if (path.node.imported.name !== REPORT_MISS_FN_NAME) return;
        const { key, listKey, parent } = path;
        if (reportMissReplaceCount === reportMissReferenceCount) parent[listKey].splice(key, 1);
        if (!isImportedDefine) parent[listKey].push(importSpecifier(identifier(DEFINE_FN_NAME), identifier(DEFINE_FN_NAME)));
        if (!isImportedTranslate) parent[listKey].push(importSpecifier(identifier(TRANSLATE_FN_NAME), identifier(TRANSLATE_FN_NAME)));
      }
    });
  }
  const { code } = generate(ast);
  fs.writeFileSync(filePath, formatTs(code));
  console.log(g('Successfully'), ` updated file: ${g(filePath)}`);
}

/**
 * @param {Array<{id: string, en: string, loc: string}>} missCollect
 * @return {Array<{id: string, en: string, loc: string}>}
 */
function checkConflict(missCollect) {
  const idCountMap = {};
  const enCountMap = {};
  missCollect.forEach(({ id, en }) => {
    idCountMap[id] = (idCountMap[id] || 0) + 1;
    enCountMap[en] = (enCountMap[en] || 0) + 1;
  });
  return missCollect.filter(({ id, en }) => idCountMap[id] > 1 || enCountMap[en] > 1);
}

/** 
 * @param {{[key: string]: string}} onlineEnData
 * @param {{[key: string]: {id: string, en: string}}} onlineReuseData
 * @return {Array<{id: string, en: string, loc: string}>}
 */
function syncMissReport({ onlineEnData, onlineReuseData }) {
  const missCollectMap = {};
  const descriptions = Object.values(onlineEnData);
  glob.sync(srcFileGlob, { cwd: projectDir, absolute: true, ignore: ignoreGlob }).forEach(filePath => {
    syncSingleMissReport(filePath, (info) => {
      const { id, en, loc } = info;
      if (onlineEnData.hasOwnProperty(id)) {
        if (onlineEnData[id] !== en) {
          console.warn(y('Warning: '), `Online locale English: ${y(onlineEnData[id])} is different with your reported English: ${y(en)} for Label: ${y(id)} File: ${y(loc)}`);
          return false;
        }
        return { id, en: onlineEnData[id] };
      }
      if (descriptions.includes(en)) {
        const alreadyExistIds = Object.keys(onlineEnData).filter(id => onlineEnData[id] === en);
        console.error(r('Error: '), `Your reported new Label ${r(id)} has the same English with online Label ${alreadyExistIds.map(x => r(x)).join(', ')}, the English is: ${r(en)}`);
        return false;
      }
      if (onlineReuseData.hasOwnProperty(id)) {
        const reuseId = onlineReuseData[id].id;
        if (!onlineEnData.hasOwnProperty(reuseId)) {
          console.error(r('Error: '), `Reuse Label ${r(reuseId)} for Label ${r(id)} doest not exist in online google spreadsheet!`);
          return false;
        }
        return { id: reuseId, en: onlineEnData[reuseId] };
      }
      const key = JSON.stringify({ id, en });
      const mergedLoc = missCollectMap[key] ? `${missCollectMap[key].loc}\n\t\t${loc}` : loc;
      missCollectMap[key] = { id, en, loc: mergedLoc };
    });
  });
  const missCollect = Object.values(missCollectMap);
  const conflictCollect = checkConflict(missCollect);
  if (conflictCollect.length > 0) {
    const msg = `Conflict Label and English by MissReport: \n` + conflictCollect.map(info => `\tLabel: ${r(info.id)}, English: ${r(info.en)} File: ${r(info.loc)}`).join('\n');
    console.error(r('Error: '), msg);
    throw new Error('Conflict');
  }
  return missCollect;
}

module.exports = {
  syncMissReport
}
