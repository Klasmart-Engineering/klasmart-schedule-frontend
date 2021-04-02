import { Checkbox, createStyles, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import DoneIcon from "@material-ui/icons/Done";
import { Pagination } from "@material-ui/lab";
import clsx from "clsx";
import React, { useMemo, useState } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ApiOutcomeView } from "../../api/api.auto";
import { OutcomePublishStatus } from "../../api/type";
import { CheckboxGroup, CheckboxGroupContext } from "../../components/CheckboxGroup";
import LayoutBox from "../../components/LayoutBox";
import { LButton } from "../../components/LButton";
import { Permission, PermissionType } from "../../components/Permission/Permission";
import { d } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { AppDispatch } from "../../reducers";
import { actWarning } from "../../reducers/notify";
import { isUnpublish } from "./FirstSearchHeader";
import { BulkListForm, BulkListFormKey, OutcomeQueryCondition } from "./types";

const useStyles = makeStyles((theme) =>
  createStyles({
    iconColor: {
      color: "#D32F2F",
      padding: "0 0 0 10px",
    },
    approveIconColor: {
      color: "#4CAF50",
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
    outcomeSet: {
      overflow: "hidden",
      display: "-webkit-box",
      textOverflow: "ellipsis",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 3,
      maxHeight: 93,
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
  userId: string;
}
function OutomeRow(props: OutcomeProps) {
  const css = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const { outcome, queryCondition, selectedContentGroupContext, onDelete, onClickOutcome, userId, onApprove, onReject } = props;
  const { registerChange, hashValue } = selectedContentGroupContext;
  const [isDisable, setIsDisable] = useState(false);
  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (outcome.locked_by) {
      setIsDisable(true);
      return dispatch(
        actWarning(
          d("The selected learning outcome is still in approval process, you cannot do bulk action for now.").t("assess_msg_locked_lo")
        )
      );
    }
    registerChange(e);
  };
  return (
    <TableRow onClick={(e) => onClickOutcome(outcome.outcome_id)}>
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
          onChange={handleChangeCheckbox}
          disabled={isDisable}
        ></Checkbox>
      </TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.outcome_name}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.shortcode}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.program?.map((item) => item.program_name).join(",")}</TableCell>
      {/* <TableCell className={clsx(css.tableCell)}>{outcome.subject?.map((item) => item.subject_name).join(",")}</TableCell> */}
      {/* <TableCell className={clsx(css.tableCell)}></TableCell> */}
      {/* <TableCell className={clsx(css.tableCell)}></TableCell> */}
      <TableCell className={clsx(css.tableCell)}>{outcome.assumed ? "Yes" : ""}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.author_name}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{formattedTime(outcome.update_at)}</TableCell>
      <TableCell className={clsx(css.tableCell)}>
        <div className={css.outcomeSet}>{outcome.sets?.map((item) => item.set_name).join(";")}</div>
      </TableCell>
      <TableCell className={clsx(css.tableCell)}>
        {outcome.publish_status === OutcomePublishStatus.published && (
          <Permission value={PermissionType.delete_published_learning_outcome_448}>
            <LButton
              as={IconButton}
              replace
              className={css.iconColor}
              onClick={stopPropagation((e) => onDelete(outcome.outcome_id as string))}
            >
              <DeleteOutlineIcon />
            </LButton>
          </Permission>
        )}
        {userId !== outcome.author_id && outcome.publish_status === OutcomePublishStatus.pending && (
          <Permission value={PermissionType.delete_org_pending_learning_outcome_447}>
            <LButton
              as={IconButton}
              replace
              className={css.iconColor}
              onClick={stopPropagation((e) => onDelete(outcome.outcome_id as string))}
            >
              <DeleteOutlineIcon />
            </LButton>
          </Permission>
        )}
        {userId === outcome.author_id && outcome.publish_status === OutcomePublishStatus.pending && (
          <Permission value={PermissionType.delete_my_pending_learning_outcome_446}>
            <LButton
              as={IconButton}
              replace
              className={css.iconColor}
              onClick={stopPropagation((e) => onDelete(outcome.outcome_id as string))}
            >
              <DeleteOutlineIcon />
            </LButton>
          </Permission>
        )}
        {outcome.publish_status === OutcomePublishStatus.pending && !isUnpublish(queryCondition) && (
          <Permission value={PermissionType.approve_pending_learning_outcome_481}>
            <LButton
              as={IconButton}
              replace
              className={css.approveIconColor}
              onClick={stopPropagation((e) => onApprove(outcome.outcome_id as string))}
            >
              <DoneIcon />
            </LButton>
          </Permission>
        )}
        {outcome.publish_status === OutcomePublishStatus.pending && !isUnpublish(queryCondition) && (
          <Permission value={PermissionType.reject_pending_learning_outcome_482}>
            <LButton
              as={IconButton}
              replace
              className={css.iconColor}
              onClick={stopPropagation((e) => onReject(outcome.outcome_id as string))}
            >
              <ClearIcon />
            </LButton>
          </Permission>
        )}
        {userId !== outcome.author_id &&
          (outcome.publish_status === OutcomePublishStatus.draft || outcome.publish_status === OutcomePublishStatus.rejected) && (
            <Permission value={PermissionType.delete_org_unpublished_learning_outcome_445}>
              <LButton
                as={IconButton}
                replace
                className={css.iconColor}
                onClick={stopPropagation((e) => onDelete(outcome.outcome_id as string))}
              >
                <DeleteOutlineIcon />
              </LButton>
            </Permission>
          )}
        {userId === outcome.author_id &&
          (outcome.publish_status === OutcomePublishStatus.draft || outcome.publish_status === OutcomePublishStatus.rejected) && (
            <Permission value={PermissionType.delete_my_unpublished_learning_outcome_444}>
              <LButton
                as={IconButton}
                replace
                className={css.iconColor}
                onClick={stopPropagation((e) => onDelete(outcome.outcome_id as string))}
              >
                <DeleteOutlineIcon />
              </LButton>
            </Permission>
          )}
      </TableCell>
    </TableRow>
  );
}

