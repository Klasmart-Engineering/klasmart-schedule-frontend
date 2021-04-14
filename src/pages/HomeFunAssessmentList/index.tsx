import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { AssessmentOrderBy, AssessmentStatus, HomeFunAssessmentOrderBy, HomeFunAssessmentStatus } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { PermissionType, usePermission } from "../../components/Permission";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { actHomeFunAssessmentList } from "../../reducers/assessments";
import { AssessmentsHomefunEdit } from "../HomefunEdit";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { SecondSearchHeader, SecondSearchHeaderMb, SecondSearchHeaderProps } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb } from "./ThirdSearchHeader";
import { HomeFunAssessmentQueryCondition } from "./types";

const PAGE_SIZE = 20;

const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

const useQuery = (): HomeFunAssessmentQueryCondition => {
  const { search } = useLocation();
  return useMemo(() => {
    const querys = new URLSearchParams(search);
    const query = querys.get("query");
    const status = (querys.get("status") as HomeFunAssessmentStatus | null) || undefined;
    const page = Number(querys.get("page")) || 1;
    const order_by = (querys.get("order_by") as HomeFunAssessmentOrderBy | null) || undefined;
    return clearNull({ query, status, page, order_by });
  }, [search]);
};

const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};

export function HomeFunAssessmentList() {
  const condition = useQuery();
  const history = useHistory();
  const { homeFunAssessmentList, total } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const perm = usePermission([
    PermissionType.view_completed_assessments_414,
    PermissionType.view_in_progress_assessments_415,
    PermissionType.view_org_completed_assessments_424,
    PermissionType.view_org_in_progress_assessments_425,
    PermissionType.view_school_completed_assessments_426,
    PermissionType.view_school_in_progress_assessments_427,
  ]);
  const dispatch = useDispatch<AppDispatch>();
  const handleChangePage: AssessmentTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleChangeAssessmentType = () => {
    history.push(`/assessments/assessment-list?status=${AssessmentStatus.all}&order_by=${AssessmentOrderBy._class_end_time}&page=1`);
  };
  const handleClickAssessment: AssessmentTableProps["onClickAssessment"] = (id) => {
    history.push({ pathname: AssessmentsHomefunEdit.routeBasePath, search: toQueryString({ id }) });
  };
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  useEffect(() => {
    dispatch(actHomeFunAssessmentList({ ...condition, page_size: PAGE_SIZE, metaLoading: true }));
  }, [condition, dispatch]);

  return (
    <>
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
        homeFunAssessmentList && homeFunAssessmentList.length > 0 ? (
          <AssessmentTable
            list={homeFunAssessmentList}
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
    </>
  );
}

HomeFunAssessmentList.routeBasePath = "/assessments/home-fun";
HomeFunAssessmentList.routeRedirectDefault = `/assessments/home-fun?status=${HomeFunAssessmentStatus.all}&order_by=${HomeFunAssessmentOrderBy._latest_feedback_at}&page=1`;
