import React from "react";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { getScheduleLiveToken } from "../../reducers/schedule";
import { AsyncTrunkReturned, getContentLiveToken } from "../../reducers/content";
import { PayloadAction } from "@reduxjs/toolkit";
import { apiLivePath } from "../../api/extra";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const content_id = query.get("content_id") as string;
  const schedule_id = query.get("schedule_id") as string;
  return { content_id, schedule_id };
};

export default function Live() {
  const { content_id, schedule_id } = useQuery();
  const dispatch = useDispatch();
  React.useEffect(() => {
    async function asynsGetliveToken() {
      let tokenInfo: any;
      if (schedule_id)
        tokenInfo = ((await dispatch(getScheduleLiveToken({ schedule_id, metaLoading: true }))) as unknown) as PayloadAction<
          AsyncTrunkReturned<typeof getScheduleLiveToken>
        >;
      if (content_id)
        tokenInfo = ((await dispatch(getContentLiveToken({ content_id, metaLoading: true }))) as unknown) as PayloadAction<
          AsyncTrunkReturned<typeof getContentLiveToken>
        >;
      if (tokenInfo) window.location.href = apiLivePath(tokenInfo?.payload.token);
    }
    asynsGetliveToken();
  }, [schedule_id, content_id, dispatch]);
  return null;
}

Live.routeBasePath = "/live";
