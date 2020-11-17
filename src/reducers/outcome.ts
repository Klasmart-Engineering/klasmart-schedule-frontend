import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import api from "../api";
import {
  ApiOutcomeCreateResponse,
  ApiOutcomeCreateView,
  ApiOutcomeIDList,
  ApiOutcomeView,
  EntityAge,
  EntityDevelopmental,
  EntityGrade,
  EntityProgram,
  EntitySkill,
  EntitySubject,
} from "../api/api.auto";
import { apiGetMockOptions, MockOptions } from "../api/extra";
import { d } from "../locale/LocaleManager";
import { actAsyncConfirm } from "./confirm";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { actWarning } from "./notify";

interface IOutcomeState {
  outcomeDetail: ApiOutcomeView;
  total: number;
  outcomeList: ApiOutcomeView[];
  createOutcome: ApiOutcomeCreateView;
  lockOutcome_id: string;
  mockOptions: MockOptions;
  newOptions: ResultGetNewOptions;
}

interface RootState {
  outcome: IOutcomeState;
}

export const initialState: IOutcomeState = {
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
  createOutcome: {
    outcome_name: "",
    assumed: false,
    organization_id: "",
    program: [],
    subject: [],
    developmental: [],
    skills: [],
    age: [],
    grade: [],
    estimated_time: 10,
    keywords: [],
    description: "",
  },
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
  },
};

export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

interface ParamsGetNewOptions {
  development_id?: string | undefined;
  program_id?: string | undefined;
}
export interface ResultGetNewOptions {
  program: EntityProgram[];
  subject: EntitySubject[];
  developmental: EntityDevelopmental[];
  age: EntityAge[];
  grade: EntityGrade[];
  skills: EntitySkill[];
}
export const getNewOptions = createAsyncThunk<ResultGetNewOptions, ParamsGetNewOptions & LoadingMetaPayload>(
  "getNewOptions",
  async ({ development_id, program_id }) => {
    // if(!development_id && !program_id)
    const program = await api.programs.getProgram();
    const firstProgram_id = program[0].id;
    const [subject, developmental, age, grade] = await Promise.all([
      api.subjects.getSubject({ program_id: program_id ? program_id : firstProgram_id }),
      api.developmentals.getDevelopmental({ program_id: program_id ? program_id : firstProgram_id }),
      api.ages.getAge({ program_id: program_id ? program_id : firstProgram_id }),
      api.grades.getGrade({ program_id: program_id ? program_id : firstProgram_id }),
    ]);
    if (developmental[0] && developmental[0].id) {
      const firstDevelopment_id = developmental[0].id;
      const skills = await api.skills.getSkill({
        developmental_id: development_id ? development_id : firstDevelopment_id,
        program_id: program_id ? program_id : firstProgram_id,
      });
      return { program, subject, developmental, skills, age, grade };
    }
    return { program, subject, developmental: [], skills: [], age, grade };
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
    const { list, total } = await api.learningOutcomes.searchLearningOutcomes(query);
    return { list, total };
  }
);

type IQueryPendingOutcomeListParams = Parameters<typeof api.pendingLearningOutcomes.searchPendingLearningOutcomes>[0] & LoadingMetaPayload;
type IQueryPendingOutcomeListResult = AsyncReturnType<typeof api.pendingLearningOutcomes.searchPendingLearningOutcomes>;
export const actPendingOutcomeList = createAsyncThunk<IQueryPendingOutcomeListResult, IQueryPendingOutcomeListParams>(
  "outcome/outcomeList",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.pendingLearningOutcomes.searchPendingLearningOutcomes(query);
    return { list, total };
  }
);

type IQueryPrivateOutcomeListParams = Parameters<typeof api.privateLearningOutcomes.searchPrivateLearningOutcomes>[0] & LoadingMetaPayload;
type IQueryPrivateOutcomeListResult = AsyncReturnType<typeof api.privateLearningOutcomes.searchPrivateLearningOutcomes>;
export const actPrivateOutcomeList = createAsyncThunk<IQueryPrivateOutcomeListResult, IQueryPrivateOutcomeListParams>(
  "outcome/outcomeList",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.privateLearningOutcomes.searchPrivateLearningOutcomes(query);
    return { list, total };
  }
);

export const deleteOutcome = createAsyncThunk<string, Required<ApiOutcomeView>["outcome_id"]>(
  "outcome/deleteOutcome",
  async (id, { dispatch }) => {
    const content = d("Are you sure you want to delete this learning outcome?").t("assess_msg_delete_content");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.learningOutcomes.deleteLearningOutcome(id);
  }
);

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
export const bulkDeleteOutcome = createAsyncThunk<string, Required<ApiOutcomeIDList>["outcome_ids"]>(
  "outcome/bulkDeleteOutcome",
  async (ids, { dispatch }) => {
    if (!ids.length)
      return Promise.reject(dispatch(actWarning(d("At least one learning outcome should be selected.").t("assess_msg_remove_select_one"))));
    const content = d("Are you sure you want to delete this learning outcome?").t("assess_msg_delete_content");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content })));
    if (!isConfirmed) return Promise.reject();
    return api.bulk.deleteOutcomeBulk({ outcome_ids: ids });
  }
);
export const bulkPublishOutcome = createAsyncThunk<string, Required<ApiOutcomeIDList>["outcome_ids"]>(
  "outcome/bulkPublishOutcome",
  async (ids, { dispatch }) => {
    if (!ids.length)
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

export const save = createAsyncThunk<ApiOutcomeCreateResponse, ApiOutcomeCreateView, { state: RootState }>(
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
export const getOutcomeDetail = createAsyncThunk<ApiOutcomeView, ParamsGetOutcomeDetail>("outcome/getOutcomeDetail", ({ id }) => {
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
    [actPendingOutcomeList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.outcomeList = payload.list;
      state.total = payload.total;
    },
    [actPendingOutcomeList.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [actPrivateOutcomeList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.outcomeList = payload.list;
      state.total = payload.total;
    },
    [actPrivateOutcomeList.rejected.type]: (state, { error }: any) => {
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
      // console.log(payload, 111);
      state.newOptions = payload;
    },
    [getSpecialSkills.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getSpecialSkills>>) => {
      state.newOptions.skills = payload;
    },
  },
});

export default reducer;
