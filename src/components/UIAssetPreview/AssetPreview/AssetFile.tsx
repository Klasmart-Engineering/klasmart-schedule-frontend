import { makeStyles } from "@material-ui/core";
import { getDownloadPath } from "@reducers/content";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  assetsContent: {
    height: "100%",
    width: "90%",
  },
}));

interface file {
  src: string | undefined;
}

export default function AssetFile(props: file) {
  const css = useStyles();
  const dispatch = useDispatch();
  const [path, setPath] = useState<string | undefined>("");

  useEffect(() => {
    let isUnmount = false;
    const getResource = async () => {
      const { payload } = (await dispatch(getDownloadPath(props.src as string))) as unknown as PayloadAction<
        AsyncTrunkReturned<typeof getDownloadPath>
      >;
      payload && !isUnmount && setPath(payload.path);
    };
    props.src && getResource();
    return () => {
      isUnmount = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.src]);
  return path ? (
    <embed className={css.assetsContent} src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(path)}`} />
  ) : null;
}
