import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { CreateLearningOutComesRequest, LearningOutcomes } from "../api/api";

interface outcomeState {
  createOutcome: CreateLearningOutComesRequest;
  outcomeDetail: LearningOutcomes;
}
interface RootState {
  outcome: outcomeState;
}

const initialState: outcomeState = {
  outcomeDetail: {
    outcome_id: "",
    ancestor_id: "",
    shortcode: "",
    assumed: false,
    outcome_name: "",
    program: [],
    subject: [],
    developmental: [],
    skills: [],
    age: [],
    grade: [],
    estimated_time: 1,
    reject_reason: "",
    keywords: [],
    source_id: "",
    locked_by: "",
    author_id: "",
    author_name: "",
    organization_id: "",
    organization_name: "",
    publish_scope: "",
    publish_status: "draft",
    created_at: 0,
    description: "",
  },
  createOutcome: {
    outcome_name: "",
    author_id: "",
    author_name: "",
    assumed: false,
    shortcode: "",
    organization_id: "",
    program: [],
    subject: [],
    reject_reason: "",
    developmental: [],
    skills: [],
    age: [],
    grade: [],
    estimated_time: 10,
    keywords: [],
    description: "",
  },
};

export const save = createAsyncThunk<LearningOutcomes, CreateLearningOutComesRequest, { state: RootState }>(
  "outcome/save",
  async (payload, { getState }) => {
    return await api.learningOutcomes.createLearningOutcomes(payload);
  }
);

type ResultUpdateOutcome = ReturnType<typeof api.learningOutcomes.updateLearningOutcomes>;
type ParamsUpdateOutcome = {
  id: Parameters<typeof api.learningOutcomes.updateLearningOutcomes>[0];
  data: Parameters<typeof api.learningOutcomes.updateLearningOutcomes>[1];
};
export const updateOutcome = createAsyncThunk<any, any>("outcome/update", ({ outcome_id, value }) => {
  return api.learningOutcomes.updateLearningOutcomes(outcome_id, value);
});

export const publish = createAsyncThunk<LearningOutcomes, LearningOutcomes["outcome_id"], { state: RootState }>(
  "outcome/publish",
  (id, { getState }) => {
    // return id
    const {
      outcome: {
        outcomeDetail: { publish_scope },
      },
    } = getState();
    return api.learningOutcomes.publishLearningOutcomes(id as string, { scope: publish_scope });
  }
);

type ResultDeleteOutcome = ReturnType<typeof api.learningOutcomes.deleteLearningOutcome>;
export const deleteOutcome = createAsyncThunk<ResultDeleteOutcome, string>("outcpme/deleteOutcome", (id) => {
  return api.learningOutcomes.deleteLearningOutcome(id);
});

type ResuleGetOutcomeDetail = ReturnType<typeof api.learningOutcomes.getLearningOutcomesById>;
type ParamsGetOutcomeDetail = Parameters<typeof api.learningOutcomes.getLearningOutcomesById>[0];
export const getOutcomeDetail = createAsyncThunk<LearningOutcomes, string>("outcome/getOutcomeDetail", (id) => {
  return api.learningOutcomes.getLearningOutcomesById(id);
});

type ResultRejectOutcome = ReturnType<typeof api.learningOutcomes.rejectLearningOutcomes>;
type ParamsRejectOutcome = {
  id: Parameters<typeof api.learningOutcomes.rejectLearningOutcomes>[0];
  reject_reason: Parameters<typeof api.learningOutcomes.rejectLearningOutcomes>[1]["reject_reason"];
};
export const reject = createAsyncThunk<ResultRejectOutcome, ParamsRejectOutcome>("outcome/reject", ({ id, reject_reason }) => {
  return api.learningOutcomes.rejectLearningOutcomes(id, { reject_reason });
});

export const approve = createAsyncThunk<any, any>("outcome/approve", (id) => {
  return api.learningOutcomes.approveLearningOutcomes(id);
});

const { reducer } = createSlice({
  name: "outcome",
  initialState,
  reducers: {},
  extraReducers: {
    [save.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.outcomeDetail = payload;
    },
    [save.rejected.type]: (state, { error }: any) => {
      // alert(error);
    },
    [publish.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      console.log(payload);
    },
    [publish.rejected.type]: (state, { error }: any) => {
      // alert(error);
    },
    [deleteOutcome.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {},
    [deleteOutcome.rejected.type]: (state, { error }: any) => {},
    [getOutcomeDetail.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.outcomeDetail = payload;
    },
    [getOutcomeDetail.rejected.type]: (state, { error }: any) => {},
    [approve.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      console.log("success");
    },
  },
});

export default reducer;
