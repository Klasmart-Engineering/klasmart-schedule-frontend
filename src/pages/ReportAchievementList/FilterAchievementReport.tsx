import { Box, Hidden, makeStyles, Menu, MenuItem, TextField } from "@material-ui/core";
import { ClassOutlined, LocalBarOutlined } from "@material-ui/icons";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import { GetReportMockOptionsResponse } from "@reducers/report";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { MockOptionsItem } from "../../api/extra";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { ICacheData } from "../../services/permissionCahceService";
import { QueryCondition, ReportFilter, ReportOrderBy } from "./types";

const useStyles = makeStyles(({ palette, shadows, breakpoints }) => ({
  box: {
    [breakpoints.down(1500)]: {
      height: 100,
    },
  },
  boxRight: {
    position: "absolute",
    right: 0,
    [breakpoints.down(1500)]: {
      top: 60,
      left: 0,
    },
    [breakpoints.up(1500)]: {
      top: 0,
    },
  },
  selectButton: {
    width: 200,
    height: 40,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
    marginRight: 20,
  },
  lastButton: {
    marginRight: 0,
  },
  selectIcon: {
    marginRight: 20,
  },
  selectIconDisabled: {
    color: palette.grey[500],
  },
}));

export const statusList = () => [
  { name: d("Achieved").t("report_label_achieved"), id: ReportFilter.achieved },
  { name: d("Not Achieved").t("report_label_not_achieved"), id: ReportFilter.not_achieved },
  { name: d("Not Attempted").t("report_label_not_attempted"), id: ReportFilter.not_attempted },
  { name: d("All").t("report_label_all"), id: ReportFilter.all },
];
const sortOptions = () => [
  { name: d("Ascending").t("report_label_ascending"), id: ReportOrderBy.ascending },
  { name: d("Descending").t("report_label_descending"), id: ReportOrderBy.descending },
];

interface GetMenuItemProps {
  list: MockOptionsItem[];
  value: QueryCondition;
  onChangeMenu: (e: React.MouseEvent, value: string, tab: keyof QueryCondition) => any;
  tab: keyof QueryCondition;
}
const GetMenuItem = forwardRef<React.RefObject<HTMLElement>, GetMenuItemProps>((props, ref) => {
  const { list, value, onChangeMenu, tab } = props;
  return (
    <div {...ref}>
      {" "}
      {list.map((item) => (
        <MenuItem key={item.id} selected={value[tab] === item.id} onClick={(e) => onChangeMenu(e, item.id as string, tab)}>
          {item.name}
        </MenuItem>
      ))}
    </div>
  );
});

