import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import api, { gqlapi } from "../api";
import { User } from "../api/api-ko-schema.auto";
import {
  ClassesByTeacherDocument,
  ClassesByTeacherQuery,
  ClassesByTeacherQueryVariables,
  GetSchoolTeacherDocument,
  GetSchoolTeacherQuery,
  GetSchoolTeacherQueryVariables,
  ParticipantsByClassDocument,
  ParticipantsByClassQuery,
  ParticipantsByClassQueryVariables,
  QeuryMeDocument,
  QeuryMeQuery,
  QeuryMeQueryVariables,
  TeacherByOrgIdDocument,
  TeacherByOrgIdQuery,
  TeacherByOrgIdQueryVariables,
} from "../api/api-ko.auto";
import {
  EntityScheduleShortInfo,
  EntityStudentAchievementReportCategoryItem,
  EntityStudentAchievementReportItem,
  EntityStudentPerformanceH5PReportItem,
  EntityStudentPerformanceReportItem,
  EntityStudentsPerformanceH5PReportItem,
  EntityTeacherReportCategory,
} from "../api/api.auto";
import { apiWaitForOrganizationOfPage } from "../api/extra";
import { hasPermissionOfMe, PermissionType } from "../components/Permission";
import classListByTeacher from "../mocks/classListByTeacher.json";
import stuPerformanceDetail from "../mocks/stuPerformanceDetail.json";
import stuPerformanceH5pDetail from "../mocks/stuPerformanceH5pDetail.json";
import stuPerformanceH5pList from "../mocks/stuPerformanceH5pList.json";
import stuPerformaceList from "../mocks/stuPerformanceList.json";
import { ModelReport } from "../models/ModelReports";
import { ALL_STUDENT, ReportFilter, ReportOrderBy } from "../pages/ReportAchievementList/types";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { getScheduleParticipantsMockOptionsResponse, getScheduleParticipantsPayLoad } from "./schedule";

