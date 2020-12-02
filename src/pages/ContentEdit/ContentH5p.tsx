import { makeStyles } from "@material-ui/core";
import React, { ReactNode, useEffect, useState } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import api from "../../api";
import { apiGenH5pResourceByToken } from "../../api/extra";
import { H5pSub } from "../../api/type";
import { ContentDetailForm } from "../../models/ModelContentDetailForm";
import { CreateAllDefaultValueAndKeyResult } from "../../models/ModelMockOptions";

export interface ContentH5pProps {
  children?: ReactNode;
  sub: H5pSub;
  valueSource?: string;
  // valueSourceType?: string;
  // onChangeSource?: (value: string) => any;
  // onChangeSourceType?: (value: string) => any;
  error?: boolean;
  allDefaultValueAndKey?: CreateAllDefaultValueAndKeyResult;
  formMethods?: UseFormMethods<ContentDetailForm>;
}

const useStyles = makeStyles({
  iframe: {
    border: "none",
    width: "100%",
    height: "calc(100% - 80px)",
  },
});

const useH5pSrc = function (sub: H5pSub, content_id?: string) {
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    api.crypto.generateH5PJwt(content_id ? { sub, content_id } : { sub }).then((res) => {
      const { token } = res;
      if (!token) return;
      setSrc(apiGenH5pResourceByToken(token));
    });
  }, [content_id, sub]);
  return src;
};

export default function ContentH5p(props: ContentH5pProps) {
  const { valueSource, children, sub, allDefaultValueAndKey, formMethods } = props;
  const css = useStyles();
  const src = useH5pSrc(sub, valueSource);
  console.log("h5p origin contentId = ", valueSource);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("h5p iframe message event = ", event);
      const { contentId } = event.data;
      const source_type = event.data.source_type ?? "";
      if (!contentId) return;
      if (formMethods) {
        // debugger;
        formMethods.setValue("data.source", contentId, { shouldDirty: true });
        formMethods.setValue("source_type", source_type, { shouldDirty: true });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [formMethods, sub]);
  return (
    <>
      {allDefaultValueAndKey && formMethods && (
        <Controller
          as="input"
          hidden
          name="data.source"
          defaultValue={allDefaultValueAndKey["data.source"]?.value}
          key={allDefaultValueAndKey["data.source"]?.key}
          control={formMethods.control}
        />
      )}
      {src && <iframe key={src} title="h5p" className={css.iframe} src={src} frameBorder="0" />}
      {children}
    </>
  );
}
