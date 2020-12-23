import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Hidden,
  InputAdornment,
  makeStyles,
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
import { d, reportMiss } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ breakpoints }) => ({
  searchField: {
    flexGrow: 1,
    flexShrink: 0.5,
    marginLeft: 24,
    marginRight: 20,
    height: 42,
    [breakpoints.down(1460)]: {
      marginLeft: 15,
      // marginRight: 10,
    },
    [breakpoints.down("md")]: {
      marginLeft: 40,
    },
    [breakpoints.down(560)]: {
      marginLeft: 10,
    },
  },
  checkField: (props: SearchcmsListProps) => ({
    flexShrink: 0.5,
    marginRight: 100,
    // opacity: props.searchName === "searchOutcome" ? 1 : 0,
    [breakpoints.down(1690)]: {
      marginRight: 10,
    },
    [breakpoints.down(1460)]: {
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
    // minWidth: 90,
    marginRight: 30,
    [breakpoints.down(1460)]: {
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
    width: 90,
  },
}));

export interface SearchcmsListProps {
  searchType: "searchMedia" | "searchOutcome";
  lesson?: string;
  value?: string;
  onSearch: (value: SearchcmsListProps["value"]) => any;
  assumed?: string;
  onCheckAssumed?: (assumed: SearchcmsListProps["assumed"]) => any;
  isShare?: string;
  onCheckShare?: (isShare: SearchcmsListProps["isShare"]) => any;
}

export const SearchcmsList = (props: SearchcmsListProps) => {
  const css = useStyles(props);
  const { searchType, lesson, onSearch, onCheckAssumed, value, assumed, isShare, onCheckShare } = props;
  const { getValues, control } = useForm<Pick<SearchcmsListProps, "value">>();
  const handleClickSearch = useCallback(() => {
    const { value } = getValues();
    onSearch(value);
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
          // <FormControlLabel
          //   className={css.checkField}
          //   control={<Checkbox checked={Boolean(isShare)} onChange={handleChangeShare} color="primary" />}
          //   label="Badanamu Content"
          // />
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
