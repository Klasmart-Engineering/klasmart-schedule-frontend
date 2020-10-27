import { Box, Hidden, makeStyles, Menu, MenuItem, TextField } from "@material-ui/core";
import { ClassOutlined, LocalBarOutlined } from "@material-ui/icons";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import clsx from "clsx";
import React from "react";
import { MockOptions, MockOptionsItem } from "../../api/extra";
import { OrderBy } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { QueryCondition, ReportFilter } from "./types";

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

const classs = [
  { id: "1", name: "Class1" },
  { id: "2", name: "Class2" },
  { id: "3", name: "Class3" },
  { id: "4", name: "Class4" },
];
const lesson_plans = [
  { id: "1", name: "Lesson 1" },
  { id: "2", name: "Lesson 2" },
  { id: "3", name: "Lesson 3" },
  { id: "4", name: "Lesson 4" },
];

export const filter = () => [
  { label: "All Achieved", value: ReportFilter.all_achieved },
  { label: "Non Achieved", value: ReportFilter.non_achieved },
  { label: "Not Attempted", value: ReportFilter.not_attempted },
  { label: "All ", value: ReportFilter.all },
];
const sortOptions = () => [
  { label: d("Content Name(A-Z)").t("library_label_content_name_atoz"), value: OrderBy.content_name },
  { label: d("Content Name(Z-A)").t("library_label_content_name_ztoa"), value: OrderBy._content_name },
  { label: d("Created On(New-Old)").t("library_label_created_on_newtoold"), value: OrderBy._updated_at },
  { label: d("Created On(Old-New)").t("library_label_created_on_oldtonew"), value: OrderBy.updated_at },
];
interface OptiopsItem {
  label: string;
  value: string;
}
export interface FilterAchievementReportProps {
  value: QueryCondition;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, tab: string) => any;
  onChangeMb: (e: React.MouseEvent, value: string, tab: string) => any;
  mockOptions: MockOptions;
}
export function FilterAchievementReport(props: FilterAchievementReportProps) {
  const { onChange, value, mockOptions, onChangeMb } = props;
  const css = useStyles();
  const GetFilterOptions = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));
  const getOptions = (list: OptiopsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.label} value={item.value}>
        {item.label}
      </MenuItem>
    ));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElLeft, setAnchorElLeft] = React.useState<null | HTMLElement>(null);
  const handleClose = () => {
    setAnchorElLeft(null);
  };
  const showSort = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const showFilter = (event: any) => {
    setAnchorElLeft(event.currentTarget);
  };

  const handleChangeMenu = (e: React.MouseEvent, value: any, tab: string) => {
    setAnchorEl(null);
    onChangeMb(e, value, tab);
  };
  const handleSortClose = () => {
    setAnchorEl(null);
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
              {GetFilterOptions(mockOptions.teachers)}
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
              {GetFilterOptions(classs)}
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
              {GetFilterOptions(lesson_plans)}
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
            <PersonOutlinedIcon className={css.selectIcon} />
            <PeopleOutlineOutlinedIcon className={css.selectIcon} />
            <ClassOutlined className={css.selectIcon} />
          </Box>
          <Box flex={2} display="flex" justifyContent="flex-end">
            <LocalBarOutlined className={css.selectIcon} onClick={showFilter} />
            <Menu anchorEl={anchorElLeft} keepMounted open={Boolean(anchorElLeft)} onClose={handleClose}>
              {filter().map((item) => (
                <MenuItem
                  key={item.label}
                  selected={value.filter === item.value}
                  onClick={(e) => handleChangeMenu(e, item.value, "filter")}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
            <ImportExportIcon onClick={showSort} />
            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleSortClose}>
              {sortOptions().map((item) => (
                <MenuItem
                  key={item.label}
                  selected={value.order_by === item.value}
                  onClick={(e) => handleChangeMenu(e, item.value, "order_by")}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      </Hidden>
    </LayoutBox>
  );
}
