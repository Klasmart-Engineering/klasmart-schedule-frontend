import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api, { gqlapi } from "../api";
import {
  ClassesByTeacherDocument,
  ClassesByTeacherQuery,
  ClassesByTeacherQueryVariables,
  TeachersByOrgnizationDocument,
  TeachersByOrgnizationQuery,
  TeachersByOrgnizationQueryVariables,
} from "../api/api-ko.auto";
import { EntityScheduleShortInfo, EntityStudentReportCategory, EntityStudentReportItem } from "../api/api.auto";
import { apiGetMockOptions, apiOrganizationOfPage, MockOptions } from "../api/extra";
import classListByTeacher from "../mocks/classListByTeacher.json";
import teacherListByOrg from "../mocks/teacherListByOrg.json";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";

const MOCK = false;
interface IreportState {
  reportList?: EntityStudentReportItem[];
  achievementDetail?: EntityStudentReportCategory[];
  mockOptions: MockOptions;
  lessonPlanList: EntityScheduleShortInfo[];
  student_name: string | undefined;
  reportMockOptions: GetReportMockOptionsResponse;
}
const initialState: IreportState = {
  reportList: [],
  achievementDetail: [],
  mockOptions: {
    options: [],
    visibility_settings: [],
    lesson_types: [],
    classes: [],
    class_types: [],
    organizations: [],
    teachers: [],
    students: [],
    users: [],
    teacher_class_relationship: [],
  },
  lessonPlanList: [],
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

export const getMockOptions = createAsyncThunk<MockOptions>("apiGetMockOptions", async () => {
  return await apiGetMockOptions();
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
}
interface GetReportMockOptionsPayLoad {
  organization_id?: string | null;
  teacher_id?: string;
}

export const getReportMockOptions = createAsyncThunk<GetReportMockOptionsResponse, GetReportMockOptionsPayLoad>(
  "getTeacherList",
  async ({ teacher_id }) => {
    const organization_id = apiOrganizationOfPage() as string;
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

    const { data: result } = await gqlapi.query<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>({
      query: ClassesByTeacherDocument,
      variables: {
        user_id: teacher_id ? teacher_id : user_id,
      },
    });
    const mockClassResult: ClassesByTeacherQuery = classListByTeacher;
    const classList = MOCK ? mockClassResult : result;
    return { teacherList, classList };
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
    [getMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getMockOptions>>) => {
      state.mockOptions = payload;
    },
    [getMockOptions.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getLessonPlan.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLessonPlan>>) => {
      state.lessonPlanList = payload;
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
      console.log(error, 1111111);
      state.reportMockOptions.classList.user = { classesTeaching: [] };
      state.reportMockOptions.teacherList.organization = { teachers: [] };
    },
  },
});
export default reducer;
