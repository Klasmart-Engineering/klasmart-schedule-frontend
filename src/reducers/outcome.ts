import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import api, { gqlapi } from "../api";
import { QeuryMeDocument, QeuryMeQuery, QeuryMeQueryVariables } from "../api/api-ko.auto";
import { ApiPullOutcomeSetResponse } from "../api/api.auto";
import { apiGetMockOptions, apiWaitForOrganizationOfPage, MockOptions } from "../api/extra";
import { GetOutcomeDetail, GetOutcomeList, OutcomePublishStatus } from "../api/type";
import { LangRecordId } from "../locale/lang/type";
import { d } from "../locale/LocaleManager";
import { isUnpublish } from "../pages/OutcomeList/ThirdSearchHeader";
import { OutcomeListExectSearch, OutcomeQueryCondition } from "../pages/OutcomeList/types";
import { actAsyncConfirm, ConfirmDialogType } from "./confirm";
import { LinkedMockOptionsItem } from "./content";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { actSuccess, actWarning } from "./notify";
import { IPermissionState } from "./type";

interface IOutcomeState extends IPermissionState {
  outcomeDetail: GetOutcomeDetail;
  total: number;
  outcomeList: GetOutcomeList;
  // createOutcome: ApiOutcomeCreateView;
  lockOutcome_id: string;
  mockOptions: MockOptions;
  newOptions: ResultGetNewOptions;
  user_id: string;
  outcomeSetList: ApiPullOutcomeSetResponse["sets"];
  defaultSelectOutcomeset: string;
  shortCode: string;
}

interface RootState {
  outcome: IOutcomeState;
}

const assess_msg_no_permission: LangRecordId = "assess_msg_no_permission";

