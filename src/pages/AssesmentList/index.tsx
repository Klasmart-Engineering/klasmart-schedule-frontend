import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { AssessmentOrderBy, AssessmentStatus } from "../../api/type";
import { emptyTip } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { actAssessmentList } from "../../reducers/assessments";
import { AssessmentsEdit } from "../AssessmentEdit";
import { OutcomeList } from "../OutcomeList";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { FirstSearchHeader, FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
import { SecondSearchHeader, SecondSearchHeaderMb, SecondSearchHeaderProps } from "./SecondSearchHeader";
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
  const { assessmentList, total } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const dispatch = useDispatch<AppDispatch>();
  const handleChangePage: AssessmentTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickAssessment: AssessmentTableProps["onClickAssessment"] = (id) =>
    history.push({ pathname: AssessmentsEdit.routeBasePath, search: toQueryString({ id }) });
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  const handleChangeOutcome: FirstSearchHeaderProps["onChange"] = (value) =>
    history.push({ pathname: OutcomeList.routeBasePath, search: toQueryString(value) });
  useEffect(() => {
    dispatch(actAssessmentList({ ...condition, page_size: PAGE_SIZE, metaLoading: true }));
  }, [condition, dispatch]);

  return (
    <div>
      <FirstSearchHeader value={{ page: 1 }} onChange={handleChangeOutcome} />
      <FirstSearchHeaderMb value={{ page: 1 }} onChange={handleChangeOutcome} />
      <SecondSearchHeader value={condition} onChange={handleChange} />
      <SecondSearchHeaderMb value={condition} onChange={handleChange} />
      <ThirdSearchHeader value={condition} onChange={handleChange} />
      <ThirdSearchHeaderMb value={condition} onChange={handleChange} />
      {
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
        // (
        //   <div style={{ margin: "0 auto", textAlign: "center" }}>
        //     <img src={emptyIconUrl} alt="" />
        //     <Typography variant="body1" color="textSecondary">
        //       Empty...
        //     </Typography>
        //   </div>
        // )
      }
    </div>
  );
}

AssessmentList.routeBasePath = "/assessments/assessment-list";
AssessmentList.routeRedirectDefault = `/assessments/assessment-list?status=${AssessmentStatus.all}&order_by=${AssessmentOrderBy._class_end_time}&page=1`;
