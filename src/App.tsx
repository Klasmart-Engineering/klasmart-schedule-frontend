import { ApolloProvider } from "@apollo/client";
import { ThemeProvider, createGenerateClassName, StylesProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React from "react";
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

const generateClassName = createGenerateClassName({
  productionPrefix: "schedule",
  seed: "schedule",
});

function App() {
  return (
    <ApolloProvider client={gqlapi}>
      <ThemeProvider theme={theme}>
        <StylesProvider generateClassName={generateClassName}>
          <HashRouter>
            <Provider store={store}>
              <Locale>
                <Loading />
                <SnackbarProvider>
                  <Switch>
                    <Route path={Schedule.routeMatchPathMost}>
                      <Schedule />
                    </Route>
                    <Route path={Schedule.routeMatchPath}>
                      <Schedule />
                    </Route>
                    <Route path={Schedule.routeBasePath}>
                      <Schedule />
                    </Route>
                    <Route path="/">
                      <Redirect to={Schedule.routeBasePath} />
                    </Route>
                  </Switch>
                  <Notification />
                  <ConfirmDialog />
                </SnackbarProvider>
              </Locale>
            </Provider>
          </HashRouter>
        </StylesProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
