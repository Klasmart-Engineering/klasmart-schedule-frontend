import { Divider, Grid, Menu, MenuItem, TextField } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import GestureIcon from "@material-ui/icons/Gesture";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import produce from "immer";
import React, { ChangeEvent } from "react";
import { AssessmentOrderBy, AssessmentStatus } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { AssessmentQueryConditionBaseProps } from "./types";

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

const sortOptions = [
  { label: "Class End Time(New-Old)", value: AssessmentOrderBy._class_end_time },
  { label: "Class End Time(Old-New)", value: AssessmentOrderBy.class_end_time },
  { label: "Complete Time(New-Old)", value: AssessmentOrderBy._complete_time },
  { label: "Complete Time(Old-New)", value: AssessmentOrderBy.complete_time },
];
const assessmentStatusOptions = [
  { label: "All", value: AssessmentStatus.all },
  { label: "Complete", value: AssessmentStatus.complete },
  { label: "In Progress", value: AssessmentStatus.in_progress },
];

export interface ThirdSearchHeaderProps extends AssessmentQueryConditionBaseProps {}
export function ThirdSearchHeader(props: ThirdSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const handleChangeOrder = (event: ChangeEvent<HTMLInputElement>) => {
    const order_by = event.target.value as AssessmentOrderBy | undefined;
    onChange(
      produce(value, (draft) => {
        order_by ? (draft.order_by = order_by) : delete draft.order_by;
      })
    );
  };
  const handleChangeStatus = (event: ChangeEvent<HTMLInputElement>) => {
    const status = event.target.value as AssessmentStatus | undefined;
    onChange(
      produce(value, (draft) => {
        status ? (draft.status = status) : delete draft.status;
      })
    );
  };
  const orderbyOptions = sortOptions.map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
  const statusOptions = assessmentStatusOptions.map((item) => (
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
              <TextField
                size="small"
                fullWidth
                onChange={handleChangeStatus}
                value={value.status || AssessmentStatus.all}
                label="Status"
                select
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              >
                {statusOptions}
              </TextField>
            </Grid>
            <Hidden only={["xs", "sm"]}>
              <Grid item md={6}></Grid>
            </Hidden>
            <Grid container direction="row" justify="flex-end" alignItems="center" item sm={6} xs={6} md={3}>
              <TextField
                size="small"
                fullWidth
                onChange={handleChangeOrder}
                value={value.order_by || AssessmentOrderBy._complete_time}
                label="Display By"
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
  const { value, onChange } = props;
  const [anchorStatusEl, setAnchorStatusEl] = React.useState<null | HTMLElement>(null);
  const [anchorSortEl, setAnchorSortEl] = React.useState<null | HTMLElement>(null);
  const showStatus = (event: any) => {
    setAnchorStatusEl(event.currentTarget);
  };
  const showSort = (event: any) => {
    setAnchorSortEl(event.currentTarget);
  };
  const handleClickStatusbyItem = (event: any, status: AssessmentStatus | undefined) => {
    setAnchorStatusEl(null);
    onChange(
      produce(value, (draft) => {
        status ? (draft.status = status) : delete draft.status;
      })
    );
  };
  const handleClickOrderbyItem = (event: any, order_by: AssessmentOrderBy | undefined) => {
    setAnchorSortEl(null);
    onChange(
      produce(value, (draft) => {
        order_by ? (draft.order_by = order_by) : delete draft.order_by;
      })
    );
  };
  const handleStatusClose = () => {
    setAnchorStatusEl(null);
  };
  const handleSortClose = () => {
    setAnchorSortEl(null);
  };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Divider />
          <Grid container alignItems="center" style={{ marginTop: "6px", position: "relative" }}>
            <Grid item sm={10} xs={10}></Grid>
            <Grid container justify="flex-end" alignItems="center" item sm={2} xs={2}>
              <GestureIcon onClick={showStatus} />
              <Menu anchorEl={anchorStatusEl} keepMounted open={Boolean(anchorStatusEl)} onClose={handleStatusClose}>
                {assessmentStatusOptions.map((item, index) => (
                  <MenuItem key={item.label} selected={value.status === item.value} onClick={(e) => handleClickStatusbyItem(e, item.value)}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
              <ImportExportIcon onClick={showSort} />
              <Menu anchorEl={anchorSortEl} keepMounted open={Boolean(anchorSortEl)} onClose={handleSortClose}>
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
