import { withStyles } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { Suspense } from "react";
import { useDispatch } from "react-redux";
import LayoutBox from "../../components/LayoutBox";
import { d, t } from "../../locale/LocaleManager";
import { getSchoolsByOrg } from "../../reducers/report";
import { ReportTitle } from "../ReportDashboard";
const Registration = React.lazy(() => import("./Tabs/Registration"));
const MaterialUsage = React.lazy(() => import("./Tabs/MaterialUsage"));
const ClassesAndAssignments = React.lazy(() => import("./Tabs/ClassesAndAssignments"));

interface ITabItem {
  label: string;
  index: number;
  display: boolean;
}

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

export default function ReportStudentUsage() {
  const dispatch = useDispatch();
  const tabs: ITabItem[] = [
    {
      label: d("Registration").t("report_student_usage_registration"),
      index: 0,
      display: false,
    },
    {
      label: d("Material Usage").t("report_student_usage_materialusage"),
      index: 1,
      display: true,
    },
    {
      label: d("Classes & Assignments").t("report_student_usage_classesandassignments"),
      index: 2,
      display: true,
    },
  ];
  const activeTabs = tabs.filter((item) => item.display);
  const [state, setState] = React.useState({
    tabIndex: activeTabs[0].index,
  });
  const handleChange = (event: any, newValue: number) => {
    //console.log(newValue);
    setState({
      ...state,
      tabIndex: newValue,
    });
  };
  React.useEffect(() => {
    dispatch(getSchoolsByOrg());
  }, [dispatch]);
  return (
    <>
      <ReportTitle title={t("report_student_usage_report")}></ReportTitle>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <AntTabs value={state.tabIndex} onChange={handleChange} aria-label="">
          {activeTabs.map((tabItem) => {
            return <AntTab key={tabItem.index} value={tabItem.index} label={tabItem.label} />;
          })}
        </AntTabs>
        <Suspense fallback={<div>Loading...</div>}>
          {tabs[0].display && state.tabIndex === 0 && <Registration />}
          {tabs[1].display && state.tabIndex === 1 && <MaterialUsage />}
          {tabs[2].display && state.tabIndex === 2 && <ClassesAndAssignments />}
        </Suspense>
      </LayoutBox>
    </>
  );
}

ReportStudentUsage.routeBasePath = "/report/student-usage/";
