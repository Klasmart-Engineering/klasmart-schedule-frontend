import React, { useState } from "react";
import LearningOutcomeAchievedTotalType from "../components/LearningOutcomeAchievedTotalType";
import StudentProgressReportFeedback from "../components/StudentProgressReportFeedback";
import StudentProgressReportFilter from "../components/StudentProgressReportFilter";

export default function () {
  const [durationTime, setDurationTime] = useState(4);
  const colors = ["#0e78d5", "#ededed", "#bed6eb", "#a8c0ef"];
  const studentProgressReportTitle = "Learning Outcome Achieved";
  const totalType = [
    {
      label: "Total {student} newly achieved new learning outcomes",
      data: 387,
      idx: 0,
    },
    {
      label: "Total {student} newly achieved new learning outcomes",
      data: 361,
      idx: 1,
    },
    {
      label: "Total {student} newly achieved new learning outcomes",
      data: 358,
      idx: 2,
    },
    {
      label: "Total {student} newly achieved new learning outcomes",
      data: 387,
      idx: 3,
    },
  ];

  return (
    <div>
      <StudentProgressReportFilter
        durationTime={durationTime}
        setDurationTime={setDurationTime}
        // studentProgressReportTitle={t("report_label_learning_outcomes_achievement")}
        studentProgressReportTitle={studentProgressReportTitle}
      />
      <div>
        <LearningOutcomeAchievedTotalType totalType={totalType} colors={colors} />
        <StudentProgressReportFeedback />
      </div>
    </div>
  );
}
