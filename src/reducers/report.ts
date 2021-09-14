import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import api, { gqlapi } from "../api";
import { Class, School, Status, User, UserFilter, UuidOperator } from "../api/api-ko-schema.auto";
import {
  ClassesTeachingQueryDocument,
  ClassesTeachingQueryQuery,
  ClassesTeachingQueryQueryVariables,
  GetSchoolTeacherDocument,
  GetSchoolTeacherQuery,
  GetSchoolTeacherQueryVariables,
  GetStudentNameByIdDocument,
  GetStudentNameByIdQuery,
  GetStudentNameByIdQueryVariables,
  MyPermissionsAndClassesTeachingQueryDocument,
  MyPermissionsAndClassesTeachingQueryQuery,
  MyPermissionsAndClassesTeachingQueryQueryVariables,
  NotParticipantsByOrganizationDocument,
  NotParticipantsByOrganizationQuery,
  NotParticipantsByOrganizationQueryVariables,
  QeuryMeDocument,
  QeuryMeQuery,
  QeuryMeQueryVariables,
  SchoolAndTeacherByOrgDocument,
  SchoolAndTeacherByOrgQuery,
  SchoolAndTeacherByOrgQueryVariables,
  SchoolsByOrganizationDocument,
  SchoolsByOrganizationQuery,
  SchoolsByOrganizationQueryVariables,
  TeacherByOrgIdDocument,
  TeacherByOrgIdQuery,
  TeacherByOrgIdQueryVariables,
  TeacherListBySchoolIdDocument,
  TeacherListBySchoolIdQuery,
  TeacherListBySchoolIdQueryVariables,
  UserSchoolIDsDocument,
  UserSchoolIDsQuery,
  UserSchoolIDsQueryVariables,
} from "../api/api-ko.auto";
import {
  EntityClassesAssignmentOverView,
  EntityClassesAssignmentsUnattendedStudentsView,
  EntityClassesAssignmentsView,
  EntityQueryAssignmentsSummaryResult,
  EntityQueryLiveClassesSummaryResult,
  EntityReportListTeachingLoadResult,
  EntityScheduleShortInfo,
  EntityStudentAchievementReportCategoryItem,
  EntityStudentAchievementReportItem,
  // EntityStudentPerformanceH5PReportItem,
  EntityStudentPerformanceReportItem,
  EntityStudentUsageMaterialReportRequest,
  EntityStudentUsageMaterialReportResponse,
  EntityStudentUsageMaterialViewCountReportResponse,
  // EntityStudentsPerformanceH5PReportItem,
  EntityTeacherReportCategory,
} from "../api/api.auto";
import { apiGetPermission, apiWaitForOrganizationOfPage } from "../api/extra";
import { hasPermissionOfMe, PermissionType } from "../components/Permission";
import { formatTimeToMonDay, getTimeOffSecond, ModelReport } from "../models/ModelReports";
import { ReportFilter, ReportOrderBy } from "../pages/ReportAchievementList/types";
import { IWeeks } from "../pages/ReportLearningSummary";
import {
  ArrProps,
  QueryLearningSummaryCondition,
  QueryLearningSummaryRemainingFilterCondition,
  ReportType,
  TimeFilter,
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
  studentUsage: {
    organization_id: string;
    schoolList: Pick<School, "classes" | "school_id" | "school_name">[];
    noneSchoolClasses: Pick<Class, "class_id" | "class_name">[];
  };
  studentUsageReport: [EntityStudentUsageMaterialReportResponse, EntityStudentUsageMaterialViewCountReportResponse];
  teachingLoadOnload: TeachingLoadResponse;
  liveClassSummary: EntityQueryLiveClassesSummaryResult;
  assignmentSummary: EntityQueryAssignmentsSummaryResult;
  summaryReportOptions: IResultLearningSummary;
  classesAssignmentsUnattend: EntityClassesAssignmentsUnattendedStudentsView[];
  classesAssignments: EntityClassesAssignmentsView[];
  overview: EntityClassesAssignmentOverView[];
}

interface IObj {
  [key: string]: string;
}

interface RootState {
  report: IreportState;
}
export const initialSateSummaryOptions = {
  schools: [],
  classes: [],
  teachers: [],
  students: [],
  subjects: [],
  school_id: "",
  class_id: "",
  teacher_id: "",
  student_id: "",
  subject_id: "",
};
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
  studentUsageReport: [{ class_usage_list: [] }, { content_usage_list: [] }],
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
  studentUsage: {
    organization_id: "",
    schoolList: [],
    noneSchoolClasses: [],
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
    summary_type: ReportType.live,
  },
  classesAssignmentsUnattend: [],
  classesAssignments: [],
  overview: [],
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

