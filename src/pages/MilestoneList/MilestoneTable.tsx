import {
  Checkbox,
  createStyles,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import DoneIcon from "@material-ui/icons/Done";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Pagination } from "@material-ui/lab";
import clsx from "clsx";
import React, { useMemo } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import PermissionType from "../../api/PermissionType";
import { MilestoneDetailResult, MilestoneListResult, MilestoneStatus } from "../../api/type";
import { CheckboxGroup, CheckboxGroupContext } from "../../components/CheckboxGroup";
import LayoutBox from "../../components/LayoutBox";
import { LButton } from "../../components/LButton";
import { Permission } from "../../components/Permission/Permission";
import { d } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { formatTimeToEng } from "../../models/ModelReports";
import { BulkListForm, BulkListFormKey, MilestoneQueryCondition } from "./types";
const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}))(Tooltip);
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
    disableTableRow: {
      "& td": {
        color: "rgba(0, 0, 0, 0.26)",
        backgroundColor: "transparent",
      },
    },
    disableTableCell: {
      position: "relative",
      zIndex: 100,
      color: "rgba(0, 0, 0, 0.26)",
      backgroundColor: "transparent",
    },
    disableBtn: {
      opacity: 0.6,
      filter: "alpha(opacity=60)",
      pointerEvents: "none",
      cursor: "default",
    },
    lockWrap: {
      position: "absolute",
      top: 0,
      left: 0,
    },
    trapezoidCon: {
      width: "27px",
      borderTop: "3px solid #d8e9f8",
      borderLeft: "2px solid #fff",
      borderRight: "2px solid #fff",
      height: 0,
    },
    lockCon: {
      width: 0,
      height: 0,
      borderTop: "22px solid #d8e9f8",
      borderLeft: "13.5px solid #d8e9f8",
      borderRight: "13.5px solid #d8e9f8",
      borderBottom: "5px solid #fff",
      textAlign: "center",
      borderRadius: "1px",
      position: "absolute",
      marginTop: 1,
      marginLeft: 2,
    },
    lockTitle: {
      fontWeight: 700,
    },
    lockInfoWrap: {
      fontSize: 14,
      height: 28,
      lineHeight: "28px",
      color: "#000",
    },
    lockIcon: {
      fontSize: 16,
      color: "#0f78d5",
      position: "absolute",
      top: -20,
      left: -8,
    },
    lightGrayColor: {
      color: "#666",
    },
  })
);
export const GENERALMILESTONE = "general";
const stopPropagation =
  <T extends React.MouseEvent, R = void>(handler?: (arg: T) => R) =>
  (e: T) => {
    e.stopPropagation();
    if (handler) return handler(e);
  };

