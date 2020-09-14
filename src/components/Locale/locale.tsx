import React, { ReactNode, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reducers";
import { actAsyncSetLocale } from "../../reducers/locale";

export interface LocaleProps {
  children: ReactNode;
}
export function Locale(props: LocaleProps) {
  const { children } = props;
  const { name, translation } = useSelector<RootState, RootState["locale"]>((state) => state.locale);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(actAsyncSetLocale());
  }, [dispatch]);
  return (
    <IntlProvider key={name} locale={name} messages={translation}>
      {children}
    </IntlProvider>
  );
}
