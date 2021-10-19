import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { d, t } from "../../../locale/LocaleManager";
import { getFourWeeks, getSixMonths } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
import { getAssignmentsCompletion } from "../../../reducers/report";
import LearningOutcomeAchievedTotalType from "../components/LearningOutcomeAchievedTotalType";
import StudentProgressReportFeedback from "../components/StudentProgressReportFeedback";
import StudentProgressReportFilter from "../components/StudentProgressReportFilter";

export default function () {
  const [durationTime, setDurationTime] = useState(4);
  const colors = ["#0e78d5", "#bed6eb", "#a8c0ef"];
  const dispatch = useDispatch();
  const { assignmentsCompletion, fourWeeksAssignmentsCompletionMassage } = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  );
  console.log(assignmentsCompletion);
  const totalType = [
    {
      label: t("report_label_student_assignments_completion_rate"),
      data: 387,
      // data: Math.floor(assignmentsCompletion.reduce((prev, current) => {
      //  return prev + item.student_designated_subject
      // }, 0) / assignmentsCompletion.length * 100) + "%"
      idx: 0,
    },
    {
      label: t("report_label_class_average_assignments_completion_rate"),
      data: 361,
      // data: Math.floor(assignmentsCompletion.reduce((prev, current) => {
      //  return prev + item.class_designated_subject
      // }, 0) / assignmentsCompletion.length * 100) + "%"
      idx: 1,
    },
    {
      label: t("report_label_subject_average_assignments_completion_rate"),
      data: 358,
      // data: Math.floor(assignmentsCompletion.reduce((prev, current) => {
      //  return prev + item.student_non_designated_subject
      // }, 0) / assignmentsCompletion.length * 100) + "%"
      idx: 2,
    },
  ];

  useEffect(() => {
    setDurationTime(4);
    dispatch(
      getAssignmentsCompletion({
        class_id: "",
        durations: getFourWeeks(),
        selected_subject_id_list: [""],
        student_id: "",
        un_selected_subject_id_list: [""],
      })
    );
  }, [dispatch]);
  const handleChange = useMemo(
    () => (value: number) => {
      setDurationTime(value);
      dispatch(
        getAssignmentsCompletion({
          class_id: "",
          durations: value === 4 ? getFourWeeks() : getSixMonths(),
          selected_subject_id_list: [""],
          student_id: "",
          un_selected_subject_id_list: [""],
        })
      );
    },
    [dispatch]
  );

  return (
    <div>
      <StudentProgressReportFilter
        durationTime={durationTime}
        handleChange={handleChange}
        studentProgressReportTitle={d("Assignment Completion").t("report_label_assignment_completion")}
      />
      <div>
        <LearningOutcomeAchievedTotalType totalType={totalType} colors={colors} />
        <StudentProgressReportFeedback fourWeeksMassage={fourWeeksAssignmentsCompletionMassage} />
      </div>
    </div>
  );
}