const MOCK = false;
interface IreportState {
  reportList?: EntityStudentAchievementReportItem[];
  achievementDetail?: EntityStudentAchievementReportCategoryItem[];
  lessonPlanList: EntityScheduleShortInfo[];
  student_name: string | undefined;
  reportMockOptions: GetReportMockOptionsResponse;
  categoriesPage: {
    teacherList: Pick<User, "user_id" | "user_name">[];
    categories: EntityTeacherReportCategory[];
  };
  stuReportMockOptions: GetStuReportMockOptionsResponse;
  h5pReportList?: EntityStudentsPerformanceH5PReportItem[];
  stuReportList?: EntityStudentPerformanceReportItem[];
  stuReportDetail?: EntityStudentPerformanceReportItem[];
  h5pReportDetail?: EntityStudentPerformanceH5PReportItem[];
  studentList: Pick<User, "user_id" | "user_name">[];
}
const initialState: IreportState = {
  reportList: [],
  achievementDetail: [],
  student_name: "",
  reportMockOptions: {
    teacherList: [],
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
  stuReportMockOptions: {
    teacherList: [],
    classList: {
      user: {
        classesTeaching: [],
      },
    },
    lessonPlanList: [],
    teacher_id: "",
    class_id: "",
    lesson_plan_id: "",
    student_id: "",
    studentList: [],
  },
  h5pReportList: [],
  stuReportList: [],
  stuReportDetail: [],
  h5pReportDetail: [],
  lessonPlanList: [],
  studentList: [],
};

export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

type OnloadReportPayload = Parameters<typeof api.reports.listStudentsAchievementReport>[0] & LoadingMetaPayload;
type OnloadReportReturn = AsyncReturnType<typeof api.reports.listStudentsAchievementReport>;
export const getAchievementList = createAsyncThunk<OnloadReportReturn, OnloadReportPayload>(
  "listStudentsAchievementReport",
  async ({ metaLoading, teacher_id, class_id, lesson_plan_id, status, sort_by }) => {
    return await api.reports.listStudentsAchievementReport({ teacher_id, class_id, lesson_plan_id, status, sort_by });
  }
);
interface GetAchievementDetailPayload extends LoadingMetaPayload {
  id: string;
  query: Parameters<typeof api.reports.getStudentAchievementReport>[1];
}

export const getAchievementDetail = createAsyncThunk<
  AsyncReturnType<typeof api.reports.getStudentAchievementReport>,
  GetAchievementDetailPayload
>("StudentsDetailReport", async ({ metaLoading, id, query }) => {
  return await api.reports.getStudentAchievementReport(id, query);
});

type aa = AsyncReturnType<typeof api.schedulesLessonPlans.getLessonPlans>;
export const getLessonPlan = createAsyncThunk<
  AsyncReturnType<typeof api.schedulesLessonPlans.getLessonPlans>,
  Parameters<typeof api.schedulesLessonPlans.getLessonPlans>[0] & LoadingMetaPayload
>("getLessonPlan", async ({ metaLoading, teacher_id, class_id }) => {
  return await api.schedulesLessonPlans.getLessonPlans({ teacher_id, class_id });
});

export const getClassList = createAsyncThunk<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>("getClassList", async ({ user_id }) => {
  const { data } = await gqlapi.query<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>({
    query: ClassesByTeacherDocument,
    variables: {
      user_id,
    },
  });
  return data;
});

// 拉取当前组织下的teacherList
export interface getTeacherListByOrgIdResponse {
  teacherList: Pick<User, "user_id" | "user_name">[];
}
export const getTeacherListByOrgId = createAsyncThunk<getTeacherListByOrgIdResponse, string>(
  "getTeacherListByOrgId",
  async (organization_id: string) => {
    const { data } = await gqlapi.query<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>({
      query: TeacherByOrgIdDocument,
      variables: {
        organization_id,
      },
    });
    let teacherList: Pick<User, "user_id" | "user_name">[] = [];
    data.organization?.classes?.forEach((classItem) => {
      teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]);
    });
    teacherList = ModelReport.teacherListSetDiff(teacherList);
    return { teacherList };
  }
);

export interface GetReportMockOptionsResponse {
  teacherList: Pick<User, "user_id" | "user_name">[];
  classList: ClassesByTeacherQuery;
  lessonPlanList: EntityScheduleShortInfo[];
  teacher_id: string;
  class_id: string;
  lesson_plan_id: string;
  reportList?: EntityStudentAchievementReportItem[];
}
interface GetReportMockOptionsPayLoad {
  teacher_id?: string;
  class_id?: string;
  lesson_plan_id?: string;
  view_my_report?: boolean;
  status?: ReportFilter;
  sort_by?: ReportOrderBy;
}

