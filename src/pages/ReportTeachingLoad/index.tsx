import React from "react";
import { useDispatch } from "react-redux";
import LayoutBox from "../../components/LayoutBox";
import TabPages from "../../components/TabPages";
import { d } from "../../locale/LocaleManager";
import { ReportTitle } from "../ReportDashboard";
import { Assignments, Lessons, NextSevenDaysLessonLoad } from "./Tabs";
export default function ReportTeachingLoad() {
  const dispatch = useDispatch();
  const tabs: ITabItem[] = [
    {
      label: "Lessons",
      index: 0,
      display: true,
      Component: Lessons,
    },
    {
      label: "Assignments",
      index: 1,
      display: true,
      Component: Assignments,
    },
    
    {
      label: "NextSevenDaysLessonLoad",
      index: 2,
      display: true,
      Component: NextSevenDaysLessonLoad,
    },
  ];
  React.useEffect(() => {}, [dispatch]);
  return (
    <>
      <ReportTitle title={d("Teaching Load").t("report_label_teaching_load")}></ReportTitle>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <TabPages tabs={tabs} />
      </LayoutBox>
    </>
  );
}

ReportTeachingLoad.routeBasePath = "/report/teaching-load";
ReportTeachingLoad.routeRedirectDefault = "/report/teaching-load";
