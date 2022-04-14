import { cloneDeep } from "@apollo/client/utilities";
import { AssessmentTypeValues } from "@components/AssessmentType";
import { GetHomeFunAssessmentList } from "@pages/HomeFunAssessmentList/types";
import { AsyncThunkAction, createAsyncThunk, createSlice, PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import api, { ExtendedRequestParams, gqlapi } from "../api";
import { QueryMyUserDocument, QueryMyUserQuery, QueryMyUserQueryVariables } from "../api/api-ko.auto";
import { EntityScheduleFeedbackView, V2GetOfflineStudyUserResultDetailReply, V2OfflineStudyUserResultUpdateReq } from "../api/api.auto";
import PermissionType from "../api/PermissionType";
import {
  // AssessmentStatus,
  ListAssessmentRequest,
  ListAssessmentResult,
  ListAssessmentResultItem,
  OrderByAssessmentList,
  UpdateAssessmentRequestData
} from "../api/type";
import { d } from "../locale/LocaleManager";
import { ModelAssessment } from "../models/ModelAssessment";
import { AssessmentListResult, AssessmentStatus, AssessmentStatusValues, DetailAssessmentResult } from "../pages/ListAssessment/types";
import permissionCache from "../services/permissionCahceService";
import { actAsyncConfirm } from "./confirm";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { actInfo } from "./notify";
import { AsyncReturnType, AsyncTrunkReturned } from "./type";

export interface IAssessmentState {
  assessmentDetail: NonNullable<AsyncReturnType<typeof api.assessments.getAssessment>>;
  my_id?: string;
  total: ListAssessmentResult["total"];
  assessmentList: ListAssessmentResultItem[];
  homefunDetail: V2GetOfflineStudyUserResultDetailReply;
  homefunFeedbacks: EntityScheduleFeedbackView[];
  hasPermissionOfHomefun: boolean | undefined;
  homeFunAssessmentList: GetHomeFunAssessmentList;
  studyAssessmentList: NonNullable<AsyncReturnType<typeof api.studyAssessments.listStudyAssessments>["items"]>;
  studyAssessmentDetail: NonNullable<AsyncReturnType<typeof api.studyAssessments.getStudyAssessmentDetail>>;
  contentOutcomes?: UpdateAssessmentRequestData["content_outcomes"] /** https://calmisland.atlassian.net/browse/NKL-1199 **/;
  assessmentListV2: AssessmentListResult;
  assessmentDetailV2: DetailAssessmentResult;
  attachment_path: string;
  attachment_id: string;
}

interface RootState {
  assessments: IAssessmentState;
}

const initialState: IAssessmentState = {
  total: undefined,
  assessmentList: [],
  homeFunAssessmentList: [],
  assessmentDetail: {},
  homefunDetail: {
    assess_comment: "",
    feedback_id: "",
    assess_score: 3,
    complete_at: 0,
    due_at: 0,
    id: "",
    schedule_id: "",
    title: "",
    status: undefined,
    student: {},
    teachers: [],
    // subject_name: "",
  },
  homefunFeedbacks: [],
  hasPermissionOfHomefun: false,
  studyAssessmentList: [],
  studyAssessmentDetail: {},
  my_id: "",
  contentOutcomes: [],
  assessmentListV2: [],
  assessmentDetailV2: {},
  attachment_path: "",
  attachment_id: "",
};

type IQueryAssessmentListParams = ListAssessmentRequest & LoadingMetaPayload;
export const actAssessmentList = createAsyncThunk<ListAssessmentResult, IQueryAssessmentListParams>(
  "assessments/assessmentList",
  async ({ metaLoading, ...query }) => {
    const { items, total } = await api.assessments.listAssessment(query);
    return { items, total };
  }
);

type IQueryHomeFunAssessmentListParams = Parameters<typeof api.userOfflineStudy.queryUserOfflineStudy>[0] & LoadingMetaPayload;
type IQueryHomeFunAssessmentListResult = AsyncReturnType<typeof api.userOfflineStudy.queryUserOfflineStudy>;
export const actHomeFunAssessmentList = createAsyncThunk<IQueryHomeFunAssessmentListResult, IQueryHomeFunAssessmentListParams>(
  "homeFunStudies/actHomeFunAssessmentList",
  async ({ metaLoading, ...query }) => {
    const { item, total } = await api.userOfflineStudy.queryUserOfflineStudy(query);
    return { item, total };
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
    // 拉取我的user_id
    const {
      data: { myUser },
    } = await gqlapi.query<QueryMyUserQuery, QueryMyUserQueryVariables>({
      query: QueryMyUserDocument,
    });
    const my_id = myUser?.node?.id || "";
    const detail = await api.assessments.getAssessment(id);
    return { detail, my_id };
  }
);

interface onLoadHomefunDetailResult {
  detail: V2GetOfflineStudyUserResultDetailReply;
  feedbacks: EntityScheduleFeedbackView[];
  hasPermissionOfHomefun: boolean | undefined;
}
export const onLoadHomefunDetail = createAsyncThunk<onLoadHomefunDetailResult, { id: string } & LoadingMetaPayload>(
  "assessments/onLoadHomefunDetail",
  async ({ id }, { dispatch }) => {
    const {
      data: { myUser },
    } = await gqlapi.query<QueryMyUserQuery, QueryMyUserQueryVariables>({
      query: QueryMyUserDocument,
    });
    const myUserId = myUser?.node?.id || "";
    const detail = await api.userOfflineStudy.getUserOfflineStudyById(id);
    const { schedule_id, student } = detail;
    const user_id = student?.id;
    const feedbacks = await api.schedulesFeedbacks.queryFeedback({ schedule_id, user_id });

    const perm = await permissionCache.usePermission([PermissionType.edit_in_progress_assessment_439]);
    const teacher_ids = detail.teachers?.map((item) => item.id);
    const hasPermissionOfHomefun = !!teacher_ids?.includes(myUserId) && perm[PermissionType.edit_in_progress_assessment_439];
    if (detail.feedback_id && detail.feedback_id !== feedbacks[0]?.id)
      dispatch(actInfo(d("We update to get this student's newest assignment, please assess again.").t("assess_new_version_comment")));
    return { detail, feedbacks, hasPermissionOfHomefun };
  }
);

export type UpdateHomefunAction = AsyncThunkAction<string, UpdateHomefunParams, {}>;
export type UpdateHomefunParams = Omit<V2OfflineStudyUserResultUpdateReq, "assess_feedback_id" | "id"> & {
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
    // return api.homeFunStudies.assessHomeFunStudy(id, { ...params, assess_feedback_id: homefunFeedbacks[0]?.id }, {
    //   onError,
    // } as ExtendedRequestParams);
    return api.userOfflineStudy.updateUserOfflineStudy(id, { ...params, assess_feedback_id: homefunFeedbacks[0]?.id }, {
      onError,
    } as ExtendedRequestParams);
  }
);
type IQueryAssessmentV2Params = Parameters<typeof api.assessmentsV2.queryAssessmentV2>[0] & LoadingMetaPayload;
type IQueryAssessmentV2Result = AsyncReturnType<typeof api.assessmentsV2.queryAssessmentV2>;
export const getAssessmentListV2 = createAsyncThunk<IQueryAssessmentV2Result, IQueryAssessmentV2Params>(
  "assessments/getAssessmentListV2",
  async ({ metaLoading, ...query }) => {
    const { status, assessment_type, order_by } = query;
    const isStudy = assessment_type === AssessmentTypeValues.study;
    const isReview = assessment_type === AssessmentTypeValues.review;
    const isHomefun = assessment_type === AssessmentTypeValues.homeFun;
    let _status: string = "";
    let _order_by: IQueryAssessmentV2Params["order_by"];
    if (isStudy || isReview || isHomefun) {
      _order_by = order_by ? order_by : OrderByAssessmentList._create_at;
      _status =
        status === AssessmentStatus.all
          ? AssessmentStatusValues.study_all
          : status === AssessmentStatus.in_progress
          ? AssessmentStatusValues.study_inprogress
          : AssessmentStatusValues.complete;
    } else {
      _order_by = order_by ? order_by : OrderByAssessmentList._class_end_time;
      _status =
        status === AssessmentStatus.all
          ? AssessmentStatusValues.class_live_homefun_all
          : status === AssessmentStatus.in_progress
          ? AssessmentStatusValues.class_live_homefun_inprogress
          : AssessmentStatusValues.complete;
    }
    const _query = { ...query, status: _status, order_by: _order_by };
    const { assessments, total } = await api.assessmentsV2.queryAssessmentV2({ ..._query, page_size: 20 });
    return { assessments, total };
  }
);
type IQueryDetailAssessmentResult = {
  detail: AsyncReturnType<typeof api.assessmentsV2.getAssessmentDetailV2>;
  my_id: string;
};
export const getDetailAssessmentV2 = createAsyncThunk<IQueryDetailAssessmentResult, { id: string } & LoadingMetaPayload>(
  "assessments/getDetailAssessmentV2",
  async ({ id }) => {
    // 拉取我的user_id
    const {
      data: { myUser },
    } = await gqlapi.query<QueryMyUserQuery, QueryMyUserQueryVariables>({
      query: QueryMyUserDocument,
    });
    const my_id = myUser?.node?.id || "";
    const detail = await api.assessmentsV2.getAssessmentDetailV2(id);
    return { detail, my_id };
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
    const {
      data: { myUser },
    } = await gqlapi.query<QueryMyUserQuery, QueryMyUserQueryVariables>({
      query: QueryMyUserDocument,
    });
    const my_id = myUser?.node?.id || "";
    const detail = await api.studyAssessments.getStudyAssessmentDetail(id);
    return { detail, my_id };
  }
);

