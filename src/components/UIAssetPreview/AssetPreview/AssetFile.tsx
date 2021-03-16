import { makeStyles } from "@material-ui/core";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AsyncTrunkReturned, getDownloadPath } from "../../../reducers/content";

const useStyles = makeStyles((theme) => ({
  assetsContent: {
    height: "100%",
    width: "80%",
  },
}));

interface file {
  src: string | undefined;
}

export default function AssetFile(props: file) {
  const css = useStyles();
  const dispatch = useDispatch();
  const [path, setPath] = useState<string | undefined>("");
  const getResource = async () => {
    const { payload } = ((await dispatch(getDownloadPath(props.src as string))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof getDownloadPath>
    >;
    payload && setPath(payload.path);
  };
  useEffect(() => {
    props.src && getResource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.src]);
  return path ? (
    <embed className={css.assetsContent} src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(path)}`} />
  ) : null;
}
