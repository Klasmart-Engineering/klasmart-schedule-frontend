import {
  Class,
  ClassesConnectionResponse,
  ClassFilter,
  Program,
  School,
  Subject,
  User,
  UserFilter,
  UuidFilter,
  UuidOperator,
} from "@api/api-ko-schema.auto";
import api, { gqlapi } from "@api/index";
import { ApolloQueryResult } from "@apollo/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { orderByASC } from "@utilities/dataUtilities";
import { WritableDraft } from "immer/dist/types/types-external";
import { cloneDeep, pick, uniq, uniqBy } from "lodash";
import {
  ClassesConnectionDocument,
  ClassesConnectionQuery,
  ClassesConnectionQueryVariables,
  ClassesSchoolsByOrganizationDocument,
  ClassesSchoolsByOrganizationQuery,
  ClassesSchoolsByOrganizationQueryVariables,
  ClassesTeachersByOrganizationQuery,
  ClassStudentsByOrganizationQuery,
  GetMyIdDocument,
  GetMyIdQuery,
  GetMyIdQueryVariables,
  GetStudentNameByIdDocument,
  GetStudentNameByIdQuery,
  GetStudentNameByIdQueryVariables,
  MyPermissionsAndClassesTeachingQueryDocument,
  MyPermissionsAndClassesTeachingQueryQuery,
  MyPermissionsAndClassesTeachingQueryQueryVariables,
  SchoolsByOrganizationQuery,
  SchoolsIdNameByOrganizationDocument,
  SchoolsIdNameByOrganizationQuery,
  SchoolsIdNameByOrganizationQueryVariables,
  StudentsByOrganizationDocument,
  StudentsByOrganizationQuery,
  StudentsByOrganizationQueryVariables,
  TeacherByOrgIdDocument,
  TeacherByOrgIdQuery,
  TeacherByOrgIdQueryVariables,
} from "../api/api-ko.auto";
import {
  EntityAssignmentCompletionRate,
  EntityAssignmentRequest,
  EntityClassAttendanceRequest,
  EntityClassAttendanceResponse,
  EntityClassesAssignmentOverView,
  EntityClassesAssignmentsUnattendedStudentsView,
  EntityClassesAssignmentsView,
  EntityLearnOutcomeAchievementRequest,
  EntityLearnOutcomeAchievementResponse,
  EntityQueryAssignmentsSummaryResult,
  EntityQueryLiveClassesSummaryResult,
  EntityReportListTeachingLoadArgs,
  EntityReportListTeachingLoadResult,
  EntityScheduleShortInfo,
  EntityStudentAchievementReportCategoryItem,
  EntityStudentAchievementReportItem,
  // EntityStudentPerformanceH5PReportItem,
  EntityStudentPerformanceReportItem,
  EntityStudentUsageMaterialReportRequest,
  EntityStudentUsageMaterialReportResponse,
  EntityStudentUsageMaterialViewCountReportResponse,
  EntityTeacherLoadAssignmentRequest,
  EntityTeacherLoadAssignmentResponseItem,
  EntityTeacherLoadLesson,
  EntityTeacherLoadLessonRequest,
  EntityTeacherLoadLessonSummary,
  EntityTeacherLoadMissedLessonsRequest,
  EntityTeacherLoadMissedLessonsResponse,
  // EntityStudentsPerformanceH5PReportItem,
  EntityTeacherReportCategory,
} from "../api/api.auto";
import { apiWaitForOrganizationOfPage } from "../api/extra";
import PermissionType from "../api/PermissionType";
import { IParamQueryRemainFilter } from "../api/type";
import { d } from "../locale/LocaleManager";
import {
  formatTimeToMonDay,
  getAllUsers,
  getAssignmentCompletionFeedback,
  getClassAttendanceFeedback,
  getLearnOutcomeAchievementFeedback,
  getTimeOffSecond,
  sortByStudentName,
} from "../models/ModelReports";
import { ReportFilter, ReportOrderBy } from "../pages/ReportAchievementList/types";
import { IWeeks } from "../pages/ReportLearningSummary";
import {
  ArrProps,
  QueryLearningSummaryCondition,
  QueryLearningSummaryTimeFilterCondition,
  ReportType,
  TimeFilter,
  UserType,
} from "../pages/ReportLearningSummary/types";
import permissionCache, { ICacheData } from "../services/permissionCahceService";
import programsHandler from "./contentEdit/programsHandler";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { AsyncReturnType, AsyncTrunkReturned } from "./type";
interface IreportState {
  reportList?: EntityStudentAchievementReportItem[];
  achievementDetail?: EntityStudentAchievementReportCategoryItem[];
  lessonPlanList: EntityScheduleShortInfo[];
  student_name: string | undefined;
  reportMockOptions: GetReportMockOptionsResponse;
  categories: EntityTeacherReportCategory[];
  classesConnection: ClassesConnectionQuery["classesConnection"];
  classes: TeacherByOrgIdQuery["organization"];
  teacherList: Item[];
  stuReportList?: EntityStudentPerformanceReportItem[];
  stuReportDetail?: EntityStudentPerformanceReportItem[];
  h5pReportDetail?: [];
  studentList: Pick<User, "user_id" | "user_name">[];
  studentUsage: {
    organization_id: string;
    schoolList: Pick<School, "classes" | "school_id" | "school_name" | "status">[];
    noneSchoolClasses: Pick<Class, "class_id" | "class_name">[];
  };
  learningSummary: {
    schoolList: Pick<School, "classes" | "school_id" | "school_name">[];
    noneSchoolClasses: Pick<Class, "students" | "class_id" | "class_name">[];
    schools: UserType[];
    freedomClass: any[];
    time: {
      year?: number;
      weeks?: IWeeks[];
    }[];
  };

  optionalData: {
    getMyPermissionClassAndTeaching: {
      res: ApolloQueryResult<MyPermissionsAndClassesTeachingQueryQuery> | undefined;
      organization_id: string;
    };
    getStudentOrganizationDocument: {
      res: ApolloQueryResult<MyPermissionsAndClassesTeachingQueryQuery> | undefined;
      organization_id: string;
    };
    getClassesSchoolsByOrganization: {
      res: ApolloQueryResult<ClassesSchoolsByOrganizationQuery> | undefined;
      organization_id: string;
    };
    getSchoolsIdNameByOrganizationDocument: {
      res: ApolloQueryResult<SchoolsIdNameByOrganizationQuery> | undefined;
      organization_id: string;
    };
  };
  schoolClassesTeachers: {
    schoolList: Pick<School, "classes" | "school_id" | "school_name">[];
    classList: Pick<Class, "class_id" | "class_name" | "schools">[];
    classTeacherList: Pick<Class, "class_id" | "teachers">[];
    hasNoneSchoolClasses: boolean;
    canSelectTeacher: boolean;
  };

  schoolClassesStudentsSubjects: {
    schoolList: Pick<School, "school_id" | "school_name">[];
    classList: Pick<Class, "class_id" | "class_name" | "schools" | "students">[];
    noneSchoolClassList: Pick<Class, "class_id" | "class_name" | "schools" | "students">[];
    programs: Pick<Program, "id" | "name" | "subjects">[];
    canSelectStudent: boolean;
  };

