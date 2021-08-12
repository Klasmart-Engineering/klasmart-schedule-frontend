import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import api, { gqlapi } from "../api";
import { Class, School, Status, User } from "../api/api-ko-schema.auto";
import {
  ClassesTeachingQueryDocument,
  ClassesTeachingQueryQuery,
  ClassesTeachingQueryQueryVariables,
  GetSchoolTeacherDocument,
  GetSchoolTeacherQuery,
  GetSchoolTeacherQueryVariables,
  NotParticipantsByOrganizationDocument,
  NotParticipantsByOrganizationQuery,
  NotParticipantsByOrganizationQueryVariables,
  QeuryMeDocument,
  QeuryMeQuery,
  QeuryMeQueryVariables,
  SchoolAndTeacherByOrgDocument,
  SchoolAndTeacherByOrgQuery,
  SchoolAndTeacherByOrgQueryVariables,
  TeacherByOrgIdDocument,
  TeacherByOrgIdQuery,
  TeacherByOrgIdQueryVariables,
  TeacherListBySchoolIdDocument,
  TeacherListBySchoolIdQuery,
  TeacherListBySchoolIdQueryVariables,
  UserSchoolIDsDocument,
  UserSchoolIDsQuery,
  UserSchoolIDsQueryVariables
} from "../api/api-ko.auto";
import {
  EntityQueryAssignmentsSummaryResult,
  EntityQueryLiveClassesSummaryResult,
  EntityReportListTeachingLoadResult,
  EntityScheduleShortInfo,
  EntityStudentAchievementReportCategoryItem,
  EntityStudentAchievementReportItem,
  // EntityStudentPerformanceH5PReportItem,
  EntityStudentPerformanceReportItem,
  // EntityStudentsPerformanceH5PReportItem,
  EntityTeacherReportCategory
} from "../api/api.auto";
import { apiGetPermission, apiWaitForOrganizationOfPage } from "../api/extra";
import { hasPermissionOfMe, PermissionType } from "../components/Permission";
import { formatTimeToMonDay, getTimeOffSecond, ModelReport } from "../models/ModelReports";
import { ReportFilter, ReportOrderBy } from "../pages/ReportAchievementList/types";
import { IWeeks } from "../pages/ReportLearningSummary";
import { LearningSummartOptionsProps } from "../pages/ReportLearningSummary/FilterLearningSummary";
import {
  ArrProps,
  QueryLearningSummaryCondition,
  QueryLearningSummaryRemainingFilterCondition,
  ReportType
} from "../pages/ReportLearningSummary/types";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
const TIME_OFFSET = ((0 - new Date().getTimezoneOffset() / 60) * 3600).toString();

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
  h5pReportList?: [];
  stuReportList?: EntityStudentPerformanceReportItem[];
  stuReportDetail?: EntityStudentPerformanceReportItem[];
  h5pReportDetail?: [];
  studentList: Pick<User, "user_id" | "user_name">[];
  teachingLoadOnload: TeachingLoadResponse;
  learningSummartOptions: LearningSummartOptionsProps;
  liveClassSummary: EntityQueryLiveClassesSummaryResult;
  assignmentSummary: EntityQueryAssignmentsSummaryResult;
  summaryReportOptions: IResultLearningSummary;
}
interface RootState {
  report: IreportState;
}
const initialState: IreportState = {
  reportList: [],
  achievementDetail: [],
  student_name: "",
  reportMockOptions: {
    teacherList: [],
    classList: [],
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
    classList: [],
    lessonPlanList: [],
    teacher_id: "",
    class_id: "",
    lesson_plan_id: "",
    student_id: "",
    studentList: [],
  },
  // h5pReportList: [],
  stuReportList: [],
  stuReportDetail: [],
  // h5pReportDetail: [],
  lessonPlanList: [],
  studentList: [],
  teachingLoadOnload: {
    schoolList: [],
    teacherList: [],
    classList: [],
    teachingLoadList: {},
    user_id: "",
  },
  learningSummartOptions: {
    year: [],
    week: [],
    // schoolList: [],
    // classList: [],
    // teacherList: [],
    studentList: [],
    subjectList: [],
  },
  liveClassSummary: {},
  assignmentSummary: {},
  summaryReportOptions: {
    years: [],
    weeks: [],
    schools: [],
    classes: [],
    teachers: [],
    students: [],
    subjects: [],
    year: 2021,
    week_start: 0,
    week_end: 0,
    school_id: "",
    class_id: "",
    teacher_id: "",
    student_id: "",
    subject_id: "",
  },
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

// export const getClassList = createAsyncThunk<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>("getClassList", async ({ user_id }) => {
//   const { data } = await gqlapi.query<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>({
//     query: ClassesByTeacherDocument,
//     variables: {
//       user_id,
//     },
//   });
//   return data;
// });

export const getClassList = createAsyncThunk<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>(
  "getClassList",
  async ({ user_id, organization_id }) => {
    const { data } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
      query: ClassesTeachingQueryDocument,
      variables: {
        user_id,
        organization_id,
      },
    });
    return data;
  }
);

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
  classList: Pick<Class, "class_id" | "class_name">[];
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
  status?: ReportFilter;
  sort_by?: ReportOrderBy;
}

export const reportOnload = createAsyncThunk<GetReportMockOptionsResponse, GetReportMockOptionsPayLoad & LoadingMetaPayload>(
  "reportOnload",
  async ({ teacher_id, class_id, lesson_plan_id, status, sort_by }) => {
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
    const meInfoPerm = await apiGetPermission();
    const myTearchId = meInfo.me?.user_id || "";
    const perm = hasPermissionOfMe(
      [
        PermissionType.view_my_reports_614,
        PermissionType.view_reports_610,
        PermissionType.view_my_organizations_reports_612,
        PermissionType.view_my_school_reports_611,
      ],
      meInfoPerm.me
    );
    // const perm = await api.organizationPermissions.hasOrganizationPermissions({
    //   permission_name: premissionAll,
    // })

    //根据权限调接口
    // 1 如果只有看自己的report的权限 finalTeachId => 我自己的user_id
    if (perm.view_my_reports_614 && !perm.view_reports_610 && !perm.view_my_school_reports_611 && !perm.view_my_organizations_reports_612) {
      teacherList = [];
      finalTearchId = myTearchId;
    } else {
      // 2 如果有查看自己组织的report的权限或者查看所有report的权限
      //    teacherList => 通过组织id获取所有classes =>所有的teacherid(可能有重复)
      if (perm.view_my_organizations_reports_612 || perm.view_reports_610) {
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
      // 2 如果有查看自己学校的report的权限或者查看所有report的权限
      //    teacherList => 通过我的user_id 获取我所在的所有学校 => 过滤出当前组织的学校 => 遍历出所有的teacher
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
      // 3 去重
      teacherList = ModelReport.teacherListSetDiff(teacherList);
      finalTearchId = teacher_id || (teacherList && teacherList[0]?.user_id) || "";
      if (!teacherList || !teacherList[0])
        return {
          teacherList: [],
          classList: [],
          lessonPlanList: [],
          teacher_id: "",
          class_id: "",
          lesson_plan_id: "",
        };
    }

    const { data: result } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
      query: ClassesTeachingQueryDocument,
      variables: {
        user_id: finalTearchId,
        organization_id,
      },
    });

    const classList = result.user && (result.user.membership?.classesTeaching as Pick<Class, "class_id" | "class_name">[]);
    const firstClassId = classList && classList[0]?.class_id;
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
        class_id: finalClassId || "",
        lesson_plan_id: finalPlanId as string,
        status,
        sort_by,
      });
      reportList = items.items || [];
    }
    return {
      teacherList,
      classList: classList || [],
      lessonPlanList: lessonPlanList,
      teacher_id: finalTearchId,
      class_id: finalClassId || "",
      lesson_plan_id: finalPlanId || "",
      reportList,
    };
  }
);

