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
import { Redirect } from "react-router-dom";
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
              <Button variant="contained" color="primary" className={classes.createBtn}>
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
                href={`${path}&status=archived`}
                className={`${classes.nav} ${status === "archived" ? classes.actives : ""}`}
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
  const classes = useStyles();
  const { layout, status } = props;
  const path = `/library/my-content-list?layout=${layout}`;
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    function getStatus() {
      let value = 0;
      switch (status) {
        case "published":
          value = 0;
          break;
        case "pending":
          value = 1;
          break;
        case "unpublished":
          value = 2;
          break;
        case "archived":
          value = 3;
          break;
        case "assets":
          value = 4;
          break;
        default:
          value = 0;
      }
      return value;
    }
    setValue(getStatus());
  }, [status]);
  return (
    <div className={classes.root}>
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
                aria-label="scrollable force tabs example"
              >
                <Tab label="Published" className={classes.capitalize} />
                <Tab label="Pending" className={classes.capitalize} />
                <Tab label="Unpublished" className={classes.capitalize} />
                <Tab label="Archived" className={classes.capitalize} />
                <Tab label="Assets" className={classes.capitalize} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <Redirect to={`${path}&status=published`} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Redirect to={`${path}&status=pending`} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Redirect to={`${path}&status=unpublished`} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Redirect to={`${path}&status=archived`} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <Redirect to={`${path}&status=assets`} />
            </TabPanel>
          </Grid>
        </Grid>
      </Hidden>
    </div>
  );
}
