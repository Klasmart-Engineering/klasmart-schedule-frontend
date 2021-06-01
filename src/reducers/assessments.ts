import { cloneDeep } from "@apollo/client/utilities";
import { AsyncThunk, AsyncThunkAction, createAsyncThunk, createSlice, PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import api, { ExtendedRequestParams, gqlapi } from "../api";
import { QeuryMeDocument, QeuryMeQuery, QeuryMeQueryVariables } from "../api/api-ko.auto";
import {
  EntityAssessHomeFunStudyArgs,
  EntityGetHomeFunStudyResult,
  EntityListHomeFunStudiesResultItem,
  EntityScheduleFeedbackView,
} from "../api/api.auto";
import { apiWaitForOrganizationOfPage } from "../api/extra";
import { ListAssessmentRequest, ListAssessmentResult, ListAssessmentResultItem } from "../api/type";
import { hasPermissionOfMe, PermissionType } from "../components/Permission";
import { d } from "../locale/LocaleManager";
import { actAsyncConfirm } from "./confirm";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { actInfo } from "./notify";

export interface IAssessmentState {
  assessmentDetail: NonNullable<AsyncReturnType<typeof api.assessments.getAssessment>>;
  my_id?: string;
  total: NonNullable<ListAssessmentResult["total"]>;
  assessmentList: ListAssessmentResultItem[];
  homefunDetail: EntityGetHomeFunStudyResult;
  homefunFeedbacks: EntityScheduleFeedbackView[];
  hasPermissionOfHomefun: boolean;
  homeFunAssessmentList: EntityListHomeFunStudiesResultItem[];
  studyAssessmentList: NonNullable<AsyncReturnType<typeof api.studyAssessments.listStudyAssessments>["items"]>;
  studyAssessmentDetail: NonNullable<AsyncReturnType<typeof api.studyAssessments.getStudyAssessmentDetail>>;
}

interface RootState {
  assessments: IAssessmentState;
}

const initialState: IAssessmentState = {
  total: 0,
  assessmentList: [],
  homeFunAssessmentList: [],
  assessmentDetail: {
    class: { id: "b43e2967-7671-4dbc-9302-95951c560d65", name: "CLASSBG" },
    class_end_time: 1619074227,
    class_length: 60,
    complete_time: 0,
    due_at: 1619074227,
    id: "60811da7e364b2590bbe4e38",
    lesson_materials: [
      {
        checked: true,
        comment: "",
        id: "6077b56b42cb59b4e9ca1b23",
        name: "material2",
        outcome_ids: ["606d2c9a4f0d99636336317c", "606d2dea3732b97af0e95c6c"],
      },
    ],
    lesson_plan: {
      checked: true,
      comment: "",
      id: "6077e26033c32004ef2c7ab5",
      name: "plan 2",
      outcome_ids: ["606c30f7b1390c1813cde871"],
    },
    outcomes: [
      {
        assumed: true,
        checked: true,
        none_achieved: false,
        outcome_id: "606c30f7b1390c1813cde871",
        outcome_name: "ESLSPuuu",
        skip: false,
        attendance_ids: [
          "03fff878-ffb3-5e5d-acbc-1d517bbdb12e",
          "b8737032-6ac8-5fd7-817a-dfd323aa8289",
          "38c81b12-e0bf-5e57-9035-466db7144b53",
          "3e00257f-c53b-5e26-8753-f2168d6fb5fd",
        ],
      },
      {
        assumed: true,
        checked: false,
        none_achieved: false,
        outcome_id: "606d2dea3732b97af0e95c6c",
        outcome_name: "ggg",
        skip: false,
        attendance_ids: [
          "03fff878-ffb3-5e5d-acbc-1d517bbdb12e",
          "b8737032-6ac8-5fd7-817a-dfd323aa8289",
          "38c81b12-e0bf-5e57-9035-466db7144b53",
          "3e00257f-c53b-5e26-8753-f2168d6fb5fd",
        ],
      },
      {
        assumed: false,
        attendance_ids: undefined,
        checked: false,
        none_achieved: false,
        outcome_id: "606d2c9a4f0d99636336317c",
        outcome_name: "LO111",
        skip: false,
      },
    ],
    program: { id: "7565ae11-8130-4b7d-ac24-1d9dd6f792f2", name: "None Specified" },
    remaining_time: 0,
    room_id: "60811d8727ad4df38d2bf31e",
    schedule_id: "60811d8727ad4df38d2bf31e",
    status: "in_progress",
    student_view_items: [
      {
        comment: "",
        student_id: "b8737032-6ac8-5fd7-817a-dfd323aa8289",
        student_name: "stbg001 BG",
        lesson_materials: [
          {
            achieved_score: 0,
            answer: "",
            attempted: false,
            is_h5p: false,
            lesson_material_id: "6018f9a24f324bfb6886ac9f",
            lesson_material_name: "image11",
            lesson_material_type: "",
            max_score: 0,
          },
          {
            achieved_score: 0,
            answer: "",
            attempted: false,
            is_h5p: false,
            lesson_material_id: "6018f9dd4f324bfb6886acab",
            lesson_material_name: "mp311",
            lesson_material_type: "",
            max_score: 0,
          },
          {
            achieved_score: 0,
            answer: "",
            attempted: false,
            is_h5p: false,
            lesson_material_id: "6018fa2f474370357158801e",
            lesson_material_name: "mp4",
            lesson_material_type: "",
            max_score: 0,
          },
        ],
      },
      {
        comment: "",
        lesson_materials: [
          {
            achieved_score: 0,
            answer: "",
            attempted: false,
            is_h5p: false,
            lesson_material_id: "6018f9a24f324bfb6886ac9f",
            lesson_material_name: "image11",
            lesson_material_type: "",
            max_score: 0,
          },
          {
            achieved_score: 0,
            answer: "",
            attempted: false,
            is_h5p: false,
            lesson_material_id: "6018f9dd4f324bfb6886acab",
            lesson_material_name: "mp311",
            lesson_material_type: "",
            max_score: 0,
          },
          {
            achieved_score: 0,
            answer: "",
            attempted: false,
            is_h5p: false,
            lesson_material_id: "6018fa2f474370357158801e",
            lesson_material_name: "mp4",
            lesson_material_type: "",
            max_score: 0,
          },
        ],
        student_id: "38c81b12-e0bf-5e57-9035-466db7144b53",
        student_name: "stbg002 BG",
      },
      {
        comment: "",
        lesson_materials: [
          {
            achieved_score: 0,
            answer: "",
            attempted: false,
            is_h5p: false,
            lesson_material_id: "6018f9a24f324bfb6886ac9f",
            lesson_material_name: "image11",
            lesson_material_type: "",
            max_score: 0,
          },
          {
            achieved_score: 0,
            answer: "",
            attempted: false,
            is_h5p: false,
            lesson_material_id: "6018f9dd4f324bfb6886acab",
            lesson_material_name: "mp311",
            lesson_material_type: "",
            max_score: 0,
          },
          {
            achieved_score: 0,
            answer: "",
            attempted: false,
            is_h5p: false,
            lesson_material_id: "6018fa2f474370357158801e",
            lesson_material_name: "mp4",
            lesson_material_type: "",
            max_score: 0,
          },
        ],
        student_id: "3e00257f-c53b-5e26-8753-f2168d6fb5fd",
        student_name: "stbg003 BG",
      },
      {
        comment: "",
        student_id: "03fff878-ffb3-5e5d-acbc-1d517bbdb12e",
        student_name: "stu20210106 BG",
        lesson_materials: [
          {
            achieved_score: 0,
            answer: "",
            attempted: false,
            is_h5p: false,
            lesson_material_id: "6018f9a24f324bfb6886ac9f",
            lesson_material_name: "image11",
            lesson_material_type: "",
            max_score: 0,
          },
          {
            achieved_score: 0,
            answer: "",
            attempted: false,
            is_h5p: false,
            lesson_material_id: "6018f9dd4f324bfb6886acab",
            lesson_material_name: "mp311",
            lesson_material_type: "",
            max_score: 0,
          },
          {
            achieved_score: 0,
            answer: "",
            attempted: false,
            is_h5p: false,
            lesson_material_id: "6018fa2f474370357158801e",
            lesson_material_name: "mp4",
            lesson_material_type: "",
            max_score: 0,
          },
        ],
      },
    ],
    students: [
      { id: "b8737032-6ac8-5fd7-817a-dfd323aa8289", name: "stbg001 BG", checked: true },
      { id: "3e00257f-c53b-5e26-8753-f2168d6fb5fd", name: "stbg003 BG", checked: true },
      { id: "38c81b12-e0bf-5e57-9035-466db7144b53", name: "stbg002 BG", checked: true },
      { id: "03fff878-ffb3-5e5d-acbc-1d517bbdb12e", name: "stu20210106 BG", checked: true },
    ],
    subjects: [{ id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" }],
    teachers: [
      { id: "f0503625-6a97-5e7f-9bdd-03f3da64c6d0", name: "sch00l BG" },
      { id: "ed43b8c3-d5c0-52af-ae10-402f1fe2ea46", name: "tebg001 BG" },
      { id: "1a7aea42-7c4f-514b-8f77-ebbe2de32c66", name: "ziyou bg" },
    ],
    title: "20210422-CLASSBG-livedfgf",
  },
  homefunDetail: {
    assess_comment: "",
    assess_feedback_id: "",
    assess_score: 3,
    complete_at: 0,
    due_at: 0,
    id: "",
    schedule_id: "",
    student_id: "",
    student_name: "",
    teacher_ids: [],
    teacher_names: [],
    title: "",
    status: undefined,
    // subject_name: "",
  },
  homefunFeedbacks: [],
  hasPermissionOfHomefun: false,
  studyAssessmentList: [],
  studyAssessmentDetail: {},
  my_id: "teacherid_1",
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

type IQueryHomeFunAssessmentListParams = Parameters<typeof api.homeFunStudies.listHomeFunStudies>[0] & LoadingMetaPayload;
type IQueryHomeFunAssessmentListResult = AsyncReturnType<typeof api.homeFunStudies.listHomeFunStudies>;
export const actHomeFunAssessmentList = createAsyncThunk<IQueryHomeFunAssessmentListResult, IQueryHomeFunAssessmentListParams>(
  "homeFunStudies/actHomeFunAssessmentList",
  async ({ metaLoading, ...query }) => {
    const { items, total } = await api.homeFunStudies.listHomeFunStudies(query);
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

interface onLoadHomefunDetailResult {
  detail: EntityGetHomeFunStudyResult;
  feedbacks: EntityScheduleFeedbackView[];
  hasPermissionOfHomefun: boolean;
}
export const onLoadHomefunDetail = createAsyncThunk<onLoadHomefunDetailResult, { id: string } & LoadingMetaPayload>(
  "assessments/onLoadHomefunDetail",
  async ({ id }, { dispatch }) => {
    // if (true)
    //   return {
    //     detail: mockHomefunStudies as EntityGetHomeFunStudyResult,
    //     feedbacks: mockFeedbacks as EntityScheduleFeedbackView[],
    //     hasPermissionOfHomefun: true,
    //   };
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const myUserId = meInfo.me?.user_id ?? "";
    const detail = await api.homeFunStudies.getHomeFunStudy(id);
    const { schedule_id, student_id: user_id } = detail;
    const feedbacks = await api.schedulesFeedbacks.queryFeedback({ schedule_id, user_id });
    const hasPermissionOfHomefun =
      !!detail.teacher_ids?.includes(myUserId) && hasPermissionOfMe(PermissionType.edit_in_progress_assessment_439, meInfo.me);
    if (detail.assess_feedback_id && detail.assess_feedback_id !== feedbacks[0]?.id)
      dispatch(actInfo(d("We update to get this student's newest assignment, please assess again. ").t("assess_new_version_comment")));
    return { detail, feedbacks, hasPermissionOfHomefun };
  }
);

export type UpdateHomefunAction = AsyncThunkAction<string, UpdateHomefunParams, {}>;
export type UpdateHomefunParams = Omit<EntityAssessHomeFunStudyArgs, "assess_feedback_id" | "id"> & {
  id: string;
  onError: ExtendedRequestParams["onError"];
};
export const updateHomefun = createAsyncThunk<string, UpdateHomefunParams, { state: RootState }>(
  "assessments/updateHomefun",
  async ({ id, onError, ...params }, { dispatch, getState }) => {
    const {
      assessments: { homefunFeedbacks },
    } = getState();
    // const onError: ExtendedRequestParams["onError"] = (content) => dispatch(actAsyncConfirm({ content, hideCancel: true }));
    return api.homeFunStudies.assessHomeFunStudy(id, { ...params, assess_feedback_id: homefunFeedbacks[0]?.id }, {
      onError,
    } as ExtendedRequestParams);
  }
);

type IQueryStudyAssessmentListParams = Parameters<typeof api.studyAssessments.listStudyAssessments>[0] & LoadingMetaPayload;
type IQueryStudtAssessmentListResult = AsyncReturnType<typeof api.studyAssessments.listStudyAssessments>;
export const getStudyAssessmentList = createAsyncThunk<IQueryStudtAssessmentListResult, IQueryStudyAssessmentListParams>(
  "assessments/getStudyAssessmentList",
  async ({ metaLoading, ...query }) => {
    const { items, total } = await api.studyAssessments.listStudyAssessments({ ...query, page_size: 20 });
    return { items, total };
  }
);
type IQueryStudyAssessmentDetailResult = {
  detail: AsyncReturnType<typeof api.studyAssessments.getStudyAssessmentDetail>;
  my_id: string;
};
export const getStudyAssessmentDetail = createAsyncThunk<IQueryStudyAssessmentDetailResult, { id: string } & LoadingMetaPayload>(
  "assessments/getStudyAssessmentDetail",
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
    const detail = await api.studyAssessments.getStudyAssessmentDetail(id);
    return { detail, my_id };
  }
);

type IQueryUpdateStudyAssessmentParams = {
  id: Parameters<typeof api.studyAssessments.updateStudyAssessment>[0];
  data: Parameters<typeof api.studyAssessments.updateStudyAssessment>[1];
  filter_student_view_items?: IQueryStudyAssessmentDetailResult["detail"]["student_view_items"];
};

export const updateStudyAssessment = createAsyncThunk<string, IQueryUpdateStudyAssessmentParams>(
  "assessments/updateStudyAssessment",
  async ({ id, data }) => {
    await api.studyAssessments.updateStudyAssessment(id, data);
    return id;
  }
);

export const completeStudyAssessment = createAsyncThunk<string, IQueryUpdateStudyAssessmentParams>(
  "assessments/completeStudyAssessment",
  async ({ id, data, filter_student_view_items }, { dispatch }) => {
    const item =
      filter_student_view_items && filter_student_view_items.length
        ? filter_student_view_items.find((item) => item.lesson_materials?.some((m) => !m.attempted))
        : undefined;
    if (!item) {
      const content = d("You cannot change the assessment after clicking Complete.").t("assess_msg_cannot_delete");
      const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content, hideCancel: false })));
      if (!isConfirmed) return Promise.reject();
      const res = await api.studyAssessments.updateStudyAssessment(id, data);
      return res;
    }
    const content = d(
      "There are still students not start their Study activities. You cannot change the assessment after clicking Complete. "
    ).t("assess_popup_students_not_started");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content, hideCancel: false })));
    if (!isConfirmed) return Promise.reject();
    const res = await api.studyAssessments.updateStudyAssessment(id, data);
    return res;
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
    [actAssessmentList.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssessment>>) => {
      state.assessmentList = initialState.assessmentList;
      state.total = 0;
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
    [onLoadHomefunDetail.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadHomefunDetail>>) => {
      state.homefunDetail = cloneDeep(initialState.homefunDetail);
      state.homefunFeedbacks = cloneDeep(initialState.homefunFeedbacks);
      state.hasPermissionOfHomefun = false;
    },
    [onLoadHomefunDetail.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadHomefunDetail>>) => {
      state.homefunDetail = payload.detail;
      state.homefunFeedbacks = payload.feedbacks;
      state.hasPermissionOfHomefun = payload.hasPermissionOfHomefun;
    },
    [onLoadHomefunDetail.rejected.type]: (state, { error }: any) => {
      throw error;
    },
    [actHomeFunAssessmentList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof actHomeFunAssessmentList>>) => {
      state.homeFunAssessmentList = payload.items || [];
      state.total = payload.total || 0;
    },
    [actHomeFunAssessmentList.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssessment>>) => {
      state.homeFunAssessmentList = initialState.homeFunAssessmentList;
      state.total = 0;
    },
    [updateHomefun.rejected.type]: (state, { error }: any) => {
      console.error(error);
      throw error;
    },
    [getStudyAssessmentList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStudyAssessmentList>>) => {
      state.studyAssessmentList = payload.items || [];
      state.total = payload.total || 0;
    },
    [getStudyAssessmentList.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStudyAssessmentList>>) => {
      state.studyAssessmentList = initialState.studyAssessmentList;
      state.total = 0;
    },
    [getStudyAssessmentDetail.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStudyAssessmentDetail>>) => {
      state.studyAssessmentDetail = payload.detail;
      state.my_id = payload.my_id;
    },
    [getStudyAssessmentDetail.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStudyAssessmentDetail>>) => {
      state.studyAssessmentDetail = initialState.studyAssessmentDetail;
    },
  },
});

export default reducer;
