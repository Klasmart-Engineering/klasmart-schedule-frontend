import { createAsyncThunk, createSlice, PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import api, { gqlapi } from "../api";
import { QeuryMeDocument, QeuryMeQuery, QeuryMeQueryVariables } from "../api/api-ko.auto";
import { apiWaitForOrganizationOfPage } from "../api/extra";
import { GetOutcomeList, MilestoneDetailResult, MilestoneListResult, MilestoneStatus, SearchMilestonneResult } from "../api/type";
import { d } from "../locale/LocaleManager";
import { MilestoneQueryCondition } from "../pages/MilestoneList/types";
import { OutcomeListExectSearch, OutcomeQueryCondition } from "../pages/OutcomeList/types";
import { actAsyncConfirm, ConfirmDialogType } from "./confirm";
import { LinkedMockOptions, _getLinkedMockOptions } from "./contentEdit/programsHandler";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { actSuccess, actWarning } from "./notify";
import { AsyncReturnType, AsyncTrunkReturned } from "./type";
interface IMilestoneState {
  milestoneList: MilestoneListResult;
  milestoneDetail: MilestoneDetailResult;
  total: SearchMilestonneResult["total"];
  shortCode: string;
  linkedMockOptions: LinkedMockOptions;
  organization_name: string;
  user_name: string;
  outcomeList: GetOutcomeList;
  outcomeTotal: number | undefined;
  user_id: string;
}
const PAGE_SIZE = 10;
interface RootState {
  milestone: IMilestoneState;
}

const initialState: IMilestoneState = {
  milestoneList: [],
  milestoneDetail: {
    age: [],
    author: {},
    category: [],
    create_at: 0,
    description: "",
    grade: [],
    milestone_id: "",
    milestone_name: "",
    organization: {},
    outcomes: [],
    program: [
      {
        program_id: "",
        program_name: "",
      },
    ],
    shortcode: "",
    status: "",
    sub_category: [],
    subject: [],
  },
  total: undefined,
  shortCode: "",
  linkedMockOptions: {
    program: [],
    subject: [],
    developmental: [],
    age: [],
    grade: [],
    skills: [],
    program_id: "",
    developmental_id: "",
  },
  organization_name: "",
  user_name: "",
  outcomeList: [],
  outcomeTotal: undefined,
  user_id: "",
};

type ParamsMilestoneList = LoadingMetaPayload & MilestoneQueryCondition;
type ResultMilestoneList = {
  pendingRes?: AsyncReturnType<typeof api.pendingMilestones.searchPendingMilestone>;
  privateRes?: AsyncReturnType<typeof api.privateMilestones.searchPrivateMilestone>;
  milestoneRes?: AsyncReturnType<typeof api.milestones.searchMilestone>;
  user_id?: string;
};
export const onLoadMilestoneList = createAsyncThunk<ResultMilestoneList, ParamsMilestoneList>(
  "milestone/onLoadMilestoneList",
  async ({ metaLoading, ...query }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const { author_id } = query;
    const user_id = meInfo.me?.user_id;
    const resObj: ResultMilestoneList = {};
    resObj.user_id = user_id as string;
    const { status, is_unpub } = query;
    const params = { ...query, author_id: author_id ? user_id : "", page_size: PAGE_SIZE };
    if (status === MilestoneStatus.pending && !is_unpub) {
      resObj.pendingRes = await api.pendingMilestones.searchPendingMilestone(params);
    } else if (is_unpub) {
      resObj.privateRes = await api.privateMilestones.searchPrivateMilestone(params);
    } else {
      resObj.milestoneRes = await api.milestones.searchMilestone(params);
    }
    return resObj;
  }
);

export const getLinkedMockOptions = _getLinkedMockOptions("milestone/getLinkedMockOptions");

type ResuleGetMilestoneDetail = AsyncReturnType<typeof api.milestones.obtainMilestone>;
type ParamsGetMilestoneDetail = { id: Parameters<typeof api.milestones.obtainMilestone>[0] } & LoadingMetaPayload;
export const getMilestoneDetail = createAsyncThunk<ResuleGetMilestoneDetail, ParamsGetMilestoneDetail>(
  "milestone/getMilestoneDetail",
  ({ id }) => {
    return api.milestones.obtainMilestone(id);
  }
);
interface ResultOnLoadMilestoneEdit {
  milestoneDetail?: AsyncReturnType<typeof api.milestones.obtainMilestone>;
  // shortCode?: AsyncReturnType<typeof api.shortcode.generateShortcode>["shortcode"];
  user_id?: string;
}
interface ParamsOnLoadMilestoneEdit extends IQueryOnLoadOutcomeListParams {
  id: MilestoneDetailResult["milestone_id"] | null;
}

export const onLoadMilestoneEdit = createAsyncThunk<ResultOnLoadMilestoneEdit, ParamsOnLoadMilestoneEdit, { state: RootState }>(
  "milestone/onLoadMilestoneEdit",
  async ({ id }, { dispatch }) => {
    const milestoneDetail = id ? await api.milestones.obtainMilestone(id) : initialState.milestoneDetail;
    if (!id) await dispatch(generateShortcode({ kind: "milestones" }));
    // const shortCode = id ? initialState.shortCode : await (await api.shortcode.generateShortcode({ kind: "milestones" })).shortcode;
    await dispatch(onLoadOutcomeList({ exect_search: OutcomeListExectSearch.all, search_key: "", assumed: -1, page: 1 }));
    await dispatch(
      getLinkedMockOptions({
        default_program_id: milestoneDetail.program && milestoneDetail.program[0] ? milestoneDetail.program[0].program_id : "",
        default_developmental_id: milestoneDetail.category && milestoneDetail.category[0] ? milestoneDetail.category[0].category_id : "",
        default_subject_ids:
          milestoneDetail.subject && milestoneDetail.subject[0] ? milestoneDetail.subject?.map((v) => v.subject_id).join(",") : "",
      })
    );
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    const { data } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
      fetchPolicy: "cache-first",
    });
    const user_id = data?.me?.user_id as string;
    return { milestoneDetail, user_id };
  }
);

