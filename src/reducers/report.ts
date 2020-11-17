import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api, { gqlapi } from "../api";
import {
  ClassesByTeacherDocument,
  ClassesByTeacherQuery,
  ClassesByTeacherQueryVariables,
  QeuryMeDocument,
  QeuryMeQuery,
  QeuryMeQueryVariables,
  TeachersByOrgnizationDocument,
  TeachersByOrgnizationQuery,
  TeachersByOrgnizationQueryVariables,
} from "../api/api-ko.auto";
import { EntityScheduleShortInfo, EntityStudentReportCategory, EntityStudentReportItem } from "../api/api.auto";
import { apiWaitForOrganizationOfPage } from "../api/extra";
import classListByTeacher from "../mocks/classListByTeacher.json";
import teacherListByOrg from "../mocks/teacherListByOrg.json";
import { ReportFilter, ReportOrderBy } from "../pages/ReportAchievementList/types";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";

const MOCK = false;
interface IreportState {
  reportList?: EntityStudentReportItem[];
  achievementDetail?: EntityStudentReportCategory[];
  // lessonPlanList: EntityScheduleShortInfo[];
  student_name: string | undefined;
  reportMockOptions: GetReportMockOptionsResponse;
}
const initialState: IreportState = {
  reportList: [],
  achievementDetail: [],
  student_name: "",
  reportMockOptions: {
    teacherList: {
      organization: {
        teachers: [],
      },
    },
    classList: {
      user: {
        classesTeaching: [],
      },
    },
    lessonPlanList: [],
    teacher_id: "",
    class_id: "",
    lesson_plan_id: "",
  },
};
export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

type OnloadReportPayload = Parameters<typeof api.reports.listStudentsReport>[0] & LoadingMetaPayload;
type OnloadReportReturn = AsyncReturnType<typeof api.reports.listStudentsReport>;
export const getAchievementList = createAsyncThunk<OnloadReportReturn, OnloadReportPayload>(
  "listStudentsReport",
  async ({ metaLoading, teacher_id, class_id, lesson_plan_id, status, sort_by }) => {
    return await api.reports.listStudentsReport({ teacher_id, class_id, lesson_plan_id, status, sort_by });
  }
);
interface GetAchievementDetailPayload extends LoadingMetaPayload {
  id: string;
  query: Parameters<typeof api.reports.getStudentDetailReport>[1];
}
export const getAchievementDetail = createAsyncThunk<
  AsyncReturnType<typeof api.reports.getStudentDetailReport>,
  GetAchievementDetailPayload
>("StudentsDetailReport", async ({ metaLoading, id, query }) => {
  return await api.reports.getStudentDetailReport(id, query);
});

export const getLessonPlan = createAsyncThunk<
  AsyncReturnType<typeof api.schedulesLessonPlans.getLessonPlans>,
  Parameters<typeof api.schedulesLessonPlans.getLessonPlans>[0]
>("getLessonPlan", async ({ teacher_id, class_id }) => {
  return await api.schedulesLessonPlans.getLessonPlans({ teacher_id, class_id });
});

export interface GetReportMockOptionsResponse {
  teacherList: TeachersByOrgnizationQuery;
  classList: ClassesByTeacherQuery;
  lessonPlanList: EntityScheduleShortInfo[];
  teacher_id: string;
  class_id: string;
  lesson_plan_id: string;
  reportList?: EntityStudentReportItem[];
}
interface GetReportMockOptionsPayLoad {
  teacher_id?: string;
  class_id?: string;
  lesson_plan_id?: string;
  view_my_report?: boolean;
  status?: ReportFilter;
  sort_by?: ReportOrderBy;
}

export const getReportMockOptions = createAsyncThunk<GetReportMockOptionsResponse, GetReportMockOptionsPayLoad & LoadingMetaPayload>(
  "getTeacherList",
  async ({ teacher_id, class_id }) => {
    // const organization_id = apiOrganizationOfPage() as string;
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    const { data } = await gqlapi.query<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>({
      query: TeachersByOrgnizationDocument,
      variables: {
        organization_id,
      },
    });
    const mockResult: TeachersByOrgnizationQuery = teacherListByOrg;
    const teacherList = MOCK ? mockResult : data;
    const user_id = (teacherList && teacherList.organization && teacherList.organization.teachers
      ? teacherList.organization?.teachers[0]?.user?.user_id
      : undefined) as string;
    const finalTearchId = teacher_id ? teacher_id : user_id ? user_id : "";
    const { data: result } = await gqlapi.query<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>({
      query: ClassesByTeacherDocument,
      variables: {
        user_id: finalTearchId,
      },
    });
    const mockClassResult: ClassesByTeacherQuery = classListByTeacher;
    const classList = MOCK ? mockClassResult : result;
    const firstClassId = (classList.user && classList.user.classesTeaching
      ? classList.user.classesTeaching[0]?.class_id
      : undefined) as string;
    const finalClassId = class_id ? class_id : firstClassId;
    const lessonPlanList = await api.schedulesLessonPlans.getLessonPlans({
      teacher_id: finalTearchId as string,
      class_id: finalClassId as string,
    });
    return {
      teacherList: teacherList ? teacherList : { organization: { teachers: [] } },
      classList: classList ? classList : { user: { classesTeaching: [] } },
      lessonPlanList: lessonPlanList ? lessonPlanList : [],
      teacher_id: finalTearchId,
      class_id: finalClassId,
      lesson_plan_id: lessonPlanList[0].id || "",
    };
  }
);

