import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { PermissionType, usePermission } from "../../components/Permission";
import { t } from "../../locale/LocaleManager";
import { setQuery, toQueryString } from "../../models/ModelContentDetailForm";
import { formatTimeToMonDay, getTimeOffSecond } from "../../models/ModelReports";
import { RootState } from "../../reducers";
import {
  AsyncTrunkReturned,
  getAfterClassFilter,
  getAssignmentSummary,
  getLiveClassesSummary,
  getTimeFilter,
  onLoadLearningSummary,
} from "../../reducers/report";
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
  const isOrg = perm.report_learning_summary_org_652 as boolean;
  const isSchool = perm.report_learning_summary_school_651 as boolean;
  const isTeacher = perm.report_learning_summary_teacher_650 as boolean;
  const isStudent = perm.report_learning_summary_student_649 as boolean;
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
  const handleChangeWeekFilter: FilterLearningSummaryProps["onChangeWeekFilter"] = (week_start, week_end) => {
    const { year } = condition;
    dispatch(onLoadLearningSummary({ summary_type: tab, year, week_start, week_end }));
    history.push(`${routeBasePath}/tab/${tab}?lessonIndex=-1&year=${year}&week_start=${week_start}&week_end=${week_end}`);
  };
  const handleChangeYearFilter: FilterLearningSummaryProps["onChangeYearFilter"] = (year) => {
    dispatch(onLoadLearningSummary({ summary_type: tab, year }));
  };
  const handleChangeFilter: FilterLearningSummaryProps["onChangeFilter"] = (value, tab) => {
    computeFilterChange(value, tab);
  };
  const changeAfterClassFilter = useMemo(
    () => async (class_id: string) => {
      if (isOrg || isSchool) {
        const { payload } = ((await dispatch(
          getAfterClassFilter({
            summary_type: tab,
            filter_type: "teacher",
            class_id,
            week_start,
            week_end,
            isOrg,
            isSchool,
            isTeacher,
            isStudent,
            metaLoading: true,
          })
        )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof getAfterClassFilter>>;
        if (payload && payload.students?.length) {
          console.log("class_id", class_id);
          const { teacher_id = "", student_id = "", subject_id = "" } = summaryReportOptions;
          history.push({ search: setQuery(history.location.search, { class_id, teacher_id, student_id, subject_id }) });
          tab === ReportType.live
            ? dispatch(
                getLiveClassesSummary({
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
              )
            : dispatch(
                getAssignmentSummary({
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
        }
      } else if (isTeacher) {
        const { payload } = ((await dispatch(
          getAfterClassFilter({
            summary_type: tab,
            filter_type: "student",
            class_id,
            week_start,
            week_end,
            isOrg,
            isSchool,
            isTeacher,
            isStudent,
            metaLoading: true,
          })
        )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof getAfterClassFilter>>;
        if (payload && payload.students?.length) {
          const { student_id = "", subject_id = "" } = summaryReportOptions;
          history.push({ search: setQuery(history.location.search, { class_id, student_id, subject_id }) });
          tab === ReportType.live
            ? dispatch(
                getLiveClassesSummary({
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
              )
            : dispatch(
                getAssignmentSummary({
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
        }
      }
    },
    [dispatch, history, isOrg, isSchool, isStudent, isTeacher, school_id, summaryReportOptions, tab, teacher_id, week_end, week_start, year]
  );
  const changeAfterTeacher = useMemo(
    () => async (teacher_id: string) => {
      const { payload } = ((await dispatch(
        getAfterClassFilter({
          summary_type: tab,
          filter_type: "student",
          teacher_id,
          week_start,
          week_end,
          isOrg,
          isSchool,
          isTeacher,
          isStudent,
          metaLoading: true,
        })
      )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof getAfterClassFilter>>;
      if (payload && payload.students?.length) {
        const { student_id = "", subject_id = "" } = summaryReportOptions;
        history.push({ search: setQuery(history.location.search, { teacher_id, student_id, subject_id }) });
        tab === ReportType.live
          ? dispatch(
              getLiveClassesSummary({
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
            )
          : dispatch(
              getAssignmentSummary({
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
      }
    },
    [class_id, dispatch, history, isOrg, isSchool, isStudent, isTeacher, school_id, summaryReportOptions, tab, week_end, week_start, year]
  );
  const changeAfterStudent = useMemo(
    () => async (student_id: string) => {
      const { payload } = ((await dispatch(
        getAfterClassFilter({
          summary_type: tab,
          filter_type: "subject",
          student_id,
          week_start,
          week_end,
          isOrg,
          isSchool,
          isTeacher,
          isStudent,
          metaLoading: true,
        })
      )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof getAfterClassFilter>>;
      if (payload && payload.subjects?.length) {
        const { subject_id = "" } = summaryReportOptions;
        console.log(class_id);
        history.push({ search: setQuery(history.location.search, { student_id, subject_id }) });
        tab === ReportType.live
          ? dispatch(
              getLiveClassesSummary({
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
            )
          : dispatch(
              getAssignmentSummary({
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
      }
    },
    [
      class_id,
      dispatch,
      history,
      isOrg,
      isSchool,
      isStudent,
      isTeacher,
      school_id,
      summaryReportOptions,
      tab,
      teacher_id,
      week_end,
      week_start,
      year,
    ]
  );
  const changeSubject = useMemo(
    () => async (subject_id: string) => {
      history.push({ search: setQuery(history.location.search, { subject_id }) });
      tab === ReportType.live
        ? dispatch(
            getLiveClassesSummary({
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
          )
        : dispatch(
            getAssignmentSummary({ year, week_start, week_end, school_id, class_id, teacher_id, student_id, subject_id, metaLoading: true })
          );
    },
    [class_id, dispatch, history, school_id, student_id, tab, teacher_id, week_end, week_start, year]
  );
  const computeFilterChange = useMemo(
    () => (value: string, filter: keyof QueryLearningSummaryCondition) => {
      if (filter === "school_id") {
        history.push({
          search: setQuery(history.location.search, { school_id: value, class_id: "", teacher_id: "", student_id: "", subject_id: "" }),
        });
      }
      if (filter === "class_id") {
        changeAfterClassFilter(value);
      }
      if (filter === "teacher_id") {
        changeAfterTeacher(value);
      }
      if (filter === "student_id") {
        changeAfterStudent(value);
      }
      if (filter === "subject_id") {
        changeSubject(value);
      }
    },
    [changeAfterClassFilter, changeAfterStudent, changeAfterTeacher, changeSubject, history]
  );
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
    console.log(1);
    const time_offset = getTimeOffSecond();
    dispatch(getTimeFilter({ time_offset, summary_type: tab, metaLoading: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, tab]);
  useEffect(() => {
    console.log("condition", condition);
    console.log(2);
    dispatch(
      onLoadLearningSummary({
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
  }, [dispatch, school_id, tab]);
  useEffect(() => {
    console.log(3);
    console.log("summaryReportOptions", summaryReportOptions);
    if (summaryReportOptions) {
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
  }, [history, summaryReportOptions]);
  return (
    <>
      <ReportTitle title={t("report_learning_summary_report")} info={t("report_msg_lsr")} />
      <FilterLearningSummary
        value={condition}
        defaultWeeksValue={defaultWeeksValue}
        onChange={handleChange}
        onChangeFilter={handleChangeFilter}
        summaryReportOptions={summaryReportOptions}
        onChangeWeekFilter={handleChangeWeekFilter}
        onChangeYearFilter={handleChangeYearFilter}
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
