import { cloneDeep } from "@apollo/client/utilities";
import { AsyncThunk, AsyncThunkAction, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api, { ExtendedRequestParams, gqlapi } from "../api";
import { QeuryMeDocument, QeuryMeQuery, QeuryMeQueryVariables } from "../api/api-ko.auto";
import {
  EntityAssessHomeFunStudyArgs,
  EntityGetHomeFunStudyResult,
  EntityListHomeFunStudiesResultItem,
  EntityScheduleFeedbackView
} from "../api/api.auto";
import { apiWaitForOrganizationOfPage } from "../api/extra";
import { ListAssessmentRequest, ListAssessmentResult, ListAssessmentResultItem } from "../api/type";
import { hasPermissionOfMe, PermissionType } from "../components/Permission";
import { d } from "../locale/LocaleManager";
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
  studyAssessmentList: NonNullable<AsyncReturnType<typeof api.h5PAssessments.listH5PAssessments>["items"]>;
  studyAssessmentDetail: NonNullable<AsyncReturnType<typeof api.h5PAssessments.getH5PAssessmentDetail>>;
}

interface RootState {
  assessments: IAssessmentState;
}

const initialState: IAssessmentState = {
  total: 0,
  assessmentList: [],
  homeFunAssessmentList: [],
  assessmentDetail: {
    id: "",
    title: "",
    students: [],
    subjects: [],
    teachers: [],
    class_end_time: 0,
    class_length: 0,
    // number_of_activities: 0,
    // number_of_outcomes: 0,
    complete_time: 0,
    outcome_attendances: [],
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
  studyAssessmentDetail: {
    class_name: "Class Name",
    complete_at: new Date().getTime()/1000,
    complete_rate: 80,
    due_at: new Date().getTime()/1000,
    id: "3929939393992932",
    lesson_materials: [
      {
        checked: true,
        comment: "material-comment-1",
        id: "material-id-1",
        name: "material-name-1",
      }
    ],
    lesson_plan: {
      checked: true,
      comment: "123",
      id: "plan1",
      name: "planname---1",
    },
    remaining_time: 90,
    schedule_id: "scheduleid",
    status: "in_progress",
    student_view_items: [
      {
        comment: "comment comment comment",
        lesson_materials: [
          {
            achieved_score: 90,
            answer: "answer",
            lesson_material_id: "material-id-1",
            lesson_material_name: "material-name-1",
            lesson_material_type: "",
            max_score: 100,
          }
        ],
        student_id: "student1id",
        student_name: "student1name",
      }
    ],
    students: [
      {
        checked: true,
        id: "studentid---1",
        name: "studentname---1",
      },
      {
        checked: true,
        id: "studentid---2",
        name: "studentname---2",
      },
      {
        checked: true,
        id: "studentid---3",
        name: "studentname---3",
      }
    ],
    teacher_names: ["teacher1", "teacher2", "teacher3"],
    title: "study assessment detail",
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

type IQueryStudyAssessmentListParams = Parameters<typeof api.h5PAssessments.listH5PAssessments>[0] & LoadingMetaPayload;
type IQueryStudtAssessmentListResult = AsyncReturnType<typeof api.h5PAssessments.listH5PAssessments>;
export const getStudyAssessmentList = createAsyncThunk<IQueryStudtAssessmentListResult, IQueryStudyAssessmentListParams>(
  "assessments/getStudyAssessmentList",
  async ({ metaLoading, ...query }) => {
    const { items, total } = await api.h5PAssessments.listH5PAssessments(query);
    return { items, total };
  }
);

type IQueryStudyAssessmentDetailResult = AsyncReturnType<typeof api.h5PAssessments.getH5PAssessmentDetail>;
export const getStudyAssessmentDetail = createAsyncThunk<IQueryStudyAssessmentDetailResult, { id: string } & LoadingMetaPayload>(
  "assessments/getStudyAssessmentDetail",
  async ({ id }) => {
    const studyAssessmentDetail = await api.h5PAssessments.getH5PAssessmentDetail(id);
    return studyAssessmentDetail;
  }
);

type IQueryUpdateStudyAssessmentParams = {
  id: Parameters<typeof api.h5PAssessments.updateH5PAssessment>[0];
  data: Parameters<typeof api.h5PAssessments.updateH5PAssessment>[1];
};

export const updateStudyAssessment = createAsyncThunk<string, IQueryUpdateStudyAssessmentParams>(
  "assessments/updateStudyAssessment",
  async ({ id, data }) => {
    await api.h5PAssessments.updateH5PAssessment(id, data);
    return id;
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
      state.studyAssessmentDetail = payload;
    },
    [getStudyAssessmentDetail.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStudyAssessmentDetail>>) => {
      state.studyAssessmentDetail = initialState.studyAssessmentDetail;
    },
  },
});

export default reducer;
