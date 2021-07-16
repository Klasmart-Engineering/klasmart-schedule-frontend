import { Button, Divider, Grid, Grow, Menu, MenuItem, MenuList, Paper, Popper, TextField } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { MoreHoriz } from "@material-ui/icons";
import ArrowDropDownOutlinedIcon from "@material-ui/icons/ArrowDropDownOutlined";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import clsx from "clsx";
import produce from "immer";
import React, { ChangeEvent } from "react";
import { MilestoneOrderBy, MilestoneStatus } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { Permission, PermissionOr, PermissionResult, PermissionType, usePermission } from "../../components/Permission/Permission";
import { d } from "../../locale/LocaleManager";
import { MilestoneQueryCondition, MilestoneQueryConditionBaseProps } from "./types";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 20 + 10,
  },
  createBtn: {
    width: "125px",
    borderRadius: "23px",
    height: "48px",
    backgroundColor: "#0E78D5",
    textTransform: "capitalize",
  },
  nav: {
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "3px",
    textTransform: "capitalize",
  },
  searchBtn: {
    width: "111px",
    height: "40px",
    backgroundColor: "#0E78D5",
    marginLeft: "20px",
  },
  bulkActionSelect: {
    width: 160,
    height: 40,
  },
  formControl: {
    minWidth: 136,
    marginLeft: "20px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  switch: {
    display: "none",
    marginRight: "22px",
  },
  navigation: {
    padding: "20px 0px 10px 0px",
  },
  searchText: {
    width: "34%",
  },
  actives: {
    color: "#0E78D5",
  },
  tabMb: {
    textAlign: "right",
    position: "relative",
  },
  switchBtn: {
    width: "60px",
    height: "40px",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  tabs: {
    minHeight: "42px",
    height: "42px",
  },
  tabCon: {
    width: "100%",
    minHeight: "42px",
    height: "42px",
    display: "flex",
    justifyContent: "center",
  },
  button: {
    maxWidth: "264px",
    minWidth: "130px",
    borderRadius: 0,
  },
  active: {
    color: "#0E78D5",
    borderBottom: "2px solid #0E78D5 !important",
  },
  paper: {
    width: "30%",
    position: "absolute",
    left: "60%",
  },
}));
export const UNPUB = "UNPUB";
function SubLearningOutcome(props: MilestoneQueryConditionBaseProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const perm = usePermission([PermissionType.view_my_pending_milestone_429]);
  const unpublished = () => {
    if (perm.view_my_pending_milestone_429) {
      return [
        { label: d("Draft").t("assess_label_draft"), value: MilestoneStatus.draft },
        { label: d("Waiting for Approval").t("assess_label_waiting_for_approval"), value: MilestoneStatus.pending },
        { label: d("Rejected").t("assess_label_rejected"), value: MilestoneStatus.rejected },
      ];
    } else {
      return [
        { label: d("Draft").t("assess_label_draft"), value: MilestoneStatus.draft },
        { label: d("Rejected").t("assess_label_rejected"), value: MilestoneStatus.rejected },
      ];
    }
  };
  const showDropdown = (event: any) => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickActionItem = (e: ChangeEvent<{}>, status: MilestoneQueryCondition["status"]) => {
    onChange({ ...value, status, page: 1, is_unpub: UNPUB });
  };
  const handleClickStatus = (status: MilestoneQueryCondition["status"]) => () => {
    onChange({ ...value, status, page: 1, is_unpub: "" });
  };
  return (
    <>
      <div className={classes.tabCon}>
        <Permission value={PermissionType.view_published_milestone_418}>
          <Button
            className={clsx(classes.button, { [classes.active]: value?.status === MilestoneStatus.published })}
            onClick={handleClickStatus(MilestoneStatus.published)}
          >
            {d("Published").t("assess_label_published")}
          </Button>
        </Permission>
        <Permission value={PermissionType.view_pending_milestone_486}>
          <Button
            className={clsx(classes.button, {
              [classes.active]: value?.status === MilestoneStatus.pending && value.is_unpub !== UNPUB,
            })}
            onClick={handleClickStatus(MilestoneStatus.pending)}
          >
            {d("Pending").t("assess_label_pending")}
          </Button>
        </Permission>
        <PermissionOr value={[PermissionType.view_unpublished_milestone_417, PermissionType.view_my_unpublished_milestone_428]}>
          <Button
            ref={anchorRef}
            className={clsx(classes.button, { [classes.active]: value.is_unpub === UNPUB })}
            endIcon={<ArrowDropDownOutlinedIcon />}
            onMouseEnter={showDropdown}
            onMouseLeave={handleClose}
          >
            {d("Unpublished").t("assess_label_unpublished")}
            <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow {...TransitionProps} style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}>
                  <Paper>
                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleClose}>
                      {unpublished().map((item) => (
                        <MenuItem
                          key={item.label}
                          selected={
                            value.status === MilestoneStatus.pending
                              ? value.status === item.value && value.is_unpub === UNPUB
                              : value.status === item.value
                          }
                          onClick={(event) => handleClickActionItem(event, item.value)}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Button>
        </PermissionOr>
      </div>
    </>
  );
}

enum BulkAction {
  delete = "delete",
  approve = "approve",
  reject = "reject",
}

interface BulkActionOption {
  label: string;
  value: BulkAction;
}

function getBulkAction(condition: MilestoneQueryCondition, perm: PermissionResult<PermissionType[]>): BulkActionOption[] {
  switch (condition.status) {
    case MilestoneStatus.published:
      let pubRes: BulkActionOption[] = [];
      if (perm.delete_published_milestone_450) {
        pubRes = [
          {
            label: d("Delete").t("assess_label_delete"),
            value: BulkAction.delete,
          },
        ];
      }
      return pubRes;
    case MilestoneStatus.pending:
      let pendingRes: BulkActionOption[] = [];
      if (condition.is_unpub) {
        if (perm.delete_unpublished_milestone_449 || perm.delete_my_pending_milestone_490) {
          pendingRes = [
            {
              label: d("Delete").t("assess_label_delete"),
              value: BulkAction.delete,
            },
          ];
        }
      } else {
        if (perm.delete_org_pending_milestone_489) {
          pendingRes.push({
            label: d("Delete").t("assess_label_delete"),
            value: BulkAction.delete,
          });
        }
        if (perm.approve_pending_milestone_491) {
          pendingRes.push({
            label: d("Approve").t("assess_label_approve"),
            value: BulkAction.approve,
          });
        }
        if (perm.reject_pending_milestone_492) {
          pendingRes.push({
            label: d("Reject").t("assess_label_reject"),
            value: BulkAction.reject,
          });
        }
      }
      return pendingRes;
    case MilestoneStatus.draft:
    case MilestoneStatus.rejected:
      let unPubRes: BulkActionOption[] = [];
      if (perm.delete_unpublished_milestone_449 || perm.delete_my_unpublished_milestone_488) {
        unPubRes = [
          {
            label: d("Delete").t("assess_label_delete"),
            value: BulkAction.delete,
          },
        ];
      }
      return unPubRes;
    default:
      return [];
  }
}

const sortOptions = () => {
  return [
    { label: d("Name (A-Z)").t("assess_label_name_atoz"), value: MilestoneOrderBy.name },
    { label: d("Name (Z-A)").t("assess_label_name_ztoa"), value: MilestoneOrderBy._name },
    { label: d("Created On (New-Old)").t("assess_label_created_on_newtoold"), value: MilestoneOrderBy._created_at },
    { label: d("Created On (Old-New)").t("assess_label_created_on_oldtonew"), value: MilestoneOrderBy.created_at },
  ];
};

export interface ThirdSearchHeaderProps extends MilestoneQueryConditionBaseProps {
  onBulkDelete: () => any;
  onBulkApprove: () => any;
  onBulkReject: () => any;
}
export function ThirdSearchHeader(props: ThirdSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange, onBulkDelete, onBulkApprove, onBulkReject } = props;
  const perm = usePermission([
    PermissionType.delete_org_pending_milestone_489,
    PermissionType.delete_my_pending_milestone_490,
    PermissionType.delete_unpublished_milestone_449,
    PermissionType.delete_my_unpublished_milestone_488,
    PermissionType.delete_published_milestone_450,
    PermissionType.approve_pending_milestone_491,
    PermissionType.reject_pending_milestone_492,
  ]);
  const handleChangeBulkAction = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === BulkAction.delete) onBulkDelete();
    if (event.target.value === BulkAction.approve) onBulkApprove();
    if (event.target.value === BulkAction.reject) onBulkReject();
  };
  const handleChangeOrder = (event: ChangeEvent<HTMLInputElement>) => {
    const order_by = event.target.value as MilestoneOrderBy | undefined;
    onChange(
      produce(value, (draft) => {
        order_by ? (draft.order_by = order_by) : delete draft.order_by;
      })
    );
  };

  const bulkOptions = getBulkAction(value, perm).map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
  const orderbyOptions = sortOptions().map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Divider />
          <Grid container spacing={3} alignItems="center" style={{ marginTop: "6px" }}>
            <Grid item sm={6} xs={6} md={3}>
              {bulkOptions.length > 0 && (
                <TextField
                  size="small"
                  style={{ width: 200 }}
                  onChange={handleChangeBulkAction}
                  label={d("Bulk Actions").t("assess_label_bulk_actions")}
                  value=""
                  select
                  SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                >
                  {bulkOptions}
                </TextField>
              )}
            </Grid>
            <Grid item md={6}>
              <SubLearningOutcome value={value} onChange={onChange} />
            </Grid>
            <Grid container direction="row" justify="flex-end" alignItems="center" item sm={6} xs={6} md={3}>
              <TextField
                size="small"
                style={{ width: 200 }}
                onChange={handleChangeOrder}
                value={value.order_by || MilestoneOrderBy._updated_at}
                label={d("Sort By").t("assess_label_sort_by")}
                select
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              >
                {orderbyOptions}
              </TextField>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

