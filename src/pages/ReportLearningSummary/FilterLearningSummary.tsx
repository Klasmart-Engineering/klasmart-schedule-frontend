import { Divider, makeStyles, MenuItem, TextField } from "@material-ui/core";
// import produce from "immer";
import React, { ChangeEvent } from "react";
import { IWeeks } from ".";
import { User } from "../../api/api-ko-schema.auto";
import { ExternalSubject } from "../../api/api.auto";
import PermissionType from "../../api/PermissionType";
import LayoutBox from "../../components/LayoutBox";
import { usePermission } from "../../hooks/usePermission";
import { t } from "../../locale/LocaleManager";
import { IResultLearningSummary } from "../../reducers/report";
import { ArrProps, QueryLearningSummaryCondition, QueryLearningSummaryConditionBaseProps } from "./types";
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
  summaryReportOptions: IResultLearningSummary;
  onChangeYearFilter: (year: number) => any;
  onChangeWeekFilter: (week_start: number, week_end: number) => any;
  onChangeFilter: (value: string, tab: keyof QueryLearningSummaryCondition) => any;
}
export function FilterLearningSummary(props: FilterLearningSummaryProps) {
  const css = useStyles();
  const perm = usePermission([
    PermissionType.report_learning_summary_org_652,
    PermissionType.report_learning_summary_school_651,
    PermissionType.report_learning_summary_teacher_650,
    PermissionType.report_learning_summary_student_649,
  ]);
  const isOrg = perm.report_learning_summary_org_652;
  const isSchoolAdmin = perm.report_learning_summary_school_651;
  const isTeacher = perm.report_learning_summary_teacher_650;
  // const isStudent = perm.report_learning_summary_student_649;
  const { value, defaultWeeksValue, summaryReportOptions, onChangeYearFilter, onChangeWeekFilter, onChangeFilter } = props;
  const { years, weeks, schools, classes, students, subjects } = summaryReportOptions;
  // const studentList = students?.slice().sort(sortByStudentName("name"));

  const getYear = () => {
    return (
      years &&
      years.map((item) => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))
    );
  };
  const getWeekElement = () => {
    return (
      weeks &&
      weeks.map((item) => (
        <MenuItem key={item.week_start} value={item.value}>
          {item.value}
        </MenuItem>
      ))
    );
  };
  const getInfos = (arr: ArrProps[]) => {
    return (
      arr &&
      arr.map((item) => (
        <MenuItem key={item.id} value={item.id}>
          {item.name}
        </MenuItem>
      ))
    );
  };
  const handleChangeYear = (event: ChangeEvent<HTMLInputElement>) => {
    const year = Number(event.target.value);
    onChangeYearFilter(year);
  };
  const handleChangeWeek = (event: ChangeEvent<HTMLInputElement>) => {
    const week = event.target.value;
    const index = weeks.findIndex((item) => item.value === week);
    const { week_start, week_end } = weeks[index];
    onChangeWeekFilter(week_start, week_end);
  };
  const handleChange = (val: string, tab: keyof QueryLearningSummaryCondition) => {
    onChangeFilter(val, tab);
  };
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div>
        <div>
          {(isOrg || isSchoolAdmin || isTeacher) && (
            <>
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => handleChange(e.target.value, "school_id")}
                label={t("report_filter_school")}
                value={value.school_id}
                select
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              >
                {getInfos(schools || [])}
              </TextField>
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => handleChange(e.target.value, "class_id")}
                label={t("report_filter_class")}
                value={value.class_id}
                select
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              >
                {getInfos(classes || [])}
              </TextField>
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => handleChange(e.target.value, "student_id")}
                label={t("report_filter_student")}
                value={value.student_id}
                select
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              >
                {getInfos(students || [])}
              </TextField>
            </>
          )}
          {/* {isStudent && ( */}
          <TextField
            size="small"
            className={css.selectButton}
            onChange={(e) => handleChange(e.target.value, "subject_id")}
            label={t("report_filter_subject")}
            value={value.subject_id}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {getInfos(subjects || [])}
          </TextField>
          {/* )} */}
        </div>
        <div style={{ marginTop: 20 }}>
          <TextField
            size="small"
            className={css.selectButton}
            onChange={handleChangeYear}
            label={t("report_filter_year")}
            value={value.year || ""}
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
            value={defaultWeeksValue || ""}
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {getWeekElement()}
          </TextField>
        </div>
      </div>
      <Divider className={css.divider} />
    </LayoutBox>
  );
}
