import { createStyles, makeStyles } from "@material-ui/core";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectContext } from "..";
import { EntityClassAttendanceResponseItem } from "../../../api/api.auto";
import { d, t } from "../../../locale/LocaleManager";
import { getFourWeeks, getSixMonths, parsePercent, translateMonth } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
import { getLearnOutcomeClassAttendance } from "../../../reducers/report";
import LearningOutcomeAchievedTotalType from "../components/LearningOutcomeAchievedTotalType";
import StudentProgressBarChart, { BarGroupProps } from "../components/StudentProgressBarChart";
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
  const { classId, studentId, allSubjectId, selectedSubjectId } = useContext(SelectContext);
  const unselectedSubjectId = allSubjectId.filter((item) => selectedSubjectId.every((val) => val !== item));
  const colors = ["#0e78d5", "#bed6eb", "#a8c0ef"];
  const css = useStyle();
  const dispatch = useDispatch();
  const { learnOutcomeClassAttendance, fourWeeksClassAttendanceMassage } = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  );
  const items: EntityClassAttendanceResponseItem[] = learnOutcomeClassAttendance.items ? learnOutcomeClassAttendance.items : [];

  const totalType = [
    {
      label: t("report_label_student_attendance_rate"),
      data:
        parsePercent(
          items.reduce((prev, current) => {
            return prev + (current.attendance_percentage || 0);
          }, 0) / items.length || 0
        ) + "%",
      idx: 0,
    },
    {
      label: t("report_label_class_average_attendance_rate"),
      data:
        parsePercent(
          items.reduce((prev, current) => {
            return prev + (current.class_average_attendance_percentage || 0);
          }, 0) / items.length || 0
        ) + "%",
      idx: 1,
    },
    {
      label: t("report_label_subject_average_attendance_rate"),
      data:
        parsePercent(
          items.reduce((prev, current) => {
            return prev + (current.un_selected_subjects_average_attendance_percentage || 0);
          }, 0) / items.length || 0
        ) + "%",
      idx: 2,
    },
  ];

  const chartData: BarGroupProps["data"] =
    learnOutcomeClassAttendance.items?.map((item) => {
      const time = item.duration?.split("-") || [];
      return {
        time:
          durationTime === 4
            ? `${moment(Number(time[0]) * 1000).format("MM.DD")}-${moment(Number(time[1]) * 1000).format("MM.DD")}`
            : translateMonth(moment(Number(time[0]) * 1000).get("month")),
        v1: parsePercent(item.attendance_percentage),
        v2: parsePercent(item.class_average_attendance_percentage),
        v3: parsePercent(item.un_selected_subjects_average_attendance_percentage),
      } as BarGroupProps["data"][0];
    }) || [];

  const label = { v1: totalType[0].label, v2: totalType[1].label, v3: totalType[2].label };

  useEffect(() => {
    setDurationTime(4);
    dispatch(
      getLearnOutcomeClassAttendance({
        metaLoading: true,
        class_id: classId,
        durations: getFourWeeks(),
        selected_subject_id_list: selectedSubjectId,
        student_id: studentId,
        un_selected_subject_id_list: unselectedSubjectId,
      })
    );
  }, [dispatch, classId, selectedSubjectId, studentId, unselectedSubjectId]);

  const handleChange = useMemo(
    () => (value: number) => {
      setDurationTime(value);
      dispatch(
        getLearnOutcomeClassAttendance({
          metaLoading: true,
          class_id: classId,
          durations: value === 4 ? getFourWeeks() : getSixMonths(),
          selected_subject_id_list: selectedSubjectId,
          student_id: studentId,
          un_selected_subject_id_list: unselectedSubjectId,
        })
      );
    },
    [dispatch, classId, selectedSubjectId, studentId, unselectedSubjectId]
  );

  return (
    <div>
      <StudentProgressReportFilter
        durationTime={durationTime}
        handleChange={handleChange}
        studentProgressReportTitle={d("Class Attendance").t("report_label_class_attendance")}
      />
      <div className={css.chart}>
        <StudentProgressBarChart data={chartData} label={label} />
      </div>
      <div>
        <LearningOutcomeAchievedTotalType totalType={totalType} colors={colors} isLearningOutcomeAchieved={false} />
        <StudentProgressReportFeedback fourWeeksMassage={fourWeeksClassAttendanceMassage} />
      </div>
    </div>
  );
}
