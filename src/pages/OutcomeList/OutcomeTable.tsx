import { Checkbox, createStyles, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { Pagination } from "@material-ui/lab";
import clsx from "clsx";
import React, { useMemo } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { ApiOutcomeView } from "../../api/api.auto";
import { OutcomePublishStatus } from "../../api/type";
import { CheckboxGroup, CheckboxGroupContext } from "../../components/CheckboxGroup";
import LayoutBox from "../../components/LayoutBox";
import { LButton } from "../../components/LButton";
import { PermissionOr, PermissionType } from "../../components/Permission/Permission";
import { d } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";
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
      maxWidth: 200,
      wordWrap: "break-word",
      wordBreak: "normal",
    },
  })
);

const stopPropagation = <T extends React.MouseEvent, R = void>(handler?: (arg: T) => R) => (e: T) => {
  e.stopPropagation();
  if (handler) return handler(e);
};

interface OutcomeProps extends OutcomeActionProps {
  outcome: ApiOutcomeView;
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
      {(outcome.publish_status !== OutcomePublishStatus.pending ||
        (queryCondition.author_name && queryCondition.publish_status === OutcomePublishStatus.pending)) && (
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
      <TableCell className={clsx(css.tableCell)}>{outcome.program?.map((item) => item.program_name).join(",")}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.subject?.map((item) => item.subject_name).join(",")}</TableCell>
      <TableCell className={clsx(css.tableCell)}></TableCell>
      <TableCell className={clsx(css.tableCell)}></TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.assumed ? "Yes" : ""}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{formattedTime(outcome.update_at)}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.author_name}</TableCell>
      <TableCell className={clsx(css.tableCell)}>
        <PermissionOr
          value={[
            PermissionType.delete_my_unpublished_learninng_outcome_444,
            PermissionType.delete_org_unpublished_learning_outcome_445,
            PermissionType.delete_my_pending_learning_outcome_446,
            PermissionType.delete_org_pending_learning_outcome_447,
            PermissionType.delete_published_learning_outcome_448,
          ]}
          render={(value) =>
            value &&
            (queryCondition.publish_status !== OutcomePublishStatus.pending ||
              (queryCondition.author_name && queryCondition.publish_status === OutcomePublishStatus.pending)) && (
              <LButton
                as={IconButton}
                replace
                className={css.iconColor}
                onClick={stopPropagation((e) => onDelete(outcome.outcome_id as string))}
              >
                <DeleteOutlineIcon />
              </LButton>
            )
          }
        />
      </TableCell>
    </TableRow>
  );
}

interface OutcomeActionProps {
  onPublish: (id: NonNullable<ApiOutcomeView["outcome_id"]>) => any;
  onDelete: (id: NonNullable<ApiOutcomeView["outcome_id"]>) => any;
}

export interface OutcomeTableProps extends OutcomeActionProps {
  formMethods: UseFormMethods<BulkListForm>;
  total: number;
  amountPerPage?: number;
  list: ApiOutcomeView[];
  queryCondition: OutcomeQueryCondition;
  onChangePage: (page: number) => void;
  onClickOutcome: (id: ApiOutcomeView["outcome_id"]) => any;
}
export function OutcomeTable(props: OutcomeTableProps) {
  const css = useStyles();
  const { formMethods, list, total, amountPerPage = 20, queryCondition, onPublish, onDelete, onChangePage, onClickOutcome } = props;
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
                      {(list[0].publish_status !== OutcomePublishStatus.pending ||
                        (queryCondition.author_name && queryCondition.publish_status === OutcomePublishStatus.pending)) && (
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
                      <TableCell className={clsx(css.tableCell)}>{d("Learning Outcome").t("assess_label_learning_outcome")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Short Code").t("assess_label_short_code")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Program").t("assess_label_program")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Subject").t("assess_label_subject")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Milestone").t("assess_label_milestone")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Standard").t("assess_label_Standard")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Assumed").t("assess_label_assumed")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Created On").t("library_label_created_on")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Author").t("library_label_author")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Actions").t("assess_label_actions")}</TableCell>
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