type ParamsCreateMilestone = Parameters<typeof api.milestones.createMilestone>[0];
type ResultCreateMilestone = AsyncReturnType<typeof api.milestones.createMilestone>;
export const saveMilestone = createAsyncThunk<ResultCreateMilestone, ParamsCreateMilestone, { state: RootState }>(
  "milestone/createMilestone",
  async (payload) => {
    return await api.milestones.createMilestone(payload);
  }
);

type ParamsDeleteMilestone = Parameters<typeof api.milestones.deleteMilestone>[0]["ids"];
type ResultDeleteMilestone = AsyncReturnType<typeof api.milestones.deleteMilestone>;
export const deleteMilestone = createAsyncThunk<ResultDeleteMilestone, ParamsDeleteMilestone>(
  "milestone/deleteMilestone",
  async (ids, { dispatch }) => {
    if (!ids?.length)
      return Promise.reject(dispatch(actWarning(d("At least one content should be selected.").t("library_msg_remove_select_one"))));
    const content = d("Are you sure you want to delete this milestone?").t("assess_msg_delete_milestone");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    const result = await api.milestones.deleteMilestone({ ids });
    if (result === "ok") {
      dispatch(actSuccess(d("Deleted Successfully").t("assess_msg_deleted_successfully")));
    }
    return result;
  }
);

type ParamsPublishMilestone = Parameters<typeof api.bulkPublish.publishMilestonesBulk>[0];
type ResultPublishMilestone = AsyncReturnType<typeof api.bulkPublish.publishMilestonesBulk>;
export const publishMilestone = createAsyncThunk<ResultPublishMilestone, ParamsPublishMilestone>("milestone/publishMilestone", (id) => {
  return api.bulkPublish.publishMilestonesBulk(id);
});

type ParasmsApproveMilestone = Parameters<typeof api.bulkApprove.bulkApproveMilestone>[0]["ids"];
type ResultApproveMilestone = AsyncReturnType<typeof api.bulkApprove.bulkApproveMilestone>;
export const approveMilestone = createAsyncThunk<ResultApproveMilestone, ParasmsApproveMilestone>(
  "milestone/approveMilestone",
  async (ids, { dispatch }) => {
    const res = await api.bulkApprove.bulkApproveMilestone({ ids });
    if (res === "ok") {
      dispatch(actSuccess("Approved Successfully"));
    }
    return res;
  }
);
type ParasmsRejectMilestone = Parameters<typeof api.bulkReject.bulkRejectMilestone>[0];
type ResultRejectMilestone = AsyncReturnType<typeof api.bulkReject.bulkRejectMilestone>;
export const rejectMilestone = createAsyncThunk<ResultRejectMilestone, ParasmsRejectMilestone["milestone_ids"]>(
  "milestone/approveMilestone",
  async (ids, { dispatch }) => {
    const title = d("Reason").t("library_label_reason");
    const content = d("Please specify the reason for rejection.").t("library_msg_reject_reason");
    const type = ConfirmDialogType.onlyInput;
    const { isConfirmed, otherValue } = unwrapResult(await dispatch(actAsyncConfirm({ title, content, type, defaultValue: "" })));
    if (!isConfirmed) return Promise.reject();
    return api.bulkReject.bulkRejectMilestone({ milestone_ids: ids, reject_reason: otherValue });
    // return api.milestones.rejectMilestone( id, { reject_reason })
  }
);

