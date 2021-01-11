import { Box, InputLabel, makeStyles, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { H5pElementGroupProps } from "../H5pElement";

const useStyles = makeStyles(({ palette }) => ({
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
  DragQuestionBox: {
    border: "1px solid #ccc",
    marginTop: 10,
  },
  handerBox: {
    height: 42,
    backgroundColor: palette.grey[200],
    borderBottom: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
  },
}));

export function WidgetElement(props: H5pElementGroupProps) {
  const css = useStyles();
  const { itemHelper } = props;
  const { semantics } = itemHelper;
  const discription = semantics.description?.split("<br/>");
  return (
    <Fragment>
      <InputLabel required={!semantics.optional} className={css.label}>
        {semantics.label || semantics.name}
      </InputLabel>
      <Box className={css.DragQuestionBox} width={630} height={310}>
        <Box className={css.handerBox}></Box>
      </Box>

      {discription &&
        discription.map((item, idx) => {
          return (
            <div key={idx}>
              <Typography variant="caption">{item}</Typography>
              <br />
            </div>
          );
        })}
    </Fragment>
  );
}

export const version = "1.0.0";
export const name = "H5PEditor.DragQuestion";
export const title = "dragQuestion";
