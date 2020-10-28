import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { EntityStudentReportItem } from "../api/api.auto";
import { apiGetMockOptions, MockOptions } from "../api/extra";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";

interface IreportState {
  reportList: EntityStudentReportItem[];
  mockOptions: MockOptions;
}
const initialState: IreportState = {
  reportList: [],
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
};
export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

type OnloadReportPayload = Parameters<typeof api.reports.listStudentsReport>[0] & LoadingMetaPayload;
interface OnloadReportReturn {
  mockOptions: MockOptions;
  reportList: EntityStudentReportItem[];
}
export const onloadReport = createAsyncThunk<OnloadReportReturn, OnloadReportPayload>(
  "listStudentsReport",
  async ({ teacher_id, class_id, lesson_plan_id }) => {
    const [mockOptions, reportList] = await Promise.all([
      apiGetMockOptions(),
      // api.reports.listStudentReport({lesson_plain_id})
    ]);

    return { mockOptions, reportList };
  }
);

const { reducer } = createSlice({
  name: "report ",
  initialState,
  reducers: {},
  extraReducers: {
    [onloadReport.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onloadReport>>) => {
      state.mockOptions = payload.mockOptions;
      state.reportList = payload.reportList;
    },
    [onloadReport.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
  },
});
export default reducer;