type BulkPublishMilestoneParams = Parameters<typeof api.bulkPublish.publishMilestonesBulk>[0];
export const bulkPublishMilestone = createAsyncThunk<string, BulkPublishMilestoneParams["ids"]>(
  "outcome/bulkPublishMilestone",
  async (ids, { dispatch }) => {
    return api.bulkPublish.publishMilestonesBulk({ ids });
  }
);

type ParamsBulkApproveMilestone = Parameters<typeof api.bulkApprove.bulkApproveMilestone>[0];
type ResultBulkArropveMilestone = AsyncReturnType<typeof api.bulkApprove.bulkApproveMilestone>;
export const bulkApprove = createAsyncThunk<ResultBulkArropveMilestone, ParamsBulkApproveMilestone["ids"]>(
  "milestone/bulkApprove",
  async (ids, { dispatch }) => {
    if (!ids || !ids.length)
      return Promise.reject(dispatch(actWarning(d("At least one learning outcome should be selected.").t("assess_msg_remove_select_one"))));
    const content = d("Are you sure you want to approve these milestones?").t("assess_msg_approve_milestone");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    const res = await api.bulkApprove.bulkApproveMilestone({ ids });
    if (res === "ok") {
      dispatch(actSuccess("Approved Successfully"));
    }
    return res;
  }
);

type ResultBulkRejectMilestone = AsyncReturnType<typeof api.bulkReject.bulkRejectMilestone>;
type ParamsBulkRejectMilestone = Parameters<typeof api.bulkReject.bulkRejectMilestone>[0];
export const bulkReject = createAsyncThunk<ResultBulkRejectMilestone, ParamsBulkRejectMilestone["milestone_ids"]>(
  "outcome/bulkReject",
  async (ids, { dispatch }) => {
    if (!ids || !ids.length)
      return Promise.reject(dispatch(actWarning(d("At least one learning outcome should be selected.").t("assess_msg_remove_select_one"))));
    const title = d("Reason").t("library_label_reason");
    const content = d("Please specify the reason for rejection.").t("library_msg_reject_reason");
    const type = ConfirmDialogType.onlyInput;
    const { isConfirmed, text } = unwrapResult(await dispatch(actAsyncConfirm({ title, defaultValue: "", content, type })));
    if (!isConfirmed) return Promise.reject();
    return await api.bulkReject.bulkRejectMilestone({ milestone_ids: ids, reject_reason: text });
  }
);

type ParamsObtainMilestone = Parameters<typeof api.milestones.obtainMilestone>[0] & LoadingMetaPayload;
type ResultObtainMilestone = AsyncReturnType<typeof api.milestones.obtainMilestone>;
export const obtainMilestone = createAsyncThunk<ResultObtainMilestone, ParamsObtainMilestone>("milestone/obtainMilestone", (id) => {
  return api.milestones.obtainMilestone(id);
});

type ParamsUpdateMilestone = {
  milestone_id: Parameters<typeof api.milestones.updateMilestone>[0];
  milestone: Parameters<typeof api.milestones.updateMilestone>[1];
} & LoadingMetaPayload;
type ResultUpdateMilestone = AsyncReturnType<typeof api.milestones.updateMilestone>;
export const updateMilestone = createAsyncThunk<ResultUpdateMilestone, ParamsUpdateMilestone>(
  "milestone/updateMilestone",
  ({ milestone_id, milestone }) => {
    return api.milestones.updateMilestone(milestone_id, milestone);
  }
);

