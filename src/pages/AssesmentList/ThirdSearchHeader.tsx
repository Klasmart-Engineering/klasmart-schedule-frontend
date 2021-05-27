import { Divider, Grid, Menu, MenuItem, SvgIcon, TextField } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import produce from "immer";
import React, { ChangeEvent } from "react";
import { AssessmentOrderBy, AssessmentStatus } from "../../api/type";
import { ReactComponent as StatusIcon } from "../../assets/icons/assessments-status.svg";
import LayoutBox from "../../components/LayoutBox";
import { PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { AssessmentType } from "./SecondSearchHeader";
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

const sortOptions = () => [
  { label: d("Class End Time (New-Old)").t("assess_class_end_time_new_old"), value: AssessmentOrderBy._class_end_time },
  { label: d("Class End Time (Old -New)").t("assess_class_end_time_old_new"), value: AssessmentOrderBy.class_end_time },
  { label: d("Complete Time (New-Old)").t("assess_complete_time_new_old"), value: AssessmentOrderBy._complete_time },
  { label: d("Complete Time (Old-New)").t("assess_complete_time_old_new"), value: AssessmentOrderBy.complete_time },
];
const assessmentStatusOptions = () => [
  { label: d("All").t("assess_filter_all"), value: AssessmentStatus.all },
  { label: d("Complete").t("assess_filter_complete"), value: AssessmentStatus.complete },
  { label: d("Incomplete").t("assess_filter_in_progress"), value: AssessmentStatus.in_progress },
];
export const assessmentTypes = () => {
  return [
    { label: d("Class / Live").t("assess_class_type_class_live"), value: AssessmentType.classLive },
    { label: d("Study").t("assess_study_list_study"), value: AssessmentType.study },
    { label: d("Study / Home Fun").t("assess_class_type_homefun"), value: AssessmentType.homeFun },
  ];
};
export interface ThirdSearchHeaderProps extends AssessmentQueryConditionBaseProps {
  onChangeAssessmentType?: (assessmentType: AssessmentType) => any;
}
export function ThirdSearchHeader(props: ThirdSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const completed_perm = usePermission([
    PermissionType.view_completed_assessments_414,
    PermissionType.view_org_completed_assessments_424,
    PermissionType.view_school_in_progress_assessments_427,
  ]);
  const in_progress_perm = usePermission([
    PermissionType.view_in_progress_assessments_415,
    PermissionType.view_org_in_progress_assessments_425,
    PermissionType.view_school_in_progress_assessments_427,
  ]);
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
    const newValue = produce(value, (draft) => {
      status ? (draft.status = status) : delete draft.status;
    });
    onChange({ ...newValue, page: 1 });
  };
  const orderbyOptions = sortOptions().map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
  const statusOptions = assessmentStatusOptions().map((item) => (
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
              {(completed_perm.view_completed_assessments_414 ||
                completed_perm.view_org_completed_assessments_424 ||
                completed_perm.view_school_in_progress_assessments_427) &&
                (in_progress_perm.view_in_progress_assessments_415 ||
                  in_progress_perm.view_org_in_progress_assessments_425 ||
                  in_progress_perm.view_school_in_progress_assessments_427) && (
                  <TextField
                    size="small"
                    style={{ width: 200 }}
                    onChange={handleChangeStatus}
                    value={value.status || AssessmentStatus.all}
                    label={d("Status").t("assess_filter_column_status")}
                    select
                    SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                  >
                    {statusOptions}
                  </TextField>
                )}
            </Grid>
            <Hidden only={["xs", "sm"]}>
              <Grid item md={6}></Grid>
            </Hidden>
            <Grid container direction="row" justify="flex-end" alignItems="center" item sm={6} xs={6} md={3}>
              <TextField
                size="small"
                style={{ width: 200 }}
                onChange={handleChangeOrder}
                value={value.order_by || AssessmentOrderBy._class_end_time}
                label={d("Sort By").t("assess_sort_by")}
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
  const { value, onChange, onChangeAssessmentType } = props;
  const [anchorStatusEl, setAnchorStatusEl] = React.useState<null | HTMLElement>(null);
  const [anchorSortEl, setAnchorSortEl] = React.useState<null | HTMLElement>(null);
  const [anchorTypeEl, setAnchorTypeEl] = React.useState<null | HTMLElement>(null);
  const showStatus = (event: any) => {
    setAnchorStatusEl(event.currentTarget);
  };
  const showSort = (event: any) => {
    setAnchorSortEl(event.currentTarget);
  };
  const showTypes = (event: any) => {
    setAnchorTypeEl(event.currentTarget);
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
  const handleClickTypebyItem = (event: any, assessmentType: AssessmentType) => {
    setAnchorSortEl(null);
    if (onChangeAssessmentType) {
      onChangeAssessmentType(assessmentType);
    }
  };
  const handleStatusClose = () => {
    setAnchorStatusEl(null);
  };
  const handleSortClose = () => {
    setAnchorSortEl(null);
  };
  const handleTypeClose = () => {
    setAnchorTypeEl(null);
  };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Divider />
          <Grid container alignItems="center" style={{ marginTop: "6px", position: "relative" }}>
            <Grid item sm={9} xs={9}></Grid>
            <Grid container justify="flex-end" alignItems="center" item sm={3} xs={3}>
              <FilterListOutlinedIcon onClick={showTypes} />
              <Menu anchorEl={anchorTypeEl} keepMounted open={Boolean(anchorTypeEl)} onClose={handleTypeClose}>
                {assessmentTypes().map((item, index) => (
                  <MenuItem
                    key={item.label}
                    selected={item.value === AssessmentType.classLive}
                    onClick={(e) => handleClickTypebyItem(e, item.value)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
              <SvgIcon component={StatusIcon} onClick={showStatus} />
              <Menu anchorEl={anchorStatusEl} keepMounted open={Boolean(anchorStatusEl)} onClose={handleStatusClose}>
                {assessmentStatusOptions().map((item, index) => (
                  <MenuItem key={item.label} selected={value.status === item.value} onClick={(e) => handleClickStatusbyItem(e, item.value)}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
              <ImportExportIcon onClick={showSort} />
              <Menu anchorEl={anchorSortEl} keepMounted open={Boolean(anchorSortEl)} onClose={handleSortClose}>
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
