import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import api, { gqlapi } from "../api";
import { User } from "../api/api-ko-schema.auto";
import {
  ClassesByTeacherDocument,
  ClassesByTeacherQuery,
  ClassesByTeacherQueryVariables,
  QeuryMeDocument,
  QeuryMeQuery,
  QeuryMeQueryVariables,
  RoleBasedUsersByOrgnizationDocument,
  RoleBasedUsersByOrgnizationQuery,
  RoleBasedUsersByOrgnizationQueryVariables,
  TeachersByOrgnizationDocument,
  TeachersByOrgnizationQuery,
  TeachersByOrgnizationQueryVariables,
} from "../api/api-ko.auto";
import {
  EntityScheduleShortInfo,
  EntityStudentReportCategory,
  EntityStudentReportItem,
  EntityTeacherReportCategory,
} from "../api/api.auto";
import { apiWaitForOrganizationOfPage } from "../api/extra";
import { hasPermissionOfMe, PermissionType } from "../components/Permission";
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
  categoriesPage: {
    teacherList: Pick<User, "user_id" | "user_name">[];
    categories: EntityTeacherReportCategory[];
  };
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
  categoriesPage: {
    teacherList: [],
    categories: [],
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
  query: Parameters<typeof api.reports.getStudentReport>[1];
}

export const getAchievementDetail = createAsyncThunk<AsyncReturnType<typeof api.reports.getStudentReport>, GetAchievementDetailPayload>(
  "StudentsDetailReport",
  async ({ metaLoading, id, query }) => {
    return await api.reports.getStudentReport(id, query);
  }
);

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
  async ({ teacher_id, class_id, lesson_plan_id, view_my_report, status, sort_by }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    let reportList: EntityStudentReportItem[] = [];
    let lessonPlanList: EntityScheduleShortInfo[] = [];
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const myTearchId = meInfo.me?.user_id || "";
    // 拉取本组织的teacherList
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
    //获取plan_id
    if (finalTearchId && finalClassId) {
      const data = await api.schedulesLessonPlans.getLessonPlans({
        teacher_id: (finalTearchId as string) || "",
        class_id: (finalClassId as string) || "",
      });
      lessonPlanList = data || [];
    }
    const finalPlanId = lesson_plan_id ? lesson_plan_id : lessonPlanList[0]?.id || "";
    if (finalPlanId) {
      const items = await api.reports.listStudentsReport({
        teacher_id: finalTearchId,
        class_id: finalClassId,
        lesson_plan_id: finalPlanId as string,
        status,
        sort_by,
      });
      reportList = items.items || [];
    }
    return {
      teacherList: teacherList || { organization: { teachers: [] } },
      classList: classList || { user: { classesTeaching: [] } },
      lessonPlanList: lessonPlanList,
      teacher_id: finalTearchId,
      class_id: finalClassId,
      lesson_plan_id: finalPlanId as string,
      reportList,
    };
  }
);

interface ReportCategoriesPayLoadProps {
  teacher_id?: string;
}
interface ReportCategoriesPayLoadResult {
  teacherList: Pick<User, "user_id" | "user_name">[];
  categories: EntityTeacherReportCategory[];
}
export const reportCategoriesOnload = createAsyncThunk<ReportCategoriesPayLoadResult, ReportCategoriesPayLoadProps & LoadingMetaPayload>(
  "report/reportCategoriesOnload",
  async ({ teacher_id }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const perm = hasPermissionOfMe([PermissionType.view_my_reports_614, PermissionType.view_reports_610], meInfo.me);
    const my_id = meInfo?.me?.user_id;
    if (perm.view_reports_610) {
      // 拉取本组织的teacherList
      const { data: teachersInfo } = await gqlapi.query<RoleBasedUsersByOrgnizationQuery, RoleBasedUsersByOrgnizationQueryVariables>({
        query: RoleBasedUsersByOrgnizationDocument,
        variables: {
          organization_id,
        },
      });
      // const teacherList = teachersInfo.organization?.teachers?.map((item) => item?.user as Pick<User, "user_id" | "user_name">);
      const teacherList = teachersInfo.organization?.roles
        ?.find((role) => role?.role_name?.toLocaleLowerCase() === "teacher")
        ?.memberships?.map((membership) => membership?.user as Pick<User, "user_id" | "user_name">);
      debugger;
      // teacherList 不存在，不需要拉取 categories
      if (!teacherList || !teacherList[0]) return { teacherList: [], categories: [] };
      // 如果 teacher_id 就直接使用，不然就用列表第一项
      const { categories = [] } = await api.reports.getTeacherReport(teacher_id || teacherList[0]?.user_id);
      return { teacherList, categories };
    }
    if (!my_id) return { teacherList: [], categories: [] };
    if (perm.view_my_reports_614) {
      const { categories = [] } = await api.reports.getTeacherReport(my_id);
      return { teacherList: [], categories };
    }
    return { teacherList: [], categories: [] };
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
      state.reportMockOptions = cloneDeep(initialState.reportMockOptions);
    },
    [reportCategoriesOnload.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof reportCategoriesOnload>>) => {
      state.categoriesPage = payload;
    },
    [reportCategoriesOnload.pending.type]: (state) => {
      state.categoriesPage = cloneDeep(initialState.categoriesPage);
    },
  },
});
export default reducer;
