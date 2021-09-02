import { Box, Button, Checkbox, FormControlLabel, Grid, makeStyles, MenuItem, TextField, TextFieldProps } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import clsx from "clsx";
import React, { ReactNode } from "react";
import { Control, Controller } from "react-hook-form";
import { GroupSelect } from "../../components/GroupSelect/GroupSelect";
import { SearchItems } from "../../components/SearchcmsList";
import { d } from "../../locale/LocaleManager";
import { LinkedMockOptions, LinkedMockOptionsItem } from "../../reducers/content";
import { ISearchOutcomeDefault, ISearchOutcomeForm } from "./Outcomes";
const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  searchField: {
    flexGrow: 1,
    marginRight: 20,
    height: 42,
   
  },
  fieldset: {
    marginRight: 30,
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
  checkBox:{
    position: "absolute",
    right:0,
  },
  
  searchTextField: {
    height: 40,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
    // marginRight: 20,
  },
  searchBox: {
    marginTop: 16,
    marginBottom: 8
  }
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
  outcomeSearchDefault: ISearchOutcomeDefault;
}
export const OutcomesSearch = (props: SearchOutcomesProps) => {
  const css = useStyles();
  const {
    handleClickSearch,
    value,
    assumed,
    searchLOListOptions,
    onChangeOutcomeProgram,
    onChangeOutcomeSubject,
    onChangeDevelopmental,
    control,
    children,
    outcomeSearchDefault,
  } = props;
  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") handleClickSearch({});
  };
  return (
    <div>
      <Box display="flex" justifyContent="space-between" pr={30} position="relative" >
        <Controller
          control={control}
          name="value"
          defaultValue={value}
          render={(valueProps) => (
            <Controller
              name="exactSerch"
              control={control}
              defaultValue={"outcome_name"}
              render={(exactSerchProps) => (
                <div className={clsx(css.fieldset, css.searchField, css.searchCon)}>
                  {/* <TextField
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
                  </TextField> */}
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
              className={css.checkBox}
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
      <Grid container spacing={3}  className={css.searchBox} >
        <Grid item xs={6} sm={4} md={3}>
          <Controller
            name="program"
            defaultValue={ outcomeSearchDefault.program ||"all/all"}
            control={control}
            render={({value,onChange}) => (
              <GroupSelect
                value={value}
                onChange={(value) => {
                  onChange(value);
                  handleClickSearch({})
                }}
                list={searchLOListOptions.program || []}
                subList={searchLOListOptions.subject || []}
                onChangeListItem={onChangeOutcomeProgram}
                onChangeSubListItem={onChangeOutcomeSubject}
                label={d("Program - Subject").t("library_label_program_subject")}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
        <Controller
          name="category"
          defaultValue={outcomeSearchDefault.category || "all/all"}
          control={control}
          render={({value,onChange}) => (
            <GroupSelect
              value={value}
              onChange={(value) => {
                onChange(value);
                handleClickSearch({})
              }}
              list={searchLOListOptions.developmental || []}
              subList={searchLOListOptions.skills || []}
              onChangeListItem={onChangeDevelopmental}
              label={d("Category- Subcategory").t("library_label_category_ubcategory")}
            />
          )}
        />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Controller
           name="age_ids"
           defaultValue={outcomeSearchDefault.age_ids || []}
           control={control}
           render={({value,onChange}) => (
             <TextField
              value={value}
              onChange={(value) => {
                onChange(value);
                handleClickSearch({})
              }}
              select
              size="small"
              className={css.searchTextField}
              fullWidth
              SelectProps={{
                multiple: true,
              }}
              label={d("Age").t("library_label_age")}
            >
              {menuItemList(searchLOListOptions.age || [])}
             </TextField>
           )}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Controller
            name="grade_ids"
            defaultValue={outcomeSearchDefault.grade_ids || []}
           control={control}
           render={({value,onChange}) => (
             <TextField
              value={value}
              onChange={(value) => {
                onChange(value);
                handleClickSearch({})
              }}
              select
              size="small"
              className={css.searchTextField}
              fullWidth
              SelectProps={{
                multiple: true,
              }}
              label={d("Grade").t("library_label_grade")}
              >
                {menuItemList(searchLOListOptions.grade || [])}
             </TextField>
           )}
          />
        </Grid>

      </Grid>
      {children}
    </div>
  );
};
