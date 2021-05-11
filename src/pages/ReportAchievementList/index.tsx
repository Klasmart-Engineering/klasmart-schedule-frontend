import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { PermissionType, usePermission } from "../../components/Permission";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { setQuery, toQueryString } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned, getAchievementList, getLessonPlan, reportOnload } from "../../reducers/report";
import { ReportAchievementDetail } from "../ReportAchievementDetail";
import { ReportCategories } from "../ReportCategories";
import { ReportStudentPerformance } from "../ReportStudentPerformance";
import { AchievementListChart, AchievementListChartProps } from "./AchievementListChart";
import BriefIntroduction from "./BriefIntroduction";
import { FilterAchievementReport, FilterAchievementReportProps } from "./FilterAchievementReport";
import FirstSearchHeader, { Category, FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
import { QueryCondition } from "./types";

const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

export const useReportQuery = () => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const teacher_id = query.get("teacher_id") || "";
    const class_id = query.get("class_id") || "";
    const lesson_plan_id = query.get("lesson_plan_id") || "";
    const status = query.get("status") || "all";
    const sort_by = query.get("sort_by") || "desc";
    const student_id = query.get("student_id") || "";
    return clearNull({ teacher_id, class_id, lesson_plan_id, status, sort_by, student_id });
  }, [search]);
};

export function ReportAchievementList() {
  const condition = useReportQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const totalData = useSelector<RootState, RootState["report"]>((state) => state.report);
  const reportList = totalData.reportList ?? [];
  const perm = usePermission([
    PermissionType.view_reports_610,
    PermissionType.view_my_reports_614,
    PermissionType.view_my_organizations_reports_612,
    PermissionType.view_my_school_reports_611,
  ]);
  const student_name = totalData.student_name;
  const reportMockOptions = totalData.reportMockOptions;
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => {
    if (value === Category.archived) return;
    if (value === Category.learningOutcomes) history.push(ReportCategories.routeBasePath);
    if (value === Category.studentPerformance) history.push(ReportStudentPerformance.routeBasePath);
  };
  const handleChangeFilter: FilterAchievementReportProps["onChange"] = async (value, tab) => {
    computeFilter(tab, value);
  };
  const handleChangeStudent: AchievementListChartProps["onClickStudent"] = (studentId) => {
    const { status, sort_by, ...ortherCondition } = condition;
    history.push({ pathname: ReportAchievementDetail.routeBasePath, search: toQueryString({ ...ortherCondition, student_id: studentId }) });
  };

  const getFirstLessonPlanId = useMemo(
    () => async (teacher_id: string, class_id: string) => {
      const { payload: data } = ((await dispatch(getLessonPlan({ metaLoading: true, teacher_id, class_id }))) as unknown) as PayloadAction<
        AsyncTrunkReturned<typeof getLessonPlan>
      >;
      if (data) {
        const lesson_plan_id = (data[0] && data[0].id) || "";
        history.push({ search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id }) });
        lesson_plan_id && dispatch(getAchievementList({ metaLoading: true, teacher_id, class_id, lesson_plan_id }));
      } else {
        history.push({ search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id: "" }) });
      }
    },
    [dispatch, history]
  );

  const computeFilter = useMemo(
    () => async (tab: keyof QueryCondition, value: string) => {
      history.push({ search: setQuery(history.location.search, { [tab]: value }) });
      if (tab === "teacher_id") {
        history.push({
          search: setQuery(history.location.search, { teacher_id: value, class_id: "", lesson_plan_id: "" }),
        });
      }
      if (tab === "class_id") {
        getFirstLessonPlanId(condition.teacher_id, value);
      }
      if (tab === "lesson_plan_id") {
        if (condition.teacher_id && condition.class_id) {
          dispatch(
            getAchievementList({
              metaLoading: true,
              teacher_id: condition.teacher_id,
              class_id: condition.class_id,
              lesson_plan_id: value,
            })
          );
        }
      }
    },
    [dispatch, getFirstLessonPlanId, history, condition.teacher_id, condition.class_id]
  );
  useEffect(() => {
    dispatch(
      reportOnload({
        teacher_id: condition.teacher_id,
        class_id: condition.class_id,
        lesson_plan_id: condition.lesson_plan_id,
        status: condition.status,
        sort_by: condition.sort_by,
        metaLoading: true,
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition.teacher_id, condition.sort_by, condition.status, dispatch]);

  useEffect(() => {
    if (reportMockOptions) {
      const { teacher_id, class_id, lesson_plan_id } = reportMockOptions;
      teacher_id &&
        history.push({
          search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id }),
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, reportMockOptions.teacher_id]);

  return (
    <>
      <FirstSearchHeader value={Category.archived} onChange={handleChange} />
      <FirstSearchHeaderMb value={Category.archived} onChange={handleChange} />
      <FilterAchievementReport
        value={condition}
        onChange={handleChangeFilter}
        reportMockOptions={reportMockOptions}
      ></FilterAchievementReport>
      <BriefIntroduction value={condition} reportMockOptions={reportMockOptions} student_name={student_name} />
      {perm.view_reports_610 || perm.view_my_reports_614 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612 ? (
        reportList && reportList.length > 0 && condition.lesson_plan_id ? (
          <AchievementListChart data={reportList} filter={condition.status} onClickStudent={handleChangeStudent} />
        ) : (
          emptyTip
        )
      ) : (
        permissionTip
      )}
    </>
  );
}

ReportAchievementList.routeBasePath = "/report/achievement-list";
ReportAchievementList.routeRedirectDefault = `/report/achievement-list`;
