import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { PermissionType, usePermission } from "../../components/Permission";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { t } from "../../locale/LocaleManager";
import { toQueryString } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { reportCategoriesOnload } from "../../reducers/report";
import { useReportQuery } from "../ReportAchievementList";
import { ReportTitle } from "../ReportDashboard";
import { CategoriesChart } from "./CategoriesChart";
import { SecondSearchHeader, SecondSearchHeaderProps } from "./SecondSearchHeader";

export function ReportCategories() {
  const condition = useReportQuery();
  const { teacher_id } = condition;
  const history = useHistory();
  const dispatch = useDispatch();
  const { teacherList, categories } = useSelector<RootState, RootState["report"]["categoriesPage"]>((state) => state.report.categoriesPage);
  const perm = usePermission([
    PermissionType.view_reports_610,
    PermissionType.view_my_reports_614,
    PermissionType.view_my_school_reports_611,
    PermissionType.view_my_organizations_reports_612,
  ]);
  const handleChangeFilter: SecondSearchHeaderProps["onChange"] = (value, tab) => {
    history.replace({ search: toQueryString({ [tab]: value }) });
  };
  const chart = <CategoriesChart data={categories} />;
  useEffect(() => {
    dispatch(reportCategoriesOnload({ teacher_id, metaLoading: true }));
  }, [teacher_id, dispatch]);
  return (
    <>
      <ReportTitle title={t("report_label_lo_in_categories")}></ReportTitle>
      <SecondSearchHeader value={condition} onChange={handleChangeFilter} teacherList={teacherList}></SecondSearchHeader>
      {perm.view_reports_610 || perm.view_my_reports_614 || perm.view_my_school_reports_611 || perm.view_my_organization_reports_612
        ? categories.length > 0
          ? chart
          : emptyTip
        : permissionTip}
    </>
  );
}

ReportCategories.routeBasePath = "/report/categories";
ReportCategories.routeRedirectDefault = `/report/categories`;
