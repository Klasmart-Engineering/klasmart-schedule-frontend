import { Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import { ArchiveOutlined, HourglassEmptyOutlined, PermMediaOutlined, PublishOutlined } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import LayoutBox from "../../components/LayoutBox";

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return <div>{value === index && <Typography>{children}</Typography>}</div>;
}

interface SecondaryMenuProps {
  layout: string;
  status: string;
  showMyOnly: boolean;
}
export default function SecondaryMenu(props: SecondaryMenuProps) {
  const classes = useStyles();
  const { layout, status } = props;
  const path = `#/library/my-content-list?layout=${layout}`;
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3}>
            <Grid item md={3} lg={5} xl={7}>
              <Button
                href={`/library/content-edit/lesson/material/tab/details/rightside/contentH5p`}
                variant="contained"
                color="primary"
                className={classes.createBtn}
              >
                Create +
              </Button>
            </Grid>
            <Grid container direction="row" justify="space-evenly" alignItems="center" item md={9} lg={7} xl={5}>
              <Button
                href={`${path}&status=published`}
                className={`${classes.nav} ${status === "published" ? classes.actives : ""}`}
                startIcon={<PublishOutlined />}
              >
                Published
              </Button>
              <Button
                href={`${path}&status=pending`}
                className={`${classes.nav} ${status === "pending" ? classes.actives : ""}`}
                startIcon={<HourglassEmptyOutlined />}
              >
                Pending
              </Button>
              <Button
                href={`${path}&status=unpublished`}
                className={`${classes.nav} ${status === "unpublished" ? classes.actives : ""}`}
                startIcon={<PublishOutlined />}
              >
                Unpublished
              </Button>
              <Button
                href={`${path}&status=archive`}
                className={`${classes.nav} ${status === "archive" ? classes.actives : ""}`}
                startIcon={<ArchiveOutlined />}
              >
                Archived
              </Button>
              <Button
                href={`${path}&status=assets`}
                className={`${classes.nav} ${status === "assets" ? classes.actives : ""}`}
                startIcon={<PermMediaOutlined />}
              >
                Assets
              </Button>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
      <SecondaryMenuMb layout={layout} status={status} />
    </div>
  );
}
interface SecondaryMenuMbProps {
  layout: string;
  status: string;
}
function SecondaryMenuMb(props: SecondaryMenuMbProps) {
  const history = useHistory();
  const classes = useStyles();
  const { status } = props;
  const { pathname } = useLocation();
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    let value: string = "";
    if (newValue === 0) {
      value = "published";
    }
    if (newValue === 1) {
      value = "pending";
    }
    if (newValue === 2) {
      value = "unpublished";
    }
    if (newValue === 3) {
      value = "archive";
    }
    if (newValue === 4) {
      value = "assets";
    }
    history.push(`${pathname}?layout=card&status=${value}`);
  };
  function getDefaultValue() {
    let defaultValue = 0;
    if (status === "published") defaultValue = 0;
    if (status === "pending") defaultValue = 1;
    if (status === "unpublished") defaultValue = 2;
    if (status === "archive") defaultValue = 3;
    if (status === "assets") defaultValue = 4;
    return defaultValue;
  }
  useEffect(() => {
    getDefaultValue();
  });
  return (
    <div className={classes.root}>
      <Hidden only={["md", "lg", "xl"]}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppBar position="static" color="inherit">
              <Tabs
                value={getDefaultValue()}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"
              >
                <Tab value={0} label="Published" className={classes.capitalize} />
                <Tab value={1} label="Pending" className={classes.capitalize} />
                <Tab value={2} label="Unpublished" className={classes.capitalize} />
                <Tab value={3} label="Archive" className={classes.capitalize} />
                <Tab value={4} label="Assets" className={classes.capitalize} />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Hidden>
    </div>
  );
}
