import { Button, Divider, Grid, Grow, Menu, MenuItem, MenuList, Paper, Popper, TextField } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { MoreHoriz } from "@material-ui/icons";
import ArrowDropDownOutlinedIcon from "@material-ui/icons/ArrowDropDownOutlined";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import clsx from "clsx";
import produce from "immer";
import React, { ChangeEvent } from "react";
import PermissionType from "../../api/PermissionType";
import { OutcomeOrderBy, OutcomePublishStatus } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { Permission, PermissionResult, PermissionsWrapper } from "../../components/Permission/Permission";
import { usePermission } from "../../hooks/usePermission";
import { d } from "../../locale/LocaleManager";
import { OutcomeQueryCondition, OutcomeQueryConditionBaseProps } from "./types";

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
export const isUnpublish = (value: OutcomeQueryCondition): boolean => {
  return (
    (value.publish_status === OutcomePublishStatus.pending && !!value?.is_unpub) ||
    value.publish_status === OutcomePublishStatus.draft ||
    value.publish_status === OutcomePublishStatus.rejected
  );
};
function SubLearningOutcome(props: OutcomeQueryConditionBaseProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const handleClickStatus = (publish_status: OutcomeQueryCondition["publish_status"]) => () => {
    if (publish_status === OutcomePublishStatus.draft || publish_status === OutcomePublishStatus.rejected) return;
    onChange({ ...value, publish_status, page: 1, is_unpub: "" });
  };
  const unpublished = () => {
    return [
      { label: d("Draft").t("assess_label_draft"), value: OutcomePublishStatus.draft },
      { label: d("Waiting for Approval").t("assess_label_waiting_for_approval"), value: OutcomePublishStatus.pending },
      { label: d("Rejected").t("assess_label_rejected"), value: OutcomePublishStatus.rejected },
    ];
  };
  const showDropdown = (event: any) => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickActionItem = (e: ChangeEvent<{}>, publish_status: OutcomeQueryCondition["publish_status"]) => {
    onChange({ ...value, publish_status, page: 1, is_unpub: UNPUB });
  };
  return (
    <>
      <div className={classes.tabCon}>
        <PermissionsWrapper>
          <Permission value={PermissionType.learning_outcome_page_404}>
            <Button
              className={clsx(classes.button, { [classes.active]: value?.publish_status === OutcomePublishStatus.published })}
              onClick={handleClickStatus(OutcomePublishStatus.published)}
            >
              {d("Published").t("assess_label_published")}
            </Button>
          </Permission>
          <Permission value={PermissionType.view_org_pending_learning_outcome_413}>
            <Button
              className={clsx(classes.button, {
                [classes.active]: value?.publish_status === OutcomePublishStatus.pending && value.is_unpub !== UNPUB,
              })}
              onClick={handleClickStatus(OutcomePublishStatus.pending)}
            >
              {d("Pending").t("assess_label_pending")}
            </Button>
          </Permission>
          <Permission value={PermissionType.unpublished_page_402}>
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
                              value.publish_status === OutcomePublishStatus.pending
                                ? value.publish_status === item.value && value.is_unpub === UNPUB
                                : value.publish_status === item.value
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
          </Permission>
        </PermissionsWrapper>
      </div>
    </>
  );
}

enum BulkAction {
  publish = "publish",
  remove = "remove",
  approve = "approve",
  reject = "reject",
  addSet = "addSet",
}

interface BulkActionOption {
  label: string;
  value: BulkAction;
}

function getBulkAction(condition: OutcomeQueryCondition, perm: PermissionResult<PermissionType[]>): BulkActionOption[] {
  switch (condition.publish_status) {
    case OutcomePublishStatus.published:
      const res1 = [];
      if (perm.edit_published_learning_outcome_436) {
        res1.push({ label: d("Add to Set").t("assess_set_add_to_set"), value: BulkAction.addSet });
      }
      if (perm.delete_published_learning_outcome_448) {
        res1.push({ label: d("Delete").t("assess_label_delete"), value: BulkAction.remove });
      }
      return res1;
    case OutcomePublishStatus.pending:
      const res2 = [];
      if (perm.approve_pending_learning_outcome_481 && !isUnpublish(condition)) {
        res2.push({ label: d("Approve").t("assess_label_approve"), value: BulkAction.approve });
      }
      if (perm.delete_org_pending_learning_outcome_447 || perm.delete_my_pending_learning_outcome_446) {
        res2.push({ label: d("Delete").t("assess_label_delete"), value: BulkAction.remove });
      }
      if (perm.reject_pending_learning_outcome_482 && !isUnpublish(condition)) {
        res2.push({ label: d("Reject").t("assess_label_reject"), value: BulkAction.reject });
      }
      return res2;
    default:
      const res3 = [];
      if (perm.edit_my_unpublished_learning_outcome_430) {
        res3.push({ label: d("Add to Set").t("assess_set_add_to_set"), value: BulkAction.addSet });
      }
      if (perm.delete_org_unpublished_learning_outcome_445 || perm.delete_my_unpublished_learning_outcome_444) {
        res3.push({ label: d("Delete").t("assess_label_delete"), value: BulkAction.remove });
      }
      return res3;
  }
}

