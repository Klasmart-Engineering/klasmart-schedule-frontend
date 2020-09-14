import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { Schedule, ScheduleCreate, ScheduleDetailed, ScheduleTimeView } from "../api/api";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";

interface scheduleViewData {
  end: Date;
  id: string;
  start: Date;
  title: string;
  is_repeat: boolean;
  lesson_plan_id: string;
}

export interface ScheduleState {
  total: number;
  searchScheduleList: Schedule[];
  saveResult: number;
  scheduleDetial: ScheduleDetailed;
  scheduleTimeViewData: scheduleViewData[];
  attachement_id: string;
  attachment_path: string;
  searchFlag: boolean;
}

interface Rootstate {
  schedule: ScheduleState;
}

export const initScheduleDetial: ScheduleDetailed = {
  id: "",
  title: "",
  class: {},
  lesson_plan: {},
  teachers: [],
  start_at: 0,
  end_at: 0,
  repeat: {},
  subject: {},
  program: {},
  class_type: "OnlineClass",
  due_at: 0,
  description: "",
  attachment: {},
  is_all_day: true,
  is_repeat: false,
};

const initialState: ScheduleState = {
  saveResult: 1,
  total: 0,
  searchScheduleList: [],
  scheduleDetial: initScheduleDetial,
  scheduleTimeViewData: [],
  attachement_id: "",
  attachment_path: "",
  searchFlag: false,
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
      schedule: {
        scheduleDetial: { id },
      },
    } = getState();
    if (!id) {
      id = (await api.schedules.createSchedule(payload)).id;
    } else {
      id = (await api.schedules.updateSchedule(id, payload)).id;
    }
    // @ts-ignore
    return await api.schedules.getSchedulesById(id);
  }
);

type viewSchedulesParams = Parameters<typeof api.schedulesTimeView.schedulesTimeView>[0] & LoadingMetaPayload;
type viewSchedulesResult = ReturnType<typeof api.schedulesTimeView.schedulesTimeView>;
export const getScheduleTimeViewData = createAsyncThunk<viewSchedulesResult, viewSchedulesParams>(
  "schedule/schedules_time_view",
  (query) => {
    return api.schedulesTimeView.schedulesTimeView({ ...query });
  }
);

type deleteSchedulesParams = {
  schedule_id: Parameters<typeof api.schedules.deleteSchedule>[0];
  repeat_edit_options: Parameters<typeof api.schedules.deleteSchedule>[1];
};
type deleteSchedulesResult = ReturnType<typeof api.schedules.deleteSchedule>;
export const removeSchedule = createAsyncThunk<deleteSchedulesResult, deleteSchedulesParams>(
  "schedule/delete",
  ({ schedule_id, repeat_edit_options }, query) => {
    return api.schedules.deleteSchedule(schedule_id, repeat_edit_options);
  }
);

type infoSchedulesParams = Parameters<typeof api.schedules.getSchedulesById>[0];
type infoSchedulesResult = ReturnType<typeof api.schedules.getSchedulesById>;
export const getScheduleInfo = createAsyncThunk<infoSchedulesResult, infoSchedulesParams>("schedule/info", (schedule_id, query) => {
  return api.schedules.getSchedulesById(schedule_id);
});

type attachmentParams = Parameters<typeof api.contentsResources.getContentResourceUploadPath>[0];
type attachmentResult = Parameters<typeof api.contentsResources.getContentResourceUploadPath>;

type IGetContentsResourseParams = Parameters<typeof api.contentsResources.getContentResourceUploadPath>[0];
type IGetContentsResourseResult = ReturnType<typeof api.contentsResources.getContentResourceUploadPath>;
export const getContentResourceUploadPath = createAsyncThunk<IGetContentsResourseResult, IGetContentsResourseParams>(
  "content/getContentResourceUploadPath",
  (query) => {
    return api.contentsResources.getContentResourceUploadPath(query);
  }
);

interface LiveSchedulePayload extends LoadingMetaPayload {
  schedule_id: Parameters<typeof api.schedules.getLiveToken>[0];
}
type LiveScheduleResult = ReturnType<typeof api.schedules.getLiveToken>;
export const getScheduleLiveToken = createAsyncThunk<LiveScheduleResult, LiveSchedulePayload>("schedule/live", async ({ schedule_id }) => {
  return api.schedules.getLiveToken(schedule_id);
});

const scheduleTimeViewDataFormat = (data: scheduleViewData[]) => {
  const newViewData: any = [];
  if (data.length > 0) {
    data.forEach((item: ScheduleTimeView) => {
      newViewData.push({
        ...item,
        end: new Date(Number(item.end_at) * 1000),
        start: new Date(Number(item.start_at) * 1000),
      });
    });
  }
  return newViewData;
};

const { actions, reducer } = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    resetScheduleDetial: (state, { payload }: PayloadAction<ScheduleState["scheduleDetial"]>) => {
      state.scheduleDetial = payload;
    },
  },
  extraReducers: {
    [getSearchScheduleList.fulfilled.type]: (state, { payload }: any) => {
      state.searchScheduleList = [...state.searchScheduleList, ...payload.data];
      state.total = payload.total;
      state.searchFlag = true;
    },
    [getSearchScheduleList.rejected.type]: (state, { error }: any) => {
      state.searchFlag = false;
    },
    [saveScheduleData.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleDetial = payload;
    },
    [saveScheduleData.rejected.type]: (state, { error }: any) => {
      console.log(JSON.stringify(error));
    },
    [getScheduleTimeViewData.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleTimeViewData = scheduleTimeViewDataFormat(payload);
    },
    [removeSchedule.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleDetial = initScheduleDetial;
    },
    [getScheduleInfo.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleDetial = payload;
    },
    [getContentResourceUploadPath.fulfilled.type]: (state, { payload }: any) => {
      state.attachment_path = payload.path;
      state.attachement_id = payload.resource_id;
    },
    [getScheduleLiveToken.fulfilled.type]: (state, { payload }: any) => {
      // console.log(payload)
    },
  },
});

export const { resetScheduleDetial } = actions;
export default reducer;
