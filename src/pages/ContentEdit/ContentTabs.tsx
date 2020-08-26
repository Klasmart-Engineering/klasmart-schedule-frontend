import { makeStyles, Paper, Tab, Tabs, useMediaQuery, useTheme } from "@material-ui/core";
import { TabContext, TabPanel } from "@material-ui/lab";
import React, { Children, ReactNode } from "react";
import { useParams } from "react-router-dom";

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  tabs: {
    backgroundColor: palette.grey[200],
    boxShadow: shadows[3],
  },
  tabPane: {
    padding: 0,
  },
  tab: {
    fontWeight: "bold",
    padding: 0,
    [breakpoints.down("sm")]: {
      fontSize: 13,
      letterSpacing: 0,
    },
  },
}));

const VALUES = ["details", "outcomes", "media"];

interface ContentTabsProps {
  tab: string;
  onChangeTab: (tab: string) => any;
  children: ReactNode;
}
export default function ContentTabs(props: ContentTabsProps) {
  const { tab, children, onChangeTab } = props;
  const css = useStyles();
  const { lesson } = useParams();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  let idx = -1;
  const tabPanels = Children.map(children, (child) => {
    idx += 1;
    return (
      <TabPanel key={VALUES[idx]} className={css.tabPane} value={VALUES[idx]}>
        {child}
      </TabPanel>
    );
  });

  return (
    <Paper elevation={sm ? 0 : 3}>
      <TabContext value={tab}>
        <Tabs
          value={tab}
          className={css.tabs}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, value) => onChangeTab(value)}
        >
          <Tab className={css.tab} label="Details" value={VALUES[0]} />
          <Tab className={css.tab} label="Learning Outcomes" value={VALUES[1]} />
          <Tab className={css.tab} label={lesson === "material" ? "Media Assets" : "Media Material"} value={VALUES[2]} />
        </Tabs>
        {tabPanels}
      </TabContext>
    </Paper>
  );
}
