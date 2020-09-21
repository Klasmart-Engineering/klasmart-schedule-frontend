const fs = require('fs');
const path = require('path');
const csvToJson = require('convert-csv-to-json');
const prettier = require("prettier");

const prettierConfig = prettier.resolveConfig.sync(path.resolve(__dirname, '../.prettierrc'));
const csvDir = path.resolve(__dirname, '../src/locale/lang/csv');
const langDir = path.resolve(__dirname, '../src/locale/lang');
const missJsonPath = path.resolve(langDir, 'miss.json');

const originMissJson = JSON.parse(fs.readFileSync(missJsonPath));

function readAllCsv(csvDir) {
  const csvFileNames = fs.readdirSync(csvDir);
  return []
    .concat(...csvFileNames.map(fileName => csvToJson.fieldDelimiter(',').getJsonFromCsv(path.resolve(csvDir, fileName))))
    .reduce((result, item) => {
      const { Label: id, English: en, Chinese: cn, Korean: ko, Vietnamese: vi } = item;
      if (en) result.en[id] = en;
      if (cn) result.cn[id] = cn;
      if (ko) result.ko[id] = ko;
      if (vi) result.vi[id] = vi;
      return result;
    }, { en: {}, ko: {}, cn: {}, vi: {} })

}

function format(json) {
  return prettier.format(JSON.stringify(json), { ...prettierConfig, parser: 'json'});
}

function writeLangJson(langDef) {
  fs.writeFileSync(missJsonPath, format(createMissJson(langDef.en, originMissJson)));
  ['en', 'cn', 'vi', 'ko'].forEach(name => {
    fs.writeFileSync(path.resolve(langDir, `${name}.json`), format(langDef[name]))
  });
}

function createMissJson(en, originMissJson) {
  return Object.keys(originMissJson)
    .filter(id => !en[id])
    .reduce((result, id) => {
      result[id] = originMissJson[id];
      return result;
    }, {});
}

writeLangJson(readAllCsv(csvDir));

