import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IContentState {
  topicList: {
    fileType: string;
    assetsName: string;
    program: string;
    subject: string;
    developmental: string;
    skills: string;
    age: number[];
    description: string;
    keywords: string;
  };
}

const initialState: IContentState = {
  topicList: {
    fileType: "images",
    assetsName: "",
    program: "",
    subject: "",
    developmental: "",
    skills: "",
    age: [1],
    description: "",
    keywords: "",
  },
};

const { actions, reducer } = createSlice({
  name: "content",
  initialState,
  reducers: {
    save(state, { payload }: PayloadAction<IContentState["topicList"]>) {
      state.topicList = payload;
    },
  },
});

export const { save } = actions;
export default reducer;
