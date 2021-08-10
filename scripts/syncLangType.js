const fs = require('fs');
const path = require('path');
const { genLangTypeFileContentSyncLocal } = require('./langTypeTemplate');
const { formatTs } = require('./format');
const chalk = require('chalk');

const g = chalk.bold.green;

const langDir = path.resolve(__dirname, '../src/locale/lang');
const typeFilePath = path.resolve(langDir, './type.ts');

async function syncLangType(enJson) {
  fs.readFile(enJson, "utf-8", (error, data) => {
    if (error) return console.log("get content error,message is" + error.message);
    let genLangTypeFileContentSyncLocalData = [];
    const convertData =  JSON.parse(data)
    for(let i in convertData){
      genLangTypeFileContentSyncLocalData.push({id: i, description: convertData[i]});
    }
    const code = genLangTypeFileContentSyncLocal(genLangTypeFileContentSyncLocalData);
    fs.writeFileSync(typeFilePath, formatTs(code));
    console.log(g('Successfully'), ` update file: ${g(typeFilePath)}`);
  });
}

syncLangType(`${langDir}/en.json`);