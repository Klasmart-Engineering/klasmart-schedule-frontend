import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { d, t } from "../../../locale/LocaleManager";
import { getFourWeeks, getSixMonths } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
import { getLearnOutcomeAchievement } from "../../../reducers/report";
import LearningOutcomeAchievedTotalType from "../components/LearningOutcomeAchievedTotalType";
import StudentProgressReportFeedback from "../components/StudentProgressReportFeedback";
import StudentProgressReportFilter from "../components/StudentProgressReportFilter";

export default function () {
  const [durationTime, setDurationTime] = useState(4);
  const dispatch = useDispatch();
  const { learnOutcomeAchievement } = useSelector<RootState, RootState["report"]>((state) => state.report);
  console.log(learnOutcomeAchievement);
  const colors = ["#0e78d5", "#ededed", "#bed6eb", "#a8c0ef"];
  const totalType = [
    {
      label: t("report_label_total_newly_achieved_lo"),
      data: 387,
      idx: 0,
    },
    {
      label: t("report_label_total_reachieved_lo"),
      data: 361,
      idx: 1,
    },
    {
      label: t("report_label_total_achieved_lo_class_average"),
      data: 358,
      idx: 2,
    },
    {
      label: t("report_label_total_achieved_lo_subject_average"),
      data: 387,
      idx: 3,
    },
  ];
  useEffect(() => {
    dispatch(
      getLearnOutcomeAchievement({
        class_id: "",
        durations: durationTime === 4 ? getFourWeeks() : getSixMonths(),
        selected_subject_id_list: [""],
        student_id: "",
        un_selected_subject_id_list: [""],
      })
    );
  }, [dispatch, durationTime]);

  return (
    <div>
      <StudentProgressReportFilter
        durationTime={durationTime}
        setDurationTime={setDurationTime}
        studentProgressReportTitle={d("Learning Outcomes Achievement").t("report_label_learning_outcomes_achievement")}
      />
      <div>
        <LearningOutcomeAchievedTotalType totalType={totalType} colors={colors} />
        <StudentProgressReportFeedback />
      </div>
    </div>
  );
}
