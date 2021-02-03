import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Hidden,
  InputAdornment,
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
import { apiIsEnableExactSearch } from "../../api/extra";
import { d, reportMiss } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ breakpoints }) => ({
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
  checkField: (props: SearchcmsListProps) => ({
    marginRight: 100,
    [breakpoints.down(1690)]: {
      marginRight: 10,
    },

    [breakpoints.down("md")]: {
      marginRight: 100,
    },
    [breakpoints.down(560)]: {
      marginRight: 10,
    },
  }),
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
  },
  buttonMinWidth: {
    minWidth: 90,
  },
  exactSerch: {
    minWidth: 80,
    height: 40,
    boxSizing: "border-box",
    background: "#F0F0F0",
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  searchText: {
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  searchCon: {
    display: "inline-flex",
    border: "1px solid rgba(0,0,0,0.23)",
    borderRadius: 4,
    boxSizing: "border-box",
  },
}));

export interface SearchcmsListProps {
  searchType: "searchMedia" | "searchOutcome";
  lesson?: string;
  value?: string;
  exactSerch?: string;
  onSearch: (value: SearchcmsListProps["value"], exactSerch?: SearchcmsListProps["exactSerch"]) => any;
  assumed?: string;
  onCheckAssumed?: (assumed: SearchcmsListProps["assumed"]) => any;
  isShare?: string;
  onCheckShare?: (isShare: SearchcmsListProps["isShare"]) => any;
}

export const SearchcmsList = (props: SearchcmsListProps) => {
  const css = useStyles(props);
  const { searchType, lesson, onSearch, onCheckAssumed, exactSerch = "all", value, assumed, isShare, onCheckShare } = props;
  const { getValues, control } = useForm<Pick<SearchcmsListProps, "value" | "exactSerch">>();
  const enableExactSearch = apiIsEnableExactSearch();
  const handleClickSearch = useCallback(() => {
    const { value, exactSerch } = getValues();
    onSearch(value, exactSerch);
  }, [getValues, onSearch]);
  const handleChangeAssumed = useCallback(
    (e) => {
      if (onCheckAssumed) onCheckAssumed(e.target.checked ? "true" : "");
    },
    [onCheckAssumed]
  );
  const handleChangeShare = useCallback(
    (e, value) => {
      if (onCheckShare) onCheckShare(value);
    },
    [onCheckShare]
  );
  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") handleClickSearch();
  };
  return (
    <Box>
      <Box display="flex" justifyContent="center" pt={3} pb={1} width="100%">
        {(!enableExactSearch || searchType === "searchOutcome") && (
          <Hidden smDown>
            <Controller
              as={TextField}
              control={control}
              onKeyPress={handleKeyPress}
              name="value"
              defaultValue={value}
              size="small"
              className={clsx(css.fieldset, css.searchField)}
              placeholder={d("Search").t("library_label_search")}
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
          </Hidden>
        )}
        {searchType === "searchMedia" && enableExactSearch && (
          <Hidden smDown>
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
                      <TextField {...exactSerchProps} select className={css.exactSerch} size="small">
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                      </TextField>
                      <TextField
                        {...valueProps}
                        size="small"
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
          </Hidden>
        )}
        <Hidden mdUp>
          <Controller
            as={TextField}
            control={control}
            onKeyPress={handleKeyPress}
            name="value"
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
        </Hidden>
        {searchType === "searchOutcome" && (
          <FormControlLabel
            className={css.checkField}
            control={<Checkbox checked={Boolean(assumed)} onChange={handleChangeAssumed} color="primary" />}
            label={d("Assumed").t("assess_filter_assumed")}
          />
        )}

        {searchType === "searchMedia" && lesson === "plan" && (
          <Hidden smDown>
            <RadioGroup value={isShare} onChange={handleChangeShare} className={css.radioGroup}>
              <FormControlLabel
                value="org"
                control={<Radio size="small" color="primary" />}
                label={<Typography variant="body2">{reportMiss("Org", "library_label_org")}</Typography>}
              />
              <FormControlLabel
                value="badanamu"
                control={<Radio size="small" color="primary" />}
                label={<Typography variant="body2">{reportMiss("Badanamu", "library_label_Badanamu")}</Typography>}
              />
            </RadioGroup>
          </Hidden>
        )}
      </Box>
      <Hidden mdUp>
        {searchType === "searchMedia" && lesson === "plan" && (
          <Box display="flex" justifyContent="center">
            <RadioGroup value={isShare} onChange={handleChangeShare} className={css.radioGroup}>
              <FormControlLabel
                value="org"
                control={<Radio size="small" color="primary" />}
                label={<Typography variant="body2">{reportMiss("Org", "library_label_org")}</Typography>}
              />
              <FormControlLabel
                value="badanamu"
                control={<Radio size="small" color="primary" />}
                label={<Typography variant="body2">{reportMiss("Badanamu", "library_label_Badanamu")}</Typography>}
              />
            </RadioGroup>
          </Box>
        )}
      </Hidden>
    </Box>
  );
};
