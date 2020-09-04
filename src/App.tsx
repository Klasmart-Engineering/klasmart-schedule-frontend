import { ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React from "react";
import { Provider } from "react-redux";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { Loading } from "./components/Loading";
import { Notification } from "./components/Notification";
import { AssessmentsDetail } from "./pages/AssessmentEdit";
import ContentEdit from "./pages/ContentEdit";
import ContentPreview from "./pages/ContentPreview";
import HeaderNavBar from "./pages/MyContentList/HeaderNavBar";
import MyContentList from "./pages/MyContentList/index";
import CreateOutcome from "./pages/OutcomeEdit";
import Preview from "./pages/Preview";
import Schedule from "./pages/Schedule";
import { store } from "./reducers";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Provider store={store}>
          <Loading />
          <SnackbarProvider>
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
              <Route path="/assessments">
                <CreateOutcome />
              </Route>
              <Route path={AssessmentsDetail.routeBasePath}>
                <AssessmentsDetail />
              </Route>
              <Route path="/">
                <Redirect to="/library/my-content-list?layout=card&status=published" />
              </Route>
            </Switch>
            <Notification />
          </SnackbarProvider>
        </Provider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
