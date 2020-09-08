import { ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React from "react";
import { Provider } from "react-redux";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Loading } from "./components/Loading";
import { Notification } from "./components/Notification";
import { UIAppHeaderNavBar } from "./components/UIAppHeaderNavBar";
import { AssessmentsDetail } from "./pages/AssessmentEdit";
import ContentEdit from "./pages/ContentEdit";
import ContentPreview from "./pages/ContentPreview";
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
            <UIAppHeaderNavBar />
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
              <Route path="/assessments/outcomes">
                <CreateOutcome />
              </Route>
              <Route path={AssessmentsDetail.routeBasePath}>
                <AssessmentsDetail />
              </Route>
              <Route path="/">
                <Redirect to="/library/my-content-list?publish_status=published" />
              </Route>
            </Switch>
            <Notification />
            <ConfirmDialog />
          </SnackbarProvider>
        </Provider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
