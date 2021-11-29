import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { usePermission } from "../../hooks/usePermission";
import { t } from "../../locale/LocaleManager";
import { toQueryString } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { getSkillCoverageReport, getTeachersAndClasses } from "../../reducers/report";
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
    PermissionType.view_reports_610,
    PermissionType.view_my_reports_614,
    PermissionType.view_my_school_reports_611,
    PermissionType.view_my_organizations_reports_612,
  ]);
  const handleChangeFilter: SecondSearchHeaderProps["onChange"] = (value, tab) => {
    if (!value) return;
    dispatch(getSkillCoverageReport({ teacher_id: value, metaLoading: true }));
    history.replace({ search: toQueryString({ [tab]: value }) });
  };
  const chart = <CategoriesChart data={categories} />;
  useEffect(() => {
    dispatch(getTeachersAndClasses({}));
  }, [dispatch]);
  useEffect(() => {
    if (!teacherList.length) return;
    dispatch(getSkillCoverageReport({ teacher_id: teacherList[0].id, metaLoading: true }));
    history.replace({ search: toQueryString({ teacher_id: teacherList[0].id }) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, teacherList.length]);
  return (
    <>
      <ReportTitle title={t("report_label_lo_in_categories")}></ReportTitle>
      <SecondSearchHeader value={condition} onChange={handleChangeFilter} teacherList={teacherList} perm={perm}></SecondSearchHeader>
      {perm.view_reports_610 || perm.view_my_reports_614 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612
        ? categories.length > 0
          ? chart
          : emptyTip
        : permissionTip}
    </>
  );
}

ReportCategories.routeBasePath = "/report/categories";
ReportCategories.routeRedirectDefault = `/report/categories`;