type IQueryUpdateAssessmentParams = {
  id: Parameters<typeof api.assessmentsV2.updateAssessmentV2>[0];
  data: Parameters<typeof api.assessmentsV2.updateAssessmentV2>[1];
};
export const updateAssessmentV2 = createAsyncThunk<string, IQueryUpdateAssessmentParams>(
  "assessments/updateAssessment",
  async ({ id, data }) => {
    await api.assessmentsV2.updateAssessmentV2(id, data);
    return id;
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
    let hasNotAttempt = false;
    filter_student_view_items?.forEach((item) => {
      const { all, attempt } = ModelAssessment.toGetCompleteRate([item]);
      if (all && attempt === 0) {
        if (!hasNotAttempt) {
          hasNotAttempt = true;
        }
      }
    });
    if (!hasNotAttempt) {
      const content = d("You cannot change the assessment after clicking Complete.").t("assess_msg_cannot_delete");
      const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content, hideCancel: false })));
      if (!isConfirmed) return Promise.reject();
      const res = await api.studyAssessments.updateStudyAssessment(id, data);
      return res;
    }
    const content = d(
      "There are still students who have not started the Study activities. You cannot change the assessment after Clicking complete!"
    ).t("assess_popup_students_not_started");
    const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content, hideCancel: false })));
    if (!isConfirmed) return Promise.reject();
    const res = await api.studyAssessments.updateStudyAssessment(id, data);
    return res;
  }
);
type IGetContentsResourseParams = Parameters<typeof api.contentsResources.getContentResourceUploadPath>[0];
type IGetContentsResourseResult = AsyncReturnType<typeof api.contentsResources.getContentResourceUploadPath>;
export const getContentResourceUploadPath = createAsyncThunk<IGetContentsResourseResult, IGetContentsResourseParams>(
  "content/getContentResourceUploadPath",
  (query) => {
    return api.contentsResources.getContentResourceUploadPath(query);
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
      state.total = initialState.total;
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
      state.homeFunAssessmentList = payload.item || [];
      state.total = payload.total || 0;
    },
    [actHomeFunAssessmentList.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssessment>>) => {
      state.homeFunAssessmentList = initialState.homeFunAssessmentList;
      state.total = initialState.total;
    },
    [getDetailAssessmentV2.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getDetailAssessmentV2>>) => {
      state.assessmentDetailV2 = payload.detail;
      
      state.my_id = payload.my_id;
    },
    [getDetailAssessmentV2.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getDetailAssessmentV2>>) => {
      state.assessmentDetailV2 = initialState.assessmentDetailV2;
      state.my_id = initialState.my_id;
    },
    [getAssessmentListV2.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssessmentListV2>>) => {
      state.assessmentListV2 = payload.assessments ?? [];
      state.total = payload.total;
    },
    [getAssessmentListV2.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssessmentListV2>>) => {
      state.assessmentListV2 = initialState.assessmentListV2;
      state.total = initialState.total;
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
      state.total = initialState.total;
    },
    [getStudyAssessmentDetail.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStudyAssessmentDetail>>) => {
      state.studyAssessmentDetail = payload.detail;
      state.my_id = payload.my_id;
    },
    [getStudyAssessmentDetail.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStudyAssessmentDetail>>) => {
      state.studyAssessmentDetail = initialState.studyAssessmentDetail;
    },
    [getContentResourceUploadPath.fulfilled.type]: (state, { payload }: any) => {
      state.attachment_path = payload.path;
      state.attachment_id = payload.resource_id;
    },
  },
});

export default reducer;
