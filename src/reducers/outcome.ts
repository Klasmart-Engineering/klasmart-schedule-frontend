import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import api from "../api";
import { LearningOutcomes, OutcomesIDListRequest } from "../api/api";
import { actAsyncConfirm } from "./confirm";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { actWarning } from "./notify";

interface IOutcomeState {
  outcomeDetail: LearningOutcomes;
  total: number;
  outcomeList: LearningOutcomes[];
}

interface RootState {
  outcome: IOutcomeState;
}

const initialState: IOutcomeState = {
  outcomeDetail: {
    outcome_id: undefined,
    ancestor_id: undefined,
    shortcode: undefined,
    assumed: undefined,
    outcome_name: undefined,
    program: [],
    subject: [],
    developmental: [],
    skills: [],
    age: [],
    grade: [],
    estimated_time: undefined,
    reject_reason: undefined,
    keywords: [],
    source_id: undefined,
    locked_by: undefined,
    author_id: undefined,
    author_name: undefined,
    organization_id: undefined,
    organization_name: undefined,
    publish_scope: undefined,
    publish_status: undefined,
    created_at: undefined,
  },
  total: 0,
  outcomeList: [],
};

export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

type IQueryOutcomeListParams = Parameters<typeof api.learningOutcomes.searchLearningOutcomes>[0] & LoadingMetaPayload;
type IQueryOutcomeListResult = AsyncReturnType<typeof api.learningOutcomes.searchLearningOutcomes>;
export const actOutcomeList = createAsyncThunk<IQueryOutcomeListResult, IQueryOutcomeListParams>(
  "outcome/outcomeList",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.learningOutcomes.searchLearningOutcomes(query);
    return { list, total };
  }
);

export const deleteOutcome = createAsyncThunk<string, Required<LearningOutcomes>["outcome_id"]>(
  "outcome/deleteOutcome",
  async (id, { dispatch }) => {
    const content = `Are you sure you want to delete this outcome?`;
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.learningOutcomes.deleteLearningOutcome(id);
  }
);
export const publishOutcome = createAsyncThunk<LearningOutcomes, Required<LearningOutcomes>["outcome_id"]>(
  "outcome/publishOutcome",
  async (id, { dispatch }) => {
    const content = `Are you sure you want to publish this outcome?`;
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.learningOutcomes.publishLearningOutcomes(id, { scope: "" });
  }
);

// type BulkActionIds = Parameters<typeof>
export const bulkDeleteOutcome = createAsyncThunk<LearningOutcomes, Required<OutcomesIDListRequest>["outcome_ids"]>(
  "outcome/bulkDeleteOutcome",
  async (ids, { dispatch }) => {
    if (!ids.length) return Promise.reject(dispatch(actWarning("You have select any plan or material to delete!")));
    const content = `Are you sure you want to delete these contents?`;
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.bulk.deleteOutcomeBulk({ outcome_ids: ids });
  }
);
export const bulkPublishOutcome = createAsyncThunk<LearningOutcomes, Required<OutcomesIDListRequest>["outcome_ids"]>(
  "outcome/bulkPublishOutcome",
  async (ids, { dispatch }) => {
    if (!ids.length) return Promise.reject(dispatch(actWarning("You have select any plan or material to publish!")));
    const content = `Are you sure you want to publish these contents?`;
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.bulkPublish.publishLearningOutcomesBulk({ outcome_ids: ids });
  }
);

export const lockOutcome = createAsyncThunk<
  AsyncReturnType<typeof api.learningOutcomes.lockLearningOutcomes>,
  Parameters<typeof api.learningOutcomes.lockLearningOutcomes>[0]
>("outcome/lockOutcome", async (id) => {
  return await api.learningOutcomes.lockLearningOutcomes(id);
});

const { reducer } = createSlice({
  name: "outcome",
  initialState,
  reducers: {},
  extraReducers: {
    [actOutcomeList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.outcomeList = payload.list;
      state.total = payload.total;
    },
    [actOutcomeList.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [deleteOutcome.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("delete success");
    },
    [deleteOutcome.rejected.type]: (state, { error }: any) => {
      // alert("delete failed");
      throw error;
    },
    [publishOutcome.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("publish success");
    },
    [publishOutcome.rejected.type]: (state, { error }: any) => {
      // alert("publish failed");
    },
    [bulkDeleteOutcome.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("bulk delete success");
    },
    [bulkDeleteOutcome.rejected.type]: (state, { error }: any) => {
      // alert("bulk delete failed");
      throw error;
    },
    [bulkPublishOutcome.fulfilled.type]: (state, { payload }: any) => {
      // alert("bulk publish success");
    },
    [bulkPublishOutcome.rejected.type]: (state, { error }: any) => {
      // alert("bulk publish failed");
      throw error;
    },
    [lockOutcome.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("lock success");
    },
    [lockOutcome.rejected.type]: (state, { error }: any) => {
      // alert("lock failed");
      throw error;
    },
  },
});

export default reducer;