export const getSchoolsByOrg = createAsyncThunk("getSchoolsByOrg", async () => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  return Promise.all([
    gqlapi.query<MyPermissionsAndClassesTeachingQueryQuery, MyPermissionsAndClassesTeachingQueryQueryVariables>({
      query: MyPermissionsAndClassesTeachingQueryDocument,
      variables: {
        organization_id,
      },
    }),
    gqlapi.query<SchoolsByOrganizationQuery, SchoolsByOrganizationQueryVariables>({
      query: SchoolsByOrganizationDocument,
      variables: {
        organization_id,
      },
    }),
  ]);
});

export const getStudentUserNamesById = createAsyncThunk("getStudentUserNamesById", async (userIds: string[]) => {
  const filter = {
    OR: userIds.map((id) => ({
      userId: {
        operator: UuidOperator.Eq,
        value: id,
      },
    })),
  } as UserFilter;
  return gqlapi.query<GetStudentNameByIdQuery, GetStudentNameByIdQueryVariables>({
    query: GetStudentNameByIdDocument,
    variables: {
      filter,
    },
  });
});

interface getStudentUsageMaterialParams extends EntityStudentUsageMaterialReportRequest {
  allClasses: string[];
  time_range_count: string[];
  metaLoading: boolean;
}
export const getStudentUsageMaterial = createAsyncThunk<
  [EntityStudentUsageMaterialReportResponse, EntityStudentUsageMaterialViewCountReportResponse],
  getStudentUsageMaterialParams
