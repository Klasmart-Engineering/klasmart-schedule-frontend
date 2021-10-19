import React from "react";
import LayoutBox from "../../components/LayoutBox";
import TabPages from "../../components/TabPages";
import { ReportTitle } from "../ReportDashboard";
import { AssignmentCompletion, ClassAttendance, LearningOutcomesAchievement } from "./Tabs";

export default function ReportStudentProgress() {
  const tabs: ITabItem[] = [
    {
      label: "Learning Outcomes Achievement",
      index: 0,
      display: true,
      Component: LearningOutcomesAchievement,
    },
    {
      label: "Class Attendance",
      index: 1,
      display: true,
      Component: ClassAttendance,
    },
    {
      label: "Assignment Completion",
      index: 2,
      display: true,
      Component: AssignmentCompletion,
    },
  ];

  return (
    <>
      <ReportTitle title="Student Progress Report"></ReportTitle>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <TabPages tabs={tabs} />
      </LayoutBox>
    </>
  );
}

ReportStudentProgress.routeBasePath = "/report/student-progress";
