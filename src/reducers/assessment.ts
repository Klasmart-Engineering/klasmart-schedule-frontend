import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";

export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

export interface AssessmentState {
  id?: string;
  title?: string;
  class_id?: string;
  attendances?: { id?: string; name?: string }[];
  subject?: { id?: string; name?: string };
  teacher?: { id?: string; name?: string };
  class_end_time?: number;
  class_length?: number;
  number_of_activities?: number;
  number_of_outcomes?: number;
  complete_time?: number;
  outcome_attendance_maps?: {
    outcome_id?: string;
    outcome_name?: string;
    assumed?: boolean;
    attendance_ids?: string[];
  }[];
}
interface RootState {
  assessment: AssessmentState;
}

const initialState: AssessmentState = {
  id: "",
  title: "",
  class_id: "",
  attendances: [],
  subject: {},
  teacher: {},
  class_end_time: 0,
  class_length: 0,
  number_of_activities: 0,
  number_of_outcomes: 0,
  complete_time: 0,
  outcome_attendance_maps: [],
};

export const update = createAsyncThunk<AssessmentState["id"], AssessmentState, { state: RootState }>(
  "assessment/save",
  (payload, { getState }) => {
    const {
      assessment: { id },
    } = getState();
    //  update assessment
    return id;
  }
);
export const getAssessment = createAsyncThunk<AsyncReturnType<typeof api.assessments.getAssessment>, { id: string }>(
  "assessment/getAssessment",
  async ({ id }) => {
    return await api.assessments.getAssessment(id);
  }
);

const { reducer } = createSlice({
  name: "assessment",
  initialState,
  reducers: {},
  extraReducers: {
    [getAssessment.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssessment>>) => {
      if (payload) {
        state = payload;
      }
    },
    [getAssessment.rejected.type]: (state, { error }: any) => {
      throw error;
    },
  },
});

export default reducer;
