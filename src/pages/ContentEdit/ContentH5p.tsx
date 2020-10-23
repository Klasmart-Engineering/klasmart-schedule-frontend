import { makeStyles } from "@material-ui/core";
import React, { ReactNode, useEffect } from "react";
import { apiCreateH5pResource, apiGetH5pResourceById } from "../../api/extra";

export interface ContentH5pProps {
  children?: ReactNode;
  isCreate?: boolean;
  valueSource: string;
  valueSourceType?: string;
  onChangeSource?: (value: string) => any;
  onChangeSourceType?: (value: string) => any;
  error?: boolean;
}

const useStyles = makeStyles({
  iframe: {
    border: "none",
    width: "100%",
    height: "calc(100% - 80px)",
  },
});

export default function ContentH5p(props: ContentH5pProps) {
  const { valueSource, onChangeSourceType, onChangeSource, children, isCreate } = props;
  const css = useStyles();
  const src = isCreate ? apiCreateH5pResource() : valueSource && apiGetH5pResourceById(valueSource);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { contentId, source_type = "" } = event.data;
      if (!contentId) return;
      if (onChangeSource && onChangeSourceType) {
        onChangeSource(contentId);
        onChangeSourceType(source_type);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onChangeSource, onChangeSourceType]);
  return (
    <>
      {src && <iframe key={src} title="h5p" className={css.iframe} src={src} frameBorder="0" />}
      {children}
    </>
  );
}
