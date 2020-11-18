import { Divider, Grid, Menu, MenuItem, TextField } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { MoreHoriz } from "@material-ui/icons";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import produce from "immer";
import React, { ChangeEvent } from "react";
import { OutcomeOrderBy, OutcomePublishStatus } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { isUnpublish, UNPUB } from "./FirstSearchHeader";
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
}));

function SubUnpublished(props: OutcomeQueryConditionBaseProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const handleChange = (e: ChangeEvent<{}>, publish_status: OutcomeQueryCondition["publish_status"]) => {
    if (publish_status === OutcomePublishStatus.pending) {
      return onChange({ ...value, publish_status, page: 1, is_unpub: UNPUB });
    }
    onChange({ ...value, publish_status, page: 1 });
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
      <Tab value={OutcomePublishStatus.draft} label={d("Draft").t("assess_label_draft")} />
      <Tab value={OutcomePublishStatus.pending} label={d("Waiting for Approval").t("assess_label_waiting_for_approval")} />
      <Tab value={OutcomePublishStatus.rejected} label={d("Rejected").t("assess_label_rejected")} />
    </Tabs>
  );
}

enum BulkAction {
  publish = "publish",
  remove = "remove",
}

interface BulkActionOption {
  label: string;
  value: BulkAction;
}

function getBulkAction(condition: OutcomeQueryCondition): BulkActionOption[] {
  const unpublish = isUnpublish(condition);
  switch (condition.publish_status) {
    case OutcomePublishStatus.published:
      return [{ label: d("Delete").t("assess_label_delete"), value: BulkAction.remove }];
    case OutcomePublishStatus.pending:
      if (condition.is_unpub) {
        return [{ label: d("Delete").t("assess_label_delete"), value: BulkAction.remove }];
      } else {
        return [];
      }
    default:
      return unpublish ? [{ label: d("Delete").t("assess_label_delete"), value: BulkAction.remove }] : [];
  }
}

const sortOptions = () => {
  return [
    { label: d("Name(A-Z)").t("assess_label_name_atoz"), value: OutcomeOrderBy.name },
    { label: d("Name(Z-A)").t("assess_label_name_ztoa"), value: OutcomeOrderBy._name },
    { label: d("Created On(New-Old)").t("assess_label_created_on_newtoold"), value: OutcomeOrderBy._updated_at },
    { label: d("Created On(Old-New)").t("assess_label_created_on_oldtonew"), value: OutcomeOrderBy.updated_at },
  ];
};

export interface ThirdSearchHeaderProps extends OutcomeQueryConditionBaseProps {
  onBulkPublish: () => any;
  onBulkDelete: () => any;
}
export function ThirdSearchHeader(props: ThirdSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange, onBulkDelete, onBulkPublish } = props;
  const unpublish = isUnpublish(value);
  const handleChangeBulkAction = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === BulkAction.publish) onBulkPublish();
    if (event.target.value === BulkAction.remove) onBulkDelete();
  };
  const handleChangeOrder = (event: ChangeEvent<HTMLInputElement>) => {
    const order_by = event.target.value as OutcomeOrderBy | undefined;
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
    if (bulkaction === BulkAction.remove) onBulkDelete();
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
  const actions = getBulkAction(value);
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <hr style={{ borderColor: "#e0e0e0" }} />
          <Grid container alignItems="center" style={{ marginTop: "6px", position: "relative" }}>
            <Grid item sm={10} xs={10}>
              {unpublish && <SubUnpublished value={value} onChange={onChange} />}
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
