import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  assetsContent: {
    maxWidth: "100%",
    maxHeight: "100%",
    marginTop: "30px",
  },
}));

interface img {
  src: string | undefined;
}

export default function AssetImg(props: img) {
  const css = useStyles();
  return <img className={css.assetsContent} src={props.src} alt="assetImg" />;
}
