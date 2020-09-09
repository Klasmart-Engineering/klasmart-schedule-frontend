import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  assetsContent: {
    width: "100%",
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
