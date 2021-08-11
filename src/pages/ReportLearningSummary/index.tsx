import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { PermissionType, usePermission } from "../../components/Permission";
import { t } from "../../locale/LocaleManager";
import { setQuery, toQueryString } from "../../models/ModelContentDetailForm";
import { formatTimeToMonDay, getTimeOffSecond } from "../../models/ModelReports";
import { RootState } from "../../reducers";
import { getTimeFilter, onLoadLearningSummary } from "../../reducers/report";
import { ReportTitle } from "../ReportDashboard";
import { FilterLearningSummary, FilterLearningSummaryProps } from "./FilterLearningSummary";
import { ReportInfo } from "./ReportInfo";
import { QueryLearningSummaryCondition, QueryLearningSummaryRemainingFilterCondition, ReportType } from "./types";
export interface IWeeks {
  week_start: number;
  week_end: number;
  value: string;
}
interface RouteParams {
  tab: QueryLearningSummaryRemainingFilterCondition["summary_type"];
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
  // const isLiveClass = tab === ReportType.live
  const { liveClassSummary, assignmentSummary, summaryReportOptions } = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  );
  const perm = usePermission([
    PermissionType.report_learning_summary_org_652,
    PermissionType.report_learning_summary_school_651,
    PermissionType.report_learning_summary_teacher_650,
    PermissionType.report_learning_summary_student_649,
  ]);
  const isOrg = perm.report_learning_summary_org_652;
  const isSchool = perm.report_learning_summary_school_651;
  const isTeacher = perm.report_learning_summary_teacher_650;
  const isStudent = perm.report_learning_summary_student_649;
  const { weeks } = summaryReportOptions;
  const defaultWeeksValue = useMemo(() => {
    if (condition.week_start && condition.week_end) {
      return `${formatTimeToMonDay(condition.week_start)}~${formatTimeToMonDay(condition.week_end)}`;
    }
    if (weeks && weeks.length) {
      const lastweek = weeks[weeks.length - 1];
      return `${lastweek.value}`;
    }
    return "";
  }, [condition.week_end, condition.week_start, weeks]);
  const handleChange = (value: QueryLearningSummaryCondition) => {
    const newValue = { ...value, lessonIndex: -1 };
    history.replace({ search: toQueryString(clearNull(newValue)) });
  };
  const handleChangeFilter: FilterLearningSummaryProps["onChangeFilter"] = (value, tab) => {
    computeFilterChange(value, tab);
  };
  const computeFilterChange = useMemo(
    () => (value: string, tab: keyof QueryLearningSummaryCondition) => {
      if (tab === "school_id") {
        history.push({
          search: setQuery(history.location.search, { school_id: value, class_id: "", teacher_id: "", student_id: "", subject_id: "" }),
        });
      }
      if (tab === "class_id") {
        history.push({ search: setQuery(history.location.search, { class_id: value, teacher_id: "", student_id: "", subject_id: "" }) });
      }
      if (tab === "teacher_id") {
        history.push({ search: setQuery(history.location.search, { teacher_id: value, student_id: "", subject_id: "" }) });
      }
      if (tab === "student_id") {
        history.push({ search: setQuery(history.location.search, { student_id: value, subject_id: "" }) });
      }
      if (tab === "subject_id") {
        history.push({ search: setQuery(history.location.search, { subject_id: value }) });
      }
    },
    [history]
  );
  // const handleChangeTime = (value: QueryLearningSummaryCondition) => {
  //   const newValue = { ...value, lessonIndex: -1 };
  //   // const { week_start, week_end } = value
  //   // dispatch(getInfoFilter({summary_type: tab, week_start, week_end}))
  //   history.replace({ search: toQueryString(clearNull(newValue)) });
  // }
  const handleChangeReportType = useMemo(
    () => (value: ReportType) => {
      history.replace(`${routeBasePath}/tab/${value}?lessonIndex=-1`);
    },
    [history, routeBasePath]
  );
  const handleChangeLessonIndex = (index: number) => {
    history.replace({ search: setQuery(history.location.search, { lessonIndex: index }) });
  };
  useEffect(() => {
    // 调拉取时间的接口
    if (!summaryReportOptions.years.length || !summaryReportOptions.weeks.length) {
      console.log(1);
      const time_offset = getTimeOffSecond();
      dispatch(getTimeFilter({ time_offset, summary_type: tab, metaLoading: true }));
    } else {
      console.log(2);
      const {
        year = "",
        week_start = "",
        week_end = "",
        school_id = "",
        class_id = "",
        teacher_id = "",
        student_id = "",
        subject_id = "",
      } = summaryReportOptions;
      history.push({
        search: setQuery(history.location.search, { year, week_start, week_end, school_id, class_id, teacher_id, student_id, subject_id }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, summaryReportOptions.weeks, summaryReportOptions.years, tab]);
  useEffect(() => {
    if (summaryReportOptions.year && summaryReportOptions.week_start && summaryReportOptions.week_end) {
      const {
        year,
        week_start,
        week_end,
        school_id = "",
        class_id = "",
        teacher_id = "",
        student_id = "",
        subject_id = "",
      } = summaryReportOptions;
      history.push({
        search: setQuery(history.location.search, { year, week_start, week_end, school_id, class_id, teacher_id, student_id, subject_id }),
      });
    }
  }, [history, summaryReportOptions]);
  useEffect(() => {
    console.log(3);
    dispatch(
      onLoadLearningSummary({
        isOrg,
        isSchool,
        isTeacher,
        isStudent,
        summary_type: tab,
        year,
        week_start,
        week_end,
        school_id,
        class_id,
        teacher_id,
        student_id,
        subject_id,
        metaLoading: true,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, year, week_end, school_id, tab]);
  return (
    <>
      <ReportTitle title={t("report_learning_summary_report")} info={t("report_msg_lsr")} />
      <FilterLearningSummary
        value={condition}
        defaultWeeksValue={defaultWeeksValue}
        onChange={handleChange}
        onChangeFilter={handleChangeFilter}
        summaryReportOptions={summaryReportOptions}
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
ReportLearningSummary.routeRedirectDefault = `/report/learning-summary/tab/${ReportType.live}?lessonIndex=-1`;
