import { Box, Grid, makeStyles, MenuItem, TextField } from "@material-ui/core";
import React from "react";
import { MockOptionsItem } from "../../api/extra";

const useStyles = makeStyles(({ palette, shadows }) => ({
  selectButton: {
    width: 160,
    marginBotton: 20,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
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

interface FilterAchievementReportProps {
  handleChangefilter: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, tab: string) => any;
}
export function FilterAchievementReport(props: FilterAchievementReportProps) {
  const { handleChangefilter } = props;
  const css = useStyles();
  const GetFilterOptions = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));
  // const orderbyOptions = sortOptions().map((item) => (
  //   <MenuItem key={item.label} value={item.value}>
  //     {item.label}
  //   </MenuItem>
  // ));
  const handleChangeOrder = () => {};

  return (
    <Box>
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <TextField
            style={{ width: 200 }}
            size="small"
            onChange={(e) => handleChangefilter(e, "teacher")}
            label="Teacher"
            value=""
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {GetFilterOptions(teachers)}
          </TextField>
          <TextField
            style={{ width: 200 }}
            size="small"
            onChange={(e) => handleChangefilter(e, "class")}
            label="Class"
            value=""
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {GetFilterOptions(classs)}
          </TextField>
          <TextField
            style={{ width: 200 }}
            size="small"
            onChange={(e) => handleChangefilter(e, "lesson_plan")}
            label="lesson_plan"
            value=""
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {GetFilterOptions(lesson_plans)}
          </TextField>
        </Grid>
        <Grid direction="row" justify="flex-end" alignItems="center" item>
          <TextField
            size="small"
            className={css.selectButton}
            onChange={handleChangeOrder}
            label="Displaying Order"
            value=""
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {/* {orderbyOptions} */}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
}
