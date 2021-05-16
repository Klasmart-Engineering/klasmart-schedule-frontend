import { Grid, InputAdornment, MenuItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import TextField, { TextFieldProps } from "@material-ui/core/TextField/TextField";
import { Search } from "@material-ui/icons";
import produce from "immer";
import React, { ChangeEvent, useState } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { ExectSeachType } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { SearchListForm, SearchListFormKey, StudyAssessmentQueryCondition, StudyAssessmentQueryConditionBaseProps } from "./types";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: "20px",
  },
  createBtn: {
    width: "125px",
    borderRadius: "23px",
    height: "48px",
    backgroundColor: "#0E78D5",
    textTransform: "capitalize",
  },
  nav: {
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "3px",
    textTransform: "capitalize",
  },
  searchBtn: {
    width: "111px",
    height: "40px",
    backgroundColor: "#0E78D5",
    marginLeft: "20px",
  },
  formControl: {
    minWidth: 136,
    marginLeft: "20px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  switch: {
    display: "none",
    marginRight: "22px",
  },
  navigation: {
    padding: "20px 0px 10px 0px",
  },
  actives: {
    color: "#0E78D5",
  },
  tabMb: {
    textAlign: "right",
    position: "relative",
  },
  switchBtn: {
    width: "60px",
    height: "40px",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  tabs: {
    minHeight: "42px",
    height: "42px",
  },
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
}));
export enum AssessmentType {
  classLive = "classLive",
  homeFun = "homeFun",
  study = "study",
}
export interface options {
  label?: string;
  value?: string;
}
export const assessmentTypes = () => {
  return [
    { label: d("Class / Live").t("assess_class_type_class_live"), value: AssessmentType.classLive },
    { label: d("Study / Home Fun").t("assess_class_type_homefun"), value: AssessmentType.homeFun },
    { label: "Study", value: AssessmentType.study },
  ];
};
const menuItemList = (list: options[]) =>
  list.map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
export function SecondSearchHeaderMb(props: SecondSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const [searchText, setSearchText] = useState<StudyAssessmentQueryCondition["query"]>();
  const handleChangeSearchText = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const handleClickSearch = () => {
    const newValue = produce(value, (draft) => {
      searchText ? (draft.query = searchText) : delete draft.query;
    });
    onChange({ ...newValue, page: 1 });
  };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
              <TextField
                style={{ width: "100%", height: "100%" }}
                value={searchText}
                onChange={handleChangeSearchText}
                onBlur={handleClickSearch}
                label={d("Search").t("assess_label_search")}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search style={{ cursor: "pointer" }} onClick={handleClickSearch} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

const searchFieldList = () => {
  return [
    {label: d("All").t("assess_search_all"), value: ExectSeachType.all},
    {label: "CLass Name", value: ExectSeachType.class_name},
    {label: "Teacher Name", value: ExectSeachType.teacher_name},
  ]
};
export interface SecondSearchHeaderProps extends StudyAssessmentQueryConditionBaseProps {
  onChangeAssessmentType: (assessmentType: AssessmentType) => any;
  formMethods: UseFormMethods<SearchListForm>;
}
export function SecondSearchHeader(props: SecondSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange, onChangeAssessmentType, formMethods } = props;
  const { control } = formMethods;
  const handleClickSearch = () => {
    // const newValue = produce(value, (draft) => {
    //   searchText ? (draft.query = searchText) : delete draft.query;
    // });
    onChange({ ...value, page: 1 });
    
  };

  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") handleClickSearch();
  };
  const handleChangeAssessmentType = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeAssessmentType(event.target.value as AssessmentType);
  };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3} style={{ marginTop: "6px" }}>
            <Grid item md={10} lg={8} xl={8}>
              <div className={classes.searchCon}>
                <Controller
                  as={TextField}
                  control={control}
                  name={SearchListFormKey.EXECT_SEARCH}
                  className={classes.exectSearchInput}
                  size="small"
                  select
                  SelectProps={{
                    MenuProps: {
                      transformOrigin: {
                        vertical: -40,
                        horizontal: "left",
                      },
                    },
                  }}
                  defaultValue={value.query_type}
                >
                  {menuItemList(searchFieldList())}
                </Controller>
                <Controller
                  as={TextField}
                  control={control}
                  name={SearchListFormKey.SEARCH_TEXT}
                  style={{
                    borderLeft: 0,
                  }}
                  size="small"
                  className={classes.searchText}
                  onKeyPress={handleKeyPress}
                  placeholder={d("Search").t("assess_label_search")}
                  defaultValue={value.query}
                />
              </div>
              <Button variant="contained" color="primary" className={classes.searchBtn} onClick={handleClickSearch}>
                <Search /> {d("Search").t("assess_label_search")}
              </Button>
              <TextField
                style={{ width: 160, marginLeft: 10 }}
                size="small"
                onChange={handleChangeAssessmentType}
                // label={d("Content Type").t("library")}
                defaultValue={AssessmentType.study}
                select
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              >
                {menuItemList(assessmentTypes())}
              </TextField>
            </Grid>
            <Grid container direction="row" justify="flex-end" alignItems="center" item md={2} lg={4} xl={4}></Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}
