import { ConnectionPageInfo } from "@api/api-ko-schema.auto";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useHistory } from "react-router-dom";
import api, { gqlapi } from "../api";
import { QueryMyUserDocument, QueryMyUserQuery, QueryMyUserQueryVariables } from "@api/api-ko.auto";
import {
  EntityContentInfoWithDetails,
  EntityFolderContentData,
  EntityFolderItemInfo,
  EntityOrganizationInfo,
  EntityOrganizationProperty,
  EntityQueryContentItem,
  EntityRegionOrganizationInfo,
  ModelPublishedOutcomeView,
} from "@api/api.auto";
import { RecursiveFolderItem } from "@api/extra";
import { ContentType } from "@api/type";
import { LinkedMockOptions, LinkedMockOptionsItem } from "./contentEdit/programsHandler";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { AsyncReturnType, AsyncTrunkReturned } from "./type";

interface IContentState {
  history?: ReturnType<typeof useHistory>;
  contentDetail: Required<EntityContentInfoWithDetails>;
  mediaList: EntityQueryContentItem[];
  outcomeList: ModelPublishedOutcomeView[];
  total: number | undefined;
  contentsList: EntityFolderContentData[];
  contentPreview: EntityContentInfoWithDetails;
  mediaListTotal: number;
  OutcomesListTotal: number;
  linkedMockOptions: LinkedMockOptions;
  searchLOListOptions: LinkedMockOptions;
  outcomesFullOptions: LinkedMockOptions;
  lesson_types: LinkedMockOptionsItem[];
  visibility_settings: LinkedMockOptionsItem[];
  token: string;
  page_size: number;
  folderTree: RecursiveFolderItem[];
  parentFolderInfo: EntityFolderItemInfo;
  orgProperty: EntityOrganizationProperty;
  orgListPageInfo: ConnectionPageInfo;
  orgListTotal: number;
  vnOrgList: EntityRegionOrganizationInfo[];
  selectedOrg: EntityOrganizationInfo[];
  myOrgId: string;
  user_id: string;
  scheduleDetailsViewContentPreview: EntityContentInfoWithDetails;
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
    publish_scope: [],
    publish_status: "published",
    content_type_name: "",
    program_name: "",
    subject_name: [],
    developmental_name: [],
    skills_name: [],
    age_name: [],
    org_name: "",
    outcomes: [],
    permission: {},
    outcome_entities: [],
    created_at: 0,
    draw_activity: false,
    grade_name: [],
    latest_id: "",
    lesson_type: "",
    lesson_type_name: "",
    publish_scope_name: [],
    reject_reason: [],
    remark: "",
    self_study: false,
    updated_at: 0,
    creator: "",
    creator_name: "",
    is_mine: false,
    teacher_manual_batch: [],
  },
  mediaList: [],
  mediaListTotal: 0,
  OutcomesListTotal: 0,
  outcomeList: [],
  linkedMockOptions: {
    program: [],
    subject: [],
    developmental: [],
    age: [],
    grade: [],
    skills: [],
  },
  searchLOListOptions: {
    program: [],
    subject: [],
    developmental: [],
    age: [],
    grade: [],
    skills: [],
  },
  outcomesFullOptions: {
    program: [],
    subject: [],
    developmental: [],
    age: [],
    grade: [],
    skills: [],
  },
  lesson_types: [],
  visibility_settings: [],
  total: undefined,
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
    publish_scope: [],
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
    publish_scope_name: [],
    source_type: "",
    lesson_type_name: "",
    creator: "",
    creator_name: "",
    is_mine: false,
    teacher_manual_batch: [],
  },
  token: "",
  page_size: 0,
  folderTree: [],
  parentFolderInfo: {},
  orgProperty: {},
  orgListPageInfo: {},
  orgListTotal: 0,
  vnOrgList: [],
  selectedOrg: [],
  myOrgId: "",
  user_id: "",
  scheduleDetailsViewContentPreview: {},
};

export enum Action {
  remove = "remove",
  delete = "delete",
}
type IGetContentsResourseParams = Parameters<typeof api.contentsResources.getContentResourceUploadPath>[0];
type IGetContentsResourseResult = AsyncReturnType<typeof api.contentsResources.getContentResourceUploadPath>;
export const getContentResourceUploadPath = createAsyncThunk<IGetContentsResourseResult, IGetContentsResourseParams>(
  "content/getContentResourceUploadPath",
  (query) => {
    return api.contentsResources.getContentResourceUploadPath(query);
  }
);

interface IQueryOnLoadContentPreviewParams extends LoadingMetaPayload {
  content_id: Parameters<typeof api.contents.getContentById>[0];
  schedule_id?: string;
}
interface IQyeryOnLoadCotnentPreviewResult {
  contentDetail: AsyncReturnType<typeof api.contents.getContentById>;
  user_id?: string;
}
export const onLoadContentPreview = createAsyncThunk<IQyeryOnLoadCotnentPreviewResult, IQueryOnLoadContentPreviewParams>(
  "content/onLoadContentPreview",
  async ({ content_id }) => {
    const contentDetail = await api.contents.getContentById(content_id);
    const {
      data: { myUser },
    } = await gqlapi.query<QueryMyUserQuery, QueryMyUserQueryVariables>({
      query: QueryMyUserDocument,
    });
    const user_id = myUser?.node?.id || "";
    return { contentDetail, user_id };
  }
);

type IGetDownloadPathParams = Parameters<typeof api.contentsResources.getDownloadPath>[0];
type IGetDownloadPathResult = AsyncReturnType<typeof api.contentsResources.getDownloadPath>;
export const getDownloadPath = createAsyncThunk<IGetDownloadPathResult, IGetDownloadPathParams>("content/getDownloadPath", (query) => {
  return api.contentsResources.getDownloadPath(query);
});

interface ActCreateDownoadParams extends LoadingMetaPayload {
  resourceId: string;
}
export const actCreateDownload = createAsyncThunk<IGetDownloadPathResult, ActCreateDownoadParams>(
  "content/actCreateDownload",
  ({ resourceId }) => api.contentsResources.getDownloadPath(resourceId)
);

const { actions, reducer } = createSlice({
  name: "content",
  initialState,
  reducers: {
    syncHistory: (state, { payload }: PayloadAction<IContentState["history"]>) => {
      state.history = payload;
    },
  },
  extraReducers: {
    [onLoadContentPreview.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadContentPreview>>) => {
      state.contentPreview = initialState.contentPreview;
      state.user_id = initialState.user_id;
    },
    [onLoadContentPreview.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadContentPreview>>) => {
      state.contentPreview = payload.contentDetail;
      state.user_id = payload.user_id || "";
    },
    [onLoadContentPreview.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
  },
});

export const { syncHistory } = actions;
export default reducer;
