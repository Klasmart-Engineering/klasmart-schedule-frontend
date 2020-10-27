import { Box, makeStyles, MenuItem, TextField } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { MockOptionsItem } from "../../api/extra";
import LayoutBox from "../../components/LayoutBox";
import { sortOptions } from "../MyContentList/ThirdSearchHeader";
import { QueryCondition } from "./types";

const useStyles = makeStyles(({ palette, shadows }) => ({
  selectButton: {
    width: 200,
    marginBotton: 20,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
    marginRight: 20,
  },
  lastButton: {
    marginRight: 0,
  },
}));

const teachers = [
  { id: "1", name: "Teacher1" },
  { id: "2", name: "Teacher2" },
  { id: "3", name: "Teacher3" },
  { id: "4", name: "Teacher4" },
];
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

export interface FilterAchievementReportProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, tab: string) => any;
  lesson_plan?: string;
  filter?: string;
  value: QueryCondition;
}
export function FilterAchievementReport(props: FilterAchievementReportProps) {
  const { onChange, value } = props;
  const css = useStyles();
  const GetFilterOptions = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));
  const orderbyOptions = sortOptions().map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Box display="flex">
        <Box flex={2}>
          <TextField
            style={{ width: 200 }}
            size="small"
            className={css.selectButton}
            onChange={(e) => onChange(e, "teacher")}
            label="Teacher"
            value={value.teacher}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {GetFilterOptions(teachers)}
          </TextField>
          <TextField
            style={{ width: 200 }}
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
            style={{ width: 200 }}
            size="small"
            className={css.selectButton}
            onChange={(e) => onChange(e, "lesson_plan")}
            label="Lesson Plan"
            value={value.lesson_plan}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {GetFilterOptions(lesson_plans)}
          </TextField>
        </Box>
        <Box flex={1} display="flex" justifyContent="flex-end">
          <TextField
            size="small"
            className={css.selectButton}
            onChange={(e) => onChange(e, "filter")}
            value={value.filter}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            <MenuItem value="all_achieved">All Achieved</MenuItem>
            <MenuItem value="non_achieved">Non Achieved</MenuItem>
            <MenuItem value="not_attempted">Not Attempted</MenuItem>
            <MenuItem value="all">All</MenuItem>
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
            {orderbyOptions}
          </TextField>
        </Box>
      </Box>
    </LayoutBox>
  );
}
