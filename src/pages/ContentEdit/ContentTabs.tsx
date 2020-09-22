import { makeStyles, Paper, Tab, Tabs, useMediaQuery, useTheme } from "@material-ui/core";
import { TabContext } from "@material-ui/lab";
import clsx from "clsx";
import React, { Children, ReactNode } from "react";
import { useParams } from "react-router-dom";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  tabs: {
    backgroundColor: palette.grey[200],
    boxShadow: shadows[3],
  },
  tabPane: {
    padding: 0,
    display: "none",
    "&.active": {
      display: "block",
    },
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
      <div key={VALUES[idx]} className={clsx(css.tabPane, { active: tab === VALUES[idx] })}>
        {child}
      </div>
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
          <Tab className={css.tab} label={d("Details").t("library_label_details")} value={VALUES[0]} />
          <Tab className={css.tab} label={d("Learning Outcomes").t("library_label_learning_outcomes")} value={VALUES[1]} />
          <Tab
            className={css.tab}
            label={lesson === "material" ? d("Assets").t("library_label_assets") : d("Lesson Material").t("library_label_lesson_material")}
            value={VALUES[2]}
          />
        </Tabs>
        {tabPanels}
      </TabContext>
    </Paper>
  );
}
