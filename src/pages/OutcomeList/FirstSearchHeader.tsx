import { Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import clsx from "clsx";
import React from "react";
import { Author, OutcomeOrderBy, OutcomePublishStatus } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { Permission, PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import CreateOutcomings from "../OutcomeEdit";
import { AssessmentsIcon, LoBlueIcon, LoIcon, PendingBlueIcon, PendingIcon, UnPubBlueIcon, UnPubIcon } from "./Icons";
import { HeaderCategory, OutcomeQueryCondition, OutcomeQueryConditionBaseProps } from "./types";
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export const isUnpublish = (value: OutcomeQueryCondition): boolean => {
  return (
    (value.publish_status === OutcomePublishStatus.pending && value.author_name === Author.self) ||
    value.publish_status === OutcomePublishStatus.draft ||
    value.publish_status === OutcomePublishStatus.rejected
  );
};

export interface FirstSearchHeaderProps extends OutcomeQueryConditionBaseProps {
  onChangeCategory: (arg: HeaderCategory) => any;
}
export function FirstSearchHeader(props: FirstSearchHeaderProps) {
  const css = useStyles();
  const { value, onChange, onChangeCategory } = props;
  const unpublish = isUnpublish(value);
  const createHandleClick = (publish_status: OutcomeQueryCondition["publish_status"]) => () =>
    onChange({ publish_status, page: 1, order_by: OutcomeOrderBy._updated_at });
  const handleClickUnpublished = (publish_status: OutcomeQueryCondition["publish_status"]) => () =>
    onChange({ publish_status, page: 1, order_by: OutcomeOrderBy._updated_at, author_name: Author.self });
  return (
    <div className={css.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container>
            <Grid item md={3} lg={5} xl={7}>
              <Permission value={PermissionType.create_learning_outcome__421}>
                <Button href={`#${CreateOutcomings.routeBasePath}`} variant="contained" color="primary" className={css.createBtn}>
                  {d("Create").t("assess_label_create")} +
                </Button>
              </Permission>
            </Grid>
            <Grid container direction="row" justify="space-evenly" alignItems="center" item md={9} lg={7} xl={5}>
              <Permission value={PermissionType.learning_outcome_page_404}>
                <Button
                  onClick={createHandleClick(OutcomePublishStatus.published)}
                  className={clsx(css.nav, { [css.actives]: value?.publish_status === OutcomePublishStatus.published })}
                  startIcon={value?.publish_status === OutcomePublishStatus.published ? <LoBlueIcon /> : <LoIcon />}
                >
                  {d("Learning Outcome").t("assess_label_learning_outcome")}
                </Button>
              </Permission>
              <Permission value={PermissionType.pending_page_403}>
                <Button
                  onClick={createHandleClick(OutcomePublishStatus.pending)}
                  className={clsx(css.nav, {
                    [css.actives]: value?.publish_status === OutcomePublishStatus.pending && value?.author_name !== Author.self,
                  })}
                  startIcon={
                    value?.publish_status === OutcomePublishStatus.pending && value?.author_name !== Author.self ? (
                      <PendingBlueIcon />
                    ) : (
                      <PendingIcon />
                    )
                  }
                >
                  {d("Pending").t("assess_label_pending")}
                </Button>
              </Permission>
              <Permission value={PermissionType.unpublished_page_402}>
                <Button
                  onClick={handleClickUnpublished(OutcomePublishStatus.draft)}
                  className={clsx(css.nav, { [css.actives]: unpublish })}
                  startIcon={unpublish ? <UnPubBlueIcon /> : <UnPubIcon />}
                >
                  {d("Unpublished").t("assess_label_unpublished")}
                </Button>
              </Permission>
              <Permission value={PermissionType.assessments_page_406}>
                <Button
                  onClick={() => onChangeCategory(HeaderCategory.assessment)}
                  className={clsx(css.nav, { [css.actives]: false })}
                  startIcon={<AssessmentsIcon />}
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

export function FirstSearchHeaderMb(props: FirstSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange, onChangeCategory } = props;
  const perm = usePermission([
    PermissionType.unpublished_page_402,
    PermissionType.pending_page_403,
    PermissionType.learning_outcome_page_404,
    PermissionType.assessments_page_406,
  ]);
  const handleChange = (event: React.ChangeEvent<{}>, publish_status: OutcomePublishStatus | HeaderCategory) => {
    if (publish_status === HeaderCategory.assessment) {
      return onChangeCategory(HeaderCategory.assessment);
    }
    onChange({ publish_status: publish_status as OutcomePublishStatus, page: 1, order_by: OutcomeOrderBy._updated_at });
  };

  return (
    <div className={classes.root}>
      <Hidden only={["md", "lg", "xl"]}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppBar position="static" color="inherit">
              <Tabs
                value={value?.publish_status}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"
              >
                {perm.learning_outcome_page_404 && (
                  <Tab
                    value={OutcomePublishStatus.published}
                    label={d("Learning Outcome").t("assess_label_learning_outcome")}
                    className={classes.capitalize}
                  />
                )}
                {perm.pending_page_403 && (
                  <Tab
                    value={OutcomePublishStatus.pending}
                    label={d("Pending").t("assess_label_pending")}
                    classes={{ selected: classes.selectedTab }}
                    className={clsx(classes.capitalize, classes.selectedTab, {
                      [classes.active]: value?.publish_status === OutcomePublishStatus.pending && value?.author_name !== Author.self,
                    })}
                  />
                )}
                {perm.unpublished_page_402 &&
                  (value.publish_status === OutcomePublishStatus.pending && value.author_name === Author.self ? (
                    <Tab
                      value={OutcomePublishStatus.pending}
                      label={d("Unpublished").t("assess_label_unpublished")}
                      className={classes.capitalize}
                    />
                  ) : value.publish_status === OutcomePublishStatus.rejected ? (
                    <Tab
                      value={OutcomePublishStatus.rejected}
                      label={d("Unpublished").t("assess_label_unpublished")}
                      className={classes.capitalize}
                    />
                  ) : (
                    <Tab
                      value={OutcomePublishStatus.draft}
                      label={d("Unpublished").t("assess_label_unpublished")}
                      className={classes.capitalize}
                    />
                  ))}
                {perm.assessments_page_406 && (
                  <Tab
                    value={HeaderCategory.assessment}
                    label={d("Assessments").t("assess_label_assessments")}
                    className={classes.capitalize}
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
