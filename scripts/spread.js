const { GoogleSpreadsheet } = require('google-spreadsheet');
const HttpsProxyAgent = require('https-proxy-agent');
const credentials = require('./credentials.json');

const cache = {};

const localeSpreadSheets = {
  key: '1hNmEwxyOkBvpICyFeRjJRzjXtwMQx_lvwFfzPQELjVA',
  gids: [ '0', '1481075788', '1270100120', '2004441755'],
}

const missSpreadSheet = {
  key: '1qyNCI3Mm7apuR35J7Ql8dSmbNjhy1lEYOqNKbmEbYPA',
  gid: '0',
}

const httpsAgent = new HttpsProxyAgent(process.env.HTTPS_PROXY);

async function createDoc(key) {
  if (cache[key]) return cache[key];
  cache[key] = (async () => {
    const doc = new GoogleSpreadsheet(key);
    doc.axios.interceptors.request.use(function (config) {
      return { ...config, httpsAgent, proxy: false};
    });
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    return doc;
  })();
  return cache[key];
}

async function getOnlineLocale() {
  const { key, gids } = localeSpreadSheets;
  const doc = await createDoc(key);
  return []
    .concat(...await Promise.all(gids.map(async (gid) => {
      const sheet = doc.sheetsById[gid];
      const rows = await sheet.getRows();
      return rows;
    })))
    .reduce((result, item) => {
      const { Label: id, English: en, Chinese: zh, Korean: ko, Vietnamese: vi } = item;
      if (en) result.en[id] = en;
      if (zh) result.zh[id] = zh;
      if (ko) result.ko[id] = ko;
      if (vi) result.vi[id] = vi;
      return result;
    }, { en: {}, ko: {}, zh: {}, vi: {} })
}

/**
 * @return {Array<{id: string, en: string, type: string, content: string}>}
 */
async function getOnlineMiss() {
  const { key, gid } = missSpreadSheet;
  const doc = await createDoc(key);
  const rows = await doc.sheetsById[gid].getRows();
  return rows
    .map(item => {
      const { Label: id, English: en, ActionType: type,	ActionContent: content } = item;
      return { id, en, type, content };
    })
    .reduce((result, item) => {
      result[item.id] = item;
      return result;
    }, {});
}

/**
 * @param {{[key: string]: { id: string, en: string, loc: string }}} missData 
 */
async function addOnlineMiss(missData) {
  const { key, gid } = missSpreadSheet;
  const doc = await createDoc(key);
  const originOnlineMiss = await getOnlineMiss();
  const messages = [];
  const rows = Object.entries(missData)
    .filter(([id]) => !originOnlineMiss[id])
    .map(([id, { en, loc }]) => {
      messages.push(`\tid: ${id}, file: ${loc}`);
      return { Label: id, English: en, ActionType: '',	ActionContent: '' };
    })
  await doc.sheetsById[gid].addRows(rows);
  console.log('Successfully reportMiss to online:\n' + messages.join('\n'));
}

module.exports = {
  getOnlineLocale, getOnlineMiss, addOnlineMiss
}
