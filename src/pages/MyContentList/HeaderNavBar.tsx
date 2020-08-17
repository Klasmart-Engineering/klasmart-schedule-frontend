import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { withRouter } from "react-router-dom";
import { Hidden, Grid, Button } from "@material-ui/core";

import imgUrl1 from "../../assets/icons/kidsloop-logo.svg";

// import './headerNav.css'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 1px 10px 0px rgba(0,0,0,0.12), 0px 4px 5px 0px rgba(0,0,0,0.14);",
    marginBottom: "0px",
  },
  left_icon: {
    width: "60px",
    height: "60px",
    lineHeight: "80px",
    textAlign: "center",
  },
  intro: {
    margin: "0",
    padding: "0",
    fontSize: "14px",
  },
  largeContainer: {
    position: "relative",
  },
  headerLeft: {},
  rightItem: {
    padding: "0 20px",
    height: "100%",
    alignItems: "center",
    display: "flex",
    boxSizing: "border-box",
    [theme.breakpoints.up("lg")]: {
      padding: "0 30px",
    },
  },
  leftText: {
    paddingTop: "10px",
  },
  rightButton: {
    fontSize: "16px",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
  currentSelect: {
    borderBottom: "3px solid #0e78d5",
  },
  imgIcon: {
    width: "45px",
    height: "45px",
  },
  centerPart: {
    marginRight: "auto",
  },
  rightPart: {
    position: "absolute",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
  },
}));

interface NavList {
  label: string;
  to: string;
}

function NavBarLarge() {
  const classes = useStyles();
  const [currentValue, setCurrentValue] = React.useState("library");

  const handleChangeSelect = (value: string): void => {
    setCurrentValue(value);
  };

  return (
    <>
      <Hidden only={["sm", "xs"]}>
        <Grid container className={classes.largeContainer} alignItems="center">
          <Grid item lg={4} xl={4} md={3}>
            <Grid container className={classes.headerLeft}>
              <Grid item lg={1} xl={1} md={3}>
                <div className={classes.left_icon}>
                  <MenuIcon />
                </div>
              </Grid>
              <Grid item lg={3} xl={3} md={5} className={classes.leftText}>
                <p className={classes.intro}>Calm Island</p>
                <p className={classes.intro}>Pre-production</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={8} xl={8} md={8} style={{ height: "100%" }} className={classes.centerPart}>
            <Grid container style={{ height: "100%" }}>
              <Grid item className={`${classes.rightItem} ${currentValue === "live" ? `${classes.currentSelect}` : ""}`}>
                <Button onClick={() => handleChangeSelect("live")} className={classes.rightButton}>
                  Live
                </Button>
              </Grid>
              <Grid item className={`${classes.rightItem} ${currentValue === "library" ? `${classes.currentSelect}` : ""}`}>
                <Button onClick={() => handleChangeSelect("library")} className={classes.rightButton}>
                  Library
                </Button>
              </Grid>
              <Grid item className={`${classes.rightItem} ${currentValue === "assesments" ? `${classes.currentSelect}` : ""}`}>
                <Button onClick={() => handleChangeSelect("assesments")} className={classes.rightButton}>
                  Assessments
                </Button>
              </Grid>
              <Grid item className={`${classes.rightItem} ${currentValue === "schedule" ? `${classes.currentSelect}` : ""}`}>
                <Button onClick={() => handleChangeSelect("schedule")} className={classes.rightButton}>
                  Schedule
                </Button>
              </Grid>
              <Grid item className={`${classes.rightItem} ${currentValue === "report" ? `${classes.currentSelect}` : ""}`}>
                <Button onClick={() => handleChangeSelect("report")} className={classes.rightButton}>
                  Report
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={2} xl={2} md={2} className={classes.rightPart}>
            <div>
              <img src={imgUrl1} alt="" className={classes.imgIcon} />
            </div>
          </Grid>
        </Grid>
      </Hidden>
      <NavBarSmall />
    </>
  );
}

function NavBarSmall() {
  const classes = useStyles();

  return (
    <Hidden only={["lg", "xl", "md"]}>
      <Grid container className={classes.largeContainer} alignItems="center">
        <Grid item lg={4} xl={4} md={4}>
          <Grid container className={classes.headerLeft}>
            <Grid item lg={1} xl={1} md={3}>
              <div className={classes.left_icon}>
                <MenuIcon />
              </div>
            </Grid>
            <Grid item lg={3} xl={3} md={5} className={classes.leftText}>
              <p className={classes.intro}>Calm Island</p>
              <p className={classes.intro}>Pre-production</p>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={2} xl={2} md={2} className={classes.rightPart}>
          <div>
            <MenuIcon />
          </div>
        </Grid>
      </Grid>
    </Hidden>
  );
}

function HeaderNavBar(props: any) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NavBarLarge />
    </div>
  );
}

export default withRouter(HeaderNavBar);
