import {
  Box,
  Button,
  FormControlLabel,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import clsx from "clsx";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { d } from "../../locale/LocaleManager";
const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  searchField: {
    flexGrow: 1,
    marginLeft: 24,
    marginRight: 20,
    height: 42,
    [breakpoints.down(1690)]: {
      marginLeft: 10,
    },
    [breakpoints.down("md")]: {
      marginLeft: 40,
    },
    [breakpoints.down(560)]: {
      marginLeft: 10,
    },
  },
  fieldset: {
    marginRight: 30,
    [breakpoints.down(1690)]: {
      marginRight: 10,
    },
    [breakpoints.down("md")]: {
      marginRight: 40,
    },
    [breakpoints.down(560)]: {
      marginRight: 10,
    },
  },
  radioGroup: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
  },
  buttonMinWidth: {
    minWidth: 90,
  },
  exactSerch: {
    minWidth: 80,
    height: 40,
    boxSizing: "border-box",
    background: "#F0F0F0",
    "& .schedule-MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  searchText: {
    flex: 1,
    "& .schedule-MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  searchCon: {
    display: "inline-flex",
    border: "1px solid rgba(0,0,0,0.23)",
    borderRadius: 4,
    boxSizing: "border-box",
  },
  selectRadioInline: {
    display: "block",
    [breakpoints.down("sm")]: {
      display: "none",
    },
    [breakpoints.up(1280)]: {
      display: "none",
    },
    [breakpoints.up(1690)]: {
      display: "block",
    },
  },
  selectRadioWrap: {
    display: "none",
    [breakpoints.down("sm")]: {
      display: "block",
    },
    [breakpoints.up(1280)]: {
      display: "block",
    },
    [breakpoints.up(1690)]: {
      display: "none",
    },
  },
}));
interface ISearchOptions {
  program_ids?: string[];
  subject_ids?: string[];
  category_ids?: string[];
  sub_category_ids?: string[];
  age_ids?: string[];
  grade_ids?: string[];
}
export interface SearchItems extends ISearchOptions {
  value?: string;
  exactSerch?: string;
  assumed?: boolean;
  isShare?: string;
  page?: number;
}

export interface SearchcmsListProps extends SearchItems {
  lesson?: string;
  onSearch: (query: SearchItems) => any;
}
export const SearchcmsList = (props: SearchcmsListProps) => {
  const css = useStyles(props);
  const { lesson, onSearch, exactSerch = "all", value, isShare } = props;
  const { getValues, control } = useForm<SearchItems>();
  const handleClickSearch = useCallback(() => {
    onSearch(getValues());
  }, [getValues, onSearch]);

  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") handleClickSearch();
  };
  const selectRadio = lesson === "plan" && (
    <Controller
      name="isShare"
      control={control}
      defaultValue={isShare || "org"}
      render={(isShareProps) => (
        <RadioGroup
          value={isShareProps.field.value}
          onChange={(e) => {
            isShareProps.field.onChange(e.target.value);
            handleClickSearch();
          }}
          className={css.radioGroup}
        >
          <FormControlLabel
            value="org"
            control={<Radio size="small" color="primary" />}
            label={<Typography variant="body2">{d("Org").t("library_label_org")}</Typography>}
          />
          <FormControlLabel
            value="badanamu"
            control={<Radio size="small" color="primary" />}
            label={<Typography variant="body2">{d("Badanamu").t("library_label_badanamu")}</Typography>}
          />
        </RadioGroup>
      )}
    />
  );
  return (
    <Box>
      <Box display="flex" justifyContent="center" pb={1} width="100%">
        <Controller
          control={control}
          name="value"
          defaultValue={value}
          render={(valueProps) => (
            <Controller
              name="exactSerch"
              control={control}
              defaultValue={exactSerch}
              render={(exactSerchProps) => (
                <div className={clsx(css.fieldset, css.searchField, css.searchCon)}>
                  <TextField
                    defaultValue={exactSerchProps.field.value}
                    onChange={(e) => {
                      exactSerchProps.field.onChange(e.target.value);
                      handleClickSearch();
                    }}
                    select
                    className={css.exactSerch}
                    size="small"
                  >
                    <MenuItem value="all">{d("All").t("assess_search_all")}</MenuItem>
                    <MenuItem value="name">{d("Name").t("library_label_name")}</MenuItem>
                  </TextField>
                  <TextField
                    {...valueProps}
                    size="small"
                    fullWidth
                    className={css.searchText}
                    onKeyPress={handleKeyPress}
                    placeholder={d("Search").t("library_label_search")}
                  />
                </div>
              )}
            />
          )}
        />
        <Button
          color="primary"
          variant="contained"
          size="small"
          className={clsx(css.buttonMinWidth, css.fieldset)}
          startIcon={<Search />}
          onClick={handleClickSearch}
        >
          {d("Search").t("library_label_search")}
        </Button>
        <div className={css.selectRadioInline}>{selectRadio}</div>
      </Box>
      <div className={css.selectRadioWrap}>{selectRadio}</div>
    </Box>
  );
};
