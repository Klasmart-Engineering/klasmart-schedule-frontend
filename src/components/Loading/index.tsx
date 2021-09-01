import { Backdrop, CircularProgress, createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

const useStyles = makeStyles((theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 300,
      color: "#fff",
    },
  })
);

export function Loading() {
  const css = useStyles();
  const { loading } = useSelector<RootState, RootState["loading"]>((state) => state.loading);
  if (!loading) return null;
  return (
    <Backdrop
      className={css.backdrop}
      open
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
