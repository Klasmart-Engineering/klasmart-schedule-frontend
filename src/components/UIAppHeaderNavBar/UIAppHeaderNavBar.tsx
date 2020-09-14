import { Button, Grid, Hidden } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, Theme } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import clsx from "clsx";
import React from "react";
import { useHistory, useLocation, withRouter } from "react-router-dom";
import imgUrl1 from "../../assets/icons/kidsloop-logo.svg";
import { OutcomeList } from "../../pages/OutcomeList";

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
    borderBottom: "3px solid transparent",
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
    transition: "0.2s",
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
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  drwaer: {
    zIndex: 666,
  },
  drawer1111111111: {
    // "&>div" : {
    //   top: '130px'
    // }
  },
  smallCurrent: {
    borderBottom: "2px solid #0e78d5",
  },
}));

const navigation = [
  {
    name: "Live",
    path: "/live",
  },
  {
    name: "Library",
    path: "/",
  },
  {
    name: "Assessments",
    path: OutcomeList.routeRedirectDefault,
  },
  {
    name: "Schedule",
    path: "/schedule/calendar",
  },
  {
    name: "Report",
    path: "/report",
  },
];

function NavBarLarge() {
  const classes = useStyles();
  const history = useHistory();
  const currentValue = useLocation().pathname.split("/")[1];

  const handleChangeSelect = (item: { name: string; path: string }): void => {
    history.push(item.path);
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
              {navigation.map((item) => (
                <Grid
                  key={item.name}
                  item
                  className={`${classes.rightItem} ${currentValue === item.name.toLowerCase() ? `${classes.currentSelect}` : ""}`}
                >
                  <Button onClick={() => handleChangeSelect(item)} className={classes.rightButton}>
                    {item.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item lg={2} xl={2} md={2} className={classes.rightPart}>
            <div>
              <img src={imgUrl1} alt="" className={classes.imgIcon} />
            </div>
          </Grid>
        </Grid>
      </Hidden>
      <NavBarSmall currentValue={currentValue} />
    </>
  );
}

type Anchor = "right";

function SwipeableTemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });
  const currentValue = useLocation().pathname.split("/")[1];

  const history = useHistory();

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleClick = (text: any) => {
    history.push(`${text.path}`);
  };

  const list = (anchor: Anchor) => (
    <div className={clsx(classes.list)} role="presentation" onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
      <List>
        {navigation.map((item, index) => (
          <ListItem button key={index} className={`${currentValue === item.name.toLowerCase() ? `${classes.smallCurrent}` : ""}`}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={item.name} onClick={() => handleClick(item)} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      {(["right"] as Anchor[]).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <MenuIcon />
          </Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
            className={classes.drawer1111111111}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}

interface NavBarSmallProps {
  currentValue: string;
}

function NavBarSmall(props: NavBarSmallProps) {
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
            {/* <MenuIcon /> */}
            <SwipeableTemporaryDrawer />
          </div>
        </Grid>
      </Grid>
    </Hidden>
  );
}

function HeaderNavBar(props: any) {
  const classes = useStyles();
  const hideList = ["content-edit", "outcome-edit"];
  const isContentEdit = hideList.some((item: string) => props.location.pathname.includes(item));

  return <div className={classes.root}>{!isContentEdit ? <NavBarLarge /> : ""}</div>;
}

export default withRouter(HeaderNavBar);
