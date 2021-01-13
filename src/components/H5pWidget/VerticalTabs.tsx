import { Button, IconButton, InputLabel, makeStyles, Tab, Tabs, Tooltip, Typography } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import clsx from "clsx";
import React, { Children, Fragment, useMemo, useState } from "react";
import { H5pElementListProps } from "../H5pElement";
const useStyles = makeStyles(({ palette }) => ({
  root: {
    display: "flex",
    width: "100%",
    padding: "10px 0",
    justifyContent: "splaseAround",
  },
  tabPane: {
    width: "100%",
    padding: "0 32px 32px",
    display: "none",
    "&.active": {
      display: "block",
    },
    border: "1px solid #ccc",
  },
  tabs: {
    minWidth: 200,
  },
  label: {
    marginTop: 32,
  },
  addButton: {
    marginTop: 10,
    width: 200,
  },

  // newTabs:{
  //   display:"flex",
  //   flexDirection:"column",
  // },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 12,
    cursor: "pointer",
  },
  tabLabel: {
    position: "relative",
    paddingRight: 30,
    height: 30,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  tabIndicator: {
    width: 4,
    backgroundColor: palette.primary.main,
  },
  tabLabelSelected: {
    color: palette.primary.main,
  },
}));

export function WidgetElement(props: H5pElementListProps) {
  const css = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const { children, itemHelper, onAddListItem, onRemoveListItem } = props;
  const { semantics } = itemHelper;
  const handleChangeTab = useMemo(
    () => (e: any, value: number) => {
      setTabValue(value);
    },
    []
  );
  const handleRemoveTab = useMemo(
    () => (e: any, idx: number) => {
      e.preventDefault();
      e.stopPropagation();
      onRemoveListItem({ ...itemHelper, index: idx });
      if (idx < tabValue) {
        setTabValue(tabValue - 1);
      } else if (idx === children.length - 1) {
        setTabValue(idx - 1);
      }
    },
    [children.length, itemHelper, onRemoveListItem, tabValue]
  );
  let idx = -1;
  const tabPanels = Children.map(children, (childNode) => {
    idx += 1;
    return (
      <div key={idx} className={clsx(css.tabPane, { active: tabValue === idx })}>
        {childNode}
      </div>
    );
  });
  return (
    <Fragment>
      <InputLabel className={css.label} required={!semantics.optional}>
        {semantics.label || semantics.name}
      </InputLabel>
      <div className={css.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabValue}
          onChange={handleChangeTab}
          className={css.tabs}
          TabIndicatorProps={{ className: css.tabIndicator }}
        >
          {children.map((item, idx) => {
            return (
              <Tab
                value={idx}
                key={idx}
                classes={{ selected: css.tabLabelSelected }}
                label={
                  <div className={css.tabLabel}>
                    <Tooltip title="Remove Item">
                      <IconButton aria-label="close" size="small" className={css.closeButton} onClick={(e) => handleRemoveTab(e, idx)}>
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="h6"> {`${idx + 1}.${semantics.entity}`}</Typography>
                  </div>
                }
              />
            );
          })}
        </Tabs>
        {/* <NewTabs value={tabValue} onChangeTab={handleChangeTab} {...props}></NewTabs> */}
        {tabPanels}
      </div>
      <Button
        color="primary"
        variant="contained"
        size="large"
        onClick={() => {
          onAddListItem(itemHelper);
          setTabValue(children.length);
        }}
        className={css.addButton}
      >
        ADD {semantics.entity?.toUpperCase() ?? "ITEM"}
      </Button>
    </Fragment>
  );
}
// interface NewTabsProps extends H5pElementListProps {
//   value: number,
//   onChangeTab: ( newvalue: number) => any,
// }
// const NewTabs =(props: NewTabsProps) =>{
//   const css = useStyles()
//   const {value, onChangeTab, children, itemHelper, onRemoveListItem, onAddListItem} = props;
//   const { semantics } = itemHelper;
//   const hanleClickTab = useMemo(() => (idx:number) =>{
//     onChangeTab(idx)
//   },[onChangeTab]);
//   const handleRemoveTab = useMemo(() => (idx:number) =>{
//     onRemoveListItem({ ...itemHelper, index: idx})
//     if(idx < value){
//       onChangeTab(value -1)
//     }else if(idx === children.length-1){
//       onChangeTab(idx -1)
//     }
//   },[children.length, itemHelper, onChangeTab, onRemoveListItem, value]);
//   return(
//     <Box className={css.newTabs} >
//       {children.map((item, idx) => {
//         return(
//           <Box className={clsx(css.tab, {active:value === idx})}>
//             <Button fullWidth size="large" onClick={() => hanleClickTab(idx)}>{`${idx+1}.${semantics.entity}`}</Button>
//             <Cancel className={css.removeIcon} onClick={() => handleRemoveTab(idx)}></Cancel>
//           </Box>
//         )}
//         )}
//       <Button color="primary" variant="contained" size="large" onClick={() =>{onAddListItem(itemHelper);onChangeTab(children.length)}} className={css.addButton} >
//         ADD {semantics.entity?.toUpperCase() ?? "ITEM"}
//       </Button>
//     </Box>
//   )
// }
export const version = "1.0.0";
export const name = "H5PEditor.VerticalTabs";
export const title = "VerticalTabs";
