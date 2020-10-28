import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { apiFetchClassByTeacher, MockOptionsItem } from "../../api/extra";
import mockAchievementList from "../../mocks/achievementList.json";
import { setQuery } from "../../models/ModelContentDetailForm";
import { ModelMockOptions } from "../../models/ModelMockOptions";
import { RootState } from "../../reducers";
import { getLessonPlan, getMockOptions } from "../../reducers/report";
import { AchivementListChart } from "./AchivementListChart";
import BriefIntroduction from "./BriefIntroduction";
import { FilterAchievementReport, FilterAchievementReportProps } from "./FilterAchievementReport";
import FirstSearchHeader, { Category, FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
import { ReportFilter } from "./types";

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
    const category = query.get("category");
    const teacher_id = query.get("teacher_id") || "";
    const class_id = query.get("class_id") || "";
    const lesson_plan_id = query.get("lesson_plan_id") || "";
    const filter = query.get("filter") || "all";
    const order_by = query.get("order_by") || "";
    return clearNull({ category, teacher_id, class_id, lesson_plan_id, filter, order_by });
  }, [search]);
};

const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};

export default function Report() {
  const condition = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const { mockOptions, lessonPlanList } = useSelector<RootState, RootState["report"]>((state) => state.report);

  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });

  const handleChangeFilter: FilterAchievementReportProps["onChange"] = (e, tab) => {
    const value = e.target.value;
    history.push({ search: setQuery(history.location.search, { [tab]: value }) });
    if (tab === "teacher") {
      const classlist = apiFetchClassByTeacher(mockOptions, value);
      const class_id = (classlist && classlist[0] && classlist[0].id) || "";
      history.push({ search: setQuery(history.location.search, { class_id }) });
    }
  };
  const handleChangeMbFilter: FilterAchievementReportProps["onChangeMb"] = (e, value, tab) => {
    history.push({ search: setQuery(history.location.search, { [tab]: value }) });
  };
  useEffect(() => {
    dispatch(getMockOptions());
  }, [dispatch]);

  useEffect(() => {
    const { class_id, teacher_id } = ModelMockOptions.getReportFirstValue(mockOptions);
    if (class_id && teacher_id) {
      dispatch(getLessonPlan({ teacher_id, class_id }));
      const lesson_plan_id = (lessonPlanList[0] && lessonPlanList[0].id) || "";
      history.push({ search: setQuery(history.location.search, { teacher_id, class_id, lesson_plan_id }) });
    }
  }, [dispatch, history, lessonPlanList, mockOptions]);
  // useEffect(() => {
  //   dispatch(onloadReport({ teacher_id: condition.teacher_id, class_id: condition.class_id, lesson_plan_id: condition.lesson_plan_id }));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [condition.lesson_plan_id, dispatch]);
  return (
    <>
      <FirstSearchHeader value={condition} onChange={handleChange} />
      <FirstSearchHeaderMb value={condition} onChange={handleChange} />
      <FilterAchievementReport
        value={condition}
        onChange={handleChangeFilter}
        mockOptions={mockOptions}
        onChangeMb={handleChangeMbFilter}
        lessonPlanList={lessonPlanList as MockOptionsItem[]}
      ></FilterAchievementReport>
      <BriefIntroduction value={condition} mockOptions={mockOptions} />
      <AchivementListChart data={mockAchievementList} filter={ReportFilter.all} />
    </>
  );
}

Report.routeBasePath = "/report/index";
Report.routeRedirectDefault = `/report/index?category=${Category.archived}`;
