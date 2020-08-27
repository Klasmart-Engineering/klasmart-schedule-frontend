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
  scheduleList: [
    {
      id: "Math.floor(1000)",
      title: "Zoo Animals",
      start_at: 1597912763,
      end_at: 1597916363,
      lesson_plan: {
        id: "Math.floor(1000)",
        name: "Big Lesson Plan",
      },
      program: {
        id: "11",
        name: "someProgram",
      },
      subject: {
        id: "111",
        name: "someSubject",
      },
      class: {
        id: "22",
        name: "someClass",
      },
      teachers: [
        {
          id: "Math.floor(1000)",
          name: "handsome teacher",
        },
      ],
    },
  ],
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
