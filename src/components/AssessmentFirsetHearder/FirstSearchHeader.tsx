import { Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import FlagOutlinedIcon from "@material-ui/icons/FlagOutlined";
import TimelineOutlinedIcon from "@material-ui/icons/TimelineOutlined";
import TuneOutlinedIcon from "@material-ui/icons/TuneOutlined";
import clsx from "clsx";
import React from "react";
import { useHistory } from "react-router-dom";
import { d } from "../../locale/LocaleManager";
import { AssessmentList } from "../../pages/AssesmentList";
import { HomeFunAssessmentList } from "../../pages/HomeFunAssessmentList";
import MilestoneEdit from "../../pages/MilestoneEdit";
import MilestonesList from "../../pages/MilestoneList";
import CreateOutcomings from "../../pages/OutcomeEdit";
import { OutcomeList } from "../../pages/OutcomeList";
import { LoBlueIcon, LoIcon } from "../../pages/OutcomeList/Icons";
import { HeaderCategory } from "../../pages/OutcomeList/types";
import LayoutBox from "../LayoutBox";
import { Permission, PermissionType, usePermission } from "../Permission";
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
  selectedTab: {
    color: "rgba(0, 0, 0, 0.54) !important",
  },
  active: {
    color: "#0E78D5 !important",
  },
}));

export function FirstSearchHeader() {
  const css = useStyles();
  const history = useHistory();
  const pathname = history.location.pathname;
  const hightLightAssessment =
    pathname.indexOf(AssessmentList.routeBasePath) >= 0 || pathname.indexOf(HomeFunAssessmentList.routeBasePath) >= 0;
  return (
    <div className={css.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container>
            <Grid item md={3} lg={5} xl={7}>
              {pathname.indexOf(OutcomeList.routeBasePath) >= 0 && (
                <Permission value={PermissionType.create_learning_outcome_421}>
                  <Button href={`#${CreateOutcomings.routeBasePath}`} variant="contained" color="primary" className={css.createBtn}>
                    {d("Create").t("assess_label_create")} +
                  </Button>
                </Permission>
              )}
              {pathname.indexOf(MilestonesList.routeBasePath) >= 0 && (
                <Permission value={PermissionType.create_milestone_422}>
                  <Button href={`#${MilestoneEdit.routeRedirectDefault}`} variant="contained" color="primary" className={css.createBtn}>
                    {d("Create").t("assess_label_create")} +
                  </Button>
                </Permission>
              )}
            </Grid>
            <Grid container direction="row" justify="space-evenly" alignItems="center" item md={9} lg={7} xl={5}>
              <Permission value={PermissionType.learning_outcome_page_404}>
                <Button
                  onClick={() => history.push(OutcomeList.routeRedirectDefault)}
                  className={clsx(css.nav, { [css.actives]: pathname.indexOf(OutcomeList.routeBasePath) >= 0 })}
                  startIcon={pathname.indexOf(OutcomeList.routeBasePath) >= 0 ? <LoBlueIcon /> : <LoIcon />}
                >
                  {d("Learning Outcome").t("assess_label_learning_outcome")}
                </Button>
              </Permission>
              <Permission value={PermissionType.milestones_page_405}>
                <Button
                  onClick={() => history.push(MilestonesList.routeBasePath)}
                  className={clsx(css.nav, { [css.actives]: pathname.indexOf(MilestonesList.routeBasePath) >= 0 })}
                  startIcon={<FlagOutlinedIcon />}
                >
                  {d("Milestone").t("assess_label_milestone")}
                </Button>
              </Permission>
              <Permission value={PermissionType.milestones_page_405}>
                <Button className={clsx(css.nav, { [css.actives]: false })} startIcon={<TuneOutlinedIcon />}>
                  {"Standards"}
                </Button>
              </Permission>
              <Permission value={PermissionType.assessments_page_406}>
                <Button
                  onClick={() => history.push(AssessmentList.routeRedirectDefault)}
                  className={clsx(css.nav, { [css.actives]: hightLightAssessment })}
                  startIcon={<TimelineOutlinedIcon />}
                >
                  {d("Assessments").t("assess_label_assessments")}
                </Button>
              </Permission>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

export function FirstSearchHeaderMb() {
  const classes = useStyles();
  const history = useHistory();
  const pathname = history.location.pathname;
  const perm = usePermission([
    PermissionType.learning_outcome_page_404,
    PermissionType.assessments_page_406,
    PermissionType.milestones_page_405,
  ]);
  const isHomeFunList = pathname.indexOf(HomeFunAssessmentList.routeBasePath) >= 0;
  return (
    <div className={classes.root}>
      <Hidden only={["md", "lg", "xl"]}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppBar position="static" color="inherit">
              <Tabs
                value={pathname}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"
              >
                {perm.learning_outcome_page_404 && (
                  <Tab
                    component={Button}
                    value={OutcomeList.routeBasePath}
                    label={d("Learning Outcome").t("assess_label_learning_outcome")}
                    className={classes.capitalize}
                    onClick={() => history.push(OutcomeList.routeRedirectDefault)}
                  />
                )}
                {perm.milestones_page_405 && (
                  <Tab
                    component={Button}
                    value={MilestonesList.routeBasePath}
                    label={"Milestones"}
                    className={classes.capitalize}
                    onClick={() => history.push(MilestonesList.routeBasePath)}
                  />
                )}
                <Tab value={HeaderCategory.standards} label={"Standard"} className={classes.capitalize} />
                {!isHomeFunList && perm.assessments_page_406 && (
                  <Tab
                    component={Button}
                    value={AssessmentList.routeBasePath}
                    label={d("Assessments").t("assess_label_assessments")}
                    className={classes.capitalize}
                    onClick={() => history.push(AssessmentList.routeRedirectDefault)}
                  />
                )}
                {isHomeFunList && perm.assessments_page_406 && (
                  <Tab
                    component={Button}
                    value={HomeFunAssessmentList.routeBasePath}
                    label={d("Assessments").t("assess_label_assessments")}
                    className={classes.capitalize}
                    onClick={() => history.push(AssessmentList.routeRedirectDefault)}
                  />
                )}
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Hidden>
    </div>
  );
}
