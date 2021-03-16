import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  assetsContent: {
    height: "100%",
    width: "90%",
  },
}));

interface file {
  src: string | undefined;
}

export default function AssetPdf(props: file) {
  const css = useStyles();
  return <embed className={css.assetsContent} src={props.src} />;
}
