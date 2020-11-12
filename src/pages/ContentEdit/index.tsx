import { PayloadAction } from "@reduxjs/toolkit";
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { ApiOutcomeView } from "../../api/api.auto";
import { ContentType, MaterialType, OutcomePublishStatus, SearchContentsRequestContentType } from "../../api/type";
import { Permission, PermissionOr, PermissionType } from "../../components/Permission";
import { TipImages, TipImagesType } from "../../components/TipImages";
import mockLessonPlan from "../../mocks/lessonPlan.json";
import { ContentDetailForm, ModelContentDetailForm } from "../../models/ModelContentDetailForm";
import { ModelLessonPlan } from "../../models/ModelLessonPlan";
import { ModelMockOptions } from "../../models/ModelMockOptions";
import { RootState } from "../../reducers";
import {
  AsyncTrunkReturned,
  contentLists,
  deleteContent,
  getLinkedMockOptions,
  getLinkedMockOptionsSkills,
  onLoadContentEdit,
  publish,
  publishWidthAssets,
  save,
  searchOutcomeList,
} from "../../reducers/content";
import MyContentList from "../MyContentList";
import AssetDetails from "./AssetDetails";
import ContentH5p from "./ContentH5p";
import { ContentHeader, SelectH5PRadio, SelectLesson } from "./ContentHeader";
import ContentTabs from "./ContentTabs";
import Details from "./Details";
import LayoutPair from "./Layout";
import MediaAssets, { MediaAssetsProps } from "./MediaAssets";
import MediaAssetsEdit from "./MediaAssetsEdit";
import Outcomes, { OutcomesProps } from "./Outcomes";
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
  const searchMedia = query.get("searchMedia") || "";
  const searchOutcome = query.get("searchOutcome") || "";
  const assumed = query.get("assumed") || "";
  const editindex: number = Number(query.get("editindex") || 0);
  const back = query.get("back") || "";
  return { id, searchMedia, searchOutcome, search, editindex, assumed, back };
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

