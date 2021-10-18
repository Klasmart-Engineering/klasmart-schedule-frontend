import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { d, t } from "../../../locale/LocaleManager";
import { getFourWeeks, getSixMonths } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
import { getLearnOutcomeClassAttendance } from "../../../reducers/report";
import LearningOutcomeAchievedTotalType from "../components/LearningOutcomeAchievedTotalType";
import StudentProgressReportFeedback from "../components/StudentProgressReportFeedback";
import StudentProgressReportFilter from "../components/StudentProgressReportFilter";

export default function () {
  const [durationTime, setDurationTime] = useState(4);
  const colors = ["#0e78d5", "#bed6eb", "#a8c0ef"];
  const dispatch = useDispatch();
  const { learnOutcomeClassAttendance } = useSelector<RootState, RootState["report"]>((state) => state.report);
  console.log(learnOutcomeClassAttendance);

  const totalType = [
    {
      label: t("report_label_student_attendance_rate"),
      data: 387,
      idx: 0,
    },
    {
      label: t("report_label_class_average_attendance_rate"),
      data: 361,
      idx: 1,
    },
    {
      label: t("report_label_subject_average_attendance_rate"),
      data: 358,
      idx: 2,
    },
  ];

  useEffect(() => {
    dispatch(
      getLearnOutcomeClassAttendance({
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
        studentProgressReportTitle={d("Class Attendance").t("report_label_class_attendance")}
      />
      <div>
        <LearningOutcomeAchievedTotalType totalType={totalType} colors={colors} />
        <StudentProgressReportFeedback />
      </div>
    </div>
  );
}
