import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import api, { gqlapi } from "../api";
import { QeuryMeDocument, QeuryMeQuery, QeuryMeQueryVariables } from "../api/api-ko.auto";
import { apiWaitForOrganizationOfPage } from "../api/extra";
import { GetOutcomeList, MilestoneDetailResult, MilestoneListResult, SearchMilestonneResult } from "../api/type";
import { d } from "../locale/LocaleManager";
import { MilestoneQueryCondition } from "../pages/MilestoneList/types";
import { OutcomeListExectSearch, OutcomeQueryCondition } from "../pages/OutcomeList/types";
import { actAsyncConfirm } from "./confirm";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { actSuccess, actWarning } from "./notify";
interface IMilestoneState {
  milestoneList: MilestoneListResult;
  milestoneDetail: MilestoneDetailResult;
  total: SearchMilestonneResult["total"];
  shortCode: string;
  linkedMockOptions: LinkedMockOptions;
  organization_name: string;
  user_name: string;
  outcomeList: GetOutcomeList;
  outcomeTotal: number;
}
const PAGE_SIZE = 10;
interface RootState {
  milestone: IMilestoneState;
}

const initialState: IMilestoneState = {
  milestoneList: [],
  milestoneDetail: {
    age: [],
    age_ids: [],
    ancestor_id: "",
    author: {},
    category: [],
    category_ids: [],
    create_at: 0,
    description: "",
    grade: [],
    grade_ids: [],
    latest_id: "",
    locked_by: "",
    milestone_id: "",
    milestone_name: "",
    organization: {},
    outcome_ancestor_ids: [],
    outcome_count: 0,
    outcomes: [],
    program: [
      {
        program_id: "",
        program_name: "",
      },
    ],
    program_ids: [],
    shortcode: "",
    source_id: "",
    status: "",
    sub_category: [],
    subcategory_ids: [],
    subject: [],
    subject_ids: [],
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
  outcomeTotal: 0,
};

export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

type ParamsMilestoneList = LoadingMetaPayload & MilestoneQueryCondition;
type ResultMilestoneList = AsyncReturnType<typeof api.milestones.searchMilestone>;
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
    const { total, milestones } = await api.milestones.searchMilestone({
      ...query,
      author_id: author_id ? user_id : "",
      page_size: PAGE_SIZE,
    });
    return { total, milestones };
  }
);

export interface LinkedMockOptionsItem {
  id?: string;
  name?: string;
}
export interface LinkedMockOptions {
  program: LinkedMockOptionsItem[];
  subject: LinkedMockOptionsItem[];
  developmental: LinkedMockOptionsItem[];
  age: LinkedMockOptionsItem[];
  grade: LinkedMockOptionsItem[];
  skills: LinkedMockOptionsItem[];
  program_id: string;
  developmental_id: string;
}
export interface LinkedMockOptionsPayload extends LoadingMetaPayload {
  default_program_id?: string;
  default_subject_ids?: string;
  default_developmental_id?: string;
}

export const getLinkedMockOptions = createAsyncThunk<LinkedMockOptions, LinkedMockOptionsPayload>(
  "milestone/getLinkedMockOptions",
  async ({ default_program_id, default_subject_ids, default_developmental_id }) => {
    const program = await api.programs.getProgram();
    const program_id = default_program_id ? default_program_id : program[0].id;
    if (program_id) {
      const subject = await api.subjects.getSubject({ program_id });
      if (!subject.length)
        return { program, subject: [], developmental: [], age: [], grade: [], skills: [], program_id: "", developmental_id: "" };
      const subject_ids = default_subject_ids ? default_subject_ids : subject[0].id;
      const [developmental, age, grade] = await Promise.all([
        api.developmentals.getDevelopmental({ program_id, subject_ids }),
        api.ages.getAge({ program_id }),
        api.grades.getGrade({ program_id }),
      ]);
      const developmental_id = default_developmental_id ? default_developmental_id : developmental[0].id;
      if (developmental_id) {
        const skills = await api.skills.getSkill({ program_id, developmental_id });
        return { program, subject, developmental, age, grade, skills, program_id, developmental_id };
      } else {
        return { program, subject, developmental, age, grade, skills: [], program_id, developmental_id: "" };
      }
    } else {
      return { program, subject: [], developmental: [], age: [], grade: [], skills: [], program_id: "", developmental_id: "" };
    }
  }
);

