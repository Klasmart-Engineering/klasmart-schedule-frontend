import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { Schedule, ScheduleCreate, ScheduleDetailed, ScheduleTimeView } from "../api/api";

type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;

interface scheduleViewData {
  end: Date;
  id: string;
  start: Date;
  title: string;
}

export interface ScheduleState {
  total: number;
  searchScheduleList: Schedule[];
  saveResult: number;
  scheduleDetial: ScheduleDetailed;
  scheduleTimeViewData: scheduleViewData[];
}

interface Rootstate {
  schedules: ScheduleState;
}

const initialState: ScheduleState = {
  saveResult: 1,
  total: 0,
  searchScheduleList: [],
  scheduleDetial: {
    id: "",
    title: "",
    class: {},
    lesson_plan: {},
    teachers: [],
    start_at: 0,
    end_at: 0,
    mode_type: "AllDay",
    repeat: {},
    subject: {},
    program: {},
    class_type: "OnlineClass",
    due_at: 0,
    description: "",
    attachment: {},
    is_all_day: true,
  },
  scheduleTimeViewData: [],
};

type querySchedulesParams = Parameters<typeof api.schedules.querySchedules>[0];
type querySchedulesResult = ReturnType<typeof api.schedules.querySchedules>;
export const getSearchScheduleList = createAsyncThunk<querySchedulesResult, querySchedulesParams>("schedule/scheduleList", (query) => {
  return api.schedules.querySchedules(query);
});

export const saveScheduleData = createAsyncThunk<ScheduleCreate, ScheduleCreate, { state: Rootstate }>(
  "schedule/save",
  async (payload, { getState }) => {
    let {
      schedules: {
        scheduleDetial: { id },
      },
    } = getState();
    if (!id) {
      id = (await api.schedules.createSchedule(payload)).id;
    } else {
      await api.schedules.updateSchedule(id, payload);
    }
    return await api.schedules.getSchedulesById(id as string);
  }
);

type viewSchedulesParams = Parameters<typeof api.schedulesTimeView.schedulesTimeView>[0];
type viewSchedulesResult = ReturnType<typeof api.schedulesTimeView.schedulesTimeView>;
export const getScheduleTimeViewData = createAsyncThunk<viewSchedulesResult, viewSchedulesParams>(
  "schedule/schedules_time_view",
  (query) => {
    return api.schedulesTimeView.schedulesTimeView(query);
  }
);

type deleteSchedulesParams = Parameters<typeof api.schedules.deleteSchedule>[0];
type deleteSchedulesResult = ReturnType<typeof api.schedules.deleteSchedule>;
export const removeSchedule = createAsyncThunk<deleteSchedulesResult, deleteSchedulesParams>("schedule/delete", (schedule_id, query) => {
  return api.schedules.deleteSchedule(schedule_id);
});

type infoSchedulesParams = Parameters<typeof api.schedules.getSchedulesById>[0];
type infoSchedulesResult = ReturnType<typeof api.schedules.getSchedulesById>;
export const getScheduleInfo = createAsyncThunk<infoSchedulesResult, infoSchedulesParams>("schedule/info", (schedule_id, query) => {
  return api.schedules.getSchedulesById(schedule_id);
});

const { reducer } = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: {
    [getSearchScheduleList.fulfilled.type]: (state, { payload }: any) => {
      state.searchScheduleList = payload.data;
      state.total = payload.total;
    },
    [saveScheduleData.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof saveScheduleData>>) => {
      state.scheduleDetial = payload;
    },
    [saveScheduleData.rejected.type]: (state, { error }: any) => {
      console.log(JSON.stringify(error));
    },
    [getScheduleTimeViewData.fulfilled.type]: (state, { payload }: any) => {
      const newViewData: any = [];
      if (payload.length > 0) {
        payload.forEach((item: ScheduleTimeView) => {
          const start_at = new Date(Number(item.start_at) * 1000);
          const end_at = new Date(Number(item.end_at) * 1000);
          newViewData.push({
            end: start_at,
            id: item.id,
            start: end_at,
            title: item.title,
          });
        });
      }
      state.scheduleTimeViewData = newViewData;
    },
    [removeSchedule.fulfilled.type]: (state, { payload }: any) => {
      console.log(payload);
    },
    [getScheduleInfo.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleDetial = payload;
    },
  },
});

export default reducer;
