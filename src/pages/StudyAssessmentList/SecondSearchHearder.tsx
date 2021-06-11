import { Grid } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { UseFormMethods } from "react-hook-form";
import { ExectSeachType } from "../../api/type";
import { AssessmentType, AssessmentTypeValues } from "../../components/AssessmentType";
import LayoutBox from "../../components/LayoutBox";
import { ListSearch } from "../../components/ListSearch";
import { d } from "../../locale/LocaleManager";
import { SearchListForm, StudyAssessmentQueryConditionBaseProps } from "./types";

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
}));

export function SecondSearchHeaderMb(props: SecondSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange, formMethods } = props;
  const handleClickSearch = () => {
    onChange({ ...value, page: 1 });
  };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <ListSearch
                searchTextDefaultValue={value.query}
                searchFieldDefaultValue={value.query_type}
                searchFieldList={searchFieldList()}
                onSearch={handleClickSearch}
                formMethods={formMethods}
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
    { label: d("All").t("assess_search_all"), value: ExectSeachType.all },
    // { label: "CLass Name", value: ExectSeachType.class_name },
    { label: d("Teacher Name").t("schedule_label_teacher_name"), value: ExectSeachType.teacher_name },
  ];
};
export interface SecondSearchHeaderProps extends StudyAssessmentQueryConditionBaseProps {
  onChangeAssessmentType: (assessmentType: AssessmentTypeValues) => any;
  formMethods: UseFormMethods<SearchListForm>;
}
export function SecondSearchHeader(props: SecondSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange, onChangeAssessmentType, formMethods } = props;
  const handleClickSearch = () => {
    // const newValue = produce(value, (draft) => {
    //   searchText ? (draft.query = searchText) : delete draft.query;
    // });
    onChange({ ...value, page: 1 });
  };
  // const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
  //   if (event.key === "Enter") handleClickSearch();
  // };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3} style={{ marginTop: "6px" }}>
            <Grid item md={10} lg={8} xl={8}>
              {/* <div className={classes.searchCon}>
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
              </Button> */}
              <ListSearch
                searchTextDefaultValue={value.query}
                searchFieldDefaultValue={value.query_type}
                searchFieldList={searchFieldList()}
                onSearch={handleClickSearch}
                formMethods={formMethods}
              />
              <AssessmentType type={AssessmentTypeValues.study} onChangeAssessmentType={onChangeAssessmentType} />
            </Grid>
            <Grid container direction="row" justify="flex-end" alignItems="center" item md={2} lg={4} xl={4}></Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}
