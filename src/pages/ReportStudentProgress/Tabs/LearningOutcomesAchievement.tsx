import { createStyles, makeStyles } from "@material-ui/styles";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { d, t } from "../../../locale/LocaleManager";
import { getFourWeeks, getSixMonths, parsePercent, translateMonth } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
import { getLearnOutcomeAchievement } from "../../../reducers/report";
import LearningOutcomeAchievedTotalType from "../components/LearningOutcomeAchievedTotalType";
import StudentProgressBarChart, { BarGroupProps } from "../components/StudentProgressBarChart";
import StudentProgressReportFeedback from "../components/StudentProgressReportFeedback";
import StudentProgressReportFilter from "../components/StudentProgressReportFilter";

const useStyle = makeStyles((theme) =>
  createStyles({
    chart: {
      maxHeight: "415px",
      height: "415px",
    },
  })
);
export default function () {
  const [durationTime, setDurationTime] = useState(4);
  const dispatch = useDispatch();
  const style = useStyle();
  const { learnOutcomeAchievement, fourWeekslearnOutcomeAchievementMassage } = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  );

  const colors = ["#0e78d5", "#ededed", "#bed6eb", "#a8c0ef"];
  const totalType = [
    {
      label: t("report_label_total_newly_achieved_lo"),
      data: 387,
      // data: learnOutcomeAchievement["first_achieved_count"],
      idx: 0,
    },
    {
      label: t("report_label_total_reachieved_lo"),
      data: 361,
      // data: learnOutcomeAchievement["re_achieved_count"],
      idx: 1,
    },
    {
      label: t("report_label_total_achieved_lo_class_average"),
      data: 358,
      // data: learnOutcomeAchievement["class_average_achieved_count"],
      idx: 2,
    },
    {
      label: t("report_label_total_achieved_lo_subject_average"),
      data: 387,
      // data: learnOutcomeAchievement["un_selected_subjects_average_achieved_count"],
      idx: 3,
    },
  ];
  useEffect(() => {
    setDurationTime(4);
    dispatch(
      getLearnOutcomeAchievement({
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
        getLearnOutcomeAchievement({
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

  const data: BarGroupProps["data"] =
    learnOutcomeAchievement.items?.map((item) => {
      const time = item.duration?.split("-") || [];
      return {
        time:
          durationTime === 4
            ? `${moment(Number(time[0]) * 1000).format("MM.DD")}-${moment(Number(time[1]) * 1000).format("MM.DD")}`
            : translateMonth(moment(Number(time[0]) * 1000).get("month")),
        v1: [parsePercent(item.first_achieved_percentage), parsePercent(item.re_achieved_percentage)],
        v2: parsePercent(item.class_average_achieve_percent),
        v3: parsePercent(item.un_selected_subjects_average_achieve_percentage),
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
        <LearningOutcomeAchievedTotalType totalType={totalType} colors={colors} />
        <StudentProgressReportFeedback fourWeeksMassage={fourWeekslearnOutcomeAchievementMassage} />
      </div>
    </div>
  );
}
