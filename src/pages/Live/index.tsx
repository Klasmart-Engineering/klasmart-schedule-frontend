import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ContentType } from "../../api/type";
import { RootState } from "../../reducers";
import { onLoadContentPreview } from "../../reducers/content";
import { H5pPlayerInline } from "./H5pPlayerInline";

enum LiveType {
  preview = "preview",
}

const useQuery = () => {
  const query = new URLSearchParams(window.location.search);
  const content_id = query.get("content_id") ?? undefined;
  const schedule_id = query.get("schedule_id") ?? undefined;
  const type = query.get("type") ?? undefined;
  return { content_id, schedule_id, type };
};
export default function LiveH5p() {
  const { contentPreview, user_id } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const { content_id: materialId, schedule_id, type } = useQuery();
  const dispatch = useDispatch();
  const h5pContent =
    contentPreview.content_type === ContentType.material && contentPreview.data
      ? (JSON.parse(contentPreview.data)?.content as string)
      : undefined;
  useEffect(() => {
    if (!materialId) return;
    dispatch(onLoadContentPreview({ metaLoading: true, content_id: materialId, schedule_id: "" }));
  }, [materialId, dispatch]);
  if (!h5pContent) return null;
  return (
    <Box>
      <H5pPlayerInline
        isPreview={type === LiveType.preview}
        valueSource={h5pContent}
        id={materialId}
        scheduleId={schedule_id}
        userId={user_id}
      />
    </Box>
  );
}

LiveH5p.routeBasePath = "/live-h5p";
