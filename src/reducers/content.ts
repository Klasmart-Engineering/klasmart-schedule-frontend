import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { Content } from "../api/api";

interface IContentState {
  contentDetial: Content;
  mediaList: Content[];
}

interface RootState {
  content: IContentState;
}

const initialState: IContentState = {
  contentDetial: {
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
    publish_status: "",
    content_type_name: "",
    program_name: "",
    subject_name: "",
    developmental_name: "",
    skills_name: "",
    age_name: "",
    org_name: "",
  },
  mediaList: [],
};

type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

type IQueryContentParams = Parameters<typeof api.contentsDynamo.contentsDynamoList>[0];
type IQueryContentResult = ReturnType<typeof api.contentsDynamo.contentsDynamoList>;

interface onLoadContentEditPayload {
  id: Content["id"] | null;
  type: "assets" | "material" | "plan";
  searchText?: string;
}

interface onLoadContentEditResult {
  contentDetial?: AsyncReturnType<typeof api.contents.getContentById>;
  mediaList?: AsyncReturnType<typeof api.contentsDynamo.contentsDynamoList>;
}

export const save = createAsyncThunk<Content, Content, { state: RootState }>("content/save", async (payload, { getState }) => {
  let {
    content: {
      contentDetial: { id },
    },
  } = getState();
  if (!id) {
    // debugger;
    id = (await api.contents.createContent(payload)).id;
  } else {
    // debugger;
    await api.contents.updateContent(id, payload);
  }
  return await api.contents.getContentById(id as string);
});

export const publish = createAsyncThunk<Content, Required<Content>["id"], { state: RootState }>("content/publish", (id, { getState }) => {
  const {
    content: {
      contentDetial: { publish_scope },
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
    const contentDetail = id ? await api.contents.getContentById(id) : initialState.contentDetial;
    const mediaList = await api.contents.searchContents({ content_type: type, name: searchText });
    return { contentDetail, mediaList };
  }
);

const { actions, reducer } = createSlice({
  name: "content",
  initialState,
  reducers: {},
  extraReducers: {
    // todo: PayloadAction<Content>  应该从 save 中获取类型
    [save.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof save>>) => {
      state.contentDetial = payload;
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
      if (payload.contentDetial) {
        state.contentDetial = payload.contentDetial;
      }
      if (payload.mediaList?.list) {
        state.mediaList = payload.mediaList.list;
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
  },
});

// export const {  } = actions;
export default reducer;