interface OutcomeActionProps {
  onPublish: (id: NonNullable<ApiOutcomeView["outcome_id"]>) => any;
  onDelete: (id: NonNullable<ApiOutcomeView["outcome_id"]>) => any;
  onApprove: (id: NonNullable<ApiOutcomeView["outcome_id"]>) => any;
  onReject: (id: NonNullable<ApiOutcomeView["outcome_id"]>) => any;
}

export interface OutcomeTableProps extends OutcomeActionProps {
  formMethods: UseFormMethods<BulkListForm>;
  total: number;
  userId: string;
  amountPerPage?: number;
  list: ApiOutcomeView[];
  queryCondition: OutcomeQueryCondition;
  onChangePage: (page: number) => void;
  onClickOutcome: (id: ApiOutcomeView["outcome_id"]) => any;
}
export function OutcomeTable(props: OutcomeTableProps) {
  const css = useStyles();
  const {
    formMethods,
    list,
    total,
    userId,
    queryCondition,
    onPublish,
    onDelete,
    onChangePage,
    onClickOutcome,
    onApprove,
    onReject,
  } = props;
  const amountPerPage = props.amountPerPage ?? 20;
  // const allValue = useMemo(() => list.map((outcome) => outcome.outcome_id as string), [list]);
  const allValue = useMemo(() => list.map((outcome) => (outcome.locked_by ? "" : (outcome.outcome_id as string))), [list]);
  const { control } = formMethods;
  const handleChangePage = (event: object, page: number) => onChangePage(page);
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517} overflowX="scroll">
      <Controller
        name={BulkListFormKey.CHECKED_BULK_IDS}
        control={control}
        defaultValue={[]}
        render={({ ref, ...props }) => (
          <CheckboxGroup
            allValue={allValue}
            {...props}
            render={(selectedContentGroupContext) => (
              <TableContainer>
                <Table ref={ref}>
                  <TableHead className={css.tableHead}>
                    <TableRow>
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
                      <TableCell className={clsx(css.tableCell)}>{d("Learning Outcomes").t("library_label_learning_outcomes")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Short Code").t("assess_label_short_code")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Program").t("assess_label_program")}</TableCell>
                      {/* <TableCell className={clsx(css.tableCell)}>{d("Subject").t("assess_label_subject")}</TableCell> */}
                      {/* <TableCell className={clsx(css.tableCell)}>{d("Milestone").t("assess_label_milestone")}</TableCell> */}
                      {/* <TableCell className={clsx(css.tableCell)}>{d("Standard").t("assess_label_Standard")}</TableCell> */}
                      <TableCell className={clsx(css.tableCell)}>{d("Assumed").t("assess_label_assumed")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Author").t("library_label_author")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Created On").t("library_label_created_on")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>
                        {d("Learning Outcome Set").t("assess_set_learning_outcome_set")}
                      </TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Actions").t("assess_label_actions")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item, idx) => (
                      <OutomeRow
                        key={item.outcome_id}
                        userId={userId}
                        outcome={item}
                        {...{ onPublish, onDelete, queryCondition, selectedContentGroupContext, onClickOutcome, onApprove, onReject }}
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
