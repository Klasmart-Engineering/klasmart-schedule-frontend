import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import { useHistory } from "react-router-dom";
import api from "../api";
// import { Content, ContentIDListRequest, CreateContentRequest, LearningOutcomes } from "../api/api";
import { ApiContentBulkOperateRequest, ApiOutcomeView, EntityContentInfoWithDetails, EntityCreateContentRequest } from "../api/api.auto";
import { ContentType, OutcomePublishStatus, SearchContentsRequestContentType } from "../api/type";
import { d } from "../locale/LocaleManager";
import { actAsyncConfirm, ConfirmDialogType } from "./confirm";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { actWarning } from "./notify";

interface IContentState {
  history?: ReturnType<typeof useHistory>;
  contentDetail: Required<EntityContentInfoWithDetails>;
  mediaList: EntityContentInfoWithDetails[];
  outcomeList: ApiOutcomeView[];
  total: number;
  contentsList: EntityContentInfoWithDetails[];
  contentPreview: EntityContentInfoWithDetails;
  MediaListTotal: number;
  OutcomesListTotal: number;
  linkedMockOptions: LinkedMockOptions;
  lesson_types: LinkedMockOptionsItem[];
  visibility_settings: LinkedMockOptionsItem[];
}

interface RootState {
  content: IContentState;
}

const initialState: IContentState = {
  history: undefined,
  contentDetail: {
    id: "",
    content_type: ContentType.material,
    suggest_time: 0,
    grade: [],
    name: "",
    program: "",
    subject: [],
    developmental: [],
    skills: [],
    age: [],
    keywords: [],
    description: "",
    thumbnail: "",
    version: 0,
    source_id: "",
    source_type: "",
    locked_by: "",
    data: "",
    extra: "",
    author: "",
    author_name: "",
    org: "",
    publish_scope: "",
    publish_status: "published",
    content_type_name: "",
    program_name: "",
    subject_name: [],
    developmental_name: [],
    skills_name: [],
    age_name: [],
    org_name: "",
    outcomes: [],
    outcome_entities: [],
    created_at: 0,
    draw_activity: false,
    grade_name: [],
    latest_id: "",
    lesson_type: "",
    lesson_type_name: "",
    publish_scope_name: "",
    reject_reason: [],
    remark: "",
    self_study: false,
    updated_at: 0,
    creator: "",
    creator_name: "",
    is_mine: false,
  },
  mediaList: [],
  MediaListTotal: 0,
  OutcomesListTotal: 0,
  outcomeList: [],
  linkedMockOptions: {
    program: [],
    subject: [],
    developmental: [],
    age: [],
    grade: [],
    skills: [],
    program_id: "",
    developmental_id: "",
  },
  lesson_types: [],
  visibility_settings: [],
  total: 0,
  contentsList: [],
  contentPreview: {
    created_at: 0,
    id: "",
    content_type: undefined,
    suggest_time: 0,
    grade: [],
    grade_name: [],
    name: "",
    program: "",
    subject: [],
    developmental: [],
    skills: [],
    age: [],
    keywords: [],
    description: "",
    thumbnail: "",
    version: 0,
    source_id: "",
    locked_by: "",
    data: "",
    extra: "",
    author: "",
    author_name: "",
    org: "",
    publish_scope: "",
    publish_status: "published",
    content_type_name: "",
    program_name: "",
    subject_name: [],
    developmental_name: [],
    skills_name: [],
    age_name: [],
    org_name: "",
    outcomes: [],
    outcome_entities: [],
    self_study: false,
    draw_activity: false,
    lesson_type: "",
    publish_scope_name: "",
    source_type: "",
    lesson_type_name: "",
    creator: "",
    creator_name: "",
    is_mine: false,
  },
};
export enum Action {
  remove = "remove",
  delete = "delete",
}
export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

export const save = createAsyncThunk<EntityContentInfoWithDetails["id"], EntityCreateContentRequest, { state: RootState }>(
  "content/save",
  async (payload, { getState }) => {
    const {
      content: {
        contentDetail: { id },
      },
    } = getState();
    if (!id) {
      return (await api.contents.createContent(payload)).id;
    } else {
      await api.contents.updateContent(id, payload);
      return id;
    }
  }
);

