const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const csvToJson = require('convert-csv-to-json');
const prettier = require("prettier");

const prettierConfig = prettier.resolveConfig.sync(path.resolve(__dirname, '../.prettierrc'));
const csvDir = path.resolve(__dirname, '../src/locale/lang/csv');
const langDir = path.resolve(__dirname, '../src/locale/lang');
const missJsonPath = path.resolve(langDir, 'miss.json');
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
  return csvToJson.fieldDelimiter(',').getJsonFromCsv(csvFilePath(missSpreadSheet.name));
}

function format(json) {
  return prettier.format(JSON.stringify(json), { ...prettierConfig, parser: 'json'})
    .map(item => {
      const { Label: id, English: en, ActionType: type,	ActionContent: content } = item;
      return { id, en, type, content };
    });
}

function writeLangJson(langDef) {
  fs.writeFileSync(missJsonPath, format(createMissJson(langDef.en, originMissJson)));
  ['en', 'zh', 'vi', 'ko'].forEach(name => {
    fs.writeFileSync(path.resolve(langDir, `${name}.json`), format(langDef[name]))
  });
}

function createMissJson(en, originMissJson) {
  const reportedIds = readMissCsv().map(item => item.id);
  return Object.keys(originMissJson)
    .filter(id => !en[id])
    .reduce((result, id) => {
      result[id] = originMissJson[id];
      return result;
    }, {});
}

downloadCsv(localeSpreadSheets.concat(missSpreadSheet));
writeLangJson(readAllLocaleCsv());

console.log(`Successfully updated ${langDir}/{en, zh, ko, vi, miss}.json`);

require('./syncLangType');
