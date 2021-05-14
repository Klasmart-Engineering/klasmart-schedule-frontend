import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { AssessmentOrderBy, AssessmentStatus, HomeFunAssessmentOrderBy, StudyAssessmentOrderBy } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { PermissionType, usePermission } from "../../components/Permission";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { actAssessmentList } from "../../reducers/assessments";
import { AssessmentsEdit } from "../AssessmentEdit";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { AssessmentType, SecondSearchHeader, SecondSearchHeaderMb, SecondSearchHeaderProps } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb } from "./ThirdSearchHeader";
import { AssessmentQueryCondition } from "./types";

const PAGE_SIZE = 20;

const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

const useQuery = (): AssessmentQueryCondition => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const teacher_name = query.get("teacher_name");
    const status = query.get("status");
    const page = Number(query.get("page")) || 1;
    const order_by = (query.get("order_by") as AssessmentOrderBy | null) || undefined;
    return clearNull({ teacher_name, status, page, order_by });
  }, [search]);
};

const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};

interface RefreshWithDispatch {
  <T>(result: Promise<PayloadAction<T>>): Promise<PayloadAction<T>>;
}

export function AssessmentList() {
  const condition = useQuery();
  const history = useHistory();
  const perm = usePermission([
    PermissionType.view_completed_assessments_414,
    PermissionType.view_in_progress_assessments_415,
    PermissionType.view_org_completed_assessments_424,
    PermissionType.view_org_in_progress_assessments_425,
    PermissionType.view_school_completed_assessments_426,
    PermissionType.view_school_in_progress_assessments_427,
  ]);
  const { assessmentList, total } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const dispatch = useDispatch<AppDispatch>();
  const handleChangePage: AssessmentTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickAssessment: AssessmentTableProps["onClickAssessment"] = (id) =>
    history.push({ pathname: AssessmentsEdit.routeBasePath, search: toQueryString({ id }) });
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  const handleChangeAssessmentType = (assessmentType: AssessmentType) => {
    // history.push(`/assessments/home-fun?status=${AssessmentStatus.all}&order_by=${HomeFunAssessmentOrderBy._latest_feedback_at}&page=1`);
    if (assessmentType === AssessmentType.classLive) {
      history.push(`/assessments/assessment-list?status=${AssessmentStatus.all}&order_by=${AssessmentOrderBy._class_end_time}&page=1`);
    }
    if (assessmentType === AssessmentType.homeFun) {
      history.push(`/assessments/home-fun?status=${AssessmentStatus.all}&order_by=${HomeFunAssessmentOrderBy._latest_feedback_at}&page=1`);
    }
    if (assessmentType === AssessmentType.study) {
      history.push(`/assessment/study?status=${AssessmentStatus.all}&order_by=${StudyAssessmentOrderBy._create_at}&page=1`);
    }
  };
  useEffect(() => {
    dispatch(actAssessmentList({ ...condition, page_size: PAGE_SIZE, metaLoading: true }));
  }, [condition, dispatch]);

  return (
    <div>
      <FirstSearchHeader />
      <FirstSearchHeaderMb />
      {(perm.view_completed_assessments_414 ||
        perm.view_in_progress_assessments_415 ||
        perm.view_org_completed_assessments_424 ||
        perm.view_org_in_progress_assessments_425 ||
        perm.view_school_completed_assessments_426 ||
        perm.view_school_in_progress_assessments_427) && (
        <>
          <SecondSearchHeader value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
          <SecondSearchHeaderMb value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
          <ThirdSearchHeader value={condition} onChange={handleChange} />
          <ThirdSearchHeaderMb value={condition} onChange={handleChange} />
        </>
      )}
      {perm.view_completed_assessments_414 ||
      perm.view_in_progress_assessments_415 ||
      perm.view_org_completed_assessments_424 ||
      perm.view_org_in_progress_assessments_425 ||
      perm.view_school_completed_assessments_426 ||
      perm.view_school_in_progress_assessments_427 ? (
        assessmentList && assessmentList.length > 0 ? (
          <AssessmentTable
            list={assessmentList}
            total={total}
            queryCondition={condition}
            onChangePage={handleChangePage}
            onClickAssessment={handleClickAssessment}
          />
        ) : (
          emptyTip
        )
      ) : (
        permissionTip
      )}
    </div>
  );
}

AssessmentList.routeBasePath = "/assessments/assessment-list";
AssessmentList.routeRedirectDefault = `/assessments/assessment-list?status=${AssessmentStatus.all}&order_by=${AssessmentOrderBy._class_end_time}&page=1`;
