import { cloneDeep } from "@apollo/client/utilities";
import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api, { gqlapi } from "../api";
import { QeuryMeDocument, QeuryMeQuery, QeuryMeQueryVariables } from "../api/api-ko.auto";
import { apiWaitForOrganizationOfPage } from "../api/extra";
import { ListAssessmentRequest, ListAssessmentResult, ListAssessmentResultItem } from "../api/type";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";

export interface IAssessmentState {
  assessmentDetail: NonNullable<AsyncReturnType<typeof api.assessments.getAssessment>>;
  my_id?: string;
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
interface getAssessmentResponce {
  detail: AsyncReturnType<typeof api.assessments.getAssessment>;
  my_id: string;
}
export const getAssessment = createAsyncThunk<getAssessmentResponce, { id: string } & LoadingMetaPayload>(
  "assessments/getAssessment",
  async ({ id }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const my_id = meInfo.me?.user_id || "";
    const detail = await api.assessments.getAssessment(id);
    return { detail, my_id };
  }
);

const { reducer } = createSlice({
  name: "assessments",
  initialState,
  reducers: {},
  extraReducers: {
    [actAssessmentList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof actAssessmentList>>) => {
      // alert("success");
      state.assessmentList = payload.items || [];
      state.total = payload.total || 0;
    },
    [actAssessmentList.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getAssessment.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssessment>>) => {
      state.assessmentDetail = cloneDeep(initialState.assessmentDetail);
      state.my_id = cloneDeep(initialState.my_id);
    },
    [getAssessment.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssessment>>) => {
      if (payload) {
        state.assessmentDetail = payload.detail;
        state.my_id = payload.my_id;
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
