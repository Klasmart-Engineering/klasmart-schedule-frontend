import { Button, makeStyles, MenuItem, TextField, TextFieldProps } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { d } from "../../locale/LocaleManager";
import { BulkListForm } from "./types";

const useStyles = makeStyles((theme) => ({
  searchText: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
      borderRadius: 0,
    },
  },
  exectSearchInput: {
    maxWidth: 128,
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
}));
const SEARCH_TEXT_KEY = "SEARCH_TEXT_KEY";
export const EXECT_SEARCH = "EXECT_SEARCH";
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
export interface SearchComProps {
  searchFieldList: options[];
  searchFieldDefaultValue: string;
  searchTextDefaultValue: string;
  onSearch: () => any;
  formMethods: UseFormMethods<BulkListForm>;
}

export function ListSearch(props: SearchComProps) {
  const css = useStyles();
  const { searchFieldList, searchFieldDefaultValue, searchTextDefaultValue, onSearch, formMethods } = props;
  const { control } = formMethods;
  // const handleClickSearch = () => {
  //   onSearch();
  // }
  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") onSearch();
  };
  return (
    <>
      <div className={css.searchCon}>
        <Controller
          as={TextField}
          name={EXECT_SEARCH}
          control={control}
          className={css.exectSearchInput}
          size="small"
          defaultValue={searchFieldDefaultValue}
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
          {menuItemList(searchFieldList)}
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
          defaultValue={searchTextDefaultValue}
          placeholder={d("Search").t("assess_label_search")}
        />
      </div>
      <Button variant="contained" color="primary" className={css.searchBtn} onClick={onSearch}>
        <Search /> {d("Search").t("assess_label_search")}
      </Button>
    </>
  );
}
