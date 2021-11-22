/* eslint-disable react-hooks/exhaustive-deps */
import { Box, createStyles, makeStyles, MenuItem, TextField, Theme } from "@material-ui/core";
import uniqBy from "lodash/uniqBy";
import React from "react";
import { useSelector } from "react-redux";
import { Class, Maybe } from "../../../api/api-ko-schema.auto";
import MutiSelect from "../../../components/MutiSelect";
import { t } from "../../../locale/LocaleManager";
import { RootState } from "../../../reducers";
import useTranslation from "../hooks/useTranslation";

interface IProps {
  onChange?: (value: MutiSelect.ISelect[]) => void;
}

interface IState {
  schoolId: string;
  classes: MutiSelect.ISelect[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      position: "relative",
    },
    schoolBox: {
      width: 180,
    },
    classBox: {
      width: 180,
      marginLeft: 10,
    },
  })
);

export default function ClassFilter({ onChange }: IProps) {
  const classes = useStyles();
  const { allValue, noneValue, selectAllOption, selectNoneSchoolOption } = useTranslation();
  const [state, setState] = React.useState<IState>({
    schoolId: allValue,
    classes: [],
  });

  const { studentUsage } = useSelector<RootState, RootState["report"]>((state) => state.report);

  const transformClassDataToOption = (item: Maybe<Class>): MutiSelect.ISelect => {
    return {
      value: item?.class_id || "",
      label: item?.class_name || "",
    };
  };

  const getAllSchoolList = (): MutiSelect.ISelect[] => {
    const schoolOptions =
      (studentUsage.schoolList
        .filter((item) => item.classes && item.classes.length > 0)
        .map((item) => ({
          value: item.school_id,
          label: item.school_name,
        }))
        .concat(studentUsage.noneSchoolClasses.length > 0 ? selectNoneSchoolOption : []) as MutiSelect.ISelect[]) || [];
    return schoolOptions;
  };

  const getAllClassList = () => {
    let classOptions: MutiSelect.ISelect[] = [];
    if (state.schoolId === allValue) {
      studentUsage.schoolList.forEach((item) => {
        if (item.classes) {
          classOptions = classOptions.concat(item.classes!.map(transformClassDataToOption) as MutiSelect.ISelect[]);
        }
      });
    }
    if (state.schoolId === allValue || state.schoolId === noneValue) {
      classOptions = classOptions.concat(studentUsage.noneSchoolClasses.map(transformClassDataToOption) as MutiSelect.ISelect[]);
    } else {
      const classes = studentUsage.schoolList.filter((item) => item.school_id === state.schoolId)[0]?.classes;
      if (classes) {
        classOptions = classOptions.concat(classes!.map(transformClassDataToOption));
      }
    }
    classOptions = uniqBy(classOptions, "value");
    return classOptions;
  };

  const schoolOptions = React.useMemo<MutiSelect.ISelect[]>(getAllSchoolList, [state.schoolId, studentUsage.schoolList]);

  const classOptions = React.useMemo<MutiSelect.ISelect[]>(getAllClassList, [state.schoolId, studentUsage.schoolList]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      schoolId: event.target.value,
      classes: [],
    });
  };
  const allSchoolOptions = selectAllOption.concat(schoolOptions);
  return (
    <Box className={classes.container}>
      <Box className={classes.schoolBox}>
        <TextField
          fullWidth
          size="small"
          select
          disabled={schoolOptions.length === 0}
          label={t("report_filter_school")}
          value={state.schoolId}
          onChange={handleChange}
        >
          {allSchoolOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box className={classes.classBox}>
        <MutiSelect
          disabled={studentUsage.organization_id === ""}
          options={selectAllOption.concat(classOptions)}
          label={t("report_filter_class")}
          defaultValueIsAll
          onChange={onChange}
          onInitial={onChange}
        />
      </Box>
    </Box>
  );
}