export const reportOnload = createAsyncThunk<GetReportMockOptionsResponse, GetReportMockOptionsPayLoad & LoadingMetaPayload>(
  "reportOnload",
  async ({ teacher_id, class_id, lesson_plan_id, view_my_report, status, sort_by }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    let reportList: EntityStudentAchievementReportItem[] = [];
    let lessonPlanList: EntityScheduleShortInfo[] = [];
    let teacherList: Pick<User, "user_id" | "user_name">[] | undefined = [];
    let finalTearchId: string = "";
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const myTearchId = meInfo.me?.user_id || "";
    const perm = hasPermissionOfMe(
      [
        PermissionType.view_my_reports_614,
        PermissionType.view_reports_610,
        PermissionType.view_my_organizations_reports_612,
        PermissionType.view_my_school_reports_611,
      ],
      meInfo.me
    );
    if (perm.view_my_reports_614 && !perm.view_reports_610 && !perm.view_my_school_reports_611 && !perm.view_my_organization_reports_612) {
      teacherList = [];
      finalTearchId = myTearchId;
    } else {
      if (perm.view_my_organization_reports_612 || perm.view_reports_610) {
        const { data } = await gqlapi.query<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>({
          query: TeacherByOrgIdDocument,
          variables: {
            organization_id,
          },
        });
        data.organization?.classes?.forEach((classItem) => {
          teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]);
        });
      }
      if (perm.view_my_school_reports_611 || perm.view_reports_610) {
        const { data } = await gqlapi.query<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>({
          query: GetSchoolTeacherDocument,
          variables: {
            user_id: myTearchId,
          },
        });
        data.user?.school_memberships
          ?.filter((schoolItem) => schoolItem?.school?.organization?.organization_id === organization_id)
          .map((schoolItem) =>
            schoolItem?.school?.classes?.forEach(
              (classItem) => (teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]))
            )
          );
      }
      teacherList = ModelReport.teacherListSetDiff(teacherList);
      finalTearchId = teacher_id || (teacherList && teacherList[0]?.user_id) || "";
      if (!teacherList || !teacherList[0])
        return {
          teacherList: [],
          classList: { user: { classesTeaching: [] } },
          lessonPlanList: [],
          teacher_id: "",
          class_id: "",
          lesson_plan_id: "",
        };
    }

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
      const items = await api.reports.listStudentsAchievementReport({
        teacher_id: finalTearchId,
        class_id: finalClassId,
        lesson_plan_id: finalPlanId as string,
        status,
        sort_by,
      });
      reportList = items.items || [];
    }
    return {
      teacherList,
      classList: classList || { user: { classesTeaching: [] } },
      lessonPlanList: lessonPlanList,
      teacher_id: finalTearchId,
      class_id: finalClassId || "",
      lesson_plan_id: finalPlanId || "",
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
    const perm = hasPermissionOfMe(
      [
        PermissionType.view_my_reports_614,
        PermissionType.view_reports_610,
        PermissionType.view_my_school_reports_611,
        PermissionType.view_my_organizations_reports_612,
      ],
      meInfo.me
    );
    const my_id = meInfo?.me?.user_id || "";

    if (perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organization_reports_612) {
      // 通过roles拉取本组织的teacherList
      // const { data: teachersInfo } = await gqlapi.query<RoleBasedUsersByOrgnizationQuery, RoleBasedUsersByOrgnizationQueryVariables>({
      //   query: RoleBasedUsersByOrgnizationDocument,
      //   variables: {
      //     organization_id,
      //   },
      // });
      // const teacherList = teachersInfo.organization?.roles
      //   ?.find((role) => role?.role_name?.toLocaleLowerCase() === "teacher")
      //   ?.memberships?.map((membership) => membership?.user as Pick<User, "user_id" | "user_name">);

      let teacherList: Pick<User, "user_id" | "user_name">[] = [];
      if (perm.view_my_organization_reports_612 || perm.view_reports_610) {
        const { data } = await gqlapi.query<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>({
          query: TeacherByOrgIdDocument,
          variables: {
            organization_id,
          },
        });
        data.organization?.classes?.forEach((classItem) => {
          teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]);
        });
      }
      if (perm.view_my_school_reports_611 || perm.view_reports_610) {
        const { data } = await gqlapi.query<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>({
          query: GetSchoolTeacherDocument,
          variables: {
            user_id: my_id,
          },
        });
        data.user?.school_memberships
          ?.filter((schoolItem) => schoolItem?.school?.organization?.organization_id === organization_id)
          .map((schoolItem) =>
            schoolItem?.school?.classes?.forEach(
              (classItem) => (teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]))
            )
          );
      }
      teacherList = ModelReport.teacherListSetDiff(teacherList);
      // teacherList 不存在，不需要拉取 categories
      if (!teacherList || !teacherList[0]) return { teacherList: [], categories: [] };
      // 如果 teacher_id 就直接使用，不然就用列表第一项
      const { categories } = { ...(await api.reports.getTeacherReport(teacher_id || teacherList[0]?.user_id)) };
      return { teacherList, categories: categories ?? [] };
    }

    if (perm.view_my_reports_614) {
      if (!my_id) return { teacherList: [], categories: [] };
      const { categories } = { ...(await api.reports.getTeacherReport(my_id)) };
      return { teacherList: [], categories: categories ?? [] };
    }
    return { teacherList: [], categories: [] };
  }
);

