import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { Content } from "../api/api";

interface IContentState {
  contentDetial: Content;
}

interface RootState {
  content: IContentState;
}

const initialState: IContentState = {
  contentDetial: {
    id: "",
    content_type: 0,
    name: "",
    program: "",
    subject: "",
    developmental: "",
    skills: "",
    age: "",
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
};

type IQueryContentParams = Parameters<typeof api.contentsDynamo.contentsDynamoList>[0];
type IQueryContentResult = ReturnType<typeof api.contentsDynamo.contentsDynamoList>;

export const save = createAsyncThunk<Content, Content, { state: RootState }>("content/save", async (payload, { getState }) => {
  let {
    content: {
      contentDetial: { id },
    },
  } = getState();
  if (!id) {
    id = (await api.contents.createContent(payload)).id;
  } else {
    await api.contents.updateContent(id, payload);
  }
  return await api.contents.getContentById(id as string);
});

export const publish = createAsyncThunk<Content, Content["id"], { state: RootState }>("content/publish", (id, { getState }) => {
  const {
    content: {
      contentDetial: { publish_scope },
    },
  } = getState();
  return api.contents.publishContent(id as string, { scope: publish_scope });
});
export const contentsDynamoList = createAsyncThunk<IQueryContentResult, IQueryContentParams>("content/contentsList", (query) => {
  return api.contentsDynamo.contentsDynamoList(query);
});

const { actions, reducer } = createSlice({
  name: "content",
  initialState,
  reducers: {},
  extraReducers: {
    // todo: PayloadAction<Content>  应该从 save 中获取类型
    [save.fulfilled.type]: (state, { payload }: PayloadAction<Content>) => {
      state.contentDetial = payload;
      alert("success");
    },
    [save.rejected.type]: (state, { error }: any) => {
      alert(JSON.stringify(error));
    },
    [publish.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      alert("success");
    },
    [publish.rejected.type]: (state, { error }: any) => {
      alert(JSON.stringify(error));
    },
  },
});

// export const {  } = actions;
export default reducer;
