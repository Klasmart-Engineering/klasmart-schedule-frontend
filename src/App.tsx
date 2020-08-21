import React from "react";
import MyContentList from "./pages/MyContentList/index";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import theme from "./theme";
import ContentEdit from "./pages/ContentEdit";
import { ThemeProvider } from "@material-ui/core";
import Preview from "./pages/Preview";
import { store } from "./reducers";
import { Provider } from "react-redux";
import Schedule from "./pages/Schedule";
import ContentPreview from "./pages/ContentPreview";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Provider store={store}>
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
            <Route path="/schedule" component={Schedule} />
            <Route path="/">
              <Redirect to="/library/my-content-list?layout=card" />
            </Route>
          </Switch>
        </Provider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