interface GetStuReportListResponse {
  stuReportList?: EntityStudentPerformanceReportItem[];
  h5pReportList?: EntityStudentsPerformanceH5PReportItem[];
}
interface GetStuReportListPayload {
  teacher_id: string;
  class_id: string;
  lesson_plan_id: string;
}
export const getStuReportList = createAsyncThunk<GetStuReportListResponse, GetStuReportListPayload & LoadingMetaPayload>(
  "getStuReportList",
  async ({ teacher_id, class_id, lesson_plan_id }) => {
    const stuItems = await api.reports.listStudentsPerformanceReport({ teacher_id, class_id, lesson_plan_id });
    const h5pItems = await api.reports.listStudentsAchievementReport({ teacher_id, class_id, lesson_plan_id });
    return { stuReportList: stuItems.items, h5pReportList: h5pItems.items };
  }
);

interface GetStuReportDetailResponse {
  stuReportDetail?: EntityStudentPerformanceReportItem[];
  h5pReportDetail?: EntityStudentPerformanceH5PReportItem[];
}
interface GetStuReportDetailPayload {
  teacher_id: string;
  class_id: string;
  lesson_plan_id: string;
  id: string;
}
export const getStuReportDetail = createAsyncThunk<GetStuReportDetailResponse, GetStuReportDetailPayload & LoadingMetaPayload>(
  "getStuReportDetail",
  async ({ teacher_id, class_id, lesson_plan_id, id }) => {
    const stuItems = await api.reports.getStudentPerformanceReport(id, { teacher_id, class_id, lesson_plan_id });
    const h5pItems = await api.reports.getStudentPerformanceH5PReport(id, { teacher_id, class_id, lesson_plan_id });
    return { stuReportDetail: stuItems.items, h5pReportDetail: h5pItems.items };
  }
);

export interface GetStuReportMockOptionsResponse {
  teacherList: Pick<User, "user_id" | "user_name">[];
  classList: ClassesByTeacherQuery;
  lessonPlanList: EntityScheduleShortInfo[];
  teacher_id: string;
  class_id: string;
  lesson_plan_id: string;
  student_id?: string;
  reportList?: EntityStudentAchievementReportItem[];
  studentList?: Pick<User, "user_id" | "user_name">[];
  h5pReportList?: EntityStudentsPerformanceH5PReportItem[];
  stuReportList?: EntityStudentPerformanceReportItem[];
  stuReportDetail?: EntityStudentPerformanceReportItem[];
  h5pReportDetail?: EntityStudentPerformanceH5PReportItem[];
}
interface GetStuReportMockOptionsPayLoad {
  teacher_id?: string;
  class_id?: string;
  lesson_plan_id?: string;
  view_my_report?: boolean;
  status?: ReportFilter;
  sort_by?: ReportOrderBy;
  student_id: string;
}

export const stuPerformanceReportOnload = createAsyncThunk<
  GetStuReportMockOptionsResponse,
  GetStuReportMockOptionsPayLoad & LoadingMetaPayload
