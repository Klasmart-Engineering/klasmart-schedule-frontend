import { makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { forwardRef } from "react";
import { MilestoneCondition } from ".";
import { GetOutcomeList, MilestoneDetailResult } from "../../api/type";
import OutcomeSearch, { OutcomeSearchProps } from "./OutcomeSearch";
import OutcomeTable from "./OutcomeTable";
const useStyles = makeStyles(({ breakpoints, palette }) => ({
  pagination: {},
  paginationUl: {
    justifyContent: "center",
  },
}));
export interface OutcomesProps {
  outcomeList: GetOutcomeList;
  value?: MilestoneDetailResult["outcome_ancestor_ids"];
  outcomeTotal: number;
  outcomePage: number;
  onSearch: OutcomeSearchProps["onSearch"];
  condition: MilestoneCondition;
  onChangePage: (page: number) => any;
  onChange?: (value: MilestoneDetailResult["outcome_ancestor_ids"]) => any;
  canEdit: boolean;
}
export const Outcomes = forwardRef<HTMLDivElement, OutcomesProps>((props, ref) => {
  const css = useStyles();
  const { outcomeList, value, outcomeTotal, outcomePage, condition, onChange, onSearch, onChangePage, canEdit } = props;
  const handleChangePage = (event: object, page: number) => onChangePage(page);
  const pagination = (
    <Pagination
      className={css.pagination}
      classes={{ ul: css.paginationUl }}
      onChange={handleChangePage}
      count={Math.ceil(outcomeTotal / 10)}
      color="primary"
      page={outcomePage}
    />
  );
  return (
    <div style={{ minHeight: 900 }}>
      <OutcomeSearch condition={condition} onSearch={onSearch} />
      <OutcomeTable outcomeList={outcomeList} value={value} onChange={onChange} canEdit={canEdit} />
      {pagination}
    </div>
  );
});
