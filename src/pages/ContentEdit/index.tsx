import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import useSubscribe from "../../hooks/useSubscribe";
import mockList from "../../mocks/contentList.json";
import mockLessonPlan from "../../mocks/lessonPlan.json";
import { RootState } from "../../reducers";
import { onLoadContentEdit, publish } from "../../reducers/content";
import AssetDetails from "./AssetDetails";
import ContentH5p from "./ContentH5p";
import ContentHeader from "./ContentHeader";
import ContentTabs from "./ContentTabs";
import Details from "./Details";
import LayoutPair from "./Layout";
import MediaAssets from "./MediaAssets";
import MediaAssetsEdit, { MediaAssetsEditHeader } from "./MediaAssetsEdit";
import { MediaAssetsLibrary } from "./MediaAssetsLibrary";
import Outcomes from "./Outcomes";
import PlanComposeGraphic, { Segment } from "./PlanComposeGraphic";
import PlanComposeText, { SegmentText } from "./PlanComposeText";

interface RouteParams {
  lesson: "assets" | "material" | "plan";
  tab: "details" | "outcomes" | "media" | "assetDetails";
  rightside: "contentH5p" | "assetPreview" | "assetEdit" | "assetPreviewH5p" | "uploadH5p" | "planComposeGraphic" | "planComposeText";
}

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  return { id };
};

const parseRightside = (rightside: RouteParams["rightside"]) => ({
  includePlanComposeGraphic: rightside.includes("planComposeGraphic"),
  includePlanComposeText: rightside.includes("planComposeText"),
  includeH5p: rightside.includes("H5p"),
  includeAsset: rightside.includes("asset"),
  readonly: rightside.includes("Preview"),
});

export default function ContentEdit() {
  const dispatch = useDispatch();
  const { contentDetial } = useSelector<RootState, Partial<RootState["content"]>>((state) => ({
    contentDetial: state.content.contentDetial,
  }));
  const { trigger: triggerCancel, subscribe: subscribeCancel } = useSubscribe();
  const { trigger: triggerSave, subscribe: subscribeSave } = useSubscribe();
  const { lesson, tab, rightside } = useParams();
  const { id } = useQuery();
  const history = useHistory();
  const { routeBasePath } = ContentEdit;
  const { includeAsset, includeH5p, readonly, includePlanComposeGraphic, includePlanComposeText } = parseRightside(rightside);
  const handleChangeLesson = (lesson: string) => {
    const rightSide = `${lesson === "assets" ? "assetEdit" : lesson === "material" ? "contentH5p" : "planComposeGraphic"}`;
    const tab = lesson === "assets" ? "assetDetails" : "details";
    history.push(`${routeBasePath}/lesson/${lesson}/tab/${tab}/rightside/${rightSide}`);
  };
  const handleChangeTab = (tab: string) => {
    history.push(`${routeBasePath}/lesson/${lesson}/tab/${tab}/rightside/${rightside}`);
  };
  const handlePublish = () => {
    if (!id) return;
    dispatch(publish(id));
  };
  useEffect(() => {
    dispatch(onLoadContentEdit({ id, type: lesson }));
  }, [id, lesson, dispatch]);
  const assetDetails = (
    <MediaAssetsLibrary>
      <MediaAssetsEditHeader />
      <AssetDetails />
    </MediaAssetsLibrary>
  );
  const contentTabs = (
    <ContentTabs tab={tab} onChangeTab={handleChangeTab}>
      <Details contentDetail={contentDetial} subscribeCancel={subscribeCancel} subscribeSave={subscribeSave} />
      <Outcomes comingsoon />
      <MediaAssets list={mockList} comingsoon />
    </ContentTabs>
  );
  const rightsideArea = (
    <>
      {includeH5p && includeAsset && (
        <ContentH5p>
          <MediaAssetsEdit readonly={readonly} overlay />
        </ContentH5p>
      )}
      {includeH5p && !includeAsset && <ContentH5p />}
      {!includeH5p && includeAsset && <MediaAssetsEdit readonly={readonly} overlay={includeH5p} />}
      {includePlanComposeGraphic && <PlanComposeGraphic plan={mockLessonPlan as Segment} />}
      {includePlanComposeText && <PlanComposeText plan={mockLessonPlan as SegmentText} droppableType="material" />}
    </>
  );
  const leftsideArea = tab === "assetDetails" ? assetDetails : contentTabs;
  return (
    <DndProvider backend={HTML5Backend}>
      <ContentHeader
        contentDetial={contentDetial}
        lesson={lesson}
        onChangeLesson={handleChangeLesson}
        onCancel={triggerCancel}
        onSave={triggerSave}
        onPublish={handlePublish}
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        {leftsideArea}
        {rightsideArea}
      </LayoutPair>
    </DndProvider>
  );
}

ContentEdit.routeBasePath = "/library/content-edit";
ContentEdit.routeMatchPath = "/library/content-edit/lesson/:lesson/tab/:tab/rightside/:rightside";
ContentEdit.routeRedirectDefault = "/library/content-edit/lesson/material/tab/details/rightside/contentH5p";