interface MilestoneProps extends MilestoneActionProps {
  milestone: MilestoneDetailResult;
  queryCondition: MilestoneQueryCondition;
  selectedContentGroupContext: CheckboxGroupContext;
  onClickMilestone: MilestoneTableProps["onClickMilestone"];
  user_id: string;
}
function MilestoneRow(props: MilestoneProps) {
  const css = useStyles();
  // const dispatch = useDispatch<AppDispatch>();
  const { milestone, selectedContentGroupContext, onDelete, onApprove, onReject, onClickMilestone, queryCondition, user_id } = props;
  const { is_unpub } = queryCondition;
  const { registerChange, hashValue } = selectedContentGroupContext;
  const isLocked = !!(milestone.locked_by && milestone.locked_by !== "-");
  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    registerChange(e);
  };
  const isGeneralMilestone = milestone.type === GENERALMILESTONE;
  const isMyself = user_id === milestone.author?.author_id;
  return (
    <TableRow className={isLocked ? css.disableTableRow : ""} onClick={(e) => onClickMilestone(milestone.milestone_id)}>
      <TableCell className={isLocked ? css.disableTableCell : ""} style={{ width: 100 }} align="center" padding="checkbox">
        {isLocked && (
          <LightTooltip
            title={
              <>
                <div className={clsx(css.lockInfoWrap, css.lockTitle)}>{d("Lock Status").t("assess_in_lock_status")}</div>
                <div className={css.lockInfoWrap}>
                  <span>{d("Last edited by").t("assess_last_edited_by")}: </span>
                  <span className={css.lightGrayColor}>{milestone.last_edited_by}</span>
                </div>
                <div className={css.lockInfoWrap}>
                  <span>{d("Locked location").t("assess_locked_location")}: </span>
                  <span className={css.lightGrayColor}>{milestone.locked_location?.join(",")}</span>
                </div>
                <div className={css.lockInfoWrap}>
                  <span>{d("Date edited").t("assess_date_edited")}: </span>
                  <span className={css.lightGrayColor}>{formatTimeToEng(milestone.last_edited_at as number, "date")}</span>
                </div>
                <div className={css.lockInfoWrap}>
                  <span>{d("Time edited").t("assess_time_edited")}: </span>
                  <span className={css.lightGrayColor}>{formatTimeToEng(milestone.last_edited_at as number, "time")}</span>
                </div>
              </>
            }
            placement="right"
          >
            <div className={css.lockWrap}>
              <div className={css.trapezoidCon}></div>
              <div className={css.lockCon}>
                <LockOutlinedIcon className={css.lockIcon} />
              </div>
            </div>
          </LightTooltip>
        )}
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
            disabled={isLocked}
          ></Checkbox>
        )}
      </TableCell>
      <TableCell className={clsx(css.tableCell)}>{milestone.milestone_name}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{isGeneralMilestone ? d("N/A").t("assess_column_n_a") : milestone.shortcode}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{milestone.outcome_count}</TableCell>
      <TableCell className={clsx(css.tableCell)}>
        {isGeneralMilestone ? "None Specified" : milestone.program?.map((item) => item.program_name).join(",")}
      </TableCell>
      <TableCell className={clsx(css.tableCell)}>
        {isGeneralMilestone ? "None Specified" : milestone.category?.map((item) => item.category_name).join(",")}
      </TableCell>
      <TableCell className={clsx(css.tableCell)}>{formattedTime(milestone.create_at)}</TableCell>
      <TableCell className={clsx(css.tableCell, isLocked ? css.disableBtn : "")}>
        {!isGeneralMilestone && milestone.status === MilestoneStatus.published && (
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
        {!isGeneralMilestone && milestone.status === MilestoneStatus.pending && !is_unpub && (
          <>
            <Permission value={PermissionType.delete_org_pending_milestone_489}>
              <LButton
                as={IconButton}
                replace
                className={css.iconColor}
                onClick={stopPropagation((e) => onDelete(milestone.milestone_id as string))}
              >
                <DeleteOutlineIcon />
              </LButton>
            </Permission>
            <Permission value={PermissionType.approve_pending_milestone_491}>
              <LButton
                as={IconButton}
                replace
                className={css.approveIconColor}
                onClick={stopPropagation((e) => onApprove(milestone.milestone_id as string))}
              >
                <DoneIcon />
              </LButton>
            </Permission>
            <Permission value={PermissionType.reject_pending_milestone_492}>
              <LButton
                as={IconButton}
                replace
                className={css.iconColor}
                onClick={stopPropagation((e) => onReject(milestone.milestone_id as string))}
              >
                <ClearIcon />
              </LButton>
            </Permission>
          </>
        )}
        {!isGeneralMilestone && milestone.status === MilestoneStatus.pending && is_unpub && (
          <Permission value={PermissionType.delete_my_pending_milestone_490}>
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
        {!isGeneralMilestone && (milestone.status === MilestoneStatus.draft || milestone.status === MilestoneStatus.rejected) && isMyself && (
          <Permission value={PermissionType.delete_my_unpublished_milestone_488}>
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
        {!isGeneralMilestone && (milestone.status === MilestoneStatus.draft || milestone.status === MilestoneStatus.rejected) && !isMyself && (
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
  onApprove: (id: NonNullable<MilestoneDetailResult["milestone_id"]>) => any;
  onReject: (id: NonNullable<MilestoneDetailResult["milestone_id"]>) => any;
}

export interface MilestoneTableProps extends MilestoneActionProps {
  formMethods: UseFormMethods<BulkListForm>;
  total: number;
  user_id: string;
  amountPerPage?: number;
  list: MilestoneListResult;
  queryCondition: MilestoneQueryCondition;
  onChangePage: (page: number) => void;
  onClickMilestone: (id: MilestoneDetailResult["milestone_id"]) => any;
}
export function MilestoneTable(props: MilestoneTableProps) {
  const css = useStyles();
  const { formMethods, list, total, user_id, queryCondition, onDelete, onApprove, onReject, onChangePage, onClickMilestone } = props;
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
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517} overflowX="auto">
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
                          {...{ user_id, onDelete, onApprove, onReject, queryCondition, selectedContentGroupContext, onClickMilestone }}
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
