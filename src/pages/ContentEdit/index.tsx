import { PayloadAction } from "@reduxjs/toolkit";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { ApiOutcomeView } from "../../api/api.auto";
import { ContentInputSourceType, ContentType, H5pSub, SearchContentsRequestContentType } from "../../api/type";
import { PermissionOr, PermissionType } from "../../components/Permission";
import { permissionTip } from "../../components/TipImages";
import mockLessonPlan from "../../mocks/lessonPlan.json";
import { ContentDetailForm, ModelContentDetailForm } from "../../models/ModelContentDetailForm";
import { isDataSourceNewH5p } from "../../models/ModelH5pSchema";
import { ModelLessonPlan } from "../../models/ModelLessonPlan";
import { ModelMockOptions } from "../../models/ModelMockOptions";
import { RootState } from "../../reducers";
import {
  AsyncTrunkReturned,
  deleteContent,
  getLinkedMockOptions,
  getLinkedMockOptionsSkills,
  onLoadContentEdit,
  publish,
  publishWidthAssets,
  save,
  searchAuthContentLists,
  searchContentLists,
  searchOutcomeList,
} from "../../reducers/content";
import { H5pComposeEditor } from "../H5pEditor/H5pComposeEditor";
import MyContentList from "../MyContentList";
import AssetDetails from "./AssetDetails";
import ContentH5p from "./ContentH5p";
import { ContentHeader, SelectH5PRadio, SelectLesson } from "./ContentHeader";
import ContentTabs from "./ContentTabs";
import Details from "./Details";
import LayoutPair from "./Layout";
import MediaAssets, { MediaAssetsProps } from "./MediaAssets";
import MediaAssetsEdit from "./MediaAssetsEdit";
import { Outcomes, OutcomesProps } from "./Outcomes";
import { PlanComposeGraphic } from "./PlanComposeGraphic";
import PlanComposeText, { SegmentText } from "./PlanComposeText";
import { Regulation } from "./type";

interface RouteParams {
  lesson: "assets" | "material" | "plan";
  tab: "details" | "outcomes" | "media" | "assetDetails";
  rightside: "contentH5p" | "assetPreview" | "assetEdit" | "assetPreviewH5p" | "uploadH5p" | "planComposeGraphic" | "planComposeText";
}

export const useQueryCms = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  const searchMedia = query.get("searchMedia") || "";
  const searchOutcome = query.get("searchOutcome") || "";
  const assumed = query.get("assumed") || "";
  const isShare = query.get("isShare") || "org";
  const editindex: number = Number(query.get("editindex") || 0);
  const back = query.get("back") || "";
  return { id, searchMedia, searchOutcome, search, editindex, assumed, isShare, back };
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

