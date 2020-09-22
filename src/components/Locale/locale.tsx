import React, { ReactNode, useEffect, useState } from "react";
import { RawIntlProvider } from "react-intl";
import { localeManager } from "../../locale/LocaleManager";

export interface LocaleProps {
  children: ReactNode;
}
export function Locale(props: LocaleProps) {
  const { children } = props;
  const [locale, setLocale] = useState(localeManager.intl?.locale);
  useEffect(() => {
    if (localeManager.intl?.locale) setLocale(localeManager.intl.locale);
    localeManager.on("change", (intl) => {
      if (!intl) return;
      setLocale(intl.locale);
    });
  }, []);
  if (!localeManager.intl) return null;
  return (
    <RawIntlProvider key={locale} value={localeManager.intl}>
      {children}
    </RawIntlProvider>
  );
}
