const { GoogleSpreadsheet } = require('google-spreadsheet');
const HttpsProxyAgent = require('https-proxy-agent');
const memorize = require('lodash/memoize');
const credentials = require('./credentials.json');
const chalk = require('chalk');

const cache = {};
const g = chalk.bold.green;

const localeSpreadSheets = {
  key: '1hNmEwxyOkBvpICyFeRjJRzjXtwMQx_lvwFfzPQELjVA',
  gids: ['0', '1481075788', '1270100120', '2004441755', '1280969073', '109007851', "24833723"],
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

const getOnlineLocale = memorize(async function () {
  const { key, gids } = localeSpreadSheets;
  const doc = await createDoc(key);
  return []
    .concat(...await Promise.all(gids.map(async (gid) => {
      const sheet = doc.sheetsById[gid];
      const rows = await sheet.getRows();
      return rows;
    })))
    .reduce((result, item) => {
      const { Label: id, English: en, Chinese: zh, Korean: ko, Vietnamese: vi, Indonesian_Bahasa } = item;
      if (en) result.en[id] = en;
      if (zh) result.zh[id] = zh;
      if (ko) result.ko[id] = ko;
      if (vi) result.vi[id] = vi;
      if (Indonesian_Bahasa) result.id[id] = Indonesian_Bahasa;
      return result;
    }, { en: {}, ko: {}, zh: {}, vi: {}, id: {} })
})

/**
 * @return {{ miss: {[key: string]: { id: string, en: string }}, reuse: {[key: string]: { id: string, en: string }} }}
 */
const getOnlineMiss = async function getOnlineMiss() {
  const { key, gid } = missSpreadSheet;
  const doc = await createDoc(key);
  const rows = await doc.sheetsById[gid].getRows();
  return rows
    .map(item => {
      const { Label: id, English: en, ActionType: type,	ActionContent: content } = item;
      return { id, en, type, content };
    })
    .reduce((result, item) => {
      const { id, en, content } = item;
      if (item.content) {
        result.reuse[item.id] = { id: content, en };
      } else {
        result.miss[item.id] = { id, en };
      }
      return result;
    }, { miss: {}, reuse: {} });
}

/**
 * @param {Array<{ id: string, en: string, loc: string }>} missData 
 */
async function addOnlineMiss(missData) {
  const { key, gid } = missSpreadSheet;
  const doc = await createDoc(key);
  const { miss: originOnlineMiss } = await getOnlineMiss();
  const messages = [];
  const rows = missData
    .filter(({ id }) => !originOnlineMiss[id])
    .map(({ id, en, loc  }) => {
      messages.push(`\tLabel: ${g(id)}, English: ${g(en)}, File: ${g(loc)}`);
      return { Label: id, English: en, ActionType: '',	ActionContent: '' };
    })
  if (rows.length === 0) {
    console.log('Nothing to report.')
    return;
  };
  await doc.sheetsById[gid].addRows(rows);
  console.log(g('Successfully'), ' reportMiss to online:\n' + messages.join('\n'));
}

async function clearMissByOnlineLocale() {
  const { key, gid } = missSpreadSheet;
  const doc = await createDoc(key);
  const rows = await doc.sheetsById[gid].getRows();
  const { en } = await getOnlineLocale();
  for(let idx = rows.length; idx >= 0; --idx) {
    if(!rows[idx] || !en[rows[idx].Label]) continue;
    const { Label, English } = rows[idx];
    await rows[idx].delete();
    console.log(g('Successfully'), ` clear online spread miss of Label: ${g(Label)}", English: ${g(English)}`);
  }
}

module.exports = {
  getOnlineLocale, getOnlineMiss, addOnlineMiss, clearMissByOnlineLocale
}
