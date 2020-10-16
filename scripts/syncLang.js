const fs = require('fs');
const path = require('path');
const { syncMissReport } = require('./missReport');
const { getOnlineLocale, getOnlineMiss, addOnlineMiss, clearMissByOnlineLocale } = require('./spread');
const { genLangTypeFileContent } = require('./langTypeTemplate');
const { formatJson, formatTs } = require('./format');

const langDir = path.resolve(__dirname, '../src/locale/lang');
const typeFilePath = path.resolve(langDir, './type.ts');

function syncLangType(enJson) {
  const code = genLangTypeFileContent(enJson);
  fs.writeFileSync(typeFilePath, formatTs(code));
  console.log(`Successfully create file: ${typeFilePath}`);
}

function writeLangJson(langDef) {
  ['en', 'zh', 'vi', 'ko'].forEach(name => {
    fs.writeFileSync(path.resolve(langDir, `${name}.json`), formatJson(langDef[name]))
  });
}

async function syncLang() {
  await clearMissByOnlineLocale();
  const langDef = await getOnlineLocale();
  const { reuse: onlineReuseData } = await getOnlineMiss();
  writeLangJson(langDef);
  syncLangType(langDef.en);
  const missCollect = syncMissReport({ onlineEnData: langDef.en, onlineReuseData });
  await addOnlineMiss(missCollect);
}

syncLang();