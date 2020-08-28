import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";
import { Schedule } from "../api/api";

export interface ScheduleState {
  total: number;
  searchScheduleList: Schedule[];
}

interface Rootstate {
  schedules: ScheduleState;
}

const initialState: ScheduleState = {
  total: 0,
  searchScheduleList: [],
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
      state.searchScheduleList = payload.data;
      state.total = payload.total;
    },
  },
});

export default reducer;
