import { AppBar, Grid, Tab, Tabs } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { NotesOutlined } from "@material-ui/icons";
import WidgetsOutlinedIcon from "@material-ui/icons/WidgetsOutlined";
import clsx from "clsx";
import React from "react";
import { OrderBy } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { BadaEslBlueIcon, BadaEslIcon } from "../OutcomeList/Icons";
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
export enum ProgramGroup {
  badaEsl = "BadaESL",
  badaSteam = "BadaSTEAM",
  more = "More",
  moreFeaturedContent = "More Featured Content",
}
export interface ProgramSearchHeaderProps extends QueryConditionBaseProps {}
export default function ProgramSearchHeader(props: ProgramSearchHeaderProps) {
  const css = useStyles();
  const { value, onChange } = props;

  const createHandleClick = (program_group: QueryCondition["program_group"]) => () =>
    onChange({
      program_group,
      order_by: OrderBy._updated_at,
      page: 1,
    });

  return (
    <div className={css.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3}>
            <Grid item md={3} lg={5} xl={7}></Grid>
            <Grid container direction="row" justify="flex-end" alignItems="center" item md={9} lg={7} xl={5}>
              <Button
                onClick={createHandleClick(ProgramGroup.badaEsl)}
                className={clsx(css.nav, {
                  [css.actives]: value?.program_group === ProgramGroup.badaEsl,
                })}
                startIcon={value?.program_group === ProgramGroup.badaEsl ? <BadaEslBlueIcon /> : <BadaEslIcon />}
              >
                {d("Badanamu ESL").t("library_label_program_esl")}
              </Button>
              <Button
                onClick={createHandleClick(ProgramGroup.badaSteam)}
                className={clsx(css.nav, {
                  [css.actives]: value?.program_group === ProgramGroup.badaSteam,
                })}
                startIcon={<WidgetsOutlinedIcon />}
              >
                {d("Bada STEAM").t("library_label_program_steam")}
              </Button>
              <Button
                onClick={createHandleClick(ProgramGroup.more)}
                className={clsx(css.nav, {
                  [css.actives]: value?.program_group === ProgramGroup.more,
                })}
                startIcon={<NotesOutlined />}
              >
                {d("More").t("library_label_more")}
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

  const handleChange = (event: React.ChangeEvent<{}>, program_group: QueryCondition["program_group"]) => {
    onChange({
      program_group,
      order_by: OrderBy._updated_at,
      page: 1,
    });
  };

  return (
    <div className={classes.root}>
      <Hidden only={["md", "lg", "xl"]}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppBar position="static" color="inherit">
              <Tabs
                value={value?.program_group}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab value={ProgramGroup.badaEsl} label={d("Badanamu ESL").t("library_label_program_esl")} className={classes.capitalize} />
                <Tab
                  value={ProgramGroup.badaSteam}
                  label={d("Bada STEAM").t("library_label_program_steam")}
                  className={classes.capitalize}
                />
                <Tab value={ProgramGroup.more} label={d("More").t("library_label_more")} className={classes.capitalize} />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Hidden>
    </div>
  );
}
