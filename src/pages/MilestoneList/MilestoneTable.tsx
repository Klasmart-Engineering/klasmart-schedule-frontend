import { Checkbox, createStyles, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { Pagination } from "@material-ui/lab";
import clsx from "clsx";
import React, { useMemo, useState } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { useDispatch } from "react-redux";
import { MilestoneDetailResult, MilestoneListResult, MilestoneStatus } from "../../api/type";
import { CheckboxGroup, CheckboxGroupContext } from "../../components/CheckboxGroup";
import LayoutBox from "../../components/LayoutBox";
import { LButton } from "../../components/LButton";
import { Permission, PermissionType } from "../../components/Permission/Permission";
import { d } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { AppDispatch } from "../../reducers";
import { actWarning } from "../../reducers/notify";
import { BulkListForm, BulkListFormKey, MilestoneQueryCondition } from "./types";

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
export const GENERALMILESTONE = "general";
const stopPropagation = <T extends React.MouseEvent, R = void>(handler?: (arg: T) => R) => (e: T) => {
  e.stopPropagation();
  if (handler) return handler(e);
};

interface MilestoneProps extends MilestoneActionProps {
  milestone: MilestoneDetailResult;
  queryCondition: MilestoneQueryCondition;
  selectedContentGroupContext: CheckboxGroupContext;
  onClickMilestone: MilestoneTableProps["onClickMilestone"];
  // userId: string;
}
function MilestoneRow(props: MilestoneProps) {
  const css = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const { milestone, selectedContentGroupContext, onDelete, onClickMilestone } = props;
  const { registerChange, hashValue } = selectedContentGroupContext;
  const [isDisable, setIsDisable] = useState(false);
  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (milestone.locked_by && milestone.locked_by !== "-") {
      setIsDisable(true);
      return dispatch(actWarning(d("You cannot do bulk action for locked milestones.").t("assess_msg_locked_milestone")));
    }
    registerChange(e);
  };
  const isGeneralMilestone = milestone.type === GENERALMILESTONE;
  return (
    <TableRow onClick={(e) => onClickMilestone(milestone.milestone_id)}>
      <TableCell align="center" padding="checkbox">
        {!isGeneralMilestone && (
          <Checkbox
            icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
            checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
            size="small"
            className={css.checkbox}
            color="secondary"
            value={milestone.milestone_id}
            checked={hashValue[milestone.milestone_id as string] || false}
            onClick={stopPropagation()}
            onChange={handleChangeCheckbox}
            disabled={isDisable}
          ></Checkbox>
        )}
      </TableCell>
      <TableCell className={clsx(css.tableCell)}>{milestone.milestone_name}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{isGeneralMilestone ? d("N/A").t("assess_column_n_a") : milestone.shortcode}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{milestone.outcome_count}</TableCell>
      <TableCell className={clsx(css.tableCell)}>
        {isGeneralMilestone ? d("N/A").t("assess_column_n_a") : milestone.program?.map((item) => item.program_name).join(",")}
      </TableCell>
      <TableCell className={clsx(css.tableCell)}>{milestone.category?.map((item) => item.category_name).join(",")}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{formattedTime(milestone.create_at)}</TableCell>
      <TableCell className={clsx(css.tableCell)}>
        {milestone.type !== GENERALMILESTONE && milestone.status === MilestoneStatus.published && (
          <Permission value={PermissionType.delete_published_milestone_450}>
            <LButton
              as={IconButton}
              replace
              className={css.iconColor}
              onClick={stopPropagation((e) => onDelete(milestone.milestone_id as string))}
            >
              <DeleteOutlineIcon />
            </LButton>
          </Permission>
        )}
        {milestone.type !== GENERALMILESTONE && milestone.status === MilestoneStatus.unpublished && (
          <Permission value={PermissionType.delete_unpublished_milestone_449}>
            <LButton
              as={IconButton}
              replace
              className={css.iconColor}
              onClick={stopPropagation((e) => onDelete(milestone.milestone_id as string))}
            >
              <DeleteOutlineIcon />
            </LButton>
          </Permission>
        )}
      </TableCell>
    </TableRow>
  );
}

interface MilestoneActionProps {
  onDelete: (id: NonNullable<MilestoneDetailResult["milestone_id"]>) => any;
}

export interface MilestoneTableProps extends MilestoneActionProps {
  formMethods: UseFormMethods<BulkListForm>;
  total: number;
  // userId: string;
  amountPerPage?: number;
  list: MilestoneListResult;
  queryCondition: MilestoneQueryCondition;
  onChangePage: (page: number) => void;
  onClickMilestone: (id: MilestoneDetailResult["milestone_id"]) => any;
}
export function MilestoneTable(props: MilestoneTableProps) {
  const css = useStyles();
  const {
    formMethods,
    list,
    total,
    // userId,
    queryCondition,
    onDelete,
    onChangePage,
    onClickMilestone,
  } = props;
  const amountPerPage = props.amountPerPage ?? 10;
  // const allValue = useMemo(() => list.map((outcome) => outcome.outcome_id as string), [list]);
  const allValue = useMemo(() => {
    if (list && list[0]) {
      const newList = list.map((milestone) =>
        milestone.type === GENERALMILESTONE || (milestone.locked_by && milestone.locked_by !== "-")
          ? ""
          : (milestone.milestone_id as string)
      );
      return newList.filter((id) => id);
    } else {
      return [];
    }
  }, [list]);
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
                      <TableCell className={clsx(css.tableCell)}>{d("Milestones").t("assess_label_milestone")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Short Code").t("assess_label_short_code")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Number of Learning Outcomes").t("assess_detail_number_lo")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Program").t("assess_label_program")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Category").t("assess_label_category")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Created On").t("library_label_created_on")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Actions").t("assess_label_actions")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list &&
                      list[0] &&
                      list.map((item, idx) => (
                        <MilestoneRow
                          key={item.milestone_id}
                          // userId={userId}
                          milestone={item}
                          {...{ onDelete, queryCondition, selectedContentGroupContext, onClickMilestone }}
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
