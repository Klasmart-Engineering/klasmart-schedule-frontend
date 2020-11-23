import React from "react";
import { useHistory } from "react-router-dom";
import mockData from "../../mocks/categoryChart.json";
import { ReportAchievementList, useReportQuery } from "../ReportAchievementList";
import FirstSearchHeader, { Category, FirstSearchHeaderMb, FirstSearchHeaderProps } from "../ReportAchievementList/FirstSearchHeader";
import { CategoriesChart } from "./CategoriesChart";
import { SecondSearchHeader, SecondSearchHeaderProps } from "./SecondSearchHeader";

export function ReportCategories() {
  const condition = useReportQuery();
  const history = useHistory();
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => {
    if (value === Category.learningOutcomes) return;
    if (value === Category.archived) history.push(ReportAchievementList.routeBasePath);
  };
  const handleChangeFilter: SecondSearchHeaderProps["onChange"] = async (e, tab) => {
    // const value = e.target.value;
  };
  const handleChangeMbFilter: SecondSearchHeaderProps["onChangeMb"] = (e, value, tab) => {};
  return (
    <>
      <FirstSearchHeader value={Category.learningOutcomes} onChange={handleChange} />
      <FirstSearchHeaderMb value={Category.learningOutcomes} onChange={handleChange} />
      <SecondSearchHeader
        value={condition}
        onChange={handleChangeFilter}
        onChangeMb={handleChangeMbFilter}
        teacherList={[]}
      ></SecondSearchHeader>
      <CategoriesChart data={mockData} />
    </>
  );
}

ReportCategories.routeBasePath = "/report/categories";
ReportCategories.routeRedirectDefault = `/report/categories`;
