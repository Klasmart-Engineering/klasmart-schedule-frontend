import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface OutcomeState {
  id?: string;
  outcome_name: string;
  shortcode: string;
  assumed: boolean;
  program: string[];
  subject: string[];
  development: string[];
  skills: string[];
  age: string[];
  grade: string[];
  estimated_time: string;
  keywords: string;
  description: string;
  reject_reason: string;
  organization: string;
  create_time: string;
  author: string;
}

interface RootState {
  outcome: OutcomeState;
}

const initialState: OutcomeState = {
  outcome_name: "",
  shortcode: "",
  assumed: true,
  program: [],
  subject: [],
  development: [],
  skills: [],
  age: [],
  grade: [],
  estimated_time: "",
  keywords: "",
  description: "",
  reject_reason: "",
  organization: "",
  create_time: "",
  author: "",
};

const save = createAsyncThunk<OutcomeState["id"], OutcomeState, { state: RootState }>("outcome/save", async (payload, { getState }) => {
  const {
    outcome: { id },
  } = getState();
  if (!id) {
    // create learning outcome
    return;
  } else {
    // update learning outcom
    return id;
  }
});

const { reducer } = createSlice({
  name: "outcome",
  initialState,
  reducers: {},
  extraReducers: {
    [save.fulfilled.type]: (state, { payload }: any) => {
      alert("success");
    },
    [save.rejected.type]: (state, { error }: any) => {
      alert(error);
    },
  },
});

export default reducer;
