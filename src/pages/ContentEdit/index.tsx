import React, { Fragment } from "react";
import ContentHeader from "./ContentHeader";
import { useParams, useHistory, useLocation } from "react-router-dom";
import ContentTabs from "./ContentTabs";
import ContentH5p from "./ContentH5p";
import LayoutPair from "./Layout";
import Details from "./Details";
import Outcomes from "./Outcomes";
import MediaAssets from "./MediaAssets";
import mockList from "../../mocks/contentList.json";
import {
  MediaAssetsLibraryHeader,
  MediaAssetsLibrary,
} from "./MediaAssetsLibrary";
import MediaAssetsEdit from "./MediaAssetsEdit";
import PlanComposeGraphic from "./PlanComposeGraphic";
import PlanComposeText from "./PlanComposeText";

interface RouteParams {
  lesson: "assets" | "material" | "plan";
  tab: "details" | "outcomes" | "assets";
  rightside:
    | "contentH5p"
    | "assetPreview"
    | "assetEdit"
    | "assetPreviewH5p"
    | "uploadH5p"
    | "planComposeGraphic";
}

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const assetId = query.get("assetId");
  return { assetId };
};

const parseRightside = (rightside: RouteParams["rightside"]) => ({
  includePlanComposeGraphic: rightside.includes("planComposeGraphic"),
  includePlanComposeText: rightside.includes("planComposeText"),
  includeH5p: rightside.includes("H5p"),
  includeAsset: rightside.includes("asset"),
  readonly: rightside.includes("Preview"),
});

export default function ContentEdit() {
  const { lesson, tab, rightside } = useParams();
  const { assetId } = useQuery();
  const history = useHistory();
  const { routeBasePath } = ContentEdit;
  const {
    includeAsset,
    includeH5p,
    readonly,
    includePlanComposeGraphic,
    includePlanComposeText,
  } = parseRightside(rightside);
  const handleChangeLesson = (lesson: string) => {
    history.push(`${routeBasePath}/lesson/${lesson}/tab/details`);
  };
  const handleChangeTab = (tab: string) => {
    history.push(`${routeBasePath}/lesson/${lesson}/tab/${tab}`);
  };
  const assetsLibrary = (
    <MediaAssetsLibrary>
      <MediaAssetsLibraryHeader />
      <MediaAssets list={mockList} library />
    </MediaAssetsLibrary>
  );
  const contentTabs = (
    <ContentTabs tab={tab} onChangeTab={handleChangeTab}>
      <Details />
      <Outcomes />
      <MediaAssets list={mockList} />
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
      {!includeH5p && includeAsset && (
        <MediaAssetsEdit readonly={readonly} overlay={includeH5p} />
      )}
      {includePlanComposeGraphic && <PlanComposeGraphic />}
      {includePlanComposeText && <PlanComposeText />}
    </>
  );
  return (
    <Fragment>
      <ContentHeader lesson={lesson} onChangeLesson={handleChangeLesson} />
      <LayoutPair
        breakpoint="md"
        leftWidth={703}
        rightWidth={1105}
        spacing={32}
        basePadding={0}
        padding={40}
      >
        {tab === "assetsLibrary" ? assetsLibrary : contentTabs}
        {rightsideArea}
      </LayoutPair>
    </Fragment>
  );
}

ContentEdit.routeBasePath = "/content-edit";
ContentEdit.routeMatchPath =
  "/content-edit/lesson/:lesson/tab/:tab/rightside/:rightside";
ContentEdit.routeRedirectDefault =
  "/content-edit/lesson/material/tab/details/rightside/contentH5p";
