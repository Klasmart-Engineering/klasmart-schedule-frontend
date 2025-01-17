const fs = require('fs');
const union = require("lodash/union");
const langList = readLangList("./src/locale/lang/")
const header = `
import { MessageDescriptor } from "react-intl";


export type LangName = ${langList.langType};

export function assertLangName(name?: string): asserts name is LangName {
  if (!name || ![${langList.langName}].includes(name)) throw new TypeError();
}

export function shouldBeLangName(name?: string): LangName {
  assertLangName(name);
  return name;
}

type LangRecord =
`

const footer = `
\n
export type LangRecordId = LangRecord["id"];
export type LangRecodeDescription = LangRecord["description"];
export type LangRecordValues = LangRecord["values"];
export type LangRecordIdByDescription<Desc extends LangRecord["description"]> = Extract<
  LangRecord,
  { id: any; description: Desc; values: any }
>["id"];
export type LangeRecordValuesByDesc<Desc extends LangRecord["description"]> = Extract<
  LangRecord,
  { id: any; description: Desc; values: any }
>["values"];
export type LangeRecordValuesById<Id extends LangRecord["id"]> = Extract<LangRecord, { id: Id; description: any; values: any }>["values"];

export interface LangMessageDescriptor extends Omit<MessageDescriptor, "id"> {
  id: LangRecordId;
}
`

function getValuesByDescription(description) {
  const result = description.match(/{.*?}/g);
  if (result == null) return;
  return '{ ' + union(result).map(x => `${x.slice(1, -1)}: string | number`).join(', ') + ' }';
}

function genLangTypeFileContent (enJson) {
  const body = Object.entries(enJson)
    .map(([id, description]) => `| { id: "${id}"; description: "${description}"; values: ${getValuesByDescription(description)} }`)
    .concat(';')
    .join('\n')

  return `${header}${body}${footer}`;
}

function genLangTypeFileContentSyncLocal (enData) {
  const body = enData
    .map(({id, description}) => `| { id: "${id}"; description: \`${description}\`; values: ${getValuesByDescription(description)} }`)
    .concat(';')
    .join('\n')

  return `${header}${body}${footer}`;
}

function readLangList(path) {
  const files = fs.readdirSync(path);
  let langType = '';
  let langName = ''
  files.forEach(function (itm, index) {
    const [lang, suffix] = itm.split(".")
    if (suffix === 'json') {
      langType += `"${lang}" |`
      langName += `"${lang}", `
    }
  })
  return {langType: langType.substr(0, langType.length - 2), langName:  langName.substr(0, langName.length - 2)};
}

exports.genLangTypeFileContent = genLangTypeFileContent;
exports.genLangTypeFileContentSyncLocal = genLangTypeFileContentSyncLocal;