interface ParamsOnLoadMilestoneEdit extends IQueryOnLoadOutcomeListParams {
  id: MilestoneDetailResult["milestone_id"] | null;
}
interface ResultOnLoadMilestoneEdit {
  milestoneDetail?: AsyncReturnType<typeof api.milestones.obtainMilestone>;
  // shortCode?: AsyncReturnType<typeof api.shortcode.generateShortcode>["shortcode"];
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
    return { milestoneDetail };
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

type ParamsPublishMilestone = Parameters<typeof api.milestones.publishMilestone>[0];
type ResultPublishMilestone = AsyncReturnType<typeof api.milestones.publishMilestone>;
export const publishMilestone = createAsyncThunk<ResultPublishMilestone, ParamsPublishMilestone>("milestone/publishMilestone", (ids) => {
  return api.milestones.publishMilestone(ids);
});

type ParamsObtainMilestone = Parameters<typeof api.milestones.obtainMilestone>[0] & LoadingMetaPayload;
type ResultObtainMilestone = AsyncReturnType<typeof api.milestones.obtainMilestone>;
export const obtainMilestone = createAsyncThunk<ResultObtainMilestone, ParamsObtainMilestone>("milestone/obtainMilestone", (id) => {
  return api.milestones.obtainMilestone(id);
});

type ParamsUpdateMilestone = {
  milestone_id: Parameters<typeof api.milestones.updateMilestone>[0];
  milestone: Parameters<typeof api.milestones.updateMilestone>[1];
};
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
    };
    if (exect_search === OutcomeListExectSearch.all) params.search_key = search_key;
    if (exect_search === OutcomeListExectSearch.loName) params.outcome_name = search_key;
    if (exect_search === OutcomeListExectSearch.shortCode) params.shortcode = search_key;
    if (exect_search === OutcomeListExectSearch.author) params.author_name = search_key;
    if (exect_search === OutcomeListExectSearch.keyWord) params.keywords = search_key;
    if (exect_search === OutcomeListExectSearch.description) params.description = search_key;
    if (exect_search === OutcomeListExectSearch.loSet) params.set_name = search_key;
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
      state.milestoneList = payload.milestones;
      state.total = payload.total || 0;
    },
    [getLinkedMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLinkedMockOptions>>) => {
      state.linkedMockOptions = payload;
    },
    [getLinkedMockOptions.rejected.type]: (state: any, { error }: any) => {},
    [onLoadMilestoneEdit.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadMilestoneEdit>>) => {
      state.milestoneDetail = payload.milestoneDetail || {};
    },
    [onLoadMilestoneEdit.pending.type]: (state, { payload }: PayloadAction<any>) => {
      state.milestoneDetail = initialState.milestoneDetail;
    },
    [onLoadOutcomeList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadOutcomeList>>) => {
      state.outcomeList = payload.outcomeRes?.list || [];
      state.outcomeTotal = payload.outcomeRes?.total || 0;
    },
    [onLoadOutcomeList.pending.type]: (state, { payload }: PayloadAction<any>) => {
      state.outcomeList = [];
      state.outcomeTotal = 0;
    },
    [generateShortcode.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof generateShortcode>>) => {
      state.shortCode = payload.shortcode || "";
    },
    [generateShortcode.pending.type]: (state, { payload }: PayloadAction<any>) => {
      state.shortCode = initialState.shortCode;
    },
  },
});
export default reducer;
