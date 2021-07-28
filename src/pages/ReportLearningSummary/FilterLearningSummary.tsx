import { Divider, makeStyles, MenuItem, TextField } from "@material-ui/core";
import produce from "immer";
import React, { ChangeEvent } from "react";
import { IWeeks } from ".";
import { User } from "../../api/api-ko-schema.auto";
import { ExternalSubject } from "../../api/api.auto";
import LayoutBox from "../../components/LayoutBox";
import { t } from "../../locale/LocaleManager";
import { QueryLearningSummaryConditionBaseProps } from "./types";
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
export interface LearningSummartOptionsProps {
  year: number[];
  week: IWeeks[];
  studentList: Pick<User, "user_id" | "user_name">[];
  subjectList: ExternalSubject[];
}
export interface FilterLearningSummaryProps extends QueryLearningSummaryConditionBaseProps {
  defaultWeeksValue: string;
  learningSummartOptions: LearningSummartOptionsProps;
}
export function FilterLearningSummary(props: FilterLearningSummaryProps) {
  const css = useStyles();
  // const perm = usePermission([
  //   PermissionType.report_learning_summary_org_652,
  //   PermissionType.report_learning_summary_school_651,
  //   PermissionType.report_learning_summary_teacher_650,
  //   PermissionType.report_learning_summary_student_649,
  // ]);
  // console.log(perm)
  const { value, defaultWeeksValue, learningSummartOptions, onChange } = props;
  const { year, week, studentList, subjectList } = learningSummartOptions;
  const getYear = () => {
    return year.map((item) => (
      <MenuItem key={item} value={item}>
        {item}
      </MenuItem>
    ));
  };
  const getWeekElement = () => {
    return week.map((item) => (
      <MenuItem key={item.value} value={item.value}>
        {item.value}
      </MenuItem>
    ));
  };
  const getStudent = () => {
    return studentList.map((item) => (
      <MenuItem key={item.user_id} value={item.user_id}>
        {item.user_name}
      </MenuItem>
    ));
  };
  const getSubject = () => {
    return subjectList.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));
  };
  const handleChangeYear = (event: ChangeEvent<HTMLInputElement>) => {
    const year = Number(event.target.value);
    onChange(
      produce(value, (draft) => {
        draft.year = year;
      })
    );
  };
  const handleChangeWeek = (event: ChangeEvent<HTMLInputElement>) => {
    const week = event.target.value;
    const [s, e] = week.split("~");
    const week_start = new Date(`${value.year}.${s}`).getTime() / 1000;
    const week_end = new Date(`${value.year}.${e}`).getTime() / 1000;
    console.log(`${value.year}.${s}`, week_start);
    onChange(
      produce(value, (draft) => {
        draft.week_start = week_start;
        draft.week_end = week_end;
      })
    );
  };
  const handleChangeStudent = (event: ChangeEvent<HTMLInputElement>) => {
    const student_id = event.target.value;
    onChange(
      produce(value, (draft) => {
        draft.student_id = student_id;
      })
    );
  };
  const handleChangeSubject = (event: ChangeEvent<HTMLInputElement>) => {
    const subject_id = event.target.value;
    onChange(
      produce(value, (draft) => {
        draft.subject_id = subject_id;
      })
    );
  };
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div>
        <div>
          <TextField
            size="small"
            className={css.selectButton}
            onChange={handleChangeYear}
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
            onChange={handleChangeWeek}
            label={t("report_filter_week")}
            value={defaultWeeksValue}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {getWeekElement()}
          </TextField>
        </div>
        <div style={{ marginTop: 20 }}>
          {/* <TextField
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
          </TextField> */}
          <TextField
            size="small"
            className={css.selectButton}
            onChange={handleChangeStudent}
            label={t("report_filter_student")}
            value={value.student_id}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {getStudent()}
          </TextField>
          <TextField
            size="small"
            className={css.selectButton}
            onChange={handleChangeSubject}
            label={t("report_filter_subject")}
            value={value.subject_id}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {getSubject()}
          </TextField>
        </div>
      </div>
      <Divider className={css.divider} />
    </LayoutBox>
  );
}
