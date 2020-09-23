import { Box, Button, Checkbox, FormControlLabel, Hidden, InputAdornment, makeStyles, TextField, TextFieldProps } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import clsx from "clsx";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ breakpoints }) => ({
  searchField: {
    flexGrow: 1,
    flexShrink: 0.5,
    marginLeft: 40,
    marginRight: 20,
    [breakpoints.down("sm")]: {
      marginLeft: 16,
    },
  },
  checkField: (props: SearchcmsListProps) => ({
    flexShrink: 0.5,
    marginRight: 100,
    opacity: props.searchName === "searchOutcome" ? 1 : 0,
  }),
  fieldset: {
    minWidth: 110,
    "&:not(:first-child)": {
      marginRight: 50,
    },
  },
}));

export interface SearchcmsListProps {
  searchName: "searchMedia" | "searchOutcome";
  onSearch: (searchName: SearchcmsListProps["value"]) => any;
  value?: string;
  assumed?: string;
  onCheck?: (assumed: SearchcmsListProps["assumed"]) => any;
}

export const SearchcmsList = (props: SearchcmsListProps) => {
  const css = useStyles(props);
  const { onSearch, onCheck, value, assumed } = props;
  const { getValues, control } = useForm<Pick<SearchcmsListProps, "searchName">>();
  const handleClickSearch = useCallback(() => {
    const { searchName } = getValues();
    onSearch(searchName);
  }, [getValues, onSearch]);

  const handleChangeAssumed = useCallback(
    (e) => {
      if (onCheck) onCheck(e.target.checked ? "true" : "");
    },
    [onCheck]
  );
  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") handleClickSearch();
  };

  return (
    <Box display="flex" pt={3} pb={1} width="100%">
      <Hidden smDown>
        <Controller
          as={TextField}
          control={control}
          onKeyPress={handleKeyPress}
          name="searchName"
          defaultValue={value}
          size="small"
          className={clsx(css.fieldset, css.searchField)}
          placeholder={d("Search").t("library_label_search")}
        />
        <Button
          color="primary"
          variant="contained"
          size="small"
          className={css.fieldset}
          startIcon={<Search />}
          onClick={handleClickSearch}
        >
          {d("Search").t("library_label_search")}
        </Button>
        <FormControlLabel
          className={css.checkField}
          control={<Checkbox checked={Boolean(assumed)} onChange={handleChangeAssumed} color="primary" />}
          label={d("Assumed").t("assess_filter_assumed")}
        />
      </Hidden>
      <Hidden mdUp>
        <Controller
          as={TextField}
          control={control}
          onKeyPress={handleKeyPress}
          name="searchName"
          defaultValue={value}
          size="small"
          className={clsx(css.fieldset, css.searchField)}
          placeholder={d("Search").t("library_label_search")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search style={{ cursor: "pointer" }} onClick={handleClickSearch} />
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          className={css.checkField}
          control={<Checkbox checked={Boolean(assumed)} onChange={handleChangeAssumed} color="primary" />}
          label={d("Assumed").t("assess_filter_assumed")}
        />
      </Hidden>
    </Box>
  );
};
