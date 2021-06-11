import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Box } from "@material-ui/core";

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
  const initValue = [{ id: 1, title: "Select All" }];
  const { groupCollect, changeAutocompleteValue, changeAutocompleteDimensionValue } = props;
  const [secondaryValue, setSecondaryValue] = React.useState<MultipleChildProps[]>(groupCollect[0].data);
  const [value, setValue] = React.useState<MultipleChildProps[]>(initValue);

  const autocompleteChange = async (e: React.ChangeEvent<{}>, value: MultipleChildProps[]) => {
    const result = value.length > 1 ? value.filter((v) => v.id !== 1) : value;
    setValue(result);
    changeAutocompleteValue(result);
  };

  const autocompleteDimensionChange = async (
    e: React.ChangeEvent<{}>,
    value: {
      label: string;
      data: MultipleChildProps[];
    } | null
  ) => {
    setSecondaryValue(value ? value.data : []);
    setValue(value ? initValue : []);
    changeAutocompleteDimensionValue(value?.label as string);
    changeAutocompleteValue([]);
  };

  return (
    <Box className={classes.root}>
      <Autocomplete
        id="tags-outlined"
        className={classes.autocomplete}
        options={groupCollect}
        onChange={(e, value) => {
          autocompleteDimensionChange(e, value);
        }}
        getOptionLabel={(option) => option.label}
        defaultValue={groupCollect[0]}
        filterSelectedOptions
        renderInput={(params) => <TextField {...params} variant="outlined" label="View by Lesson Material" />}
      />
      <Autocomplete
        multiple
        id="tags-outlined"
        className={classes.autocomplete}
        onChange={(e, value) => {
          autocompleteChange(e, value);
        }}
        options={secondaryValue}
        getOptionLabel={(option) => option.title}
        defaultValue={initValue}
        value={value}
        filterSelectedOptions
        renderInput={(params) => <TextField {...params} variant="outlined" label="View by Lesson Material" />}
      />
    </Box>
  );
}
