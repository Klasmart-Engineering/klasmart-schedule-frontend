const prettier = require("prettier");
const path = require('path');
const prettierConfig = prettier.resolveConfig.sync(path.resolve(__dirname, '../.prettierrc'));

function formatJson(json) {
  return prettier.format(JSON.stringify(json), { ...prettierConfig, parser: 'json'})
}

function formatTs(code) {
  return prettier.format(code, { ...prettierConfig, parser: 'typescript'});
}

module.exports = { formatJson, formatTs }