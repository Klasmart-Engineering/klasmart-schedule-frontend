import { makeStyles } from "@material-ui/core";
import React, { ReactNode, useEffect } from "react";
import { apiCreateH5pResource, apiGetH5pResourceById } from "../../api/extra";

interface DataH5p {
  source?: string;
}
interface ContentH5pProps {
  children?: ReactNode;
  isCreate?: boolean;
  value?: string;
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
  const src = isCreate ? apiCreateH5pResource() : value && apiGetH5pResourceById(value);
  // const src = value ? apiGetH5pResourceById(value) : apiCreateH5pResource();
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { contentId } = event.data;
      if (!contentId) return;
      if (onChange) onChange(contentId);
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