>("stuPerformanceReportOnload", async ({ teacher_id, class_id, lesson_plan_id, student_id }) => {
  const organization_id = (await apiWaitForOrganizationOfPage()) as string;
  let reportList: EntityStudentAchievementReportItem[] = [];
  let lessonPlanList: EntityScheduleShortInfo[] = [];
  let teacherList: Pick<User, "user_id" | "user_name">[] | undefined = [];
  let finalTearchId: string = "";
  let studentList: Pick<User, "user_id" | "user_name">[] | undefined = [];
  let h5pReportList: EntityStudentsPerformanceH5PReportItem[] = [];
  let stuReportList: EntityStudentPerformanceReportItem[] = [];
  let stuReportDetail: EntityStudentPerformanceReportItem[] = [];
  let h5pReportDetail: EntityStudentPerformanceH5PReportItem[] = [];
  // 拉取我的user_id
  const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
    query: QeuryMeDocument,
    variables: {
      organization_id,
    },
  });
  const myTearchId = meInfo.me?.user_id || "";
  const perm = hasPermissionOfMe(
    [
      PermissionType.view_my_reports_614,
      PermissionType.view_reports_610,
      PermissionType.view_my_organizations_reports_612,
      PermissionType.view_my_school_reports_611,
    ],
    meInfo.me
  );
  if (perm.view_my_reports_614 && !perm.view_reports_610 && !perm.view_my_school_reports_611 && !perm.view_my_organization_reports_612) {
    teacherList = [];
    finalTearchId = myTearchId;
  } else {
    if (perm.view_my_organization_reports_612 || perm.view_reports_610) {
      const { data } = await gqlapi.query<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>({
        query: TeacherByOrgIdDocument,
        variables: {
          organization_id,
        },
      });
      data.organization?.classes?.forEach((classItem) => {
        teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]);
      });
    }
    if (perm.view_my_school_reports_611 || perm.view_reports_610) {
      const { data } = await gqlapi.query<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>({
        query: GetSchoolTeacherDocument,
        variables: {
          user_id: myTearchId,
        },
      });
      data.user?.school_memberships
        ?.filter((schoolItem) => schoolItem?.school?.organization?.organization_id === organization_id)
        .map((schoolItem) =>
          schoolItem?.school?.classes?.forEach(
            (classItem) => (teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]))
          )
        );
    }
    teacherList = ModelReport.teacherListSetDiff(teacherList);
    finalTearchId = teacher_id || (teacherList && teacherList[0]?.user_id) || "";
    if (!teacherList || !teacherList[0])
      return {
        teacherList: [],
        classList: { user: { classesTeaching: [] } },
        lessonPlanList: [],
        teacher_id: "",
        class_id: "",
        lesson_plan_id: "",
        student_id,
      };
  }
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
  // 用finalClassId 拉取studetlist
  if (finalTearchId && finalClassId) {
    const { data } = await gqlapi.query<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>({
      query: ParticipantsByClassDocument,
      variables: { class_id: finalClassId },
    });
    // const all: Pick<User, "user_id" | "user_name">[] = [{ user_id: ALL_STUDENT, user_name: d("All").t("report_label_all") }];
    // studentList = [...all];
    studentList = studentList.concat(data.class?.students as Pick<User, "user_id" | "user_name">[]) || [];
  }
  const finalStudentId = student_id ? student_id : ALL_STUDENT;
  if (finalPlanId) {
    if (finalStudentId === ALL_STUDENT) {
      const stuItems = await api.reports.listStudentsPerformanceReport({
        teacher_id: finalTearchId,
        class_id: finalClassId,
        lesson_plan_id: finalPlanId as string,
      });
      stuReportList = stuItems.items || [];
      stuReportList = stuPerformaceList;
      const h5pItems = await api.reports.listStudentsPerformanceH5PReport({
        teacher_id: finalTearchId,
        class_id: finalClassId,
        lesson_plan_id: finalPlanId as string,
      });
      h5pReportList = h5pItems.items || [];
      h5pReportList = stuPerformanceH5pList;
    } else {
      const stuItems = await api.reports.getStudentPerformanceReport(student_id, {
        teacher_id: finalTearchId,
        class_id: finalClassId,
        lesson_plan_id: finalPlanId as string,
      });
      stuReportDetail = stuItems.items || [];
      stuReportDetail = stuPerformanceDetail;
      const h5pItems = await api.reports.getStudentPerformanceH5PReport(student_id, {
        teacher_id: finalTearchId,
        class_id: finalClassId,
        lesson_plan_id: finalPlanId as string,
      });
      h5pReportDetail = h5pItems.items || [];
      h5pReportDetail = stuPerformanceH5pDetail;
    }
  }

  return {
    teacherList,
    classList: classList || { user: { classesTeaching: [] } },
    lessonPlanList: lessonPlanList,
    teacher_id: finalTearchId,
    class_id: finalClassId || "",
    lesson_plan_id: finalPlanId || "",
    student_id: finalStudentId,
    reportList,
    studentList,
    h5pReportList,
    stuReportList,
    h5pReportDetail,
    stuReportDetail,
  };
});

