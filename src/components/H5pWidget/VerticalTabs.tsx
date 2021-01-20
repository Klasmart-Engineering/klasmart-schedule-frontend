import { Button, InputLabel, makeStyles, Tab, Tabs, Tooltip } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import clsx from "clsx";
import React, { Fragment, useMemo, useState } from "react";
import { isH5pParentError } from "../../models/ModelH5pSchema";
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
    margin: "32px 0 0 0",
  },
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
  tabInputLabel: {
    fontWeight: 700,
    fontSize: 16,
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
  const { children, itemHelper, onAddListItem, onRemoveListItem, formErrors } = props;
  const { semantics, path } = itemHelper;
  const disableCloseBtn = children.length <= (semantics.min ?? 0);
  const disalbeAddBtn = semantics.max ? children.length >= semantics.max : false;
  const { entity } = semantics;
  const lable = entity && entity?.slice(0, 1).toUpperCase() + entity?.slice(1);
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
  const tabPanels = children.map((childNode) => {
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
            const error = isH5pParentError(`${path}[${idx}]`, formErrors);
            return (
              <Tab
                value={idx}
                key={idx}
                classes={{ selected: css.tabLabelSelected }}
                label={
                  <div className={css.tabLabel}>
                    {!disableCloseBtn && (
                      <Tooltip title="Remove Item">
                        <Cancel className={css.closeButton} onClick={(e) => handleRemoveTab(e, idx)} />
                      </Tooltip>
                    )}
                    <span className={css.tabInputLabel} style={{ color: !!error ? "#D32F2F" : undefined }}>
                      {idx + 1}.&nbsp;{lable ?? semantics.field.name}
                    </span>
                  </div>
                }
              />
            );
          })}
        </Tabs>
        {tabPanels}
      </div>
      {!disalbeAddBtn && (
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
          ADD {entity?.toUpperCase() ?? "ITEM"}
        </Button>
      )}
    </Fragment>
  );
}
export const version = "1.0.0";
export const name = "H5PEditor.VerticalTabs";
export const title = "VerticalTabs";
