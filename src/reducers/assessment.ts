import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Attendence {
  id: string;
  name: string;
}
export interface Outcomes {
  outcome_id: string;
  outcome_name: string;
  assumed: boolean;
  attendence_ids: Attendence[];
}
export interface AssessmentState {
  id: string;
  title: string;
  class_id: string;
  attendences: Attendence[];
  subject: string;
  teacher: string;
  class_end_time: number;
  class_length: number;
  number_of_activities: number;
  number_of_outcomes: number;
  complete_time: number;
  outcome_attendance_maps: Outcomes[];
}
interface RootState {
  assessment: AssessmentState;
}

const initialState: AssessmentState = {
  id: "",
  title: "",
  class_id: "",
  attendences: [],
  subject: "",
  teacher: "",
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

const { reducer } = createSlice({
  name: "assessment",
  initialState,
  reducers: {},
  extraReducers: {},
});

export default reducer;