  teacherLoadLesson: {
    list: EntityTeacherLoadLesson[];
    statistic: EntityTeacherLoadLessonSummary;
  };
  studentUsageReport: [EntityStudentUsageMaterialReportResponse, EntityStudentUsageMaterialViewCountReportResponse];
  teachingLoadOnload: TeachingLoadResponse;
  liveClassSummary: EntityQueryLiveClassesSummaryResult;
  assignmentSummary: EntityQueryAssignmentsSummaryResult;
  summaryReportOptions: IResultLearningSummary;
  classesAssignmentsUnattend: EntityClassesAssignmentsUnattendedStudentsView[];
  classesAssignments: EntityClassesAssignmentsView[];
  overview: EntityClassesAssignmentOverView[];
  teacherLoadAssignment: EntityTeacherLoadAssignmentResponseItem[];
  next7DaysLessonLoadList: EntityReportListTeachingLoadResult["items"];
  listTeacherMissedLessons: EntityTeacherLoadMissedLessonsResponse;
  assignmentsCompletion: EntityAssignmentCompletionRate[];
  learnOutcomeClassAttendance: EntityClassAttendanceResponse;
  learnOutcomeAchievement: EntityLearnOutcomeAchievementResponse;
  fourWeekslearnOutcomeAchievementMassage: string;
  fourWeeksAssignmentsCompletionMassage: string;
  fourWeeksClassAttendanceMassage: string;
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
  categories: [],
  classesConnection: {},
  classes: {},
  teacherList: [],
  teacherLoadLesson: {
    list: [],
    statistic: {},
  },
  optionalData: {
    getMyPermissionClassAndTeaching: {
      res: undefined,
      organization_id: "",
    },
    getStudentOrganizationDocument: {
      res: undefined,
      organization_id: "",
    },
    getClassesSchoolsByOrganization: {
      res: undefined,
      organization_id: "",
    },
    getSchoolsIdNameByOrganizationDocument: {
      res: undefined,
      organization_id: "",
    },
  },
  studentUsageReport: [{ class_usage_list: [] }, { content_usage_list: [] }],
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
  learningSummary: {
    schoolList: [],
    noneSchoolClasses: [],
    schools: [],
    freedomClass: [],
    time: [],
  },

  schoolClassesTeachers: {
    schoolList: [],
    classList: [],
    classTeacherList: [],
    hasNoneSchoolClasses: false,
    canSelectTeacher: true,
  },
  schoolClassesStudentsSubjects: {
    schoolList: [],
    classList: [],
    noneSchoolClassList: [],
    programs: [],
    canSelectStudent: false,
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
  teacherLoadAssignment: [],
  next7DaysLessonLoadList: [],
  listTeacherMissedLessons: {},
  assignmentsCompletion: [],
  learnOutcomeClassAttendance: {},
  learnOutcomeAchievement: {},
  fourWeekslearnOutcomeAchievementMassage: "",
  fourWeeksAssignmentsCompletionMassage: "",
  fourWeeksClassAttendanceMassage: "",
};

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

export const getLessonPlan = createAsyncThunk<
  AsyncReturnType<typeof api.schedulesLessonPlans.getLessonPlans>,
  Parameters<typeof api.schedulesLessonPlans.getLessonPlans>[0] & LoadingMetaPayload
>("getLessonPlan", async ({ metaLoading, teacher_id, class_id }) => {
  return await api.schedulesLessonPlans.getLessonPlans({ teacher_id, class_id });
});

/**
 *
 *  dropdown structure:  schools | class
 *
 */

export const getSchoolsByOrg = createAsyncThunk<
  [ICacheData, ApolloQueryResult<MyPermissionsAndClassesTeachingQueryQuery>, ApolloQueryResult<SchoolsByOrganizationQuery>],
  LoadingMetaPayload,
  { state: RootState }
>("getSchoolsByOrg", async ({ metaLoading }, { dispatch }) => {
  return await Promise.all([
    permissionCache.usePermission([
      PermissionType.student_usage_report_657,
      PermissionType.report_organization_student_usage_654,
      PermissionType.report_school_student_usage_655,
      PermissionType.report_teacher_student_usage_656,
    ]),
    dispatch(getMyPermissionClassAndTeaching())
      .unwrap()
      .then((res) => res.res),
    dispatch(getStudentOrganizationDocument())
      .unwrap()
      .then((res) => res.res),
  ]);
});

export const getStudentsByOrg = createAsyncThunk<
  [ICacheData, ApolloQueryResult<MyPermissionsAndClassesTeachingQueryQuery>, ApolloQueryResult<StudentsByOrganizationQuery>],
  LoadingMetaPayload,
  { state: RootState }
>("getStudentsByOrg", async ({ metaLoading }, { dispatch }) => {
  return await Promise.all([
    permissionCache.usePermission([
      PermissionType.report_learning_summary_org_652,
      PermissionType.report_learning_summary_school_651,
      PermissionType.report_learning_summary_teacher_650,
      PermissionType.report_learning_summary_student_649,
    ]),
    dispatch(getMyPermissionClassAndTeaching())
      .unwrap()
      .then((res) => res.res),
    dispatch(getStudentOrganizationDocument())
      .unwrap()
      .then((res) => res.res),
  ]);
});

export const getMyPermissionClassAndTeaching = createAsyncThunk<
  { res: ApolloQueryResult<MyPermissionsAndClassesTeachingQueryQuery>; organization_id: string },
  {} | undefined,
  { state: RootState }
>("getMyPermissionClassAndTeaching", async (p, { getState }) => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  const {
    report: { optionalData },
  } = getState();
  if (
    optionalData.getMyPermissionClassAndTeaching.organization_id === organization_id &&
    optionalData.getMyPermissionClassAndTeaching.res
  ) {
    return {
      res: optionalData.getMyPermissionClassAndTeaching.res,
      organization_id: optionalData.getMyPermissionClassAndTeaching.organization_id,
    };
  }
  const res = await gqlapi.query<MyPermissionsAndClassesTeachingQueryQuery, MyPermissionsAndClassesTeachingQueryQueryVariables>({
    query: MyPermissionsAndClassesTeachingQueryDocument,
    variables: {
      organization_id,
    },
  });
  return {
    organization_id,
    res,
  };
});

export const getStudentOrganizationDocument = createAsyncThunk<
  { res: ApolloQueryResult<StudentsByOrganizationQuery>; organization_id: string },
  {} | undefined,
  { state: RootState }
>("getStudentOrganizationDocument", async (p, { getState }) => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  const {
    report: { optionalData },
  } = getState();
  if (optionalData.getStudentOrganizationDocument.organization_id === organization_id && optionalData.getStudentOrganizationDocument.res) {
    return {
      res: optionalData.getStudentOrganizationDocument.res,
      organization_id: optionalData.getStudentOrganizationDocument.organization_id,
    };
  }
  const res = await gqlapi.query<StudentsByOrganizationQuery, StudentsByOrganizationQueryVariables>({
    query: StudentsByOrganizationDocument,
    variables: {
      organization_id,
    },
  });
  return {
    organization_id,
    res,
  };
});

export const getClassesSchoolsByOrganization = createAsyncThunk<
  { res: ApolloQueryResult<ClassesSchoolsByOrganizationQuery>; organization_id: string },
  {} | undefined,
  { state: RootState }