export const resetReportMockOptions = createAsyncThunk<null>("report/resetReportMockOptions", () => {
  return null;
});

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
    //拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const meInfoPerm = await apiGetPermission();
    const perm = hasPermissionOfMe(
      [
        PermissionType.view_my_reports_614,
        PermissionType.view_reports_610,
        PermissionType.view_my_school_reports_611,
        PermissionType.view_my_organizations_reports_612,
      ],
      meInfoPerm.me
    );
    const my_id = meInfo?.me?.user_id || "";

    if (perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612) {
      let teacherList: Pick<User, "user_id" | "user_name">[] = [];
      if (perm.view_my_organizations_reports_612 || perm.view_reports_610) {
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

// interface GetStuReportListResponse {
//   stuReportList?: EntityStudentPerformanceReportItem[];
//   h5pReportList?: EntityStudentsPerformanceH5PReportItem[];
// }
// interface GetStuReportListPayload {
//   teacher_id: string;
//   class_id: string;
//   lesson_plan_id: string;
// }
// export const getStuReportList = createAsyncThunk<GetStuReportListResponse, GetStuReportListPayload & LoadingMetaPayload>(
//   "getStuReportList",
//   async ({ teacher_id, class_id, lesson_plan_id }) => {
//     const stuItems = await api.reports.listStudentsPerformanceReport({ teacher_id, class_id, lesson_plan_id });
//     const h5pItems = await api.reports.listStudentsPerformanceH5PReport({ teacher_id, class_id, lesson_plan_id });
//     return { stuReportList: stuItems.items, h5pReportList: h5pItems.items };
//   }
// );

// interface GetStuReportDetailResponse {
//   stuReportDetail?: EntityStudentPerformanceReportItem[];
//   h5pReportDetail?: EntityStudentPerformanceH5PReportItem[];
// }
// interface GetStuReportDetailPayload {
//   teacher_id: string;
//   class_id: string;
//   lesson_plan_id: string;
//   id: string;
// }
// export const getStuReportDetail = createAsyncThunk<GetStuReportDetailResponse, GetStuReportDetailPayload & LoadingMetaPayload>(
//   "getStuReportDetail",
//   async ({ teacher_id, class_id, lesson_plan_id, id }) => {
//     const stuItems = await api.reports.getStudentPerformanceReport(id, { teacher_id, class_id, lesson_plan_id });
//     const h5pItems = await api.reports.getStudentPerformanceH5PReport(id, { teacher_id, class_id, lesson_plan_id });
//     return { stuReportDetail: stuItems.items, h5pReportDetail: h5pItems.items };
//   }
// );

export interface GetStuReportMockOptionsResponse {
  teacherList: Pick<User, "user_id" | "user_name">[];
  classList: Pick<Class, "class_id" | "class_name">[];
  lessonPlanList: EntityScheduleShortInfo[];
  teacher_id: string;
  class_id: string;
  lesson_plan_id: string;
  student_id?: string;
  reportList?: EntityStudentAchievementReportItem[];
  studentList?: Pick<User, "user_id" | "user_name">[];
  // h5pReportList?: EntityStudentsPerformanceH5PReportItem[];
  stuReportList?: EntityStudentPerformanceReportItem[];
  stuReportDetail?: EntityStudentPerformanceReportItem[];
  // h5pReportDetail?: EntityStudentPerformanceH5PReportItem[];
}
// interface GetStuReportMockOptionsPayLoad {
//   teacher_id?: string;
//   class_id?: string;
//   lesson_plan_id?: string;
//   view_my_report?: boolean;
//   status?: ReportFilter;
//   sort_by?: ReportOrderBy;
//   student_id: string;
// }

// export const stuPerformanceReportOnload = createAsyncThunk<
//   GetStuReportMockOptionsResponse,
//   GetStuReportMockOptionsPayLoad & LoadingMetaPayload
// >("stuPerformanceReportOnload", async ({ teacher_id, class_id, lesson_plan_id, student_id }) => {
//   const organization_id = (await apiWaitForOrganizationOfPage()) as string;
//   let reportList: EntityStudentAchievementReportItem[] = [];
//   let lessonPlanList: EntityScheduleShortInfo[] = [];
//   let teacherList: Pick<User, "user_id" | "user_name">[] | undefined = [];
//   let finalTearchId: string = "";
//   let studentList: Pick<User, "user_id" | "user_name">[] | undefined = [];
//   let h5pReportList: EntityStudentsPerformanceH5PReportItem[] = [];
//   let stuReportList: EntityStudentPerformanceReportItem[] = [];
//   let stuReportDetail: EntityStudentPerformanceReportItem[] = [];
//   let h5pReportDetail: EntityStudentPerformanceH5PReportItem[] = [];
//   // 拉取我的user_id
//   const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
//     query: QeuryMeDocument,
//     variables: {
//       organization_id,
//     },
//   });
//   const myTearchId = meInfo.me?.user_id || "";
//   const meInfoPerm = await apiGetPermission();
//   const perm = hasPermissionOfMe(
//     [
//       PermissionType.view_my_reports_614,
//       PermissionType.view_reports_610,
//       PermissionType.view_my_organizations_reports_612,
//       PermissionType.view_my_school_reports_611,
//     ],
//     meInfoPerm.me
//   );
//   if (perm.view_my_reports_614 && !perm.view_reports_610 && !perm.view_my_school_reports_611 && !perm.view_my_organizations_reports_612) {
//     teacherList = [];
//     finalTearchId = myTearchId;
//   } else {
//     if (perm.view_my_organizations_reports_612 || perm.view_reports_610) {
//       const { data } = await gqlapi.query<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>({
//         query: TeacherByOrgIdDocument,
//         variables: {
//           organization_id,
//         },
//       });
//       data.organization?.classes?.forEach((classItem) => {
//         teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]);
//       });
//     }
//     if (perm.view_my_school_reports_611 || perm.view_reports_610) {
//       const { data } = await gqlapi.query<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>({
//         query: GetSchoolTeacherDocument,
//         variables: {
//           user_id: myTearchId,
//         },
//       });
//       data.user?.school_memberships
//         ?.filter((schoolItem) => schoolItem?.school?.organization?.organization_id === organization_id)
//         .map((schoolItem) =>
//           schoolItem?.school?.classes?.forEach(
//             (classItem) => (teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]))
//           )
//         );
//     }
//     teacherList = ModelReport.teacherListSetDiff(teacherList);
//     finalTearchId = teacher_id || (teacherList && teacherList[0]?.user_id) || "";
//     if (!teacherList || !teacherList[0])
//       return {
//         teacherList: [],
//         classList: [],
//         lessonPlanList: [],
//         teacher_id: "",
//         class_id: "",
//         lesson_plan_id: "",
//         student_id,
//       };
//   }
//   const { data: result } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
//     query: ClassesTeachingQueryDocument,
//     variables: {
//       user_id: finalTearchId,
//       organization_id,
//     },
//   });
//   // const mockClassResult: ClassesByTeacherQuery = classListByTeacher;
//   const classList = result.user && (result.user.membership?.classesTeaching as Pick<Class, "class_id" | "class_name">[]);
//   const firstClassId = classList && classList[0]?.class_id;
//   const finalClassId = class_id ? class_id : firstClassId;
//   //获取plan_id
//   if (finalTearchId && finalClassId) {
//     const data = await api.schedulesLessonPlans.getLessonPlans({
//       teacher_id: (finalTearchId as string) || "",
//       class_id: (finalClassId as string) || "",
//     });
//     lessonPlanList = data || [];
//   }
//   const finalPlanId = lesson_plan_id ? lesson_plan_id : lessonPlanList[0]?.id || "";
//   // 用finalClassId 拉取studetlist
//   if (finalTearchId && finalClassId) {
//     const { data } = await gqlapi.query<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>({
//       query: ParticipantsByClassDocument,
//       variables: { class_id: finalClassId },
//     });
//     studentList = studentList.concat(data.class?.students as Pick<User, "user_id" | "user_name">[]) || [];
//   }
//   const finalStudentId = student_id ? student_id : ALL_STUDENT;
//   if (finalPlanId) {
//     if (finalStudentId === ALL_STUDENT) {
//       const stuItems = await api.reports.listStudentsPerformanceReport({
//         teacher_id: finalTearchId,
//         class_id: finalClassId || "",
//         lesson_plan_id: finalPlanId as string,
//       });
//       stuReportList = stuItems.items || [];
//       // stuReportList = stuPerformaceList;
//       const h5pItems = await api.reports.listStudentsPerformanceH5PReport({
//         teacher_id: finalTearchId,
//         class_id: finalClassId || "",
//         lesson_plan_id: finalPlanId as string,
//       });
//       h5pReportList = h5pItems.items || [];
//       // h5pReportList = stuPerformanceH5pList;
//     } else {
//       const stuItems = await api.reports.getStudentPerformanceReport(student_id, {
//         teacher_id: finalTearchId,
//         class_id: finalClassId || "",
//         lesson_plan_id: finalPlanId as string,
//       });
//       stuReportDetail = stuItems.items || [];
//       // stuReportDetail = stuPerformanceDetail;
//       const h5pItems = await api.reports.getStudentPerformanceH5PReport(student_id, {
//         teacher_id: finalTearchId,
//         class_id: finalClassId || "",
//         lesson_plan_id: finalPlanId as string,
//       });
//       h5pReportDetail = h5pItems.items || [];
//       // h5pReportDetail = stuPerformanceH5pDetail;
//     }
//   }

//   return {
//     teacherList,
//     classList: classList || [],
//     lessonPlanList: lessonPlanList,
//     teacher_id: finalTearchId,
//     class_id: finalClassId || "",
//     lesson_plan_id: finalPlanId || "",
//     student_id: finalStudentId,
//     reportList,
//     studentList,
//     h5pReportList,
//     stuReportList,
//     h5pReportDetail,
//     stuReportDetail,
//   };
// });

// type IQueryGetStudentsByClassIdParams = {
//   class_id: string;
// };
// export const getScheduleParticipant = createAsyncThunk<getScheduleParticipantsMockOptionsResponse, getScheduleParticipantsPayLoad>(
//   "getParticipant",
//   async ({ class_id }) => {
//     const { data } = await gqlapi.query<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>({
//       query: ParticipantsByClassDocument,
//       variables: { class_id },
//     });
//     const participantList = data;
//     return { participantList };
//   }
// );
export interface GetTeachingLoadListPayLoad {
  school_id?: string;
  teacher_ids?: string;
  class_ids?: string;
  time_offset: string;
  page?: number;
  size?: number;
}
export const getTeachingLoadList = createAsyncThunk<EntityReportListTeachingLoadResult, GetTeachingLoadListPayLoad & LoadingMetaPayload>(
  "getTeachingLoad",
  async (query) => {
    return await api.reports.listTeachingLoadReport(query);
  }
);
export interface TeachingLoadPayload {
  school_id: string;
  teacher_ids: string;
  class_ids: string;
}
export interface TeachingLoadResponse {
  schoolList?: Pick<School, "school_id" | "school_name">[];
  teacherList?: Pick<User, "user_id" | "user_name">[];
  classList?: Pick<Class, "class_id" | "class_name">[];
  teachingLoadList: EntityReportListTeachingLoadResult;
  user_id: string;
}
export const teachingLoadOnload = createAsyncThunk<TeachingLoadResponse, TeachingLoadPayload & LoadingMetaPayload>(
  "teachingLoadOnload",
  async ({ school_id, teacher_ids, class_ids }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    let teachingLoadList: EntityReportListTeachingLoadResult = {};
    let schoolList: Pick<School, "school_id" | "school_name">[] | undefined = [];
    let teacherList: Pick<User, "user_id" | "user_name">[] | undefined = [];
    let classList: Pick<Class, "class_id" | "class_name">[] | undefined = [];
    let newteacher_ids: string = teacher_ids;
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const user_id = meInfo.me?.user_id || "";
    const perm = hasPermissionOfMe(
      [
        PermissionType.view_my_reports_614,
        PermissionType.view_reports_610,
        PermissionType.view_my_organizations_reports_612,
        PermissionType.view_my_school_reports_611,
      ],
      meInfo.me
    );
    if (
      !perm.view_my_reports_614 &&
      !perm.view_reports_610 &&
      !perm.view_my_school_reports_611 &&
      !perm.view_my_organizations_reports_612
    ) {
      return {
        schoolList,
        teacherList,
        classList,
        teachingLoadList,
        user_id,
      };
    }
    const my_id = meInfo?.me?.user_id || "";
    if (perm.view_my_reports_614 && !perm.view_reports_610 && !perm.view_my_school_reports_611 && !perm.view_my_organizations_reports_612) {
      teacherList = [{ user_id: my_id, user_name: meInfo?.me?.user_name || "" }];
      newteacher_ids = my_id;
      // 获取我所在的本组织的学校
      const { data } = await gqlapi.query<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>({
        query: GetSchoolTeacherDocument,
        variables: {
          user_id: my_id,
        },
      });
      const newSchoolList = data.user?.school_memberships
        ?.filter(
          (schoolItem) =>
            schoolItem?.school?.organization?.organization_id === organization_id && schoolItem.school.status === Status.Active
        )
        .map((schoolMember) => schoolMember?.school) as Pick<School, "school_id" | "school_name">[];
      schoolList = schoolList.concat(newSchoolList);
      const { data: result } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
        query: ClassesTeachingQueryDocument,
        variables: {
          user_id: my_id,
          organization_id,
        },
      });
      result.user?.membership?.classesTeaching
        ?.filter((classItem) => classItem?.status === Status.Active)
        .forEach((classItem) => {
          schoolList = schoolList?.concat(classItem?.schools as Pick<School, "school_id" | "school_name">[]);
        });

      teacherList = teacherList.concat([{ user_id: my_id, user_name: meInfo?.me?.user_name || "" }]);
    } else {
      if (perm.view_my_organizations_reports_612 || perm.view_reports_610) {
        const { data: schoolListResult } = await gqlapi.query<SchoolAndTeacherByOrgQuery, SchoolAndTeacherByOrgQueryVariables>({
          query: SchoolAndTeacherByOrgDocument,
          variables: {
            organization_id: organization_id,
          },
        });
        schoolListResult.organization?.schools?.forEach((schoolItem) => {
          if (schoolItem?.status === Status.Active) {
            schoolList?.push(schoolItem as Pick<School, "school_id" | "school_name">);
          }
        });
        if (school_id === "all") {
          // 获取本组织下的所有在学校的老师
          const { data } = await gqlapi.query<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>({
            query: TeacherByOrgIdDocument,
            variables: {
              organization_id,
            },
          });
          data.organization?.classes?.forEach((classItem) => {
            if (classItem?.status === Status.Active) {
              teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]);
            }
          });
          const { data: notParticipantsdata } = await gqlapi.query<
            NotParticipantsByOrganizationQuery,
            NotParticipantsByOrganizationQueryVariables
          >({
            query: NotParticipantsByOrganizationDocument,
            variables: {
              organization_id,
            },
          });
          notParticipantsdata.organization?.classes?.forEach((classItem) => {
            if (classItem?.status === Status.Active && classItem.schools?.length === 0) {
              const newTeacherList = classItem?.teachers
                ?.map((teacherItem) => {
                  // const isThisOrg =
                  //   teacherItem?.school_memberships?.some(
                  //     (schoolItem) => schoolItem?.school?.organization?.organization_id === organization_id
                  //   ) || false;
                  // return teacherItem?.school_memberships?.length === 0 || !isThisOrg ? teacherItem : { user_id: "", user_name: "" };
                  return teacherItem;
                })
                .filter((item) => item?.user_id !== "");
              teacherList = teacherList?.concat(newTeacherList as Pick<User, "user_id" | "user_name">[]);
            }
          });
        } else if (school_id === "no_assigned") {
          // 获取本组织下不属于任何学校的老师
          const { data } = await gqlapi.query<NotParticipantsByOrganizationQuery, NotParticipantsByOrganizationQueryVariables>({
            query: NotParticipantsByOrganizationDocument,
            variables: {
              organization_id,
            },
          });
          data.organization?.classes?.forEach((classItem) => {
            if (classItem?.status === Status.Active && classItem.schools?.length === 0) {
              const newTeacherList = classItem?.teachers
                ?.map((teacherItem) => {
                  return teacherItem;
                })
                .filter((item) => item?.user_id !== "");
              teacherList = teacherList?.concat(newTeacherList as Pick<User, "user_id" | "user_name">[]);
            }
          });
        } else {
          // 获取指定school_id下的老师
          const { data } = await gqlapi.query<TeacherListBySchoolIdQuery, TeacherListBySchoolIdQueryVariables>({
            query: TeacherListBySchoolIdDocument,
            variables: {
              school_id,
            },
          });
          data.school?.classes?.forEach((classItem) => {
            teacherList = teacherList?.concat(
              (classItem?.status === Status.Active ? classItem?.teachers : []) as Pick<User, "user_id" | "user_name">[]
            );
          });
        }
      }
      if ((!perm.view_my_organizations_reports_612 && perm.view_my_school_reports_611) || perm.view_reports_610) {
        const { data } = await gqlapi.query<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>({
          query: GetSchoolTeacherDocument,
          variables: {
            user_id: my_id,
          },
        });
        const newSchoolList = data.user?.school_memberships
          ?.filter(
            (schoolItem) =>
              schoolItem?.school?.organization?.organization_id === organization_id && schoolItem.school.status === Status.Active
          )
          .map((schoolMember) => schoolMember?.school) as Pick<School, "school_id" | "school_name">[];
        schoolList = schoolList.concat(newSchoolList);
        if (perm.view_my_reports_614) {
          const { data: result } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
            query: ClassesTeachingQueryDocument,
            variables: {
              user_id: my_id,
              organization_id,
            },
          });
          result.user?.membership?.classesTeaching
            ?.filter((classItem) => classItem?.status === Status.Active)
            .forEach((classItem) => {
              schoolList = schoolList?.concat(classItem?.schools as Pick<School, "school_id" | "school_name">[]);
            });

          teacherList = teacherList.concat([{ user_id: my_id, user_name: meInfo?.me?.user_name || "" }]);
        }

        if (school_id === "all") {
          data.user?.school_memberships
            ?.filter((schoolItem) => schoolItem?.school?.organization?.organization_id === organization_id)
            .map((schoolItem) =>
              schoolItem?.school?.classes?.forEach(
                (classItem) =>
                  (teacherList = teacherList?.concat(
                    (classItem?.status === Status.Active ? classItem?.teachers : []) as Pick<User, "user_id" | "user_name">[]
                  ))
              )
            );
          if (perm.view_my_reports_614) {
            teacherList = teacherList.concat([{ user_id: my_id, user_name: meInfo?.me?.user_name || "" }]);
          }
        } else if (school_id !== "no_assigned") {
          // 获取指定school_id下的老师
          const { data } = await gqlapi.query<TeacherListBySchoolIdQuery, TeacherListBySchoolIdQueryVariables>({
            query: TeacherListBySchoolIdDocument,
            variables: {
              school_id,
            },
          });
          data.school?.classes?.forEach((classItem) => {
            teacherList = teacherList?.concat(
              (classItem?.status === Status.Active ? classItem?.teachers : []) as Pick<User, "user_id" | "user_name">[]
            );
          });
        } else if (perm.view_my_reports_614) {
          teacherList = teacherList.concat([{ user_id: my_id, user_name: meInfo?.me?.user_name || "" }]);
        }
        //  else if (perm.view_my_reports_614) {
        //   teacherList = teacherList.concat([{ user_id: my_id, user_name: meInfo?.me?.user_name || "" }]);
        // }
      }
    }

    const teacherIdList = newteacher_ids.split(",");
    if (teacherIdList.length === 1 && newteacher_ids !== "all") {
      const { data: result } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
        query: ClassesTeachingQueryDocument,
        variables: {
          user_id: newteacher_ids,
          organization_id,
        },
      });
      let classListall = result.user?.membership?.classesTeaching;
      if (school_id && school_id !== "all" && school_id !== "no_assigned") {
        classListall = classListall?.filter((classItem) => classItem?.schools?.some((school) => school?.school_id === school_id));
      }
      if (school_id === "no_assigned") {
        classListall = classListall?.filter((classItem) => classItem?.schools?.length === 0);
      }
      classList = classList?.concat(
        classListall?.filter((classItem) => classItem?.status === Status.Active) as Pick<Class, "class_id" | "class_name">[]
      );
    }
    teacherList = ModelReport.teacherListSetDiff(teacherList);
    schoolList = ModelReport.schoolListSetDiff(schoolList);
    teachingLoadList =
      (await api.reports.listTeachingLoadReport({ school_id, teacher_ids: newteacher_ids, class_ids, time_offset: TIME_OFFSET })) || [];
    return {
      schoolList,
      teacherList,
      classList,
      teachingLoadList,
      user_id,
    };
  }
);
export type IParamsQueryLiveClassSummary = Parameters<typeof api.reports.queryLiveClassesSummary>[0];
export type IResultQueryLiveClassSummary = AsyncReturnType<typeof api.reports.queryLiveClassesSummary>;
export const getLiveClassesSummary = createAsyncThunk<IResultQueryLiveClassSummary, IParamsQueryLiveClassSummary & LoadingMetaPayload>(
  "getLiveClassesSummary",
  async (query) => {
    const { subject_id } = query;
    const res = await api.reports.queryLiveClassesSummary({ ...query, subject_id: subject_id === "all" ? "" : subject_id });
    return res;
  }
);

