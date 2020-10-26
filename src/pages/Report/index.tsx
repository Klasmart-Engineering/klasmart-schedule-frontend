import React, { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { setQuery } from "../../models/ModelContentDetailForm";
import BriefIntroduction from "./BriefIntroduction";
import { FilterAchievementReport, FilterAchievementReportProps } from "./FilterAchievementReport";
import FirstSearchHeader, { Category, FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
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
    const teacher = query.get("teacher");
    const class_search = query.get("class");
    const lesson_plan = query.get("lesson_plan");
    const filter = query.get("filter");
    const order_by = query.get("order_by");
    return clearNull({ category, teacher, class_search, lesson_plan, filter, order_by });
  }, [search]);
};

const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};

export default function Report() {
  const condition = useQuery();
  const history = useHistory();

  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  const handleChangefilter: FilterAchievementReportProps["onChange"] = (e, tab) => {
    const value = e.target.value;
    history.push({ search: setQuery(history.location.search, { [tab]: value }) });
  };
  return (
    <>
      <FirstSearchHeader value={condition} onChange={handleChange} />
      <FirstSearchHeaderMb value={condition} onChange={handleChange} />
      <FilterAchievementReport value={condition} onChange={handleChangefilter}></FilterAchievementReport>      
      <BriefIntroduction />
    </>
  );
}

Report.routeBasePath = "/report/index";
Report.routeRedirectDefault = `/report/index?category=${Category.archived}`;
