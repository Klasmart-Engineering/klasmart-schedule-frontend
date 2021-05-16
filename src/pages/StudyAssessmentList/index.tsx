import produce from "immer";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { AssessmentOrderBy, AssessmentStatus, ExectSeachType, HomeFunAssessmentOrderBy, StudyAssessmentOrderBy } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { emptyTip } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { getStudyAssessmentList } from "../../reducers/assessments";
import { AssessmentDetail } from "../AssesmentDetail";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { AssessmentType, SecondSearchHeader, SecondSearchHeaderMb, SecondSearchHeaderProps } from "./SecondSearchHearder";
import { ThirdSearchHeader, ThirdSearchHeaderMb } from "./ThirdSearchHearder";
import { SearchListForm, SearchListFormKey, StudyAssessmentQueryCondition } from "./types";

const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

const useQuery = (): StudyAssessmentQueryCondition => {
  const { search } = useLocation();
  return useMemo(() => {
    const querys = new URLSearchParams(search);
    const query = querys.get("query");
    const query_type = querys.get("query_type") || ExectSeachType.all;
    const status = (querys.get("status") as AssessmentStatus | null) || undefined;
    const page = Number(querys.get("page")) || 1;
    const order_by = (querys.get("order_by") as StudyAssessmentOrderBy | null) || undefined;
    return clearNull({ query, status, page, order_by, query_type });
  }, [search]);
};

const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};

export function StudyAssessmentList() {
  const condition = useQuery();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const formMethods = useForm<SearchListForm>();
  const { getValues } = formMethods;
  const { studyAssessmentList, total } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => {
    const searchText = getValues()[SearchListFormKey.SEARCH_TEXT];
    const exectSearch = getValues()[SearchListFormKey.EXECT_SEARCH];
    const newValue = produce(value, (draft) => {
      searchText ? (draft.query = searchText) : delete draft.query;
      draft.query_type = exectSearch;
    });
    history.push({ search: toQueryString(newValue) })
  };
  const handleChangeAssessmentType = (assessmentType: AssessmentType) => {
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
  const handleChangePage: AssessmentTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickAssessment: AssessmentTableProps["onClickAssessment"] = (id) => {
    history.push({ pathname: AssessmentDetail.routeBasePath, search: toQueryString({ id }) });
  };
  useEffect(() => {
    dispatch(getStudyAssessmentList(condition));
  }, [condition, dispatch]);
  return (
    <>
      <FirstSearchHeader />
      <FirstSearchHeaderMb />
      <SecondSearchHeader value={condition} formMethods={formMethods} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
      <SecondSearchHeaderMb value={condition} formMethods={formMethods}  onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
      <ThirdSearchHeader value={condition} onChange={handleChange} />
      <ThirdSearchHeaderMb value={condition} onChange={handleChange} />
      {studyAssessmentList && studyAssessmentList[0] ? (
        <AssessmentTable
          list={studyAssessmentList}
          total={total}
          queryCondition={condition}
          onChangePage={handleChangePage}
          onClickAssessment={handleClickAssessment}
        />
      ) : (
        emptyTip
      )}
    </>
  );
}

StudyAssessmentList.routeBasePath = "/assessments/study";
StudyAssessmentList.routeRedirectDefault = `/assessments/study?status=${AssessmentStatus.all}&order_by=${StudyAssessmentOrderBy._complete_at}&page=1`;
