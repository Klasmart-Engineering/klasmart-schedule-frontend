import { Grid, Tab, Tabs } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import clsx from "clsx";
import React from "react";
import { apiIsEnableReport } from "../../api/extra";
import PermissionType from "../../api/PermissionType";
import LayoutBox from "../../components/LayoutBox";
import { Permission } from "../../components/Permission";
import { d, t } from "../../locale/LocaleManager";
import { LoInCategoryBlueIcon, LoInCategoryIcon, SaBlueIcon, SaIcon } from "../OutcomeList/Icons";
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
  studentPerformance = "studentPerformance",
}
export interface FirstSearchHeaderProps {
  value: Category;
  onChange: (value: Category) => any;
}
export default function FirstSearchHeader(props: FirstSearchHeaderProps) {
  const css = useStyles();
  const { value, onChange } = props;

  const createHandleClick = (category: Category) => () => onChange(category);

  const isEnableReport = apiIsEnableReport();
  return (
    <div className={css.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Permission
          value={PermissionType.teacher_reports_603}
          render={(permission) =>
            permission && (
              <Hidden only={["xs", "sm"]}>
                <Grid container spacing={3}>
                  <Grid item md={3} lg={5} xl={7}></Grid>
                  <Grid container direction="row" justify="flex-end" alignItems="center" item md={9} lg={7} xl={5}>
                    <Button
                      onClick={createHandleClick(Category.archived)}
                      className={clsx(css.nav, {
                        [css.actives]: value === Category.archived,
                      })}
                      startIcon={value === Category.archived ? <SaBlueIcon /> : <SaIcon />}
                    >
                      {t("report_label_student_achievement")}
                    </Button>
                    {true && (
                      <Button
                        onClick={createHandleClick(Category.learningOutcomes)}
                        className={clsx(css.nav, {
                          [css.actives]: value === Category.learningOutcomes,
                        })}
                        startIcon={value === Category.learningOutcomes ? <LoInCategoryBlueIcon /> : <LoInCategoryIcon />}
                      >
                        {t("report_label_lo_in_categories")}
                      </Button>
                    )}
                    {isEnableReport && (
                      <Button
                        onClick={createHandleClick(Category.studentPerformance)}
                        className={clsx(css.nav, {
                          [css.actives]: value === Category.studentPerformance,
                        })}
                        startIcon={<ShowChartIcon />}
                      >
                        {d("Student Performance").t("report_label_student_performance")}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Hidden>
            )
          }
        />
      </LayoutBox>
    </div>
  );
}
export function FirstSearchHeaderMb(props: FirstSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange } = props;

  const handleChange = (event: React.ChangeEvent<{}>, category: Category) => {
    onChange(category);
  };

  const isEnableReport = apiIsEnableReport();
  return (
    <div className={classes.root}>
      <Permission
        value={PermissionType.teacher_reports_603}
        render={(permission) =>
          permission && (
            <Hidden only={["md", "lg", "xl"]}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <AppBar position="static" color="inherit">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      variant="scrollable"
                      scrollButtons="on"
                      indicatorColor="primary"
                      textColor="primary"
                    >
                      <Tab value={Category.archived} label={t("report_label_student_achievement")} className={classes.capitalize} />
                      {true && (
                        <Tab value={Category.learningOutcomes} label={t("report_label_lo_in_categories")} className={classes.capitalize} />
                      )}
                      {isEnableReport && (
                        <Tab
                          value={Category.studentPerformance}
                          label={d("Student Performance").t("report_label_student_performance")}
                          className={classes.capitalize}
                        />
                      )}
                    </Tabs>
                  </AppBar>
                </Grid>
              </Grid>
            </Hidden>
          )
        }
      />
    </div>
  );
}