export const initialState: IOutcomeState = {
  permission: {
    [assess_msg_no_permission]: undefined,
  },
  outcomeDetail: {
    outcome_id: "",
    ancestor_id: "",
    shortcode: "",
    assumed: true,
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
  total: 0,
  outcomeList: [],
  // createOutcome: {
  //   outcome_name: "",
  //   assumed: false,
  //   organization_id: "",
  //   program: [],
  //   subject: [],
  //   developmental: [],
  //   skills: [],
  //   age: [],
  //   grade: [],
  //   estimated_time: 10,
  //   keywords: [],
  //   description: "",
  // },
  lockOutcome_id: "",
  mockOptions: {
    options: [],
    visibility_settings: [],
    lesson_types: [],
    classes: [],
    class_types: [],
    organizations: [],
    teachers: [],
    students: [],
    users: [],
    teacher_class_relationship: [],
  },
  newOptions: {
    program: [],
    subject: [],
    developmental: [],
    skills: [],
    age: [],
    grade: [],
    user_id: "",
  },
  user_id: "",
  outcomeSetList: [],
  defaultSelectOutcomeset: "",
  shortCode: "",
};

export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

interface ParamsGetNewOptions {
  development_id?: string;
  program_id?: string;
  default_subject_ids?: string;
}
export interface ResultGetNewOptions {
  program: LinkedMockOptionsItem[];
  subject: LinkedMockOptionsItem[];
  developmental: LinkedMockOptionsItem[];
  age: LinkedMockOptionsItem[];
  grade: LinkedMockOptionsItem[];
  skills: LinkedMockOptionsItem[];
  user_id: string | undefined;
}
const PAGE_SIZE = 20;
export const getNewOptions = createAsyncThunk<ResultGetNewOptions, ParamsGetNewOptions & LoadingMetaPayload>(
  "getNewOptions",
  async ({ development_id, default_subject_ids, program_id }) => {
    // if(!development_id && !program_id)
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const program = await api.programs.getProgram();
    const programId = program_id ? program_id : program[0].id;
    const subject = await api.subjects.getSubject({ program_id: programId });
    const subject_ids = default_subject_ids ? default_subject_ids : subject[0].id;
    const [developmental, age, grade] = await Promise.all([
      api.developmentals.getDevelopmental({ program_id: programId, subject_ids }),
      api.ages.getAge({ program_id: programId }),
      api.grades.getGrade({ program_id: programId }),
    ]);
    if (developmental[0] && developmental[0].id) {
      const firstDevelopment_id = developmental[0].id;
      const skills = await api.skills.getSkill({
        developmental_id: development_id ? development_id : firstDevelopment_id,
        program_id: programId,
      });
      return { program, subject, developmental, skills, age, grade, user_id: meInfo.me?.user_id };
    }
    return { program, subject, developmental: [], skills: [], age, grade, user_id: meInfo.me?.user_id };
  }
);

type GetSpecialSkillsResponse = AsyncReturnType<typeof api.skills.getSkill>;
type GetSpecialSkillsParams = Parameters<typeof api.skills.getSkill>[0] & LoadingMetaPayload;
export const getSpecialSkills = createAsyncThunk<GetSpecialSkillsResponse, GetSpecialSkillsParams>(
  "getSecondLevelOptions",
  async ({ developmental_id, program_id }) => {
    return await api.skills.getSkill({ developmental_id, program_id });
  }
);

type IQueryOutcomeListParams = Parameters<typeof api.learningOutcomes.searchLearningOutcomes>[0] & LoadingMetaPayload;
type IQueryOutcomeListResult = AsyncReturnType<typeof api.learningOutcomes.searchLearningOutcomes>;
export const actOutcomeList = createAsyncThunk<IQueryOutcomeListResult, IQueryOutcomeListParams>(
  "outcome/outcomeList",
  async ({ metaLoading, ...query }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const { list, total } = await api.learningOutcomes.searchLearningOutcomes(query);
    return { list, total, user_id: meInfo.me?.user_id };
  }
);

type IQueryPendingOutcomeListParams = Parameters<typeof api.pendingLearningOutcomes.searchPendingLearningOutcomes>[0] & LoadingMetaPayload;
type IQueryPendingOutcomeListResult = AsyncReturnType<typeof api.pendingLearningOutcomes.searchPendingLearningOutcomes>;
export const actPendingOutcomeList = createAsyncThunk<IQueryPendingOutcomeListResult, IQueryPendingOutcomeListParams>(
  "outcome/actPendingOutcomeList",
  async ({ metaLoading, ...query }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const { list, total } = await api.pendingLearningOutcomes.searchPendingLearningOutcomes(query);
    return { list, total, user_id: meInfo.me?.user_id };
  }
);

type IQueryPrivateOutcomeListParams = Parameters<typeof api.privateLearningOutcomes.searchPrivateLearningOutcomes>[0] & LoadingMetaPayload;
type IQueryPrivateOutcomeListResult = AsyncReturnType<typeof api.privateLearningOutcomes.searchPrivateLearningOutcomes>;
export const actPrivateOutcomeList = createAsyncThunk<IQueryPrivateOutcomeListResult, IQueryPrivateOutcomeListParams>(
  "outcome/actPrivateOutcomeList",
  async ({ metaLoading, ...query }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const { list, total } = await api.privateLearningOutcomes.searchPrivateLearningOutcomes(query);
    return { list, total, user_id: meInfo.me?.user_id };
  }
);

type IQueryOnLoadOutcomeListParams = OutcomeQueryCondition & LoadingMetaPayload;
type IQueryOnLoadOutcomeListResult = {
  pendingRes?: AsyncReturnType<typeof api.pendingLearningOutcomes.searchPendingLearningOutcomes>;
  privateRes?: AsyncReturnType<typeof api.privateLearningOutcomes.searchPrivateLearningOutcomes>;
  outcomeRes?: AsyncReturnType<typeof api.learningOutcomes.searchLearningOutcomes>;
  user_id?: string | undefined;
};
export const onLoadOutcomeList = createAsyncThunk<IQueryOnLoadOutcomeListResult, IQueryOnLoadOutcomeListParams>(
  "outcome/onLoadOutcomeList",
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
    const { search_key, publish_status, author_name, page, order_by, is_unpub, exect_search } = query;
    const params: OutcomeQueryCondition = {
      publish_status,
      author_name,
      page,
      order_by,
      page_size: PAGE_SIZE,
      assumed: -1,
    };
    if (exect_search === OutcomeListExectSearch.all) params.search_key = search_key;
    if (exect_search === OutcomeListExectSearch.loName) params.outcome_name = search_key;
    if (exect_search === OutcomeListExectSearch.shortCode) params.shortcode = search_key;
    if (exect_search === OutcomeListExectSearch.author) params.author_name = search_key;
    if (exect_search === OutcomeListExectSearch.keyWord) params.keywords = search_key;
    if (exect_search === OutcomeListExectSearch.description) params.description = search_key;
    if (exect_search === OutcomeListExectSearch.loSet) params.set_name = search_key;
    if (publish_status === OutcomePublishStatus.pending && !is_unpub) {
      resObj.pendingRes = await api.pendingLearningOutcomes.searchPendingLearningOutcomes(params);
    } else if (isUnpublish({ ...query })) {
      resObj.privateRes = await api.privateLearningOutcomes.searchPrivateLearningOutcomes(params);
    } else {
      resObj.outcomeRes = await api.learningOutcomes.searchLearningOutcomes(params);
    }
    return resObj;
  }
);