export type IParamsQueryAssignmentSummary = Parameters<typeof api.reports.queryAssignmentsSummary>[0];
export type IResultQueryAssignmentSummary = AsyncReturnType<typeof api.reports.queryAssignmentsSummary>;
export const getAssignmentSummary = createAsyncThunk<IResultQueryAssignmentSummary, IParamsQueryAssignmentSummary & LoadingMetaPayload>(
  "getAssingmentSummary",
  async (query) => {
    const { subject_id } = query;
    const res = await api.reports.queryAssignmentsSummary({ ...query, subject_id: subject_id === "all" ? "" : subject_id });
    return res;
  }
);

export type IParamQueryTimeFilter = Parameters<typeof api.reports.queryLearningSummaryTimeFilter>[0];
export type IResultQueryTimeFilter = AsyncReturnType<typeof api.reports.queryLearningSummaryTimeFilter>;
export const getTimeFilter = createAsyncThunk<IResultQueryTimeFilter, IParamQueryTimeFilter & LoadingMetaPayload>(
  "getTimeFilter",
  async ({ metaLoading, ...query }) => {
    return await api.reports.queryLearningSummaryTimeFilter({ ...query });
  }
);

export type IParamQueryRemainFilter = Parameters<typeof api.reports.queryLearningSummaryRemainingFilter>[0];
export type IResultQueryRemainFilter =  AsyncReturnType<typeof api.reports.queryLearningSummaryRemainingFilter>;
export const getRemainFilter = createAsyncThunk<IResultQueryRemainFilter, IParamQueryRemainFilter & LoadingMetaPayload>("getRemainFilter", async (query) => {
  return await api.reports.queryLearningSummaryRemainingFilter({ ...query });
});

