import { Divider, Grid, Hidden, makeStyles, Menu, MenuItem, SvgIcon } from "@material-ui/core";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import produce from "immer";
import React from "react";
import { HomeFunAssessmentOrderBy, HomeFunAssessmentStatus, OrderByAssessmentList } from "../../api/type";
import { ReactComponent as StatusIcon } from "../../assets/icons/assessments-status.svg";
import { AssessmentTypeValues } from "../../components/AssessmentType";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { assessmentTypes, DropdownList, options } from "./SecondSearchHeader";
import { AssessmentQueryCondition, AssessmentQueryConditionBaseProps, AssessmentStatus } from "./types";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 20 + 10,
  },
}));

const statusOptions = () => [
  { label: d("All").t("assess_filter_all"), value: AssessmentStatus.all },
  { label: d("Complete").t("assess_filter_complete"), value: AssessmentStatus.complete },
  { label: d("Incomplete").t("assess_filter_in_progress"), value: AssessmentStatus.in_progress },
];
const sortOptions = (assessment_type: AssessmentQueryCondition["assessment_type"]) => {
  const unchangedOptions = [
    { label: d("Complete Time (New-Old)").t("assess_complete_time_new_old"), value: OrderByAssessmentList._complete_at },
    { label: d("Complete Time (Old-New)").t("assess_complete_time_old_new"), value: OrderByAssessmentList.complete_at },
  ];
  let changeingOptions: options[] = [];
  if (assessment_type === AssessmentTypeValues.class || assessment_type === AssessmentTypeValues.live) {
    changeingOptions = [
      { label: d("Class End Time (New-Old)").t("assess_class_end_time_new_old"), value: OrderByAssessmentList._class_end_time },
      { label: d("Class End Time (Old -New)").t("assess_class_end_time_old_new"), value: OrderByAssessmentList.class_end_time },
    ];
  }
  if (assessment_type === AssessmentTypeValues.study || assessment_type === AssessmentTypeValues.review) {
    changeingOptions = [
      { label: d("Created On (New-Old)").t("assess_label_created_on_newtoold"), value: OrderByAssessmentList._create_at },
      { label: d("Created On (Old-New)").t("assess_label_created_on_oldtonew"), value: OrderByAssessmentList.create_at },
    ];
  }
  if (assessment_type === AssessmentTypeValues.homeFun) {
    changeingOptions = [
      { label: d("Submit Time (New-Old)").t("assess_submit_new_old"), value: HomeFunAssessmentOrderBy.submit_at },
      { label: d("Submit Time (Old-New)").t("assess_submit_old_new"), value: HomeFunAssessmentOrderBy._submit_at },
    ];
  }
  return [...changeingOptions, ...unchangedOptions];
};

export interface ThirdSearchHeaderProps extends AssessmentQueryConditionBaseProps {
  onChangeAssessmentType?: (assessmentType: AssessmentTypeValues) => void;
}
export function ThirdSearchHeader(props: ThirdSearchHeaderProps) {
  const { value, onChange } = props;
  const handleChangeStatus = (status: string) => {
    const _status = status as HomeFunAssessmentStatus;
    const newValue = produce(value, (draft) => {
      _status ? (draft.status = _status) : delete draft.status;
    });
    onChange({ ...newValue, page: 1 });
  };
  const handleChangeOrder = (order_by: string) => {
    const _order_by = order_by as OrderByAssessmentList;
    const newValue = produce(value, (draft) => {
      _order_by ? (draft.order_by = _order_by) : delete draft.order_by;
    });
    onChange({ ...newValue, page: 1 });
  };
  const defaultOrderby = sortOptions(value.assessment_type)[0].value!;
  return (
    <div style={{ marginBottom: 20 }}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Divider />
          <Grid container spacing={3} alignItems="center" style={{ marginTop: "6px" }}>
            <Grid item md={6} lg={6}>
              <DropdownList
                style={{ width: 160 }}
                label={d("Status").t("assess_filter_column_status")}
                value={value.status || HomeFunAssessmentStatus.all}
                list={statusOptions()}
                onChange={handleChangeStatus}
              />
            </Grid>
            <Grid container direction="row" justifyContent="flex-end" alignItems="center" item md={6} lg={6}>
              <DropdownList
                label={d("Sort By").t("assess_label_sort_by")}
                value={value.order_by ? value.order_by : defaultOrderby}
                list={sortOptions(value.assessment_type)}
                onChange={handleChangeOrder}
              />
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

export function ThirdSearchHeaderMb(props: ThirdSearchHeaderProps) {
  const css = useStyles();
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
  const handleStatusClose = () => {
    setAnchorStatusEl(null);
  };
  const handleSortClose = () => {
    setAnchorSortEl(null);
  };
  const handleTypeClose = () => {
    setAnchorTypeEl(null);
  };
  const handleClickTypebyItem = (event: any, assessmentType: AssessmentTypeValues) => {
    setAnchorSortEl(null);
    if (onChangeAssessmentType) {
      onChangeAssessmentType(assessmentType);
    }
  };
  const handleClickStatusbyItem = (event: any, status: AssessmentStatus | undefined) => {
    setAnchorStatusEl(null);
    const newValue = produce(value, (draft) => {
      status ? (draft.status = status) : delete draft.status;
    });
    onChange({ ...newValue, page: 1 });
  };
  const handleClickOrderbyItem = (event: any, order_by?: string) => {
    setAnchorSortEl(null);
    onChange(
      produce(value, (draft) => {
        order_by ? (draft.order_by = order_by as OrderByAssessmentList) : delete draft.order_by;
      })
    );
  };
  return (
    <div className={css.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Divider />
          <Grid container alignItems="center" style={{ marginTop: "6px", position: "relative" }}>
            <Grid item sm={10} xs={10}></Grid>
            <Grid container justifyContent="flex-end" alignItems="center" item sm={2} xs={2}>
              <FilterListOutlinedIcon onClick={showTypes} />
              <Menu anchorEl={anchorTypeEl} keepMounted open={Boolean(anchorTypeEl)} onClose={handleTypeClose}>
                {assessmentTypes().map((item, index) => (
                  <MenuItem
                    key={item.label}
                    selected={item.value === value.assessment_type}
                    onClick={(e) => handleClickTypebyItem(e, item.value)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
              <SvgIcon component={StatusIcon} onClick={showStatus} />
              <Menu anchorEl={anchorStatusEl} keepMounted open={Boolean(anchorStatusEl)} onClose={handleStatusClose}>
                {statusOptions().map((item, index) => (
                  <MenuItem key={item.label} selected={value.status === item.value} onClick={(e) => handleClickStatusbyItem(e, item.value)}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
              <ImportExportIcon onClick={showSort} />
              <Menu anchorEl={anchorSortEl} keepMounted open={Boolean(anchorSortEl)} onClose={handleSortClose}>
                {sortOptions(value.assessment_type).map((item, index) => (
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
