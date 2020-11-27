import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { PermissionType, usePermission } from "../../components/Permission";
import { TipImages, TipImagesType } from "../../components/TipImages";
import { setQuery, toQueryString } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned, getAchievementList, getClassList, getLessonPlan, reportOnload } from "../../reducers/report";
import { ReportAchievementDetail } from "../ReportAchievementDetail";
import { ReportCategories } from "../ReportCategories";
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
    return clearNull({ teacher_id, class_id, lesson_plan_id, status, sort_by });
  }, [search]);
};

export function ReportAchievementList() {
  const condition = useReportQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const { reportList = [], student_name, reportMockOptions } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const viewMyReport = usePermission(PermissionType.view_my_reports_614);
  const viewReport = usePermission(PermissionType.view_reports_610);
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => {
    if (value === Category.archived) return;
    if (value === Category.learningOutcomes) history.push(ReportCategories.routeBasePath);
  };
  const handleChangeFilter: FilterAchievementReportProps["onChange"] = async (value, tab) => {
    computeFilter(tab, value);
  };
  const handleChangeStudent: AchievementListChartProps["onClickStudent"] = (studentId) => {
    const { status, sort_by, ...ortherCondition } = condition;
    history.push({ pathname: ReportAchievementDetail.routeBasePath, search: toQueryString({ student_id: studentId, ...ortherCondition }) });
  };

  const getFirstLessonPlanId = useMemo(
    () => async (teacher_id: string, class_id: string) => {
      const { payload: data } = ((await dispatch(getLessonPlan({ teacher_id, class_id }))) as unknown) as PayloadAction<
        AsyncTrunkReturned<typeof getLessonPlan>
      >;
      if (data) {
        const lesson_plan_id = (data[0] && data[0].id) || "";
        history.push({ search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id }) });
        dispatch(getAchievementList({ metaLoading: true, teacher_id, class_id, lesson_plan_id }));
      }
    },
    [dispatch, history]
  );

  const computeFilter = useMemo(
    () => async (tab: keyof QueryCondition, value: string) => {
      history.push({ search: setQuery(history.location.search, { [tab]: value }) });
      if (tab === "teacher_id") {
        const { payload } = ((await dispatch(getClassList({ user_id: value }))) as unknown) as PayloadAction<
          AsyncTrunkReturned<typeof getClassList>
        >;
        if (payload) {
          const classlist = payload.user?.classesTeaching;
          const class_id = (classlist && classlist[0] && classlist[0].class_id) || "";
          if (class_id) {
            getFirstLessonPlanId(value, class_id);
          } else {
            history.push({
              search: setQuery(history.location.search, { teacher_id: value, class_id, lesson_plan_id: "" }),
            });
          }
        }
      }
      if (tab === "class_id") {
        getFirstLessonPlanId(condition.teacher_id, value);
      }
      if (tab === "lesson_plan_id") {
        dispatch(
          getAchievementList({ metaLoading: true, teacher_id: condition.teacher_id, class_id: condition.class_id, lesson_plan_id: value })
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, getFirstLessonPlanId, history]
  );
  useEffect(() => {
    dispatch(
      reportOnload({
        teacher_id: condition.teacher_id,
        class_id: condition.class_id,
        lesson_plan_id: condition.lesson_plan_id,
        status: condition.status,
        sort_by: condition.sort_by,
        view_my_report: !viewReport && viewMyReport,
        metaLoading: true,
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition.sort_by, condition.status, dispatch, viewMyReport, viewReport]);

  useEffect(() => {
    if (reportMockOptions) {
      const { teacher_id, class_id, lesson_plan_id } = reportMockOptions;
      teacher_id &&
        class_id &&
        lesson_plan_id &&
        history.push({
          search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id }),
        });
    }
  }, [history, reportMockOptions]);

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
      {true &&
        (reportList && reportList.length > 0 ? (
          <AchievementListChart data={reportList} filter={condition.status} onClickStudent={handleChangeStudent} />
        ) : (
          <TipImages type={TipImagesType.empty} text="library_label_empty" />
        ))}
      {/* {<AchievementListChart data={mockAchievementList} filter={condition.status} onClickStudent={handleChangeStudent} />} */}
    </>
  );
}

ReportAchievementList.routeBasePath = "/report/achievement-list";
ReportAchievementList.routeRedirectDefault = `/report/achievement-list`;
