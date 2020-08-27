import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";
import { Schedule } from "../api/api";

export interface ScheduleState {
  total: number;
  scheduleList: Schedule[];
}

interface Rootstate {
  schedules: ScheduleState;
}

const initialState: ScheduleState = {
  total: 0,
  scheduleList: [],
};

type querySchedulesParams = Parameters<typeof api.schedules.querySchedules>[0];
type querySchedulesResult = ReturnType<typeof api.schedules.querySchedules>;

export const getScheduleList = createAsyncThunk<querySchedulesResult, querySchedulesParams>("schedule/scheduleList", (query) => {
  return api.schedules.querySchedules(query);
});

const { reducer } = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: {
    [getScheduleList.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleList = payload.scheduleList;
      state.total = payload.total;
    },
  },
});

export default reducer;
