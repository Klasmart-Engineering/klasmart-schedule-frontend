import { Backdrop, CircularProgress, createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

const useStyles = makeStyles((theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

export function Loading() {
  const css = useStyles();
  const { loading } = useSelector<RootState, RootState["loading"]>((state) => state.loading);
  return (
    <Backdrop className={css.backdrop} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
