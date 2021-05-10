import { makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { forwardRef } from "react";
import { MilestoneCondition } from ".";
import { GetOutcomeDetail, GetOutcomeList } from "../../api/type";
import { resultsTip } from "../../components/TipImages";
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
  value?: GetOutcomeList;
  outcomeTotal: number;
  outcomePage: number;
  onSearch: OutcomeSearchProps["onSearch"];
  condition: MilestoneCondition;
  onChangePage: (page: number) => any;
  onChange?: (value: GetOutcomeList) => any;
  canEdit: boolean;
  onClickOutcome: (id: GetOutcomeDetail["outcome_id"]) => any;
}
export const Outcomes = forwardRef<HTMLDivElement, OutcomesProps>((props, ref) => {
  const css = useStyles();
  const { outcomeList, value, outcomeTotal, outcomePage, condition, onChange, onSearch, onChangePage, canEdit, onClickOutcome } = props;
  const handleChangePage = (event: object, page: number) => onChangePage(page);

  return (
    <div style={{ minHeight: 900 }}>
      <OutcomeSearch condition={condition} onSearch={onSearch} />
      {outcomeList && outcomeList.length ? (
        <>
          <OutcomeTable outcomeList={outcomeList} value={value} onChange={onChange} canEdit={canEdit} onClickOutcome={onClickOutcome} />
          <Pagination
            className={css.pagination}
            classes={{ ul: css.paginationUl }}
            onChange={handleChangePage}
            count={Math.ceil(outcomeTotal / 10)}
            color="primary"
            page={outcomePage}
          />
        </>
      ) : (
        resultsTip
      )}
    </div>
  );
});
