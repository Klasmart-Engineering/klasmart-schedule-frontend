import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { ListAssessmentRequest, ListAssessmentResult, ListAssessmentResultItem } from "../api/type";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";

interface IAssessmentState {
  total: NonNullable<ListAssessmentResult["total"]>;
  assessmentList: ListAssessmentResultItem[];
}

interface RootState {
  assessment: IAssessmentState;
}

const initialState: IAssessmentState = {
  total: 0,
  assessmentList: [],
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
  },
});

export default reducer;
