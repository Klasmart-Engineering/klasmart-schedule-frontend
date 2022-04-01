import React from "react";
import { useDispatch } from "react-redux";
import LayoutBox from "../../components/LayoutBox";
import TabPages from "../../components/TabPages";
import { d, t } from "../../locale/LocaleManager";
import { getSchoolsByOrg, getSchoolsByOrgNew } from "../../reducers/report";
import { ReportTitle } from "../ReportDashboard";

const Registration = React.lazy(() => import("./Tabs/Registration"));
const MaterialUsage = React.lazy(() => import("./Tabs/MaterialUsage"));
const ClassesAndAssignments = React.lazy(() => import("./Tabs/ClassesAndAssignments"));

export default function ReportStudentUsage() {
  const dispatch = useDispatch();
  const tabs: ITabItem[] = [
    {
      label: d("Registration").t("report_student_usage_registration"),
      index: 0,
      display: false,
      Component: Registration,
    },
    {
      label: d("Material Usage").t("report_student_usage_materialusage"),
      index: 1,
      display: true,
      Component: MaterialUsage,
    },
    {
      label: d("Classes & Assignments").t("report_student_usage_classesandassignments"),
      index: 2,
      display: true,
      Component: ClassesAndAssignments,
    },
  ];
  React.useEffect(() => {
    if (process.env.REACT_APP_USE_LEGACY_GQL) {
      dispatch(getSchoolsByOrgNew({ metaLoading: true }));
    } else {
      dispatch(getSchoolsByOrg({ metaLoading: true }));
    }
  }, [dispatch]);
  return (
    <>
      <ReportTitle title={t("report_student_usage_report")}></ReportTitle>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <TabPages tabs={tabs} />
      </LayoutBox>
    </>
  );
}

ReportStudentUsage.routeBasePath = "/report/student-usage/";
