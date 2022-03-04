import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import { AssessmentStatus, ExectSeachType, HomeFunAssessmentOrderBy, HomeFunAssessmentStatus, OrderByAssessmentList } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { AssessmentTypeValues } from "../../components/AssessmentType";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { usePermission } from "../../hooks/usePermission";
import { AppDispatch, RootState } from "../../reducers";
import { getAssessmentListV2 } from "../../reducers/assessments";
import { AssessmentTableProps } from "../AssesmentList/AssessmentTable";
import { DetailAssessment } from "../DetailAssessment";
import { AssessmentTable } from "./AssessmentTable";
import { SecondSearchHeader, SecondSearchHeaderProps } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb } from "./ThirdSearchHeader";
import { AssessmentQueryCondition, SearchListForm } from "./types";
const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};
const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};
const useQuery = (): AssessmentQueryCondition => {
  const { search } = useLocation();
  return useMemo(() => {
    const querys = new URLSearchParams(search);
    const query_key = querys.get("query_key") || "";
    const query_type = (querys.get("query_type") as ExectSeachType) || ExectSeachType.all;
    const page = Number(querys.get("page")) || 1;
    const assessment_type = querys.get("assessment_type") || AssessmentTypeValues.live;
    const defaultOrderBy =
      assessment_type === AssessmentTypeValues.study ? OrderByAssessmentList._create_at : OrderByAssessmentList._class_end_time;
    const order_by = (querys.get("order_by") as OrderByAssessmentList) || defaultOrderBy;
    const status = (querys.get("status") as AssessmentStatus) || AssessmentStatus.all;
    return { ...clearNull({ query_key, status, page, order_by, query_type }), assessment_type };
  }, [search]);
};
export function ListAssessment() {
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
  const { assessmentListV2, total } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const condition = useQuery();
  const formMethods = useForm<SearchListForm>();
  const { reset } = formMethods;
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => {
    if (value.assessment_type === AssessmentTypeValues.homeFun) {
    } else {
      history.push({ search: toQueryString(value) });
    }
  };
  const handleChangeAssessmentType: SecondSearchHeaderProps["onChangeAssessmentType"] = (assessment_type) => {
    if (assessment_type === AssessmentTypeValues.homeFun) {
      history.push(
        `/assessments/homefunlist?assessment_type=${AssessmentTypeValues.homeFun}order_by=${HomeFunAssessmentOrderBy._submit_at}&status=${HomeFunAssessmentStatus.all}&page=1`
      );
    } else {
      reset();
      history.push(`/assessments/assessment-list?assessment_type=${assessment_type}&status=${AssessmentStatus.all}&page=1`);
    }
  };
  const handleChangePage: AssessmentTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickAssessment: AssessmentTableProps["onClickAssessment"] = (id) => {
    history.push({ pathname: DetailAssessment.routeBasePath, search: toQueryString({ id, assessment_type: condition.assessment_type }) });
  };
  useEffect(() => {
    dispatch(getAssessmentListV2({ ...condition, metaLoading: true }));
  }, [condition, dispatch]);
  return (
    <>
      <FirstSearchHeader />
      <FirstSearchHeaderMb />
      {!isPending && hasPerm && (
        <>
          <SecondSearchHeader
            value={condition}
            formMethods={formMethods}
            onChange={handleChange}
            onChangeAssessmentType={handleChangeAssessmentType}
          />
          <ThirdSearchHeader value={condition} onChange={handleChange} />
          <ThirdSearchHeaderMb value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
        </>
      )}
      {isPending ? (
        ""
      ) : hasPerm ? (
        total === undefined ? (
          ""
        ) : assessmentListV2 && assessmentListV2.length > 0 ? (
          <AssessmentTable
            queryCondition={condition}
            list={assessmentListV2}
            total={total || 0}
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
// ListAssessment.routeBasePath = "/assessments/list";
// ListAssessment.routeRedirectDefault = `/assessments/list?assessment_type=${AssessmentTypeValues.live}&status=${AssessmentStatus.all}&page=1`;

ListAssessment.routeBasePath = "/assessments/assessment-list";
ListAssessment.routeRedirectDefault = `/assessments/assessment-list?assessment_type=${AssessmentTypeValues.live}&status=${AssessmentStatus.all}&page=1`;
