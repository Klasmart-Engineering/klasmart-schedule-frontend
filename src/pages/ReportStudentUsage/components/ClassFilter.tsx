import { Box, createStyles, makeStyles, MenuItem, TextField, Theme } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { useSelector } from "react-redux";
import { t } from "../../../locale/LocaleManager";
import { RootState } from "../../../reducers";

interface ISelect {
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
    selectContainer: {
      display: "flex",
      flexDirection: "row",
      position: "relative",
    },
    schoolBox: {
      width: 180,
      paddingRight: 320,
    },
    classBox: {
      right: 0,
      position: "absolute",
      width: 300,
      background: "#fff",
      zIndex: 1000,
      "& > * + *": {
        marginTop: theme.spacing(3),
      },
    },
    tagSizeSmall: {
      maxWidth: "calc(100% - 100px)",
    },
  })
);

export default function ({ onChange, onClose }: IProps) {
  const classes = useStyles();
  const [state, setState] = React.useState<IState>({
    schoolId: "",
    classes: [],
  });
  const { studentUsage } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const options = React.useMemo<IOptions>(() => {
    const schoolOptions =
      (studentUsage.schoolList.map((item) => ({
        value: item.school_id,
        label: item.school_name,
      })) as ISelect[]) || [];
    const classOptions =
      (studentUsage.schoolList
        .filter((item) => item.school_id === state.schoolId)[0]
        ?.classes?.map((item) => ({
          value: item?.class_id,
          label: item?.class_name,
        })) as ISelect[]) || [];
    return [schoolOptions, classOptions];
  }, [studentUsage.schoolList, state.schoolId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      schoolId: event.target.value,
      classes: [],
    });
  };

  return (
    <Box className={classes.selectContainer}>
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
          {options[0].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box className={classes.classBox}>
        <Autocomplete
          classes={{
            tagSizeSmall: classes.tagSizeSmall,
          }}
          disabled={!state.schoolId}
          size="small"
          multiple
          limitTags={1}
          options={options[1]}
          getOptionLabel={(option) => option.label}
          value={state.classes}
          onChange={(event, value) => {
            onChange && onChange(value);
            setState({
              ...state,
              classes: value,
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={t("report_filter_class")}
              placeholder="type or select class name"
              onBlur={onClose ? onClose : () => {}}
            />
          )}
        />
      </Box>
    </Box>
  );
}
