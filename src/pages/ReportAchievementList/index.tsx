import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { apiFetchClassByTeacher, MockOptionsItem } from "../../api/extra";
import mockAchievementList from "../../mocks/achievementList.json";
import { setQuery, toQueryString } from "../../models/ModelContentDetailForm";
import { ModelMockOptions } from "../../models/ModelMockOptions";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned, getAchievementList, getLessonPlan, getMockOptions } from "../../reducers/report";
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

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const teacher_id = query.get("teacher_id") || "";
    const class_id = query.get("class_id") || "";
    const lesson_plan_id = query.get("lesson_plan_id") || "";
    const status = query.get("status") || "all";
    const order_by = query.get("order_by") || "descending";
    return clearNull({ teacher_id, class_id, lesson_plan_id, status, order_by });
  }, [search]);
};

export function ReportAchievementList() {
  const condition = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const { mockOptions, lessonPlanList, reportList = [], student_name } = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  );
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => {
    if (value === Category.archived) return;
    if (value === Category.learningOutcomes) history.push(ReportCategories.routeBasePath);
  };
  const handleChangeFilter: FilterAchievementReportProps["onChange"] = async (e, tab) => {
    const value = e.target.value;
    computeFilter(tab, value);
  };
  const handleChangeMbFilter: FilterAchievementReportProps["onChangeMb"] = (e, value, tab) => {
    computeFilter(tab, value);
  };
  const handleChangeStudent: AchievementListChartProps["onClickStudent"] = (studentId) => {
    const { status, order_by, ...ortherCondition } = condition;
    history.push({ pathname: ReportAchievementDetail.routeBasePath, search: toQueryString({ student_id: studentId, ...ortherCondition }) });
  };
  const getFirstLessonPlanId = useMemo(
    () => async (teacher_id: string, class_id: string) => {
      const { payload } = ((await dispatch(getLessonPlan({ teacher_id, class_id }))) as unknown) as PayloadAction<
        AsyncTrunkReturned<typeof getLessonPlan>
      >;
      if (payload && payload.length > 0) {
        const lesson_plan_id = (payload[0] && payload[0].id) || "";
        history.push({ search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id }) });
      }
    },
    [dispatch, history]
  );

  const computeFilter = useMemo(
    () => (tab: keyof QueryCondition, value: string) => {
      history.push({ search: setQuery(history.location.search, { [tab]: value }) });
      if (tab === "teacher_id") {
        const classlist = apiFetchClassByTeacher(mockOptions, value);
        const class_id = (classlist && classlist[0] && classlist[0].id) || "";
        class_id
          ? getFirstLessonPlanId(value, class_id)
          : history.push({
            search: setQuery(history.location.search, { teacher_id: value, class_id, lesson_plan_id: "" }),
          });
      }
      if (tab === "class_id") {
        getFirstLessonPlanId(condition.teacher_id, value);
      }
    },
    [condition.teacher_id, getFirstLessonPlanId, history, mockOptions]
  );

  useEffect(() => {
    dispatch(getMockOptions());
  }, [dispatch]);
  useEffect(() => {
    const { class_id, teacher_id } = ModelMockOptions.getReportFirstValue(mockOptions);
    if (class_id && teacher_id) {
      condition.teacher_id && condition.class_id
        ? dispatch(getLessonPlan({ teacher_id: condition.teacher_id, class_id: condition.class_id }))
        : getFirstLessonPlanId(teacher_id, class_id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, getFirstLessonPlanId, history, mockOptions]);

  useEffect(() => {
    if (condition.lesson_plan_id) {
      dispatch(
        getAchievementList({
          teacher_id: condition.teacher_id,
          class_id: condition.class_id,
          lesson_plan_id: condition.lesson_plan_id,
          status: condition.status,
          sortBy: condition.order_by,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition.lesson_plan_id, condition.order_by, condition.status, dispatch]);

  return (
    <>
      <FirstSearchHeader value={Category.archived} onChange={handleChange} />
      <FirstSearchHeaderMb value={Category.archived} onChange={handleChange} />
      <FilterAchievementReport
        value={condition}
        onChange={handleChangeFilter}
        mockOptions={mockOptions}
        onChangeMb={handleChangeMbFilter}
        lessonPlanList={lessonPlanList as MockOptionsItem[]}
      ></FilterAchievementReport>
      <BriefIntroduction value={condition} mockOptions={mockOptions} student_name={student_name} lessonPlanList={lessonPlanList} />
      {/* {reportList && <AchievementListChart data={reportList} filter={condition.status} onClickStudent={handleChangeStudent} />} */}
      {reportList && <AchievementListChart data={mockAchievementList} filter={condition.status} onClickStudent={handleChangeStudent} />}
    </>
  );
}

ReportAchievementList.routeBasePath = "/report/achievement-list";
ReportAchievementList.routeRedirectDefault = `/report/achievement-list`;