export const publish = createAsyncThunk<
  AsyncReturnType<typeof api.contents.publishContent>,
  Required<EntityContentInfoWithDetails>["id"],
  { state: RootState }
>("content/publish", (id, { getState }) => {
  const {
    content: {
      contentDetail: { publish_scope },
    },
  } = getState();

  return api.contents.publishContent(id, { scope: publish_scope });
});

export const publishWidthAssets = createAsyncThunk<
  AsyncReturnType<typeof api.contents.publishContentWithAssets>,
  Required<EntityContentInfoWithDetails>["id"],
  { state: RootState }
>("content/publish", (id, { getState }) => {
  const {
    content: {
      contentDetail: { publish_scope },
    },
  } = getState();
  return api.contents.publishContentWithAssets(id, { scope: publish_scope });
});

export interface LinkedMockOptionsItem {
  id?: string;
  name?: string;
}

export interface LinkedMockOptions {
  program?: LinkedMockOptionsItem[];
  subject?: LinkedMockOptionsItem[];
  developmental?: LinkedMockOptionsItem[];
  age?: LinkedMockOptionsItem[];
  grade?: LinkedMockOptionsItem[];
  skills?: LinkedMockOptionsItem[];
  program_id?: string;
  developmental_id?: string;
}
export interface LinkedMockOptionsPayload extends LoadingMetaPayload {
  default_program_id?: string;
  default_developmental_id?: string;
}

export const getLinkedMockOptions = createAsyncThunk<LinkedMockOptions, LinkedMockOptionsPayload>(
  "content/",
  async ({ metaLoading, default_program_id, default_developmental_id }) => {
    const program = await api.programs.getProgram();
    const program_id = default_program_id ? default_program_id : program[0].id;
    if (program_id) {
      const [subject, developmental, age, grade] = await Promise.all([
        api.subjects.getSubject({ program_id }),
        api.developmentals.getDevelopmental({ program_id }),
        api.ages.getAge({ program_id }),
        api.grades.getGrade({ program_id }),
      ]);
      const developmental_id = default_developmental_id ? default_developmental_id : developmental[0].id;
      if (developmental_id) {
        const skills = await api.skills.getSkill({ program_id, developmental_id });
        return { program, subject, developmental, age, grade, skills, program_id, developmental_id };
      } else {
        return { program, subject, developmental, age, grade, skills: [], program_id, developmental_id: "" };
      }
    } else {
      return { program, subject: [], developmental: [], age: [], grade: [], skills: [], program_id: "", developmental_id: "" };
    }
  }
);
export const getLinkedMockOptionsSkills = createAsyncThunk<LinkedMockOptions["skills"], LinkedMockOptionsPayload>(
  "getLinkedMockOptionsSkills",
  async ({ metaLoading, default_program_id: program_id, default_developmental_id: developmental_id }) => {
    return await api.skills.getSkill({ program_id, developmental_id });
  }
);

interface onLoadContentEditPayload extends LoadingMetaPayload {
  id: EntityContentInfoWithDetails["id"] | null;
  type: "assets" | "material" | "plan";
  searchMedia?: string;
  searchOutcome?: string;
  assumed?: string;
}

interface onLoadContentEditResult {
  outcomeList?: AsyncReturnType<typeof api.learningOutcomes.searchLearningOutcomes>;
  contentDetail?: AsyncReturnType<typeof api.contents.getContentById>;
  mediaList?: AsyncReturnType<typeof api.contents.searchContents>;
  lesson_types?: LinkedMockOptionsItem[];
  visibility_settings?: LinkedMockOptionsItem[];
}
export const onLoadContentEdit = createAsyncThunk<onLoadContentEditResult, onLoadContentEditPayload>(
  "content/onLoadContentEdit",
  async ({ id, type, searchMedia, searchOutcome, assumed }, { dispatch }) => {
    const contentDetail = id ? await api.contents.getContentById(id) : initialState.contentDetail;
    const [mediaList, outcomeList, lesson_types, visibility_settings] = await Promise.all([
      type === "material" || type === "plan"
        ? api.contents.searchContents({
            content_type: type === "material" ? SearchContentsRequestContentType.assets : SearchContentsRequestContentType.material,
            publish_status: "published",
            name: searchMedia,
          })
        : undefined,
      type === "material" || type === "plan"
        ? api.learningOutcomes.searchLearningOutcomes({
            publish_status: OutcomePublishStatus.published,
            search_key: searchOutcome,
            page: 1,
            page_size: 10,
            assumed: assumed === "true" ? 1 : -1,
          })
        : undefined,
      type === "material" ? api.lessonTypes.getLessonType() : undefined,
      type === "material" || type === "plan"
        ? api.visibilitySettings.getVisibilitySetting({
            content_type: type === "material" ? SearchContentsRequestContentType.material : SearchContentsRequestContentType.plan,
          })
        : undefined,
      dispatch(
        getLinkedMockOptions({
          default_program_id: contentDetail.program,
          default_developmental_id: contentDetail.developmental && contentDetail.developmental[0],
        })
      ),
    ]);

    return { contentDetail, mediaList, outcomeList, lesson_types, visibility_settings };
  }
);

