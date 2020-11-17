import { makeStyles } from "@material-ui/core";
import React, { ReactNode, useEffect } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { apiCreateH5pResource, apiGetH5pResourceById } from "../../api/extra";
import { ContentDetailForm } from "../../models/ModelContentDetailForm";
import { CreateAllDefaultValueAndKeyResult } from "../../models/ModelMockOptions";

export interface ContentH5pProps {
  children?: ReactNode;
  isCreate?: boolean;
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

export default function ContentH5p(props: ContentH5pProps) {
  const { valueSource, children, isCreate, allDefaultValueAndKey, formMethods } = props;
  const css = useStyles();

  const src = isCreate ? apiCreateH5pResource() : valueSource && apiGetH5pResourceById(valueSource);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { contentId, source_type = "" } = event.data;
      if (!contentId) return;
      if (formMethods) {
        // debugger;
        formMethods.setValue("data.source", contentId, { shouldDirty: true });
        formMethods.setValue("source_type", source_type, { shouldDirty: true });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [formMethods]);
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
