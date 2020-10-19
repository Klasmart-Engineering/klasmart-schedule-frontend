import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { EntityScheduleAddView, EntityScheduleDetailsView, EntityScheduleListView, EntityScheduleSearchView } from "../api/api.auto";
import { apiGetMockOptions, MockOptions } from "../api/extra";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";

interface scheduleViewData {
  end: Date;
  id: string;
  start: Date;
  title: string;
  is_repeat: boolean;
  lesson_plan_id: string;
  status: "NotStart" | "Started" | "Closed";
}

export interface ScheduleState {
  total: number;
  searchScheduleList: EntityScheduleSearchView[];
  saveResult: number;
  scheduleDetial: EntityScheduleDetailsView;
  scheduleTimeViewData: scheduleViewData[];
  attachement_id: string;
  attachment_path: string;
  searchFlag: boolean;
  mockOptions: MockOptions;
  errorLable: string;
}

interface Rootstate {
  schedule: ScheduleState;
}

export const initScheduleDetial: EntityScheduleDetailsView = {
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
  },
  errorLable: "",
};

type querySchedulesParams = { data: Parameters<typeof api.schedules.querySchedule>[0] } & LoadingMetaPayload;
type querySchedulesResult = ReturnType<typeof api.schedules.querySchedule>;
export const getSearchScheduleList = createAsyncThunk<querySchedulesResult, querySchedulesParams>("schedule/scheduleList", ({ data }) => {
  return api.schedules.querySchedule(data);
});

export const saveScheduleData = createAsyncThunk<EntityScheduleAddView, EntityScheduleAddView & LoadingMetaPayload, { state: Rootstate }>(
  "schedule/save",
  async (payload, { getState }) => {
    let {
      schedule: {
        scheduleDetial: { id },
      },
    } = getState();
    if (!id) {
      id = (await api.schedules.addSchedule(payload).catch((err) => Promise.reject(err.label))).id;
    } else {
      id = (await api.schedules.updateSchedule(id, payload).catch((err) => Promise.reject(err.label))).id;
    }
    // @ts-ignore
    return await api.schedules.getScheduleById(id).catch((err) => Promise.reject(err.label));
  }
);

type viewSchedulesParams = Parameters<typeof api.schedulesTimeView.getScheduleTimeView>[0] & LoadingMetaPayload;
type viewSchedulesResult = ReturnType<typeof api.schedulesTimeView.getScheduleTimeView>;
export const getScheduleTimeViewData = createAsyncThunk<viewSchedulesResult, viewSchedulesParams>(
  "schedule/schedules_time_view",
  (query) => {
    return api.schedulesTimeView.getScheduleTimeView({ ...query });
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

type infoSchedulesParams = Parameters<typeof api.schedules.getScheduleById>[0];
type infoSchedulesResult = ReturnType<typeof api.schedules.getScheduleById>;
export const getScheduleInfo = createAsyncThunk<infoSchedulesResult, infoSchedulesParams>("schedule/info", (schedule_id, query) => {
  return api.schedules.getScheduleById(schedule_id);
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
  schedule_id: Parameters<typeof api.schedules.getScheduleLiveToken>[0];
}
type LiveScheduleResult = ReturnType<typeof api.schedules.getScheduleLiveToken>;
export const getScheduleLiveToken = createAsyncThunk<LiveScheduleResult, LiveSchedulePayload>("schedule/live", async ({ schedule_id }) => {
  return api.schedules.getScheduleLiveToken(schedule_id).catch((err) => Promise.reject(err.label));
});

export const getMockOptions = createAsyncThunk("mock/options", async () => {
  return apiGetMockOptions();
});

const scheduleTimeViewDataFormat = (data: scheduleViewData[]) => {
  const newViewData: any = [];
  if (data.length > 0) {
    data.forEach((item: EntityScheduleListView) => {
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
      // state.searchScheduleList = [...state.searchScheduleList, ...payload.data];
      state.searchScheduleList = payload.data;
      state.total = payload.total;
    },
    [getSearchScheduleList.rejected.type]: (state, { error }: any) => {},
    [saveScheduleData.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleDetial = payload;
    },
    [saveScheduleData.rejected.type]: (state, { error }: any) => {
      state.errorLable = error.message;
    },
    [getScheduleTimeViewData.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleTimeViewData = scheduleTimeViewDataFormat(payload);
    },
    [removeSchedule.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleDetial = initScheduleDetial;
    },
    [removeSchedule.rejected.type]: (state, { error }: any) => {
      state.errorLable = error.message;
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
    [getMockOptions.fulfilled.type]: (state, { payload }: any) => {
      state.mockOptions = payload;
    },
  },
});

export const { resetScheduleDetial } = actions;
export default reducer;
