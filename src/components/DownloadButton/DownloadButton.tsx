import { unwrapResult } from "@reduxjs/toolkit";
import React, { DOMAttributes, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { apiDownloadPageUrl } from "../../api/extra";
import { AppDispatch } from "../../reducers";
import { actCreateDownload } from "../../reducers/content";

interface DownloadButtonProps {
  resourceId?: string;
  fileName?: string;
  children: ReactNode;
}

export function DownloadButton(props: DownloadButtonProps) {
  const { resourceId, fileName, children } = props;
  const dispatch = useDispatch<AppDispatch>();
  const hanldeClick: DOMAttributes<HTMLDivElement>["onClick"] = async (e) => {
    if (!resourceId) return;
    const { path } = await dispatch(actCreateDownload({ resourceId, metaLoading: true })).then(unwrapResult);
    const pageUrl = apiDownloadPageUrl(path, fileName);
    pageUrl && window.open(pageUrl, "_blank");
  };
  return (
    <div className="downloadButton" onClick={hanldeClick}>
      {children}
    </div>
  );
}
