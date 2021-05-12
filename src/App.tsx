import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React from "react";
import { Provider } from "react-redux";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { gqlapi } from "./api";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Loading } from "./components/Loading";
import { Locale } from "./components/Locale";
import { Notification } from "./components/Notification";
import { AssessmentList } from "./pages/AssesmentList";
import { AssessmentsEdit } from "./pages/AssessmentEdit";
import ContentEdit from "./pages/ContentEdit/index";
import ContentPreview from "./pages/ContentPreview";
import { H5pDemo } from "./pages/H5pDemo";
import { H5pEditor } from "./pages/H5pEditor";
import { HomeFunAssessmentList } from "./pages/HomeFunAssessmentList";
import { AssessmentsHomefunEdit } from "./pages/HomefunEdit";
import Live from "./pages/Live";
import MilestoneEdit from "./pages/MilestoneEdit";
import MilestonesList from "./pages/MilestoneList";
import MyContentList from "./pages/MyContentList/index";
import { default as CreateOutcome, default as CreateOutcomings } from "./pages/OutcomeEdit";
import { OutcomeList } from "./pages/OutcomeList";
import Preview from "./pages/Preview";
import { ReportAchievementDetail } from "./pages/ReportAchievementDetail";
import { ReportAchievementList } from "./pages/ReportAchievementList";
import { ReportCategories } from "./pages/ReportCategories";
import { ReportDashboard } from "./pages/ReportDashboard";
import { ReportStudentPerformance } from "./pages/ReportStudentPerformance";
import ReportTeachingLoad from "./pages/ReportTeachingLoad";
import Schedule from "./pages/Schedule";
import { store } from "./reducers";
import theme from "./theme";
import { AssessmentDetail } from "./pages/AssesmentDetail";

function App() {
  return (
    <ApolloProvider client={gqlapi}>
      <ThemeProvider theme={theme}>
        <HashRouter>
          <Provider store={store}>
            <Locale>
              <Loading />
              <SnackbarProvider>
                {/* <UIAppHeaderNavBar /> */}
                <Switch>
                  <Route path={AssessmentDetail.routeBasePath}>
                    <AssessmentDetail />
                  </Route>
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
                  <Route path={HomeFunAssessmentList.routeBasePath}>
                    <HomeFunAssessmentList />
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
                  <Route path={AssessmentsHomefunEdit.routeBasePath}>
                    <AssessmentsHomefunEdit />
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
                  <Route path={ReportDashboard.routeBasePath}>
                    <ReportDashboard />
                  </Route>
                  <Route path={ReportTeachingLoad.routeBasePath}>
                    <ReportTeachingLoad />
                  </Route>
                  <Route path={ReportCategories.routeBasePath}>
                    <ReportCategories />
                  </Route>
                  <Route path={ReportStudentPerformance.routeBasePath}>
                    <ReportStudentPerformance />
                  </Route>
                  <Route path={H5pEditor.routeBasePath}>
                    <H5pEditor />
                  </Route>
                  <Route path={H5pDemo.routeBasePath}>
                    <H5pDemo />
                  </Route>
                  <Route path={MilestonesList.routeBasePath}>
                    <MilestonesList />
                  </Route>
                  <Route path={MilestoneEdit.routeMatchPath}>
                    <MilestoneEdit />
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
    </ApolloProvider>
  );
}

export default App;
