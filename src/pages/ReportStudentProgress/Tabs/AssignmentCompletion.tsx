import { createStyles, makeStyles } from "@material-ui/core";
import { getFourWeeks, getLastedMonths } from "@utilities/dateUtilities";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SelectContext } from "..";
import { d, t } from "../../../locale/LocaleManager";
import { parsePercent, translateMonth } from "../../../models/ModelReports";
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

export default function AssignmentCompletion() {
  const [durationTime, setDurationTime] = useState(4);
  const { classId, studentId, allSubjectId, selectedSubjectId: selectedSubjectID } = useContext(SelectContext);
  const selectedSubjectId: string[] =
    selectedSubjectID.length === allSubjectId.length - 1 ? selectedSubjectID.concat([""]) : selectedSubjectID;
  const unselectedSubjectId =
    selectedSubjectID.length === allSubjectId.length - 1
      ? []
      : allSubjectId.filter((item) => selectedSubjectID.every((val) => val !== item));
  const colors = ["#0e78d5", "#bed6eb", "#a8c0ef"];
  const dispatch = useDispatch();
  const css = useStyle();
  const { assignmentsCompletion, fourWeeksAssignmentsCompletionMassage } = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  );
  const type = [
    t("report_label_student_assignments_completion_rate"),
    t("report_label_class_average_assignments_completion_rate"),
    t("report_label_subject_average_assignments_completion_rate"),
  ];
  const value: string[] = ["student_designated_subject", "class_designated_subject", "student_non_designated_subject"];

  const totalType = type.map((item, idx) => ({
    label: item,
    data:
      parsePercent(
        assignmentsCompletion.reduce((prev, current) => {
          return prev + (Object(current)[value[idx]] || 0);
        }, 0) / assignmentsCompletion.length || 0
      ) + "%",
    idx,
  }));

  const chartData: BarGroupProps["data"] =
    assignmentsCompletion.map((item) => {
      const time = item.duration?.split("-") || [];
      return {
        time:
          durationTime === 4
            ? `${moment(Number(time[0]) * 1000).format("MM.DD")}-${moment((Number(time[1]) - 1) * 1000).format("MM.DD")}`
            : translateMonth(moment(Number(time[0]) * 1000).get("month")),
        v1: parsePercent(item.student_designated_subject),
        v2: parsePercent(item.class_designated_subject),
        v3: parsePercent(item.student_non_designated_subject),
      } as BarGroupProps["data"][0];
    }) || [];

  const label = { v1: totalType[0].label, v2: totalType[1].label, v3: totalType[2].label };

  useEffect(() => {
    setDurationTime(4);
    if (classId && studentId) {
      dispatch(
        getAssignmentsCompletion({
          metaLoading: true,
          class_id: classId,
          durations: getFourWeeks(),
          selected_subject_id_list: selectedSubjectId,
          student_id: studentId,
          un_selected_subject_id_list: unselectedSubjectId,
        })
      );
    }
    // eslint-disable-next-line
  }, [dispatch, classId, selectedSubjectID, studentId]);
  const handleChange = useMemo(
    () => (value: number) => {
      setDurationTime(value);
      dispatch(
        getAssignmentsCompletion({
          metaLoading: true,
          class_id: classId,
          durations: value === 4 ? getFourWeeks() : getLastedMonths(6),
          selected_subject_id_list: selectedSubjectId,
          student_id: studentId,
          un_selected_subject_id_list: unselectedSubjectId,
        })
      );
    },
    // eslint-disable-next-line
    [dispatch, classId, selectedSubjectID, studentId]
  );

  return (
    <div>
      <StudentProgressReportFilter
        durationTime={durationTime}
        handleChange={handleChange}
        studentProgressReportTitle={d("Assignments Completion Rate").t("report_label_assignments_completion_rate")}
      />
      <div className={css.chart}>
        <StudentProgressBarChart itemUnit={"%"} data={chartData} label={label} durationTime={durationTime} />
      </div>
      <div>
        <LearningOutcomeAchievedTotalType totalType={totalType} colors={colors} isLearningOutcomeAchieved={false} />
        <StudentProgressReportFeedback fourWeeksMassage={fourWeeksAssignmentsCompletionMassage} />
      </div>
    </div>
  );
}
