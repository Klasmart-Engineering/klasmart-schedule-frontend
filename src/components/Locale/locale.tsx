import React, { ReactNode, useEffect, useReducer } from "react";
import { RawIntlProvider } from "react-intl";
import { localeManager } from "../../locale/LocaleManager";

export interface LocaleProps {
  children: ReactNode;
}
export function Locale(props: LocaleProps) {
  const { children } = props;
  const [, refresh] = useReducer((s) => s + 1, 0);
  const locale = localeManager.getLocale();
  useEffect(() => {
    localeManager.on("change", refresh);
    if (locale !== localeManager.getLocale()) refresh();
  }, [locale]);
  console.log("locale, localeManager.intl = ", locale, localeManager.intl);
  if (!locale || !localeManager.intl) return null;
  return (
    <RawIntlProvider key={locale} value={localeManager.intl}>
      {children}
    </RawIntlProvider>
  );
}
