import { InputLabel, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { H5pElementGroupProps } from "../H5pElement";

export function WidgetElement(props: H5pElementGroupProps) {
  const { itemHelper } = props;
  const { semantics } = itemHelper;
  return (
    <Fragment>
      <InputLabel required={!semantics.optional}>{semantics.label || semantics.name}</InputLabel>
      <Typography variant="caption">{semantics.description}</Typography>
    </Fragment>
  );
}

export const version = "1.0.0";
export const name = "H5PEditor.DynamicCheckboxes";
export const title = "dynamicCheckboxes";
