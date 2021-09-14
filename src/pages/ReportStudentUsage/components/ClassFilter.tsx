import { Box, createStyles, makeStyles, MenuItem, TextField, Theme } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
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
  onClose?: () => void;
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
      paddingRight: 320,
    },
    multipleSelectBox: {
      top: 0,
      right: 0,
      position: "absolute",
      width: 300,
      background: "#fff",
      zIndex: theme.zIndex.drawer + 100,
      "& > * + *": {
        marginTop: theme.spacing(3),
      },
    },
    multipleSelectBoxFocused: {
      zIndex: theme.zIndex.drawer + 200,
    },
    classBox: {},
    contentContainer: {
      display: "flex",
      position: "relative",
      marginTop: 20,
    },
    contentBox: {},
    tagSizeSmall: {
      maxWidth: "calc(100% - 120px)",
    },
  })
);

interface IMutiSelectProps {
  limitTags?: number;
  options: ISelect[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: ISelect[]) => void;
  onClose?: () => void;
  defaultValueIsAll?: boolean;
}
interface IMutiSelectState {
  value: ISelect[];
  allSelected: boolean;
}
const MutiSelect = React.memo(
  ({ limitTags, options: allOptions, label, disabled, placeholder, defaultValueIsAll, onChange, onClose }: IMutiSelectProps) => {
    const { allValue, selectAllOption } = useTranslation();
    const classes = useStyles();
    const [focused, setFocused] = React.useState<boolean>(false);
    const [state, setState] = React.useState<IMutiSelectState>({
      value: defaultValueIsAll ? selectAllOption : [],
      allSelected: !!defaultValueIsAll,
    });

    const resetState = () => {
      setState({
        ...state,
        value: defaultValueIsAll ? allOptions.slice(0, 1) : [],
        allSelected: !!defaultValueIsAll,
      });
    };

    const onSelectChange = (event: ChangeEvent<{}>, value: ISelect[]) => {
      const valueLength = value.length;
      const curAllSelected = value.filter((item) => item.value === allValue).length > 0;
      const prevAllSelected = state.allSelected;
      let newValue = [];
      let newAllSelected = false;
      let cbValues = [];
      if (valueLength > 1 && curAllSelected && prevAllSelected) {
        newValue = value.filter((item) => item.value !== allValue);
        cbValues = newValue;
      } else if ((curAllSelected && !prevAllSelected) || (!curAllSelected && valueLength === allOptions.length - 1)) {
        newValue = allOptions.slice(0, 1);
        newAllSelected = true;
        cbValues = allOptions.slice(1, allOptions.length);
      } else {
        newValue = value;
        cbValues = newValue;
      }
      onChange && onChange(cbValues);
      setState({
        ...state,
        value: newValue,
        allSelected: newAllSelected,
      });
    };

    React.useEffect(resetState, [allOptions.length, allOptions[1]]);

    return (
      <Box
        className={clsx({
          [classes.multipleSelectBox]: true,
          [classes.multipleSelectBoxFocused]: focused,
        })}
      >
        <Autocomplete
          classes={{
            tagSizeSmall: classes.tagSizeSmall,
          }}
          disabled={disabled}
          size="small"
          multiple
          limitTags={limitTags}
          options={allOptions}
          getOptionLabel={(option) => option.label}
          value={state.value}
          onChange={onSelectChange}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label={label} placeholder={placeholder} onBlur={onClose ? onClose : () => {}} />
          )}
        />
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.options, nextProps.options);
  }
);

export default function ({ onChange, onClose }: IProps) {
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

  const schoolChangeCb = () => {
    if (!onChange) {
      return;
    }
    if (state.schoolId === noneValue) {
      onChange(
        studentUsage.noneSchoolClasses.map((item) => ({
          value: item.class_id,
          label: item.class_name || "",
        }))
      );
    } else {
      onChange(classOptions);
    }
  };

  React.useEffect(schoolChangeCb, [state.schoolId, classOptions]);

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
      <MutiSelect
        disabled={classOptions.length === 0}
        options={selectAllOption.concat(classOptions)}
        limitTags={1}
        label={t("report_filter_class")}
        defaultValueIsAll
        onChange={onChange}
        onClose={onClose}
      />
    </Box>
  );
}

export { MutiSelect };
