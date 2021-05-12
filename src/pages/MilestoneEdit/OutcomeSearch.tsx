import { Button, Checkbox, FormControlLabel, makeStyles, MenuItem, TextField, TextFieldProps } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MilestoneCondition } from ".";
import { d } from "../../locale/LocaleManager";
import { OutcomeListExectSearch } from "../OutcomeList/types";
const useStyles = makeStyles((theme) => ({
  searchWrap: {
    margin: "20px 8px",
    display: "flex",
    justifyContent: "space-between",
  },
  searchText: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
      borderRadius: 0,
    },
  },
  exectSearchInput: {
    maxWidth: 95,
    marignRgiht: -10,
    height: 40,
    boxSizing: "border-box",
    background: "#F0F0F0",
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  searchCon: {
    display: "inline-flex",
    border: "1px solid rgba(0,0,0,0.23)",
    borderRadius: 4,
    boxSizing: "border-box",
    verticalAlign: "top",
  },
  searchBtn: {
    width: "111px",
    height: "40px",
    backgroundColor: "#0E78D5",
    marginLeft: "20px",
  },
  checkField: {},
}));
const EXECT_SEARCH = "EXECT_SEARCH";
const SEARCH_TEXT_KEY = "SEARCH_TEXT_KEY";
const getOutcomeListExectSearch = () => {
  return [
    {
      label: d("All").t("assess_filter_all"),
      value: OutcomeListExectSearch.all,
    },
    {
      label: d("Author").t("assess_label_author"),
      value: OutcomeListExectSearch.author,
    },
    {
      label: d("Description").t("assess_label_description"),
      value: OutcomeListExectSearch.description,
    },
    {
      label: d("Keywords").t("assess_label_keywords"),
      value: OutcomeListExectSearch.keyWord,
    },
    {
      label: d("Learning Outcome Name").t("assess_label_learning_outcome_name"),
      value: OutcomeListExectSearch.loName,
    },
    {
      label: d("Learning Outcome Set").t("assess_set_learning_outcome_set"),
      value: OutcomeListExectSearch.loSet,
    },
    {
      label: d("Short Code").t("assess_label_short_code"),
      value: OutcomeListExectSearch.shortCode,
    },
  ];
};
export interface options {
  label?: string;
  value?: string;
}
const menuItemList = (list: options[]) =>
  list.map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
export interface OutcomeSearchProps {
  condition: MilestoneCondition;
  onSearch: (exect_search: string, search_key: string, assumed: boolean) => any;
}
export default function OutcomeSearch(props: OutcomeSearchProps) {
  const { onSearch, condition } = props;
  const css = useStyles();
  const formMethods = useForm();
  const { control, getValues } = formMethods;
  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") {
      handleClickSearch();
    }
  };
  const handleClickSearch = () => {
    const searchField = getValues()[EXECT_SEARCH];
    const searchText = getValues()[SEARCH_TEXT_KEY];
    const assumed = getValues()["assumed"];
    onSearch(searchField, searchText, assumed);
  };
  return (
    <div className={css.searchWrap}>
      <div>
        <div className={css.searchCon}>
          <Controller
            as={TextField}
            control={control}
            name={EXECT_SEARCH}
            className={css.exectSearchInput}
            size="small"
            defaultValue={condition.exect_search}
            select
            SelectProps={{
              MenuProps: {
                transformOrigin: {
                  vertical: -40,
                  horizontal: "left",
                },
              },
            }}
          >
            {menuItemList(getOutcomeListExectSearch())}
          </Controller>
          <Controller
            style={{
              borderLeft: 0,
            }}
            as={TextField}
            name={SEARCH_TEXT_KEY}
            control={control}
            size="small"
            className={css.searchText}
            onKeyPress={handleKeyPress}
            defaultValue={condition.search_key}
            placeholder={d("Search").t("assess_label_search")}
          />
        </div>
        <Button variant="contained" color="primary" className={css.searchBtn} onClick={handleClickSearch}>
          <Search /> {d("Search").t("assess_label_search")}
        </Button>
      </div>
      <Controller
        name="assumed"
        defaultValue={condition.assumed}
        control={control}
        render={(assumedProps) => (
          <FormControlLabel
            className={css.checkField}
            control={
              <Checkbox
                checked={assumedProps.value}
                onChange={(e) => {
                  assumedProps.onChange(e.target.checked);
                  handleClickSearch();
                }}
                color="primary"
              />
            }
            label={d("Assumed").t("assess_filter_assumed")}
          />
        )}
      />
    </div>
  );
}