type IQueryGetStudentsByClassIdParams = {
  class_id: string;
};
export const getScheduleParticipant = createAsyncThunk<getScheduleParticipantsMockOptionsResponse, getScheduleParticipantsPayLoad>(
  "getParticipant",
  async ({ class_id }) => {
    const { data } = await gqlapi.query<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>({
      query: ParticipantsByClassDocument,
      variables: { class_id },
    });
    const participantList = data;
    console.log(participantList);
    return { participantList };
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

    [getClassList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassList>>) => {
      state.reportMockOptions.classList = payload;
      state.reportMockOptions.class_id = (payload.user && payload.user.classesTeaching
        ? payload.user.classesTeaching[0]?.class_id
        : undefined) as string;
    },
    [getClassList.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getLessonPlan.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLessonPlan>>) => {
      state.reportMockOptions.lessonPlanList = payload;
      state.reportMockOptions.lesson_plan_id = payload[0] && (payload[0].id || "");
      state.stuReportMockOptions.lessonPlanList = payload;
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

    [reportOnload.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof reportOnload>>) => {
      const { reportList, ...reportMockOptions } = payload;
      state.reportMockOptions = { ...reportMockOptions };
      state.reportList = reportList;
    },
    [reportOnload.pending.type]: (state) => {
      state.reportMockOptions = cloneDeep(initialState.reportMockOptions);
    },

    [getTeacherListByOrgId.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTeacherListByOrgId>>) => {
      const { teacherList } = payload;
      state.reportMockOptions.teacherList = teacherList;
      state.reportMockOptions.teacher_id = teacherList[0] && teacherList[0].user_id;
    },
    [getTeacherListByOrgId.pending.type]: (state) => {
      state.reportMockOptions.teacherList = cloneDeep(initialState.reportMockOptions.teacherList);
      state.reportMockOptions.teacher_id = cloneDeep(initialState.reportMockOptions.teacher_id);
    },

    [reportCategoriesOnload.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof reportCategoriesOnload>>) => {
      state.categoriesPage = payload;
    },
    [reportCategoriesOnload.pending.type]: (state) => {
      state.categoriesPage = cloneDeep(initialState.categoriesPage);
    },
    [stuPerformanceReportOnload.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof stuPerformanceReportOnload>>
    ) => {
      const { h5pReportList, stuReportList, h5pReportDetail, stuReportDetail, ...stuReportMockOptions } = payload;
      state.stuReportMockOptions = { ...stuReportMockOptions };
      state.h5pReportList = h5pReportList;
      state.stuReportList = stuReportList;
      state.h5pReportDetail = h5pReportDetail;
      state.stuReportDetail = stuReportDetail;
    },
    [stuPerformanceReportOnload.pending.type]: (state) => {
      state.stuReportMockOptions = cloneDeep(initialState.stuReportMockOptions);
    },
    [getStuReportList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStuReportList>>) => {
      state.stuReportList = payload.stuReportList;
      state.h5pReportList = payload.h5pReportList;
    },
    [getStuReportList.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getStuReportList.pending.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.stuReportList = initialState.stuReportList;
      state.h5pReportList = initialState.h5pReportList;
    },
    [getScheduleParticipant.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getScheduleParticipant>>) => {
      state.stuReportMockOptions.studentList = payload.participantList.class?.students as Pick<User, "user_id" | "user_name">[];
    },
  },
});
export default reducer;
