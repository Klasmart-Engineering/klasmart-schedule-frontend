import { Box, Button, InputLabel, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { H5pElementListProps } from "../H5pElement";
const useStyles = makeStyles(() => ({
  label: {
    margin: "10px 0",
  },
  addButton: {
    marginTop: 10,
  },
}));

export function WidgetElement(props: H5pElementListProps) {
  const css = useStyles();
  const { itemHelper, children, onAddListItem } = props;
  console.log(children);

  const { semantics } = itemHelper;
  return (
    <Box>
      <InputLabel className={css.label} required={!semantics.optional}>
        {semantics.label || semantics.name}
      </InputLabel>
      <Typography variant="caption">{semantics.description}</Typography>
      {children.map((childrenNode, idx) => {
        return (
          //  <Grid container spacing={1}>
          //   <Grid item>{childrenNode}</Grid>
          // </Grid>
          <Box display="flex">{childrenNode}</Box>
        );
      })}
      <Button
        color="primary"
        variant="contained"
        size="large"
        onClick={() => {
          onAddListItem(itemHelper);
        }}
        className={css.addButton}
      >
        ADD {semantics.entity?.toUpperCase() ?? "ITEM"}
      </Button>
    </Box>
  );
}

export const version = "1.0.0";
export const name = "H5PEditor.RangeList";
export const title = "RangeList";
