const fs = require('fs');
const path = require('path');
const { syncMissReport } = require('./missReport');
const { getOnlineLocale, getOnlineMiss, addOnlineMiss, clearMissByOnlineLocale } = require('./spread');
const { genLangTypeFileContent } = require('./langTypeTemplate');
const { formatJson, formatTs } = require('./format');
const chalk = require('chalk');

const g = chalk.bold.green;

const langDir = path.resolve(__dirname, '../src/locale/lang');
const typeFilePath = path.resolve(langDir, './type.ts');

function syncLangType(enJson) {
  const code = genLangTypeFileContent(enJson);
  fs.writeFileSync(typeFilePath, formatTs(code));
  console.log(g('Successfully'), ` update file: ${g(typeFilePath)}`);
}

function writeLangJson(langDef) {
  ['en', 'zh', 'vi', 'ko'].forEach(name => {
    const filePath = path.resolve(langDir, `${name}.json`)
    fs.writeFileSync(filePath, formatJson(langDef[name]));
  });
  console.log(g('Successfully'), ` update file: `, g(`${langDir}/{en, zh, vi, ko}.json`));
}

async function syncLang() {
  await clearMissByOnlineLocale();
  const langDef = await getOnlineLocale();
  debugger;
  const { reuse: onlineReuseData } = await getOnlineMiss();
  writeLangJson(langDef);
  syncLangType(langDef.en);
  const missCollect = syncMissReport({ onlineEnData: langDef.en, onlineReuseData });
  await addOnlineMiss(missCollect);
}

syncLang();