type IGetContentsResourseParams = Parameters<typeof api.contentsResources.getContentResourceUploadPath>[0];
type IGetContentsResourseResult = AsyncReturnType<typeof api.contentsResources.getContentResourceUploadPath>;
export const getContentResourceUploadPath = createAsyncThunk<IGetContentsResourseResult, IGetContentsResourseParams>(
  "content/getContentResourceUploadPath",
  (query) => {
    return api.contentsResources.getContentResourceUploadPath(query);
  }
);

type IQueryContentsParams = Parameters<typeof api.contents.searchContents>[0] & LoadingMetaPayload;
type IQueryContentsResult = AsyncReturnType<typeof api.contents.searchContents>;
export const contentLists = createAsyncThunk<IQueryContentsResult, IQueryContentsParams>(
  "content/contentLists",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.contents.searchContents(query);
    return { list, total };
  }
);
type IQueryPendingContentsParams = Parameters<typeof api.contentsPending.searchPendingContents>[0] & LoadingMetaPayload;
type IQueryPendingContentsResult = AsyncReturnType<typeof api.contentsPending.searchPendingContents>;
export const pendingContentLists = createAsyncThunk<IQueryPendingContentsResult, IQueryPendingContentsParams>(
  "content/pendingContentLists",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.contentsPending.searchPendingContents(query);
    return { list, total };
  }
);

type IQueryPrivateContentsParams = Parameters<typeof api.contentsPrivate.searchPrivateContents>[0] & LoadingMetaPayload;
type IQueryPrivateContentsResult = AsyncReturnType<typeof api.contentsPrivate.searchPrivateContents>;
export const privateContentLists = createAsyncThunk<IQueryPrivateContentsResult, IQueryPrivateContentsParams>(
  "content/privateContentLists",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.contentsPrivate.searchPrivateContents(query);
    return { list, total };
  }
);
type IQueryOutcomeListParams = Parameters<typeof api.learningOutcomes.searchLearningOutcomes>[0] & LoadingMetaPayload;
type IQueryOutcomeListResult = AsyncReturnType<typeof api.learningOutcomes.searchLearningOutcomes>;
export const searchOutcomeList = createAsyncThunk<IQueryOutcomeListResult, IQueryOutcomeListParams>(
  "content/searchOutcomeList",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.learningOutcomes.searchLearningOutcomes(query);
    return { list, total };
  }
);
// content_id: Parameters<typeof api.contents.getLiveToken>[0];
interface IQueryGetContentDetailByIdParams extends LoadingMetaPayload {
  content_id: Parameters<typeof api.contents.getContentById>[0];
}
type IQueryGetContentDetailByIdResult = AsyncReturnType<typeof api.contents.getContentById>;
export const getContentDetailById = createAsyncThunk<IQueryGetContentDetailByIdResult, IQueryGetContentDetailByIdParams>(
  "content/getContentDetailById",
  ({ content_id }) => api.contents.getContentById(content_id)
);

type IQueryDeleteContentParams = {
  id: Parameters<typeof api.contents.updateContent>[0];
  type: string;
};
type IQueryDeleteContentResult = AsyncReturnType<typeof api.contents.deleteContent>;
export const deleteContent = createAsyncThunk<IQueryDeleteContentResult, IQueryDeleteContentParams>(
  "content/deleteContent",
  async ({ id, type }, { dispatch }) => {
    const content =
      type === Action.remove
        ? d("Are you sure you want to remove this content?").t("library_msg_remove_content")
        : d("Are you sure you want to delete this content?").t("library_msg_delete_content");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.contents.deleteContent(id);
  }
);
export const publishContent = createAsyncThunk<
  AsyncReturnType<typeof api.contents.publishContent>,
  Required<EntityContentInfoWithDetails>["id"]
