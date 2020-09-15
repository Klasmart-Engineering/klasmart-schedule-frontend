import mitt from "mitt";
import { createIntl, createIntlCache, IntlFormatters, IntlShape } from "react-intl";
import { LangeFormatMessageValues, LangMessageDescriptor, LangName } from "./lang/type";

type FormatMessageReturn = ReturnType<IntlFormatters<string>["formatMessage"]>;
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

  // formatMessage<M extends LangMessageDescriptor>(message: M, values?: LangeFormatMessageValues<M['id']>): FormatMessageReturn;
  formatMessage<Id extends LangMessageDescriptor["id"]>(id: Id, values?: LangeFormatMessageValues<Id>): FormatMessageReturn {
    if (!this.intl) return id;
    return this.intl.formatMessage({ id }, values);
  }

  on(event: "change", handler: ChangeHandler) {
    this.emitter.on("change", handler);
  }
}

export const localeManager = new LocaleManager("en");
export const formatMessage = localeManager.formatMessage.bind(localeManager);