// export type IResultQueryLoadLearningSummary = {
//   timeFilter: AsyncReturnType<typeof api.reports.queryLearningSummaryTimeFilter>;
//   infoFilter: AsyncReturnType<typeof api.reports.queryLearningSummaryRemainingFilter>;
// };
// export interface LearningSummaryResponse {
//   liveClassFilterValues: IResultQueryLoadLearningSummary;
//   assessmentFilterValues: IResultQueryLoadLearningSummary;
// }
export interface IParamsOnLoadLearningSummary {
  summary_type: string;
}

export interface IParamsLearningSummary extends QueryLearningSummaryCondition {
  isOrg?: boolean;
  isSchool?: boolean;
  isTeacher?: boolean;
  isStudent?: boolean;
  year?: number;
  subject_id?: string;
  summary_type: QueryLearningSummaryRemainingFilterCondition["summary_type"];
}
export interface IResultLearningSummary {
  years: number[];
  weeks: IWeeks[];
  schools?: ArrProps[];
  classes?: ArrProps[];
  teachers?: ArrProps[];
  students?: ArrProps[];
  subjects?: ArrProps[];
  year?: number;
  week_start?: number;
  week_end?: number;
  school_id?: string;
  class_id?: string;
  teacher_id?: string;
  student_id?: string;
  subject_id?: string;
}
export const onLoadLearningSummary = createAsyncThunk<
  IResultLearningSummary,
  IParamsLearningSummary & LoadingMetaPayload,
  { state: RootState }
