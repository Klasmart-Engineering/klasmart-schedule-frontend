import { Box, createStyles, makeStyles, MenuItem, TextField, Theme } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";

interface ISelect {
  label: string;
  value: string;
}

interface IProps {
  onChange?: (value: string[]) => void;
}

interface IState {
  school_id: string;
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
      "& > button": {
        maxWidth: 60,
      },
    },
  })
);

export default function ({ onChange }: IProps) {
  const classes = useStyles();
  const [state, setState] = React.useState<IState>({
    school_id: "",
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
        .filter((item) => item.school_id === state.school_id)[0]
        ?.classes?.map((item) => ({
          value: item?.class_id,
          label: item?.class_name,
        })) as ISelect[]) || [];
    return [schoolOptions, classOptions];
  }, [studentUsage.schoolList, state.school_id]);

  const handleChange = (feild: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [feild]: event.target.value,
    });
  };

  return (
    <Box className={classes.selectContainer}>
      <Box className={classes.schoolBox}>
        <TextField fullWidth size="small" select label="School select" value={state.school_id} onChange={handleChange("school_id")}>
          {options[0].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box className={classes.classBox}>
        <Autocomplete
          disabled={!state.school_id}
          size="small"
          multiple
          limitTags={1}
          id="multiple-limit-tags"
          options={options[1]}
          getOptionLabel={(option) => option.label}
          defaultValue={[]}
          onChange={(event, value) => {
            onChange && onChange(value.map((v) => v.value));
          }}
          renderInput={(params) => <TextField {...params} variant="outlined" label="Class select" placeholder="" />}
        />
      </Box>
    </Box>
  );
}
