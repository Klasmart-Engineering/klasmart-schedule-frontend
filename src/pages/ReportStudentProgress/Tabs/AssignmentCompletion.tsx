import { createStyles, makeStyles } from "@material-ui/core";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectContext } from "..";
import { d, t } from "../../../locale/LocaleManager";
import { getFourWeeks, getSixMonths, parsePercent, translateMonth } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
import { getAssignmentsCompletion } from "../../../reducers/report";
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
  const dispatch = useDispatch();
  const css = useStyle();
  const { assignmentsCompletion, fourWeeksAssignmentsCompletionMassage } = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  );
  const totalType = [
    {
      label: t("report_label_student_assignments_completion_rate"),
      data:
        parsePercent(
          assignmentsCompletion.reduce((prev, current) => {
            return prev + (current.student_designated_subject || 0);
          }, 0) / assignmentsCompletion.length || 0
        ) + "%",
      idx: 0,
    },
    {
      label: t("report_label_class_average_assignments_completion_rate"),
      data:
        parsePercent(
          assignmentsCompletion.reduce((prev, current) => {
            return prev + (current.class_designated_subject || 0);
          }, 0) / assignmentsCompletion.length || 0
        ) + "%",
      idx: 1,
    },
    {
      label: t("report_label_subject_average_assignments_completion_rate"),
      data:
        parsePercent(
          assignmentsCompletion.reduce((prev, current) => {
            return prev + (current.student_non_designated_subject || 0);
          }, 0) / assignmentsCompletion.length || 0
        ) + "%",
      idx: 2,
    },
  ];

  const chartData: BarGroupProps["data"] =
    assignmentsCompletion.map((item) => {
      const time = item.duration?.split("-") || [];
      return {
        time:
          durationTime === 4
            ? `${moment(Number(time[0]) * 1000).format("MM.DD")}-${moment(Number(time[1]) * 1000).format("MM.DD")}`
            : translateMonth(moment(Number(time[0]) * 1000).get("month")),
        v1: parsePercent(item.student_designated_subject),
        v2: parsePercent(item.class_designated_subject),
        v3: parsePercent(item.student_non_designated_subject),
      } as BarGroupProps["data"][0];
    }) || [];

  const label = { v1: totalType[0].label, v2: totalType[1].label, v3: totalType[2].label };

  useEffect(() => {
    setDurationTime(4);
    dispatch(
      getAssignmentsCompletion({
        metaLoading: true,
        class_id: classId,
        school_id: "6879ac4b-7d4b-4462-9ba6-ff60e54777e4",
        durations: getFourWeeks(),
        selected_subject_id_list: selectedSubjectId,
        student_id: studentId,
        un_selected_subject_id_list: unselectedSubjectId,
      })
    );
    // eslint-disable-next-line
  }, [dispatch, classId, selectedSubjectId, studentId]);
  const handleChange = useMemo(
    () => (value: number) => {
      setDurationTime(value);
      dispatch(
        getAssignmentsCompletion({
          metaLoading: true,
          class_id: classId,
          school_id: "6879ac4b-7d4b-4462-9ba6-ff60e54777e4",
          durations: value === 4 ? getFourWeeks() : getSixMonths(),
          selected_subject_id_list: selectedSubjectId,
          student_id: studentId,
          un_selected_subject_id_list: unselectedSubjectId,
        })
      );
    },
    // eslint-disable-next-line
    [dispatch, classId, selectedSubjectId, studentId]
  );

  return (
    <div>
      <StudentProgressReportFilter
        durationTime={durationTime}
        handleChange={handleChange}
        studentProgressReportTitle={d("Assignment Completion").t("report_label_assignment_completion")}
      />
      <div className={css.chart}>
        <StudentProgressBarChart itemUnit={"%"} data={chartData} label={label} />
      </div>
      <div>
        <LearningOutcomeAchievedTotalType totalType={totalType} colors={colors} isLearningOutcomeAchieved={false} />
        <StudentProgressReportFeedback fourWeeksMassage={fourWeeksAssignmentsCompletionMassage} />
      </div>
    </div>
  );
}
