import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  TextFieldProps,
  Typography
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import clsx from "clsx";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { d } from "../../locale/LocaleManager";
import { menuItemList } from "../../pages/ContentEdit/Details";
import { LinkedMockOptions } from "../../reducers/content";
import { decodeOneItemArray, encodeOneItemArray, FormattedTextField } from "../FormattedTextField";
const useStyles = makeStyles(({ breakpoints,shadows, palette }) => ({
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
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  searchText: {
    flex: 1,
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
  searchTextField: {
      width: 200,
      height: 40,
      backgroundColor: "white",
      borderRadius: 4,
      // boxShadow: shadows[3],
      color: palette.text.primary,
      marginRight: 20,
  }
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
}

export interface SearchcmsListProps extends SearchItems {
  lesson?: string;
  onSearch: (query: SearchItems) => any;
}
export const SearchcmsList = (props: SearchcmsListProps) => {
  const css = useStyles(props);
  const { lesson, onSearch, exactSerch = "all", value,isShare } = props;
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
          value={isShareProps.value}
          onChange={(e) => {
            isShareProps.onChange(e.target.value);
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
                    defaultValue={exactSerchProps.value}
                    onChange={(e) => {
                      exactSerchProps.onChange(e.target.value);
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
export interface SearchOutcomesProps extends SearchItems {
  onSearch: (query: SearchItems) => any;
  onChangeOutcomeProgram: (value: string) => any;
  onChangeOutcomeSubject: (value: string[]) => any;
  onChangeDevelopmental: (value: string[]) => any
  searchLOListOptions: LinkedMockOptions;
}
export const SearchOutcoms = (props: SearchOutcomesProps) => {
  const css = useStyles(props);
  const { onSearch, exactSerch , value, assumed, 
    searchLOListOptions, 
    onChangeOutcomeProgram, 
    onChangeOutcomeSubject, 
    onChangeDevelopmental,
    program_ids,
    subject_ids,
    category_ids,
    sub_category_ids,
    age_ids,
    grade_ids, } = props;
  const { getValues, control } = useForm<SearchItems>();
  const handleClickSearch = useCallback(() => {
    onSearch(getValues());
  }, [getValues, onSearch]);
  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") handleClickSearch();
  };
  return (
   <div>
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
                  defaultValue={exactSerchProps.value}
                  onChange={(e) => {
                    exactSerchProps.onChange(e.target.value);
                    handleClickSearch();
                  }}
                  select
                  className={css.exactSerch}
                  size="small"
                >
                  <MenuItem value="search_key">{d("All").t("assess_filter_all")}</MenuItem>
                  <MenuItem value="author_name">{d("Author").t("assess_label_author")}</MenuItem>
                  <MenuItem value="shortcode">{d("Code").t("assess_search_code")}</MenuItem>
                  <MenuItem value="description">{d("Description").t("assess_label_description")}</MenuItem>
                  <MenuItem value="keywords">{d("Keywords").t("assess_label_keywords")}</MenuItem>
                  <MenuItem value="outcome_name">{d("Name").t("assess_search_name")}</MenuItem>
                  <MenuItem value="set_name">{d("Set").t("assess_search_set")}</MenuItem>
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
      <Controller
        name="assumed"
        defaultValue={assumed}
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
       </Box>
      <Box display="flex" justifyContent="center" pb={1} width="100%">
      <Controller
        name="program_ids"
        defaultValue={program_ids||[]}
        control={control}
        render={(props) => (
          <TextField
            select
            size="small"
            className={css.searchTextField}
            label={d("Program").t("library_label_program")}
            {...props}
            onChange={(e) => {
              onChangeOutcomeProgram(e.target.value);
              props.onChange(e.target.value);
            }}
          >
            {menuItemList(searchLOListOptions.program || [])}
          </TextField>
        )}
      />
      <Controller
        name="subject_ids"
        defaultValue={subject_ids|| []}
        control={control}
        render={(props) => (
          <TextField
            select
            SelectProps={{
              multiple: true,
            }}
            className={css.searchTextField}
            size="small"
            label={d("Subject").t("library_label_subject")}
            {...props}
            onChange={(e) => {
              const value = (e.target.value as unknown) as string[];
              value.length > 0 && onChangeOutcomeSubject(value);
              value.length > 0 && props.onChange(value);
            }}
          >
            {menuItemList(searchLOListOptions.subject || [])}
          </TextField>
        )}
      />
      <Controller
            name="category_ids"
            defaultValue={category_ids||[]}
            control={control}
            rules={{
              validate: (value) => !!value[0],
            }}
            render={(props) => (
              <FormattedTextField
                select
                size="small"
                className={css.searchTextField}
                label={d("Category").t("library_label_category")}
                encode={encodeOneItemArray}
                decode={decodeOneItemArray}
                {...props}
                onChange={(value: ReturnType<typeof decodeOneItemArray>) => {
                  onChangeDevelopmental(value);
                  props.onChange(value);
                }}
              >
                {menuItemList(searchLOListOptions.developmental || [])}
              </FormattedTextField>
            )}
          />

      </Box>
      <Box display="flex" justifyContent="center" pb={1} width="100%">
      <Controller
            as={TextField}
            name="sub_category_ids"
            defaultValue={sub_category_ids || []}
            control={control}
            select
            size="small"
            className={css.searchTextField}
            SelectProps={{
              multiple: true,
            }}
            label={d("Subcategory").t("library_label_subcategory")}
          >
            {menuItemList(searchLOListOptions.skills || [])}
          </Controller>
          <Controller
            as={TextField}
            name="age_ids"
            defaultValue={age_ids|| []}
            control={control}
            select
            size="small"
            className={css.searchTextField}
            SelectProps={{
              multiple: true,
            }}
            label={d("Age").t("library_label_age")}
          >
            {menuItemList(searchLOListOptions.age || [])}
          </Controller>
          <Controller
            as={TextField}
            name="grade"
            defaultValue={grade_ids || []}
            control={control}
            select
            size="small"
            className={css.searchTextField}
            SelectProps={{
              multiple: true,
            }}
            label={d("Grade").t("library_label_grade")}
          >
            {menuItemList(searchLOListOptions.grade || [])}
          </Controller>
      </Box>
  </div>

  );
};
