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
  EntityTeacherReportCategory,
} from "../api/api.auto";
import { apiGetPermission, apiWaitForOrganizationOfPage } from "../api/extra";
import { hasPermissionOfMe, PermissionType } from "../components/Permission";
import { formatTimeToMonDay, ModelReport } from "../models/ModelReports";
import { ReportFilter, ReportOrderBy } from "../pages/ReportAchievementList/types";
import { IWeeks } from "../pages/ReportLearningSummary";
import { LearningSummartOptionsProps } from "../pages/ReportLearningSummary/FilterLearningSummary";
import {
  ArrProps,
  QueryLearningSummaryCondition,
  QueryLearningSummaryRemainingFilterCondition,
  ReportType,
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
  liveClassTimeFilter: IResultQueryLoadLearningSummary["timeFilter"];
  assessmentClassTimeFilter: IResultQueryLoadLearningSummary["timeFilter"];
  liveClassFilterValues: IResultQueryLoadLearningSummary;
  assessmentFilterValues: IResultQueryLoadLearningSummary;
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
  liveClassFilterValues: {
    timeFilter: [],
    infoFilter: [],
  },
  assessmentFilterValues: {
    timeFilter: [
      {
        year: 2021,
        weeks: [
          { week_start: 1609689600, week_end: 1610294399 },
          { week_start: 1610294400, week_end: 1610899199 },
          { week_start: 1610899200, week_end: 1611503999 },
          { week_start: 1611504000, week_end: 1612108799 },
          { week_start: 1612108800, week_end: 1612713599 },
          { week_start: 1612713600, week_end: 1613318399 },
          { week_start: 1613318400, week_end: 1613923199 },
          { week_start: 1613923200, week_end: 1614527999 },
          { week_start: 1614528000, week_end: 1615132799 },
          { week_start: 1615132800, week_end: 1615737599 },
          { week_start: 1615737600, week_end: 1616342399 },
          { week_start: 1616342400, week_end: 1616947199 },
          { week_start: 1616947200, week_end: 1617551999 },
          { week_start: 1617552000, week_end: 1618156799 },
          { week_start: 1618156800, week_end: 1618761599 },
          { week_start: 1618761600, week_end: 1619366399 },
          { week_start: 1619366400, week_end: 1619971199 },
          { week_start: 1619971200, week_end: 1620575999 },
          { week_start: 1620576000, week_end: 1621180799 },
          { week_start: 1621180800, week_end: 1621785599 },
          { week_start: 1621785600, week_end: 1622390399 },
          { week_start: 1622390400, week_end: 1622995199 },
          { week_start: 1622995200, week_end: 1623599999 },
          { week_start: 1623600000, week_end: 1624204799 },
          { week_start: 1624204800, week_end: 1624809599 },
          { week_start: 1624809600, week_end: 1625414399 },
          { week_start: 1625414400, week_end: 1626019199 },
          { week_start: 1626019200, week_end: 1626623999 },
          { week_start: 1626624000, week_end: 1627228799 },
          { week_start: 1627228800, week_end: 1627833599 },
          { week_start: 1627833600, week_end: 1628438399 },
        ],
      },
    ],
    infoFilter: [
      {
        id: "5f848fdc-3bbd-47ae-981a-57ae95cf4235",
        name: "sch 1",
        classes: [
          {
            id: "8f43ccbd-6fd5-43bc-a577-e3a936adcb28",
            name: "class 1",
            teachers: [
              {
                id: "4a0ccee4-082b-4398-9731-a25504163934",
                name: "teach 1",
                students: [
                  // {
                  //   id: "2522eae0-5f72-45d1-98f6-35827ab816a7",
                  //   name: "org kidsloop",
                  //   subjects: [
                  //     {id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71",name: "None Specified"},
                  //     {id: "20d6ca2f-13df-4a7a-8dcb-955908db7baa",name: "Language/Literacy"},
                  //     {id: "fab745e8-9e31-4d0c-b780-c40120c98b27",name: "Science"},
                  //     {id: "66a453b0-d38f-472e-b055-7a94a94d66c4",name: "Language/Literacy"},
                  //   ]
                  // },
                  {
                    id: "98d1ea8c-6bb6-4611-8447-b9fb722b3cce",
                    name: "org stu",
                    subjects: [
                      { id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" },
                      { id: "20d6ca2f-13df-4a7a-8dcb-955908db7baa", name: "Language/Literacy" },
                      { id: "fab745e8-9e31-4d0c-b780-c40120c98b27", name: "Science" },
                      { id: "66a453b0-d38f-472e-b055-7a94a94d66c4", name: "Language/Literacy" },
                    ],
                  },
                  {
                    id: "150de04b-6777-4cab-a381-5f36a9b750ef",
                    name: "brilliant yang",
                    subjects: [
                      { id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" },
                      { id: "20d6ca2f-13df-4a7a-8dcb-955908db7baa", name: "Language/Literacy" },
                      { id: "fab745e8-9e31-4d0c-b780-c40120c98b27", name: "Science" },
                      { id: "66a453b0-d38f-472e-b055-7a94a94d66c4", name: "Language/Literacy" },
                    ],
                  },
                  {
                    id: "70eb76d1-91d3-4edf-9bf6-a2dfcfb51407",
                    name: "stu 1",
                    subjects: [
                      { id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" },
                      { id: "20d6ca2f-13df-4a7a-8dcb-955908db7baa", name: "Language/Literacy" },
                      { id: "fab745e8-9e31-4d0c-b780-c40120c98b27", name: "Science" },
                      { id: "66a453b0-d38f-472e-b055-7a94a94d66c4", name: "Language/Literacy" },
                    ],
                  },
                ],
              },
              {
                id: "150de04b-6777-4cab-a381-5f36a9b750ef",
                name: "brilliant yang",
                students: [
                  {
                    id: "2522eae0-5f72-45d1-98f6-35827ab816a7",
                    name: "org kidsloop",
                    subjects: [
                      { id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" },
                      { id: "20d6ca2f-13df-4a7a-8dcb-955908db7baa", name: "Language/Literacy" },
                      { id: "fab745e8-9e31-4d0c-b780-c40120c98b27", name: "Science" },
                      { id: "66a453b0-d38f-472e-b055-7a94a94d66c4", name: "Language/Literacy" },
                    ],
                  },
                  {
                    id: "98d1ea8c-6bb6-4611-8447-b9fb722b3cce",
                    name: "org stu",
                    subjects: [
                      { id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" },
                      { id: "20d6ca2f-13df-4a7a-8dcb-955908db7baa", name: "Language/Literacy" },
                      { id: "fab745e8-9e31-4d0c-b780-c40120c98b27", name: "Science" },
                      { id: "66a453b0-d38f-472e-b055-7a94a94d66c4", name: "Language/Literacy" },
                    ],
                  },
                  {
                    id: "150de04b-6777-4cab-a381-5f36a9b750ef",
                    name: "brilliant yang",
                    subjects: [
                      { id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" },
                      { id: "20d6ca2f-13df-4a7a-8dcb-955908db7baa", name: "Language/Literacy" },
                      { id: "fab745e8-9e31-4d0c-b780-c40120c98b27", name: "Science" },
                      { id: "66a453b0-d38f-472e-b055-7a94a94d66c4", name: "Language/Literacy" },
                    ],
                  },
                  {
                    id: "70eb76d1-91d3-4edf-9bf6-a2dfcfb51407",
                    name: "stu 1",
                    subjects: [
                      { id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" },
                      { id: "20d6ca2f-13df-4a7a-8dcb-955908db7baa", name: "Language/Literacy" },
                      { id: "fab745e8-9e31-4d0c-b780-c40120c98b27", name: "Science" },
                      { id: "66a453b0-d38f-472e-b055-7a94a94d66c4", name: "Language/Literacy" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "7be80293-a7ce-4caa-82f9-d392a6504cda",
            name: "class m",
            teachers: [
              {
                id: "2522eae0-5f72-45d1-98f6-35827ab816a7",
                name: "org kidsloop",
                students: [
                  {
                    id: "4271a55d-431e-4c6e-aef2-813438fa3a18",
                    name: "bada 1",
                    subjects: [
                      { id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" },
                      { id: "20d6ca2f-13df-4a7a-8dcb-955908db7baa", name: "Language/Literacy" },
                      { id: "fab745e8-9e31-4d0c-b780-c40120c98b27", name: "Science" },
                      { id: "66a453b0-d38f-472e-b055-7a94a94d66c4", name: "Language/Literacy" },
                    ],
                  },
                  {
                    id: "150de04b-6777-4cab-a381-5f36a9b750ef",
                    name: "brilliant yang",
                    subjects: [
                      { id: "subjects_id_1", name: "subjects_name_1" },
                      { id: "subjects_id_2", name: "subjects_name_2" },
                      { id: "subjects_id_3", name: "subjects_name_3" },
                      { id: "subjects_id_4", name: "subjects_name_4" },
                    ],
                  },
                  {
                    id: "98d1ea8c-6bb6-4611-8447-b9fb722b3cce",
                    name: "org stu",
                    subjects: [
                      { id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" },
                      { id: "20d6ca2f-13df-4a7a-8dcb-955908db7baa", name: "Language/Literacy" },
                      { id: "fab745e8-9e31-4d0c-b780-c40120c98b27", name: "Science" },
                      { id: "66a453b0-d38f-472e-b055-7a94a94d66c4", name: "Language/Literacy" },
                    ],
                  },
                  {
                    id: "70eb76d1-91d3-4edf-9bf6-a2dfcfb51407",
                    name: "stu 1",
                    subjects: [
                      { id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" },
                      { id: "20d6ca2f-13df-4a7a-8dcb-955908db7baa", name: "Language/Literacy" },
                      { id: "fab745e8-9e31-4d0c-b780-c40120c98b27", name: "Science" },
                      { id: "66a453b0-d38f-472e-b055-7a94a94d66c4", name: "Language/Literacy" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  liveClassTimeFilter: [],
  assessmentClassTimeFilter: [],
  summaryReportOptions: {
    years: [],
    weeks: [],
    schools: [
      { id: "1", name: "1" },
      { id: "2", name: "2" },
    ],
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
    const res = await api.reports.queryLiveClassesSummary({ ...query });
    return res;
  }
);

export type IParamsQueryAssignmentSummary = Parameters<typeof api.reports.queryAssignmentsSummary>[0];
export type IResultQueryAssignmentSummary = AsyncReturnType<typeof api.reports.queryAssignmentsSummary>;
export const getAssignmentSummary = createAsyncThunk<IResultQueryAssignmentSummary, IParamsQueryAssignmentSummary & LoadingMetaPayload>(
  "getAssingmentSummary",
  async (query) => {
    const res = await api.reports.queryAssignmentsSummary({ ...query });
    return res;
  }
);

export type IParamQueryTimeFilter = Parameters<typeof api.reports.queryLearningSummaryTimeFilter>[0];
export type IResultQueryTimeFilter = {
  liveClassTimeFilter?: AsyncReturnType<typeof api.reports.queryLearningSummaryTimeFilter>;
  assessmentTimeFilter?: AsyncReturnType<typeof api.reports.queryLearningSummaryTimeFilter>;
};
export const getTimeFilter = createAsyncThunk<IResultQueryTimeFilter, IParamQueryTimeFilter>("getTimeFilter", async (query) => {
  const { summary_type } = query;
  const res = await api.reports.queryLearningSummaryTimeFilter({ ...query });
  return summary_type === ReportType.live ? { liveClassTimeFilter: res } : { assessmentTimeFilter: res };
});

export type IParamQueryRemainFilter = Parameters<typeof api.reports.queryLearningSummaryRemainingFilter>[0];
export type IResultQueryRemainFilter = {
  liveClassRemainFilter?: AsyncReturnType<typeof api.reports.queryLearningSummaryRemainingFilter>;
  assessmentRemainFilter?: AsyncReturnType<typeof api.reports.queryLearningSummaryRemainingFilter>;
};
export const getRemainFilter = createAsyncThunk<IResultQueryRemainFilter, IParamQueryRemainFilter>("getTimeFilter", async (query) => {
  const { summary_type } = query;
  const res = await api.reports.queryLearningSummaryRemainingFilter({ ...query });
  return summary_type === ReportType.live ? { liveClassRemainFilter: res } : { assessmentRemainFilter: res };
});

export type IResultQueryLoadLearningSummary = {
  timeFilter: AsyncReturnType<typeof api.reports.queryLearningSummaryTimeFilter>;
  infoFilter: AsyncReturnType<typeof api.reports.queryLearningSummaryRemainingFilter>;
};
export interface LearningSummaryResponse {
  liveClassFilterValues: IResultQueryLoadLearningSummary;
  assessmentFilterValues: IResultQueryLoadLearningSummary;
}
export interface IParamsOnLoadLearningSummary {
  summary_type: string;
}
export const onLoadLearningSummary = createAsyncThunk<
  any,
  IParamsOnLoadLearningSummary & QueryLearningSummaryCondition & LoadingMetaPayload,
  { state: RootState }
>("onLoadLearningSummary", async (query, { getState, dispatch }) => {
  const {
    report: { liveClassFilterValues, assessmentFilterValues },
  } = getState();
  const { summary_type, student_id, subject_id } = query;
  if (
    liveClassFilterValues.timeFilter.length &&
    liveClassFilterValues.infoFilter.length &&
    assessmentFilterValues.timeFilter.length &&
    assessmentFilterValues.infoFilter.length
  ) {
    const isLiveClass = summary_type === ReportType.live;
    if (student_id) {
      if (subject_id === "all") {
        isLiveClass
          ? await dispatch(getLiveClassesSummary({ ...query, subject_id: "" }))
          : await dispatch(getAssignmentSummary({ ...query, subject_id: "" }));
      } else {
        isLiveClass ? await dispatch(getLiveClassesSummary({ ...query })) : await dispatch(getAssignmentSummary({ ...query }));
      }
    }
  } else {
    dispatch(getTimeFilter({ summary_type: ReportType.live }));
    dispatch(getTimeFilter({ summary_type: ReportType.assignment }));
    // dispatch(getRemainFilter({summary_type: ReportType.live}));
    // dispatch(getRemainFilter({summary_type: ReportType.assignment}))
  }
});
export interface IParamsLearningSummary extends QueryLearningSummaryRemainingFilterCondition {
  isOrg: boolean;
  isSchool: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  year?: number;
  subject_id?: string;
}
export interface IResultLearningSummary {
  years?: number[];
  weeks?: IWeeks[];
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
export const onLoadLearningSummary2 = createAsyncThunk<any, IParamsLearningSummary>(
  "onLoadLearningSummary2",
  async (query, { dispatch }) => {
    const currentYear = new Date().getFullYear();
    const {
      isOrg,
      isSchool,
      isTeacher,
      isStudent,
      year = currentYear,
      summary_type,
      week_start,
      week_end,
      school_id,
      class_id,
      teacher_id,
      student_id,
      subject_id,
    } = query;
    let subjects: ArrProps[] = [];
    let schools: ArrProps[] = [];
    let classes: ArrProps[] = [];
    let teachers: ArrProps[] = [];
    let students: ArrProps[] = [];
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
    const timeFilter = await api.reports.queryLearningSummaryTimeFilter({ summary_type });
    const years = timeFilter.length && timeFilter.map((item) => item.year);
    const _weeks = timeFilter.length && timeFilter.find((item) => item.year === year)?.weeks;
    const weeks =
      _weeks &&
      _weeks.map((item) => {
        const { week_start, week_end } = item;
        return {
          week_start,
          week_end,
          value: `${formatTimeToMonDay(week_start as number)} ~ ${formatTimeToMonDay(week_end as number)}`,
        };
      });
    const lastWeek = weeks && weeks[weeks.length - 1];
    const _week_start = week_start ? week_start : lastWeek && lastWeek.week_start;
    const _week_end = week_end ? week_end : lastWeek && lastWeek.week_end;
    if (isOrg) {
      const _schools = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "school",
        week_start: _week_start,
        week_end: _week_end,
      });
      schools =
        _schools &&
        _schools.map((item) => {
          return {
            id: item.school_id,
            name: item.school_name,
          };
        });
      _school_id = school_id ? school_id : schools[schools.length - 1].id;
      const _classes = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "class",
        week_start: _week_start,
        week_end: _week_end,
        school_id: _school_id,
      });
      classes =
        _classes &&
        _classes.map((item) => {
          return {
            id: item.class_id,
            name: item.class_name,
          };
        });
      _class_id = class_id ? class_id : classes[classes.length - 1].id;
      const _teachers = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "teacher",
        week_start: _week_start,
        week_end: _week_end,
        class_id: _class_id,
      });
      teachers =
        _teachers &&
        _teachers.map((item) => {
          return {
            id: item.teacher_id,
            name: item.teacher_name,
          };
        });
      _teacher_id = teacher_id ? teacher_id : teachers[teachers.length - 1].id;
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start: _week_start,
        week_end: _week_end,
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
      _student_id = student_id ? student_id : students[students.length - 1].id;
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
      _subject_id = subject_id ? subject_id : subjects[subjects.length - 1].id;
    } else if (isSchool) {
      const _classes = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "class",
        week_start: _week_start,
        week_end: _week_end,
        school_id: myUserId,
      });
      classes =
        _classes &&
        _classes.map((item) => {
          return {
            id: item.class_id,
            name: item.class_name,
          };
        });
      _class_id = class_id ? class_id : classes[classes.length - 1].id;
      const _teachers = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "teacher",
        week_start: _week_start,
        week_end: _week_end,
        school_id: _school_id,
        class_id: _class_id,
      });
      teachers =
        _teachers &&
        _teachers.map((item) => {
          return {
            id: item.teacher_id,
            name: item.teacher_name,
          };
        });
      _teacher_id = teacher_id ? teacher_id : teachers[teachers.length - 1].id;
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start: _week_start,
        week_end: _week_end,
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
      _student_id = student_id ? student_id : students[students.length - 1].id;
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
      _subject_id = subject_id ? subject_id : subjects[subjects.length - 1].id;
    } else if (isTeacher) {
      const _classes = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "class",
        week_start: _week_start,
        week_end: _week_end,
        teacher_id: myUserId,
      });
      classes =
        _classes &&
        _classes.map((item) => {
          return {
            id: item.class_id,
            name: item.class_name,
          };
        });
      _class_id = class_id ? class_id : classes[classes.length - 1].id;
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start: _week_start,
        week_end: _week_end,
        class_id: _class_id,
      });
      students =
        _students &&
        _students.map((item) => {
          return {
            id: item.student_id,
            name: item.student_name,
          };
        });
      _student_id = student_id ? student_id : students[students.length - 1].id;
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
      _subject_id = subject_id ? subject_id : subjects[subjects.length - 1].id;
    } else if (isStudent) {
      const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "subject",
        week_start,
        week_end,
        student_id: student_id ? student_id : myUserId,
      });
      subjects =
        _subjects &&
        _subjects.map((item) => {
          return {
            id: item.subject_id,
            name: item.subject_name,
          };
        });
      _subject_id = subject_id ? subject_id : subjects[subjects.length - 1].id;
    }
    const isLiveClass = summary_type === ReportType.live;
    const params = {
      year,
      week_start: _week_start,
      week_end: _week_end,
      school_id: _school_id,
      class_id: _class_id,
      teacher_id: _teacher_id,
      student_id: _student_id,
      subject_id: _subject_id,
    };
    if (subject_id === "all") {
      isLiveClass
        ? await dispatch(getLiveClassesSummary({ ...params, subject_id: "" }))
        : await dispatch(getAssignmentSummary({ ...params, subject_id: "" }));
    } else {
      isLiveClass ? await dispatch(getLiveClassesSummary({ ...params })) : await dispatch(getAssignmentSummary({ ...params }));
    }
    return {
      years,
      weeks,
      schools,
      classes,
      teachers,
      students,
      subjects,
      ...params,
      // year,
      // week_start: _week_start,
      // week_end: _week_end,
      // school_id: _school_id,
      // class_id: _class_id,
      // teacher_id: _teacher_id,
      // student_id: _student_id,
      // subject_id: _subject_id,
    };
  }
);

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
      // if (payload.studentList) {
      //   state.learningSummartOptions.studentList = payload.studentList || [];
      //   state.learningSummartOptions.subjectList = payload.subjectList || [];
      //   state.learningSummartOptions.year = payload.year || [];
      //   state.learningSummartOptions.week = payload.week || [];
      // }
    },
    [getLiveClassesSummary.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLiveClassesSummary>>) => {
      state.liveClassSummary = payload;
    },
    [getAssignmentSummary.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssignmentSummary>>) => {
      state.assignmentSummary = payload;
    },
    [getTimeFilter.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTimeFilter>>) => {
      if (payload.liveClassTimeFilter) {
        state.liveClassFilterValues.timeFilter = payload.liveClassTimeFilter;
      } else if (payload.assessmentTimeFilter) {
        state.assessmentFilterValues.timeFilter = payload.assessmentTimeFilter;
      }
    },
    [getRemainFilter.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getRemainFilter>>) => {
      if (payload.liveClassRemainFilter) {
        state.liveClassFilterValues.infoFilter = payload.liveClassRemainFilter;
      } else if (payload.assessmentRemainFilter) {
        state.assessmentFilterValues.infoFilter = payload.assessmentRemainFilter;
      }
    },
  },
});
export default reducer;
