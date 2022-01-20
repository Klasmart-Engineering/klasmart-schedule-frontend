import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { usePermission } from "../../hooks/usePermission";
import { t } from "../../locale/LocaleManager";
import { toQueryString } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { categoryReportOnLoad, getSkillCoverageReport } from "../../reducers/report";
import { useReportQuery } from "../ReportAchievementList";
import { ReportTitle } from "../ReportDashboard";
import { CategoriesChart } from "./CategoriesChart";
import { SecondSearchHeader, SecondSearchHeaderProps } from "./SecondSearchHeader";

export function ReportCategories() {
  const condition = useReportQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const { teacherList, categories } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const perm = usePermission([
    PermissionType.report_organizations_skills_taught_640,
    PermissionType.report_schools_skills_taught_641,
    PermissionType.report_my_skills_taught_642,
  ]);
  const handleChangeFilter: SecondSearchHeaderProps["onChange"] = (value, tab) => {
    if (!value) return;
    dispatch(getSkillCoverageReport({ teacher_id: value, metaLoading: true }));
    history.replace({ search: toQueryString({ [tab]: value }) });
  };
  const chart = <CategoriesChart data={categories} />;
  useEffect(() => {
    dispatch(categoryReportOnLoad({ teacher_id: condition.teacher_id, metaLoading: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  return (
    <>
      <ReportTitle title={t("report_label_lo_in_categories")}></ReportTitle>
      <SecondSearchHeader value={condition} onChange={handleChangeFilter} teacherList={teacherList} perm={perm}></SecondSearchHeader>
      {perm.report_organizations_skills_taught_640 || perm.report_schools_skills_taught_641 || perm.report_my_skills_taught_642
        ? categories.length > 0
          ? chart
          : emptyTip
        : permissionTip}
    </>
  );
}

ReportCategories.routeBasePath = "/report/categories";
ReportCategories.routeRedirectDefault = `/report/categories`;
