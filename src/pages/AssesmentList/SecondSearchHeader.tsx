import { Grid, InputAdornment } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import TextField, { TextFieldProps } from "@material-ui/core/TextField/TextField";
import { Search } from "@material-ui/icons";
import produce from "immer";
import React, { ChangeEvent, useState } from "react";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { AssessmentQueryCondition, AssessmentQueryConditionBaseProps } from "./types";

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
  searchText: {
    width: "34%",
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
  const { value, onChange } = props;
  const [searchText, setSearchText] = useState<AssessmentQueryCondition["teacher_name"]>();
  const handleChangeSearchText = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const handleClickSearch = () => {
    const newValue = produce(value, (draft) => {
      searchText ? (draft.teacher_name = searchText) : delete draft.teacher_name;
    });
    onChange({ ...newValue, page: 1 });
  };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Grid container spacing={3}>
            <Grid item xs={8} sm={8}>
              <Button
                variant="contained"
                color="primary"
                className={classes.createBtn}
                href="/library/content-edit/lesson/material/tab/details/rightside/contentH5p"
              >
                {d("Create").t("assess_label_create")} +
              </Button>
            </Grid>
            <Grid container item xs={4} sm={4} justify="flex-end" alignItems="center" style={{ fontSize: "24px" }}></Grid>
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

export interface SecondSearchHeaderProps extends AssessmentQueryConditionBaseProps {}
export function SecondSearchHeader(props: SecondSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const [searchText, setSearchText] = useState<AssessmentQueryCondition["teacher_name"]>();
  const handleClickSearch = () => {
    const newValue = produce(value, (draft) => {
      searchText ? (draft.teacher_name = searchText) : delete draft.teacher_name;
    });
    onChange({ ...newValue, page: 1 });
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") handleClickSearch();
  };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3} style={{ marginTop: "6px" }}>
            <Grid item md={10} lg={8} xl={8}>
              <TextField
                size="small"
                className={classes.searchText}
                onKeyPress={handleKeyPress}
                onChange={handleChange}
                placeholder={d("Search").t("assess_label_search")}
                defaultValue={value.teacher_name}
              />
              <Button variant="contained" color="primary" className={classes.searchBtn} onClick={handleClickSearch}>
                <Search /> {d("Search").t("assess_label_search")}
              </Button>
            </Grid>
            <Grid container direction="row" justify="flex-end" alignItems="center" item md={2} lg={4} xl={4}></Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}
