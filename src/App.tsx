import { ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React from "react";
import { Provider } from "react-redux";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Loading } from "./components/Loading";
import { Locale } from "./components/Locale";
import { Notification } from "./components/Notification";
import { AssessmentList } from "./pages/AssesmentList";
import { AssessmentsEdit } from "./pages/AssessmentEdit";
import ContentEdit from "./pages/ContentEdit";
import ContentPreview from "./pages/ContentPreview";
import Live from "./pages/Live";
import MyContentList from "./pages/MyContentList/index";
import { default as CreateOutcome, default as CreateOutcomings } from "./pages/OutcomeEdit";
import { OutcomeList } from "./pages/OutcomeList";
import Preview from "./pages/Preview";
import { ReportAchievementDetail } from "./pages/ReportAchievementDetail";
import { ReportAchievementList } from "./pages/ReportAchievementList";
import { ReportCategories } from "./pages/ReportCategories";
import Schedule from "./pages/Schedule";
import { store } from "./reducers";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Provider store={store}>
          <Locale>
            <Loading />
            <SnackbarProvider>
              {/* <UIAppHeaderNavBar /> */}
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
                <Route path={ContentPreview.routeMatchPath}>
                  <ContentPreview />
                </Route>
                <Route path={MyContentList.routeBasePath}>
                  <MyContentList />
                </Route>
                <Route path={OutcomeList.routeBasePath}>
                  <OutcomeList />
                </Route>
                <Route path={AssessmentList.routeBasePath}>
                  <AssessmentList />
                </Route>
                <Route path={Schedule.routeMatchPath}>
                  <Schedule />
                </Route>
                <Route path={Schedule.routeBasePath}>
                  <Redirect to={Schedule.routeRedirectDefault} />
                </Route>
                <Route path={CreateOutcomings.routeBasePath}>
                  <CreateOutcome />
                </Route>
                <Route path={AssessmentsEdit.routeBasePath}>
                  <AssessmentsEdit />
                </Route>
                <Route path={Live.routeBasePath}>
                  <Live />
                </Route>
                <Route path={ReportAchievementList.routeBasePath}>
                  <ReportAchievementList />
                </Route>
                <Route path={ReportAchievementDetail.routeBasePath}>
                  <ReportAchievementDetail />
                </Route>
                <Route path={ReportCategories.routeBasePath}>
                  <ReportCategories />
                </Route>
                <Route path="/">
                  <Redirect to={MyContentList.routeRedirectDefault} />
                </Route>
              </Switch>
              <Notification />
              <ConfirmDialog />
            </SnackbarProvider>
          </Locale>
        </Provider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
