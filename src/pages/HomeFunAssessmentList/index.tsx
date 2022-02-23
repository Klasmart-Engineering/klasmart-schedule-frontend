import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import { AssessmentStatus, HomeFunAssessmentOrderBy, HomeFunAssessmentStatus } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { AssessmentTypeValues } from "../../components/AssessmentType";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { usePermission } from "../../hooks/usePermission";
import { AppDispatch, RootState } from "../../reducers";
import { actHomeFunAssessmentList } from "../../reducers/assessments";
import { AssessmentsHomefunEdit } from "../HomefunEdit";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { SecondSearchHeader, SecondSearchHeaderProps } from "./SecondSearchHeader";
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
    const query_key = querys.get("query_key");
    const query_type = querys.get("query_type");
    const status = querys.get("status") || HomeFunAssessmentStatus.all;
    const page = Number(querys.get("page")) || 1;
    const order_by = (querys.get("order_by") as HomeFunAssessmentOrderBy | null) || HomeFunAssessmentOrderBy._submit_at;
    return clearNull({ query_key, query_type, status, page, order_by });
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
  const hasPerm =
    perm.view_completed_assessments_414 ||
    perm.view_in_progress_assessments_415 ||
    perm.view_org_completed_assessments_424 ||
    perm.view_org_in_progress_assessments_425 ||
    perm.view_school_completed_assessments_426 ||
    perm.view_school_in_progress_assessments_427;
  const isPending = useMemo(() => perm.view_completed_assessments_414 === undefined, [perm.view_completed_assessments_414]);
  const dispatch = useDispatch<AppDispatch>();
  const handleChangePage: AssessmentTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleChangeAssessmentType = (assessmentType: AssessmentTypeValues) => {
    if (assessmentType === AssessmentTypeValues.homeFun) {
      history.push(`/assessments/home-fun?status=${HomeFunAssessmentStatus.all}&order_by=${HomeFunAssessmentOrderBy._submit_at}&page=1`);
    } else {
      history.push(`/assessments/assessment-list?assessment_type=${assessmentType}&status=${AssessmentStatus.all}&page=1`);
    }
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
      {!isPending && hasPerm && (
        <>
          <SecondSearchHeader value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
          {/* <SecondSearchHeaderMb value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} /> */}
          <ThirdSearchHeader value={condition} onChange={handleChange} />
          <ThirdSearchHeaderMb value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
        </>
      )}
      {isPending ? (
        ""
      ) : hasPerm ? (
        total === undefined ? (
          ""
        ) : homeFunAssessmentList && homeFunAssessmentList.length > 0 ? (
          <AssessmentTable
            list={homeFunAssessmentList}
            total={total as number}
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

// HomeFunAssessmentList.routeBasePath = "/assessments/home-fun";
// HomeFunAssessmentList.routeRedirectDefault = `/assessments/home-fun?status=${HomeFunAssessmentStatus.all}&order_by=${HomeFunAssessmentOrderBy._submit_at}&page=1`;
HomeFunAssessmentList.routeBasePath = "/assessments/homefunlist";
HomeFunAssessmentList.routeRedirectDefault = `/assessments/homefunlist?assessment_type=${AssessmentTypeValues.homeFun}order_by=${HomeFunAssessmentOrderBy._submit_at}&status=${AssessmentStatus.all}&page=1`;