>("onLoadLearningSummary", async ({ metaLoading, ...query }, { getState, dispatch }) => {
  const { week_end, week_start, year, summary_type, school_id, class_id, teacher_id, student_id, subject_id } = query;
  let years: number[] = [];
  let weeks: IWeeks[] = [];
  let subjects: ArrProps[] = [];
  let schools: ArrProps[] = [];
  let classes: ArrProps[] = [];
  let teachers: ArrProps[] = [];
  let students: ArrProps[] = [];
  let _year: number = 2021;
  let _school_id: string | undefined = "";
  let _class_id: string | undefined = "";
  let _teacher_id: string | undefined = "";
  let _student_id: string | undefined = "";
  let _subject_id: string | undefined = "";
  const organization_id = (await apiWaitForOrganizationOfPage()) as string;
  // 拉取我的user_id
  const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
    query: QeuryMeDocument,
    variables: {
      organization_id,
    },
  });
  const myUserId = meInfo.me?.user_id;
  const perm = hasPermissionOfMe(
    [
      PermissionType.report_learning_summary_org_652,
      PermissionType.report_learning_summary_school_651,
      PermissionType.report_learning_summary_teacher_650,
      PermissionType.report_learning_summary_student_649,
    ],
    meInfo.me
  );
  const isOrg = perm.report_learning_summary_org_652;
  const isSchool = perm.report_learning_summary_school_651;
  const isTeacher = perm.report_learning_summary_teacher_650;
  const isStudent = perm.report_learning_summary_student_649;
  const {
    report: { summaryReportOptions },
  } = getState();
  // const { years, weeks } = summaryReportOptions;
  // await dispatch(getTimeFilter({time_offset: getTimeOffSecond(), summary_type}))
  // const _year = year ? year : years[years.length - 1];
  // const lastWeek = weeks && weeks[weeks.length - 1];
  // const _week_start = week_start ? week_start : lastWeek && lastWeek.week_start;
  // const _week_end = week_end ? week_end : lastWeek && lastWeek.week_end;
  if (!summaryReportOptions.years && !summaryReportOptions.weeks.length) {
    const timeFilter = await api.reports.queryLearningSummaryTimeFilter({ time_offset: getTimeOffSecond(), summary_type });
    years = timeFilter.length ? timeFilter.map((item) => item.year as number) : [2021];
    const _weeks = timeFilter.length ? timeFilter.find((item) => item.year === _year)?.weeks : [];
    weeks = _weeks
      ? _weeks.map((item) => {
          const week_start = item.week_start as number;
          const week_end = item.week_end as number;
          return {
            week_start,
            week_end,
            value: `${formatTimeToMonDay(week_start as number)}~${formatTimeToMonDay(week_end as number)}`,
          };
        })
      : [];
  } else {
    years = summaryReportOptions.years;
    weeks = summaryReportOptions.weeks;
  }
  _year = year ? year : years[years.length - 1];
  const lastWeek = weeks[weeks.length - 1];
  const _week_start = week_start ? week_start : lastWeek.week_start;
  const _week_end = week_end ? week_end : lastWeek.week_end;
  if (isOrg) {
    const _schools = (await dispatch(getRemainFilter({summary_type, filter_type: "school", week_start: _week_start, week_end: _week_end, metaLoading: true}))) as PayloadAction<AsyncTrunkReturned<typeof getRemainFilter>>;
    // const _schools = await api.reports.queryLearningSummaryRemainingFilter({
    //   summary_type,
    //   filter_type: "school",
    //   week_start: _week_start,
    //   week_end: _week_end,
    // });
    schools =
      _schools.payload &&
      _schools.payload.map((item) => {
        return {
          id: item.school_id,
          name: item.school_name,
        };
      });
    _school_id = school_id ? school_id : schools[0].id;
  }
  if (isSchool) {
    const data = await gqlapi.query<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>({
      query: UserSchoolIDsDocument,
      variables: {
        user_id: myUserId as string,
      },
    });
    const mySchoolId = data.data.user?.school_memberships?.map((item) => item?.school_id)[0];
    const _classes = (await dispatch(getRemainFilter({summary_type, filter_type: "class", week_start: _week_start, week_end: _week_end,school_id: _school_id ? _school_id : mySchoolId, metaLoading: true}))) as PayloadAction<AsyncTrunkReturned<typeof getRemainFilter>>;
    // const _classes = await api.reports.queryLearningSummaryRemainingFilter({
    //   summary_type,
    //   filter_type: "class",
    //   week_start: _week_start,
    //   week_end: _week_end,
    //   school_id: _school_id ? _school_id : mySchoolId,
    // });
    classes =
      _classes.payload &&
      _classes.payload.map((item) => {
        return {
          id: item.class_id,
          name: item.class_name,
        };
      });
    _class_id = class_id ? class_id : classes[0].id;
    const _teachers = (await dispatch(getRemainFilter({summary_type, filter_type: "teacher", week_start: _week_start, week_end: _week_end, class_id: _class_id, metaLoading: true}))) as PayloadAction<AsyncTrunkReturned<typeof getRemainFilter>>;
    // const _teachers = await api.reports.queryLearningSummaryRemainingFilter({
    //   summary_type,
    //   filter_type: "teacher",
    //   week_start: _week_start,
    //   week_end: _week_end,
    //   class_id: _class_id,
    // });
    teachers =
      _teachers.payload &&
      _teachers.payload.map((item) => {
        return {
          id: item.teacher_id,
          name: item.teacher_name,
        };
      });
    _teacher_id = teacher_id ? teacher_id : teachers[0].id;
  }
  if (isTeacher && !isOrg && !isSchool) {
    const _classes = (await dispatch(getRemainFilter({summary_type, filter_type: "class", week_start: _week_start, week_end: _week_end, teacher_id: myUserId, metaLoading: true}))) as PayloadAction<AsyncTrunkReturned<typeof getRemainFilter>>;
    // const _classes = await api.reports.queryLearningSummaryRemainingFilter({
    //   summary_type,
    //   filter_type: "class",
    //   week_start: _week_start,
    //   week_end: _week_end,
    //   teacher_id: myUserId,
    // });
    classes =
      _classes.payload &&
      _classes.payload.map((item) => {
        return {
          id: item.class_id,
          name: item.class_name,
        };
      });
    _class_id = class_id ? class_id : classes[0].id;
    const _students = (await dispatch(getRemainFilter({summary_type, filter_type: "student", week_start: _week_start, week_end: _week_end, class_id: _class_id, metaLoading: true}))) as PayloadAction<AsyncTrunkReturned<typeof getRemainFilter>>;
    // const _students = await api.reports.queryLearningSummaryRemainingFilter({
    //   summary_type,
    //   filter_type: "student",
    //   week_start: _week_start,
    //   week_end: _week_end,
    //   class_id: _class_id,
    // });
    students =
      _students.payload &&
      _students.payload.map((item) => {
        return {
          id: item.student_id,
          name: item.student_name,
        };
      });
    _student_id = student_id ? student_id : students[0].id;
  }
  if (isTeacher && isOrg && isSchool) {
    const _students = (await dispatch(getRemainFilter({summary_type, filter_type: "student", week_start: _week_start, week_end: _week_end, teacher_id: _teacher_id, metaLoading: true}))) as PayloadAction<AsyncTrunkReturned<typeof getRemainFilter>>;
    // const _students = await api.reports.queryLearningSummaryRemainingFilter({
    //   summary_type,
    //   filter_type: "student",
    //   week_start: _week_start,
    //   week_end: _week_end,
    //   teacher_id: _teacher_id,
    // });
    students =
      _students.payload &&
      _students.payload.map((item) => {
        return {
          id: item.student_id,
          name: item.student_name,
        };
      });
    _student_id = student_id ? student_id : students[0].id;
  }
  if (isStudent) {
    const _subjects = (await dispatch(getRemainFilter({summary_type, filter_type: "subject", week_start: _week_start, week_end: _week_end, student_id: _student_id ? _student_id : myUserId, metaLoading: true}))) as PayloadAction<AsyncTrunkReturned<typeof getRemainFilter>>;
    // const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
    //   summary_type,
    //   filter_type: "subject",
    //   week_start: _week_start,
    //   week_end: _week_end,
    //   student_id: _student_id ? _student_id : myUserId,
    // });
    subjects =
      _subjects.payload &&
      _subjects.payload.map((item) => {
        return {
          id: item.subject_id,
          name: item.subject_name,
        };
      });
    subjects.unshift({ id: "all", name: "All" });
    _subject_id = subject_id ? subject_id : subjects[0].id;
  }
  const isLiveClass = summary_type === ReportType.live;
  const params = {
    year: _year,
    week_start: _week_start,
    week_end: _week_end,
    school_id: _school_id,
    class_id: _class_id,
    teacher_id: _teacher_id,
    student_id: _student_id,
    subject_id: _subject_id,
  };
  if (_year && _week_start && _week_end && _student_id && _subject_id) {
    if (subject_id === "all") {
      isLiveClass
        ? await dispatch(getLiveClassesSummary({ ...params, subject_id: "", metaLoading }))
        : await dispatch(getAssignmentSummary({ ...params, subject_id: "", metaLoading }));
    } else {
      isLiveClass
        ? await dispatch(getLiveClassesSummary({ ...params, metaLoading }))
        : await dispatch(getAssignmentSummary({ ...params, metaLoading }));
    }
  }
  return { years, weeks, schools, classes, teachers, students, subjects, ...params };
});

