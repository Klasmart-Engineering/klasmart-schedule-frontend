import { Box, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from "@material-ui/core";
import clsx from "clsx";
import isEqual from "lodash/isEqual";
import uniqBy from "lodash/uniqBy";
import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { Class, Maybe } from "../../../api/api-ko-schema.auto";
import { t } from "../../../locale/LocaleManager";
import { RootState } from "../../../reducers";
import useTranslation from "../hooks/useTranslation";

export interface ISelect {
  label: string;
  value: string;
}

interface IProps {
  onChange?: (value: ISelect[]) => void;
}

interface IState {
  schoolId: string;
  classes: ISelect[];
}

type IOptions = ISelect[][];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    schoolContainer: {
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
    multipleSelectBox: {
      width: "100%",
    },
    multipleSelectBoxFocused: {},
  })
);

interface IMutiSelectProps {
  options: ISelect[];
  label?: string;
  disabled?: boolean;
  onChange?: (value: ISelect[]) => void;
  onInitial?: (value: ISelect[]) => void;
  defaultValueIsAll?: boolean;
}
interface IMutiSelectState {
  value: string[];
  allSelected: boolean;
}
const MutiSelect = React.memo(
  ({ options: allOptions, label, disabled, defaultValueIsAll, onChange, onInitial }: IMutiSelectProps) => {
    const { allValue } = useTranslation();
    const classes = useStyles();
    const [focused, setFocused] = React.useState<boolean>(false);
    const [state, setState] = React.useState<IMutiSelectState>({
      value: defaultValueIsAll ? [allValue] : [],
      allSelected: !!defaultValueIsAll,
    });
    const resetState = () => {
      setState({
        ...state,
        value: defaultValueIsAll ? [allValue] : [],
        allSelected: !!defaultValueIsAll,
      });
      !disabled && onInitial && onInitial(allOptions.slice(1, allOptions.length));
    };

    React.useEffect(resetState, [allOptions.length, allOptions]);

    const onSelectChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
      let value = event.target.value as string[];
      if (value.length === 0) {
        return;
      }
      if (value.indexOf(allValue) > -1) {
        if (state.value.indexOf(allValue) === -1) {
          value = [allValue];
        } else {
          value = value.filter((v) => v !== allValue);
        }
      }
      setState({
        ...state,
        value,
      });
    };

    const onOpenSelect = () => {
      setFocused(true);
    };
    const onCloseSelect = () => {
      let cbValues = [];
      if (state.value.length === 1 && state.value[0] === allValue) {
        cbValues = allOptions.slice(1, allOptions.length);
      } else {
        cbValues = allOptions.filter((item) => state.value.indexOf(item.value) >= 0);
      }
      onChange && onChange(cbValues);
      setFocused(false);
    };

    return (
      <FormControl
        size="small"
        variant="outlined"
        className={clsx({
          [classes.multipleSelectBox]: true,
          [classes.multipleSelectBoxFocused]: focused,
        })}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          fullWidth
          multiple
          displayEmpty
          value={state.value}
          onChange={onSelectChange}
          label={label}
          disabled={disabled}
          onOpen={onOpenSelect}
          onClose={onCloseSelect}
          inputProps={{ "aria-label": "Without label" }}
        >
          {allOptions.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.options, nextProps.options);
  }
);

export default function ({ onChange }: IProps) {
  const classes = useStyles();
  const { allValue, noneValue, selectAllOption, selectNoneSchoolOption } = useTranslation();
  const [state, setState] = React.useState<IState>({
    schoolId: allValue,
    classes: [],
  });

  const { studentUsage } = useSelector<RootState, RootState["report"]>((state) => state.report);

  const transformClassDataToOption = (item: Maybe<Class>): ISelect => {
    return {
      value: item?.class_id || "",
      label: item?.class_name || "",
    };
  };

  const getAllSchoolList = (): ISelect[] => {
    const schoolOptions =
      (studentUsage.schoolList
        .filter((item) => item.classes && item.classes.length > 0)
        .map((item) => ({
          value: item.school_id,
          label: item.school_name,
        }))
        .concat(studentUsage.noneSchoolClasses.length > 0 ? selectNoneSchoolOption : []) as ISelect[]) || [];
    return schoolOptions;
  };

  const getAllClassList = () => {
    let classOptions: ISelect[] = [];
    if (state.schoolId === allValue) {
      studentUsage.schoolList.forEach((item) => {
        if (item.classes) {
          classOptions = classOptions.concat(item.classes!.map(transformClassDataToOption) as ISelect[]);
        }
      });
    }
    if (state.schoolId === allValue || state.schoolId === noneValue) {
      classOptions = classOptions.concat(studentUsage.noneSchoolClasses.map(transformClassDataToOption) as ISelect[]);
    } else {
      const classes = studentUsage.schoolList.filter((item) => item.school_id === state.schoolId)[0]?.classes;
      if (classes) {
        classOptions = classOptions.concat(classes!.map(transformClassDataToOption));
      }
    }
    classOptions = uniqBy(classOptions, "value");
    return classOptions;
  };

  const schoolOptions = React.useMemo<ISelect[]>(getAllSchoolList, [state.schoolId, studentUsage.schoolList]);

  const classOptions = React.useMemo<ISelect[]>(getAllClassList, [state.schoolId, studentUsage.schoolList]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      schoolId: event.target.value,
      classes: [],
    });
  };
  const allSchoolOptions = selectAllOption.concat(schoolOptions);
  return (
    <Box className={classes.schoolContainer}>
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

export { MutiSelect };
