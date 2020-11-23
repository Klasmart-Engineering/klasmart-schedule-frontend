import { Button, Divider, Grid, Menu, MenuItem, TextField } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { MoreHoriz } from "@material-ui/icons";
import CreateNewFolderOutlinedIcon from "@material-ui/icons/CreateNewFolderOutlined";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import produce from "immer";
import React, { ChangeEvent } from "react";
import { Author, OrderBy, PublishStatus, SearchContentsRequestContentType } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { PermissionResult, PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { Action } from "../../reducers/content";
import { isUnpublish } from "./FirstSearchHeader";
import { QueryCondition, QueryConditionBaseProps } from "./types";

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
  addFloderBtn: {
    width: 160,
    height: 40,
    marginLeft: 30,
    boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  },
}));

function SubUnpublished(props: QueryConditionBaseProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const handleChange = (e: ChangeEvent<{}>, publish_status: QueryCondition["publish_status"]) => {
    if (publish_status === PublishStatus.pending) {
      return onChange({ ...value, publish_status, author: Author.self });
    }
    onChange({ ...value, publish_status, author: undefined });
  };
  return (
    <Tabs
      className={classes.tabs}
      value={value.publish_status}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
      centered
    >
      <Tab value={PublishStatus.draft} label={d("Draft").t("library_label_draft")} />
      <Tab value={PublishStatus.pending} label={d("Waiting for Approval").t("library_label_waiting_for_approval")} />
      <Tab value={PublishStatus.rejected} label={d("Rejected").t("library_label_rejected")} />
    </Tabs>
  );
}

export enum BulkAction {
  publish = "publish",
  remove = "remove",
  delete = "delete",
}

interface BulkActionOption {
  label: string;
  value: BulkAction;
}

function getBulkAction(condition: QueryCondition, perm: PermissionResult<PermissionType[]>): BulkActionOption[] {
  const unpublish = isUnpublish(condition);
  if (condition.content_type === SearchContentsRequestContentType.assets) {
    return perm.delete_asset_340 ? [{ label: d("Delete").t("library_label_delete"), value: BulkAction.delete }] : [];
  }
  switch (condition.publish_status) {
    case PublishStatus.published:
      return perm.archive_published_content_273 ? [{ label: d("Remove").t("library_label_remove"), value: BulkAction.remove }] : [];
    case PublishStatus.pending:
      return unpublish ? [{ label: d("Delete").t("library_label_delete"), value: BulkAction.delete }] : [];
    case PublishStatus.archive:
      const result = [];
      if (perm.republish_archived_content_274)
        result.push({ label: d("Republish").t("library_label_republish"), value: BulkAction.publish });
      if (perm.delete_archived_content_275) result.push({ label: d("Delete").t("library_label_delete"), value: BulkAction.remove });
      return result;
    case PublishStatus.draft:
    case PublishStatus.rejected:
      return [{ label: d("Delete").t("library_label_delete"), value: BulkAction.delete }];
    default:
      return [];
  }
}

const sortOptions = () => [
  { label: d("Content Name(A-Z)").t("library_label_content_name_atoz"), value: OrderBy.content_name },
  { label: d("Content Name(Z-A)").t("library_label_content_name_ztoa"), value: OrderBy._content_name },
  { label: d("Created On(New-Old)").t("library_label_created_on_newtoold"), value: OrderBy._updated_at },
  { label: d("Created On(Old-New)").t("library_label_created_on_oldtonew"), value: OrderBy.updated_at },
];
export interface ThirdSearchHeaderProps extends QueryConditionBaseProps {
  onBulkPublish: () => any;
  onBulkDelete: (type: Action) => any;
}
export function ThirdSearchHeader(props: ThirdSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange, onBulkDelete, onBulkPublish } = props;
  const perm = usePermission([
    PermissionType.delete_asset_340,
    PermissionType.archive_published_content_273,
    PermissionType.republish_archived_content_274,
    PermissionType.delete_archived_content_275,
  ]);
  const unpublish = isUnpublish(value);
  const handleChangeBulkAction = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === BulkAction.publish) onBulkPublish();
    if (event.target.value === BulkAction.delete) onBulkDelete(Action.delete);
    if (event.target.value === BulkAction.remove) onBulkDelete(Action.remove);
  };
  const handleChangeOrder = (event: ChangeEvent<HTMLInputElement>) => {
    const order_by = event.target.value as OrderBy | undefined;
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
                  style={{ width: 160 }}
                  size="small"
                  onChange={handleChangeBulkAction}
                  label={d("Bulk Actions").t("library_label_bulk_actions")}
                  value=""
                  select
                  SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                >
                  {bulkOptions}
                </TextField>
              )}
              {false && (
                <Button className={classes.addFloderBtn} startIcon={<CreateNewFolderOutlinedIcon />}>
                  Add a Folder
                </Button>
              )}
            </Grid>
            {unpublish ? (
              <Grid item md={6}>
                <SubUnpublished value={value} onChange={onChange} />
              </Grid>
            ) : (
              <Hidden only={["xs", "sm"]}>
                <Grid item md={6}></Grid>
              </Hidden>
            )}
            <Grid container direction="row" justify="flex-end" alignItems="center" item sm={6} xs={6} md={3}>
              <TextField
                size="small"
                style={{ width: 200 }}
                onChange={handleChangeOrder}
                label={d("Sort By").t("library_label_sort_by")}
                value={value.order_by}
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
  const { value, onChange, onBulkDelete, onBulkPublish } = props;
  const perm = usePermission([
    PermissionType.delete_asset_340,
    PermissionType.archive_published_content_273,
    PermissionType.republish_archived_content_274,
    PermissionType.delete_archived_content_275,
  ]);
  const unpublish = isUnpublish(value);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElLeft, setAnchorElLeft] = React.useState<null | HTMLElement>(null);
  const handleClickBulkActionButton = (event: any) => {
    setAnchorElLeft(event.currentTarget);
  };
  const handleClickActionItem = (event: any, bulkaction: BulkAction) => {
    setAnchorElLeft(null);
    if (bulkaction === BulkAction.publish) onBulkPublish();
    if (event.target.value === BulkAction.delete) onBulkDelete(Action.delete);
    if (event.target.value === BulkAction.remove) onBulkDelete(Action.remove);
  };
  const handleClose = () => {
    setAnchorElLeft(null);
  };
  const showSort = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickOrderbyItem = (event: any, order_by: OrderBy | undefined) => {
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
          <Divider />
          <Grid container alignItems="center" style={{ marginTop: "6px", position: "relative" }}>
            <Grid item sm={10} xs={10}>
              {unpublish && <SubUnpublished value={value} onChange={onChange} />}
            </Grid>
            <Grid container justify="flex-end" alignItems="center" item sm={2} xs={2}>
              {actions.length > 0 && <MoreHoriz onClick={handleClickBulkActionButton} />}
              <Menu anchorEl={anchorElLeft} keepMounted open={Boolean(anchorElLeft)} onClose={handleClose}>
                {actions.map((item, index) => (
                  <MenuItem key={item.label} onClick={(event) => handleClickActionItem(event, item.value)}>
                    {item.value}
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
