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
  execSync(`curl https://swagger-ui.kidsloop.net/config/api.swagger.json -o ${swaggerFilePath}`);
  format(swaggerFilePath, 'json');
  execSync(`sta -p src/api/api.swagger.json -o ${apiDir} -n ${apiAutoFileName}`);
  format(apiAutoFilePath, 'typescript');
}

function adjustApi(apiFilePath) {
  const content = fs.readFileSync(apiFilePath, 'utf-8');
  const adjustedContent = content.replace('if (!response.ok) throw data;', 'if (!response.ok) throw response;');
  fs.writeFileSync(apiFilePath, adjustedContent);
}

downloadAndGenerateApi();
adjustApi(apiAutoFilePath);

console.log(`Successfully create ${apiAutoFilePath}`)