function ContentEditForm() {
  const dispatch = useDispatch();
  const formMethods = useForm<ContentDetailForm>();
  const { handleSubmit, control, setValue, watch, errors } = formMethods;
  // console.log("errors =", errors);

  const {
    contentDetail,
    mediaList,
    mediaListTotal,
    OutcomesListTotal,
    outcomeList,
    linkedMockOptions,
    visibility_settings,
    lesson_types,
  } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const { lesson, tab, rightside } = useParams();
  const searchContentType = lesson === "material" ? SearchContentsRequestContentType.assets : SearchContentsRequestContentType.material;
  const { id, searchMedia, search, editindex, searchOutcome, assumed, isShare, back } = useQueryCms();
  const [regulation, setRegulation] = useState<Regulation>(id ? Regulation.ByContentDetail : Regulation.ByContentDetailAndOptionCount);
  const history = useHistory();
  const [mediaPage, setMediaPage] = React.useState(1);
  const [outcomePage, setOutcomePage] = React.useState(1);
  const { routeBasePath } = ContentEdit;
  const { includeAsset, includeH5p, readonly, includePlanComposeGraphic, includePlanComposeText } = parseRightside(rightside);
  const content_type = lesson === "material" ? ContentType.material : lesson === "assets" ? ContentType.assets : ContentType.plan;
  const { program, developmental } = watch(["program", "developmental"]);
  const inputSource: ContentInputSourceType = watch("data.input_source");
  const allDefaultValueAndKey = ModelMockOptions.createAllDefaultValueAndKey(
    { regulation, contentDetail, linkedMockOptions },
    { program, developmental }
  );
  const isNewH5p = isDataSourceNewH5p(contentDetail.data, id);
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
        const contentDetail = ModelContentDetailForm.encode(input);
        const { payload: id } = ((await dispatch(save(contentDetail))) as unknown) as PayloadAction<AsyncTrunkReturned<typeof save>>;
        if (id) {
          if (lesson === "assets") {
            // assets 创建直接返回列表
            history.push(
              `${MyContentList.routeBasePath}?content_type=${SearchContentsRequestContentType.assetsandfolder}&order_by=-update_at&page=1`
            );
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
    if (watch("isOnlyMaterial") === "assetAndMaterial") {
      await dispatch(publishWidthAssets(id));
    } else {
      await dispatch(publish(id));
    }
    history.replace("/ ");
  }, [lesson, handleSave, id, watch, history, dispatch]);

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
      isShare === "badanamu" && lesson === "plan"
        ? dispatch(
            searchAuthContentLists({
              metaLoading: true,
              content_type: searchContentType,
              name: searchMedia,
            })
          )
        : dispatch(
            searchContentLists({
              metaLoading: true,
              content_type: searchContentType,
              name: searchMedia,
            })
          );
      setMediaPage(1);
    },
    [dispatch, history, isShare, searchContentType, lesson]
  );
  const handleSearchOutcomes = useMemo<OutcomesProps["onSearch"]>(
    () => (searchOutcome = "") => {
      history.replace({
        search: setQuery(history.location.search, { searchOutcome }),
      });
      dispatch(
        searchOutcomeList({
          metaLoading: true,
          search_key: searchOutcome,
          assumed: assumed === "true" ? 1 : -1,
        })
      );
      setOutcomePage(1);
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
          metaLoading: true,
          search_key: searchOutcome,
          assumed: assumed === "true" ? 1 : -1,
        })
      );
      setOutcomePage(1);
    },
    [dispatch, history, searchOutcome]
  );
  const handleCheckShare = useMemo(
    () => (isShare: MediaAssetsProps["isShare"] = "org") => {
      history.replace({
        search: setQuery(history.location.search, { isShare }),
      });
      isShare === "badanamu" && lesson === "plan"
        ? dispatch(
            searchAuthContentLists({
              metaLoading: true,
              content_type: searchContentType,
              name: searchMedia,
            })
          )
        : dispatch(
            searchContentLists({
              metaLoading: true,
              content_type: searchContentType,
              name: searchMedia,
            })
          );
    },
    [dispatch, history, searchContentType, searchMedia, lesson]
  );
  const handleGoBack = useCallback(() => {
    back ? history.push(back) : history.goBack();
  }, [back, history]);

  const handleChangePage = useMemo(
    () => (page: number) => {
      setMediaPage(page);
      isShare === "badanamu" && lesson === "plan"
        ? dispatch(
            searchAuthContentLists({
              metaLoading: true,
              content_type: searchContentType,
              name: searchMedia,
              page,
            })
          )
        : dispatch(
            searchContentLists({
              metaLoading: true,
              content_type: searchContentType,
              name: searchMedia,
              page,
            })
          );
    },
    [dispatch, searchContentType, searchMedia, lesson, isShare]
  );
  const handleChangePageOutCome = useMemo(
    () => (page: number) => {
      setOutcomePage(page);
      dispatch(
        searchOutcomeList({
          metaLoading: true,
          page,
          search_key: searchOutcome,
          assumed: assumed === "true" ? 1 : -1,
        })
      );
    },
    [assumed, dispatch, searchOutcome]
  );
  const handleGoOutcomeDetail = useMemo(
    () => (id: ApiOutcomeView["outcome_id"]) => {
      window.open(`#/assessments/outcome-edit?outcome_id=${id}&readonly=true`, "_blank");
    },
    []
  );

  const handleClosePreview = useCallback(() => {
    setValue("data.source", "", { shouldDirty: true });
  }, [setValue]);

  const handleChangeProgram = useMemo(
    () => async (programId: string) => {
      setRegulation(Regulation.ByOptionCount);
      dispatch(getLinkedMockOptions({ metaLoading: true, default_program_id: programId }));
    },
    [dispatch]
  );
  const handleChangeDevelopmental = useMemo(
    () => (developmental_id: string[]) => {
      setRegulation(Regulation.ByOptionCount);
      dispatch(
        getLinkedMockOptionsSkills({ metaLoading: true, default_program_id: program, default_developmental_id: developmental_id[0] })
      );
    },
    [dispatch, program]
  );
  useEffect(() => {
    dispatch(
      onLoadContentEdit({ id, type: lesson, metaLoading: true, searchMedia, searchOutcome, assumed, isShare: isShare === "badanamu" })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, lesson, dispatch]);
  const assetDetails = (
    <AssetDetails
      allDefaultValueAndKey={allDefaultValueAndKey}
      formMethods={formMethods}
      flattenedMockOptions={linkedMockOptions}
      contentDetail={contentDetail}
      onChangeProgram={handleChangeProgram}
      onChangeDevelopmental={handleChangeDevelopmental}
    />
  );
  const contentTabs = (
    <ContentTabs tab={tab} onChangeTab={handleChangeTab} error={errors.publish_scope || errors.name}>
      <PermissionOr
        value={[
          PermissionType.edit_org_published_content_235,
          PermissionType.edit_lesson_material_metadata_and_content_236,
          PermissionType.edit_lesson_plan_metadata_237,
          PermissionType.create_content_page_201,
          PermissionType.create_lesson_plan_221,
          PermissionType.create_lesson_material_220,
        ]}
        render={(value) => (
          <Details
            allDefaultValueAndKey={allDefaultValueAndKey}
            contentDetail={contentDetail}
            formMethods={formMethods}
            linkedMockOptions={linkedMockOptions}
            visibility_settings={visibility_settings}
            lesson_types={lesson_types}
            onChangeProgram={handleChangeProgram}
            onChangeDevelopmental={handleChangeDevelopmental}
            // onDrawingActivity={handleDrawingActivity}
            permission={!value}
          />
        )}
      />
      <Controller
        as={Outcomes}
        name="outcome_entities"
        defaultValue={contentDetail.outcome_entities}
        key={allDefaultValueAndKey.outcomes?.key}
        control={control}
        list={outcomeList}
        onSearch={handleSearchOutcomes}
        onCheck={handleCheckAssumed}
        searchName={searchOutcome}
        assumed={assumed}
        total={OutcomesListTotal}
        onChangePage={handleChangePageOutCome}
        onGoOutcomesDetail={handleGoOutcomeDetail}
        outcomePage={outcomePage}
      />
      <MediaAssets
        list={mediaList}
        onSearch={handleSearchMedia}
        value={searchMedia}
        onChangePage={handleChangePage}
        total={mediaListTotal}
        mediaPage={mediaPage}
        isShare={isShare}
        onCheckShare={handleCheckShare}
      />
    </ContentTabs>
  );
  const rightsideArea = (
    <Fragment>
      {includeH5p && !includeAsset && (
        <PermissionOr
          value={[
            PermissionType.edit_lesson_material_metadata_and_content_236,
            PermissionType.create_lesson_material_220,
            PermissionType.create_content_page_201,
            PermissionType.edit_org_published_content_235,
          ]}
          render={(value) => (
            <Fragment>
              <Controller
                name="data.input_source"
                as={SelectH5PRadio}
                defaultValue={
                  id
                    ? allDefaultValueAndKey["data.input_source"]?.value ?? ""
                    : allDefaultValueAndKey["data.input_source"]?.value || ContentInputSourceType.h5p
                }
                key={allDefaultValueAndKey["data.input_source"]?.key}
                control={control}
                formMethods={formMethods}
                disabled={!!id}
              />
              <Controller
                as="input"
                hidden
                name="source_type"
                defaultValue={allDefaultValueAndKey.source_type?.value}
                key={allDefaultValueAndKey.source_type?.key}
                control={formMethods.control}
              />
              {inputSource === ContentInputSourceType.h5p ? (
                isNewH5p ? (
                  <H5pComposeEditor formMethods={formMethods} valueSource={allDefaultValueAndKey["data.source"]?.value} />
                ) : (
                  <ContentH5p
                    sub={id ? H5pSub.edit : H5pSub.new}
                    allDefaultValueAndKey={allDefaultValueAndKey}
                    formMethods={formMethods}
                    valueSource={allDefaultValueAndKey["data.source"]?.value}
                  />
                )
              ) : (
                <MediaAssetsEdit
                  allDefaultValueAndKey={allDefaultValueAndKey}
                  readonly={false}
                  overlay={false}
                  formMethods={formMethods}
                  contentDetail={contentDetail}
                  onclosePreview={handleClosePreview}
                  permission={!value}
                />
              )}
            </Fragment>
          )}
        />
      )}
      {!includeH5p && includeAsset && (
        <MediaAssetsEdit overlay={includeH5p} isAsset={true} {...{ allDefaultValueAndKey, readonly, formMethods, contentDetail }} />
      )}
      {includePlanComposeGraphic && (
        <Controller
          name="data"
          as={PlanComposeGraphic}
          defaultValue={ModelLessonPlan.toSegment(contentDetail.data || "{}")}
          key={allDefaultValueAndKey.data?.key}
          control={control}
        />
      )}
      {includePlanComposeText && <PlanComposeText plan={mockLessonPlan as SegmentText} droppableType="material" />}
    </Fragment>
  );
  const leftsideArea = tab === "assetDetails" ? assetDetails : contentTabs;
  return (
    <DndProvider backend={HTML5Backend}>
      <ContentHeader
        contentDetail={contentDetail}
        formMethods={formMethods}
        lesson={lesson}
        onChangeLesson={handleChangeLesson}
        onCancel={handleGoBack}
        onSave={handleSave}
        onPublish={handlePublish}
        onBack={handleGoBack}
        onDelete={handleDelete}
        id={id}
        inputSourceWatch={inputSource}
      />
      <PermissionOr
        value={[
          PermissionType.create_content_page_201,
          PermissionType.edit_org_published_content_235,
          PermissionType.create_asset_320,
          PermissionType.create_lesson_material_220,
          PermissionType.create_lesson_plan_221,
          PermissionType.edit_lesson_material_metadata_and_content_236,
          PermissionType.edit_lesson_plan_content_238,
          PermissionType.edit_lesson_plan_metadata_237,
        ]}
        render={(value) =>
          value ? (
            <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
              {
                <Fragment>
                  <SelectLesson lesson={lesson} onChangeLesson={handleChangeLesson} disabled={!!id} />
                  {leftsideArea}
                </Fragment>
              }
              {rightsideArea}
            </LayoutPair>
          ) : (
            permissionTip
          )
        }
      />
      {/* <DevTool control={control} /> */}
    </DndProvider>
  );
}

export default function ContentEdit() {
  const { id, editindex } = useQueryCms();
  const { lesson } = useParams();
  return <ContentEditForm key={`id${id},editindex${editindex}lesson${lesson}`} />;
}

ContentEdit.routeBasePath = "/library/content-edit";
ContentEdit.routeMatchPath = "/library/content-edit/lesson/:lesson/tab/:tab/rightside/:rightside";
ContentEdit.routeRedirectDefault = "/library/content-edit/lesson/material/tab/details/rightside/contentH5p";
