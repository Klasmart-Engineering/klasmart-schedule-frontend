/// <reference path='index.d.ts'/>
import { withStyles } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { Suspense } from "react";
import { Loading } from "../Loading";

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: "#1890ff",
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    marginTop: 10,
    fontWeight: theme.typography.fontWeightBold,
    marginRight: theme.spacing(4),
    fontSize: 16,
    "&:hover": {
      color: "#40a9ff",
      opacity: 1,
    },
    "&$selected": {
      color: "#1890ff",
      fontWeight: theme.typography.fontWeightBold,
    },
    "&:focus": {
      color: "#40a9ff",
    },
  },
  selected: {},
}))(Tab);

interface IProps {
  tabs: ITabItem[];
}

export default function TabPages({ tabs }: IProps) {
  const activeTabs = tabs.filter((item) => item.display);
  const [state, setState] = React.useState({
    tabIndex: activeTabs[0].index,
  });
  const handleChange = (event: any, newValue: number) => {
    setState({
      ...state,
      tabIndex: newValue,
    });
  };
  return (
    <>
      <AntTabs value={state.tabIndex} onChange={handleChange} aria-label="">
        {activeTabs.map((tabItem) => {
          return <AntTab key={tabItem.index} value={tabItem.index} label={tabItem.label} />;
        })}
      </AntTabs>
      <Suspense fallback={<Loading />}>
        {activeTabs.map(({ display, Component, index }) => {
          return display && state.tabIndex === index && <Component />;
        })}
      </Suspense>
    </>
  );
}
