import { createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme } from "@material-ui/core";
import React from "react";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: "180px",
      height: "40px",
      marginLeft: theme.spacing(2),
      "& #outlined": {
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
  value: string | string[];
  label?: string;
  data: Iitem[];
  handleChange: any;
  multiple?: boolean;
}
export default function SelectBtn(props: ISelectBtn) {
  const style = useStyles();
  const { value, label, data, handleChange } = props;
  return (
    <FormControl variant="outlined" className={style.formControl}>
      <InputLabel id="label">{label}</InputLabel>
      <Select labelId="label" id="outlined" multiple={props.multiple} value={value} onChange={handleChange} label={label}>
        {data.map((item) => (
          <MenuItem value={item.id} key={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
