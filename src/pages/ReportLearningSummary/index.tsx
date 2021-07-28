import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { t } from "../../locale/LocaleManager";
import { setQuery, toQueryString } from "../../models/ModelContentDetailForm";
import { formatTimeToMonDay } from "../../models/ModelReports";
import { RootState } from "../../reducers";
import { onLoadLearningSummary } from "../../reducers/report";
import { ReportTitle } from "../ReportDashboard";
import { FilterLearningSummary } from "./FilterLearningSummary";
import { ReportInfo } from "./ReportInfo";
import { QueryLearningSummaryCondition, ReportType } from "./types";

export interface IWeeks {
  week_start: number;
  week_end: number;
  value: string;
}
export const getWeeks = (): IWeeks[] => {
  let week_start = new Date("2021-01-04").getTime() / 1000;
  const currentTime = new Date().getTime() / 1000;
  let week_end = week_start + 7 * 24 * 60 * 60;
  const weeks: IWeeks[] = [];
  while (week_end < currentTime) {
    const item = `${formatTimeToMonDay(week_start)}~${formatTimeToMonDay(week_end)}`;
    weeks.push({ week_start, week_end, value: item });
    week_start = week_end + 24 * 60 * 60;
    week_end = week_start + 7 * 24 * 60 * 60;
  }
  return weeks;
};
const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

export const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const year = Number(query.get("year")) || 2021;
    const week_start = Number(query.get("week_start"));
    const week_end = Number(query.get("week_end"));
    const school_id = query.get("school_id") || "";
    const class_id = query.get("class_id") || "";
    const teacher_id = query.get("teacher_id") || "";
    const student_id = query.get("student_id") || "";
    const subject_id = query.get("subject_id") || "";
    return clearNull({ year, week_start, week_end, school_id, class_id, teacher_id, student_id, subject_id });
  }, [search]);
};
export function ReportLearningSummary() {
  const condition = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const [reportType, setReportType] = useState<ReportType>(ReportType.live);
  const { liveClassSummary, learningSummartOptions } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const { week } = learningSummartOptions;
  const defaultWeeksValue = useMemo(() => {
    if (condition.week_start && condition.week_end) {
      return `${formatTimeToMonDay(condition.week_start)}~${formatTimeToMonDay(condition.week_end)}`;
    }
    if (week.length) {
      const lastweek = week[week.length - 1];
      return `${formatTimeToMonDay(lastweek.week_start)}~${formatTimeToMonDay(lastweek.week_end)}`;
    }
    return "";
  }, [condition.week_end, condition.week_start, week]);
  const handleChange = (value: QueryLearningSummaryCondition) => {
    history.replace({ search: toQueryString(clearNull(value)) });
  };
  const handleChangeReportType = (value: ReportType) => {
    setReportType(value);
  };
  useEffect(() => {
    if (learningSummartOptions.studentList.length || learningSummartOptions.subjectList.length) {
      const student_id = learningSummartOptions.studentList[0].user_id;
      const subject_id = learningSummartOptions.subjectList[0].id!;
      const { week } = learningSummartOptions;
      const { week_start, week_end } = week[week.length - 1];
      const year = learningSummartOptions.year[0];
      history.push({
        search: setQuery(history.location.search, { student_id, subject_id, week_start, week_end, year }),
      });
    }
  }, [
    history,
    learningSummartOptions,
    learningSummartOptions.studentList,
    learningSummartOptions.subjectList,
    learningSummartOptions.week,
    learningSummartOptions.year,
  ]);
  useEffect(() => {
    dispatch(onLoadLearningSummary({ ...condition, metaLoading: true }));
  }, [condition, dispatch]);
  return (
    <>
      <ReportTitle title={t("report_learning_summary_report")} info={t("report_msg_lsr")} />
      <FilterLearningSummary
        learningSummartOptions={learningSummartOptions}
        value={condition}
        defaultWeeksValue={defaultWeeksValue}
        onChange={handleChange}
      />
      <ReportInfo reportType={reportType} onChangeReportType={handleChangeReportType} liveClassSummary={liveClassSummary} />
    </>
  );
}
ReportLearningSummary.routeBasePath = "/report/learning-summary";
ReportLearningSummary.routeRedirectDefault = `/report/learning-summary`;
