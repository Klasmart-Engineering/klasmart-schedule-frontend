import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useHistory } from "react-router-dom";
import api from "../api";
import { Content } from "../api/api";
import { apiGetMockOptions, MockOptions } from "../api/extra";

interface IContentState {
  history?: ReturnType<typeof useHistory>;
  contentDetail: Content;
  mediaList: Content[];
  mockOptions: MockOptions;
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
    data: {},
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
};

export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

interface onLoadContentEditPayload {
  id: Content["id"] | null;
  type: "assets" | "material" | "plan";
  searchText?: string;
}

interface onLoadContentEditResult {
  contentDetail?: AsyncReturnType<typeof api.contents.getContentById>;
  mediaList?: AsyncReturnType<typeof api.contents.searchContents>;
  mockOptions?: MockOptions;
}

export const save = createAsyncThunk<Content, Content, { state: RootState }>("content/save", async (payload, { getState }) => {
  let {
    content: {
      contentDetail: { id },
    },
  } = getState();
  // debugger
  if (!id) {
    id = (await api.contents.createContent(payload)).id;
  } else {
    await api.contents.updateContent(id, payload);
  }
  return await api.contents.getContentById(id as string);
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

export const onLoadContentEdit = createAsyncThunk<onLoadContentEditResult, onLoadContentEditPayload>(
  "content/onLoadContentEdit",
  async ({ id, type, searchText }) => {
    // 将来做 assets 补全剩下逻辑
    if (type === "assets") return {};
    // debugger;
    const contentDetail = id ? await api.contents.getContentById(id) : initialState.contentDetail;
    const mediaList = await api.contents.searchContents({ content_type: type === "material" ? "3" : "1", name: searchText });
    const mockOptions = await apiGetMockOptions();
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
export const getContentResource = createAsyncThunk<IgetContentResourcePathResult, string>(
  "content/getContentResourcePath",
  (resourse_id: string) => {
    return api.contentsResources.getContentResourcePath(resourse_id);
  }
);

type IQueryContentsParams = Parameters<typeof api.contents.searchContents>[0];
type IQueryContentsResult = AsyncReturnType<typeof api.contents.searchContents>;
export const contentList = createAsyncThunk<IQueryContentsResult, IQueryContentsParams>("contents/contents", (query) => {
  return api.contents.searchContents(query);
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
      state.contentDetail = payload;
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
    [contentList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      alert("success");
    },
    [contentList.rejected.type]: (state, { error }: any) => {
      alert(JSON.stringify(error));
    },
  },
});

export const { syncHistory } = actions;
export default reducer;