type ParamDeleteLearningOutcome = Parameters<typeof api.learningOutcomes.deleteLearningOutcome>[0];
export const deleteOutcome = createAsyncThunk<string, ParamDeleteLearningOutcome>("outcome/deleteOutcome", async (id, { dispatch }) => {
  const content = d("Are you sure you want to delete this learning outcome?").t("assess_msg_delete_content");
  const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
  if (!isConfirmed) return Promise.reject();
  const res = await api.learningOutcomes.deleteLearningOutcome(id);
  if (res === "ok") {
    dispatch(actSuccess(d("Deleted Successfully").t("assess_msg_deleted_successfully")));
  }
  return res;
});

type publishOutcomeResponse = AsyncReturnType<typeof api.learningOutcomes.publishLearningOutcomes>;
type publishOutcomeRequest = Parameters<typeof api.learningOutcomes.publishLearningOutcomes>[0];
export const publishOutcome = createAsyncThunk<publishOutcomeResponse, publishOutcomeRequest>(
  "outcome/publishOutcome",
  async (id, { dispatch }) => {
    // const content = `Are you sure you want to publish this outcome?`;
    // const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    // if (!isConfirmed) return Promise.reject();
    return api.learningOutcomes.publishLearningOutcomes(id, { scope: "" });
  }
);

// type BulkActionIds = Parameters<typeof>
type BulkDeleteOutcomeResult = ReturnType<typeof api.bulk.deleteOutcomeBulk>;
type BulkDeleteOutcomeParams = Parameters<typeof api.bulk.deleteOutcomeBulk>[0];
export const bulkDeleteOutcome = createAsyncThunk<string, BulkDeleteOutcomeParams["outcome_ids"]>(
  "outcome/bulkDeleteOutcome",
  async (ids, { dispatch }) => {
    if (!ids?.length)
      return Promise.reject(dispatch(actWarning(d("At least one learning outcome should be selected.").t("assess_msg_remove_select_one"))));
    const content = d("Are you sure you want to delete this learning outcome?").t("assess_msg_delete_content");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    const res = await api.bulk.deleteOutcomeBulk({ outcome_ids: ids });
    if (res === "ok") {
      dispatch(actSuccess(d("Deleted Successfully").t("assess_msg_deleted_successfully")));
    }
    return res;
  }
);
type BulkPublishutcomeParams = Parameters<typeof api.bulkPublish.publishLearningOutcomesBulk>[0];
export const bulkPublishOutcome = createAsyncThunk<string, BulkPublishutcomeParams["outcome_ids"]>(
  "outcome/bulkPublishOutcome",
  async (ids, { dispatch }) => {
    if (ids && !ids.length)
      return Promise.reject(dispatch(actWarning(d("At least one learning outcome should be selected.").t("assess_msg_remove_select_one"))));
    const content = "Are you sure you want to publish these contents?";
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.bulkPublish.publishLearningOutcomesBulk({ outcome_ids: ids });
  }
);

