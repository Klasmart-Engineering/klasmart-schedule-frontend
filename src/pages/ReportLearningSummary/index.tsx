import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
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
interface RouteParams {
  tab: ReportType.live | ReportType.assignment;
}
export const getWeeks = (): IWeeks[] => {
  let week_start = new Date("2021-01-04 00:00").getTime() / 1000;
  const currentTime = new Date().getTime() / 1000;
  let week_end = week_start + 7 * 24 * 60 * 60 - 1;
  const weeks: IWeeks[] = [];
  while (week_end < currentTime) {
    const item = `${formatTimeToMonDay(week_start)}~${formatTimeToMonDay(week_end)}`;
    weeks.push({ week_start, week_end, value: item });
    week_start = week_end + 1;
    week_end = week_start + 7 * 24 * 60 * 60 - 1;
  }
  return weeks;
};
const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

export const useQuery = (): QueryLearningSummaryCondition => {
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
    const idx = Number(query.get("lessonIndex"));
    const lessonIndex = idx >= 0 ? idx : -1;
    return { year, week_start, week_end, school_id, class_id, teacher_id, student_id, subject_id, lessonIndex };
  }, [search]);
};
export function ReportLearningSummary() {
  const dispatch = useDispatch();
  const { routeBasePath } = ReportLearningSummary;
  const condition = useQuery();
  const { lessonIndex, year, week_start, week_end, school_id, class_id, teacher_id, student_id, subject_id } = condition;
  const history = useHistory();
  const { tab } = useParams<RouteParams>();
  const { liveClassSummary, learningSummartOptions, assignmentSummary } = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  );
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
    const newValue = { ...value, lessonIndex: -1 };
    history.replace({ search: toQueryString(clearNull(newValue)) });
  };
  const handleChangeReportType = useMemo(
    () => (value: ReportType) => {
      history.replace({
        pathname: `${routeBasePath}/tab/${value}`,
        search: setQuery(history.location.search, { lessonIndex: -1 }),
      });
    },
    [history, routeBasePath]
  );
  const handleChangeLessonIndex = (index: number) => {
    history.replace({ search: setQuery(history.location.search, { lessonIndex: index }) });
  };
  useEffect(() => {
    if (learningSummartOptions.studentList.length || learningSummartOptions.subjectList.length) {
      if (year && week_start && week_end && student_id && subject_id) {
        history.push({
          search: setQuery(history.location.search, { student_id, subject_id, week_start, week_end, year }),
        });
      } else {
        const stu_id = learningSummartOptions.studentList[0].user_id;
        const sub_id = "all";
        const { week } = learningSummartOptions;
        const { week_start, week_end } = week[week.length - 1];
        const year = learningSummartOptions.year[0];
        history.push({
          search: setQuery(history.location.search, { student_id: stu_id, subject_id: sub_id, week_start, week_end, year }),
        });
      }
    }
  }, [
    history,
    learningSummartOptions,
    learningSummartOptions.studentList,
    learningSummartOptions.subjectList,
    learningSummartOptions.week,
    learningSummartOptions.year,
    student_id,
    subject_id,
    week_end,
    week_start,
    year,
  ]);
  useEffect(() => {
    dispatch(
      onLoadLearningSummary({ year, week_start, week_end, school_id, class_id, teacher_id, student_id, subject_id, metaLoading: true })
    );
  }, [year, week_start, week_end, school_id, class_id, teacher_id, student_id, subject_id, dispatch, learningSummartOptions.year]);
  return (
    <>
      <ReportTitle title={t("report_learning_summary_report")} info={t("report_msg_lsr")} />
      <FilterLearningSummary
        learningSummartOptions={learningSummartOptions}
        value={condition}
        defaultWeeksValue={defaultWeeksValue}
        onChange={handleChange}
      />
      <ReportInfo
        lessonIndex={lessonIndex!}
        reportType={tab}
        onChangeReportType={handleChangeReportType}
        liveClassSummary={liveClassSummary}
        assignmentSummary={assignmentSummary}
        onChangeLessonIndex={handleChangeLessonIndex}
      />
    </>
  );
}
ReportLearningSummary.routeBasePath = "/report/learning-summary";
ReportLearningSummary.routeMatchPath = `/report/learning-summary/tab/:tab`;
ReportLearningSummary.routeRedirectDefault = `/report/learning-summary/tab/live?lessonIndex=-1`;
