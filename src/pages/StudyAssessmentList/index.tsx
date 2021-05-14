import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { AssessmentOrderBy, AssessmentStatus, HomeFunAssessmentOrderBy, StudyAssessmentOrderBy } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { emptyTip } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { getStudyAssessmentList } from "../../reducers/assessments";
import { AssessmentDetail } from "../AssesmentDetail";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { AssessmentType, SecondSearchHeader, SecondSearchHeaderMb, SecondSearchHeaderProps } from "./SecondSearchHearder";
import { ThirdSearchHeader, ThirdSearchHeaderMb } from "./ThirdSearchHearder";
import { StudyAssessmentQueryCondition } from "./types";

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
    const status = (querys.get("status") as AssessmentStatus | null) || undefined;
    const page = Number(querys.get("page")) || 1;
    const order_by = (querys.get("order_by") as StudyAssessmentOrderBy | null) || undefined;
    return clearNull({ query, status, page, order_by });
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
  const { studyAssessmentList, total } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
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
      <SecondSearchHeader value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
      <SecondSearchHeaderMb value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
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

StudyAssessmentList.routeBasePath = "/assessment/study";
StudyAssessmentList.routeRedirectDefault = `/assessment/study?status=${AssessmentStatus.all}&order_by=${StudyAssessmentOrderBy._create_at}&page=1`;
