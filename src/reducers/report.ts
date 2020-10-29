import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { EntityScheduleShortInfo, EntityStudentReportCategory, EntityStudentReportItem } from "../api/api.auto";
import { apiGetMockOptions, MockOptions } from "../api/extra";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";

interface IreportState {
  reportList?: EntityStudentReportItem[];
  achievementDetail?: EntityStudentReportCategory[];
  mockOptions: MockOptions;
  lessonPlanList: EntityScheduleShortInfo[];
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
  async ({ teacher_id, class_id, lesson_plan_id, status, sortBy }) => {
    return await api.reports.listStudentsReport({ teacher_id, class_id, lesson_plan_id, status, sortBy });
  }
);
interface GetAchievementDetailPayload extends LoadingMetaPayload {
  id: string;
  query: Parameters<typeof api.reports.getStudentDetailReport>[1];
}
export const getAchievementDetail = createAsyncThunk<
  AsyncReturnType<typeof api.reports.getStudentDetailReport>,
  GetAchievementDetailPayload
>("StudentsDetailReport", async ({ id, query }) => {
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
    },
    [getAchievementDetail.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
  },
});
export default reducer;
