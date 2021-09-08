import { Box, MenuItem, TextField } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";

interface ISelect {
  label: string;
  value: string;
}

type IOptions = ISelect[][];

export default function () {
  const [state, setState] = React.useState({
    school_id: "",
    class_id: [],
  });
  const { studentUsage } = useSelector<RootState, RootState["report"]>((state) => state.report);

  const options = React.useMemo<IOptions>(() => {
    const schoolOptions = studentUsage.schoolList.map((item) => ({
      value: item.school_id,
      label: item.school_name,
    })) as ISelect[];
    return [schoolOptions, []];
  }, [studentUsage.schoolList]);

  const handleChange = (feild: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [feild]: event.target.value,
    });
  };

  return (
    <Box>
      <Box style={{ width: 200 }}>
        <TextField
          fullWidth
          size="small"
          id="standard-select-currency-native"
          select
          label="School select"
          value={state.school_id}
          onChange={handleChange("school_id")}
        >
          {options[0].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
}
