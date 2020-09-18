import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { ApiOutcomeView } from "../../api/api.auto";
import { ContentType, OutcomePublishStatus, SearchContentsRequestContentType } from "../../api/type";
import mockLessonPlan from "../../mocks/lessonPlan.json";
import { ContentDetailForm, ModelContentDetailForm } from "../../models/ModelContentDetailForm";
import { ModelLessonPlan } from "../../models/ModelLessonPlan";
import { ModelMockOptions } from "../../models/ModelMockOptions";
import { RootState } from "../../reducers";
import {
  AsyncTrunkReturned,
  contentLists,
  deleteContent,
  onLoadContentEdit,
  publish,
  save,
  searchOutcomeList,
} from "../../reducers/content";
import MyContentList from "../MyContentList";
import AssetDetails from "./AssetDetails";
import ContentH5p from "./ContentH5p";
import ContentHeader from "./ContentHeader";
import ContentTabs from "./ContentTabs";
import Details from "./Details";
import LayoutPair from "./Layout";
import MediaAssets, { MediaAssetsProps } from "./MediaAssets";
import MediaAssetsEdit, { MediaAssetsEditHeader } from "./MediaAssetsEdit";
import { MediaAssetsLibrary } from "./MediaAssetsLibrary";
import Outcomes, { OutcomesProps } from "./Outcomes";
import { PlanComposeGraphic } from "./PlanComposeGraphic";
import PlanComposeText, { SegmentText } from "./PlanComposeText";

interface RouteParams {
  lesson: "assets" | "material" | "plan";
  tab: "details" | "outcomes" | "media" | "assetDetails";
  rightside: "contentH5p" | "assetPreview" | "assetEdit" | "assetPreviewH5p" | "uploadH5p" | "planComposeGraphic" | "planComposeText";
}

type contentFileType = "image" | "video" | "audio" | "document";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  const searchMedia = query.get("searchMedia") || "";
  const searchOutcome = query.get("searchOutcome") || "";
  const assumed = query.get("assumed") || "";
  const editindex: number = Number(query.get("editindex") || 0);
  return { id, searchMedia, searchOutcome, search, editindex, assumed };
};

const setQuery = (search: string, hash: Record<string, string | number | boolean>): string => {
  const query = new URLSearchParams(search);
  Object.keys(hash).forEach((key) => query.set(key, String(hash[key])));
  return query.toString();
};

const parseRightside = (rightside: RouteParams["rightside"]) => ({
  includePlanComposeGraphic: rightside.includes("planComposeGraphic"),
  includePlanComposeText: rightside.includes("planComposeText"),
  includeH5p: rightside.includes("H5p"),
  includeAsset: rightside.includes("asset"),
  readonly: rightside.includes("Preview"),
});

const type2File = {
  image: ContentType.image,
  video: ContentType.video,
  audio: ContentType.audio,
  document: ContentType.doc,
};

