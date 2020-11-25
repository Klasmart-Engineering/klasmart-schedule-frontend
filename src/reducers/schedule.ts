import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api, { gqlapi } from "../api";
import {
  ClassesByOrganizationDocument,
  ClassesByOrganizationQuery,
  ClassesByOrganizationQueryVariables,
  ClassesByTeacherQuery,
  ParticipantsByClassDocument,
  ParticipantsByClassQuery,
  ParticipantsByClassQueryVariables,
  TeachersByOrgnizationDocument,
  TeachersByOrgnizationQuery,
  TeachersByOrgnizationQueryVariables,
} from "../api/api-ko.auto";
import {
  EntityClassType,
  EntityProgram,
  EntityScheduleAddView,
  EntityScheduleDetailsView,
  EntityScheduleListView,
  EntityScheduleSearchView,
  EntitySubject,
} from "../api/api.auto";
import { apiGetMockOptions, apiWaitForOrganizationOfPage, MockOptions } from "../api/extra";
import classListByTeacher from "../mocks/classListByTeacher.json";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { AsyncTrunkReturned } from "./report";
import teacherListByOrg from "../mocks/teacherListByOrg.json";

const MOCK = false;
interface scheduleViewData {
  end: Date;
  id: string;
  start: Date;
  title: string;
  is_repeat: boolean;
  lesson_plan_id: string;
  status: "NotStart" | "Started" | "Closed";
  class_type: string;
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
  scheduleMockOptions: getScheduleMockOptionsResponse;
  participantMockOptions: getScheduleParticipantsMockOptionsResponse;
  liveToken: string;
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
    teacher_class_relationship: [],
  },
  errorLable: "",
  scheduleMockOptions: {
    classList: {
      organization: {
        classes: [],
      },
    },
    teacherList: {
      organization: {
        teachers: [],
      },
    },
    subjectList: [],
    programList: [],
    classTypeList: [],
  },
  participantMockOptions: {
    participantList: {
      class: {
        teachers: [],
        students: [],
      },
    },
  },
  liveToken: "",
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

type IGetContentsResourseParams = Parameters<typeof api.contentsResources.getContentResourceUploadPath>[0];
type IGetContentsResourseResult = ReturnType<typeof api.contentsResources.getContentResourceUploadPath>;
export const getContentResourceUploadPath = createAsyncThunk<IGetContentsResourseResult, IGetContentsResourseParams>(
  "content/getContentResourceUploadPath",
  (query) => {
    return api.contentsResources.getContentResourceUploadPath(query);
  }
);

export interface getScheduleParticipantsPayLoad {
  class_id: string;
}
export interface getScheduleParticipantsMockOptionsResponse {
  participantList: ParticipantsByClassQuery;
}

export interface getScheduleMockOptionsResponse {
  teacherList: TeachersByOrgnizationQuery;
  classList: ClassesByOrganizationQuery;
  subjectList: EntitySubject[];
  programList: EntityProgram[];
  classTypeList: EntityClassType[];
}
interface GetScheduleMockOptionsPayLoad {
  organization_id?: string | null;
  teacher_id?: string;
}

/**
 * get schedule option
 */
export const getScheduleMockOptions = createAsyncThunk<getScheduleMockOptionsResponse, GetScheduleMockOptionsPayLoad>(
  "getClassesList",
  async () => {
    const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
    const { data } = await gqlapi.query<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>({
      query: TeachersByOrgnizationDocument,
      variables: {
        organization_id,
      },
    });
    const mockResult: TeachersByOrgnizationQuery = teacherListByOrg;
    const teacherList = MOCK ? mockResult : data;

    const { data: result } = await gqlapi.query<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>({
      query: ClassesByOrganizationDocument,
      variables: {
        organization_id,
      },
    });
    const [subjectList, programList, classTypeList] = await Promise.all([
      api.subjects.getSubject(),
      api.programs.getProgram(),
      api.classTypes.getClassType(),
    ]);
    const mockClassResult: ClassesByTeacherQuery = classListByTeacher;
    const classList = MOCK ? mockClassResult : result;
    return { classList, subjectList, programList, classTypeList, teacherList };
  }
);

/**
 * get participant
 */
export const getScheduleParticipant = createAsyncThunk<getScheduleParticipantsMockOptionsResponse, getScheduleParticipantsPayLoad>(
  "getParticipant",
  async ({ class_id }) => {
    const { data } = await gqlapi.query<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>({
      query: ParticipantsByClassDocument,
      variables: { class_id },
    });
    const participantList = data;
    return { participantList };
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

const scheduleTimeViewDataFormat = (data: EntityScheduleListView[]) => {
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
    resetParticipantList: (state) => {
      state.participantMockOptions = {
        participantList: {
          class: {
            teachers: [],
            students: [],
          },
        },
      };
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
      state.liveToken = payload.token;
    },
    [getMockOptions.fulfilled.type]: (state, { payload }: any) => {
      state.mockOptions = payload;
    },
    [getScheduleMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getScheduleMockOptions>>) => {
      state.scheduleMockOptions = payload;
    },
    [getScheduleMockOptions.rejected.type]: (state, { error }: any) => {
      state.scheduleMockOptions.classList.organization = { classes: [] };
    },
    [getScheduleParticipant.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getScheduleParticipant>>) => {
      state.participantMockOptions = payload;
    },
  },
});

export const { resetScheduleDetial, resetParticipantList } = actions;
export default reducer;