>("getClassesSchoolsByOrganization", async (p, { getState }) => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  const {
    report: { optionalData },
  } = getState();
  if (
    optionalData.getClassesSchoolsByOrganization.organization_id === organization_id &&
    optionalData.getClassesSchoolsByOrganization.res
  ) {
    return {
      res: optionalData.getClassesSchoolsByOrganization.res,
      organization_id: optionalData.getClassesSchoolsByOrganization.organization_id,
    };
  }
  const res = await gqlapi.query<ClassesSchoolsByOrganizationQuery, ClassesSchoolsByOrganizationQueryVariables>({
    query: ClassesSchoolsByOrganizationDocument,
    variables: {
      organization_id,
    },
  });
  return {
    organization_id,
    res,
  };
});

export const getSchoolsIdNameByOrganizationDocument = createAsyncThunk<
  { res: ApolloQueryResult<SchoolsIdNameByOrganizationQuery>; organization_id: string },
  {} | undefined,
  { state: RootState }
>("getSchoolsIdNameByOrganizationDocument", async (p, { getState }) => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  const {
    report: { optionalData },
  } = getState();
  if (
    optionalData.getSchoolsIdNameByOrganizationDocument.organization_id === organization_id &&
    optionalData.getSchoolsIdNameByOrganizationDocument.res
  ) {
    return {
      res: optionalData.getSchoolsIdNameByOrganizationDocument.res,
      organization_id: optionalData.getSchoolsIdNameByOrganizationDocument.organization_id,
    };
  }
  const res = await gqlapi.query<SchoolsIdNameByOrganizationQuery, SchoolsIdNameByOrganizationQueryVariables>({
    query: SchoolsIdNameByOrganizationDocument,
    variables: {
      organization_id,
    },
  });
  return {
    organization_id,
    res,
  };
});
/**
 *
 *  dropdown structure:  schools | teacher | class
 *
 */

export const getTeachersByOrg = createAsyncThunk<
  [
    ICacheData,
    ApolloQueryResult<MyPermissionsAndClassesTeachingQueryQuery>,
    ApolloQueryResult<ClassesSchoolsByOrganizationQuery>,
    ApolloQueryResult<SchoolsIdNameByOrganizationQuery>,
    ApolloQueryResult<ClassesTeachersByOrganizationQuery>
  ],
  LoadingMetaPayload,
  { state: RootState }
>("getTeachersByOrg", async ({ metaLoading }, { dispatch }) => {
  return await Promise.all([
    permissionCache.usePermission([
      PermissionType.report_organization_teaching_load_617,
      PermissionType.report_school_teaching_load_618,
      PermissionType.report_my_teaching_load_619,
    ]),
    dispatch(getMyPermissionClassAndTeaching())
      .unwrap()
      .then((res) => res.res),
    dispatch(getClassesSchoolsByOrganization())
      .unwrap()
      .then((res) => res.res),
    dispatch(getSchoolsIdNameByOrganizationDocument())
      .unwrap()
      .then((res) => res.res),
    dispatch(getStudentOrganizationDocument())
      .unwrap()
      .then((res) => res.res),
  ]);
});

/**
 *
 *  dropdown structure:  schools | class | student | subject
 *
 */

export const getStudentSubjectsByOrg = createAsyncThunk<
  [
    ICacheData,
    ApolloQueryResult<MyPermissionsAndClassesTeachingQueryQuery>,
    ApolloQueryResult<ClassesSchoolsByOrganizationQuery>,
    ApolloQueryResult<SchoolsIdNameByOrganizationQuery>,
    ApolloQueryResult<ClassStudentsByOrganizationQuery>,
    Pick<Program, "id" | "name" | "subjects">[] | Pick<Program, "id" | "name">[]
  ],
  LoadingMetaPayload,
  { state: RootState }
