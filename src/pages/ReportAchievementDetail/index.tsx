import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import mockAchievementDetail from "../../mocks/achievementDetail.json";
import { RootState } from "../../reducers";
import { getContentDetailById } from "../../reducers/content";
import { getMockOptions } from "../../reducers/report";
import BriefIntroduction from "../ReportAchievementList/BriefIntroduction";
import FirstSearchHeader, { FirstSearchHeaderMb, FirstSearchHeaderProps } from "../ReportAchievementList/FirstSearchHeader";
import { AchievementDetailChart } from "./AchievementDetailChart";

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
    const student_id = query.get("student_id") || "";
    return clearNull({ teacher_id, class_id, lesson_plan_id, student_id });
  }, [search]);
};

const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};

export function ReportAchievementDetail() {
  const condition = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const { mockOptions } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  const { contentPreview } = useSelector<RootState, RootState["content"]>((state) => state.content);

  useEffect(() => {
    if (condition.lesson_plan_id) {
      dispatch(getContentDetailById({ metaLoading: true, content_id: condition.lesson_plan_id }));
    }
  }, [condition.lesson_plan_id, dispatch]);

  useEffect(() => {
    dispatch(getMockOptions());
  }, [dispatch]);

  return (
    <>
      <FirstSearchHeader value={condition} onChange={handleChange} />
      <FirstSearchHeaderMb value={condition} onChange={handleChange} />
      <BriefIntroduction value={condition} mockOptions={mockOptions} contentPreview={contentPreview} />
      <AchievementDetailChart data={mockAchievementDetail} />
    </>
  );
}

ReportAchievementDetail.routeBasePath = "/report/achievement-detail";
ReportAchievementDetail.routeRedirectDefault = `/report/achievement-detail`;
