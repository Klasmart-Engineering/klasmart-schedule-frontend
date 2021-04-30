import { makeStyles, Paper, Tab, Tabs, Theme, useMediaQuery, useTheme } from "@material-ui/core";
import { TabContext } from "@material-ui/lab";
import clsx from "clsx";
import React, { Children, ReactNode } from "react";
import { FieldError } from "react-hook-form";
import { d } from "../../locale/LocaleManager";
import { TabValue } from "../ContentPreview/type";
const useStyles = makeStyles((theme: Theme) => ({
  tab: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    fontSize: "18px",
  },
  tabPane: {
    padding: 0,
    display: "none",
    "&.active": {
      display: "block",
    },
  },
}));

const VALUES = ["details", "learningoutcomes"];

interface ContentTabProps {
  tab: string;
  onChangeTab: (value: TabValue) => any;
  children: ReactNode;
  error?: FieldError;
}

export default function ContentTab(props: ContentTabProps) {
  const css = useStyles();
  const { tab, children, onChangeTab } = props;
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
    <Paper elevation={sm ? 0 : 3} style={{ minHeight: 900 }}>
      <TabContext value={tab}>
        <Tabs
          className={css.tab}
          value={tab}
          onChange={(e, value) => onChangeTab(value)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label={d("Details").t("library_label_details")} value={VALUES[0]} />
          <Tab label={d("Learning Outcomes").t("library_label_learning_outcomes")} value={VALUES[1]} />
        </Tabs>
        {tabPanels}
      </TabContext>
    </Paper>
  );
}
