import React from "react";
import { makeStyles, Theme, createStyles, TextField, Checkbox, Grid } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { useState } from "react";
import { d } from "../../../locale/LocaleManager";
// eslint-disable-next-line
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
  label?: string;
  data: Iitem[];
  onChange: (value: Iitem[]) => void;
}
export default function SelectBtn(props: ISelectBtn) {
  const { label, data, onChange } = props;
  const [value, setValue] = useState([{ id: "All", name: d("All").t("report_label_all") }]);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  return (
    <Grid>
      <Autocomplete
        multiple
        size="small"
        options={data}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        value={value}
        onChange={(event, value) => {
          onChange && onChange(value);
          setValue(value);
        }}
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
            {option.name}
          </React.Fragment>
        )}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} variant="outlined" label={label} />}
      />
    </Grid>
  );
}