export default function ContentEdit() {
  const dispatch = useDispatch();
  const formMethods = useForm<ContentDetailForm>();
  const [hasCreateSituationFirstOnload, setHasCreateSituationFirstOnload] = useState(false);
  const { reset, handleSubmit, control, setValue, watch, errors } = formMethods;
  const {
    contentDetail,
    mediaList,
    MediaListTotal,
    OutcomesListTotal,
    outcomeList,
    linkedMockOptions,
    visibility_settings,
    lesson_types,
  } = useSelector<RootState, RootState["content"]>((state) => state.content);

  const { lesson, tab, rightside } = useParams();
  const { id, searchMedia, search, editindex, searchOutcome, assumed, back } = useQuery();
  const history = useHistory();
  const [mediaPage, setMediaPage] = React.useState(1);
  const [outcomePage, setOutcomePage] = React.useState(1);
  const { routeBasePath } = ContentEdit;
  const { includeAsset, includeH5p, readonly, includePlanComposeGraphic, includePlanComposeText } = parseRightside(rightside);
  const content_type = lesson === "material" ? ContentType.material : lesson === "assets" ? ContentType.assets : ContentType.plan;
  const { program: programId = "" } = watch(["program"]);
  const inputSource = JSON.parse(contentDetail.data || JSON.stringify({ input_source: MaterialType.h5p })).input_source;
  const h5pSource = JSON.parse(contentDetail.data || JSON.stringify({ source: "" })).source;
  const inputSourceWatch = watch("data.input_source", inputSource);
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
            history.push(`${MyContentList.routeBasePath}?content_type=3&order_by=-update_at&page=1`);
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
      dispatch(
        contentLists({
          content_type: lesson === "material" ? SearchContentsRequestContentType.assets : SearchContentsRequestContentType.material,
          publish_status: "published",
          name: searchMedia,
        })
      );
      setMediaPage(1);
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
          publish_status: OutcomePublishStatus.published,
          search_key: searchOutcome,
          page_size: 10,
          assumed: assumed === "true" ? 1 : -1,
        })
      );
      setOutcomePage(1);
    },
    [dispatch, history, searchOutcome]
  );
  const handleGoBack = useCallback(() => {
    back ? history.push(back) : history.goBack();
  }, [back, history]);

  const handleChangePage = useMemo(
    () => (page: number) => {
      setMediaPage(page);
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
      setOutcomePage(page);
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
      window.open(`#/assessments/outcome-edit?outcome_id=${id}&readonly=true`, "_blank");
    },
    []
  );

  const handleClosePreview = useCallback(() => {
    setValue("data.source", "", { shouldDirty: true });
  }, [setValue]);

  const handleDrawingActivity = useMemo(
    () => (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
      setValue(name, e.target.checked, { shouldDirty: true });
    },
    [setValue]
  );

  const handleChangeProgram = useMemo(
    () => async (programId: string) => {
      const { payload: linkedMockOptions } = ((await dispatch(
        getLinkedMockOptions({ metaLoading: true, default_program_id: programId })
      )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof getLinkedMockOptions>>;
      ModelMockOptions.updateValuesWhenProgramChange(setValue, linkedMockOptions, programId);
    },
    [dispatch, setValue]
  );
  const handleChangeDevelopmental = useMemo(
    () => (developmental_id: string[]) => {
      setValue("skills", []);
      dispatch(
        getLinkedMockOptionsSkills({ metaLoading: true, default_program_id: programId, default_developmental_id: developmental_id[0] })
      );
    },
    [dispatch, programId, setValue]
  );
  useEffect(() => {
    dispatch(onLoadContentEdit({ id, type: lesson, metaLoading: true }));
    setHasCreateSituationFirstOnload(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, lesson, dispatch, history, editindex]);
  useEffect(() => {
    // 编辑表单时 加载完 contentDetial 的逻辑
    reset(ModelContentDetailForm.decode(contentDetail));
    setHasCreateSituationFirstOnload(false);
  }, [contentDetail, lesson, reset]);
  useEffect(() => {
    // 新建表单时，加载完 mockOptions 的逻辑
    if (id || !linkedMockOptions.program_id || hasCreateSituationFirstOnload) return;
    const { program, subject, developmental, skills, grade, age, program_id, developmental_id } = linkedMockOptions;
    if (!program_id || !developmental_id) return;
    const onlyOneOptionValue = ModelMockOptions.getOnlyOneOptionValue({ program, subject, developmental, skills, grade, age });
    reset({ ...onlyOneOptionValue, program: program_id, developmental: [developmental_id] });
    setHasCreateSituationFirstOnload(true);
  }, [reset, id, linkedMockOptions, hasCreateSituationFirstOnload, setHasCreateSituationFirstOnload, lesson]);
  const assetDetails = (
    <AssetDetails
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
        value={[PermissionType.edit_lesson_material_metadata_and_content_236, PermissionType.edit_lesson_plan_metadata_237]}
        render={(value) => (
          <Details
            contentDetail={contentDetail}
            formMethods={formMethods}
            linkedMockOptions={linkedMockOptions}
            visibility_settings={visibility_settings}
            lesson_types={lesson_types}
            onChangeProgram={handleChangeProgram}
            onChangeDevelopmental={handleChangeDevelopmental}
            onDrawingActivity={handleDrawingActivity}
            permission={!value}
          />
        )}
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
        outcomePage={outcomePage}
      />

      <MediaAssets
        list={mediaList}
        onSearch={handleSearchMedia}
        value={searchMedia}
        onChangePage={handleChangePage}
        total={MediaListTotal}
        mediaPage={mediaPage}
      />
    </ContentTabs>
  );
  const rightsideArea = (
    <Fragment>
      {includeH5p && !includeAsset && (
        <Permission
          value={[
            PermissionType.edit_lesson_material_metadata_and_content_236,
            PermissionType.create_asset_320,
            PermissionType.create_lesson_material_220,
          ]}
          render={(value) => (
            <Fragment>
              <Controller
                name="data.input_source"
                as={SelectH5PRadio}
                defaultValue={inputSourceWatch}
                control={control}
                formMethods={formMethods}
                disabled={!!id}
              />
              {inputSourceWatch === 1 ? (
                <Controller
                  name="data.source"
                  defaultValue={h5pSource}
                  control={control}
                  render={({ value: valueSource, onChange: onChangeSource }: any) => (
                    <Controller
                      name="source_type"
                      defaultValue={contentDetail.source_type}
                      control={control}
                      render={({ value: valueSourceType, onChange: onChangeSourceType }: any) => (
                        <ContentH5p isCreate={!id} {...{ valueSource, valueSourceType, onChangeSource, onChangeSourceType }} />
                      )}
                    />
                  )}
                />
              ) : (
                <MediaAssetsEdit
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
        <MediaAssetsEdit readonly={readonly} overlay={includeH5p} isAsset={true} formMethods={formMethods} contentDetail={contentDetail} />
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
        inputSourceWatch={inputSourceWatch}
      />
      <PermissionOr
        value={[PermissionType.create_content_page_201, PermissionType.edit_org_published_content_235]}
        render={(value) =>
          value ? (
            <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
              {
                <Fragment>
                  <Permission
                    value={PermissionType.create_content_page_201}
                    render={(value) => value && <SelectLesson lesson={lesson} onChangeLesson={handleChangeLesson} disabled={!!id} />}
                  />
                  {leftsideArea}
                </Fragment>
              }
              {rightsideArea}
            </LayoutPair>
          ) : (
            <TipImages type={TipImagesType.noPermission} text="library_error_no_permissions" />
          )
        }
      />
    </DndProvider>
  );
}

ContentEdit.routeBasePath = "/library/content-edit";
ContentEdit.routeMatchPath = "/library/content-edit/lesson/:lesson/tab/:tab/rightside/:rightside";
ContentEdit.routeRedirectDefault = "/library/content-edit/lesson/material/tab/details/rightside/contentH5p";
