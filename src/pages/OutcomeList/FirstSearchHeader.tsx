import { Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { HourglassEmptyOutlined, PermMediaOutlined, PublishOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { Author, OutcomePublishStatus } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
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
  const createHandleClick = (publish_status: OutcomeQueryCondition["publish_status"]) => () => onChange({ ...value, publish_status });
  return (
    <div className={css.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3}>
            <Grid item md={3} lg={5} xl={7}>
              <Button
                href={`#/library/content-edit/lesson/material/tab/details/rightside/contentH5p`}
                variant="contained"
                color="primary"
                className={css.createBtn}
              >
                Create +
              </Button>
            </Grid>
            <Grid container direction="row" justify="space-evenly" alignItems="center" item md={9} lg={7} xl={5}>
              <Button
                onClick={createHandleClick(OutcomePublishStatus.published)}
                className={clsx(css.nav, { [css.actives]: value?.publish_status === "published" })}
                startIcon={<PublishOutlined />}
              >
                Learning Outcomes
              </Button>
              <Button
                onClick={createHandleClick(OutcomePublishStatus.pending)}
                className={clsx(css.nav, { [css.actives]: value?.publish_status === "pending" })}
                startIcon={<HourglassEmptyOutlined />}
              >
                Pending
              </Button>
              <Button
                onClick={createHandleClick(OutcomePublishStatus.draft)}
                className={clsx(css.nav, { [css.actives]: unpublish })}
                startIcon={<PublishOutlined />}
              >
                Unpublished
              </Button>
              <Button
                onClick={() => onChangeCategory(HeaderCategory.assessment)}
                className={clsx(css.nav, { [css.actives]: false })}
                startIcon={<PermMediaOutlined />}
              >
                Assessments
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
  const { value, onChange, onChangeCategory } = props;
  const handleChange = (event: React.ChangeEvent<{}>, publish_status: OutcomePublishStatus | HeaderCategory) => {
    if (publish_status === HeaderCategory.assessment) {
      return onChangeCategory(HeaderCategory.assessment);
    }
    onChange({ ...value, publish_status: publish_status as OutcomePublishStatus });
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
                <Tab value={OutcomePublishStatus.published} label="Published" className={classes.capitalize} />
                <Tab value={OutcomePublishStatus.pending} label="Pending" className={classes.capitalize} />
                <Tab value={OutcomePublishStatus.draft} label="Unpublished" className={classes.capitalize} />
                <Tab value={HeaderCategory.assessment} label="Assesment" className={classes.capitalize} />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Hidden>
    </div>
  );
}
