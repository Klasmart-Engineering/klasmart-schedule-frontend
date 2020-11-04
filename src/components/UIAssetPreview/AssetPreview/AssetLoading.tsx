import { Box, CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  loadCon: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function AssetLoading() {
  const css = useStyles();
  return (
    <Box className={css.loadCon}>
      <CircularProgress />
    </Box>
  );
}
