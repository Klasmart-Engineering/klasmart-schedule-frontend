const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const prettier = require("prettier");

const prettierConfig = prettier.resolveConfig.sync(path.resolve(__dirname, '../.prettierrc'));
const apiDir = path.resolve(__dirname, '../src/api');
const apiAutoFileName = 'api.auto.ts';
const apiAutoFilePath = path.resolve(apiDir, apiAutoFileName);
const swaggerFilePath = path.resolve(apiDir, 'api.swagger.json');

function format(filePath, parser) {
  const content = fs.readFileSync(filePath, 'utf-8');
  fs.writeFileSync(filePath, prettier.format(content, { ...prettierConfig, parser }));
}

function downloadAndGenerateApi() {
  execSync(`curl  -u swagger:Badana@135790  https://swagger-ui.kidsloop.cn/config/api.swagger.json -o ${swaggerFilePath}`);
  format(swaggerFilePath, 'json');
  execSync(`sta -p src/api/api.swagger.json -o ${apiDir} -n ${apiAutoFileName}`);
  format(apiAutoFilePath, 'typescript');
}

downloadAndGenerateApi();
console.log(`Successfully create ${apiAutoFilePath}`)
