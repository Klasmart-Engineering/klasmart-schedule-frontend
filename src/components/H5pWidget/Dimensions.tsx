import { Box, InputLabel, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { cloneElement } from "react";
import { H5pElement, H5pElementProps, isH5pElementGroup } from "../H5pElement";

const useStyles = makeStyles(() => ({
  paragraph: {
    marginTop: 32,
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 2,
  },
  description: {
    fontSize: 12,
  },
  partialItem: {
    width: "45%",
  },
}));

export function WidgetElement(props: H5pElementProps) {
  const css = useStyles();
  if (!isH5pElementGroup(props)) return <H5pElement {...props} />;
  const { itemHelper } = props;
  const { semantics } = itemHelper;
  const inputWidthElement = itemHelper.childItems[0].node as JSX.Element;
  const inputHeightElement = itemHelper.childItems[1].node as JSX.Element;
  return (
    <div className={css.paragraph}>
      <InputLabel className={css.title} required={!semantics.optional}>
        {semantics.label || semantics.name}
      </InputLabel>
      <div className={css.description}>{semantics.description}</div>
      <Box display="flex" justifyContent="space-between">
        {cloneElement(inputWidthElement, { className: clsx(inputWidthElement.props.className, css.partialItem) })}
        {cloneElement(inputHeightElement, { className: clsx(inputHeightElement.props.className, css.partialItem) })}
      </Box>
    </div>
  );
}

export const version = "1.0.0";
export const name = "H5PEditor.Dimensions";
export const title = "dimensions";
