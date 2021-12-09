// import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { apiLivePath } from "@api/extra";
import { ContentType } from "@api/type";
import { Box } from "@material-ui/core";
import {
  approveContent,
  deleteContent,
  getLiveToken,
  lockContent,
  onLoadContentPreview,
  publishContent,
  rejectContent,
} from "@reducers/content";
import { RootState } from "@reducers/index";
import { actSuccess } from "@reducers/notify";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { Fragment, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { ModelLessonPlan, Segment } from "../../models/ModelLessonPlan";
import LayoutPair from "../ContentEdit/Layout";
import { ContentPreviewHeader } from "./ContentPreviewHeader";
import { Detail } from "./Detail";
import { H5pPreview } from "./H5pPreview";
import { LearningOutcome } from "./LeaningOutcomes";
import { OperationBtn } from "./OperationBtn";
import { TabValue } from "./type";

interface RouteParams {
  tab: "details" | "outcomes";
}
const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id") as string;
  const sid = query.get("sid") as string;
  const author = query.get("author");
  const class_id = query.get("class_id") as string;
  const program_group = query.get("program_group") as string | "";
  return { id, search, sid, author, class_id, program_group };
};
export default function ContentPreview(props: EntityContentInfoWithDetails) {
  const dispatch = useDispatch();
  const { routeBasePath } = ContentPreview;
  const { id, search, sid, author, class_id, program_group } = useQuery();
  const { contentPreview } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const { scheduleDetial } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const { tab } = useParams<RouteParams>();
  const content_type = contentPreview.content_type;
  const history = useHistory();
  const handleDelete = async () => {
    await dispatch(deleteContent({ id, type: "delete" }));
    history.go(-1);
  };
  const handlePublish = async () => {
    await dispatch(publishContent(id));
    history.go(-1);
  };
  const handleApprove = async () => {
    await dispatch(approveContent(id));
    history.go(-1);
  };
  const handleReject = async () => {
    const { payload } = (await dispatch(rejectContent({ id: id }))) as unknown as PayloadAction<AsyncTrunkReturned<typeof rejectContent>>;
    if (payload === "ok") {
      dispatch(actSuccess("Reject success"));
      history.go(-1);
    }
  };
  const handleEdit = async () => {
    const lesson =
      contentPreview.content_type_name === "Material" ? "material" : contentPreview.content_type_name === "Plan" ? "plan" : "material";
    const rightSide =
      contentPreview.content_type_name === "Material"
        ? "contentH5p"
        : contentPreview.content_type_name === "Plan"
        ? "planComposeGraphic"
        : "contentH5p";
    if (contentPreview.publish_status === "published") {
      const { payload } = (await dispatch(lockContent(id))) as unknown as PayloadAction<AsyncTrunkReturned<typeof lockContent>>;
      if (payload.id) {
        history.push(`/library/content-edit/lesson/${lesson}/tab/details/rightside/${rightSide}?id=${payload.id}`);
      }
    } else {
      history.push(`/library/content-edit/lesson/${lesson}/tab/details/rightside/${rightSide}?id=${id}`);
    }
  };
  const handleClose = () => {
    history.go(-1);
  };
  const handleChangeTab = useMemo(
    () => (value: string) => {
      history.replace(`${routeBasePath}/tab/${value}${search}`);
    },
    [history, routeBasePath, search]
  );

  const handleGoLive = async () => {
    let winOpen = window.open("", "_blanck");
    const { payload } = (await dispatch(getLiveToken({ content_id: id, schedule_id: sid }))) as unknown as PayloadAction<
      AsyncTrunkReturned<typeof getLiveToken>
    >;
    winOpen && (winOpen.location = apiLivePath(payload));
  };
  const leftside = (
    <Box style={{ padding: 12 }}>
      <ContentPreviewHeader
        tab={tab}
        contentPreview={contentPreview}
        content_type={content_type}
        onClose={handleClose}
        onChangeTab={handleChangeTab}
      />
      {tab === TabValue.details ? (
        <Detail contentPreview={contentPreview} />
      ) : (
        <LearningOutcome list={contentPreview.outcome_entities || []} />
      )}
      {tab === TabValue.details && !program_group && (
        <OperationBtn
          permission={contentPreview.permission}
          author={author}
          isMine={contentPreview.is_mine}
          publish_status={contentPreview.publish_status}
          content_type={contentPreview.content_type}
          onDelete={handleDelete}
          onPublish={handlePublish}
          onApprove={handleApprove}
          onReject={handleReject}
          onEdit={handleEdit}
        />
      )}
    </Box>
  );
  const planRes = (): (EntityContentInfoWithDetails | undefined)[] => {
    if (contentPreview.content_type === ContentType.plan) {
      const segment: Segment = JSON.parse(contentPreview.data || "{}");
      const h5pArray = ModelLessonPlan.toArray(segment);
      return h5pArray;
    } else {
      return [contentPreview];
    }
  };
  const rightside = (
    <Fragment>
      {contentPreview.id && (
        <H5pPreview
          content_type={contentPreview.content_type}
          classType={scheduleDetial.class_type}
          h5pArray={planRes()}
          onGoLive={handleGoLive}
        ></H5pPreview>
      )}
    </Fragment>
  );
  useEffect(() => {
    dispatch(onLoadContentPreview({ metaLoading: true, content_id: id, schedule_id: sid }));
  }, [class_id, dispatch, id, sid]);
  return (
    <Fragment>
      <LayoutPair
        breakpoint="md"
        leftWidth={434}
        rightWidth={1400}
        spacing={0}
        basePadding={0}
        padding={0}
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
      >
        {leftside}
        {rightside}
      </LayoutPair>
    </Fragment>
  );
}
ContentPreview.routeBasePath = "/library/content-preview";
ContentPreview.routeMatchPath = "/library/content-preview/tab/:tab";
ContentPreview.routeRedirectDefault = `/library/content-preview/tab/details`;
