import { Grid, MenuItem, OutlinedInput, Select } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { d } from "../../../locale/LocaleManager";

const useStyle = makeStyles(({ palette }) =>
  createStyles({
    filter: {
      margin: "40px 0",
      fontSize: "20px",
      fontWeight: "bold",
    },
    selector: {
      height: "40px",
      width: "180px",
    },
  })
);
interface IStudentProgressReportFilter {
  studentProgressReportTitle: string;
  durationTime: number;
  setDurationTime: (x: number) => void;
}
export default function StudentProgressReportFilter(props: IStudentProgressReportFilter) {
  const css = useStyle();
  const { studentProgressReportTitle, durationTime, setDurationTime } = props;
  return (
    <Grid container justify={"space-between"} className={css.filter}>
      <Grid item>{studentProgressReportTitle}</Grid>
      <Select
        value={durationTime}
        onChange={(e) => setDurationTime(Number(e.target.value))}
        className={css.selector}
        input={<OutlinedInput />}
      >
        <MenuItem value={4}>{d("4 Weeks").t("report_label_4_weeks")}</MenuItem>
        <MenuItem value={6}>{d("6 Months").t("report_label_6_months")}</MenuItem>
      </Select>
    </Grid>
  );
}