>("content/publishContent", async (id, { dispatch }) => {
  const content = d("Are you sure you want to publish this content?").t("library_msg_publish_content");
  const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
  if (!isConfirmed) return Promise.reject();
  return api.contents.publishContent(id, { scope: "" });
});

// type BulkActionIds = Parameters<typeof>
type IQueryBulkDeleteParams = {
  ids: Parameters<typeof api.contentsBulk.deleteContentBulk>[0]["id"];
  type: Action;
};
type IQueryBulkDeleteResult = AsyncReturnType<typeof api.contentsBulk.deleteContentBulk>;
export const bulkDeleteContent = createAsyncThunk<IQueryBulkDeleteResult, IQueryBulkDeleteParams>(
  "content/bulkDeleteContent",
  async ({ ids, type }, { dispatch }) => {
    if (!ids?.length)
      return Promise.reject(dispatch(actWarning(d("At least one content should be selected.").t("library_msg_remove_select_one"))));
    const content =
      type === Action.remove ? "Are you sure you want to remove these contents?" : "Are you sure you want to delete these contents?";
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.contentsBulk.deleteContentBulk({ id: ids });
  }
);
export const bulkPublishContent = createAsyncThunk<
  AsyncReturnType<typeof api.contentsBulk.publishContentBulk>,
  Required<ApiContentBulkOperateRequest>["id"]
>("content/bulkPublishContent", async (ids, { dispatch }) => {
  if (!ids?.length)
    return Promise.reject(dispatch(actWarning(d("At least one content should be selected.").t("library_msg_remove_select_one"))));
  const content = d("Are you sure you want to publish this content?").t("library_msg_publish_content");
  const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
  if (!isConfirmed) return Promise.reject();
  return api.contentsBulk.publishContentBulk({ id: ids });
});
type aa = Required<EntityContentInfoWithDetails>["id"];
export const approveContent = createAsyncThunk<
  AsyncReturnType<typeof api.contents.approveContentReview>,
  Required<EntityContentInfoWithDetails>["id"]
>("content/approveContentReview", async (content_id, { dispatch }) => {
  return api.contents.approveContentReview(content_id);
});
type RejectContentParams = {
  id: Parameters<typeof api.contents.rejectContentReview>[0];
  reason?: Parameters<typeof api.contents.rejectContentReview>[1]["reject_reason"];
};
type RejectContentResult = AsyncReturnType<typeof api.contents.rejectContentReview>;
export const rejectContent = createAsyncThunk<RejectContentResult, RejectContentParams>(
  "content/rejectContent",
  async ({ id }, { dispatch }) => {
    const title = d("Reason").t("library_label_reason");
    const content = d("Please specify the reason for rejection.").t("library_msg_reject_reason");
    const type = ConfirmDialogType.textField;
    const { isConfirmed, reasonValue, otherValue } = unwrapResult(await dispatch(actAsyncConfirm({ title, content, type })));
    if (!isConfirmed) return Promise.reject();
    return api.contents.rejectContentReview(id, { reject_reason: reasonValue, remark: otherValue });
  }
);
export const lockContent = createAsyncThunk<
  AsyncReturnType<typeof api.contents.lockContent>,
  Parameters<typeof api.contents.lockContent>[0]
>("content/lockContent", async (content_id) => {
  return await api.contents.lockContent(content_id);
});

interface LiveContentPayload extends LoadingMetaPayload {
  content_id: Parameters<typeof api.contents.getContentLiveToken>[0];
}
type LiveContentResult = ReturnType<typeof api.contents.getContentLiveToken>;
export const getContentLiveToken = createAsyncThunk<LiveContentResult, LiveContentPayload>("contents/live", async ({ content_id }) => {
  return api.contents.getContentLiveToken(content_id);
});