>("getStudentUsageMaterial", async ({ metaLoading, ...params }) => {
  return await Promise.all([
    api.reports.getStudentUsageMaterialReport({
      class_id_list: params.class_id_list,
      time_range_list: params.time_range_list,
      content_type_list: params.content_type_list,
    }),
    api.reports.getStudentUsageMaterialViewCountReport({
      class_id_list: params.allClasses,
      time_range_list: params.time_range_count,
      content_type_list: params.content_type_list,
    }),
  ]);
});

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
export type IResultQueryRemainFilter = AsyncReturnType<typeof api.reports.queryLearningSummaryRemainingFilter>;
export const getRemainFilter = createAsyncThunk<IResultQueryRemainFilter, IParamQueryRemainFilter & LoadingMetaPayload>(
  "getRemainFilter",
  async (query) => {
    return await api.reports.queryLearningSummaryRemainingFilter({ ...query });
  }
);
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
  summary_type: QueryLearningSummaryRemainingFilterCondition["summary_type"];
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
  let _year: number;
  let _school_id: string | undefined = "";
  let _class_id: string | undefined = "";
  let _teacher_id: string | undefined = "";
  let _student_id: string | undefined = "";
  let _subject_id: string | undefined = "";
  let mySchoolId: string | undefined = "";
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
  const isOnlyStudent = isStudent && !isOrg && !isSchool && !isTeacher;
  const {
    report: { summaryReportOptions },
  } = getState();
  if (isSchool && !isOrg) {
    const data = await gqlapi.query<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>({
      query: UserSchoolIDsDocument,
      variables: {
        user_id: myUserId as string,
      },
    });
    mySchoolId = data.data.user?.school_memberships?.map((item) => item?.school_id).join(",");
  }
  if (!summaryReportOptions.years.length || !summaryReportOptions.weeks.length) {
    const params = { time_offset: getTimeOffSecond(), summary_type };
    let timeFilterParams: IParamQueryTimeFilter = { ...params };
    if (!isOrg && isSchool) {
      timeFilterParams = { ...params, school_ids: mySchoolId ? mySchoolId : "none" };
    }
    if (!isOrg && !isSchool && isTeacher) {
      timeFilterParams = { ...params, teacher_id: myUserId };
    }
    if (!isOrg && !isSchool && !isTeacher && isStudent) {
      timeFilterParams = { ...params, student_id: myUserId };
    }
    const timeFilter = await api.reports.queryLearningSummaryTimeFilter({ ...timeFilterParams });
    years = timeFilter.length ? timeFilter.map((item) => item.year as number) : [2021];
    _year = year ? year : years[years.length - 1];
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
  // orgAdmin 需要拉取school列表
  if (isOrg) {
    const _schools = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "school",
      week_start: _week_start,
      week_end: _week_end,
    });
    schools = _schools.map((item) => {
      return {
        id: item.school_id,
        name: item.school_name,
      };
    });
    //school列表有值 用第一个作为school_id 拉取class列表
    //school没有值 判断传进来的school_id 没有值用none
    _school_id = schools.length ? (school_id ? school_id : schools[0].id) : "none";
  }
  if (isSchool && !isOrg) {
    _school_id = mySchoolId ? mySchoolId : "none";
  }
  if (isSchool || isOrg) {
    const _classes = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "class",
      week_start: _week_start,
      week_end: _week_end,
      school_id: _school_id,
    });
    classes = _classes.map((item) => {
      return {
        id: item.class_id,
        name: item.class_name,
      };
    });
    _class_id = classes.length ? (class_id ? class_id : classes[0].id) : "none";
    const _teachers = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "teacher",
      week_start: _week_start,
      week_end: _week_end,
      school_id: _school_id,
      class_id: _class_id,
    });
    teachers = _teachers.map((item) => {
      return {
        id: item.teacher_id,
        name: item.teacher_name,
      };
    });
    _teacher_id = teachers.length ? (teacher_id ? teacher_id : teachers[0].id) : "none";
  }
  if (isTeacher && !isOrg && !isSchool) {
    const _classes = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "class",
      week_start: _week_start,
      week_end: _week_end,
      teacher_id: myUserId,
    });
    classes = _classes.map((item) => {
      return {
        id: item.class_id,
        name: item.class_name,
      };
    });
    _class_id = classes.length ? (class_id ? class_id : classes[0].id) : "none";
    const _students = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "student",
      week_start: _week_start,
      week_end: _week_end,
      class_id: _class_id,
    });
    students = _students.map((item) => {
      return {
        id: item.student_id,
        name: item.student_name,
      };
    });
    _student_id = students.length ? (student_id ? student_id : students[0].id) : "none";
  } else if (isOrg || isSchool) {
    const _students = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "student",
      week_start: _week_start,
      week_end: _week_end,
      school_id: _school_id,
      class_id: _class_id,
      teacher_id: _teacher_id,
    });
    students = _students.map((item) => {
      return {
        id: item.student_id,
        name: item.student_name,
      };
    });
    _student_id = students.length ? (student_id ? student_id : students[0].id) : "none";
  }
  _student_id = isOnlyStudent ? myUserId : _student_id;
  const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
    summary_type,
    filter_type: "subject",
    week_start: _week_start,
    week_end: _week_end,
    school_id: _school_id,
    class_id: _class_id,
    teacher_id: _teacher_id,
    student_id: _student_id,
  });
  subjects = _subjects.map((item) => {
    return {
      id: item.subject_id,
      name: item.subject_name,
    };
  });
  subjects.length && subjects.unshift({ id: "all", name: "All" });
  _subject_id = subjects.length ? (subject_id ? subject_id : subjects[0].id) : "none";
  const isLiveClass = summary_type === ReportType.live;
  let params: IParamsQueryLiveClassSummary = {};
  if (isOrg || isSchool) {
    params = {
      year: _year,
      week_start: _week_start,
      week_end: _week_end,
      school_id: _school_id,
      class_id: _class_id,
      teacher_id: _teacher_id,
      student_id: _student_id,
      subject_id: _subject_id,
    };
  } else if (isTeacher) {
    params = {
      year: _year,
      week_start: _week_start,
      week_end: _week_end,
      class_id: _class_id,
      teacher_id: _teacher_id,
      student_id: _student_id,
      subject_id: _subject_id,
    };
  } else if (isStudent) {
    params = {
      year: _year,
      week_start: _week_start,
      week_end: _week_end,
      student_id: _student_id,
      subject_id: _subject_id,
    };
  }
  if (_student_id && _subject_id && _student_id !== "none" && _subject_id !== "none" && _year && _week_start && _week_end) {
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
  return { years, weeks, schools, classes, teachers, students, subjects, summary_type, ...params };
});

export interface IParamsGetAfterClassFilter extends IParamQueryRemainFilter {
  isOrg: boolean;
  isSchool: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}
export type IResultGetAfterClassFilter = {
  classes?: ArrProps[];
  school_id?: string;
  teachers?: ArrProps[];
  students?: ArrProps[];
  subjects?: ArrProps[];
  class_id?: string;
  teacher_id?: string;
  student_id?: string;
  subject_id?: string;
  summary_type: string;
  filter_type: string;
};
export const getAfterClassFilter = createAsyncThunk<
  IResultGetAfterClassFilter,
  IParamsGetAfterClassFilter & LoadingMetaPayload,
  { state: RootState }
