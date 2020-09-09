import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";

export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

export interface AssessmentState {
  assessmentDetail: NonNullable<AsyncReturnType<typeof api.assessments.getAssessment>>;
}
interface RootState {
  assessment: AssessmentState;
}

const initialState: AssessmentState = {
  assessmentDetail: {
    id: "",
    title: "",
    class_id: "",
    attendances: [],
    subject: {
      id: "",
      name: "",
    },
    teacher: {
      id: "",
      name: "",
    },
    class_end_time: 0,
    class_length: 0,
    number_of_activities: 0,
    number_of_outcomes: 0,
    complete_time: 0,
    outcome_attendance_maps: [],
  },
};
interface IupdateAssessmentParams {
  id: Parameters<typeof api.assessments.updateAssessment>[0];
  data: Parameters<typeof api.assessments.updateAssessment>[1];
}
export const updateAssessment = createAsyncThunk<AsyncReturnType<typeof api.assessments.updateAssessment>, IupdateAssessmentParams>(
  "assessment/updateAssessment",
  async ({ id, data }) => {
    await api.assessments.updateAssessment(id, data);
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
        state.assessmentDetail = payload;
      }
    },
    [getAssessment.rejected.type]: (state, { error }: any) => {
      throw error;
    },
    [updateAssessment.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof updateAssessment>>) => {},
    [updateAssessment.rejected.type]: (state, { error }: any) => {
      throw error;
    },
  },
});

export default reducer;
