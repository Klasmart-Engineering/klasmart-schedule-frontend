const { GoogleSpreadsheet } = require('google-spreadsheet');
const HttpsProxyAgent = require('https-proxy-agent');
const doc = new GoogleSpreadsheet('1qyNCI3Mm7apuR35J7Ql8dSmbNjhy1lEYOqNKbmEbYPA');

const httpsAgent = new HttpsProxyAgent('http://127.0.0.1:1235');

doc.axios.interceptors.request.use(function (config) {
  return { ...config, httpsAgent, proxy: false};
});

async function main() {
  await doc.useServiceAccountAuth(require('./credentials.json'));
  await doc.loadInfo();
  const sheet = doc.sheetsById['0']
  const rows = await sheet.getRows();
  console.log('title = ', sheet.title);
  console.log('rowCount = ', sheet.rowCount);
  console.log('rows = ', rows);
}

main();