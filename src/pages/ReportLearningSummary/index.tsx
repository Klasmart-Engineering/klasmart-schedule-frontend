import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { t } from "../../locale/LocaleManager";
import { formatTimeToMonDay } from "../../models/ModelReports";
import { RootState } from "../../reducers";
import { onLoadLearningSummary } from "../../reducers/report";
import { ReportTitle } from "../ReportDashboard";
import { FilterLearningSummary } from "./FilterLearningSummary";
import { ReportInfo } from "./ReportInfo";
import { ReportType } from "./types";

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
    const year = query.get("year") || 2021;
    const week_start = query.get("week_start") || "";
    const week_end = query.get("week_end") || "";
    const school_id = query.get("school_id") || "";
    const class_id = query.get("class_id") || "";
    const teacher_id = query.get("teacher_id") || "";
    const student_id = query.get("student_id") || "";
    const subject_id = query.get("subject_id") || "";
    return clearNull({ year, week_start, week_end, school_id, class_id, teacher_id, student_id, subject_id });
  }, [search]);
};

// const toQueryString = (hash: Record<string, any>): string => {
//   const search = new URLSearchParams(hash);
//   return `?${search.toString()}`;
// };

export function ReportLearningSummary() {
  const condition = useQuery();
  // const history = useHistory();
  const dispatch = useDispatch();
  const [reportType, setReportType] = useState<ReportType>(ReportType.live);
  // const perm = usePermission([
  //   PermissionType.report_learning_summary_org_652,
  //   PermissionType.report_learning_summary_school_651,
  //   PermissionType.report_learning_summary_teacher_650,
  //   PermissionType.report_learning_summary_student_649,
  // ]);
  const weeks = getWeeks();
  const { liveClassesSummary } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const defaultWeeksValue = useMemo(() => {
    if (condition.week_start && condition.week_end) {
      return `${formatTimeToMonDay(condition.week_start)}~${formatTimeToMonDay(condition.week_end)}`;
    }
    const lastweek = weeks[weeks.length - 1];
    return `${formatTimeToMonDay(lastweek.week_start)}~${formatTimeToMonDay(lastweek.week_end)}`;
  }, [condition.week_end, condition.week_start, weeks]);
  const years = [2021];

  const handleChange = () => {
    // history.replace({ search: toQueryString({ ...condition, page }) });
  };
  const handleChangeReportType = (value: ReportType) => {
    setReportType(value);
  };
  useEffect(() => {
    dispatch(onLoadLearningSummary(condition));
  }, [condition, dispatch]);
  return (
    <>
      <ReportTitle title={t("report_learning_summary_report")} info={t("report_msg_lsr")} />
      <FilterLearningSummary value={condition} weeks={weeks} defaultWeeksValue={defaultWeeksValue} years={years} onChange={handleChange} />
      <ReportInfo reportType={reportType} onChangeReportType={handleChangeReportType} liveClassesSummary={liveClassesSummary} />
    </>
  );
}
ReportLearningSummary.routeBasePath = "/report/learning-summary";
ReportLearningSummary.routeRedirectDefault = `/report/learning-summary`;
