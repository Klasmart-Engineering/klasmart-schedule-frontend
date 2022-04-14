import { d } from "@locale/LocaleManager";
import { actError } from "@reducers/notify";
import { checkResourceExist } from "@reducers/schedule";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import React, { DOMAttributes, ReactNode, RefObject, useRef } from "react";
import { useDispatch } from "react-redux";
import { apiDownloadPageUrl } from "../../api/extra";
import { AppDispatch } from "../../reducers";
import { actCreateDownload } from "../../reducers/content";

interface DownloadButtonProps {
  resourceId?: string;
  fileName?: string;
  children: ReactNode;
}

const createDownloadIframe = (containerRef: RefObject<HTMLDivElement>, src?: string) => {
  if (!src) return;
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.style.display = "none";
  containerRef.current?.appendChild(iframe);
  return iframe;
};

export function DownloadButton(props: DownloadButtonProps) {
  const { resourceId, fileName, children } = props;
  const btnRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const hanldeClick: DOMAttributes<HTMLDivElement>["onClick"] = async (e) => {
    if (!resourceId) return;
    const { payload } = (await dispatch(checkResourceExist({ resource_id: resourceId, metaLoading: true }))) as unknown as PayloadAction<
      AsyncTrunkReturned<typeof checkResourceExist>
    >;
    if (!payload) {
      dispatch(actError(d("This file is not ready. Please try again later.").t("schedule_msg_file_not_ready_to_download")));
      return;
    }
    const { path } = await dispatch(actCreateDownload({ resourceId, metaLoading: true })).then(unwrapResult);
    const pageUrl = apiDownloadPageUrl(path, fileName);
    createDownloadIframe(btnRef, pageUrl);
  };
  return (
    <div className="downloadButton" onClick={hanldeClick} ref={btnRef}>
      {children}
    </div>
  );
}
