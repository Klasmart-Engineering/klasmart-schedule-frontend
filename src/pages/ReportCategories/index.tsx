import React from "react";
import { useHistory } from "react-router-dom";
import { ReportAchievementList } from "../ReportAchievementList";
import FirstSearchHeader, { Category, FirstSearchHeaderMb, FirstSearchHeaderProps } from "../ReportAchievementList/FirstSearchHeader";

export function ReportCategories() {
  const history = useHistory();
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => {
    if (value === Category.learningOutcomes) return;
    if (value === Category.archived) history.push(ReportAchievementList.routeBasePath);
  };
  return (
    <>
      <FirstSearchHeader value={Category.learningOutcomes} onChange={handleChange} />
      <FirstSearchHeaderMb value={Category.learningOutcomes} onChange={handleChange} />
    </>
  );
}

ReportCategories.routeBasePath = "/report/categories";
ReportCategories.routeRedirectDefault = `/report/categories`;
