import { createStyles, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { d, t } from "../../../locale/LocaleManager";
import { getFourWeeks, getSixMonths } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
import { getAssignmentsCompletion } from "../../../reducers/report";
import LearningOutcomeAchievedTotalType from "../components/LearningOutcomeAchievedTotalType";
import StudentProgressBarChart from "../components/StudentProgressBarChart";
import StudentProgressReportFeedback from "../components/StudentProgressReportFeedback";
import StudentProgressReportFilter from "../components/StudentProgressReportFilter";
const useStyle = makeStyles(() =>
  createStyles({
    chart: {
      maxHeight: "415px",
      height: "415px",
    },
  })
);

export default function () {
  const [durationTime, setDurationTime] = useState(4);
  const colors = ["#0e78d5", "#bed6eb", "#a8c0ef"];
  const dispatch = useDispatch();
  const css = useStyle();
  const { assignmentsCompletion } = useSelector<RootState, RootState["report"]>((state) => state.report);
  console.log(assignmentsCompletion);
  const totalType = [
    {
      label: t("report_label_student_assignments_completion_rate"),
      data: 387,
      idx: 0,
    },
    {
      label: t("report_label_class_average_assignments_completion_rate"),
      data: 361,
      idx: 1,
    },
    {
      label: t("report_label_subject_average_assignments_completion_rate"),
      data: 358,
      idx: 2,
    },
  ];

  const label = { v1: totalType[0].label, v2: totalType[1].label, v3: totalType[2].label };

  useEffect(() => {
    dispatch(
      getAssignmentsCompletion({
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
        studentProgressReportTitle={d("Assignment Completion").t("report_label_assignment_completion")}
      />
      <div className={css.chart}>
        <StudentProgressBarChart data={[]} label={label} />
      </div>
      <div>
        <LearningOutcomeAchievedTotalType totalType={totalType} colors={colors} />
        <StudentProgressReportFeedback />
      </div>
    </div>
  );
}
