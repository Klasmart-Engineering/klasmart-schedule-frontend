import { Box, MenuItem, TextField, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
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

export default function ({ onChange }: IProps) {
  const classes = useStyles();
  const { allValue, noneValue, selectAllOption, selectNoneSchoolOption } = useTranslation();
  const [state, setState] = React.useState<IState>({
    schoolId: allValue,
    teachers: [],
    classes: [],
  });

  const { schoolClassesTeachers } = useSelector<RootState, RootState["report"]>((state) => state.report);

  const { classList, schoolList, classTeacherList, hasNoneSchoolClasses, canSelectTeacher } = schoolClassesTeachers;

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
    return uniqBy(teacherOptions, "value");
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
    return uniqBy(classOptions, "value");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      schoolId: event.target.value,
      teachers: [],
      classes: [],
    });
  };

  const onChangeTeacher = (value: MutiSelect.ISelect[]) => {
    console.log("teacher: ", value);
    setState({
      ...state,
      teachers: value,
    });
  };

  const onChangeClass = (value: MutiSelect.ISelect[]) => {
    setState({
      ...state,
      classes: value,
    });
  };

  const cb = () => {
    console.log("state === ", state);
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
