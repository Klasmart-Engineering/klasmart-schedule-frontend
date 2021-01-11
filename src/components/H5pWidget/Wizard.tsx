import { Box, makeStyles, Tab, Tabs, Typography } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import TabUnselectedIcon from "@material-ui/icons/TabUnselected";
import clsx from "clsx";
import React, { useMemo, useState } from "react";
import { H5pElementGroupProps } from "../H5pElement";
const useStyles = makeStyles(({ palette }) => ({
  tabs: { backgroundColor: palette.grey[300] },
  tabPane: {
    padding: 24,
    display: "none",
    "&.active": {
      display: "block",
    },
    border: "1px solid #ccc",
  },
  labelMargin: {
    marginLeft: 16,
  },
}));

export function WidgetElement(props: H5pElementGroupProps) {
  const css = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const { itemHelper, children } = props;
  const { semantics } = itemHelper;
  const handleChangeTab = useMemo(
    () => (e: any, value: number) => {
      setTabValue(value);
    },
    []
  );
  let idx = -1;
  const tabPanels = children.map((childNode) => {
    idx += 1;
    return (
      <div key={idx} className={clsx(css.tabPane, { active: tabValue === idx })}>
        {childNode}
      </div>
    );
  });
  return (
    <Box mt={4}>
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        className={css.tabs}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        {children.map((item, idx) => {
          return (
            <Tab
              value={idx}
              key={idx}
              label={
                <Box display="flex" alignItems="center">
                  {idx === 0 && <SettingsIcon />}
                  {idx === 1 && <TabUnselectedIcon />}
                  <Typography variant="h6" className={css.labelMargin}>
                    {" "}
                    {semantics.fields[idx].name}
                  </Typography>
                </Box>
              }
            />
          );
        })}
      </Tabs>
      {tabPanels}
    </Box>
  );
}

export const version = "1.0.0";
export const name = "H5PEditor.Wizard";
export const title = "wizard";
