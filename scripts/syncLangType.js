#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { genLangTypeFileContent } = require('./langTypeTemplate');
const prettier = require("prettier");

const langDir = path.resolve(__dirname, '../src/locale/lang');
const enFilePath = path.resolve(langDir, './en.json');
const missFilePath = path.resolve(langDir, './miss.json');
const typeFilePath = path.resolve(langDir, './type.ts');

const enJson = JSON.parse(fs.readFileSync(enFilePath));
const missJson = JSON.parse(fs.readFileSync(missFilePath));
const prettierConfig = prettier.resolveConfig.sync(path.resolve(__dirname, '../.prettierrc'));

fs.writeFileSync(typeFilePath, prettier.format(genLangTypeFileContent(enJson, missJson), { ...prettierConfig, parser: 'typescript'}));

console.log(`Successfully create file: ${typeFilePath}`);