export const lockOutcome = createAsyncThunk<
  AsyncReturnType<typeof api.learningOutcomes.lockLearningOutcomes>,
  { id: Parameters<typeof api.learningOutcomes.lockLearningOutcomes>[0] } & LoadingMetaPayload
>("outcome/lockOutcome", async ({ id }) => {
  return await api.learningOutcomes.lockLearningOutcomes(id);
});
type ResultCreateLearningOutcomes = AsyncReturnType<typeof api.learningOutcomes.createLearningOutcomes>;
type ParamsCreateLearningOutcomes = Parameters<typeof api.learningOutcomes.createLearningOutcomes>[0];
export const save = createAsyncThunk<ResultCreateLearningOutcomes, ParamsCreateLearningOutcomes, { state: RootState }>(
  "outcome/save",
  async (payload, { getState }) => {
    return await api.learningOutcomes.createLearningOutcomes(payload);
  }
);

export type ResultUpdateOutcome = AsyncReturnType<typeof api.learningOutcomes.updateLearningOutcomes>;
type ParamsUpdateOutcome = {
  outcome_id: Parameters<typeof api.learningOutcomes.updateLearningOutcomes>[0];
  value: Parameters<typeof api.learningOutcomes.updateLearningOutcomes>[1];
};
export const updateOutcome = createAsyncThunk<ResultUpdateOutcome, ParamsUpdateOutcome>("outcome/update", ({ outcome_id, value }) => {
  return api.learningOutcomes.updateLearningOutcomes(outcome_id, value);
});

type ResuleGetOutcomeDetail = ReturnType<typeof api.learningOutcomes.getLearningOutcomesById>;
type ParamsGetOutcomeDetail = { id: Parameters<typeof api.learningOutcomes.getLearningOutcomesById>[0] } & LoadingMetaPayload;
export const getOutcomeDetail = createAsyncThunk<ResuleGetOutcomeDetail, ParamsGetOutcomeDetail>("outcome/getOutcomeDetail", ({ id }) => {
  return api.learningOutcomes.getLearningOutcomesById(id);
});

type ResultRejectOutcome = AsyncReturnType<typeof api.learningOutcomes.rejectLearningOutcomes>;
type ParamsRejectOutcome = {
  id: Parameters<typeof api.learningOutcomes.rejectLearningOutcomes>[0];
  reject_reason: Parameters<typeof api.learningOutcomes.rejectLearningOutcomes>[1]["reject_reason"];
};
export const reject = createAsyncThunk<ResultRejectOutcome, ParamsRejectOutcome>("outcome/reject", async ({ id, reject_reason }) => {
  return await api.learningOutcomes.rejectLearningOutcomes(id, { reject_reason });
});

export const approve = createAsyncThunk<any, any>("outcome/approve", (id) => {
  return api.learningOutcomes.approveLearningOutcomes(id);
});

export const getMockOptions = createAsyncThunk<MockOptions>("apiGetMockOptions", async () => {
  return await apiGetMockOptions();
});

type ResultNewRejectOutcome = AsyncReturnType<typeof api.learningOutcomes.rejectLearningOutcomes>;
type ParamsNewRejectOutcome = {
  id: Parameters<typeof api.learningOutcomes.rejectLearningOutcomes>[0];
};
export const newReject = createAsyncThunk<ResultNewRejectOutcome, ParamsNewRejectOutcome>(
  "outcome/reject",
  async ({ id }, { dispatch }) => {
    const title = d("Reason").t("library_label_reason");
    const content = d("Please specify the reason for rejection.").t("library_msg_reject_reason");
    const type = ConfirmDialogType.onlyInput;
    const { isConfirmed, text } = unwrapResult(await dispatch(actAsyncConfirm({ title, defaultValue: "", content, type })));
    if (!isConfirmed) return Promise.reject();
    return await api.learningOutcomes.rejectLearningOutcomes(id, { reject_reason: text });
  }
);