export default function ContentEdit() {
  const dispatch = useDispatch();
  const formMethods = useForm<ContentDetailForm>();
  const {
    reset,
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { isDirty },
  } = formMethods;
  const { contentDetail, mediaList, mockOptions, MediaListTotal, OutcomesListTotal, outcomeList } = useSelector<
    RootState,
    RootState["content"]
  >((state) => state.content);
  const { lesson, tab, rightside } = useParams();
  const { id, searchMedia, search, editindex, searchOutcome, assumed } = useQuery();
  const history = useHistory();
  const { routeBasePath } = ContentEdit;
  const { includeAsset, includeH5p, readonly, includePlanComposeGraphic, includePlanComposeText } = parseRightside(rightside);
  const [assetsFileType, setAssetsFileType] = React.useState<contentFileType>("image");
  const content_type = lesson === "material" ? ContentType.material : lesson === "assets" ? type2File[assetsFileType] : ContentType.plan;
  const { program: [programId] = [], developmental: [developmentalId] = [] } = watch(["program", "developmental"]);
  const flattenedMockOptions = ModelMockOptions.toFlatten({ programId, developmentalId }, mockOptions);
  const handleChangeLesson = useMemo(
    () => (lesson: string) => {
      const rightSide = `${lesson === "assets" ? "assetEdit" : lesson === "material" ? "contentH5p" : "planComposeGraphic"}`;
      const tab = lesson === "assets" ? "assetDetails" : "details";
      history.replace(`${routeBasePath}/lesson/${lesson}/tab/${tab}/rightside/${rightSide}`);
    },
    [history, routeBasePath]
  );

  const handleChangeTab = useMemo(
    () => (tab: string) => {
      history.replace(`${routeBasePath}/lesson/${lesson}/tab/${tab}/rightside/${rightside}${search}`);
    },
    [history, routeBasePath, lesson, rightside, search]
  );

  const handleSave = useMemo(
    () =>
      handleSubmit(async (value: ContentDetailForm) => {
        const { outcome_entities, ...restValues } = value;
        const outcomes = outcome_entities?.map((v) => v.outcome_id as string);
        const input = { ...restValues, content_type, outcomes };
        if (lesson === "assets") Object.assign(input, { data: { source: value.data.toString() } });
        const contentDetail = ModelContentDetailForm.encode(input);
        const { payload: id } = ((await dispatch(save(contentDetail))) as unknown) as PayloadAction<AsyncTrunkReturned<typeof save>>;
        if (id) {
          if (lesson === "assets") {
            // assets 创建直接返回列表
            history.push(`${MyContentList.routeBasePath}?content_type=3&order_by=-created_at&page=1`);
          } else {
            history.replace({
              search: setQuery(history.location.search, { id, editindex: editindex + 1 }),
            });
          }
        }
      }),
    [handleSubmit, content_type, lesson, dispatch, history, editindex]
  );

  const handlePublish = useCallback(async () => {
    if (lesson === "assets") await handleSave();
    if (!id) return;
    await dispatch(publish(id));
    history.replace("/");
  }, [lesson, handleSave, id, dispatch, history]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    await dispatch(deleteContent({ id, type: "delete" }));
    history.goBack();
  }, [dispatch, id, history]);

  const handleSearchMedia = useMemo<MediaAssetsProps["onSearch"]>(
    () => (searchMedia = "") => {
      history.replace({
        search: setQuery(history.location.search, { searchMedia }),
      });
      dispatch(
        contentLists({
          content_type: lesson === "material" ? SearchContentsRequestContentType.assets : SearchContentsRequestContentType.material,
          publish_status: "published",
          name: searchMedia,
        })
      );
    },
    [dispatch, history, lesson]
  );
  const handleSearchOutcomes = useMemo<OutcomesProps["onSearch"]>(
    () => (searchOutcome = "") => {
      history.replace({
        search: setQuery(history.location.search, { searchOutcome }),
      });
      dispatch(
        searchOutcomeList({
          publish_status: OutcomePublishStatus.published,
          search_key: searchOutcome,
          page_size: 10,
          assumed: assumed === "true" ? 1 : -1,
        })
      );
    },
    [assumed, dispatch, history]
  );
  const handleCheckAssumed = useMemo<OutcomesProps["onCheck"]>(
    () => (assumed = "") => {
      history.replace({
        search: setQuery(history.location.search, { assumed }),
      });
      dispatch(
        searchOutcomeList({
          publish_status: OutcomePublishStatus.published,
          search_key: searchOutcome,
          page_size: 10,
          assumed: assumed === "true" ? 1 : -1,
        })
      );
    },
    [dispatch, history, searchOutcome]
  );
  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const [, setPage] = React.useState(0);

  const handleChangeFile = (type: contentFileType) => {
    const formValues: object = getValues();
    reset(ModelContentDetailForm.decode({ ...formValues, data: "" }));
    setAssetsFileType(type);
  };

  const handleChangePage = useMemo(
    () => (page: number) => {
      setPage(page);
      dispatch(
        contentLists({
          content_type: lesson === "material" ? SearchContentsRequestContentType.assets : SearchContentsRequestContentType.material,
          publish_status: "published",
          page,
          name: searchMedia,
        })
      );
    },
    [dispatch, lesson, searchMedia]
  );
  const handleChangePageOutCome = useMemo(
    () => (page: number) => {
      setPage(page);
      dispatch(
        searchOutcomeList({
          page,
          publish_status: OutcomePublishStatus.published,
          search_key: searchOutcome,
          page_size: 10,
          assumed: assumed === "true" ? 1 : -1,
        })
      );
    },
    [assumed, dispatch, searchOutcome]
  );
  const handleGoOutcomeDetail = useMemo(
    () => (id: ApiOutcomeView["outcome_id"]) => {
      history.push(`/assessments/outcome-edit?outcome_id=${id}`);
    },
    [history]
  );
  const handleChangeProgram = useMemo(
    () => ([programId]: string[]) => {
      ModelMockOptions.updateValuesWhenProgramChange(setValue, mockOptions, programId);
    },
    [mockOptions, setValue]
  );
  const handleChangeDevelopmental = useCallback(() => setValue("skills", []), [setValue]);
  useEffect(() => {
    dispatch(onLoadContentEdit({ id, type: lesson, metaLoading: true }));
  }, [id, lesson, dispatch, history, editindex]);
  useEffect(() => {
    // 编辑表单时 加载完 contentDetial 的逻辑
    reset(ModelContentDetailForm.decode(contentDetail));
    if (lesson === "assets")
      Object.getOwnPropertyNames(type2File).forEach((key: string) => {
        if (contentDetail.content_type === type2File[key as contentFileType]) setAssetsFileType(key as contentFileType);
      });
  }, [contentDetail, lesson, reset]);
  useEffect(() => {
    // 新建表单时，加载完 mockOptions 的逻辑
    if (id) return;
    const defaultProgramId = ModelMockOptions.getDefaultProgramId(mockOptions);
    const defaultDevelopmentalId = ModelMockOptions.getDefaultDevelopmental(mockOptions, defaultProgramId);
    if (!defaultDevelopmentalId || !defaultProgramId) return;
    const onlyOneOptionValue = ModelMockOptions.getOnlyOneOptionValue(
      ModelMockOptions.toFlatten({ programId: defaultProgramId, developmentalId: defaultDevelopmentalId }, mockOptions)
    );
    reset({ program: [defaultProgramId], developmental: [defaultDevelopmentalId], ...onlyOneOptionValue });
  }, [mockOptions, reset, id]);
  const assetDetails = (
    <MediaAssetsLibrary>
      <MediaAssetsEditHeader />
      <AssetDetails
        formMethods={formMethods}
        flattenedMockOptions={flattenedMockOptions}
        fileType={assetsFileType}
        handleChangeFile={handleChangeFile}
        contentDetail={contentDetail}
        onChangeProgram={handleChangeProgram}
        onChangeDevelopmental={handleChangeDevelopmental}
      />
    </MediaAssetsLibrary>
  );
  const contentTabs = (
    <ContentTabs tab={tab} onChangeTab={handleChangeTab}>
      <Details
        contentDetail={contentDetail}
        formMethods={formMethods}
        flattenedMockOptions={flattenedMockOptions}
        onChangeProgram={handleChangeProgram}
        onChangeDevelopmental={handleChangeDevelopmental}
      />
      <Controller
        as={Outcomes}
        name="outcome_entities"
        defaultValue={contentDetail.outcome_entities}
        control={control}
        list={outcomeList}
        onSearch={handleSearchOutcomes}
        onCheck={handleCheckAssumed}
        searchName={searchOutcome}
        assumed={assumed}
        total={OutcomesListTotal}
        onChangePage={handleChangePageOutCome}
        onGoOutcomesDetail={handleGoOutcomeDetail}
      />
      <MediaAssets
        list={mediaList}
        comingsoon
        onSearch={handleSearchMedia}
        value={searchMedia}
        onChangePage={handleChangePage}
        total={MediaListTotal}
      />
    </ContentTabs>
  );
  const rightsideArea = (
    <>
      {includeH5p && includeAsset && (
        <ContentH5p>
          <MediaAssetsEdit readonly={readonly} overlay fileType={assetsFileType} formMethods={formMethods} contentDetail={contentDetail} />
        </ContentH5p>
      )}
      {includeH5p && !includeAsset && (
        <Controller
          name="data"
          as={ContentH5p}
          defaultValue={contentDetail.data}
          control={control}
          rules={{ required: true }}
          isCreate={!id}
        />
      )}
      {!includeH5p && includeAsset && (
        <MediaAssetsEdit
          readonly={readonly}
          overlay={includeH5p}
          fileType={assetsFileType}
          formMethods={formMethods}
          contentDetail={contentDetail}
        />
      )}
      {includePlanComposeGraphic && (
        <Controller
          name="data"
          as={PlanComposeGraphic}
          defaultValue={ModelLessonPlan.toSegment(contentDetail.data || "{}")}
          control={control}
        />
      )}
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
        onCancel={handleGoBack}
        onSave={handleSave}
        onPublish={handlePublish}
        isDirty={isDirty}
        onBack={handleGoBack}
        onDelete={handleDelete}
        id={id}
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
