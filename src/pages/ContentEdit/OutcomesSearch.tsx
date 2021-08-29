import { Box, Button, Checkbox, FormControlLabel, makeStyles, MenuItem, TextField, TextFieldProps } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import clsx from "clsx";
import React, { ReactNode } from "react";
import { Control, Controller } from "react-hook-form";
import { GroupSelect } from "../../components/GroupSelect/GroupSelect";
import { SearchItems } from "../../components/SearchcmsList";
import { d } from "../../locale/LocaleManager";
import { LinkedMockOptions, LinkedMockOptionsItem } from "../../reducers/content";
import { ISearchOutcomeForm } from "./Outcomes";
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
  checkField: () => ({
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
    width: 180,
    height: 40,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
    marginRight: 20,
  },
}));

export const menuItemList = (list?: LinkedMockOptionsItem[]) =>
  list?.map((item) => (
    <MenuItem key={item.id} value={item.id}>
      {item.name}
    </MenuItem>
  ));

export interface SearchOutcomesProps extends SearchItems {
  handleClickSearch: (props: {
    page?: number;
    order_by?: "name" | "-name" | "created_at" | "-created_at" | "updated_at" | "-updated_at";
  }) => any;
  onChangeOutcomeProgram: (value: string) => any;
  onChangeOutcomeSubject: (value: string[]) => any;
  onChangeDevelopmental: (value: string) => any;
  searchLOListOptions: LinkedMockOptions;
  children: ReactNode;
  control: Control<ISearchOutcomeForm>;
}
export const OutcomesSearch = (props: SearchOutcomesProps) => {
  const css = useStyles();
  const {
    handleClickSearch,
    exactSerch,
    value,
    assumed,
    searchLOListOptions,
    onChangeOutcomeProgram,
    onChangeOutcomeSubject,
    onChangeDevelopmental,
    age_ids,
    grade_ids,
    control,
    children,
  } = props;
  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") handleClickSearch({});
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
                      handleClickSearch({});
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
          onClick={() => handleClickSearch({})}
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
                    handleClickSearch({});
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
          name="program"
          defaultValue={"all/all"}
          control={control}
          render={(props) => (
            <GroupSelect
              {...props}
              list={searchLOListOptions.program || []}
              subList={searchLOListOptions.subject || []}
              onChangeListItem={onChangeOutcomeProgram}
              onChangeSubListItem={onChangeOutcomeSubject}
              label="Program - Subject"
            />
          )}
        />
        <Controller
          name="category"
          defaultValue={"all/all"}
          control={control}
          render={(props) => (
            <GroupSelect
              {...props}
              list={searchLOListOptions.developmental || []}
              subList={searchLOListOptions.skills || []}
              onChangeListItem={onChangeDevelopmental}
              label="Category- Subcategory"
            />
          )}
        />
        <Controller
          as={TextField}
          name="age_ids"
          defaultValue={age_ids || []}
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
          name="grade_ids"
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
      {children}
    </div>
  );
};
