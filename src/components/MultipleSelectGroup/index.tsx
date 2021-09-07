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
      "& .MuiAutocomplete-tag": {
        maxWidth: "calc(100% - 44px)",
      },
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
    enum: number;
  }[];
  changeAutocompleteValue: (value: MultipleChildProps[]) => void;
  changeAutocompleteDimensionValue: (value: number) => void;
}

export default function MultipleSelectGroup(props: MultipleGroupProps) {
  const classes = useStyles();
  const initValue = [{ id: 1, title: d("Select All").t("schedule_detail_select_all") }];
  const { groupCollect, changeAutocompleteValue, changeAutocompleteDimensionValue } = props;
  const [secondaryValue, setSecondaryValue] = React.useState<MultipleChildProps[]>(groupCollect[0].data);
  const [value, setValue] = React.useState<MultipleChildProps[]>(initValue);
  const [current, setCurrent] = React.useState<number>(1);

  const deduplication = (childItem: MultipleChildProps[]) => {
    const reduceTemporaryStorage: { [id: string]: boolean } = {};
    return childItem.reduce<MultipleChildProps[]>((item, next) => {
      if (next !== null)
        if (!reduceTemporaryStorage[next.id as string] && next.id) {
          item.push(next);
          reduceTemporaryStorage[next.id as string] = true;
        }
      return item;
    }, []);
  };

  const autocompleteChange = async (e: React.ChangeEvent<{}>, value: MultipleChildProps[]) => {
    const result = value.length > 1 ? value.filter((v) => v.id !== 1) : value;
    if (result.length && value[value.length - 1].id === 1) {
      setValue(initValue);
      changeAutocompleteValue(initValue);
    } else {
      setValue(deduplication(result));
      changeAutocompleteValue(result);
    }
  };

  const autocompleteDimensionChange = async (e: React.ChangeEvent<{ value: String | Number }>) => {
    const value = e.target.value;
    const collect = groupCollect.filter((collect) => collect.enum === e.target.value);
    setSecondaryValue(value ? collect[0].data ?? [] : []);
    setValue(value ? initValue : []);
    changeAutocompleteDimensionValue(value as number);
    changeAutocompleteValue(initValue);
    setCurrent(collect[0].enum);
  };

  const getGroupCollect = () => {
    return groupCollect[current === 1 ? 0 : 1].data ?? [];
  };

  return (
    <Box className={classes.root}>
      <TextField
        defaultValue={groupCollect[0].enum}
        className={classes.autocomplete}
        onChange={(e) => autocompleteDimensionChange(e)}
        select
        required
      >
        {groupCollect.map((collect) => (
          <MenuItem key={collect.enum} value={collect.enum}>
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
        options={[...initValue, ...(secondaryValue.length ? secondaryValue : getGroupCollect())]}
        getOptionLabel={(option) => option.title}
        defaultValue={initValue}
        value={value}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label={d("Please select here").t("assess_detail_please_select_here")} />
        )}
      />
    </Box>
  );
}
