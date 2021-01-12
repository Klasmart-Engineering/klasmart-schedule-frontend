import { Box, Button, InputLabel, makeStyles, Typography } from "@material-ui/core";
import ImageIcon from "@material-ui/icons/Image";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import React, { Fragment } from "react";
import { reportMiss } from "../../locale/LocaleManager";
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
  },
  buttonTcon: {
    marginLeft: 8,
  },
}));

export function WidgetElement(props: H5pElementGroupProps) {
  const css = useStyles();
  const { itemHelper, children } = props;
  const { semantics } = itemHelper;
  const discription = semantics.description?.split("<br/>");
  return (
    <Fragment>
      <InputLabel required={!semantics.optional} className={css.label}>
        {semantics.label || semantics.name}
      </InputLabel>
      <Box className={css.DragQuestionBox} width={630} height={310}>
        <Box className={css.handerBox} pl={1}>
          <Button variant="outlined">
            <TrackChangesIcon />
          </Button>
          <Button className={css.buttonTcon} variant="outlined">
            <TextFieldsIcon />
          </Button>
          <Button className={css.buttonTcon} variant="outlined">
            <ImageIcon />
          </Button>
        </Box>
      </Box>
      <Box className={css.DragQuestionBox} boxShadow={3}>
        <Box p={2}>{children[1]}</Box>
        <Box className={css.handerBox} justifyContent="flex-end" pr={1} borderTop="1px solid #ccc">
          <Button color="secondary" size="small">
            {reportMiss("remove", "button_lable")}
          </Button>
          <Button className={css.buttonTcon} color="primary" variant="contained" size="small">
            {reportMiss("Completed", "button_lable")}
          </Button>
        </Box>
      </Box>

      {children[0]}
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