const { actions, reducer } = createSlice({
  name: "content",
  initialState,
  reducers: {
    syncHistory: (state, { payload }: PayloadAction<IContentState["history"]>) => {
      state.history = payload;
    },
  },
  extraReducers: {
    // todo: PayloadAction<Content>  应该从 save 中获取类型
    [save.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof save>>) => {
      // alert("success");
    },
    [save.rejected.type]: (state, { error }: any) => {
      throw error;
      // alert(JSON.stringify(error));
    },
    [publish.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof publish>>) => {
      // alert("success");
    },
    [publish.rejected.type]: (state, { error }: any) => {
      throw error;
      // alert(JSON.stringify(error));
    },
    [onLoadContentEdit.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadContentEdit>>) => {
      const {
        contentDetail,
        MediaListTotal,
        mediaList,
        outcomeList,
        OutcomesListTotal,
        linkedMockOptions,
        lesson_types,
        visibility_settings,
      } = initialState;
      Object.assign(state, {
        contentDetail,
        MediaListTotal,
        mediaList,
        outcomeList,
        OutcomesListTotal,
        linkedMockOptions,
        lesson_types,
        visibility_settings,
      });
    },
    [onLoadContentEdit.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadContentEdit>>) => {
      if (payload.contentDetail) {
        // debug
        // state.contentDetail = require('../mocks/contentDetial.json');
        state.contentDetail = payload.contentDetail as Required<EntityContentInfoWithDetails>;
      }
      if (payload.mediaList?.total) {
        state.MediaListTotal = payload.mediaList.total;
      }
      if (payload.mediaList?.list) {
        state.mediaList = payload.mediaList.list;
      }
      if (payload.outcomeList?.total) {
        state.OutcomesListTotal = payload.outcomeList.total;
      }
      if (payload.outcomeList?.list) {
        state.outcomeList = payload.outcomeList.list;
      }
      if (payload.lesson_types) {
        state.lesson_types = payload.lesson_types;
      }
      if (payload.visibility_settings) {
        state.visibility_settings = payload.visibility_settings;
      }
    },
    [onLoadContentEdit.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [contentLists.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.contentsList = payload.list;
      state.mediaList = payload.list;
      state.total = payload.total;
    },
    [contentLists.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [pendingContentLists.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.contentsList = payload.list;
      state.mediaList = payload.list;
      state.total = payload.total;
    },
    [pendingContentLists.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [privateContentLists.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.contentsList = payload.list;
      state.mediaList = payload.list;
      state.total = payload.total;
    },
    [privateContentLists.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getLinkedMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.linkedMockOptions = payload;
    },
    [getLinkedMockOptions.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getLinkedMockOptionsSkills.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.linkedMockOptions.skills = payload;
    },
    [getLinkedMockOptionsSkills.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [searchOutcomeList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.outcomeList = payload.list;
      state.OutcomesListTotal = payload.total;
    },
    [searchOutcomeList.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getContentDetailById.pending.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.contentPreview = initialState.contentPreview;
    },
    [getContentDetailById.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.contentPreview = payload;
    },
    [getContentDetailById.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [deleteContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("delete success");
    },
    [deleteContent.rejected.type]: (state, { error }: any) => {
      // alert("delete failed");
      throw error;
    },
    [publishContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("publish success");
    },
    [publishContent.rejected.type]: (state, { error }: any) => {
      // alert("publish failed");
      throw error;
    },
    [bulkDeleteContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("bulk delete success");
    },
    [bulkDeleteContent.rejected.type]: (state, { error }: any) => {
      // alert("bulk delete failed");
      throw error;
    },
    [bulkPublishContent.fulfilled.type]: (state, { payload }: any) => {
      // alert("bulk publish success");
    },
    [bulkPublishContent.rejected.type]: (state, { error }: any) => {
      // alert("bulk publish failed");
      throw error;
    },
    [approveContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("approve success");
    },
    [approveContent.rejected.type]: (state, { error }: any) => {
      // alert("approve failed");
      throw error;
    },
    [rejectContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("reject success");
    },
    [rejectContent.rejected.type]: (state, { error }: any) => {
      // alert("reject failed");
      throw error;
    },

    [lockContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("lock success");
    },
    [lockContent.rejected.type]: (state, { error }: any) => {
      // alert("lock failed");
      throw error;
    },
    [getContentLiveToken.rejected.type]: (state, { error }: any) => {
      // console.log(error)
    },
  },
});

export const { syncHistory } = actions;
export default reducer;