type IQueryBulkRejectResult = AsyncReturnType<typeof api.bulkApprove.approveLearningOutcomesBulk>;
type IQueryBulkApproveOutcomeParams = Parameters<typeof api.bulkApprove.approveLearningOutcomesBulk>[0];
export const bulkApprove = createAsyncThunk<IQueryBulkRejectResult, IQueryBulkApproveOutcomeParams["outcome_ids"]>(
  "outcome/bulkApprove",
  async (ids, { dispatch }) => {
    if (!ids || !ids.length)
      return Promise.reject(dispatch(actWarning(d("At least one learning outcome should be selected.").t("assess_msg_remove_select_one"))));
    const content = d("Are you sure you want to approve these learning outcomes?").t("assess_bulk_approval");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    const res = await api.bulkApprove.approveLearningOutcomesBulk({ outcome_ids: ids });
    if (res === "ok") {
      dispatch(actSuccess("Approved Successfully"));
    }
    return res;
  }
);

type ResultBulkRejectOutcome = AsyncReturnType<typeof api.bulkReject.rejectLearningOutcomesBulk>;
type IQueryBulkRejctOutcomeParams = Parameters<typeof api.bulkReject.rejectLearningOutcomesBulk>[0];
export const bulkReject = createAsyncThunk<ResultBulkRejectOutcome, IQueryBulkRejctOutcomeParams["outcome_ids"]>(
  "outcome/bulkReject",
  async (ids, { dispatch }) => {
    if (!ids || !ids.length)
      return Promise.reject(dispatch(actWarning(d("At least one learning outcome should be selected.").t("assess_msg_remove_select_one"))));
    const title = d("Reason").t("library_label_reason");
    const content = d("Please specify the reason for rejection.").t("library_msg_reject_reason");
    const type = ConfirmDialogType.onlyInput;
    const { isConfirmed, text } = unwrapResult(await dispatch(actAsyncConfirm({ title, defaultValue: "", content, type })));
    if (!isConfirmed) return Promise.reject();
    return await api.bulkReject.rejectLearningOutcomesBulk({ outcome_ids: ids, reject_reason: text });
  }
);

type IQueryPullOutcomeSetParams = Parameters<typeof api.sets.pullOutcomeSet>[0];
type IQueryPullOutcomeSetResult = AsyncReturnType<typeof api.sets.pullOutcomeSet>;
export const pullOutcomeSet = createAsyncThunk<IQueryPullOutcomeSetResult, IQueryPullOutcomeSetParams>(
  "sets/pullOutcomeset",
  async (query) => {
    return api.sets.pullOutcomeSet(query);
  }
);

type IQueryCreateOutcomeSetParams = Parameters<typeof api.sets.createOutcomeSet>[0];
type IQueryCreateOutcomeSetResult = AsyncReturnType<typeof api.sets.createOutcomeSet>;
export const createOutcomeSet = createAsyncThunk<IQueryPullOutcomeSetResult, IQueryCreateOutcomeSetParams>(
  "sets/createOutcomeSet",
  async (params) => {
    const { set_name = "" } = params;
    await api.sets.createOutcomeSet(params);
    return api.sets.pullOutcomeSet({ set_name });
  }
);
type IQueryBulkBindOutcomeSetParams = Parameters<typeof api.sets.bulkBindOutcomeSet>[0];
type IQueryBulkBindOutcomeSetResult = AsyncReturnType<typeof api.sets.bulkBindOutcomeSet>;
export const bulkBindOutcomeSet = createAsyncThunk<IQueryBulkBindOutcomeSetResult, IQueryBulkBindOutcomeSetParams>(
  "sets/bulkBindOutcomeSet",
  async ({ outcome_ids, set_ids }, { dispatch }) => {
    if (!set_ids || !set_ids.length)
      return Promise.reject(dispatch(actWarning(d("At least one learning outcome should be selected.").t("assess_msg_remove_select_one"))));
    const res = await api.sets.bulkBindOutcomeSet({ outcome_ids, set_ids });
    if (res === "ok") {
      dispatch(actSuccess(d("Updated Successfully").t("assess_msg_updated_successfully")));
    }
    return res;
  }
);

type IQueryGenerateShortcodeParams = Parameters<typeof api.shortcode.generateShortcode>[0];
type IQueryGenerateShortcodeResult = AsyncReturnType<typeof api.shortcode.generateShortcode>;
export const generateShortcode = createAsyncThunk<IQueryGenerateShortcodeResult, IQueryGenerateShortcodeParams>(
  "shortcode/generateShortcode",
  async (kind) => {
    return api.shortcode.generateShortcode(kind);
  }
);

