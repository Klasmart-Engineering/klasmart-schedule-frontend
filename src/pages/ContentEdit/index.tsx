import React, { useCallback, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { CreateContentRequest } from "../../api/api";
import mockLessonPlan from "../../mocks/lessonPlan.json";
import { RootState } from "../../reducers";
import { onLoadContentEdit, publish, save } from "../../reducers/content";
import AssetDetails from "./AssetDetails";
import ContentH5p from "./ContentH5p";
import ContentHeader from "./ContentHeader";
import ContentTabs from "./ContentTabs";
import Details from "./Details";
import LayoutPair from "./Layout";
import MediaAssets, { MediaAssetsProps } from "./MediaAssets";
import MediaAssetsEdit, { MediaAssetsEditHeader } from "./MediaAssetsEdit";
import { MediaAssetsLibrary } from "./MediaAssetsLibrary";
import Outcomes from "./Outcomes";
import { PlanComposeGraphic } from "./PlanComposeGraphic";
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
  const searchText = query.get("searchText") || "";
  return { id, searchText };
};

const setQuery = (search: string, hash: Record<string, string>): string => {
  const query = new URLSearchParams(search);
  Object.keys(hash).forEach((key) => query.set(key, hash[key]));
  return query.toString();
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
  const formMethods = useForm<CreateContentRequest>();
  const {
    reset,
    handleSubmit,
    control,
    formState: { isDirty },
    getValues,
    watch,
  } = formMethods;
  const { contentDetail, mediaList, mockOptions } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const { lesson, tab, rightside } = useParams();
  const { id, searchText } = useQuery();
  const history = useHistory();
  const { routeBasePath } = ContentEdit;
  const { includeAsset, includeH5p, readonly, includePlanComposeGraphic, includePlanComposeText } = parseRightside(rightside);
  const handleChangeLesson = useMemo(
    () => (lesson: string) => {
      const rightSide = `${lesson === "assets" ? "assetEdit" : lesson === "material" ? "contentH5p" : "planComposeGraphic"}`;
      const tab = lesson === "assets" ? "assetDetails" : "details";
      history.push(`${routeBasePath}/lesson/${lesson}/tab/${tab}/rightside/${rightSide}`);
    },
    [history, routeBasePath]
  );
  const handleChangeTab = useMemo(
    () => (tab: string) => {
      history.push(`${routeBasePath}/lesson/${lesson}/tab/${tab}/rightside/${rightside}`);
    },
    [history, routeBasePath, lesson, rightside]
  );
  const handlePublish = useCallback(async () => {
    if (!id) return;
    await dispatch(publish(id));
    history.push("/");
  }, [dispatch, id, history]);
  const handleSave = useMemo(
    () =>
      handleSubmit(async (value: CreateContentRequest) => {
        const {
          payload: { id },
        } = (await dispatch(save({ ...value, content_type: lesson === "material" ? 1 : 2, data: JSON.stringify(value.data) }))) as any;
        if (id) {
          history.push({
            search: setQuery(history.location.search, { id }),
          });
        }
      }),
    [handleSubmit, dispatch, history, lesson]
  );
  const handleSearch = useMemo<MediaAssetsProps["onSearch"]>(
    () => (searchText = "") => {
      history.push({
        search: setQuery(history.location.search, { searchText }),
      });
    },
    [history]
  );
  useEffect(() => {
    dispatch(onLoadContentEdit({ id, type: lesson, searchText }));
  }, [id, lesson, dispatch, searchText, history]);
  useEffect(() => {
    reset(contentDetail);
  }, [contentDetail, reset]);
  // useEffect(()=>{dispatch(syncHistory(history))}, [history, dispatch]);
  const assetDetails = (
    <MediaAssetsLibrary>
      <MediaAssetsEditHeader />
      <AssetDetails />
    </MediaAssetsLibrary>
  );
  const contentTabs = (
    <ContentTabs tab={tab} onChangeTab={handleChangeTab}>
      <Details contentDetail={contentDetail} formMethods={formMethods} mockOptions={mockOptions} />
      <Outcomes comingsoon />
      <MediaAssets list={mediaList} comingsoon onSearch={handleSearch} searchText={searchText} />
    </ContentTabs>
  );
  const rightsideArea = (
    <>
      {includeH5p && includeAsset && (
        <ContentH5p>
          <MediaAssetsEdit readonly={readonly} overlay />
        </ContentH5p>
      )}
      {includeH5p && !includeAsset && (
        <Controller name="data" as={ContentH5p} defaultValue={contentDetail.data} control={control} rules={{ required: true }} />
      )}
      {!includeH5p && includeAsset && <MediaAssetsEdit readonly={readonly} overlay={includeH5p} />}
      {includePlanComposeGraphic && <Controller name="data" as={PlanComposeGraphic} defaultValue={contentDetail} control={control} />}
      {includePlanComposeText && <PlanComposeText plan={mockLessonPlan as SegmentText} droppableType="material" />}
    </>
  );
  const leftsideArea = tab === "assetDetails" ? assetDetails : contentTabs;
  return (
    <DndProvider backend={HTML5Backend}>
      <ContentHeader
        contentDetail={contentDetail}
        lesson={lesson}
        onChangeLesson={handleChangeLesson}
        onCancel={reset}
        onSave={handleSave}
        onPublish={handlePublish}
        isDirty={isDirty}
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
