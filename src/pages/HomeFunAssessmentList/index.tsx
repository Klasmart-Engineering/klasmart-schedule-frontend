import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { AssessmentOrderBy, AssessmentStatus, HomeFunAssessmentOrderBy, HomeFunAssessmentStatus } from "../../api/type";
import { emptyTip } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { actHomeFunAssessmentList } from "../../reducers/assessments";
import { AssessmentsHomefunEdit } from "../HomefunEdit";
import { OutcomeList } from "../OutcomeList";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { FirstSearchHeader, FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
import { AssessmentType, SecondSearchHeader, SecondSearchHeaderMb, SecondSearchHeaderProps } from "./SecondSearchHeader";
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
  const dispatch = useDispatch<AppDispatch>();
  const handleChangePage: AssessmentTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleChangeAssessmentType = (assessmentType: AssessmentType) => {
    history.push(`/assessments/assessment-list?status=${AssessmentStatus.all}&order_by=${AssessmentOrderBy._class_end_time}&page=1`);
  };
  const handleClickAssessment: AssessmentTableProps["onClickAssessment"] = (id) => {
    history.push({ pathname: AssessmentsHomefunEdit.routeBasePath, search: toQueryString({ id }) });
  };
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  const handleChangeOutcome: FirstSearchHeaderProps["onChange"] = (value) =>
    history.push({ pathname: OutcomeList.routeBasePath, search: toQueryString(value) });
  useEffect(() => {
    dispatch(actHomeFunAssessmentList({ ...condition, page_size: PAGE_SIZE, metaLoading: true }));
  }, [condition, dispatch]);

  return (
    <>
      <FirstSearchHeader value={{ page: 1 }} onChange={handleChangeOutcome} />
      <FirstSearchHeaderMb value={{ page: 1 }} onChange={handleChangeOutcome} />
      <SecondSearchHeader value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
      <SecondSearchHeaderMb value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
      <ThirdSearchHeader value={condition} onChange={handleChange} />
      <ThirdSearchHeaderMb value={condition} onChange={handleChange} />
      {homeFunAssessmentList && homeFunAssessmentList.length > 0 ? (
        <AssessmentTable
          list={homeFunAssessmentList}
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

HomeFunAssessmentList.routeBasePath = "/assessments/home-fun";
HomeFunAssessmentList.routeRedirectDefault = `/assessments/home-fun?status=${AssessmentStatus.all}&order_by=${HomeFunAssessmentOrderBy._latest_feedback_at}&page=1`;
