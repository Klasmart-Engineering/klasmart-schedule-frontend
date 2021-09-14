import { Box, createStyles, makeStyles, MenuItem, TextField, Theme } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { useSelector } from "react-redux";
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
      zIndex: 1000,
      "& > * + *": {
        marginTop: theme.spacing(3),
      },
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
function MutiSelect({
  limitTags,
  options: allOptions,
  label,
  disabled,
  placeholder,
  defaultValueIsAll,
  onChange,
  onClose,
}: IMutiSelectProps) {
  const { allValue, selectAllOption } = useTranslation();
  const classes = useStyles();

  const [state, setState] = React.useState<IMutiSelectState>({
    value: defaultValueIsAll ? selectAllOption : [],
    allSelected: !!defaultValueIsAll,
  });

  const resetState = () => {
    console.info("reset");
    setState({
      ...state,
      value: defaultValueIsAll ? selectAllOption : [],
      allSelected: !!defaultValueIsAll,
    });
  };

  React.useEffect(resetState, [allOptions.length, allOptions[1]]);

  return (
    <Box className={classes.multipleSelectBox}>
      <Autocomplete
        classes={{
          tagSizeSmall: classes.tagSizeSmall,
        }}
        disabled={disabled}
        size="small"
        multiple
        limitTags={limitTags}
        options={allOptions}
        getOptionDisabled={(option) => {
          return state.allSelected;
        }}
        getOptionLabel={(option) => option.label}
        value={state.value}
        onChange={(event, value) => {
          const curAllSelected = value.filter((item) => item.value === allValue).length > 0;
          //onChange && onChange(value);
          if (onChange) {
            if (curAllSelected) {
              onChange(allOptions.slice(1, allOptions.length));
            } else {
              onChange(value);
            }
          }
          console.log(curAllSelected, value);
          setState({
            ...state,
            value: curAllSelected ? selectAllOption : value,
            allSelected: curAllSelected,
          });
        }}
        renderOption={(option, { selected }) => {
          return !(option.value === "all" && state.allSelected) && <>{option.label}</>;
        }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label={label} placeholder={placeholder} onBlur={onClose ? onClose : () => {}} />
        )}
      />
    </Box>
  );
}

export default function ({ onChange, onClose }: IProps) {
  const classes = useStyles();
  const { allValue, noneValue, selectAllOption, selectNoneSchoolOption } = useTranslation();
  const [state, setState] = React.useState<IState>({
    schoolId: allValue,
    classes: [],
  });

  const { studentUsage } = useSelector<RootState, RootState["report"]>((state) => state.report);

  const options = React.useMemo<IOptions>(() => {
    const schoolOptions =
      (studentUsage.schoolList
        .map((item) => ({
          value: item.school_id,
          label: item.school_name,
        }))
        .concat(studentUsage.noneSchoolClasses.length > 0 ? selectNoneSchoolOption : []) as ISelect[]) || [];
    const classOptions =
      state.schoolId === noneValue
        ? studentUsage.noneSchoolClasses.map((item) => ({
            value: item.class_id,
            label: item.class_name || "",
          }))
        : (studentUsage.schoolList
            .filter((item) => item.school_id === state.schoolId)[0]
            ?.classes?.map((item) => ({
              value: item?.class_id,
              label: item?.class_name,
            })) as ISelect[]) || [];
    return [schoolOptions, classOptions];
  }, [studentUsage.schoolList, studentUsage.noneSchoolClasses, selectNoneSchoolOption, state.schoolId, noneValue]);

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
      onChange(options[1]);
    }
  };

  React.useEffect(schoolChangeCb, [options[1]]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      schoolId: event.target.value,
      classes: [],
    });
  };
  const allSchoolOptions = selectAllOption.concat(options[0]);

  console.log(allSchoolOptions);
  return (
    <Box className={classes.schoolContainer}>
      <Box className={classes.schoolBox}>
        <TextField
          fullWidth
          size="small"
          select
          disabled={options[0].length === 0}
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
        disabled={options[1].length === 0}
        options={selectAllOption.concat(options[1])}
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
