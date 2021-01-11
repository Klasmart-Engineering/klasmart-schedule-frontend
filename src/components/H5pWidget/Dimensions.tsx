import { Box, InputLabel, makeStyles, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { Fragment } from "react";
import { H5pElementGroupProps } from "../H5pElement";

const useStyles = makeStyles(() => ({
  label: {
    marginTop: 32,
  },
  flex: {
    display: "flex",
    alignItems: "center",
    width: 240,
  },
  closeIcon: {
    marginTop: 32,
  },
}));

export function WidgetElement(props: H5pElementGroupProps) {
  const css = useStyles();
  const { itemHelper, children } = props;
  const { semantics } = itemHelper;
  return (
    <Fragment>
      <InputLabel required={!semantics.optional} className={css.label}>
        {semantics.label || semantics.name}
      </InputLabel>
      <Typography variant="caption">{semantics.description}</Typography>
      <Box className={css.flex}>
        {children[0]}
        <CloseIcon className={css.closeIcon} />
        {children[1]}
      </Box>
    </Fragment>
  );
}

export const version = "1.0.0";
export const name = "H5PEditor.Dimensions";
export const title = "dimensions";