type ParamsGenerateShortcode = Parameters<typeof api.shortcode.generateShortcode>[0] & LoadingMetaPayload;
type ResultGenerateShortcode = AsyncReturnType<typeof api.shortcode.generateShortcode>;
export const generateShortcode = createAsyncThunk<ResultGenerateShortcode, ParamsGenerateShortcode>(
  "milestone/generateShortcode",
  (kind) => {
    return api.shortcode.generateShortcode(kind);
  }
);

interface ParamsOccupyMilestone extends LoadingMetaPayload {
  id: Parameters<typeof api.milestones.occupyMilestone>[0];
}
type ResultOccupyMilestone = AsyncReturnType<typeof api.milestones.occupyMilestone>;
export const occupyMilestone = createAsyncThunk<ResultOccupyMilestone, ParamsOccupyMilestone>("milestone/occupyMilestone", ({ id }) => {
  return api.milestones.occupyMilestone(id);
});

type IQueryOnLoadOutcomeListParams = OutcomeQueryCondition & LoadingMetaPayload;
type IQueryOnLoadOutcomeListResult = {
  outcomeRes?: AsyncReturnType<typeof api.learningOutcomes.searchLearningOutcomes>;
  user_id?: string | undefined;
};
export const onLoadOutcomeList = createAsyncThunk<IQueryOnLoadOutcomeListResult, IQueryOnLoadOutcomeListParams>(
  "milestone/onLoadOutcomeList",
  async (query) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    // 拉取我的user_id
    const resObj: IQueryOnLoadOutcomeListResult = {};
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    resObj.user_id = meInfo.me?.user_id;
    const { search_key, page, exect_search, assumed } = query;
    const params: OutcomeQueryCondition = {
      publish_status: "published",
      page,
      order_by: "-created_at",
      page_size: 10,
      assumed,
      [exect_search === "all" ? "search_key" : exect_search!]: search_key,
    };
    resObj.outcomeRes = await api.learningOutcomes.searchLearningOutcomes(params);
    return resObj;
  }
);

const { reducer } = createSlice({
  name: "milestone",
  initialState,
  reducers: {},
  extraReducers: {
    [onLoadMilestoneList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadMilestoneList>>) => {
      state.user_id = payload.user_id as string;
      if (payload.pendingRes) {
        state.milestoneList = payload.pendingRes.milestones;
        state.total = payload.pendingRes.total || 0;
      }
      if (payload.privateRes) {
        state.milestoneList = payload.privateRes.milestones;
        state.total = payload.privateRes.total || 0;
      }
      if (payload.milestoneRes) {
        state.milestoneList = payload.milestoneRes.milestones;
        state.total = payload.milestoneRes.total || 0;
      }
    },
    [getLinkedMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLinkedMockOptions>>) => {
      state.linkedMockOptions = payload;
    },
    [getLinkedMockOptions.rejected.type]: (state: any, { error }: any) => {},
    [onLoadMilestoneEdit.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadMilestoneEdit>>) => {
      state.milestoneDetail = payload.milestoneDetail || {};
      state.user_id = payload.user_id || "";
      state.shortCode = payload.milestoneDetail?.shortcode ? payload.milestoneDetail?.shortcode || "" : state.shortCode;
    },
    [onLoadMilestoneEdit.pending.type]: (state, { payload }: PayloadAction<any>) => {
      state.milestoneDetail = initialState.milestoneDetail;
      state.user_id = initialState.user_id;
    },
    [onLoadOutcomeList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadOutcomeList>>) => {
      state.outcomeList = payload.outcomeRes?.list || [];
      state.outcomeTotal = payload.outcomeRes?.total || 0;
    },
    [onLoadOutcomeList.pending.type]: (state, { payload }: PayloadAction<any>) => {
      state.outcomeList = [];
      state.outcomeTotal = initialState.outcomeTotal;
    },
    [generateShortcode.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof generateShortcode>>) => {
      state.shortCode = payload.shortcode || "";
    },
    [generateShortcode.pending.type]: (state, { payload }: PayloadAction<any>) => {
      state.shortCode = initialState.shortCode;
    },
    [getMilestoneDetail.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getMilestoneDetail>>) => {
      state.milestoneDetail = payload || {};
    },
    [getMilestoneDetail.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getMilestoneDetail>>) => {
      state.milestoneDetail = initialState.milestoneDetail;
    },
    [saveMilestone.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof saveMilestone>>) => {
      state.shortCode = payload.shortcode || "";
    },
  },
});
export default reducer;
