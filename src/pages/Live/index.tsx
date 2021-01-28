import React from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { onLoadContentPreview } from "../../reducers/content";
import { H5pPlayer } from "../ContentEdit/H5pPlayer";
import { RootState } from "../../reducers";
import { ModelLessonPlan, Segment } from "../../models/ModelLessonPlan";
import { Box } from "@material-ui/core";
import { EntityContentInfoWithDetails } from "../../api/api.auto";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const content_id = query.get("content_id") as string;
  const schedule_id = query.get("schedule_id") as string;
  return { content_id, schedule_id };
};

export default function LiveH5p() {
  const { contentPreview, user_id } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const { content_id, schedule_id } = useQuery();
  const [h5pContent, setH5pContent] = React.useState<string>("");
  const dispatch = useDispatch();
  const checkH5p = (h5pArray: (EntityContentInfoWithDetails | undefined)[]) => {
    const res: any = h5pArray.filter((item: EntityContentInfoWithDetails | undefined) => {
      return JSON.parse(item?.data as string).file_type === 6;
    });
    if (res && res[0]) return JSON.parse(res[0].data);
  };
  React.useEffect(() => {
    window.parent.postMessage("[iFrameResizerChild]Ready", "*");
    dispatch(onLoadContentPreview({ metaLoading: true, content_id: content_id, schedule_id: "" }));
  }, [content_id, dispatch, schedule_id]);
  React.useEffect(() => {
    if (!contentPreview.id) return;
    const segment: Segment = JSON.parse(contentPreview.data || "{}");
    if (segment.content) {
      setH5pContent(segment.content);
    } else {
      const h5pArray = ModelLessonPlan.toArray(segment);
      const h5pItem = checkH5p(h5pArray);
      if (h5pItem && h5pItem.content) setH5pContent(h5pItem.content);
    }
  }, [contentPreview]);
  return <Box>{h5pContent && <H5pPlayer valueSource={h5pContent} id={content_id} scheduleId={schedule_id} userId={user_id} />}</Box>;
}

LiveH5p.routeBasePath = "/live-h5p";