>("getAfterClassFilter", async (query, { dispatch }) => {
  const {
    summary_type,
    filter_type,
    school_id,
    class_id,
    teacher_id,
    student_id,
    week_start,
    week_end,
    isOrg,
    isSchool,
    isTeacher,
  } = query;
  let classes: ArrProps[] = [];
  let teachers: ArrProps[] = [];
  let students: ArrProps[] = [];
  let subjects: ArrProps[] = [];
  let _class_id: string | undefined = "";
  let _teacher_id: string | undefined = "";
  let _student_id: string | undefined = "";
  let _subject_id: string | undefined = "";
  if (filter_type === "class") {
    const _classes = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type,
      week_start,
      week_end,
      school_id,
    });
    classes = _classes.map((item) => {
      return {
        id: item.class_id,
        name: item.class_name,
      };
    });
    _class_id = classes.length ? classes[0].id : "none";
  }
  if (filter_type === "teacher" || filter_type === "class") {
    if (isOrg || isSchool) {
      _class_id = filter_type === "class" ? _class_id : class_id;
      const _teachers = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "teacher",
        week_start,
        week_end,
        school_id,
        class_id: _class_id,
      });
      teachers = _teachers.map((item) => {
        return {
          id: item.teacher_id,
          name: item.teacher_name,
        };
      });
      _teacher_id = teachers.length ? teachers[0].id : "none";
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start,
        week_end,
        school_id,
        class_id: _class_id,
        teacher_id: _teacher_id,
      });
      students = _students.map((item) => {
        return {
          id: item.student_id,
          name: item.student_name,
        };
      });
      _student_id = students.length ? students[0].id : "none";
    } else if (isTeacher) {
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start,
        week_end,
        class_id,
      });
      students = _students.map((item) => {
        return {
          id: item.student_id,
          name: item.student_name,
        };
      });
      _student_id = students.length ? students[0].id : "";
    }
  }
  if (filter_type === "student") {
    if (isOrg || isSchool) {
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type,
        week_start,
        week_end,
        school_id,
        class_id,
        teacher_id,
      });
      students = _students.map((item) => {
        return {
          id: item.student_id,
          name: item.student_name,
        };
      });
      _student_id = students.length ? students[0].id : "none";
    } else if (isTeacher) {
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type,
        week_start,
        week_end,
        teacher_id,
        class_id,
      });
      students = _students.map((item) => {
        return {
          id: item.student_id,
          name: item.student_name,
        };
      });
      _student_id = students.length ? students[0].id : "none";
    }
  }
  if (filter_type === "teacher" || filter_type === "student" || filter_type === "class") {
    const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "subject",
      week_start,
      week_end,
      school_id,
      class_id,
      teacher_id,
      student_id: _student_id,
    });
    subjects = _subjects.map((item) => {
      return {
        id: item.subject_id,
        name: item.subject_name,
      };
    });
    subjects.length && subjects.unshift({ id: "all", name: "All" });
    _subject_id = subjects.length ? subjects[0].id : "none";
  }
  if (filter_type === "subject") {
    if (isOrg || isSchool || isTeacher) {
      const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "subject",
        week_start,
        week_end,
        school_id,
        class_id,
        teacher_id,
        student_id: student_id,
      });
      subjects = _subjects.map((item) => {
        return {
          id: item.subject_id,
          name: item.subject_name,
        };
      });
      subjects.length && subjects.unshift({ id: "all", name: "All" });
      _subject_id = subjects.length ? subjects[0].id : "none";
    } else {
      const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type,
        week_start,
        week_end,
        student_id,
      });
      subjects = _subjects.map((item) => {
        return {
          id: item.subject_id,
          name: item.subject_name,
        };
      });
      subjects.length && subjects.unshift({ id: "all", name: "All" });
      _subject_id = subjects.length ? subjects[0].id : "none";
    }
  }
  // const {
  //   report: { summaryReportOptions },
  // } = getState();
  const resParams = {
    school_id: school_id,
    class_id: class_id ? class_id : _class_id,
    teacher_id: teacher_id ? teacher_id : _teacher_id,
    student_id: student_id ? student_id : _student_id,
    subject_id: _subject_id,
  };
  const params = {
    metaLoading: true,
    week_start,
    week_end,
    ...resParams,
  };
  if (params.student_id && params.subject_id && params.student_id !== "none" && params.subject_id !== "none") {
    summary_type === ReportType.live ? dispatch(getLiveClassesSummary({ ...params })) : dispatch(getAssignmentSummary({ ...params }));
  }
  if (filter_type === "class") {
    return {
      classes,
      teachers,
      students,
      subjects,
      ...resParams,
      summary_type,
      filter_type,
    };
  } else if (filter_type === "teacher") {
    return {
      teachers,
      students,
      subjects,
      ...resParams,
      summary_type,
      filter_type,
    };
  } else if (filter_type === "student") {
    return {
      students,
      subjects,
      ...resParams,
      summary_type,
      filter_type,
    };
  } else {
    return {
      subjects,
      ...resParams,
      summary_type,
      filter_type,
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

type GetClassesAssignmentsPayload = Parameters<typeof api.reports.getClassesAssignments>[0];

export const getClassesAssignments = createAsyncThunk<EntityClassesAssignmentsView[], GetClassesAssignmentsPayload & LoadingMetaPayload>(
  "getClassesAssignments",
  async ({ metaLoading, ...query }) => {
    return await api.reports.getClassesAssignments(query);
  }
);

type GetClassesAssignmentsOverviewPayload = Parameters<typeof api.reports.getClassesAssignmentsOverview>[0];
export const getClassesAssignmentsOverview = createAsyncThunk<
  EntityClassesAssignmentOverView[],
  GetClassesAssignmentsOverviewPayload & LoadingMetaPayload
>("getClassesAssignmentsOverview", async ({ metaLoading, ...query }) => {
  const { class_ids, durations } = query;
  return await api.reports.getClassesAssignmentsOverview({ class_ids, durations });
});

type GetClassesAssignmentsUnattendedPayloadQuery = Parameters<typeof api.reports.getClassesAssignmentsUnattended>[1];
export const getClassesAssignmentsUnattended = createAsyncThunk<
  EntityClassesAssignmentsUnattendedStudentsView[],
  { class_id: string; query: GetClassesAssignmentsUnattendedPayloadQuery } & LoadingMetaPayload
>("getClassesAssignmentsUnattended", async ({ metaLoading, class_id, query }) => {
  const data = await api.reports.getClassesAssignmentsUnattended(class_id, query);
  const userIds = data.map((d) => d.student_id);
  const filter = {
    OR: userIds.map((id) => ({
      userId: {
        operator: UuidOperator.Eq,
        value: id,
      },
    })),
  } as UserFilter;
  const resp = await gqlapi.query<GetStudentNameByIdQuery, GetStudentNameByIdQueryVariables>({
    query: GetStudentNameByIdDocument,
    variables: {
      filter,
    },
  });
  const userNames = resp.data.usersConnection?.edges?.reduce((prev: IObj, cur) => {
    if (cur?.node?.id) {
      prev[cur?.node?.id] = `${cur.node?.givenName || ""} ${cur.node?.familyName || ""}`;
    }
    return prev;
  }, {}) as IObj;
  return data.map((d) => {
    d.student_name = d.student_id ? userNames[d.student_id] || "" : "";
    return d;
  });
});

const { actions, reducer } = createSlice({
  name: "report ",
  initialState,
  reducers: {
    resetSummaryOptions: (state, { payload }: PayloadAction<TimeFilter>) => {
      state.summaryReportOptions.year = payload.year ? payload.year : state.summaryReportOptions.year;
      state.summaryReportOptions.week_start = payload.week_start;
      state.summaryReportOptions.week_end = payload.week_end;
      state.summaryReportOptions.years = payload.years ? payload.years : state.summaryReportOptions.years;
      state.summaryReportOptions.weeks = payload.weeks ? payload.weeks : state.summaryReportOptions.weeks;
      state.summaryReportOptions.schools = [];
      state.summaryReportOptions.school_id = payload.school_id ? payload.school_id : "";
      state.summaryReportOptions.classes = [];
      state.summaryReportOptions.class_id = "";
      state.summaryReportOptions.teachers = [];
      state.summaryReportOptions.teacher_id = "";
      state.summaryReportOptions.students = [];
      state.summaryReportOptions.student_id = "";
      state.summaryReportOptions.subjects = [];
      state.summaryReportOptions.subject_id = "";
    },
  },
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
    [getSchoolsByOrg.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getSchoolsByOrg>>) => {
      const classes = payload[1].data.organization?.classes as Pick<Class, "class_id" | "class_name" | "schools">[];
      const schools = payload[1].data.organization?.schools as Pick<School, "classes" | "school_id" | "school_name">[];
      const myPermissionsAndClassesTeaching = payload[0].data.me;
      const membership = payload[0].data.me?.membership;
      const noneSchoolClasses = classes.filter((item) => (item?.schools || []).length === 0);

      const schoolIDs =
        membership?.schoolMemberships?.map((item) => {
          return item?.school_id;
        }) || [];
      const classIDs =
        membership?.classesTeaching?.map((item) => {
          return item?.class_id;
        }) || [];
      const permissions = hasPermissionOfMe(
        [
          PermissionType.student_usage_report_657,
          PermissionType.report_organization_student_usage_654,
          PermissionType.report_school_student_usage_655,
          PermissionType.report_teacher_student_usage_656,
        ],
        myPermissionsAndClassesTeaching
      );
      state.studentUsage.organization_id = membership?.organization_id || "";
      if (permissions[PermissionType.report_organization_student_usage_654]) {
        state.studentUsage.schoolList = schools;
        state.studentUsage.noneSchoolClasses = noneSchoolClasses;
      } else if (permissions[PermissionType.report_school_student_usage_655]) {
        state.studentUsage.schoolList = schools.filter((school) => {
          return schoolIDs.indexOf(school.school_id) >= 0;
        });
      } else if (permissions[PermissionType.report_teacher_student_usage_656]) {
        state.studentUsage.schoolList = schools.reduce((prev, cur) => {
          const classes = cur.classes?.filter((item) => classIDs.indexOf(item?.class_id) >= 0);
          if (classes && classes.length > 0) {
            prev.push({
              school_id: cur.school_id,
              school_name: cur.school_name,
              classes,
            } as never);
          }
          return prev;
        }, []);
        state.studentUsage.noneSchoolClasses = noneSchoolClasses.filter((item) => {
          return classIDs.indexOf(item.class_id) >= 0;
        });
      }
    },
    [getSchoolsByOrg.rejected.type]: (state, { error }: any) => {
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

    [getStudentUsageMaterial.fulfilled.type]: (state, { payload }) => {
      state.studentUsageReport = payload;
    },
    [getStudentUsageMaterial.rejected.type]: (state) => {},
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
      state.summaryReportOptions = initialState.summaryReportOptions;
    },
    [onLoadLearningSummary.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadLearningSummary>>) => {
      state.summaryReportOptions = payload;
      if (!payload.student_id || !payload.subject_id || payload.student_id === "none" || payload.subject_id === "none") {
        payload.summary_type === ReportType.live
          ? (state.liveClassSummary = initialState.liveClassSummary)
          : (state.assignmentSummary = initialState.assignmentSummary);
      }
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
      if (payload.filter_type === "class") {
        state.summaryReportOptions.school_id = payload.school_id;
        state.summaryReportOptions.class_id = payload.class_id;
        state.summaryReportOptions.teacher_id = payload.teacher_id;
        state.summaryReportOptions.student_id = payload.student_id;
      } else if (payload.filter_type === "teacher" || payload.filter_type === "student") {
        state.summaryReportOptions.class_id = payload.class_id;
        state.summaryReportOptions.teacher_id = payload.teacher_id;
        state.summaryReportOptions.student_id = payload.student_id;
        state.summaryReportOptions.student_id = payload.student_id;
      } else {
        state.summaryReportOptions.student_id = payload.student_id;
        state.summaryReportOptions.student_id = payload.student_id;
      }
      if (payload.classes) {
        state.summaryReportOptions.classes = payload.classes;
      }
      if (payload.teachers) {
        state.summaryReportOptions.teachers = payload.teachers;
      }
      if (payload.students) {
        state.summaryReportOptions.students = payload.students;
      }
      if (payload.subjects) {
        state.summaryReportOptions.subjects = payload.subjects;
        state.summaryReportOptions.subject_id = payload.subject_id;
      }
      if (payload.student_id === "none" || payload.subject_id === "none") {
        payload.summary_type === ReportType.live ? (state.liveClassSummary = {}) : (state.assignmentSummary = {});
      }
    },
    [getClassesAssignmentsUnattended.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassesAssignmentsUnattended>>
    ) => {
      // @ts-ignore
      state.classesAssignmentsUnattend = payload;
    },
    [getClassesAssignments.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassesAssignments>>) => {
      state.classesAssignments = payload;
    },
    [getClassesAssignmentsOverview.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassesAssignmentsOverview>>
    ) => {
      state.overview = payload;
    },
  },
});
export const { resetSummaryOptions } = actions;
export default reducer;