export interface IParamsGetAfterClassFilter extends IParamQueryRemainFilter {
  isOrg: boolean;
  isSchool: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}
export type IResultGetAfterClassFilter = {
  teachers?: ArrProps[];
  students?: ArrProps[];
  subjects?: ArrProps[];
  class_id?: string;
  teacher_id?: string;
  student_id?: string;
  subject_id?: string;
};
export const getAfterClassFilter = createAsyncThunk<
  IResultGetAfterClassFilter,
  IParamsGetAfterClassFilter & LoadingMetaPayload,
  { state: RootState }
>("getAfterClassFilter", async (query, { getState }) => {
  const { summary_type, filter_type, class_id, teacher_id, student_id, week_start, week_end, isOrg, isSchool, isTeacher } = query;
  let teachers: ArrProps[] = [];
  let students: ArrProps[] = [];
  let subjects: ArrProps[] = [];
  let _teacher_id: string | undefined = "";
  let _student_id: string | undefined = "";
  let _subject_id: string | undefined = "";
  if (filter_type === "teacher") {
    if (isOrg || isSchool) {
      const _teachers = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type,
        week_start,
        week_end,
        class_id,
      });
      teachers =
        _teachers &&
        _teachers.map((item) => {
          return {
            id: item.teacher_id,
            name: item.teacher_name,
          };
        });
      _teacher_id = teacher_id ? teacher_id : teachers[0].id;
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start,
        week_end,
        teacher_id: _teacher_id,
      });
      students =
        _students &&
        _students.map((item) => {
          return {
            id: item.student_id,
            name: item.student_name,
          };
        });
      _student_id = students[0].id;
    } else if (isTeacher) {
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start,
        week_end,
        class_id,
      });
      students =
        _students &&
        _students.map((item) => {
          return {
            id: item.student_id,
            name: item.student_name,
          };
        });
      _student_id = students[0].id;
    }
  }
  if (filter_type === "student") {
    if (isOrg || isSchool) {
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start,
        week_end,
        teacher_id,
      });
      students =
        _students &&
        _students.map((item) => {
          return {
            id: item.student_id,
            name: item.student_name,
          };
        });
      _student_id = students[0].id;
    } else if (isTeacher) {
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start,
        week_end,
        class_id,
      });
      students =
        _students &&
        _students.map((item) => {
          return {
            id: item.student_id,
            name: item.student_name,
          };
        });
      _student_id = students[0].id;
    }
  }
  if (filter_type === "teacher" || filter_type === "student") {
    const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "subject",
      week_start,
      week_end,
      student_id: _student_id,
    });
    subjects =
      _subjects &&
      _subjects.map((item) => {
        return {
          id: item.subject_id,
          name: item.subject_name,
        };
      });
    subjects.unshift({ id: "all", name: "All" });
    _subject_id = subjects[0].id;
  }
  if (filter_type === "subject") {
    if (isOrg || isSchool || isTeacher) {
      const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "subject",
        week_start,
        week_end,
        student_id: _student_id,
      });
      subjects =
        _subjects &&
        _subjects.map((item) => {
          return {
            id: item.subject_id,
            name: item.subject_name,
          };
        });
      subjects.unshift({ id: "all", name: "All" });
      _subject_id = subjects[0].id;
    } else {
      const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type,
        week_start,
        week_end,
        student_id,
      });
      subjects =
        _subjects &&
        _subjects.map((item) => {
          return {
            id: item.subject_id,
            name: item.subject_name,
          };
        });
      subjects.unshift({ id: "all", name: "All" });
      _subject_id = subjects[0].id;
    }
  }
  if (class_id) {
    return {
      teachers,
      students,
      subjects,
      class_id,
      teacher_id: _teacher_id,
      student_id: _student_id,
      subject_id: _subject_id,
    };
  } else if (teacher_id) {
    return {
      students,
      subjects,
      teacher_id,
      student_id: _student_id,
      subject_id: _subject_id,
    };
  } else {
    return {
      student_id,
      subjects,
      subject_id: _subject_id,
    };
  }
});

