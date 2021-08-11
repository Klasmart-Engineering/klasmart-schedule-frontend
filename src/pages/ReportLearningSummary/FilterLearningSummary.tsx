import { Divider, makeStyles, MenuItem, TextField } from "@material-ui/core";
import produce from "immer";
import React, { ChangeEvent } from "react";
import { IWeeks } from ".";
import { User } from "../../api/api-ko-schema.auto";
import { ExternalSubject } from "../../api/api.auto";
import LayoutBox from "../../components/LayoutBox";
import { PermissionType, usePermission } from "../../components/Permission";
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

// export enum ArrPropTypes {
//   EntityLearningSummaryFilterSchool,
//   EntityLearningSummaryFilterClass,
//   EntityLearningSummaryFilterTeacher,
//   EntityLearningSummaryFilterStudent,
//   EntityLearningSummaryFilterSubject
// }
// export type ArrPropTypes = EntityLearningSummaryFilterSchool |
//                            EntityLearningSummaryFilterClass |
//                            EntityLearningSummaryFilterTeacher |
//                            EntityLearningSummaryFilterStudent |
//                            EntityLearningSummaryFilterSubject
export interface LearningSummartOptionsProps {
  year: number[];
  week: IWeeks[];
  studentList: Pick<User, "user_id" | "user_name">[];
  subjectList: ExternalSubject[];
}
export interface FilterLearningSummaryProps extends QueryLearningSummaryConditionBaseProps {
  defaultWeeksValue: string;
  // learningSummartOptions: LearningSummartOptionsProps;
  // timeFilter: EntityLearningSummaryFilterYear[];
  // filterValues: IResultQueryLoadLearningSummary;
  summaryReportOptions: IResultLearningSummary;
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
  const isStudent = perm.report_learning_summary_student_649;
  const { value, defaultWeeksValue, summaryReportOptions, onChange, onChangeFilter } = props;
  const { years, weeks, schools, classes, teachers, students, subjects } = summaryReportOptions;
  // const { timeFilter, infoFilter } = filterValues;
  // console.log(timeFilter)
  // const { year, week, studentList, subjectList } = learningSummartOptions;
  // const weeks = useMemo(() => {
  //   const _weeks = timeFilter.find(item => item.year === value.year)?.weeks
  //   return _weeks && _weeks.length && _weeks.map(item => {
  //     const { week_start, week_end } = item;
  //     return {
  //       week_start: week_start,
  //       ween_end: week_end,
  //       value: `${formatTimeToMonDay(week_start as number)}~${formatTimeToMonDay(week_end as number)}`
  //     }
  //   })
  // }, [timeFilter, value.year]);

  // const classes =  useMemo(() => {
  //   return infoFilter.find(item => item.id === value.school_id)?.classes || [];
  // }, [infoFilter, value.school_id])
  // const teachers = useMemo(() => {
  //   return classes?.find(item => item.id === value.class_id)?.teachers || [];
  // }, [classes, value.class_id]);
  // const students = useMemo(() => {
  //   return teachers?.find(item => item.id === value.teacher_id)?.students || [];
  // }, [teachers, value.teacher_id])
  // const subjects = useMemo(() => {
  //   return students?.find(item => item.id === value.student_id)?.subjects || [];
  // }, [students, value.student_id])
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
        <MenuItem key={item.value} value={item.value}>
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
    onChange(
      produce(value, (draft) => {
        draft.week_start = week_start;
        draft.week_end = week_end;
      })
    );
  };
  const handleChange = (val: string, tab: keyof QueryLearningSummaryCondition) => {
    onChangeFilter(val, tab);
  };
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div>
        {isStudent && (
          <div>
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
              value={defaultWeeksValue}
              select
              SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
            >
              {getWeekElement()}
            </TextField>
          </div>
        )}
        <div style={{ marginTop: 20 }}>
          {isOrg && (
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
          )}
          {(isOrg || isSchoolAdmin || isTeacher) && (
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
          )}
          {(isOrg || isSchoolAdmin) && (
            <TextField
              size="small"
              className={css.selectButton}
              onChange={(e) => handleChange(e.target.value, "teacher_id")}
              label={t("report_filter_teacher")}
              value={value.teacher_id}
              select
              SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
            >
              {getInfos(teachers || [])}
            </TextField>
          )}
          {(isOrg || isSchoolAdmin || isTeacher) && (
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
          )}
          {isStudent && (
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
          )}
        </div>
      </div>
      <Divider className={css.divider} />
    </LayoutBox>
  );
}
