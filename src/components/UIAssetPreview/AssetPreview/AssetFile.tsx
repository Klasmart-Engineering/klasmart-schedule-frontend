import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  assetsContent: {
    minHeight: "554px",
    width: "80%",
  },
}));

interface file {
  src: string | undefined;
}

export default function AssetFile(props: file) {
  const css = useStyles();
  return <embed className={css.assetsContent} src={`https://view.officeapps.live.com/op/view.aspx?src=${props.src}`} />;
}