export function ThirdSearchHeaderMb(props: ThirdSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange, onBulkDelete, onBulkApprove, onBulkReject } = props;
  const perm = usePermission([
    PermissionType.delete_org_pending_milestone_489,
    PermissionType.delete_my_pending_milestone_490,
    PermissionType.delete_unpublished_milestone_449,
    PermissionType.delete_my_unpublished_milestone_488,
    PermissionType.delete_published_milestone_450,
    PermissionType.approve_pending_milestone_491,
    PermissionType.reject_pending_milestone_492,
  ]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElLeft, setAnchorElLeft] = React.useState<null | HTMLElement>(null);
  const handleClickBulkActionButton = (event: any) => {
    setAnchorElLeft(event.currentTarget);
  };
  const handleClickActionItem = (event: any, bulkaction: BulkAction) => {
    setAnchorElLeft(null);
    if (bulkaction === BulkAction.delete) onBulkDelete();
    if (bulkaction === BulkAction.approve) onBulkApprove();
    if (bulkaction === BulkAction.reject) onBulkReject();
  };
  const handleClose = () => {
    setAnchorElLeft(null);
  };
  const showSort = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickOrderbyItem = (event: any, order_by: MilestoneOrderBy | undefined) => {
    setAnchorEl(null);
    onChange(
      produce(value, (draft) => {
        order_by ? (draft.order_by = order_by) : delete draft.order_by;
      })
    );
  };
  const handleSortClose = () => {
    setAnchorEl(null);
  };
  const actions = getBulkAction(value, perm);
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <hr style={{ borderColor: "#e0e0e0" }} />
          <Grid container alignItems="center" style={{ marginTop: "6px", position: "relative" }}>
            <Grid item sm={10} xs={10}>
              <SubLearningOutcome value={value} onChange={onChange} />
            </Grid>
            <Grid container justify="flex-end" alignItems="center" item sm={2} xs={2}>
              {actions.length > 0 && <MoreHoriz onClick={handleClickBulkActionButton} />}
              <Menu anchorEl={anchorElLeft} keepMounted open={Boolean(anchorElLeft)} onClose={handleClose}>
                {actions.map((item, index) => (
                  <MenuItem key={item.label} onClick={(event) => handleClickActionItem(event, item.value)}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
              <ImportExportIcon onClick={showSort} />
              <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleSortClose}>
                {sortOptions().map((item, index) => (
                  <MenuItem
                    key={item.label}
                    selected={value.order_by === item.value}
                    onClick={(e) => handleClickOrderbyItem(e, item.value)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}