export interface FilterAchievementReportProps {
  value: QueryCondition;
  onChange: (value: string, tab: keyof QueryCondition) => any;
  reportMockOptions: GetReportMockOptionsResponse;
  perm: ICacheData;
}
export function FilterAchievementReport(props: FilterAchievementReportProps) {
  const { onChange, value, reportMockOptions, perm } = props;
  const css = useStyles();
  const getOptions = (list: MockOptionsItem[]) =>
    list &&
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));
  const classs = reportMockOptions.classList || [];
  console.log("class=", reportMockOptions);
  const teachers = reportMockOptions.teacherList || [];
  const planIsDisabled = classs.length <= 0 || reportMockOptions.lessonPlanList.length <= 0;

  const [anchorElOrderBy, setAnchorElOrderBy] = React.useState<null | HTMLElement>(null);
  const [anchorElStatus, setAnchorElStatus] = React.useState<null | HTMLElement>(null);
  const [anchorElTeacher, setAnchorElTeacher] = React.useState<null | HTMLElement>(null);
  const [anchorElClass, setAnchorElClass] = React.useState<null | HTMLElement>(null);
  const [anchorElPlan, setAnchorElPlan] = React.useState<null | HTMLElement>(null);

  const showItem = (event: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id" && classs.length > 0) setAnchorElTeacher(event.currentTarget);
    if (tab === "class_id" && classs.length > 0) setAnchorElClass(event.currentTarget);
    if (tab === "lesson_plan_id" && classs.length > 0 && reportMockOptions.lessonPlanList.length > 0) setAnchorElPlan(event.currentTarget);
    if (tab === "status") setAnchorElStatus(event.currentTarget);
    if (tab === "sort_by") setAnchorElOrderBy(event.currentTarget);
  };
  const handleClose = (e: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id") setAnchorElTeacher(null);
    if (tab === "class_id") setAnchorElClass(null);
    if (tab === "lesson_plan_id") setAnchorElPlan(null);
    if (tab === "status") setAnchorElStatus(null);
    if (tab === "sort_by") setAnchorElOrderBy(null);
  };
  const handleChangeMenu = (e: React.MouseEvent, value: any, tab: keyof QueryCondition) => {
    handleClose(e, tab);
    onChange(value, tab);
  };

  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      {(perm.view_reports_610 || perm.view_my_reports_614 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612) && (
        <Hidden smDown>
          <Box position="relative" className={css.box}>
            <Box>
              {(perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612) && (
                <TextField
                  size="small"
                  className={css.selectButton}
                  onChange={(e) => onChange(e.target.value, "teacher_id")}
                  label={d("Teacher").t("report_label_teacher")}
                  value={value.teacher_id}
                  select
                  disabled={teachers.length <= 0}
                  SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                >
                  {getOptions(reportMockOptions.teacherList)}
                </TextField>
              )}
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => onChange(e.target.value, "class_id")}
                label={d("Class").t("report_label_class")}
                value={value.class_id}
                select
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                disabled={classs.length <= 0}
              >
                {getOptions(reportMockOptions.classList)}
              </TextField>
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => onChange(e.target.value, "lesson_plan_id")}
                label={d("Lesson Plan").t("report_label_lesson_plan")}
                value={value.lesson_plan_id}
                select
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                disabled={planIsDisabled}
              >
                {getOptions(reportMockOptions.lessonPlanList)}
              </TextField>
            </Box>
            <Box className={css.boxRight}>
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => onChange(e.target.value, "status")}
                value={value.status}
                select
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              >
                {getOptions(statusList())}
              </TextField>

              <TextField
                size="small"
                className={clsx(css.selectButton, css.lastButton)}
                onChange={(e) => onChange(e.target.value, "sort_by")}
                label={d("Sort By Outcomes").t("report_label_sort_by")}
                value={value.sort_by}
                select
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              >
                {getOptions(sortOptions())}
              </TextField>
            </Box>
          </Box>
        </Hidden>
      )}
      {(perm.view_reports_610 || perm.view_my_reports_614 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612) && (
        <Hidden mdUp>
          <Box display="flex">
            <Box flex={3}>
              {(perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612) && (
                <PersonOutlinedIcon
                  fontSize="large"
                  className={clsx(css.selectIcon, teachers.length <= 0 && css.selectIconDisabled)}
                  onClick={(e) => showItem(e, "teacher_id")}
                />
              )}
              <Menu anchorEl={anchorElTeacher} keepMounted open={Boolean(anchorElTeacher)} onClose={(e) => handleClose(e, "teacher_id")}>
                <GetMenuItem
                  list={reportMockOptions.teacherList}
                  value={value}
                  onChangeMenu={handleChangeMenu}
                  tab="teacher_id"
                ></GetMenuItem>
              </Menu>

              <PeopleOutlineOutlinedIcon
                fontSize="large"
                className={clsx(css.selectIcon, classs.length <= 0 && css.selectIconDisabled)}
                onClick={(e) => showItem(e, "class_id")}
              />
              <Menu anchorEl={anchorElClass} keepMounted open={Boolean(anchorElClass)} onClose={(e) => handleClose(e, "class_id")}>
                <GetMenuItem list={reportMockOptions.classList} value={value} onChangeMenu={handleChangeMenu} tab="class_id"></GetMenuItem>
              </Menu>
              <ClassOutlined
                fontSize="large"
                className={clsx(css.selectIcon, planIsDisabled && css.selectIconDisabled)}
                onClick={(e) => showItem(e, "lesson_plan_id")}
              />
              <Menu anchorEl={anchorElPlan} keepMounted open={Boolean(anchorElPlan)} onClose={(e) => handleClose(e, "lesson_plan_id")}>
                <GetMenuItem
                  list={reportMockOptions.lessonPlanList}
                  value={value}
                  onChangeMenu={handleChangeMenu}
                  tab="lesson_plan_id"
                ></GetMenuItem>
              </Menu>
            </Box>
            <Box flex={2} display="flex" justifyContent="flex-end">
              <LocalBarOutlined fontSize="large" className={css.selectIcon} onClick={(e) => showItem(e, "status")} />
              <Menu anchorEl={anchorElStatus} keepMounted open={Boolean(anchorElStatus)} onClose={(e) => handleClose(e, "status")}>
                <GetMenuItem list={statusList()} value={value} onChangeMenu={handleChangeMenu} tab="status"></GetMenuItem>
              </Menu>

              <ImportExportIcon fontSize="large" onClick={(e) => showItem(e, "sort_by")} />
              <Menu anchorEl={anchorElOrderBy} keepMounted open={Boolean(anchorElOrderBy)} onClose={(e) => handleClose(e, "sort_by")}>
                <GetMenuItem list={sortOptions()} value={value} onChangeMenu={handleChangeMenu} tab="sort_by"></GetMenuItem>
              </Menu>
            </Box>
          </Box>
        </Hidden>
      )}
    </LayoutBox>
  );
}
