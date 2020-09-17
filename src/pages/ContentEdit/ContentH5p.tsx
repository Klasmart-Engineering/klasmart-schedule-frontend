import { makeStyles } from "@material-ui/core";
import React, { ReactNode, useEffect } from "react";
import { apiCreateH5pResource, apiGetH5pResourceById } from "../../api/extra";

interface DataH5p {
  source?: string;
}
interface ContentH5pProps {
  children?: ReactNode;
  value?: DataH5p;
  onChange?: (value: DataH5p) => any;
}

const useStyles = makeStyles({
  iframe: {
    border: "none",
    width: "100%",
    height: "100%",
  },
});

export default function ContentH5p(props: ContentH5pProps) {
  const { value, onChange, children } = props;
  const css = useStyles();
  const src = value?.source ? apiGetH5pResourceById(value.source) : apiCreateH5pResource();
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { contentId } = event.data;
      if (!contentId) return;
      if (onChange) onChange({ source: contentId });
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onChange]);
  return (
    <>
      <iframe key={src} title="h5p" className={css.iframe} src={src} frameBorder="0" />
      {children}
    </>
  );
}
