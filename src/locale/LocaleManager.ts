import mitt from "mitt";
import { createIntl, createIntlCache, IntlFormatters, IntlShape } from "react-intl";
import { LangeRecordValuesByDesc, LangeRecordValuesById, LangName, LangRecodeDescription, LangRecordId, LangRecordIdByDescription } from "./lang/type";

type FormatMessageReturn = ReturnType<IntlFormatters<string>["formatMessage"]>;
type FormatMessageByDescription<Desc extends LangRecodeDescription> = LangeRecordValuesByDesc<Desc> extends undefined
  ? {
      (id: LangRecordIdByDescription<Desc>): FormatMessageReturn;
    }
  : {
      <Id extends LangRecordIdByDescription<Desc>>(id: Id, values: LangeRecordValuesById<Id>): FormatMessageReturn;
    };

function getDefaultLocale(availableLanguages: string[]) {
  const languages = navigator.languages || [
    navigator.language,
    (navigator as any).browserLanguage,
    (navigator as any).userLanguage,
    (navigator as any).systemLanguage
  ]
  for (const language of languages) {
    const locale = language.slice(0, 2);
    if (availableLanguages.includes(locale)) return locale;
  }
  return 'en';
}

export interface ChangeHandler {
  (intl?: IntlShape): any;
}

class LocaleManager {
  intl?: IntlShape;
  emitter = mitt();

  constructor(locale: LangName) {
    this.toggle(locale);
  }

  async toggle(locale: LangName) {
    const { default: messages } = await import(`./lang/${locale}.json`);
    const cache = createIntlCache();
    this.intl = createIntl({ locale, messages }, cache);
    this.emitter.emit("change", this.intl);
  }

  dscribe<Desc extends LangRecodeDescription>(desc: Desc) {
    const formatMessage = ((id: any, values: any) => this.formatMessage(id, values)) as FormatMessageByDescription<Desc>;
    return { t: formatMessage };
  }

  formatMessage<Id extends LangRecordId>(id: Id, values?: LangeRecordValuesById<Id>): FormatMessageReturn {
    if (!this.intl) return id;
    return this.intl.formatMessage({ id }, values);
  }

  on(event: "change", handler: ChangeHandler) {
    this.emitter.on("change", handler);
  }
}

export const localeManager = new LocaleManager("en");
export const t = localeManager.formatMessage.bind(localeManager);
export const d = localeManager.dscribe.bind(localeManager);