>("getStudentSubjectsByOrg", async ({ metaLoading }, { dispatch }) => {
  return await Promise.all([
    permissionCache.usePermission([
      PermissionType.report_student_progress_organization_658,
      PermissionType.report_student_progress_school_659,
      PermissionType.report_student_progress_teacher_660,
      PermissionType.report_student_progress_student_661,
    ]),
    dispatch(getMyPermissionClassAndTeaching())
      .unwrap()
      .then((res) => res.res),
    dispatch(getClassesSchoolsByOrganization())
      .unwrap()
      .then((res) => res.res),
    dispatch(getSchoolsIdNameByOrganizationDocument())
      .unwrap()
      .then((res) => res.res),
    dispatch(getStudentOrganizationDocument())
      .unwrap()
      .then((res) => res.res),
    programsHandler.getProgramsOptions(true, true),
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
export interface GetReportMockOptionsResponse {
  teacherList: Item[];
  classList: Item[];
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

export const reportOnload = createAsyncThunk<
  GetReportMockOptionsResponse,
  GetReportMockOptionsPayLoad & LoadingMetaPayload,
  { state: RootState }
>("reportOnload", async ({ teacher_id, class_id, lesson_plan_id, status, sort_by }, { getState, dispatch }) => {
  let reportList: EntityStudentAchievementReportItem[] = [];
  let lessonPlanList: EntityScheduleShortInfo[] = [];
  let finalTearchId: string = "";
  // await dispatch(getTeachersAndClasses({}));
  await dispatch(getTeacherAndClassOld({}));
  const {
    report: { teacherList, classes },
  } = getState();
  if (!teacherList.length) {
    return {
      teacherList: [],
      classList: [],
      lessonPlanList: [],
      teacher_id: "",
      class_id: "",
      lesson_plan_id: "",
    };
  }
  finalTearchId = teacher_id || (teacherList && teacherList[0]?.id) || "";
  let classList: Item[] = [];
  // classesConnection?.edges?.forEach((item) => {
  //   if (!!item?.node?.teachersConnection?.edges?.find((teacherItem) => teacherItem?.node?.id === teacherList[0].id)) {
  //     classList = classList.concat([{ id: item?.node?.id, name: item?.node?.name || "" }]);
  //   }
  // });
  classes?.classes?.forEach((item) => {
    if (!!item?.teachers?.find((teacherItem) => teacherItem?.user_id === (teacher_id || teacherList[0].id))) {
      classList = classList.concat([{ id: item.class_id, name: item.class_name || "" }]);
    }
  });
  classList = orderByASC(uniqBy(classList, "id"), "name");
  const firstClassId = classList.length ? classList[0]?.id : "";
  const finalClassId = class_id ? class_id : firstClassId;

  //获取plan_id
  if (finalTearchId && finalClassId) {
    const data = await api.schedulesLessonPlans.getLessonPlans({
      teacher_id: finalTearchId,
      class_id: finalClassId,
    });
    lessonPlanList = orderByASC(data || [], "name");
  }
  const finalPlanId = lesson_plan_id ? lesson_plan_id : lessonPlanList[0]?.id;
  if (finalPlanId) {
    const items = await api.reports.listStudentsAchievementReport({
      teacher_id: finalTearchId,
      class_id: finalClassId || "",
      lesson_plan_id: finalPlanId,
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
});

export const resetReportMockOptions = createAsyncThunk<null>("report/resetReportMockOptions", () => {
  return null;
});
export interface Item {
  id: string;
  name?: string;
}
export interface getTeachersAndClassesReturnType {
  teacherList: Item[];
  classesConnection: ClassesConnectionQuery["classesConnection"];
}
export const getTeachersAndClasses = createAsyncThunk<getTeachersAndClassesReturnType, LoadingMetaPayload>(
  "report/getTeachersAndClasses",
  async () => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    const {
      data: { myUser },
    } = await gqlapi.query<GetMyIdQuery, GetMyIdQueryVariables>({
      query: GetMyIdDocument,
    });
    const my_id = myUser?.node?.id || "";
    const mySchoolIDs =
      myUser?.node?.schoolMembershipsConnection?.edges?.map((item) => item?.node?.school?.id || "").filter((item) => !!item) || [];
    const perm = await permissionCache.usePermission([
      PermissionType.view_my_reports_614,
      PermissionType.view_reports_610,
      PermissionType.view_my_school_reports_611,
      PermissionType.view_my_organizations_reports_612,
    ]);
    let teacherList: Item[] = [];
    const organizationId: UuidFilter = { operator: UuidOperator.Eq, value: organization_id };
    const classFilter: ClassFilter = { organizationId };
    let classesData: ClassesConnectionQuery["classesConnection"] = { edges: [] };
    let end = false;
    let classCursor = "";
    while (!end) {
      const {
        data: { classesConnection },
      } = await gqlapi.query<ClassesConnectionQuery, ClassesConnectionQueryVariables>({
        query: ClassesConnectionDocument,
        variables: { classFilter, classCursor },
      });
      const edges = classesData?.edges?.concat(classesConnection?.edges || []) as ClassesConnectionResponse["edges"];
      classesData = { edges };
      if (!classesConnection?.pageInfo?.hasNextPage) {
        end = true;
      } else {
        classCursor = classesConnection?.pageInfo?.endCursor as string;
      }
    }

    if (perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612) {
      if (perm.view_my_organizations_reports_612 || perm.view_reports_610) {
        classesData?.edges?.forEach((item) => {
          teacherList = teacherList.concat(
            item?.node?.teachersConnection?.edges?.map((teacherItem) => ({
              id: teacherItem?.node?.id || "",
              name: teacherItem?.node?.givenName + "" + teacherItem?.node?.familyName,
            })) || []
          );
        });
      }
      if ((!perm.view_my_organizations_reports_612 && perm.view_my_school_reports_611) || perm.view_reports_610) {
        classesData?.edges
          ?.filter((item) => {
            return mySchoolIDs.find((mySchoolId) => item?.node?.schools?.find((schoolItem) => schoolItem.id === mySchoolId));
          })
          .forEach((item) => {
            teacherList = teacherList.concat(
              item?.node?.teachersConnection?.edges?.map((teacherItem) => ({
                id: teacherItem?.node?.id || "",
                name: teacherItem?.node?.givenName + "" + teacherItem?.node?.familyName,
              })) || []
            );
          });
      }
    } else if (perm.view_my_reports_614) {
      teacherList = [{ id: my_id, name: myUser?.node?.givenName + " " + myUser?.node?.familyName || "" }];
    }
    teacherList = orderByASC(uniqBy(teacherList, "id"), "name");
    return { teacherList, classesConnection: classesData };
  }
);
interface GetTeacherAndClassOld {
  teacherList: Item[];
  classes: TeacherByOrgIdQuery["organization"];
}
export const getTeacherAndClassOld = createAsyncThunk<GetTeacherAndClassOld, LoadingMetaPayload & { teacher_id?: string }>(
  "report/getTeacherAndClassOld",
  async ({ teacher_id, metaLoading }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    const {
      data: { myUser },
    } = await gqlapi.query<GetMyIdQuery, GetMyIdQueryVariables>({
      query: GetMyIdDocument,
    });
    const mySchoolIDs =
      myUser?.node?.schoolMembershipsConnection?.edges?.map((item) => item?.node?.school?.id || "").filter((item) => !!item) || [];
    let teacherList: Item[] = [];
    const perm = await permissionCache.usePermission([
      PermissionType.view_my_reports_614,
      PermissionType.view_reports_610,
      PermissionType.view_my_organizations_reports_612,
      PermissionType.view_my_school_reports_611,
    ]);
    const { data } = await gqlapi.query<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>({
      query: TeacherByOrgIdDocument,
      variables: {
        organization_id,
      },
    });
    let classes: TeacherByOrgIdQuery["organization"] = data.organization;
    if (perm.view_my_reports_614 && !perm.view_reports_610 && !perm.view_my_school_reports_611 && !perm.view_my_organizations_reports_612) {
      teacherList = [{ id: myUser?.node?.id || "", name: myUser?.node?.givenName + " " + myUser?.node?.familyName || "" }];
    } else {
      if (perm.view_my_organizations_reports_612 || perm.view_reports_610) {
        data.organization?.classes?.forEach((classItem) => {
          teacherList = teacherList?.concat(
            classItem?.teachers?.map((teacherItem) => ({
              id: teacherItem?.user_id || "",
              name: teacherItem?.user_name || "",
            })) || []
          );
        });
      }
      if (perm.view_my_school_reports_611) {
        data.organization?.classes
          ?.filter((item) => {
            return mySchoolIDs.find((mySchoolId) => item?.schools?.find((schoolItem) => schoolItem?.school_id === mySchoolId));
          })
          ?.forEach((classItem) => {
            teacherList = teacherList?.concat(
              classItem?.teachers
                ?.filter((item) => {
                  return mySchoolIDs.find((mySchoolId) =>
                    item?.school_memberships?.find((schoolItem) => schoolItem?.school_id === mySchoolId)
                  );
                })
                ?.map((teacherItem) => ({
                  id: teacherItem?.user_id || "",
                  name: teacherItem?.user_name || "",
                })) || []
            );
          });
      }
    }
    if (perm.view_my_school_reports_611 && !perm.view_reports_610 && !perm.view_my_organizations_reports_612) {
      classes = {
        classes: data.organization?.classes?.filter((item) => {
          return mySchoolIDs.find((mySchoolId) => item?.schools?.find((schoolItem) => schoolItem?.school_id === mySchoolId));
        }),
      };
    }
    teacherList = orderByASC(uniqBy(teacherList, "id"), "name");
    return { teacherList, classes };
  }
);

export const categoryReportOnLoad = createAsyncThunk<EntityTeacherReportCategory[], getSkillCoverageReportPayload, { state: RootState }>(
  "report/categoryReportOnload",
  async ({ teacher_id, metaLoading }, { dispatch, getState }) => {
    // await dispatch(getTeachersAndClasses({}));
    await dispatch(getTeacherAndClassOld({}));
    const {
      report: { teacherList },
    } = getState();
    if (!teacher_id && !teacherList.length) return [];
    const { categories } = await api.reports.getTeacherReport(teacher_id || teacherList[0].id);
    return categories || [];
  }
);
interface getSkillCoverageReportPayload extends LoadingMetaPayload {
  teacher_id: string;
}
export const getSkillCoverageReport = createAsyncThunk<EntityTeacherReportCategory[], getSkillCoverageReportPayload>(
  "report/getSkillCoverageReport",
  async ({ teacher_id }) => {
    const { categories } = await api.reports.getTeacherReport(teacher_id);
    return categories || [];
  }
);

export const getTeachingLoadList = createAsyncThunk<
  EntityReportListTeachingLoadResult,
  EntityReportListTeachingLoadArgs & LoadingMetaPayload
>("getTeachingLoad", async (query) => {
  return await api.reports.listTeachingLoadReport(query);
});
export interface TeachingLoadPayload {
  school_id: string;
  teacher_ids: string;
  class_ids: string;
}
export interface Iitem {
  value?: string;
  label?: string;
}
export interface TeachingLoadResponse {
  schoolList?: Iitem[];
  teacherList?: Iitem[];
  classList?: Iitem[];
  teachingLoadList: EntityReportListTeachingLoadResult;
  user_id: string;
}

interface listTeacherLoadLessonsResponse {
  lessonList: EntityTeacherLoadLesson[];
  lessonSummary: EntityTeacherLoadLessonSummary;
}

interface ListTeacherLoadLessonRequest extends EntityTeacherLoadLessonRequest {
  metaLoading: boolean;
  allTeacher_ids?: string[];
}

export const getLessonTeacherLoad = createAsyncThunk<listTeacherLoadLessonsResponse, ListTeacherLoadLessonRequest>(
  "listTeacherLoadLessons",
  async ({ metaLoading, allTeacher_ids, ...query }) => {
    return {
      lessonList: await api.reports.listTeacherLoadLessons(query),
      lessonSummary: await api.reports.summaryTeacherLoadLessons({ ...query, teacher_ids: allTeacher_ids }),
    };
  }
);
export type IParamsQueryLiveClassSummary = Parameters<typeof api.reports.queryLiveClassesSummary>[0];
export type IResultQueryLiveClassSummary = AsyncReturnType<typeof api.reports.queryLiveClassesSummary>;
export const getLiveClassesSummary = createAsyncThunk<IResultQueryLiveClassSummary, IParamsQueryLiveClassSummary & LoadingMetaPayload>(
  "getLiveClassesSummary",
  async (query) => {
    const { subject_id, school_id, class_id } = query;
    const res = await api.reports.queryLiveClassesSummary({
      ...query,
      school_id: school_id === "all" || school_id === "none" ? "" : school_id,
      class_id: class_id === "all" ? "" : class_id,
      subject_id: subject_id === "all" ? "" : subject_id,
    });
    return res;
  }
);

export type IParamsQueryAssignmentSummary = Parameters<typeof api.reports.queryAssignmentsSummary>[0];
export type IResultQueryAssignmentSummary = AsyncReturnType<typeof api.reports.queryAssignmentsSummary>;
export const getAssignmentSummary = createAsyncThunk<IResultQueryAssignmentSummary, IParamsQueryAssignmentSummary & LoadingMetaPayload>(
  "getAssingmentSummary",
  async (query) => {
    const { subject_id, school_id, class_id } = query;
    const res = await api.reports.queryAssignmentsSummary({
      ...query,
      school_id: school_id === "all" || school_id === "none" ? "" : school_id,
      class_id: class_id === "all" ? "" : class_id,
      subject_id: subject_id === "all" ? "" : subject_id,
    });
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

export interface IParamsLearningSummary extends QueryLearningSummaryCondition {
  isOrg?: boolean;
  isSchool?: boolean;
  isTeacher?: boolean;
  isStudent?: boolean;
  year?: number;
  subject_id?: string;
  summary_type: QueryLearningSummaryTimeFilterCondition["summary_type"];
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
  summary_type: QueryLearningSummaryTimeFilterCondition["summary_type"];
}
export const onLoadLearningSummary = createAsyncThunk<
  IResultLearningSummary,
  IParamsLearningSummary & LoadingMetaPayload,
  { state: RootState }
>("onLoadLearningSummary", async ({ metaLoading, ...query }, { getState, dispatch }) => {
  const { week_end, week_start, year, summary_type, school_id, class_id, student_id, subject_id } = query;
  let years: number[] = [];
  let weeks: IWeeks[] = [];
  let subjects: Pick<Subject, "id" | "name">[] = [];
  let schools: ArrProps[] = [];
  let classes: ArrProps[] = [];
  let teachers: ArrProps[] = [];
  let students: ArrProps[] = [];
  let _year: number;
  let _school_id: string | undefined = "";
  let _class_id: string | undefined = "";
  let _student_id: string | undefined = "";
  let _subject_id: string | undefined = "";
  let params: IParamsQueryLiveClassSummary = {};
  // let urlParams: IParamsQueryLiveClassSummary = {};

  const {
    data: { myUser },
  } = await gqlapi.query<GetMyIdQuery, GetMyIdQueryVariables>({
    query: GetMyIdDocument,
  });
  const myUserId = myUser?.node?.id || "";
  const perm = await permissionCache.usePermission([
    PermissionType.report_learning_summary_org_652,
    PermissionType.report_learning_summary_school_651,
    PermissionType.report_learning_summary_teacher_650,
    PermissionType.report_learning_summary_student_649,
  ]);
  const isOrg = perm.report_learning_summary_org_652;
  const isSchool = perm.report_learning_summary_school_651;
  const isTeacher = perm.report_learning_summary_teacher_650;
  const isStudent = perm.report_learning_summary_student_649;
  const isOnlyStudent = isStudent && !isOrg && !isSchool && !isTeacher;
  const {
    report: { summaryReportOptions },
  } = getState();
  if (!summaryReportOptions.years.length) {
    const params = { time_offset: getTimeOffSecond(), summary_type };
    await dispatch(getTimeFilter({ ...params, metaLoading: true }));
    const {
      report: { learningSummary },
    } = getState();
    const timeFilter = learningSummary.time;
    years = timeFilter.length ? timeFilter.map((item) => item.year as number) : [];
    weeks = timeFilter.length ? timeFilter.find((item) => (item.year === year ? year : years[0]))?.weeks || [] : [];
  } else if (!summaryReportOptions.weeks.length) {
    years = summaryReportOptions.years;
    const {
      report: { learningSummary },
    } = getState();
    weeks = learningSummary.time.find((item) => item.year === year)?.weeks || [];
  } else {
    years = summaryReportOptions.years;
    weeks = summaryReportOptions.weeks;
  }
  _year = year ? year : years[0];
  const _week_start = week_start ? week_start : weeks[0].week_start;
  const _week_end = week_end ? week_end : weeks[0].week_end;
  if (isOrg || isSchool || isTeacher) {
    if (!summaryReportOptions.schools || !summaryReportOptions.schools.length) {
      await dispatch(getStudentsByOrg({ metaLoading: true }));
    }
    const {
      report: { learningSummary },
    } = getState();

    const _schools = learningSummary.schools.map((item) => ({
      id: item.id,
      name: item.name,
    }));
    schools = uniqBy(_schools, "id");
    _school_id = school_id ? school_id : "all";
    const school = learningSummary.schools.find((item) => item.id === _school_id);
    let _classes =
      school?.classes?.map((item) => ({
        id: item.id,
        name: item.name,
      })) || [];
    _classes = [{ id: "all", name: d("All").t("report_label_all") }, ...orderByASC(_classes, "name")];
    classes = uniqBy(_classes, "id");
    _class_id = class_id ? class_id : "all";
    students =
      learningSummary.schools.find((item) => item.id === _school_id)?.classes?.find((item) => item.id === _class_id)?.students || [];
    students = uniqBy(students, "id");
    students = students.slice().sort(sortByStudentName("name"));
    _student_id = students.length ? (student_id ? student_id : students[0].id) : "none";
  }
  _student_id = isOnlyStudent ? myUserId : _student_id;

  subjects = await programsHandler.getAllSubjects(true, true);

  subjects = [{ id: "all", name: d("All").t("report_label_all") }, ...subjects];
  _subject_id = subject_id ? subject_id : subjects[0].id;

  params = {
    year: _year,
    week_start: _week_start,
    week_end: _week_end,
    school_id: _school_id,
    class_id: _class_id,
    student_id: _student_id,
    subject_id: _subject_id,
  };
  if (_student_id && _subject_id && _student_id !== "none" && _year && _week_start && _week_end) {
    dispatch(getLiveClassesSummary({ ...params, metaLoading }));
    dispatch(getAssignmentSummary({ ...params, metaLoading }));
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
>("getAfterClassFilter", async (query, { getState, dispatch }) => {
  const { summary_type, filter_type, school_id, class_id, student_id, week_start, week_end } = query;
  let classes: ArrProps[] = [];
  let students: ArrProps[] = [];
  let subjects: ArrProps[] = [];
  let _class_id: string | undefined = "";
  let _student_id: string | undefined = "";
  let _subject_id: string | undefined = "";
  const {
    report: { learningSummary, summaryReportOptions },
  } = getState();
  if (filter_type === "class") {
    classes = learningSummary.schools.find((item) => item.id === school_id)?.classes || [];
    classes = uniqBy(classes, "id");
    _class_id = classes.length ? classes[0].id : "none";
  }
  _class_id = class_id ? class_id : _class_id;
  if (filter_type === "class" || filter_type === "student") {
    students =
      learningSummary.schools.find((item) => item.id === school_id)?.classes?.find((item) => item.id === _class_id)?.students || [];
    students = uniqBy(students, "id");
    students = students.slice().sort(sortByStudentName("name"));
    _student_id = students.length ? students[0].id : "none";
  }
  _student_id = student_id ? student_id : _student_id;
  if (filter_type === "class" || filter_type === "student" || filter_type === "subject") {
    subjects = summaryReportOptions.subjects || [];
    _subject_id = subjects[0].id;
  }
  const resParams = {
    school_id,
    class_id: _class_id,
    student_id: _student_id,
    subject_id: _subject_id,
  };
  const params = {
    metaLoading: true,
    week_start,
    week_end,
    school_id: school_id,
    class_id: _class_id,
    student_id: _student_id,
    subject_id: _subject_id,
  };
  if (_student_id && _subject_id && _student_id !== "none") {
    dispatch(getLiveClassesSummary({ ...params }));
    dispatch(getAssignmentSummary({ ...params }));
  }
  if (filter_type === "class") {
    return {
      classes,
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
    OR: uniq(userIds).map((id) => ({
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
export const getTeacherLoadAssignment = createAsyncThunk<
  EntityTeacherLoadAssignmentResponseItem[],
  EntityTeacherLoadAssignmentRequest & LoadingMetaPayload
>("getTeacherLoadAssignment", async ({ metaLoading, ...query }) => await api.reports.getTeacherLoadReportOfAssignment(query));
export const getTeachingLoadReport = createAsyncThunk<
  EntityReportListTeachingLoadResult,
  EntityReportListTeachingLoadArgs & LoadingMetaPayload
>("getTeachingLoadReport", async ({ metaLoading, ...query }) => await api.reports.listTeachingLoadReport(query));

export const getListTeacherMissedLessons = createAsyncThunk<
  EntityTeacherLoadMissedLessonsResponse,
  EntityTeacherLoadMissedLessonsRequest & LoadingMetaPayload
>("getListTeacherMissedLessons", async ({ metaLoading, ...query }) => await api.reports.listTeacherMissedLessons(query));

export const getAssignmentsCompletion = createAsyncThunk<EntityAssignmentCompletionRate[], EntityAssignmentRequest & LoadingMetaPayload>(
  "getAssignmentsCompletion",
  async ({ metaLoading, ...query }) => await api.reports.getAssignmentsCompletion(query)
);

export const getLearnOutcomeClassAttendance = createAsyncThunk<
  EntityClassAttendanceResponse,
  EntityClassAttendanceRequest & LoadingMetaPayload
>("getLearnOutcomeClassAttendance", async ({ metaLoading, ...query }) => await api.reports.getLearnOutcomeClassAttendance(query));

export const getLearnOutcomeAchievement = createAsyncThunk<
  EntityLearnOutcomeAchievementResponse,
  EntityLearnOutcomeAchievementRequest & LoadingMetaPayload
>("getLearnOutcomeAchievement", async ({ metaLoading, ...query }) => await api.reports.getLearnOutcomeAchievement(query));

const { actions, reducer } = createSlice({
  name: "report ",
  initialState,
  reducers: {
    resetSummaryOptions: (state, { payload }: PayloadAction<TimeFilter>) => {
      state.summaryReportOptions.year = payload.year ? payload.year : state.summaryReportOptions.year;
      state.summaryReportOptions.weeks = [];
    },
  },
  extraReducers: {
    [getAchievementList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAchievementList>>) => {
      state.reportList = payload.items || [];
    },
    [getAchievementList.rejected.type]: (state, { error }: any) => {},
    [getAchievementList.pending.type]: (state, { payload }: PayloadAction<any>) => {
      state.reportList = initialState.reportList;
    },
    [getMyPermissionClassAndTeaching.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getMyPermissionClassAndTeaching>>
    ) => {
      state.optionalData.getMyPermissionClassAndTeaching = {
        res: payload.res as WritableDraft<ApolloQueryResult<MyPermissionsAndClassesTeachingQueryQuery>>,
        organization_id: payload.organization_id,
      };
    },
    [getStudentOrganizationDocument.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getMyPermissionClassAndTeaching>>
    ) => {
      state.optionalData.getStudentOrganizationDocument = {
        res: payload.res as WritableDraft<ApolloQueryResult<MyPermissionsAndClassesTeachingQueryQuery>>,
        organization_id: payload.organization_id,
      };
    },
    [getClassesSchoolsByOrganization.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassesSchoolsByOrganization>>
    ) => {
      state.optionalData.getClassesSchoolsByOrganization = {
        res: payload.res as WritableDraft<ApolloQueryResult<ClassesSchoolsByOrganizationQuery>>,
        organization_id: payload.organization_id,
      };
    },
    [getSchoolsIdNameByOrganizationDocument.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getSchoolsIdNameByOrganizationDocument>>
    ) => {
      state.optionalData.getSchoolsIdNameByOrganizationDocument = {
        res: payload.res as WritableDraft<ApolloQueryResult<ClassesSchoolsByOrganizationQuery>>,
        organization_id: payload.organization_id,
      };
    },
    [getStudentsByOrg.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStudentsByOrg>>) => {
      const classes = payload[2].data.organization?.classes as Pick<Class, "class_id" | "class_name" | "schools" | "students">[];
      const schools = payload[2].data.organization?.schools as Pick<School, "classes" | "school_id" | "school_name">[];
      const membership = payload[1].data.me?.membership;
      const noneSchoolClasses = classes.filter((item) => (item?.schools || []).length === 0);
      const schoolIDs =
        membership?.schoolMemberships?.map((item) => {
          return item?.school_id;
        }) || [];
      const classIDs =
        membership?.classesTeaching?.map((item) => {
          return item?.class_id;
        }) || [];
      const permissions = payload[0];
      if (permissions[PermissionType.report_learning_summary_org_652]) {
        state.learningSummary.schoolList = schools;
        state.learningSummary.noneSchoolClasses = noneSchoolClasses;
        const allSchools = getAllUsers(schools, noneSchoolClasses, false);
        state.learningSummary.schools = [...allSchools];
      } else if (permissions[PermissionType.report_learning_summary_school_651]) {
        state.learningSummary.schoolList = schools.filter((school) => {
          return schoolIDs.indexOf(school.school_id) >= 0;
        });
        const allSchools = getAllUsers(state.learningSummary.schoolList, noneSchoolClasses, true);
        state.learningSummary.schools = [...allSchools];
      } else if (permissions[PermissionType.report_learning_summary_teacher_650]) {
        state.learningSummary.schoolList = schools.reduce((prev, cur) => {
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
        state.learningSummary.noneSchoolClasses = noneSchoolClasses.filter((item) => {
          return classIDs.indexOf(item.class_id) >= 0;
        });
        const allSchools = getAllUsers(state.learningSummary.schoolList, state.learningSummary.noneSchoolClasses, false);
        state.learningSummary.schools = [...allSchools];
      }
    },
    [getSchoolsByOrg.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getSchoolsByOrg>>) => {
      const classes = payload[2].data.organization?.classes as Pick<Class, "class_id" | "class_name" | "schools" | "status">[];
      const schools = payload[2].data.organization?.schools as Pick<School, "classes" | "school_id" | "school_name" | "status">[];
      const membership = payload[1].data.me?.membership;
      const noneSchoolClasses = classes.filter((item) => (item?.schools || []).length === 0);
      const schoolIDs =
        membership?.schoolMemberships?.map((item) => {
          return item?.school_id;
        }) || [];
      const classIDs =
        membership?.classesTeaching?.map((item) => {
          return item?.class_id;
        }) || [];
      const permissions = payload[0];
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

    [getTeachersByOrg.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTeachersByOrg>>) => {
      const classesSchools = payload[2].data.organization?.classes as Pick<Class, "class_id" | "class_name" | "schools">[];
      const schools = payload[3].data.organization?.schools as Pick<School, "classes" | "school_id" | "school_name">[];
      const classesTeachers = payload[4].data.organization?.classes as Pick<Class, "class_id" | "teachers">[];
      const myId = payload[1].data.me?.user_id;
      const permissions = payload[0];

      const membership = payload[1].data.me?.membership;
      //const noneSchoolClasses = classes.filter((item) => (item?.schools || []).length === 0);
      const schoolIDs =
        membership?.schoolMemberships?.map((item) => {
          return item?.school_id;
        }) || [];
      const classIDs =
        membership?.classesTeaching?.map((item) => {
          return item?.class_id;
        }) || [];

      let classList: Pick<Class, "class_id" | "schools" | "class_name">[] = [];
      let schoolList: Pick<School, "classes" | "school_id" | "school_name">[] = [];
      let teacherList: Pick<Class, "class_id" | "teachers">[] = [];
      let hasNoneSchoolClasses: boolean = false;
      let canSelectTeacher: boolean = true;

      if (permissions[PermissionType.report_organization_teaching_load_617]) {
        schoolList = schools;
        classList = classesSchools;
        teacherList = classesTeachers;

        hasNoneSchoolClasses =
          classList.filter((classItem) => {
            return (classItem.schools || []).length === 0;
          }).length > 0;
      } else if (permissions[PermissionType.report_school_teaching_load_618]) {
        schoolList = schools.filter((school) => {
          return schoolIDs.indexOf(school.school_id) >= 0;
        });

        classList = classesSchools.filter((classItem) => {
          return (
            (classItem.schools || []).filter((school) => {
              return schoolIDs.indexOf(school?.school_id) >= 0;
            }).length > 0
          );
        });
        const schoolClassIds = classList.map((classItem) => classItem.class_id);
        teacherList = classesTeachers.filter((classTeacherItem) => {
          return schoolClassIds.indexOf(classTeacherItem.class_id) >= 0;
        });
      } else if (permissions[PermissionType.report_my_teaching_load_619]) {
        schoolList = schools.filter((school) => {
          return schoolIDs.indexOf(school.school_id) >= 0;
        });
        classList = classesSchools.filter((classItem) => {
          return classIDs.indexOf(classItem.class_id) >= 0;
        });
        teacherList = classesTeachers
          .filter((classTeacherItem) => {
            return classIDs.indexOf(classTeacherItem.class_id) >= 0;
          })
          .map((classTeacherItem) => {
            const teachers = (classTeacherItem.teachers || []).filter((teacherItem) => {
              return teacherItem?.user_id === myId;
            });
            return {
              ...classTeacherItem,
              teachers,
            };
          });
        hasNoneSchoolClasses =
          classList.filter((classItem) => {
            return (classItem.schools || []).length === 0;
          }).length > 0;
        canSelectTeacher = false;
      }
      schoolList = schoolList.filter((item) => {
        return classList.some((classe) => {
          return classe.schools?.find((school) => school?.school_id === item.school_id);
        });
      });
      state.schoolClassesTeachers = {
        classList: orderByASC(classList, "class_name"),
        schoolList: orderByASC(schoolList, "school_name"),
        classTeacherList: teacherList,
        hasNoneSchoolClasses,
        canSelectTeacher,
      };
    },

    [getStudentSubjectsByOrg.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStudentSubjectsByOrg>>) => {
      let classesSchools = payload[2].data.organization?.classes as Pick<Class, "class_id" | "class_name" | "schools">[];
      let schools = payload[3].data.organization?.schools as Pick<School, "classes" | "school_id" | "school_name">[];
      let classesStudents = payload[4].data.organization?.classes as Pick<Class, "class_id" | "students">[];
      let programs = payload[5] || [];
      const membership = payload[1].data.me?.membership;

      const myId = payload[1].data.me?.user_id;
      const schoolIDs =
        membership?.schoolMemberships?.map((item) => {
          return item?.school_id;
        }) || [];
      const classIDs =
        membership?.classesTeaching?.map((item) => {
          return item?.class_id;
        }) || [];
      const permissions = payload[0];

      let canSelectStudent = true;
      if (permissions["report_student_progress_organization_658"]) {
        // do nothing
      } else if (permissions["report_student_progress_school_659"]) {
        classesSchools = classesSchools.filter((item) => {
          return schoolIDs.some((id) => {
            return (item.schools || []).some((school) => school?.school_id === id);
          });
        });
      } else if (permissions["report_student_progress_teacher_660"]) {
        classesSchools = classesSchools.filter((item) => {
          return classIDs.indexOf(item.class_id) >= 0;
        });
      } else if (permissions["report_student_progress_student_661"]) {
        classesStudents = classesStudents
          .filter((item) => {
            return item.students?.some((student) => student?.user_id === myId);
          })
          .map((item) => {
            return {
              ...item,
              students: item.students?.filter((student) => student?.user_id === myId),
            };
          });
        canSelectStudent = false;
      }

      const classesSchoolsAndStudents = classesSchools.reduce((prev, cur) => {
        const students = classesStudents.find((data) => data.class_id === cur.class_id)?.students;
        if (students && students?.length > 0) {
          let item: Pick<Class, "class_id" | "class_name" | "schools" | "students"> = pick(cur, ["class_id", "class_name", "schools"]);
          item["students"] = students;
          prev.push(item as never);
        }

        return prev;
      }, []) as Pick<Class, "class_id" | "class_name" | "schools" | "students">[];

      const tempIds = classesSchoolsAndStudents.reduce((prev, cur) => {
        (cur.schools || []).forEach((data) => {
          prev.push(data?.school_id as never);
        });
        return prev;
      }, []);

      schools = schools.filter((item) => {
        return tempIds.find((id) => id === item.school_id);
      });

      const classList: Pick<Class, "class_id" | "class_name" | "schools" | "students">[] = [];
      const noneSchoolClassList: Pick<Class, "class_id" | "class_name" | "schools" | "students">[] = [];

      classesSchoolsAndStudents.forEach((item) => {
        if ((item.schools || []).length === 0) {
          noneSchoolClassList.push(item as never);
        } else {
          classList.push(item as never);
        }
      });

      state.schoolClassesStudentsSubjects = {
        schoolList: schools,
        classList,
        noneSchoolClassList,
        programs,
        canSelectStudent,
      };
    },

    [getLessonPlan.fulfilled.type]: (state, action: PayloadAction<AsyncTrunkReturned<typeof getLessonPlan>>) => {
      const payload = orderByASC(action.payload || [], "name");
      state.reportMockOptions.lessonPlanList = payload;
      state.reportMockOptions.lesson_plan_id = payload[0] && (payload[0]?.id || "");
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
      state.reportMockOptions = reportMockOptions;
      state.reportList = reportList;
    },
    [reportOnload.pending.type]: (state) => {
      state.reportMockOptions = cloneDeep(initialState.reportMockOptions);
    },

    [getStudentUsageMaterial.fulfilled.type]: (state, { payload }) => {
      state.studentUsageReport = payload;
    },
    [getStudentUsageMaterial.rejected.type]: (state) => {},

    [getTeachersAndClasses.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTeachersAndClasses>>) => {
      state.teacherList = payload.teacherList;
      state.classesConnection = payload.classesConnection;
    },
    [getTeacherAndClassOld.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTeacherAndClassOld>>) => {
      state.teacherList = payload.teacherList;
      state.classes = payload.classes;
    },
    [getSkillCoverageReport.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getSkillCoverageReport>>) => {
      state.categories = payload;
    },
    [getSkillCoverageReport.pending.type]: (state) => {
      state.categories = cloneDeep(initialState.categories);
    },
    [categoryReportOnLoad.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof categoryReportOnLoad>>) => {
      state.categories = payload;
    },
    [categoryReportOnLoad.pending.type]: (state) => {
      state.categories = cloneDeep(initialState.categories);
    },
    [getTeachingLoadList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTeachingLoadList>>) => {
      state.teachingLoadOnload.teachingLoadList = payload;
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
    [getLessonTeacherLoad.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLessonTeacherLoad>>) => {
      state.teacherLoadLesson = {
        list: payload.lessonList,
        statistic: payload.lessonSummary,
      };
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
              value: `${formatTimeToMonDay(week_start)}~${formatTimeToMonDay(week_end - 24 * 60 * 60)}`,
            };
          })
        : [];
      state.summaryReportOptions.weeks = weeks;
      // const _week = weeks[weeks.length - 1];
      // state.summaryReportOptions.year = years[years.length - 1];
      const _week = weeks[0];
      state.summaryReportOptions.year = years[0];
      state.summaryReportOptions.week_end = _week.week_end;
      state.summaryReportOptions.week_start = _week.week_start;
      state.learningSummary.time = payload.map((item) => ({
        year: item.year,
        weeks: item.weeks?.map((item) => {
          const week_start = item.week_start as number;
          const week_end = item.week_end as number;
          return {
            week_start,
            week_end,
            value: `${formatTimeToMonDay(week_start)}~${formatTimeToMonDay(week_end - 24 * 60 * 60)}`,
          };
        }),
      }));
    },
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
        state.summaryReportOptions.classes = uniqBy(
          [{ id: "all", name: d("All").t("report_label_all") }, ...orderByASC(payload.classes, "name")],
          "id"
        );
      }
      if (payload.teachers) {
        state.summaryReportOptions.teachers = orderByASC(payload.teachers, "name");
      }
      if (payload.students) {
        state.summaryReportOptions.students = orderByASC(payload.students, "name");
      }
      if (payload.subjects) {
        state.summaryReportOptions.subjects = orderByASC(payload.subjects, "name");
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
      state.classesAssignmentsUnattend = payload;
    },
    [getClassesAssignmentsUnattended.pending.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassesAssignmentsUnattended>>
    ) => {
      state.classesAssignmentsUnattend = cloneDeep(initialState.classesAssignmentsUnattend);
    },
    [getClassesAssignments.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassesAssignments>>) => {
      state.classesAssignments = payload;
    },
    [getClassesAssignments.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassesAssignments>>) => {
      state.classesAssignments = cloneDeep(initialState.classesAssignments);
    },
    [getClassesAssignmentsOverview.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassesAssignmentsOverview>>
    ) => {
      state.overview = payload;
    },
    [getClassesAssignmentsOverview.pending.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassesAssignmentsOverview>>
    ) => {
      state.overview = cloneDeep(initialState.overview);
    },
    [getTeacherLoadAssignment.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTeacherLoadAssignment>>) => {
      state.teacherLoadAssignment = payload;
    },
    [getTeachingLoadReport.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTeachingLoadReport>>) => {
      state.next7DaysLessonLoadList = payload.items;
    },
    [getTeacherLoadAssignment.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTeacherLoadAssignment>>) => {
      state.teacherLoadAssignment = cloneDeep(initialState.teacherLoadAssignment);
    },
    [getTeachingLoadReport.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTeachingLoadReport>>) => {
      state.next7DaysLessonLoadList = cloneDeep(initialState.next7DaysLessonLoadList);
    },
    [getListTeacherMissedLessons.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getListTeacherMissedLessons>>
    ) => {
      state.listTeacherMissedLessons = payload;
    },
    [getAssignmentsCompletion.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssignmentsCompletion>>) => {
      state.assignmentsCompletion = payload;
      const stuList = [{ id: "", name: "" }];
      state.schoolClassesStudentsSubjects.classList.map((item) =>
        item.students?.map((val) =>
          stuList.push({
            id: val?.user_id!,
            name: val?.full_name!,
          })
        )
      );
      const studentName = stuList?.find((val) => val.id === payload[0].student_id)?.name || "";
      if (payload?.length === 4) {
        state.fourWeeksAssignmentsCompletionMassage = getAssignmentCompletionFeedback(payload, studentName);
      }
    },
    [getLearnOutcomeClassAttendance.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getLearnOutcomeClassAttendance>>
    ) => {
      state.learnOutcomeClassAttendance = payload;
      const stuList = [{ id: "", name: "" }];
      state.schoolClassesStudentsSubjects.classList.map((item) =>
        item.students?.map((val) =>
          stuList.push({
            id: val?.user_id!,
            name: val?.full_name!,
          })
        )
      );
      const studentName = stuList?.find((val) => val.id === payload?.request_student_id)?.name || "";
      if (payload?.items?.length === 4) {
        state.fourWeeksClassAttendanceMassage = getClassAttendanceFeedback(payload?.items, studentName);
      }
    },
    [getLearnOutcomeAchievement.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AsyncTrunkReturned<typeof getLearnOutcomeAchievement>>
    ) => {
      state.learnOutcomeAchievement = payload;
      const stuList = [{ id: "", name: "" }];
      state.schoolClassesStudentsSubjects.classList.map((item) =>
        item.students?.map((val) =>
          stuList.push({
            id: val?.user_id!,
            name: val?.full_name!,
          })
        )
      );
      const studentName = stuList?.find((val) => val.id === payload?.request?.student_id)?.name || "";
      if (payload?.items?.length === 4) {
        state.fourWeekslearnOutcomeAchievementMassage = getLearnOutcomeAchievementFeedback(payload?.items, studentName);
      }
    },
  },
});
export const { resetSummaryOptions } = actions;
export default reducer;
