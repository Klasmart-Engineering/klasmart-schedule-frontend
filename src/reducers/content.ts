import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useHistory } from "react-router-dom";
import api from "../api";
import { Content, ContentIDListRequest } from "../api/api";
import { apiGetMockOptions, MockOptions } from "../api/extra";

interface IContentState {
  history?: ReturnType<typeof useHistory>;
  contentDetail: Content;
  mediaList: Content[];
  mockOptions: MockOptions;
  total: number;
  contentsList: Content[];
  contentPreview: Content;
}

interface RootState {
  content: IContentState;
}

const initialState: IContentState = {
  history: undefined,
  contentDetail: {
    id: "",
    content_type: 0,
    suggest_time: 0,
    grade: [],
    name: "",
    program: [],
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
    program_name: [],
    subject_name: [],
    developmental_name: [],
    skills_name: [],
    age_name: [],
    org_name: "",
  },
  mediaList: [],
  mockOptions: {
    program: [],
    subject: [],
    skills: [],
    age: [],
    grade: [],
    developmental: [],
    visibility_settings: [],
  },
  total: 0,
  contentsList: [],
  contentPreview: {
    id: "",
    content_type: 0,
    suggest_time: 0,
    grade: [],
    grade_name: [],
    name: "",
    program: [],
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
    program_name: [],
    subject_name: [],
    developmental_name: [],
    skills_name: [],
    age_name: [],
    org_name: "",
  },
};

export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

type IQueryContentParams = Parameters<typeof api.contentsDynamo.contentsDynamoList>[0];
type IQueryContentResult = AsyncReturnType<typeof api.contentsDynamo.contentsDynamoList>;

interface onLoadContentEditPayload {
  id: Content["id"] | null;
  type: "assets" | "material" | "plan";
  searchText?: string;
}

interface onLoadContentEditResult {
  contentDetail?: AsyncReturnType<typeof api.contents.getContentById>;
  mediaList?: AsyncReturnType<typeof api.contentsDynamo.contentsDynamoList>;
  mockOptions?: MockOptions;
}

export const save = createAsyncThunk<Content["id"], Content, { state: RootState }>("content/save", async (payload, { getState }) => {
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
});

export const publish = createAsyncThunk<Content, Required<Content>["id"], { state: RootState }>("content/publish", (id, { getState }) => {
  const {
    content: {
      contentDetail: { publish_scope },
    },
  } = getState();
  // debugger;
  return api.contents.publishContent(id, { scope: publish_scope });
});
export const contentsDynamoList = createAsyncThunk<IQueryContentResult, IQueryContentParams>("content/contentsList", (query) => {
  // debugger;
  return api.contentsDynamo.contentsDynamoList(query);
});

export const onLoadContentEdit = createAsyncThunk<onLoadContentEditResult, onLoadContentEditPayload>(
  "content/onLoadContentEdit",
  async ({ id, type, searchText }) => {
    // 将来做 assets 补全剩下逻辑
    if (type === "assets") return {};
    // debugger;
    const [contentDetail, mediaList, mockOptions] = await Promise.all([
      id ? api.contents.getContentById(id) : initialState.contentDetail,
      api.contents.searchContents({ content_type: type === "material" ? "3" : "1", name: searchText }),
      apiGetMockOptions(),
    ]);
    return { contentDetail, mediaList, mockOptions };
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

type IgetContentResourcePathResult = AsyncReturnType<typeof api.contentsResources.getContentResourcePath>;
export const getContentResourcePath = createAsyncThunk<IgetContentResourcePathResult, string>(
  "content/getContentResourcePath",
  (resourse_id: string) => {
    return api.contentsResources.getContentResourcePath(resourse_id);
  }
);

type IQueryContentsParams = Parameters<typeof api.contents.searchContents>[0];
type IQueryContentsResult = AsyncReturnType<typeof api.contents.searchContents>;
export const contentLists = createAsyncThunk<IQueryContentsResult, IQueryContentsParams>("content/contents", async (query) => {
  const { list, total } = await api.contents.searchContents(query);
  return { list, total };
});

export const getContentDetailById = createAsyncThunk<Content, Required<Content>["id"]>("content/getContentById", (id) =>
  api.contents.getContentById(id)
);

export const deleteContent = createAsyncThunk<Content, Required<Content>["id"]>("content/deleteContent", (id) => {
  return api.contents.deleteContent(id);
});
export const publishContent = createAsyncThunk<Content, Required<Content>["id"]>("content/publish", (id) => {
  return api.contents.publishContent(id, { scope: "" });
});

// type BulkActionIds = Parameters<typeof>
export const bulkDeleteContent = createAsyncThunk<Content, Required<ContentIDListRequest>["id"]>(
  "contents_bulk/deleteContentBulk",
  (idList) => {
    return api.contentsBulk.deleteContentBulk({ id: idList });
  }
);
export const bulkPublishContent = createAsyncThunk<Content, Required<ContentIDListRequest>["id"]>(
  "contents_bulk/publishContentBulk",
  (idList) => {
    return api.contentsBulk.publishContentBulk({ id: idList });
  }
);
export const approveContent = createAsyncThunk<Content, Required<Content>["id"]>("contentsReview/approveContentReview", (id) => {
  return api.contentsReview.approveContentReview(id);
});
export const rejectContent = createAsyncThunk<Content, Required<Content>["id"]>("contentsReview/approveContentReview", (id) => {
  return api.contentsReview.rejectContentReview(id, {});
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
      // alert(JSON.stringify(error));
    },
    [publish.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof publish>>) => {
      // alert("success");
    },
    [publish.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [onLoadContentEdit.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadContentEdit>>) => {
      // debugger
      if (payload.contentDetail) {
        state.contentDetail = payload.contentDetail;
      }
      if (payload.mediaList?.list) {
        state.mediaList = payload.mediaList.list;
      }
      if (payload.mockOptions) {
        state.mockOptions = payload.mockOptions;
      }
    },
    [onLoadContentEdit.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [contentsDynamoList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof contentsDynamoList>>) => {
      // alert("success");
    },
    [contentsDynamoList.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [contentLists.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.contentsList = payload.list;
      state.total = payload.total;
    },
    [contentLists.rejected.type]: (state, { error }: any) => {
      alert(JSON.stringify(error));
    },
    [getContentDetailById.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.contentPreview = payload;
    },
    [getContentDetailById.rejected.type]: (state, { error }: any) => {
      alert(JSON.stringify(error));
    },
    [deleteContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      alert("delete success");
    },
    [deleteContent.rejected.type]: (state, { error }: any) => {
      alert("delete failed");
    },
    [publishContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      alert("publish success");
    },
    [publishContent.rejected.type]: (state, { error }: any) => {
      alert("publish failed");
    },
    [bulkDeleteContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      alert("bulk delete success");
    },
    [bulkDeleteContent.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      alert("bulk delete failed");
    },
    [bulkPublishContent.fulfilled.type]: (state, { error }: any) => {
      alert("bulk publish success");
    },
    [bulkPublishContent.rejected.type]: (state, { error }: any) => {
      alert("bulk publish failed");
    },
    [approveContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      alert("approve success");
    },
    [approveContent.rejected.type]: (state, { error }: any) => {
      alert("approve failed");
    },
    [rejectContent.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      alert("reject success");
    },
    [rejectContent.rejected.type]: (state, { error }: any) => {
      alert("reject failed");
    },
  },
});

export const { syncHistory } = actions;
export default reducer;
