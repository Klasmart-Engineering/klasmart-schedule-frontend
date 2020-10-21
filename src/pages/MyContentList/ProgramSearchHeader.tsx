import { AppBar, Grid, Tab, Tabs } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { PublishOutlined } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { OrderBy, SearchContentsRequestContentType } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { reportMiss } from "../../locale/LocaleManager";
import { PendingBlueIcon, PendingIcon, UnPubBlueIcon, UnPubIcon } from "../OutcomeList/Icons";
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

export enum Program {
  badaEsl = "program1",
  badamath = "program2",
  badasteam = "program3",
}

export interface ProgramSearchHeaderProps extends QueryConditionBaseProps {}
export default function ProgramSearchHeader(props: ProgramSearchHeaderProps) {
  const css = useStyles();
  const { value, onChange } = props;
  const createHandleClick = (program: QueryCondition["program"]) => () =>
    onChange({ program, content_type: SearchContentsRequestContentType.materialandplan, order_by: OrderBy._updated_at, page: 1 });
  return (
    <div className={css.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3}>
            <Grid item md={3} lg={5} xl={7}></Grid>
            <Grid container direction="row" justify="space-evenly" alignItems="center" item md={9} lg={7} xl={5}>
              <Button
                onClick={createHandleClick(Program.badaEsl)}
                className={clsx(css.nav, { [css.actives]: value?.program === Program.badaEsl })}
                startIcon={<PublishOutlined />}
              >
                {reportMiss("Badanamu ESL", "library_label_program_esl")}
              </Button>
              <Button
                onClick={createHandleClick(Program.badamath)}
                className={clsx(css.nav, { [css.actives]: value?.program === Program.badamath })}
                startIcon={value?.publish_status === "pending" ? <PendingBlueIcon /> : <PendingIcon />}
              >
                {reportMiss("Badanamu Math", "library_label_program_math")}
              </Button>
              <Button
                onClick={createHandleClick(Program.badasteam)}
                className={clsx(css.nav, { [css.actives]: value?.program === Program.badasteam })}
                startIcon={value?.program === Program.badasteam ? <UnPubBlueIcon /> : <UnPubIcon />}
              >
                {reportMiss("Badanamu STEAM", "library_label_program_steam")}
              </Button>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

export function ProgramSearchHeaderMb(props: ProgramSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const handleChange = (event: React.ChangeEvent<{}>, program: QueryCondition["program"]) => {
    onChange({ program, order_by: OrderBy._updated_at, page: 1, content_type: SearchContentsRequestContentType.materialandplan });
  };
  return (
    <div className={classes.root}>
      <Hidden only={["md", "lg", "xl"]}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppBar position="static" color="inherit">
              <Tabs
                value={value?.publish_status || value.content_type}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab
                  value={Program.badaEsl}
                  label={reportMiss("Badanamu ESL", "library_label_program_esl")}
                  className={classes.capitalize}
                />
                <Tab
                  value={Program.badamath}
                  label={reportMiss("Badanamu Math", "library_label_program_math")}
                  className={classes.capitalize}
                />
                <Tab
                  value={Program.badasteam}
                  label={reportMiss("Badanamu STEAM", "library_label_program_steam")}
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
