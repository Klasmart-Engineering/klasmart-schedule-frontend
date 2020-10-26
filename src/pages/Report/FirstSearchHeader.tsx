import { Grid, Tab, Tabs } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { PublishOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import LayoutBox from "../../components/LayoutBox";
import { reportMiss } from "../../locale/LocaleManager";
import { PendingBlueIcon, PendingIcon } from "../OutcomeList/Icons";
import { QueryCondition, QueryConditionBaseProps } from "./types";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 20,
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

export enum Category {
  archived = "archived",
  learningOutcomes = "learningOutcomes",
}
export interface FirstSearchHeaderProps extends QueryConditionBaseProps {}
export default function FirstSearchHeader(props: FirstSearchHeaderProps) {
  const css = useStyles();
  const { value, onChange } = props;
  const createHandleClick = (category: QueryCondition["category"]) => () => onChange({ category });
  return (
    <div className={css.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3}>
            <Grid item md={3} lg={5} xl={7}></Grid>
            <Grid container direction="row" justify="space-evenly" alignItems="center" item md={9} lg={7} xl={5}>
              <Button
                onClick={createHandleClick(Category.archived)}
                className={clsx(css.nav, { [css.actives]: value?.category === Category.archived })}
                startIcon={<PublishOutlined />}
              >
                {reportMiss("Student Archievement", "report_label_student_archievement")}
              </Button>
              <Button
                onClick={createHandleClick(Category.learningOutcomes)}
                className={clsx(css.nav, { [css.actives]: value?.category === Category.learningOutcomes })}
                startIcon={value?.category === "pending" ? <PendingBlueIcon /> : <PendingIcon />}
              >
                {reportMiss("Learning Outcomes In Categories", "report_label_learning_outcomes_in_categories")}
              </Button>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

export function FirstSearchHeaderMb(props: FirstSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const handleChange = (event: React.ChangeEvent<{}>, category: QueryCondition["category"]) => {
    onChange({ category });
  };
  return (
    <div className={classes.root}>
      <Hidden only={["md", "lg", "xl"]}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppBar position="static" color="inherit">
              <Tabs
                value={value?.category}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab
                  value={Category.archived}
                  label={reportMiss("Student Archievement", "report_label_student_archievement")}
                  className={classes.capitalize}
                />
                <Tab
                  value={Category.learningOutcomes}
                  label={reportMiss("Learning Outcomes In Categories", "report_label_learning_outcomes_in_categories")}
                  className={classes.capitalize}
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Hidden>
    </div>
  );
}
