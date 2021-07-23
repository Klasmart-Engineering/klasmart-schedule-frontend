import { Divider, makeStyles, MenuItem, TextField } from "@material-ui/core";
import React from "react";
import { IWeeks } from ".";
import LayoutBox from "../../components/LayoutBox";
import { t } from "../../locale/LocaleManager";
import { QueryLearningSummaryCondition } from "./types";
const useStyles = makeStyles(({ palette, shadows, breakpoints }) => ({
  selectButton: {
    width: 200,
    height: 40,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
    marginRight: 20,
  },
  ".MuiMenu-paper": {
    maxHeight: "300px",
  },
  divider: {
    marginTop: "30px",
  },
}));

export interface FilterLearningSummaryProps {
  value: QueryLearningSummaryCondition;
  weeks: IWeeks[];
  years: number[];
  defaultWeeksValue: string;
  onChange: (value: QueryLearningSummaryCondition) => void;
}
export function FilterLearningSummary(props: FilterLearningSummaryProps) {
  const css = useStyles();
  const { value, years, weeks, defaultWeeksValue } = props;
  const getYear = () => {
    return years.map((item) => (
      <MenuItem key={item} value={item}>
        {item}
      </MenuItem>
    ));
  };
  const getWeekElement = () => {
    return weeks.map((item) => (
      <MenuItem key={item.value} value={item.value}>
        {item.value}
      </MenuItem>
    ));
  };
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div>
        <div>
          <TextField
            size="small"
            className={css.selectButton}
            // onChange={(e) => onChange()}
            label={t("report_filter_year")}
            value={value.year}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {getYear()}
          </TextField>
          <TextField
            size="small"
            className={css.selectButton}
            label={t("report_filter_week")}
            value={defaultWeeksValue}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {getWeekElement()}
          </TextField>
        </div>
        <div style={{ marginTop: 20 }}>
          <TextField
            size="small"
            className={css.selectButton}
            // onChange={(e) => onChange()}
            label={t("report_filter_school")}
            value={value.year}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {getYear()}
          </TextField>
          <TextField
            size="small"
            className={css.selectButton}
            // onChange={(e) => onChange()}
            label={t("report_filter_class")}
            value={value.year}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {getYear()}
          </TextField>
          <TextField
            size="small"
            className={css.selectButton}
            // onChange={(e) => onChange()}
            label={t("report_filter_teacher")}
            value={value.year}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {getYear()}
          </TextField>
          <TextField
            size="small"
            className={css.selectButton}
            // onChange={(e) => onChange()}
            label={t("report_filter_student")}
            value={value.year}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {getYear()}
          </TextField>
          <TextField
            size="small"
            className={css.selectButton}
            // onChange={(e) => onChange()}
            label={t("report_filter_subject")}
            value={value.year}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {getYear()}
          </TextField>
        </div>
      </div>
      <Divider className={css.divider} />
    </LayoutBox>
  );
}
