import mitt from "mitt";
import { createIntl, createIntlCache, IntlFormatters, IntlShape } from "react-intl";
import {
  LangeRecordValuesByDesc,
  LangeRecordValuesById,
  LangName,
  LangRecodeDescription,
  LangRecordId,
  LangRecordIdByDescription,
} from "./lang/type";

type FormatMessageReturn = ReturnType<IntlFormatters<string>["formatMessage"]>;
type FormatMessageByDescription<Desc extends LangRecodeDescription> = LangeRecordValuesByDesc<Desc> extends undefined
  ? {
      (id: LangRecordIdByDescription<Desc>): FormatMessageReturn;
    }
  : {
      <Id extends LangRecordIdByDescription<Desc>>(id: Id, values: LangeRecordValuesById<Id>): FormatMessageReturn;
    };

// function getDefaultLocale(availableLanguages: string[]) {
//   const languages = navigator.languages || [
//     navigator.language,
//     (navigator as any).browserLanguage,
//     (navigator as any).userLanguage,
//     (navigator as any).systemLanguage
//   ]
//   for (const language of languages) {
//     const locale = language.slice(0, 2);
//     if (availableLanguages.includes(locale)) return locale;
//   }
//   return 'en';
// }

export interface ChangeHandler {
  (intl?: IntlShape): any;
}

function getValueNamesByDescription(description: string): string[] | undefined {
  const result = description.match(/{.*?}/g);
  if (result == null) return;
  return result.map((x) => x.slice(1, -1));
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

  reportMiss<T extends string, M extends string>(
    description: M & (M extends LangRecodeDescription ? never : {}),
    id: T & (T extends LangRecordId ? never : {}),
    values?: Record<string, number | string>
  ): string {
    const valueNames = getValueNamesByDescription(description);
    if (!valueNames) {
      if (values)
        console.error(`reportMiss Error: description "${description}" does not defined any values, but reportMiss provide values`);
      return description;
    }
    if (!values) {
      console.error(`reportMiss Error: description "${description}" defined values, but reportMiss did not provide values`);
      return description;
    }
    const providedValueNames = Object.keys(values);
    if (providedValueNames.sort().toString() !== valueNames.sort().toString()) {
      console.error(
        `reportMiss Error: description "${description}" defined value names: ${valueNames}, but reportMiss provide value names: ${providedValueNames}`
      );
    }
    // let result = description;
    return providedValueNames.reduce((result, name) => {
      return result.replace(new RegExp(`\\{${name}\\}`, "g"), String(values[name]));
    }, description);
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
export const reportMiss = localeManager.reportMiss.bind(localeManager);
