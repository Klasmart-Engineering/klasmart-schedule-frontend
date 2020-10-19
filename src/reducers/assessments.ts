import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { ListAssessmentRequest, ListAssessmentResult, ListAssessmentResultItem } from "../api/type";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";

export interface IAssessmentState {
  assessmentDetail: NonNullable<AsyncReturnType<typeof api.assessments.getAssessment>>;
  total: NonNullable<ListAssessmentResult["total"]>;
  assessmentList: ListAssessmentResultItem[];
}

interface RootState {
  assessment: IAssessmentState;
}

const initialState: IAssessmentState = {
  total: 0,
  assessmentList: [],
  assessmentDetail: {
    id: "",
    title: "",
    attendances: [],
    subject: {
      id: "",
      name: "",
    },
    teachers: [],
    class_end_time: 0,
    class_length: 0,
    number_of_activities: 0,
    number_of_outcomes: 0,
    complete_time: 0,
    outcome_attendance_maps: [],
  },
};

export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

type IQueryAssessmentListParams = ListAssessmentRequest & LoadingMetaPayload;
export const actAssessmentList = createAsyncThunk<ListAssessmentResult, IQueryAssessmentListParams>(
  "assessments/assessmentList",
  async ({ metaLoading, ...query }) => {
    const { items, total } = await api.assessments.listAssessment(query);
    return { items, total };
  }
);

export interface IupdateAssessmentParams {
  id: Parameters<typeof api.assessments.updateAssessment>[0];
  data: Parameters<typeof api.assessments.updateAssessment>[1];
}
export const updateAssessment = createAsyncThunk<string, IupdateAssessmentParams>("assessments/updateAssessment", async ({ id, data }) => {
  await api.assessments.updateAssessment(id, data);
  return id;
});
export const getAssessment = createAsyncThunk<AsyncReturnType<typeof api.assessments.getAssessment>, { id: string } & LoadingMetaPayload>(
  "assessments/getAssessment",
  async ({ id }) => {
    return await api.assessments.getAssessment(id);
  }
);

const { reducer } = createSlice({
  name: "assessments",
  initialState,
  reducers: {},
  extraReducers: {
    [actAssessmentList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof actAssessmentList>>) => {
      // alert("success");
      if (payload.items != null) state.assessmentList = payload.items;
      if (payload.total != null) state.total = payload.total;
    },
    [actAssessmentList.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getAssessment.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssessment>>) => {
      state.assessmentDetail = initialState.assessmentDetail;
    },
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
