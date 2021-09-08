import { Box, Checkbox, FormControl, Input, InputLabel, ListItemText, MenuItem, Select, TextField } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";

interface ISelect {
  label: string;
  value: string;
}

type IOptions = ISelect[][];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function () {
  const [state, setState] = React.useState({
    school_id: "",
    class_id: [],
  });
  const { studentUsage } = useSelector<RootState, RootState["report"]>((state) => state.report);
  console.log("studentUsage", studentUsage);
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
    console.log(classOptions);
    return [schoolOptions, classOptions];
  }, [studentUsage.schoolList, state.school_id]);

  const handleChange = (feild: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [feild]: event.target.value,
    });
  };

  return (
    <Box>
      <Box style={{ width: 200 }}>
        <TextField fullWidth size="small" select label="School select" value={state.school_id} onChange={handleChange("school_id")}>
          {options[0].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box>
        <FormControl>
          <InputLabel id="class-mutiple-checkbox-label">Tag</InputLabel>
          <Select
            labelId="class-mutiple-checkbox-label"
            multiple
            value={[]}
            onChange={() => {}}
            input={<Input />}
            renderValue={(selected) => (selected as string[]).join(", ")}
            MenuProps={MenuProps}
          >
            {options[1].map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={false} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
