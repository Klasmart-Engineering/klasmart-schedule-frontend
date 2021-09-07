import { withStyles } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { Suspense } from "react";
import LayoutBox from "../../components/LayoutBox";
import { reportMiss } from "../../locale/LocaleManager";
import { ReportTitle } from "../ReportDashboard";
import TempComponentDisplay from "./Tabs/TempComponentDisplay";

const Registration = React.lazy(() => import("./Tabs/Registration"));
const MaterialUsage = React.lazy(() => import("./Tabs/MaterialUsage"));
const ClassesAndAssignments = React.lazy(() => import("./Tabs/ClassesAndAssignments"));

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: "#1890ff",
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    "&:hover": {
      color: "#40a9ff",
      opacity: 1,
    },
    "&$selected": {
      color: "#1890ff",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "#40a9ff",
    },
  },
  selected: {},
}))(Tab);

const tabs: string[] = [
  reportMiss("Registration tab name", "report_student_usage_registration"),
  reportMiss("MaterialUsage tab name", "report_student_usage_materialusage"),
  reportMiss("ClassesAndAssignments tab name", "report_student_usage_classesandassignments"),
];

export default function ReportStudentUsage() {
  const [state, setState] = React.useState({
    tabIndex: 0,
  });
  const handleChange = (event: any, newValue: number) => {
    setState({
      ...state,
      tabIndex: newValue,
    });
  };
  return (
    <>
      <ReportTitle title={reportMiss("Student usage Report", "report_label_student_usage")}></ReportTitle>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <AntTabs value={state.tabIndex} onChange={handleChange} aria-label="ant example">
          {tabs.map((tabItem) => {
            return <AntTab key={tabItem} label={tabItem} />;
          })}
        </AntTabs>
        <TempComponentDisplay />
        <Suspense fallback={<div>Loading...</div>}>
          {state.tabIndex === 0 && <Registration />}
          {state.tabIndex === 1 && <MaterialUsage />}
          {state.tabIndex === 2 && <ClassesAndAssignments />}
        </Suspense>
      </LayoutBox>
    </>
  );
}

ReportStudentUsage.routeBasePath = "/report/student-usage/:tabIndex";
