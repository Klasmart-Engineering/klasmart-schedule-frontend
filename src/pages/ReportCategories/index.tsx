import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { PermissionType, usePermission } from "../../components/Permission";
import { TipImages, TipImagesType } from "../../components/TipImages";
import { toQueryString } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { reportCategoriesOnload } from "../../reducers/report";
import { ReportAchievementList, useReportQuery } from "../ReportAchievementList";
import FirstSearchHeader, { Category, FirstSearchHeaderMb, FirstSearchHeaderProps } from "../ReportAchievementList/FirstSearchHeader";
import { CategoriesChart } from "./CategoriesChart";
import { SecondSearchHeader, SecondSearchHeaderProps } from "./SecondSearchHeader";

export function ReportCategories() {
  const condition = useReportQuery();
  const { teacher_id } = condition;
  const history = useHistory();
  const dispatch = useDispatch();
  const { teacherList, categories } = useSelector<RootState, RootState["report"]["categoriesPage"]>((state) => state.report.categoriesPage);
  const perm = usePermission([PermissionType.view_reports_610, PermissionType.view_my_reports_614]);
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => {
    if (value === Category.learningOutcomes) return;
    if (value === Category.archived) history.push(ReportAchievementList.routeBasePath);
  };
  const handleChangeFilter: SecondSearchHeaderProps["onChange"] = (value, tab) => {
    history.replace({ search: toQueryString({ [tab]: value }) });
  };
  useEffect(() => {
    dispatch(reportCategoriesOnload({ teacher_id, metaLoading: true }));
  }, [teacher_id, dispatch]);
  return (
    <>
      <FirstSearchHeader value={Category.learningOutcomes} onChange={handleChange} />
      <FirstSearchHeaderMb value={Category.learningOutcomes} onChange={handleChange} />
      <SecondSearchHeader value={condition} onChange={handleChangeFilter} teacherList={teacherList}></SecondSearchHeader>
      {perm.view_reports_610 || perm.view_my_reports_614 ? (
        <CategoriesChart data={categories} />
      ) : (
        <TipImages type={TipImagesType.noPermission} text="library_error_no_permissions" />
      )}
    </>
  );
}

ReportCategories.routeBasePath = "/report/categories";
ReportCategories.routeRedirectDefault = `/report/categories`;
