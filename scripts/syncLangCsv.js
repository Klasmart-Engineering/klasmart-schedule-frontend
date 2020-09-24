const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');
const csvToJson = require('convert-csv-to-json');
const prettier = require("prettier");

const prettierConfig = prettier.resolveConfig.sync(path.resolve(__dirname, '../.prettierrc'));
const csvDir = path.resolve(__dirname, '../src/locale/lang/csv');
const langDir = path.resolve(__dirname, '../src/locale/lang');
const missJsonPath = path.resolve(langDir, 'miss.json');
const projectDir = path.resolve(__dirname, '..');
const srcFileGlob =  'src/**/*.{js,jsx,ts,tsx}';
const ignoreGlob = 'src/locale/**/*.*';
const localeSpreadSheets = [
  {name: 'library', gid: '0', key: '1hNmEwxyOkBvpICyFeRjJRzjXtwMQx_lvwFfzPQELjVA'},
  {name: 'assessment', gid: '1481075788', key: '1hNmEwxyOkBvpICyFeRjJRzjXtwMQx_lvwFfzPQELjVA'},
  {name: 'outcome', gid: '1270100120', key: '1hNmEwxyOkBvpICyFeRjJRzjXtwMQx_lvwFfzPQELjVA'},
  {name: 'schedule', gid: '2004441755', key: '1hNmEwxyOkBvpICyFeRjJRzjXtwMQx_lvwFfzPQELjVA'},
]
const missSpreadSheet = {
  name: 'miss', gid: '0', key: '1qyNCI3Mm7apuR35J7Ql8dSmbNjhy1lEYOqNKbmEbYPA'
}
const csvFilePath = (name) => path.resolve(csvDir, `${name}.csv`);


const originMissJson = JSON.parse(fs.readFileSync(missJsonPath));

function downloadCsv(spreadSheets) {
  spreadSheets.forEach(({ name, gid, key }) => {
    execSync(`curl 'https://docs.google.com/spreadsheets/d/${key}/export?exportFormat=csv&gid=${gid}' --retry 5 -Lo ${csvFilePath(name)}`);
  })
}

function readAllLocaleCsv() {
  return []
    .concat(...localeSpreadSheets.map(({ name }) => csvToJson.fieldDelimiter(',').getJsonFromCsv(csvFilePath(name))))
    .reduce((result, item) => {
      const { Label: id, English: en, Chinese: zh, Korean: ko, Vietnamese: vi } = item;
      if (en) result.en[id] = en;
      if (zh) result.zh[id] = zh;
      if (ko) result.ko[id] = ko;
      if (vi) result.vi[id] = vi;
      return result;
    }, { en: {}, ko: {}, zh: {}, vi: {} })
};

function readMissCsv() {
  return csvToJson.fieldDelimiter(',').getJsonFromCsv(csvFilePath(missSpreadSheet.name))
    .map(item => {
      const { Label: id, English: en, ActionType: type,	ActionContent: content } = item;
      return { id, en, type, content };
    })
    .reduce((result, item) => {
      result[item.id] = item;
      return result;
    }, {});
}

function forEachFile(fileGlob, handler) {
  return glob.sync(fileGlob, { cwd: projectDir, absolute: true, ignore: ignoreGlob }).forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    handler(content, filePath);
  });
}

function filterReferenced(fileGlob, keywords) {
  const regex = new RegExp('(?:' + keywords.map(key => `['"\`]${key}['"\`]`).join('|') + ')')
  console.log('regex = ', regex)
  if (keywords.length === 0) return keywords;
  let result = [];
  forEachFile(fileGlob, (content) => {
    const match = content.match(regex);
    if (!match) return;
    result = result.concat(match.map(x => x.slice(1, -1)));
  });
  return result;
}

function format(json) {
  return prettier.format(JSON.stringify(json), { ...prettierConfig, parser: 'json'})
}

function writeLangJson(langDef) {
  fs.writeFileSync(missJsonPath, format(createMissJson(langDef.en, originMissJson)));
  ['en', 'zh', 'vi', 'ko'].forEach(name => {
    fs.writeFileSync(path.resolve(langDir, `${name}.json`), format(langDef[name]))
  });
}

function createMissJson(en, originMissJson) {
  const reportedMiss = readMissCsv();
  const idsOfFilterEnAndReported = Object.keys(originMissJson)
    .filter(id => !en[id] && !reportedMiss[id])
  return filterReferenced(srcFileGlob, idsOfFilterEnAndReported)
    .reduce((result, id) => {
      result[id] = originMissJson[id];
      return result;
    }, {});
}

downloadCsv(localeSpreadSheets.concat(missSpreadSheet));
writeLangJson(readAllLocaleCsv());

console.log(`Successfully updated ${langDir}/{en, zh, ko, vi, miss}.json`);

require('./syncLangType');