export const reportOnload = createAsyncThunk<GetReportMockOptionsResponse, GetReportMockOptionsPayLoad & LoadingMetaPayload>(
  "reportOnload",
  async ({ teacher_id, class_id, lesson_plan_id, view_my_report, status, sort_by }, { dispatch }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const myTearchId = meInfo.me?.user_id || "";
    // 拉去本组织的teacherList
    const { data } = await gqlapi.query<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>({
      query: TeachersByOrgnizationDocument,
      variables: {
        organization_id,
      },
    });
    const mockResult: TeachersByOrgnizationQuery = teacherListByOrg;
    const teacherList = MOCK ? mockResult : data;
    const user_id = (teacherList && teacherList.organization && teacherList.organization.teachers
      ? teacherList.organization?.teachers[0]?.user?.user_id
      : undefined) as string;
    const firstTearchId = teacher_id ? teacher_id : user_id ? user_id : "";

    const finalTearchId = view_my_report ? myTearchId : firstTearchId;
    // 用teacher_id 拉取classlist
    const { data: result } = await gqlapi.query<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>({
      query: ClassesByTeacherDocument,
      variables: {
        user_id: finalTearchId,
      },
    });
    const mockClassResult: ClassesByTeacherQuery = classListByTeacher;
    const classList = MOCK ? mockClassResult : result;
    const firstClassId = (classList.user && classList.user.classesTeaching
      ? classList.user.classesTeaching[0]?.class_id
      : undefined) as string;
    const finalClassId = class_id ? class_id : firstClassId;
    //
    const lessonPlanList = await api.schedulesLessonPlans.getLessonPlans({
      teacher_id: (finalTearchId as string) || "",
      class_id: (finalClassId as string) || "",
    });
    const finalPlanId = lesson_plan_id ? lesson_plan_id : lessonPlanList[0].id || "";
    // dispatch(getAchievementList({ metaLoading:true, teacher_id: finalTearchId, class_id: finalClassId, lesson_plan_id: finalPlanId, status , sort_by}))
    const items = await api.reports.listStudentsReport({
      teacher_id: finalTearchId,
      class_id: finalClassId,
      lesson_plan_id: finalPlanId as string,
      status,
      sort_by,
    });
    return {
      teacherList: teacherList || { organization: { teachers: [] } },
      classList: classList || { user: { classesTeaching: [] } },
      lessonPlanList: lessonPlanList,
      teacher_id: finalTearchId,
      class_id: finalClassId,
      lesson_plan_id: finalPlanId as string,
      reportList: items.items,
    };
  }
);

const { reducer } = createSlice({
  name: "report ",
  initialState,
  reducers: {},
  extraReducers: {
    [getAchievementList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAchievementList>>) => {
      state.reportList = payload.items;
    },
    [getAchievementList.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getAchievementList.pending.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.reportList = initialState.reportList;
    },
    [getLessonPlan.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLessonPlan>>) => {
      state.reportMockOptions.lessonPlanList = payload;
    },
    [getLessonPlan.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getAchievementDetail.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAchievementDetail>>) => {
      state.achievementDetail = payload.categories;
      state.student_name = payload.student_name;
    },
    [getAchievementDetail.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getAchievementDetail.pending.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.achievementDetail = initialState.achievementDetail;
    },
    [getReportMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getReportMockOptions>>) => {
      state.reportMockOptions = payload;
    },
    [getReportMockOptions.rejected.type]: (state, { error }: any) => {
      state.reportMockOptions.classList.user = { classesTeaching: [] };
      state.reportMockOptions.teacherList.organization = { teachers: [] };
      state.reportMockOptions.lessonPlanList = [];
    },
    [reportOnload.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof reportOnload>>) => {
      const { reportList, ...reportMockOptions } = payload;
      state.reportMockOptions = { ...reportMockOptions };
      state.reportList = reportList;
    },
    [reportOnload.pending.type]: (state) => {
      state.reportMockOptions.teacher_id = initialState.reportMockOptions.teacher_id;
      state.reportMockOptions.class_id = initialState.reportMockOptions.class_id;
      state.reportMockOptions.lesson_plan_id = initialState.reportMockOptions.lesson_plan_id;
    },
  },
});
export default reducer;
