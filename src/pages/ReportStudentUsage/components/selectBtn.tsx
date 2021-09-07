import React from "react";
import { makeStyles, FormControl, Select, InputLabel, MenuItem, Theme } from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    width: "180px",
    height: "40px",
    marginLeft: theme.spacing(2),
    "& #demo-simple-select-outlined": {
      paddingTop: "10px",
      paddingBottom: "10px",
    },
    "& .MuiInputLabel-animated": {
      top: "-18%",
    },
    "& .MuiInputLabel-shrink ": {
      top: 0,
    },
  },
}));
interface ISelectBtn {
  value: string;
  label?: string;
  data: string[];
  handleChange: any;
}
export default function SelectBtn(props: ISelectBtn) {
  const style = useStyles();
  const { value, label, data, handleChange } = props;
  return (
    <FormControl variant="outlined" className={style.formControl}>
      {label ? (
        <>
          <InputLabel id="demo-simple-select-outlined-label">{label}</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={value}
            onChange={handleChange}
            label={label}
          >
            {data.map((item) => (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </>
      ) : (
        <Select
          value={value}
          id="demo-simple-select-outlined"
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">{data[0]}</MenuItem>
          {data.map(
            (item, idx) =>
              idx !== 0 && (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              )
          )}
        </Select>
      )}
    </FormControl>
  );
}