const { reducer } = createSlice({
  name: "outcome",
  initialState,
  reducers: {},
  extraReducers: {
    [actOutcomeList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.permission[assess_msg_no_permission] = undefined;
      state.outcomeList = payload.list;
      state.total = payload.total;
      state.user_id = payload.user_id;
    },
    [actOutcomeList.rejected.type]: (state, { error }: any) => {
      state.permission[assess_msg_no_permission] = false;
      // alert(JSON.stringify(error));
    },
    [actPendingOutcomeList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.permission[assess_msg_no_permission] = undefined;
      state.outcomeList = payload.list;
      state.total = payload.total;
      state.user_id = payload.user_id;
    },
    [actPendingOutcomeList.rejected.type]: (state, { error }: any) => {
      state.permission[assess_msg_no_permission] = false;
      // alert(JSON.stringify(error));
    },
    [actPrivateOutcomeList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.permission[assess_msg_no_permission] = undefined;
      state.outcomeList = payload.list;
      state.total = payload.total;
      state.user_id = payload.user_id;
    },
    [actPrivateOutcomeList.rejected.type]: (state, { error }: any) => {
      state.permission[assess_msg_no_permission] = false;
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
      state.lockOutcome_id = payload.outcome_id;
    },
    [lockOutcome.rejected.type]: (state, { error }: any) => {
      // alert("lock failed");
      throw error;
    },
    [save.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.outcomeDetail = payload;
    },
    [save.rejected.type]: (state, { error }: any) => {
      throw error;
    },
    [getOutcomeDetail.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.outcomeDetail = payload;
    },
    // [getOutcomeDetail.pending.type]: (state, { payload }: PayloadAction<any>) => {
    //   state.outcomeDetail = initialState.outcomeDetail;
    // },
    [getOutcomeDetail.rejected.type]: (state, { error }: any) => {
      throw error;
    },
    [approve.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {},
    [approve.rejected.type]: (state, { error }: any) => {
      throw error;
    },
    [updateOutcome.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {},
    [updateOutcome.rejected.type]: ({ error }: any) => {},
    [getMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getMockOptions>>) => {
      state.mockOptions = payload;
    },
    [getMockOptions.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getNewOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getNewOptions>>) => {
      state.newOptions = payload;
    },
    [getSpecialSkills.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getSpecialSkills>>) => {
      state.newOptions.skills = payload;
    },
    [onLoadOutcomeList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.permission[assess_msg_no_permission] = undefined;
      state.user_id = payload.user_id;
      if (payload.pendingRes) {
        state.outcomeList = payload.pendingRes.list;
        state.total = payload.pendingRes.total;
      }
      if (payload.privateRes) {
        state.outcomeList = payload.privateRes.list;
        state.total = payload.privateRes.total;
      }
      if (payload.outcomeRes) {
        state.outcomeList = payload.outcomeRes.list;
        state.total = payload.outcomeRes.total;
      }
    },
    [onLoadOutcomeList.rejected.type]: (state, { error }: any) => {
      state.permission[assess_msg_no_permission] = false;
    },
    [newReject.rejected.type]: (state, { error }: any) => {
      throw error;
    },
    [bulkApprove.rejected.type]: (state, { error }: any) => {
      throw error;
    },
    [bulkReject.rejected.type]: (state, { error }: any) => {
      throw error;
    },
    [pullOutcomeSet.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof pullOutcomeSet>>) => {
      state.outcomeSetList = payload.sets;
      state.defaultSelectOutcomeset = "";
    },
    [createOutcomeSet.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof createOutcomeSet>>) => {
      state.outcomeSetList = payload.sets;
      state.defaultSelectOutcomeset = payload && payload.sets && payload.sets[0].set_id ? payload.sets[0].set_id : "";
    },
    [generateShortcode.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof generateShortcode>>) => {
      state.shortCode = payload.shortcode || "";
    },
  },
});

export default reducer;
