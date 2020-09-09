import { Checkbox, createStyles, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { Pagination } from "@material-ui/lab";
import clsx from "clsx";
import React, { useMemo } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { LearningOutcomes } from "../../api/api";
import { OutcomePublishStatus } from "../../api/type";
import { CheckboxGroup, CheckboxGroupContext } from "../../components/CheckboxGroup";
import LayoutBox from "../../components/LayoutBox";
import { LButton } from "../../components/LButton";
import { BulkListForm, BulkListFormKey, OutcomeQueryCondition } from "./types";

const useStyles = makeStyles((theme) =>
  createStyles({
    iconColor: {
      color: "#D32F2F",
      padding: "0 0 0 10px",
    },
    rePublishColor: {
      color: "#0E78D5",
      padding: "0 0 0 10px",
    },
    pagination: {
      marginBottom: 40,
    },
    paginationUl: {
      justifyContent: "center",
      marginTop: 30,
    },
    checkbox: {
      padding: 0,
      borderRadius: 5,
      backgroundColor: "white",
    },
    tableHead: {
      height: 80,
      backgroundColor: "#f2f5f7",
    },
    tableCell: {
      textAlign: "center",
    },
  })
);

const stopPropagation = <T extends React.MouseEvent, R = void>(handler?: (arg: T) => R) => (e: T) => {
  e.stopPropagation();
  if (handler) return handler(e);
};

interface OutcomeProps extends OutcomeActionProps {
  outcome: LearningOutcomes;
  queryCondition: OutcomeQueryCondition;
  selectedContentGroupContext: CheckboxGroupContext;
  onClickOutcome: OutcomeTableProps["onClickOutcome"];
}
function OutomeRow(props: OutcomeProps) {
  const css = useStyles();
  const { outcome, queryCondition, selectedContentGroupContext, onDelete, onClickOutcome } = props;
  const { registerChange, hashValue } = selectedContentGroupContext;
  return (
    <TableRow onClick={(e) => onClickOutcome(outcome.outcome_id)}>
      {outcome.publish_status !== OutcomePublishStatus.pending && (
        <TableCell align="center" padding="checkbox">
          <Checkbox
            icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
            checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
            size="small"
            className={css.checkbox}
            color="secondary"
            value={outcome.outcome_id}
            checked={hashValue[outcome.outcome_id as string] || false}
            onClick={stopPropagation()}
            onChange={registerChange}
          ></Checkbox>
        </TableCell>
      )}
      <TableCell className={clsx(css.tableCell)}>{outcome.outcome_name}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.shortcode}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.program}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.subject}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.skills}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.publish_scope}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.assumed}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.created_at}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.author_name}</TableCell>
      <TableCell className={clsx(css.tableCell)}>
        {queryCondition.publish_status !== OutcomePublishStatus.pending && (
          <LButton
            as={IconButton}
            replace
            className={css.iconColor}
            onClick={stopPropagation((e) => onDelete(outcome.outcome_id as string))}
          >
            <DeleteOutlineIcon />
          </LButton>
        )}
      </TableCell>
    </TableRow>
  );
}

interface OutcomeActionProps {
  onPublish: (id: NonNullable<LearningOutcomes["outcome_id"]>) => any;
  onDelete: (id: NonNullable<LearningOutcomes["outcome_id"]>) => any;
}

export interface OutcomeTableProps extends OutcomeActionProps {
  formMethods: UseFormMethods<BulkListForm>;
  total: number;
  amountPerPage?: number;
  list: LearningOutcomes[];
  queryCondition: OutcomeQueryCondition;
  onChangePage: (page: number) => void;
  onClickOutcome: (id: LearningOutcomes["outcome_id"]) => any;
}
export function OutcomeTable(props: OutcomeTableProps) {
  const css = useStyles();
  const { formMethods, list, total, amountPerPage = 16, queryCondition, onPublish, onDelete, onChangePage, onClickOutcome } = props;
  const allValue = useMemo(() => list.map((outcome) => outcome.outcome_id as string), [list]);
  const { control } = formMethods;
  const handleChangePage = (event: object, page: number) => onChangePage(page);
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517} overflowX="scroll">
      <Controller
        name={BulkListFormKey.CHECKED_BULK_IDS}
        control={control}
        defaultValue={[]}
        render={(props) => (
          <CheckboxGroup
            allValue={allValue}
            {...props}
            render={(selectedContentGroupContext) => (
              <TableContainer>
                <Table>
                  <TableHead className={css.tableHead}>
                    <TableRow>
                      {list[0].publish_status !== OutcomePublishStatus.pending && (
                        <TableCell align="center" padding="checkbox">
                          <Checkbox
                            icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
                            checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
                            size="small"
                            className={css.checkbox}
                            color="secondary"
                            checked={selectedContentGroupContext.isAllvalue}
                            onChange={selectedContentGroupContext.registerAllChange}
                          />
                        </TableCell>
                      )}
                      <TableCell className={clsx(css.tableCell)}>Learning Outcomes</TableCell>
                      <TableCell className={clsx(css.tableCell)}>Short Code</TableCell>
                      <TableCell className={clsx(css.tableCell)}>Program</TableCell>
                      <TableCell className={clsx(css.tableCell)}>Subject</TableCell>
                      <TableCell className={clsx(css.tableCell)}>Milestone</TableCell>
                      <TableCell className={clsx(css.tableCell)}>Standard</TableCell>
                      <TableCell className={clsx(css.tableCell)}>Assumed</TableCell>
                      <TableCell className={clsx(css.tableCell)}>Created On</TableCell>
                      <TableCell className={clsx(css.tableCell)}>Author</TableCell>
                      <TableCell className={clsx(css.tableCell)}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item, idx) => (
                      <OutomeRow
                        key={item.outcome_id}
                        outcome={item}
                        {...{ onPublish, onDelete, queryCondition, selectedContentGroupContext, onClickOutcome }}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          />
        )}
      />

      <Pagination
        page={queryCondition.page}
        className={css.pagination}
        classes={{ ul: css.paginationUl }}
        onChange={handleChangePage}
        count={Math.ceil(total / amountPerPage)}
        color="primary"
      />
    </LayoutBox>
  );
}
