import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { gqlapi } from "./api";
import { ConfirmDialog } from "@components/ConfirmDialog";
import { Loading } from "@components/Loading";
import { Locale } from "@components/Locale";
import { Notification } from "@components/Notification";
import Schedule from "@pages/index";
import { store } from "./reducers";
import theme from "./theme";
import { useRecoilState } from "recoil";
import { localeState } from "./store/states";
import { localeManager } from "@locale/LocaleManager";
import { shouldBeLangName } from "@locale/lang/type";

function App() {
  const [globalLocale] = useRecoilState(localeState);
  useEffect(() => {
    localeManager.toggle(shouldBeLangName(globalLocale.slice(0, 2))).then((r) => {
      console.log(r);
    });
  }, [globalLocale]);
  return (
    <ApolloProvider client={gqlapi}>
      <ThemeProvider theme={theme}>
        <HashRouter>
          <Provider store={store}>
            <Locale>
              <Loading />
              <SnackbarProvider>
                <Switch>
                  <Route path={Schedule.routeMatchPath}>
                    <Schedule />
                  </Route>
                  <Route path={Schedule.routeBasePath}>
                    <Redirect to={Schedule.routeRedirectDefault} />
                  </Route>
                  <Route path="/">
                    <Redirect to={Schedule.routeRedirectDefault} />
                  </Route>
                </Switch>
                <Notification />
                <ConfirmDialog />
              </SnackbarProvider>
            </Locale>
          </Provider>
        </HashRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