const sortOptions = () => {
  return [
    { label: d("Name (A-Z)").t("assess_label_name_atoz"), value: OutcomeOrderBy.name },
    { label: d("Name (Z-A)").t("assess_label_name_ztoa"), value: OutcomeOrderBy._name },
    { label: d("Created On (New-Old)").t("assess_label_created_on_newtoold"), value: OutcomeOrderBy._updated_at },
    { label: d("Created On (Old-New)").t("assess_label_created_on_oldtonew"), value: OutcomeOrderBy.updated_at },
  ];
};

export interface ThirdSearchHeaderProps extends OutcomeQueryConditionBaseProps {
  onBulkPublish: () => any;
  onBulkDelete: () => any;
  onBulkApprove: () => any;
  onBulkReject: () => any;
  onBulkAddSet: () => any;
}
export function ThirdSearchHeader(props: ThirdSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange, onBulkDelete, onBulkPublish, onBulkApprove, onBulkReject, onBulkAddSet } = props;
  const perm = usePermission([
    PermissionType.delete_published_learning_outcome_448,
    PermissionType.delete_org_pending_learning_outcome_447,
    PermissionType.delete_my_pending_learning_outcome_446,
    PermissionType.delete_org_unpublished_learning_outcome_445,
    PermissionType.delete_my_unpublished_learning_outcome_444,
    PermissionType.approve_pending_learning_outcome_481,
    PermissionType.reject_pending_learning_outcome_482,
    PermissionType.edit_published_learning_outcome_436,
    PermissionType.edit_my_unpublished_learning_outcome_430,
  ]);
  const handleChangeBulkAction = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === BulkAction.publish) onBulkPublish();
    if (event.target.value === BulkAction.remove) onBulkDelete();
    if (event.target.value === BulkAction.approve) onBulkApprove();
    if (event.target.value === BulkAction.reject) onBulkReject();
    if (event.target.value === BulkAction.addSet) onBulkAddSet();
  };
  const handleChangeOrder = (event: ChangeEvent<HTMLInputElement>) => {
    const order_by = event.target.value as OutcomeOrderBy | undefined;
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
                value={value.order_by || OutcomeOrderBy._updated_at}
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
  const { value, onChange, onBulkDelete, onBulkPublish, onBulkApprove, onBulkReject, onBulkAddSet } = props;
  const perm = usePermission([
    PermissionType.delete_published_learning_outcome_448,
    PermissionType.delete_org_pending_learning_outcome_447,
    PermissionType.delete_my_pending_learning_outcome_446,
    PermissionType.delete_org_unpublished_learning_outcome_445,
    PermissionType.delete_my_unpublished_learning_outcome_444,
    PermissionType.approve_pending_learning_outcome_481,
    PermissionType.reject_pending_learning_outcome_482,
    PermissionType.edit_published_learning_outcome_436,
    PermissionType.edit_my_unpublished_learning_outcome_430,
  ]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElLeft, setAnchorElLeft] = React.useState<null | HTMLElement>(null);
  const handleClickBulkActionButton = (event: any) => {
    setAnchorElLeft(event.currentTarget);
  };
  const handleClickActionItem = (event: any, bulkaction: BulkAction) => {
    setAnchorElLeft(null);
    if (bulkaction === BulkAction.publish) onBulkPublish();
    if (bulkaction === BulkAction.remove) onBulkDelete();
    if (bulkaction === BulkAction.approve) onBulkApprove();
    if (bulkaction === BulkAction.reject) onBulkReject();
    if (bulkaction === BulkAction.addSet) onBulkAddSet();
  };
  const handleClose = () => {
    setAnchorElLeft(null);
  };
  const showSort = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickOrderbyItem = (event: any, order_by: OutcomeOrderBy | undefined) => {
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
