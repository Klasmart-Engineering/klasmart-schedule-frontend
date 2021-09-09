import React from "react";
import { makeStyles, FormControl, Select, InputLabel, MenuItem, Theme, createStyles } from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

interface Iitem {
  id: string;
  name: string;
}
interface ISelectBtn {
  value: string;
  label?: string;
  data: Iitem[];
  handleChange: any;
}
export default function SelectBtn(props: ISelectBtn) {
  const style = useStyles();
  const { value, label, data, handleChange } = props;
  return (
    <FormControl variant="outlined" className={style.formControl}>
      <InputLabel id="demo-simple-select-outlined-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={value}
        onChange={handleChange}
        label={label}
      >
        {data.map((item) => (
          <MenuItem value={item.id} key={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
