/* eslint-disable react-hooks/exhaustive-deps */
import { enableLegacyGql, IClassTeachers } from "@api/extra";
import { Box, MenuItem, TextField, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import { orderByASC } from "@utilities/dataUtilities";
import clsx from "clsx";
import { uniqBy } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import MutiSelect from "../../../../components/MutiSelect";
import { t } from "../../../../locale/LocaleManager";
import { RootState } from "../../../../reducers";
import useTranslation from "../../hooks/useTranslation";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      position: "relative",
    },
    schoolBox: {
      width: 180,
    },
    teacherBox: {
      width: 180,
      marginLeft: 10,
    },
    teacherBoxNone: {
      display: "none",
    },
    classBox: {
      width: 180,
      marginLeft: 10,
    },
  })
);

interface IState {
  schoolId: string;
  teachers: MutiSelect.ISelect[];
  classes: MutiSelect.ISelect[];
}

interface IProps {
  onChange?: (teachers: MutiSelect.ISelect[], classes: MutiSelect.ISelect[]) => void;
}

export default function TeacherFilter({ onChange }: IProps) {
  const classes = useStyles();
  const { allValue, noneValue, selectAllOption, selectNoneSchoolOption } = useTranslation();
  const [state, setState] = React.useState<IState>({
    schoolId: allValue,
    teachers: [],
    classes: [],
  });

  const { schoolClassesTeachers } = useSelector<RootState, RootState["report"]>((state) => state.report);

  const { classList, schoolList, classTeacherList, hasNoneSchoolClasses, canSelectTeacher, noSchoolClasses } = schoolClassesTeachers;

  console.log("schoolClassesTeachers=", schoolClassesTeachers);

  const getAllSchoolList = (): MutiSelect.ISelect[] => {
    return schoolList
      .map((item) => ({
        value: item.school_id!,
        label: item.school_name!,
      }))
      .concat(hasNoneSchoolClasses ? selectNoneSchoolOption : []);
  };

  const getCurrentSchoolClassIdList = (): string[] => {
    const curSchoolId = state.schoolId;
    if (enableLegacyGql) {
      let class_ids: string[] = [];
      if (curSchoolId === allValue) {
        schoolList.forEach((schoolItem) => {
          class_ids = class_ids.concat(schoolItem.classes?.map((classItem) => classItem?.class_id || "") || []);
          class_ids = class_ids.concat(noSchoolClasses?.map((classItem) => classItem?.class_id || "") || []);
        });
      } else if (curSchoolId === noneValue) {
        class_ids = class_ids.concat(noSchoolClasses?.map((classItem) => classItem?.class_id || "") || []);
      } else {
        schoolList
          .filter((item) => item.school_id === curSchoolId)
          .forEach((schoolItem) => {
            class_ids = class_ids.concat(schoolItem.classes?.map((classItem) => classItem?.class_id || "") || []);
          });
      }
      return class_ids;
    } else {
      return classList
        .filter((classItem) => {
          if (curSchoolId === allValue) {
            return true;
          } else if (curSchoolId === noneValue) {
            return (classItem.schools || []).length === 0;
          } else {
            return (classItem.schools || []).filter((schoolItem) => schoolItem?.school_id === curSchoolId).length > 0;
          }
        })
        .map((classItem) => classItem.class_id);
    }
  };

  const currentSchoolClassIds = React.useMemo<string[]>(getCurrentSchoolClassIdList, [state.schoolId]);

  const getAllTeacherList = (): MutiSelect.ISelect[] => {
    let teacherOptions: MutiSelect.ISelect[] = [];
    const curSchoolId = state.schoolId;
    teacherOptions = classTeacherList.reduce((prev: MutiSelect.ISelect[], cur) => {
      if (curSchoolId === allValue || currentSchoolClassIds.indexOf(cur.class_id) >= 0) {
        cur.teachers?.forEach((teacher) => {
          prev.push({
            value: teacher?.user_id!,
            label: teacher?.user_name!,
          });
        });
      }
      return prev;
    }, []);
    teacherOptions = uniqBy(teacherOptions, "value");
    return orderByASC(teacherOptions, "label");
  };

  const getClassList = (): MutiSelect.ISelect[] => {
    let classOptions: MutiSelect.ISelect[] = [];
    const selectedTeachers = state.teachers;

    const curSchoolId = state.schoolId;
    for (let i = 0; i < selectedTeachers.length; i++) {
      const curTeacherId = selectedTeachers[i].value;
      const classIds = classTeacherList.reduce((prev, cur) => {
        if ((cur.teachers || []).filter((teacher) => teacher?.user_id === curTeacherId).length > 0) {
          prev.push(cur.class_id as never);
        }
        return prev;
      }, []);
      if (enableLegacyGql) {
        let classes: IClassTeachers[] = [];
        if (curSchoolId === allValue) {
          schoolList.forEach((schoolItem) => {
            classes = classes?.concat(
              schoolItem?.classes?.filter((classItem) => classIds.indexOf(classItem?.class_id as never) >= 0) as IClassTeachers[]
            );
            classes = classes?.concat(
              noSchoolClasses?.filter((classItem) => classIds.indexOf(classItem.class_id as never) >= 0) as IClassTeachers[]
            );
          });
        } else if (curSchoolId === noneValue) {
          classes = classes?.concat(
            noSchoolClasses?.filter((classItem) => classIds.indexOf(classItem.class_id as never) >= 0) as IClassTeachers[]
          );
        } else {
          schoolList
            .filter((item) => item.school_id === curSchoolId)
            .forEach((schoolItem) => {
              classes = classes?.concat(
                schoolItem?.classes?.filter((classItem) => classIds.indexOf(classItem?.class_id as never) >= 0) as IClassTeachers[]
              );
            });
        }
        let temp = classes?.map((item) => ({
          value: item.class_id!,
          label: item.class_name!,
        }));
        classOptions = classOptions.concat(temp);
      } else {
        let temp = classList
          .filter((classItem) => {
            let condition: boolean = true;
            if (curSchoolId === noneValue) {
              condition = (classItem.schools || []).length === 0;
            } else if (curSchoolId === allValue) {
              condition = true;
            } else {
              condition =
                (classItem.schools || []).filter((schoolItem) => {
                  return schoolItem?.school_id === curSchoolId;
                }).length > 0;
            }
            return condition && classIds.indexOf(classItem.class_id as never) >= 0;
          })
          .map((item) => ({
            value: item.class_id!,
            label: item.class_name!,
          }));
        classOptions = classOptions.concat(temp);
      }
    }
    return uniqBy(classOptions, "value");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({
      ...state,
      schoolId: event.target.value,
      teachers: [],
      classes: [],
    }));
  };

  const onChangeTeacher = (value: MutiSelect.ISelect[]) => {
    setState((state) => ({
      ...state,
      teachers: value,
    }));
  };

  const onChangeClass = (value: MutiSelect.ISelect[]) => {
    setState((state) => ({
      ...state,
      classes: value,
    }));
  };

  const cb = () => {
    if (state.teachers.length > 0 && state.classes.length > 0) {
      onChange && onChange(state.teachers, state.classes);
    }
  };

  const schoolOptions = React.useMemo<MutiSelect.ISelect[]>(getAllSchoolList, [schoolList]);
  const teacherOptions = React.useMemo<MutiSelect.ISelect[]>(getAllTeacherList, [state.schoolId, classTeacherList]);
  const classOptions = React.useMemo<MutiSelect.ISelect[]>(getClassList, [state.teachers]);
  React.useEffect(cb, [state.teachers, state.classes]);

  const allTeacherOptions = selectAllOption.concat(teacherOptions);
  const allClassOptions = selectAllOption.concat(classOptions);
  return (
    <Box className={classes.container}>
      <Box className={classes.schoolBox}>
        <TextField
          fullWidth
          size="small"
          select
          //disabled={schoolOptions.length === 0}
          label={t("report_filter_school")}
          value={state.schoolId}
          onChange={handleChange}
        >
          {selectAllOption.concat(schoolOptions).map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        className={clsx({
          [classes.teacherBox]: true,
          [classes.teacherBoxNone]: !canSelectTeacher,
        })}
      >
        <MutiSelect
          id={state.schoolId}
          disabled={false}
          options={allTeacherOptions}
          label={t("report_filter_teacher")}
          defaultValueIsAll
          onChange={onChangeTeacher}
          onInitial={onChangeTeacher}
        />
      </Box>

      <Box className={classes.classBox}>
        <MutiSelect
          id={state.schoolId}
          disabled={state.teachers.length > 1}
          options={allClassOptions}
          label={t("report_filter_class")}
          defaultValueIsAll
          onChange={onChangeClass}
          onInitial={onChangeClass}
        />
      </Box>
    </Box>
  );
}
