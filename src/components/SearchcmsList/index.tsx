import { Box, Button, Checkbox, FormControlLabel, makeStyles, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import clsx from "clsx";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";

const useStyles = makeStyles({
  searchField: {
    flexGrow: 1,
    flexShrink: 0.5,
    marginLeft: 40,
  },

  checkField: (props: SearchcmsListProps) => ({
    flexShrink: 0.5,
    marginRight: 100,
    opacity: props.searchName === "searchMedia" ? 0 : 1,
  }),
  fieldset: {
    minWidth: 110,
    "&:not(:first-child)": {
      marginLeft: 16,
      marginRight: 50,
    },
  },
});

interface SearchcmsListProps {
  searchName: "searchMedia" | "searchOutcomes";
  onSearch: (searchName: SearchcmsListProps["value"]) => any;
  value?: string;
  assumed?: boolean;
}

export const SearchcmsList = (props: SearchcmsListProps) => {
  const css = useStyles(props);
  const { onSearch, value, assumed } = props;
  const { getValues, control } = useForm<Pick<SearchcmsListProps, "searchName">>();
  const handleClickSearch = useCallback(() => {
    const { searchName } = getValues();
    onSearch(searchName);
  }, [getValues, onSearch]);

  const handleChangeAssumed = useCallback((e) => {
    console.log(e.target.checked);
  }, []);

  return (
    <Box display="flex" pt={3} pb={1} width="100%">
      <Controller
        as={TextField}
        control={control}
        name="searchName"
        defaultValue={value}
        size="small"
        className={clsx(css.fieldset, css.searchField)}
        placeholder="Search"
      />
      <Button color="primary" variant="contained" size="small" className={css.fieldset} startIcon={<Search />} onClick={handleClickSearch}>
        Search
      </Button>
      <FormControlLabel
        className={css.checkField}
        control={<Checkbox checked={assumed} onChange={handleChangeAssumed} color="primary" />}
        label="Assumed"
      />
    </Box>
  );
};
