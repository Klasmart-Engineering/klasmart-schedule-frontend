import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  assetsContent: {
    height: "67%",
    marginTop: "30px",
  },
}));

interface file {
  fileUrl: string;
}

export default function AssetFile(props: file) {
  const css = useStyles();
  return (
    <embed
      className={css.assetsContent}
      src={`https://view.officeapps.live.com/op/view.aspx?src=${props.fileUrl}`}
    />
  );
}
