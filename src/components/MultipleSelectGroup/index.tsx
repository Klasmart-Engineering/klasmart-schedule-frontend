import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Box, MenuItem } from "@material-ui/core";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      "& > * + *": {
        marginLeft: theme.spacing(3),
      },
      display: "flex",
    },
    autocomplete: {
      width: "266px",
    },
  })
);

interface MultipleChildProps {
  id: string | number;
  title: string;
}

interface MultipleGroupProps {
  groupCollect: {
    label: string;
    data: MultipleChildProps[];
  }[];
  changeAutocompleteValue: (value: MultipleChildProps[]) => void;
  changeAutocompleteDimensionValue: (value: string) => void;
}

export default function MultipleSelectGroup(props: MultipleGroupProps) {
  const classes = useStyles();
  const initValue = [{ id: 1, title: d("Select All").t("schedule_detail_select_all") }];
  const { groupCollect, changeAutocompleteValue, changeAutocompleteDimensionValue } = props;
  const [secondaryValue, setSecondaryValue] = React.useState<MultipleChildProps[]>(groupCollect[0].data);
  const [value, setValue] = React.useState<MultipleChildProps[]>(initValue);

  const autocompleteChange = async (e: React.ChangeEvent<{}>, value: MultipleChildProps[]) => {
    const result = value.length > 1 ? value.filter((v) => v.id !== 1) : value;
    if (result.length && value[value.length - 1].id === 1) {
      setValue(initValue);
      changeAutocompleteValue(initValue);
    } else {
      setValue(result);
      changeAutocompleteValue(result);
    }
  };

  const autocompleteDimensionChange = async (e: React.ChangeEvent<{ value: String | Number }>) => {
    const value = e.target.value;
    const collect = groupCollect.filter((collect) => collect.label === e.target.value);
    setSecondaryValue(value ? collect[0].data : []);
    setValue(value ? initValue : []);
    changeAutocompleteDimensionValue(value as string);
    changeAutocompleteValue(initValue);
  };

  return (
    <Box className={classes.root}>
      <TextField
        defaultValue={groupCollect[0].label}
        className={classes.autocomplete}
        onChange={(e) => autocompleteDimensionChange(e)}
        select
        required
      >
        {groupCollect.map((collect) => (
          <MenuItem key={collect.label} value={collect.label}>
            {collect.label}
          </MenuItem>
        ))}
      </TextField>
      <Autocomplete
        multiple
        limitTags={1}
        id="tags-outlined"
        className={classes.autocomplete}
        onChange={(e, value) => {
          autocompleteChange(e, value);
        }}
        options={[...initValue, ...(secondaryValue.length ? secondaryValue : groupCollect[0].data)]}
        getOptionLabel={(option) => option.title}
        defaultValue={initValue}
        value={value}
        renderInput={(params) => <TextField {...params} variant="outlined" label="Please select here" />}
      />
    </Box>
  );
}
