import { makeStyles } from "@material-ui/core";
import React, { ReactNode, useEffect, useState } from "react";
import api from "../../api";
import { apiGenH5pResourceByToken } from "../../api/extra";
import { H5pSub } from "../../api/type";

export interface ContentH5pProps {
  children?: ReactNode;
  sub: H5pSub;
  value?: string;
  onChange?: (value: string) => any;
  onChangeSourceType?: (value: string) => any;
}

const useStyles = makeStyles(({ breakpoints }) => ({
  iframe: {
    width: "100%",
    height: "calc(100% - 80px)",
    [breakpoints.down("md")]: {
      // 为适应手机端从866改为320
      minHeight: 320,
    },
  },
}));

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
  const { value: valueSource, children, sub, onChange, onChangeSourceType } = props;
  const css = useStyles();
  const src = useH5pSrc(sub, valueSource);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { contentId } = event.data;
      const source_type = event.data.source_type ?? "";
      if (!contentId) return;
      onChange && onChange(contentId);
      onChangeSourceType && onChangeSourceType(source_type);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onChange, onChangeSourceType, sub]);
  return (
    <>
      {src && <iframe key={src} title="h5p" className={css.iframe} src={src} frameBorder="0" allow="camera;microphone" />}
      {children}
    </>
  );
}
