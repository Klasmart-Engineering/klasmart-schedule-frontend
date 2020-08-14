import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MenuIcon from "@material-ui/icons/Menu";
import { withRouter } from "react-router-dom";
import { Hidden, Grid, Button, Box } from "@material-ui/core";

// import imgUrl1 from '../assets/images/kidsloop_icon.png'

// import './headerNav.css'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 1px 10px 0px rgba(0,0,0,0.12), 0px 4px 5px 0px rgba(0,0,0,0.14);",
    marginBottom: "30px",
  },
  center: {
    height: "60px",
    backgroundColor: "#fff",
    color: "#000",
    boxShadow: "none",
    float: "left",
    listStyle: "none",
    padding: "0 30px",
    margin: 0,
    lineHeight: "60px",
    cursor: "pointer",
  },
  left: {
    display: "flex",
    alignItems: "center",
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
  intro1: {
    margin: "0",
    fontSize: "14px",
    padding: "10px",
  },
  container_intro: {
    height: "60px",
    paddingTop: "10px",
    boxSizing: "border-box",
  },
  right: {
    display: "flex",
    paddingRight: "50px",
    alignItems: "center",
  },
  img: {
    width: "49px",
    height: "49px",
  },
  lastImg: {
    color: "#fff",
  },
  button: {
    borderRadius: "27px",
    marginRight: "50px",
  },
  buttonGreen: {
    backgroundColor: "#4caf50",
  },
  largeContainer: {
    // display: 'flex'
  },
  headerLeft: {},
  rightItem: {
    padding: "0 20px",
    height: "100%",
    alignItems: "center",
    display: "flex",
    boxSizing: "border-box",
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
}));

interface NavList {
  label: string;
  to: string;
}

const navList: NavList[] = [
  {
    label: "Live",
    to: "/live",
  },
  {
    label: "Library",
    to: "/library",
  },
  {
    label: "Assessments",
    to: "/assessments",
  },
  {
    label: "Schedule",
    to: "/schedule",
  },
  {
    label: "Report",
    to: "/report",
  },
];

function NavBarLarge() {
  const classes = useStyles();
  const [currentValue, setCurrentValue] = React.useState("library");

  const handleChangeSelect = (value: string): void => {
    setCurrentValue(value);
  };

  return (
    <Hidden only={["sm", "xs"]}>
      <Grid container className={classes.largeContainer} alignItems="center">
        <Grid item lg={5} xl={5} md={5}>
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
        <Grid item lg={7} xl={7} md={7} style={{ height: "100%" }}>
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
      </Grid>
    </Hidden>
  );
}

function HeaderNavBar(props: any) {
  const classes = useStyles();
  const [value, setValue] = React.useState("/live");

  React.useEffect(() => {
    const value = localStorage.getItem("value");
    if (value) {
      setValue(value);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string, to?: string) => {
    setValue(newValue);
    localStorage.setItem("value", newValue);
    // console.log(props)
    // props.history.push('/card')
  };

  const handleClick = (to: string): void => {
    console.log(to);
    props.history.push(to);
  };

  return (
    <div className={classes.root}>
      {/* <>
        <div className={classes.left}>
          <div className={classes.left_icon}><MenuIcon/></div>
          <div className={classes.container_intro}>
            <p className={classes.intro}>Calm Island</p>
            <p className={classes.intro}>Pre-production</p>
          </div>
        </div>
        <div className={classes.center}>
          <AppBar className={classes.center} position="static">
            <Tabs value={value} onChange={handleChange} className={classes.center}>
              {
                navList.map((item, index) =>{
                  return(
                    <Tab key={index} value={item.to} className={classes.center} onClick={() => handleClick(item.to)} label={item.label} />
                  )
                })
              }
            </Tabs>
          </AppBar>
        </div>
        <div className={classes.right}>
          <img className={classes.img} src={imgUrl1} alt=""/>
        </div>
      </> */}
      <NavBarLarge />
    </div>
  );
}

export default withRouter(HeaderNavBar);
