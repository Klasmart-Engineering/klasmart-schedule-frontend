import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { Provider } from "react-redux";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import ContentEdit from "./pages/ContentEdit";
import ContentPreview from "./pages/ContentPreview";
import HeaderNavBar from "./pages/MyContentList/HeaderNavBar";
import MyContentList from "./pages/MyContentList/index";
import Preview from "./pages/Preview";
import Schedule from "./pages/Schedule";
import { store } from "./reducers";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Provider store={store}>
          <HeaderNavBar />
          <Switch>
            <Route path={Preview.routeBasePath}>
              <Preview />
            </Route>
            <Route path={ContentEdit.routeMatchPath}>
              <ContentEdit />
            </Route>
            <Route path={ContentEdit.routeBasePath}>
              <Redirect to={ContentEdit.routeRedirectDefault} />
            </Route>
            <Route path={ContentPreview.routeBasePath}>
              <ContentPreview />
            </Route>
            <Route path="/library/my-content-list">
              <MyContentList />
            </Route>
            <Route path={Schedule.routeMatchPath}>
              <Schedule />
            </Route>
            <Route path={Schedule.routeBasePath}>
              <Redirect to={Schedule.routeRedirectDefault} />
            </Route>
            <Route path="/">
              <Redirect to="/library/my-content-list?layout=card&status=published" />
            </Route>
          </Switch>
        </Provider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