interface GetClassListPayload {
  school_id: string;
  teacher_ids: string;
}
interface GetClassListResponse {
  classList: Pick<Class, "class_id" | "class_name">[];
}
export const getClassListByschool = createAsyncThunk<GetClassListResponse, GetClassListPayload & LoadingMetaPayload>(
  "getClassList",
  async ({ school_id, teacher_ids }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    let classList: Pick<Class, "class_id" | "class_name">[] | undefined = [];
    const { data: result } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
      query: ClassesTeachingQueryDocument,
      variables: {
        user_id: teacher_ids,
        organization_id,
      },
    });
    let classListall = result.user?.membership?.classesTeaching;
    if (school_id && school_id !== "all" && school_id !== "no_assigned") {
      classListall = classListall?.filter((classItem) => classItem?.schools?.some((school) => school?.school_id === school_id));
    }
    if (school_id === "no_assigned") {
      classListall = classListall?.filter((classItem) => classItem?.schools?.length === 0);
    }
    classList = classList?.concat(
      classListall?.filter((classItem) => classItem?.status === Status.Active) as Pick<Class, "class_id" | "class_name">[]
    );
    return { classList };
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
      state.reportMockOptions.classList = (payload.user && payload.user.membership?.classesTeaching
        ? payload.user.membership?.classesTeaching
        : undefined) as Pick<Class, "class_id" | "class_name">[];

      state.reportMockOptions.class_id = (payload.user && payload.user.membership?.classesTeaching
        ? payload.user.membership?.classesTeaching[0]?.class_id
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
    // [stuPerformanceReportOnload.fulfilled.type]: (
    //   state,
    //   { payload }: PayloadAction<AsyncTrunkReturned<typeof stuPerformanceReportOnload>>
    // ) => {
    //   const { h5pReportList, stuReportList, h5pReportDetail, stuReportDetail, ...stuReportMockOptions } = payload;
    //   state.stuReportMockOptions = { ...stuReportMockOptions };
    //   state.h5pReportList = h5pReportList;
    //   state.stuReportList = stuReportList;
    //   state.h5pReportDetail = h5pReportDetail;
    //   state.stuReportDetail = stuReportDetail;
    // },
    // [stuPerformanceReportOnload.pending.type]: (state) => {
    //   state.stuReportMockOptions = cloneDeep(initialState.stuReportMockOptions);
    //   state.h5pReportList = cloneDeep(initialState.h5pReportList);
    //   state.stuReportList = cloneDeep(initialState.stuReportList);
    //   state.h5pReportDetail = cloneDeep(initialState.h5pReportDetail);
    //   state.stuReportDetail = cloneDeep(initialState.stuReportDetail);
    // },
    // [getStuReportList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStuReportList>>) => {
    //   state.stuReportList = payload.stuReportList;
    //   state.h5pReportList = payload.h5pReportList;
    // },
    // [getStuReportList.rejected.type]: (state, { error }: any) => {
    //   // alert(JSON.stringify(error));
    // },
    // [getStuReportList.pending.type]: (state, { payload }: PayloadAction<any>) => {
    //   // alert("success");
    //   state.stuReportList = initialState.stuReportList;
    //   state.h5pReportList = initialState.h5pReportList;
    // },
    // [getScheduleParticipant.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getScheduleParticipant>>) => {
    //   state.stuReportMockOptions.studentList = payload.participantList.class?.students as Pick<User, "user_id" | "user_name">[];
    // },
    // [getStuReportDetail.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStuReportDetail>>) => {
    //   state.stuReportDetail = payload.stuReportDetail;
    //   state.h5pReportDetail = payload.h5pReportDetail;
    // },
    // [getStuReportDetail.pending.type]: (state, { payload }: PayloadAction<any>) => {
    //   // alert("success");
    //   state.stuReportDetail = initialState.stuReportDetail;
    //   state.h5pReportDetail = initialState.h5pReportDetail;
    // },
    [teachingLoadOnload.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof teachingLoadOnload>>) => {
      state.teachingLoadOnload = payload;
    },
    [teachingLoadOnload.pending.type]: (state) => {
      state.teachingLoadOnload = initialState.teachingLoadOnload;
    },
    [getTeachingLoadList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTeachingLoadList>>) => {
      state.teachingLoadOnload.teachingLoadList = payload;
    },
    [getClassListByschool.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassListByschool>>) => {
      state.teachingLoadOnload.classList = payload.classList;
    },
    [getClassListByschool.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassListByschool>>) => {
      state.teachingLoadOnload.classList = initialState.teachingLoadOnload.classList;
      state.teachingLoadOnload.teachingLoadList = initialState.teachingLoadOnload.teachingLoadList;
    },
    [resetReportMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof resetReportMockOptions>>) => {
      state.reportMockOptions = initialState.reportMockOptions;
    },
    [onLoadLearningSummary.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadLearningSummary>>) => {
      state.summaryReportOptions = payload;
    },
    [getLiveClassesSummary.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLiveClassesSummary>>) => {
      state.liveClassSummary = payload;
    },
    [getAssignmentSummary.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssignmentSummary>>) => {
      state.assignmentSummary = payload;
    },
    [getTimeFilter.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTimeFilter>>) => {
      const years = payload.map((item) => item.year as number);
      state.summaryReportOptions.years = years;
      const weeks = payload[0].weeks
        ? payload[0].weeks?.map((item) => {
            const week_start = item.week_start as number;
            const week_end = item.week_end as number;
            return {
              week_start,
              week_end,
              value: `${formatTimeToMonDay(week_start)}~${formatTimeToMonDay(week_end)}`,
            };
          })
        : [];
      state.summaryReportOptions.weeks = weeks;
      const _week = weeks[weeks.length - 1];
      state.summaryReportOptions.year = years[years.length - 1];
      state.summaryReportOptions.week_end = _week.week_end;
      state.summaryReportOptions.week_start = _week.week_start;
    },
    [getRemainFilter.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getRemainFilter>>) => {},
    [getAfterClassFilter.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAfterClassFilter>>) => {
      if (payload.class_id) {
        state.summaryReportOptions.class_id = payload.class_id;
      }
      if (payload.teachers?.length) {
        state.summaryReportOptions.teachers = payload.teachers;
      }
      if (payload.teacher_id) {
        state.summaryReportOptions.teacher_id = payload.teacher_id;
      }
      if (payload.students?.length) {
        state.summaryReportOptions.students = payload.students;
      }
      if (payload.student_id) {
        state.summaryReportOptions.student_id = payload.student_id;
      }
      if (payload.subjects?.length) {
        state.summaryReportOptions.subjects = payload.subjects;
        state.summaryReportOptions.subject_id = payload.subject_id;
      }
    },
  },
});
export default reducer;
