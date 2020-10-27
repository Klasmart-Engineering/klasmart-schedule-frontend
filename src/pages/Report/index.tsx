import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { setQuery } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { onloadReport } from "../../reducers/report";
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
    const teacher = query.get("teacher") || "";
    const class_search = query.get("class_search") || "";
    const lesson_plain_id = query.get("lesson_plain_id") || "";
    const filter = query.get("filter") || "all";
    const order_by = query.get("order_by") || "";
    return clearNull({ category, teacher, class_search, lesson_plain_id, filter, order_by });
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
  const { mockOptions } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  const handleChangeFilter: FilterAchievementReportProps["onChange"] = (e, tab) => {
    const value = e.target.value;
    history.push({ search: setQuery(history.location.search, { [tab]: value }) });
  };
  const handleChangeMbFilter: FilterAchievementReportProps["onChangeMb"] = (e, value, tab) => {
    history.push({ search: setQuery(history.location.search, { [tab]: value }) });
  };

  useEffect(() => {
    dispatch(onloadReport({ lesson_plain_id: condition.lesson_plan_id }));
  }, [condition.lesson_plan_id, dispatch]);
  return (
    <>
      <FirstSearchHeader value={condition} onChange={handleChange} />
      <FirstSearchHeaderMb value={condition} onChange={handleChange} />
      <FilterAchievementReport
        value={condition}
        onChange={handleChangeFilter}
        mockOptions={mockOptions}
        onChangeMb={handleChangeMbFilter}
      ></FilterAchievementReport>
      <BriefIntroduction />
    </>
  );
}

Report.routeBasePath = "/report/index";
Report.routeRedirectDefault = `/report/index?category=${Category.archived}`;
