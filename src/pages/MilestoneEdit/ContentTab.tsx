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
    "& .MuiTabs-indicator": {
      width: 0,
    },
  },
  tabAlignLeft: {
    flexGrow: 0,
    color: "rgba(0, 0, 0, 0.54) !important",
  },
  span: {
    width: "0 !important",
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
  showSecondTab?: boolean;
}

export default function ContentTab(props: ContentTabProps) {
  const css = useStyles();
  const { tab, children, showSecondTab, onChangeTab } = props;
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
          classes={{ indicator: showSecondTab ? "" : css.span }}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab
            classes={{ selected: showSecondTab ? "" : css.tabAlignLeft }}
            label={d("Details").t("library_label_details")}
            value={VALUES[0]}
          />
          {showSecondTab && <Tab label={d("Learning Outcomes").t("library_label_learning_outcomes")} value={VALUES[1]} />}
        </Tabs>
        {tabPanels}
      </TabContext>
    </Paper>
  );
}
