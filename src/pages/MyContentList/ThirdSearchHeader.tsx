import { Divider, Grid, Menu, MenuItem, TextField } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { MoreHoriz } from "@material-ui/icons";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import produce from "immer";
import React, { ChangeEvent } from "react";
import { OrderBy, PublishStatus } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { isUnpublish } from "./FirstSearchHeader";
import { Assets, QueryCondition, QueryConditionBaseProps } from "./types";

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
}));

function SubUnpublished(props: QueryConditionBaseProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const handleChange = (e: ChangeEvent<{}>, publish_status: QueryCondition["publish_status"]) => onChange({ ...value, publish_status });
  return (
    <Tabs
      className={classes.tabs}
      value={value.publish_status}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
      centered
    >
      <Tab value={PublishStatus.draft} label="Draft" />
      <Tab value={PublishStatus.pending} label="Waiting for Approval" />
      <Tab value={PublishStatus.rejected} label="Rejected" />
    </Tabs>
  );
}

enum BulkAction {
  publish = "publish",
  remove = "remove",
  delete = "delete",
}

interface BulkActionOption {
  label: string;
  value: BulkAction;
}

function getBulkAction(condition: QueryCondition): BulkActionOption[] {
  const unpublish = isUnpublish(condition);
  if (condition.content_type === Assets.assets_type) {
    return [{ label: "delete", value: BulkAction.delete }];
  }
  switch (condition.publish_status) {
    case PublishStatus.published:
      return [{ label: "remove", value: BulkAction.remove }];
    case PublishStatus.pending:
      return [];
    case PublishStatus.archive:
      return [
        { label: "republish", value: BulkAction.publish },
        { label: "delete", value: BulkAction.remove },
      ];
    default:
      return unpublish ? [{ label: "delete", value: BulkAction.delete }] : [];
  }
}

const sortOptions = [
  { label: "Name(A-Z)", value: OrderBy.content_name },
  { label: "Name(Z-A)", value: OrderBy._content_name },
  { label: "Created On(New-Old)", value: OrderBy._created_at },
  { label: "Created On(Old-New)", value: OrderBy.created_at },
];
export interface ThirdSearchHeaderProps extends QueryConditionBaseProps {
  onBulkPublish: () => any;
  onBulkDelete: (type: string) => any;
}
export function ThirdSearchHeader(props: ThirdSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange, onBulkDelete, onBulkPublish } = props;
  const unpublish = isUnpublish(value);
  const handleChangeBulkAction = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === BulkAction.publish) onBulkPublish();
    if (event.target.value === BulkAction.delete) onBulkDelete(BulkAction.delete);
    if (event.target.value === BulkAction.remove) onBulkDelete(BulkAction.remove);
  };
  const handleChangeOrder = (event: ChangeEvent<HTMLInputElement>) => {
    const order_by = event.target.value as OrderBy | undefined;
    onChange(
      produce(value, (draft) => {
        order_by ? (draft.order_by = order_by) : delete draft.order_by;
      })
    );
  };

  const bulkOptions = getBulkAction(value).map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
  const orderbyOptions = sortOptions.map((item) => (
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
                  style={{ width: 200 }}
                  size="small"
                  onChange={handleChangeBulkAction}
                  label="Bulk Actions"
                  value=""
                  select
                  SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                >
                  {bulkOptions}
                </TextField>
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
                label="Display By"
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
  const unpublish = isUnpublish(value);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElLeft, setAnchorElLeft] = React.useState<null | HTMLElement>(null);
  const handleClickBulkActionButton = (event: any) => {
    setAnchorElLeft(event.currentTarget);
  };
  const handleClickActionItem = (event: any, bulkaction: BulkAction) => {
    setAnchorElLeft(null);
    if (bulkaction === BulkAction.publish) onBulkPublish();
    if (event.target.value === BulkAction.delete) onBulkDelete(BulkAction.delete);
    if (event.target.value === BulkAction.remove) onBulkDelete(BulkAction.remove);
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
  const actions = getBulkAction(value);
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
                {sortOptions.map((item, index) => (
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
