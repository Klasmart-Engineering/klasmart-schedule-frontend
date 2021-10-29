import { createStyles, makeStyles } from "@material-ui/styles";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { d, t } from "../../../locale/LocaleManager";
import { getFourWeeks, getSixMonths, parsePercent, translateMonth } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
import { getLearnOutcomeAchievement } from "../../../reducers/report";
import LearningOutcomeAchievedTotalType from "../components/LearningOutcomeAchievedTotalType";
import StudentProgressBarChart, { BarGroupProps } from "../components/StudentProgressBarChart";
import StudentProgressReportFeedback from "../components/StudentProgressReportFeedback";
import StudentProgressReportFilter from "../components/StudentProgressReportFilter";
import { SelectContext } from "../index";

const useStyle = makeStyles((theme) =>
  createStyles({
    chart: {
      maxHeight: "415px",
      height: "415px",
    },
  })
);
export default function LearningOutcomesAchievement() {
  const [durationTime, setDurationTime] = useState(4);
  const dispatch = useDispatch();
  const { classId, studentId, allSubjectId, selectedSubjectId: selectedSubjectID } = useContext(SelectContext);
  const selectedSubjectId: string[] =
    selectedSubjectID.length === allSubjectId.length - 1 ? selectedSubjectID.concat([""]) : selectedSubjectID;
  const unselectedSubjectId =
    selectedSubjectID.length === allSubjectId.length - 1
      ? []
      : allSubjectId.filter((item) => selectedSubjectID.every((val) => val !== item));
  const style = useStyle();
  const { learnOutcomeAchievement, fourWeekslearnOutcomeAchievementMassage } = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  );

  const colors = ["#0e78d5", "#ededed", "#bed6eb", "#a8c0ef"];
  const totalType = [
    {
      label: t("report_label_total_newly_achieved_lo"),
      data: Math.ceil(learnOutcomeAchievement.first_achieved_count || 0),
      idx: 0,
    },
    {
      label: t("report_label_total_reachieved_lo"),
      data: Math.ceil(learnOutcomeAchievement.re_achieved_count || 0),
      idx: 1,
    },
    {
      label: t("report_label_total_achieved_lo_class_average"),
      data: Math.ceil(learnOutcomeAchievement.class_average_achieved_count || 0),
      idx: 2,
    },
    {
      label: t("report_label_total_achieved_lo_subject_average"),
      data: Math.ceil(learnOutcomeAchievement.un_selected_subjects_average_achieve_count || 0),
      idx: 3,
    },
  ];
  useEffect(() => {
    setDurationTime(4);
    if (classId && studentId) {
      dispatch(
        getLearnOutcomeAchievement({
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
  }, [classId, selectedSubjectID, studentId]);
  const handleChange = React.useMemo(
    () => (value: number) => {
      setDurationTime(value);
      dispatch(
        getLearnOutcomeAchievement({
          metaLoading: true,
          class_id: classId,
          durations: value === 4 ? getFourWeeks() : getSixMonths(),
          selected_subject_id_list: selectedSubjectId,
          student_id: studentId,
          un_selected_subject_id_list: unselectedSubjectId,
        })
      );
    },
    // eslint-disable-next-line
    [classId, selectedSubjectID, studentId]
  );

  const data: BarGroupProps["data"] =
    learnOutcomeAchievement.items?.map((item) => {
      const time = item.duration?.split("-") || [];
      return {
        time:
          durationTime === 4
            ? `${moment(Number(time[0]) * 1000).format("MM.DD")}-${moment((Number(time[1]) - 1) * 1000).format("MM.DD")}`
            : translateMonth(moment(Number(time[0]) * 1000).get("month")),
        v1: [item.first_achieved_percentage, item.re_achieved_percentage],
        v2: parsePercent(item.class_average_achieved_percentage),
        v3: parsePercent(item.un_selected_subjects_average_achieved_percentage),
      } as BarGroupProps["data"][0];
    }) || [];

  const label = { v1: [totalType[0].label, totalType[1].label], v2: totalType[2].label, v3: totalType[3].label };
  return (
    <div>
      <StudentProgressReportFilter
        durationTime={durationTime}
        handleChange={handleChange}
        studentProgressReportTitle={d("Learning Outcomes Achievement").t("report_label_learning_outcomes_achievement")}
      />
      <div className={style.chart}>
        <StudentProgressBarChart data={data} label={label} itemUnit={"%"} />
      </div>
      <div>
        <LearningOutcomeAchievedTotalType totalType={totalType} colors={colors} isLearningOutcomeAchieved={true} />
        <StudentProgressReportFeedback fourWeeksMassage={fourWeekslearnOutcomeAchievementMassage} />
      </div>
    </div>
  );
}
