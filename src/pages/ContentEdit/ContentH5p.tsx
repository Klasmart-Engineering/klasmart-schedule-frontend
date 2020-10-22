import { makeStyles } from "@material-ui/core";
import React, { ReactNode, useEffect } from "react";
import { apiCreateH5pResource, apiGetH5pResourceById } from "../../api/extra";

export interface ContentH5pProps {
  children?: ReactNode;
  isCreate?: boolean;
  value: { contentId: string; source_type?: string };
  onChange?: (value: ContentH5pProps["value"]) => any;
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
  const { value, onChange, children, isCreate } = props;
  const css = useStyles();
  const src = isCreate ? apiCreateH5pResource() : value && apiGetH5pResourceById(value.contentId);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { contentId, source_type = "" } = event.data;
      if (!contentId) return;
      if (onChange) onChange({ contentId, source_type });
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onChange]);
  return (
    <>
      {src && <iframe key={src} title="h5p" className={css.iframe} src={src} frameBorder="0" />}
      {children}
    </>
  );
}
