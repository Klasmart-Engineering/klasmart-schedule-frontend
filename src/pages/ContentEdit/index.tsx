import {
  Active,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import useQueryCms from "@hooks/useQueryCms";
import {
  deleteContent,
  getLinkedMockOptions,
  getLinkedMockOptionsSkills,
  onLoadContentEdit,
  publish,
  publishWidthAssets,
  save,
  searchAuthContentLists,
  searchContentLists,
  searchPublishedLearningOutcomes,
} from "@reducers/content";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import debounce from "lodash/debounce";
import React, { Fragment, LegacyRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import { ContentInputSourceType, ContentType, GetOutcomeDetail, H5pSub, SearchContentsRequestContentType } from "../../api/type";
import { PermissionOr } from "../../components/Permission";
import { permissionTip } from "../../components/TipImages";
import { usePermission } from "../../hooks/usePermission";
import mockLessonPlan from "../../mocks/lessonPlan.json";
import { addAllInSearchLOListOption, ContentDetailForm, ModelContentDetailForm } from "../../models/ModelContentDetailForm";
import { ModelLessonPlan } from "../../models/ModelLessonPlan";
import { ModelMockOptions } from "../../models/ModelMockOptions";
import { RootState } from "../../reducers";
import MyContentList from "../MyContentList";
import AssetDetails from "./AssetDetails";
import ContentH5p from "./ContentH5p";
import { ContentHeader, SelectH5PRadio } from "./ContentHeader";
import ContentTabs from "./ContentTabs";
import Details from "./Details";
import LayoutPair from "./Layout";
import MediaAssets, { MediaAssetsProps } from "./MediaAssets";
import MediaAssetsEdit from "./MediaAssetsEdit";
import { Outcomes, OutcomesProps } from "./Outcomes";
import { PlanComposeGraphic } from "./PlanComposeGraphic";
import PlanComposeText, { SegmentText } from "./PlanComposeText";
import { Regulation } from "./type";
const SCROLL_DETECT_INTERVAL = 100;
export interface ContentEditRouteParams {
  lesson: "assets" | "material" | "plan";
  tab: "details" | "outcomes" | "media" | "assetDetails";
  rightside: "contentH5p" | "assetPreview" | "assetEdit" | "assetPreviewH5p" | "uploadH5p" | "planComposeGraphic" | "planComposeText";
}

const setQuery = (search: string, hash: Record<string, string | number | boolean>): string => {
  const query = new URLSearchParams(search);
  Object.keys(hash).forEach((key) => query.set(key, String(hash[key])));
  return query.toString();
};

const parseRightside = (rightside: ContentEditRouteParams["rightside"]) => ({
  includePlanComposeGraphic: rightside.includes("planComposeGraphic"),
  includePlanComposeText: rightside.includes("planComposeText"),
  includeH5p: rightside.includes("H5p"),
  includeAsset: rightside.includes("asset"),
  readonly: rightside.includes("Preview"),
});

function ContentEditForm() {
  const dispatch = useDispatch();
  const formMethods = useForm<ContentDetailForm>();
  const [scrollTop, setScrollTop] = useState(0);
  const { handleSubmit, control, watch, errors } = formMethods;
  const {
    contentDetail,
    mediaList,
    mediaListTotal,
    OutcomesListTotal,
    outcomeList,
    linkedMockOptions,
    searchLOListOptions,
    visibility_settings,
    lesson_types,
    outcomesFullOptions,
  } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const { lesson, tab, rightside } = useParams<ContentEditRouteParams>();
  const searchContentType = lesson === "material" ? SearchContentsRequestContentType.assets : SearchContentsRequestContentType.material;
  const { id, searchMedia, search, editindex, searchOutcome, assumed, isShare, back, exactSerch, parent_folder } = useQueryCms();
  const [regulation, setRegulation] = useState<Regulation>(id ? Regulation.ByContentDetail : Regulation.ByContentDetailAndOptionCount);
  const history = useHistory();
  const offsetRef = useRef(0);
  const [mediaPage, setMediaPage] = React.useState(1);
  const [outcomePage, setOutcomePage] = React.useState(1);
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);
  const { routeBasePath } = ContentEdit;
  const { includeAsset, includeH5p, readonly, includePlanComposeGraphic, includePlanComposeText } = parseRightside(rightside);
  const content_type = lesson === "material" ? ContentType.material : lesson === "assets" ? ContentType.assets : ContentType.plan;
  const { program, developmental, subject, skills, grade, age } = watch(["program", "subject", "developmental", "skills", "grade", "age"]);
  const outcomeSearchDefault = {
    program: `${program || "all"}/${subject?.length ? subject?.join(",") : "all"}`,
    category: `${developmental?.[0] || "all"}/${skills?.length ? skills?.join(",") : "all"}`,
    grade_ids: grade,
    age_ids: age,
  };
  const inputSource: ContentInputSourceType = watch("data.input_source");
  const teacherManualBatchLengthWatch = watch("teacher_manual_batch")?.length;
  const addedLOLength = watch("outcome_entities")?.length ?? contentDetail.outcome_entities.length;
  const activeRectRef = useRef<Active["rect"]>();
  const unmountRef = useRef<Function>();
  const searchLOListOptionsAll = addAllInSearchLOListOption(searchLOListOptions);
  const isTouch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const perm = usePermission([
    PermissionType.create_content_page_201,
    PermissionType.edit_org_published_content_235,
    PermissionType.create_asset_320,
    PermissionType.create_lesson_material_220,
    PermissionType.create_lesson_plan_221,
    PermissionType.edit_lesson_material_metadata_and_content_236,
    PermissionType.edit_lesson_plan_content_238,
    PermissionType.edit_lesson_plan_metadata_237,
  ]);
  const hasPerm =
    perm.create_content_page_201 ||
    perm.edit_org_published_content_235 ||
    perm.create_asset_320 ||
    perm.create_lesson_material_220 ||
    perm.create_lesson_plan_221 ||
    perm.edit_lesson_material_metadata_and_content_236 ||
    perm.edit_lesson_plan_content_238 ||
    perm.edit_lesson_plan_metadata_237;
  const adapteredRectIntersection = (entries: any, target: any) => {
    const top = (activeRectRef.current?.current.translated?.top as number) + scrollTop + offsetRef.current;
    const offsetTop = top + scrollTop;
    return rectIntersection(entries, { ...target, top, offsetTop });
  };
  const handleDragStart = (e: DragMoveEvent) => {
    activeRectRef.current = e.active?.rect;
  };
  const handleDropEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!active || !over || !over.data.current?.accept.includes(active.data.current?.type)) return;
    over.data.current.drop?.(active.data.current);
  };
  const allDefaultValueAndKey = ModelMockOptions.createAllDefaultValueAndKey(
    { regulation, contentDetail, linkedMockOptions },
    { program, developmental, subject }
  );
  const nodeRef: LegacyRef<HTMLElement> = (node) => {
    unmountRef.current?.();
    const update = debounce(() => void (offsetRef.current = node?.scrollTop ?? 0), 200);
    node?.addEventListener("scroll", update);
    unmountRef.current = () => node?.removeEventListener("scroll", update);
  };
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
        const parent_folderLastId = parent_folder.split("/").pop() || "";
        const input = { ...restValues, parent_folder: parent_folderLastId, content_type, outcomes };
        const contentDetail = ModelContentDetailForm.encode(input);
        const { payload: id } = (await dispatch(save(contentDetail))) as unknown as PayloadAction<AsyncTrunkReturned<typeof save>>;
        if (id) {
          if (lesson === "assets") {
            // assets 创建直接返回列表
            history.replace(
              `${MyContentList.routeBasePath}?content_type=${SearchContentsRequestContentType.assetsandfolder}&path=${parent_folder}&order_by=-update_at&page=1`
            );
          } else {
            history.replace({
              search: setQuery(history.location.search, { id, editindex: editindex + 1 }),
            });
          }
        }
      }),
    [handleSubmit, parent_folder, content_type, dispatch, lesson, history, editindex]
  );
  const handlePublish = useMemo(
    () => async (isAsAssets?: boolean) => {
      if (lesson === "assets") await handleSave();
      if (!id) return;
      if (isAsAssets) {
        await dispatch(publishWidthAssets(id));
      } else {
        await dispatch(publish(id));
      }
      history.replace(
        `${MyContentList.routeBasePath}?content_type=${SearchContentsRequestContentType.materialandplan}&publish_status=published&path=${parent_folder}&order_by=-update_at&page=1`
      );
    },
    [lesson, handleSave, id, history, dispatch, parent_folder]
  );

  const handleDelete = useCallback(async () => {
    if (!id) return;
    await dispatch(deleteContent({ id, type: "delete" }));
    history.goBack();
  }, [dispatch, id, history]);

  const handleSearchMedia = useMemo<MediaAssetsProps["onSearch"]>(
    () =>
      ({ value = "", exactSerch = "all", isShare = "org" }) => {
        history.replace({
          search: setQuery(history.location.search, { searchMedia: value, isShare }),
        });
        const contentNameValue = exactSerch === "all" ? "" : value;
        const nameValue = exactSerch === "all" ? value : "";
        isShare === "badanamu" && lesson === "plan"
          ? dispatch(
              searchAuthContentLists({
                metaLoading: true,
                content_type: searchContentType,
                name: nameValue,
                content_name: contentNameValue,
              })
            )
          : dispatch(
              searchContentLists({
                metaLoading: true,
                content_type: searchContentType,
                name: nameValue,
                content_name: contentNameValue,
              })
            );
        setMediaPage(1);
      },
    [dispatch, history, searchContentType, lesson]
  );
  const handleSearchOutcomes = useMemo<OutcomesProps["onSearch"]>(
    () =>
      ({ value = "", assumed, exactSerch = "outcome_name", page = 1, ...resQuery }) => {
        history.replace({
          search: setQuery(history.location.search, { searchOutcome: value, assumed: assumed ? "true" : "false" }),
        });
        dispatch(
          searchPublishedLearningOutcomes({
            exactSerch,
            metaLoading: true,
            search_key: value,
            assumed: assumed ? 1 : -1,
            page,
            ...resQuery,
          })
        );
        setOutcomePage(page);
      },
    [dispatch, history]
  );
  const handleGoBack = useCallback(() => {
    back ? history.replace(back) : history.goBack();
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
  const handleGoOutcomeDetail = useMemo(
    () => (id: GetOutcomeDetail["outcome_id"]) => {
      window.open(`#/assessments/outcome-edit?outcome_id=${id}&readonly=true`, "_blank");
    },
    []
  );
  const handleChangeProgram = useMemo(
    () => async (programId: string) => {
      setRegulation(Regulation.ByOptionCount);
      dispatch(getLinkedMockOptions({ metaLoading: true, default_program_id: programId }));
    },
    [dispatch]
  );
  const handleChangeSubject = useMemo(
    () => async (subject_ids: string[]) => {
      setRegulation(Regulation.ByOptionCount);
      dispatch(getLinkedMockOptions({ metaLoading: true, default_program_id: program, default_subject_ids: subject_ids.join(",") }));
    },
    [dispatch, program]
  );
  const handleChangeDevelopmental = useMemo(
    () => (developmental_id: string[]) => {
      setRegulation(Regulation.ByOptionCount);
      dispatch(
        getLinkedMockOptionsSkills({
          metaLoading: true,
          default_program_id: program,
          default_subject_ids: subject?.join(","),
          default_developmental_id: developmental_id[0],
        })
      );
    },
    [dispatch, program, subject]
  );
  useEffect(() => {
    let timer: number;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        const offset = window.pageYOffset;
        if (offset === scrollTop) return;
        setScrollTop(Math.floor(offset));
      }, SCROLL_DETECT_INTERVAL);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollTop]);
  useEffect(() => {
    dispatch(
      onLoadContentEdit({
        id,
        type: lesson,
        metaLoading: true,
        searchMedia,
        searchOutcome,
        assumed,
        isShare: isShare === "badanamu",
        exactSerch,
      })
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
      onChangeSubject={handleChangeSubject}
    />
  );
  const contentTabs = (
    <ContentTabs
      tab={tab}
      addedLOLength={addedLOLength}
      onChangeTab={handleChangeTab}
      error={errors.name || errors.publish_scope || errors.subject}
    >
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
            onChangeSubject={handleChangeSubject}
            disabled={id ? !contentDetail.permission.allow_edit : !value}
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
        searchName={searchOutcome}
        exactSerch={exactSerch}
        assumed={assumed}
        total={OutcomesListTotal}
        searchLOListOptions={searchLOListOptionsAll}
        onGoOutcomesDetail={handleGoOutcomeDetail}
        outcomePage={outcomePage}
        outcomesFullOptions={outcomesFullOptions}
        outcomeSearchDefault={outcomeSearchDefault}
      />
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
          <MediaAssets
            list={mediaList}
            onSearch={handleSearchMedia}
            value={searchMedia}
            onChangePage={handleChangePage}
            total={mediaListTotal}
            mediaPage={mediaPage}
            isShare={isShare}
            permission={id ? !!contentDetail.permission.allow_edit : value}
          />
        )}
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
                defaultValue={allDefaultValueAndKey["data.input_source"]?.value}
                key={allDefaultValueAndKey["data.input_source"]?.key}
                control={control}
                render={(dataInputSourceProps) => (
                  <Fragment>
                    <SelectH5PRadio formMethods={formMethods} disabled={!!id} {...dataInputSourceProps} />
                    <Controller
                      name="data.source"
                      control={control}
                      defaultValue={allDefaultValueAndKey["data.source"]?.value}
                      key={allDefaultValueAndKey["data.source"]?.key}
                      render={(dataSourceProps) =>
                        inputSource === ContentInputSourceType.h5p || dataInputSourceProps.value === ContentInputSourceType.h5p ? (
                          <Controller
                            name="source_type"
                            control={control}
                            defaultValue={allDefaultValueAndKey["source_type"]?.value}
                            key={allDefaultValueAndKey["source_type"]?.key}
                            render={(sourceTypeProps) => (
                              <ContentH5p
                                sub={
                                  id
                                    ? dataSourceProps.value === allDefaultValueAndKey["data.source"]?.value
                                      ? H5pSub.clone
                                      : H5pSub.view
                                    : dataSourceProps.value
                                    ? H5pSub.view
                                    : H5pSub.new
                                }
                                value={dataSourceProps.value}
                                onChange={dataSourceProps.onChange}
                                onChangeSourceType={sourceTypeProps.onChange}
                              />
                            )}
                          />
                        ) : (
                          <MediaAssetsEdit
                            value={dataSourceProps.value}
                            onChange={dataSourceProps.onChange}
                            onChangeInputSource={dataInputSourceProps.onChange}
                            readonly={false}
                            overlay={false}
                            contentDetail={contentDetail}
                            disabled={id ? !contentDetail.permission.allow_edit : !value}
                          />
                        )
                      }
                    />
                  </Fragment>
                )}
              />
            </Fragment>
          )}
        />
      )}
      {!includeH5p && includeAsset && (
        <Controller
          name="data.source"
          control={control}
          defaultValue={allDefaultValueAndKey["data.source"]?.value}
          key={allDefaultValueAndKey["data.source"]?.key}
          render={(dataSourceProps) => (
            <MediaAssetsEdit
              {...dataSourceProps}
              overlay={includeH5p}
              isAsset={true}
              {...{ allDefaultValueAndKey, readonly, formMethods, contentDetail }}
            />
          )}
        />
      )}
      {includePlanComposeGraphic && (
        <Controller
          name="data"
          as={PlanComposeGraphic}
          defaultValue={ModelLessonPlan.toSegment(contentDetail.data || "{}")}
          key={allDefaultValueAndKey.data?.key}
          control={control}
          nodeRef={nodeRef}
        />
      )}
      {includePlanComposeText && <PlanComposeText plan={mockLessonPlan as SegmentText} droppableType="material" />}
    </Fragment>
  );
  const leftsideArea = tab === "assetDetails" ? assetDetails : contentTabs;
  return (
    <DndContext
      sensors={sensors}
      autoScroll={isTouch}
      onDragEnd={handleDropEnd}
      onDragStart={handleDragStart}
      collisionDetection={adapteredRectIntersection}
    >
      <ContentHeader
        contentDetail={contentDetail}
        formMethods={formMethods}
        lesson={lesson}
        onCancel={handleGoBack}
        onSave={handleSave}
        onPublish={handlePublish}
        onBack={handleGoBack}
        onDelete={handleDelete}
        id={id}
        inputSourceWatch={inputSource}
        teacherManualBatchLengthWatch={teacherManualBatchLengthWatch}
      />
      {(contentDetail.content_type !== ContentType.assets && id ? !!contentDetail.permission.allow_edit : hasPerm) ? (
        <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
          {
            <Fragment>
              {/* <SelectLesson lesson={lesson} onChangeLesson={handleChangeLesson} disabled={!!id} /> */}
              {leftsideArea}
            </Fragment>
          }
          {rightsideArea}
        </LayoutPair>
      ) : hasPerm === undefined || contentDetail.permission.allow_edit === undefined ? (
        ""
      ) : (
        permissionTip
      )}
    </DndContext>
  );
}
export default function ContentEdit() {
  const { id, editindex } = useQueryCms();
  const { lesson } = useParams<ContentEditRouteParams>();
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      <ContentEditForm key={`id${id},editindex${editindex}lesson${lesson}`} />
    </div>
  );
}

ContentEdit.routeBasePath = "/library/content-edit";
ContentEdit.routeMatchPath = "/library/content-edit/lesson/:lesson/tab/:tab/rightside/:rightside";
ContentEdit.routeRedirectDefault = "/library/content-edit/lesson/material/tab/details/rightside/contentH5p";
