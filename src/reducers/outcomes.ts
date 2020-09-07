import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface OutcomeState {
  outcome_id?: string;
  ancestor_id?: string;
  shortcode?: string;
  assumed?: boolean;
  outcome_name?: string;
  program?: { program_id?: string; program_name?: string }[];
  subject?: { subject_id?: string; subject_name?: string }[];
  developmental?: { developmental_id?: string; developmental_name?: string }[];
  skills?: { skill_id?: string; skill_name?: string }[];
  age?: { age_id?: string; age_name?: string }[];
  grade?: { grade_id?: string; grade_name?: string }[];
  estimated_time?: number;
  reject_reason?: string;
  keywords?: string[];
  source_id?: string;
  locked_by?: string;
  author_id?: string;
  author_name?: string;
  organization_id?: string;
  organization_name?: string;
  publish_scope?: string;
  publish_status?: "draft" | "pending" | "published" | "rejected";
  created_at?: number;
  description?: string;
}

interface RootState {
  outcome: OutcomeState;
}

const initialState: OutcomeState = {
  outcome_id: "",
  outcome_name: "",
  shortcode: "",
  assumed: true,
  program: [],
  subject: [],
  developmental: [],
  skills: [],
  age: [],
  grade: [],
  estimated_time: 0,
  keywords: [],
  reject_reason: "",
  created_at: 0,
  author_id: "",
  author_name: "",
  publish_status: "draft",
  organization_id: "",
  organization_name: "",
  locked_by: "",
  description: "",
};

const save = createAsyncThunk<OutcomeState["outcome_id"], OutcomeState, { state: RootState }>(
  "outcome/save",
  async (payload, { getState }) => {
    const {
      outcome: { outcome_id },
    } = getState();
    if (!outcome_id) {
      // create learning outcome
      return;
    } else {
      // update learning outcom
      return outcome_id;
    }
  }
);

// const publish = createAsyncThunk<OutcomeState, OutcomeState["id"], { state: RootState }>("outcome/publish", (id, { getState }) => {
//   return id
// })

// export const publish = createAsyncThunk<OutcomeState, Required<OutcomeState>["id"], { state: RootState }>("content/publish", (id, { getState }) => {
//   return id
// });

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
    // [publish.fulfilled.type]: (state, { payload }: any) => {
    //   alert('success')
    // },
    // [publish.rejected.type]: (state, { error }: any) => {
    //   alert(error)
    // }
  },
});

export default reducer;
