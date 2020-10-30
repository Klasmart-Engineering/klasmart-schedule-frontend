import { Box, Hidden, makeStyles, Menu, MenuItem, TextField } from "@material-ui/core";
import { ClassOutlined, LocalBarOutlined } from "@material-ui/icons";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { apiFetchClassByTeacher, MockOptions, MockOptionsItem } from "../../api/extra";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
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
    marginRight: 10,
  },
}));

// const lesson_plans = [
//   { id: "1", name: "Lesson 1" },
//   { id: "2", name: "Lesson 2" },
//   { id: "3", name: "Lesson 3" },
//   { id: "4", name: "Lesson 4" },
// ];

export const filter = () => [
  { name: d("Achieved").t("report_label_achieved"), id: ReportFilter.achieved },
  { name: d("Not Achieved").t("report_label_not_achieved"), id: ReportFilter.not_achieved },
  { name: d("Not Attempted").t("report_label_not_attempted"), id: ReportFilter.not_attempted },
  { name: d("All").t("report_label_all"), id: ReportFilter.all },
];
const sortOptions = () => [
  { name: d("Ascending").t("report_label_ascending"), id: ReportOrderBy.ascending },
  { name: d("Descending").t("report_label_descending"), id: ReportOrderBy.descending },
];
interface OptiopsItem {
  name: string;
  id: string;
}
interface GetMenuItemProps {
  list: OptiopsItem[];
  value: QueryCondition;
  onChangeMenu: (e: React.MouseEvent, value: string, tab: keyof QueryCondition) => any;
  tab: keyof QueryCondition;
}
const GetMenuItem = forwardRef<React.RefObject<HTMLElement>, GetMenuItemProps>((props, ref) => {
  const { list, value, onChangeMenu, tab } = props;
  return (
    <>
      {" "}
      {list.map((item) => (
        <MenuItem key={item.id} selected={value[tab] === item.id} onClick={(e) => onChangeMenu(e, item.id, tab)}>
          {item.name}
        </MenuItem>
      ))}
    </>
  );
});
export interface FilterAchievementReportProps {
  value: QueryCondition;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, tab: keyof QueryCondition) => any;
  onChangeMb: (e: React.MouseEvent, value: string, tab: keyof QueryCondition) => any;
  mockOptions: MockOptions;
  lessonPlanList: MockOptionsItem[];
}
export function FilterAchievementReport(props: FilterAchievementReportProps) {
  const { onChange, value, mockOptions, onChangeMb, lessonPlanList } = props;
  const css = useStyles();
  const getOptions = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));
  const classs = (value.teacher_id && apiFetchClassByTeacher(mockOptions, value.teacher_id)) || [];

  const [anchorElOrderBy, setAnchorElOrderBy] = React.useState<null | HTMLElement>(null);
  const [anchorElFilter, setAnchorElFilter] = React.useState<null | HTMLElement>(null);
  const [anchorElTeacher, setAnchorElTeacher] = React.useState<null | HTMLElement>(null);
  const [anchorElClass, setAnchorElClass] = React.useState<null | HTMLElement>(null);
  const [anchorElPlan, setAnchorElPlan] = React.useState<null | HTMLElement>(null);

  const showItem = (event: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id") setAnchorElTeacher(event.currentTarget);
    if (tab === "class_id" && classs.length > 0) setAnchorElClass(event.currentTarget);
    if (tab === "lesson_plan_id" && (classs.length > 0 || lessonPlanList.length > 0)) setAnchorElPlan(event.currentTarget);
    if (tab === "status") setAnchorElFilter(event.currentTarget);
    if (tab === "order_by") setAnchorElOrderBy(event.currentTarget);
  };
  const handleClose = (e: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id") setAnchorElTeacher(null);
    if (tab === "class_id") setAnchorElClass(null);
    if (tab === "lesson_plan_id") setAnchorElPlan(null);
    if (tab === "status") setAnchorElFilter(null);
    if (tab === "order_by") setAnchorElOrderBy(null);
  };
  const handleChangeMenu = (e: React.MouseEvent, value: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id") setAnchorElTeacher(null);
    if (tab === "class_id") setAnchorElClass(null);
    if (tab === "lesson_plan_id") setAnchorElPlan(null);
    if (tab === "status") setAnchorElFilter(null);
    if (tab === "order_by") setAnchorElOrderBy(null);
    onChangeMb(e, value, tab);
  };
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Hidden smDown>
        <Box position="relative" className={css.box}>
          <Box>
            <TextField
              size="small"
              className={css.selectButton}
              onChange={(e) => onChange(e, "teacher_id")}
              label={d("Teacher").t("report_label_teacher")}
              value={value.teacher_id}
              select
              SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
            >
              {getOptions(mockOptions.teachers)}
            </TextField>
            <TextField
              size="small"
              className={css.selectButton}
              onChange={(e) => onChange(e, "class_id")}
              label={d("Class").t("report_label_class")}
              value={value.class_id}
              select
              SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              disabled={classs.length <= 0}
            >
              {getOptions(classs)}
            </TextField>
            <TextField
              size="small"
              className={css.selectButton}
              onChange={(e) => onChange(e, "lesson_plan_id")}
              label={d("Lesson Plan").t("report_label_lesson_plan")}
              value={value.lesson_plan_id}
              select
              SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              disabled={classs.length <= 0 || lessonPlanList.length <= 0}
            >
              {getOptions(lessonPlanList)}
            </TextField>
          </Box>
          <Box className={css.boxRight}>
            <TextField
              size="small"
              className={css.selectButton}
              onChange={(e) => onChange(e, "status")}
              value={value.status}
              select
              SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
            >
              {getOptions(filter())}
            </TextField>

            <TextField
              size="small"
              className={clsx(css.selectButton, css.lastButton)}
              onChange={(e) => onChange(e, "order_by")}
              label={d("Sort By").t("report_label_sort_by")}
              value={value.order_by}
              select
              SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
            >
              {getOptions(sortOptions())}
            </TextField>
          </Box>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box display="flex">
          <Box flex={3}>
            <PersonOutlinedIcon className={css.selectIcon} onClick={(e) => showItem(e, "teacher_id")} />
            <Menu anchorEl={anchorElTeacher} keepMounted open={Boolean(anchorElTeacher)} onClose={(e) => handleClose(e, "teacher_id")}>
              <GetMenuItem list={mockOptions.teachers} value={value} onChangeMenu={handleChangeMenu} tab="teacher_id"></GetMenuItem>
            </Menu>

            <PeopleOutlineOutlinedIcon className={css.selectIcon} onClick={(e) => showItem(e, "class_id")} />
            <Menu anchorEl={anchorElClass} keepMounted open={Boolean(anchorElClass)} onClose={(e) => handleClose(e, "class_id")}>
              <GetMenuItem list={classs} value={value} onChangeMenu={handleChangeMenu} tab="class_id"></GetMenuItem>
            </Menu>

            <ClassOutlined className={css.selectIcon} onClick={(e) => showItem(e, "lesson_plan_id")} />
            <Menu anchorEl={anchorElPlan} keepMounted open={Boolean(anchorElPlan)} onClose={(e) => handleClose(e, "lesson_plan_id")}>
              <GetMenuItem list={lessonPlanList} value={value} onChangeMenu={handleChangeMenu} tab="lesson_plan_id"></GetMenuItem>
            </Menu>
          </Box>

          <Box flex={2} display="flex" justifyContent="flex-end">
            <LocalBarOutlined className={css.selectIcon} onClick={(e) => showItem(e, "status")} />
            <Menu anchorEl={anchorElFilter} keepMounted open={Boolean(anchorElFilter)} onClose={(e) => handleClose(e, "status")}>
              <GetMenuItem list={filter()} value={value} onChangeMenu={handleChangeMenu} tab="status"></GetMenuItem>
            </Menu>

            <ImportExportIcon onClick={(e) => showItem(e, "order_by")} />
            <Menu anchorEl={anchorElOrderBy} keepMounted open={Boolean(anchorElOrderBy)} onClose={(e) => handleClose(e, "order_by")}>
              <GetMenuItem list={sortOptions()} value={value} onChangeMenu={handleChangeMenu} tab="order_by"></GetMenuItem>
            </Menu>
          </Box>
        </Box>
      </Hidden>
    </LayoutBox>
  );
}
