import { Box, Hidden, makeStyles, Menu, MenuItem, TextField } from "@material-ui/core";
import { ClassOutlined, LocalBarOutlined } from "@material-ui/icons";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { apiFetchClassByTeacher, MockOptions, MockOptionsItem } from "../../api/extra";
import LayoutBox from "../../components/LayoutBox";
import { QueryCondition, ReportFilter, ReportOrderBy } from "./types";

const useStyles = makeStyles(({ palette, shadows, breakpoints }) => ({
  box: {
    [breakpoints.down(1500)]: {
      height: 120,
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
    marginBottom: 20,
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

const lesson_plans = [
  { id: "1", name: "Lesson 1" },
  { id: "2", name: "Lesson 2" },
  { id: "3", name: "Lesson 3" },
  { id: "4", name: "Lesson 4" },
];

export const filter = () => [
  { name: "All Achieved", id: ReportFilter.all_achieved },
  { name: "Non Achieved", id: ReportFilter.non_achieved },
  { name: "Not Attempted", id: ReportFilter.not_attempted },
  { name: "All ", id: ReportFilter.all },
];
const sortOptions = () => [
  { name: "Ascending", id: ReportOrderBy.ascending },
  { name: "Descending", id: ReportOrderBy.descending },
];
interface OptiopsItem {
  name: string;
  id: string;
}
interface GetMenuItemProps {
  list: OptiopsItem[];
  value: QueryCondition;
  onChangeMenu: (e: React.MouseEvent, value: string, tab: string) => any;
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
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, tab: string) => any;
  onChangeMb: (e: React.MouseEvent, value: string, tab: string) => any;
  mockOptions: MockOptions;
}
export function FilterAchievementReport(props: FilterAchievementReportProps) {
  const { onChange, value, mockOptions, onChangeMb } = props;
  const css = useStyles();
  const getOptions = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));
  const classs = (value.teacher && apiFetchClassByTeacher(mockOptions, value.teacher)) || [];

  const [anchorElOrderBy, setAnchorElOrderBy] = React.useState<null | HTMLElement>(null);
  const [anchorElFilter, setAnchorElFilter] = React.useState<null | HTMLElement>(null);
  const [anchorElTeacher, setAnchorElTeacher] = React.useState<null | HTMLElement>(null);
  const [anchorElClass, setAnchorElClass] = React.useState<null | HTMLElement>(null);
  const [anchorElPlan, setAnchorElPlan] = React.useState<null | HTMLElement>(null);

  const showItem = (event: any, tab: keyof QueryCondition) => {
    if (tab === "teacher") setAnchorElTeacher(event.currentTarget);
    if (tab === "class_search") setAnchorElClass(event.currentTarget);
    if (tab === "lesson_plain_id") setAnchorElPlan(event.currentTarget);
    if (tab === "filter") setAnchorElFilter(event.currentTarget);
    if (tab === "order_by") setAnchorElOrderBy(event.currentTarget);
  };
  const handleClose = (e: any, tab: keyof QueryCondition) => {
    if (tab === "teacher") setAnchorElTeacher(null);
    if (tab === "class_search") setAnchorElClass(null);
    if (tab === "lesson_plain_id") setAnchorElPlan(null);
    if (tab === "filter") setAnchorElFilter(null);
    if (tab === "order_by") setAnchorElOrderBy(null);
  };
  const handleChangeMenu = (e: React.MouseEvent, value: any, tab: string) => {
    if (tab === "teacher") setAnchorElTeacher(null);
    if (tab === "class_search") setAnchorElClass(null);
    if (tab === "lesson_plain_id") setAnchorElPlan(null);
    if (tab === "filter") setAnchorElFilter(null);
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
              onChange={(e) => onChange(e, "teacher")}
              label="Teacher"
              value={value.teacher}
              select
              SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
            >
              {getOptions(mockOptions.teachers)}
            </TextField>
            <TextField
              size="small"
              className={css.selectButton}
              onChange={(e) => onChange(e, "class_search")}
              label="Class"
              value={value.class_search}
              select
              SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
            >
              {getOptions(classs)}
            </TextField>
            <TextField
              size="small"
              className={css.selectButton}
              onChange={(e) => onChange(e, "lesson_plain_id")}
              label="Lesson Plan"
              value={value.lesson_plain_id}
              select
              SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
            >
              {getOptions(lesson_plans)}
            </TextField>
          </Box>
          <Box className={css.boxRight}>
            <TextField
              size="small"
              className={css.selectButton}
              onChange={(e) => onChange(e, "filter")}
              value={value.filter}
              select
              SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
            >
              {getOptions(filter())}
            </TextField>

            <TextField
              size="small"
              className={clsx(css.selectButton, css.lastButton)}
              onChange={(e) => onChange(e, "order_by")}
              label="Displaying Order"
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
            <PersonOutlinedIcon className={css.selectIcon} onClick={(e) => showItem(e, "teacher")} />
            <Menu anchorEl={anchorElTeacher} keepMounted open={Boolean(anchorElTeacher)} onClose={(e) => handleClose(e, "teacher")}>
              <GetMenuItem list={mockOptions.teachers} value={value} onChangeMenu={handleChangeMenu} tab="teacher"></GetMenuItem>
            </Menu>

            <PeopleOutlineOutlinedIcon className={css.selectIcon} onClick={(e) => showItem(e, "class_search")} />
            <Menu anchorEl={anchorElClass} keepMounted open={Boolean(anchorElClass)} onClose={(e) => handleClose(e, "class_search")}>
              <GetMenuItem list={classs} value={value} onChangeMenu={handleChangeMenu} tab="class_search"></GetMenuItem>
            </Menu>

            <ClassOutlined className={css.selectIcon} onClick={(e) => showItem(e, "lesson_plain_id")} />
            <Menu anchorEl={anchorElPlan} keepMounted open={Boolean(anchorElPlan)} onClose={(e) => handleClose(e, "lesson_plain_id")}>
              <GetMenuItem list={lesson_plans} value={value} onChangeMenu={handleChangeMenu} tab="lesson_plain_id"></GetMenuItem>
            </Menu>
          </Box>

          <Box flex={2} display="flex" justifyContent="flex-end">
            <LocalBarOutlined className={css.selectIcon} onClick={(e) => showItem(e, "filter")} />
            <Menu anchorEl={anchorElFilter} keepMounted open={Boolean(anchorElFilter)} onClose={(e) => handleClose(e, "filter")}>
              <GetMenuItem list={filter()} value={value} onChangeMenu={handleChangeMenu} tab="filter"></GetMenuItem>
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
