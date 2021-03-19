import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api, { gqlapi } from "../api";
import {
  ClassesByOrganizationDocument,
  ClassesByOrganizationQuery,
  ClassesByOrganizationQueryVariables,
  ClassesBySchoolDocument,
  ClassesBySchoolQuery,
  ClassesBySchoolQueryVariables,
  ClassesByTeacherQuery,
  ClassesTeachingQueryDocument,
  ClassesTeachingQueryQuery,
  ClassesTeachingQueryQueryVariables,
  MySchoolIDsDocument,
  MySchoolIDsQuery,
  MySchoolIDsQueryVariables,
  ParticipantsByClassDocument,
  ParticipantsByClassQuery,
  ParticipantsByClassQueryVariables,
  ParticipantsByOrganizationDocument,
  ParticipantsByOrganizationQuery,
  ParticipantsByOrganizationQueryVariables,
  ParticipantsBySchoolDocument,
  ParticipantsBySchoolQuery,
  ParticipantsBySchoolQueryVariables,
  QeuryMeDocument,
  QeuryMeQuery,
  QeuryMeQueryVariables,
  TeachersByOrgnizationDocument,
  TeachersByOrgnizationQuery,
  TeachersByOrgnizationQueryVariables,
  UserSchoolIDsDocument,
  UserSchoolIDsQuery,
  UserSchoolIDsQueryVariables,
} from "../api/api-ko.auto";
import {
  ApiSuccessRequestResponse,
  EntityClassType,
  EntityContentInfoWithDetails,
  // EntityProgram,
  EntityScheduleAddView,
  EntityScheduleDetailsView,
  EntityScheduleFeedbackAddInput,
  EntityScheduleFeedbackView,
  EntityScheduleListView,
  EntityScheduleSearchView,
} from "../api/api.auto";
import { apiGetMockOptions, apiWaitForOrganizationOfPage, MockOptions } from "../api/extra";
import teacherListByOrg from "../mocks/teacherListByOrg.json";
import { ChangeParticipants, ClassesData, ParticipantsData, ParticipantsShortInfo, RolesData } from "../types/scheduleTypes";
import { LinkedMockOptionsItem } from "./content";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { AsyncTrunkReturned } from "./report";

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
  class_id: string;
  due_at: number;
  exist_feedback: boolean;
}

interface classOptionsProp {
  classListOrg: ClassesByOrganizationQuery;
  classListTeacher: ClassesByTeacherQuery;
  classListSchool: ClassesBySchoolQuery;
}

export interface ScheduleState {
  total: number;
  searchScheduleList: EntityScheduleSearchView[];
  saveResult: number;
  scheduleDetial: EntityScheduleDetailsView;
  scheduleTimeViewData: scheduleViewData[];
  scheduleTimeViewYearData: [];
  attachement_id: string;
  attachment_path: string;
  searchFlag: boolean;
  mockOptions: MockOptions;
  errorLable: string;
  scheduleMockOptions: getScheduleMockOptionsResponse;
  participantMockOptions: getScheduleParticipantsMockOptionsResponse;
  liveToken: string;
  contentsAuthList: EntityContentInfoWithDetails[];
  classOptions: classOptionsProp;
  ParticipantsData: ParticipantsData;
  participantsIds: ParticipantsShortInfo;
  classRosterIds: ParticipantsShortInfo;
  mySchoolId: string;
  feedbackData: EntityScheduleFeedbackView;
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
  real_time_status: {},
};

const initialState: ScheduleState = {
  contentsAuthList: [],
  saveResult: 1,
  total: 0,
  searchScheduleList: [],
  scheduleDetial: initScheduleDetial,
  scheduleTimeViewData: [],
  scheduleTimeViewYearData: [],
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
  classOptions: {
    classListOrg: {
      organization: {
        classes: [],
      },
    },
    classListTeacher: {
      user: {
        classesTeaching: [],
      },
    },
    classListSchool: {
      school: {
        classes: [],
      },
    },
  },
  ParticipantsData: {
    classes: {
      students: [],
      teachers: [],
    },
  },
  participantsIds: { student: [], teacher: [] },
  classRosterIds: { student: [], teacher: [] },
  mySchoolId: "",
  feedbackData: {
    assignments: [],
    comment: "",
    create_at: 0,
    id: "",
    schedule_id: "",
    user_id: "",
    is_allow_submit: false,
  },
};

type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

type querySchedulesParams = { data: Parameters<typeof api.schedules.querySchedule>[0] } & LoadingMetaPayload;
type querySchedulesResult = ReturnType<typeof api.schedules.querySchedule>;
export const getSearchScheduleList = createAsyncThunk<querySchedulesResult, querySchedulesParams>("schedule/scheduleList", ({ data }) => {
  return api.schedules.querySchedule(data);
});

type SaveStatusResourseParams = {
  payload: EntityScheduleAddView;
  is_new_schedule: boolean;
};
export const saveScheduleData = createAsyncThunk<
  EntityScheduleAddView,
  SaveStatusResourseParams & LoadingMetaPayload,
  { state: Rootstate }
>("schedule/save", async ({ payload, is_new_schedule }, { getState }) => {
  let {
    schedule: {
      scheduleDetial: { id },
    },
  } = getState();
  if (!id || is_new_schedule) {
    const result = await api.schedules.addSchedule(payload).catch((err) => Promise.reject(err.label));
    // @ts-ignore
    if (!result.data?.id) return result;
    // @ts-ignore
    id = result.data?.id;
  } else {
    // @ts-ignore
    const result = await api.schedules.updateSchedule(id, payload).catch((err) => Promise.reject(err.label));
    // @ts-ignore
    if (!result.data?.id) return result;
    // @ts-ignore
    id = result.data?.id;
  }
  // @ts-ignore
  return await api.schedules.getScheduleById(id).catch((err) => Promise.reject(err.label));
});

export interface viewSchedulesResultResponse {
  scheduleTimeViewData?: AsyncReturnType<typeof api.schedulesTimeView.getScheduleTimeView>;
  scheduleTimeViewYearData?: AsyncReturnType<typeof api.schedulesTimeView.getScheduledDates>;
}

type viewSchedulesParams = Parameters<typeof api.schedulesTimeView.getScheduleTimeView>[0] & LoadingMetaPayload;
export const getScheduleTimeViewData = createAsyncThunk<viewSchedulesResultResponse, viewSchedulesParams>(
  "schedule/schedules_time_view",
  async (query) => {
    const [scheduleTimeViewData, scheduleTimeViewYearData] = await Promise.all([
      api.schedulesTimeView.getScheduleTimeView({ ...query }),
      api.schedulesTimeView.getScheduledDates({ ...query }),
    ]);
    return { scheduleTimeViewData, scheduleTimeViewYearData };
  }
);

/**
 *  get class by teacher
 */
export const getClassesByTeacher = createAsyncThunk("getClassesByTeacher", async () => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
    query: QeuryMeDocument,
    variables: {
      organization_id,
    },
  });
  return gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
    query: ClassesTeachingQueryDocument,
    variables: {
      user_id: meInfo.me?.user_id as string,
      organization_id,
    },
  });
});

/**
 *  get class by org
 */
export const getClassesByOrg = createAsyncThunk("getClassesByOrg", async () => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  return gqlapi.query<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>({
    query: ClassesByOrganizationDocument,
    variables: {
      organization_id,
    },
  });
});

export const getParticipantsData = createAsyncThunk("getParticipantsData", async (is_org: boolean) => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  if (is_org) {
    const { data } = await gqlapi.query<ParticipantsByOrganizationQuery, ParticipantsByOrganizationQueryVariables>({
      query: ParticipantsByOrganizationDocument,
      variables: {
        organization_id,
      },
    });
    return data.organization;
  } else {
    const { data: schoolInfo } = await gqlapi.query<MySchoolIDsQuery, MySchoolIDsQueryVariables>({
      query: MySchoolIDsDocument,
      variables: { organization_id },
    });
    if (schoolInfo.me?.membership?.schoolMemberships![0]?.school_id) {
      const { data } = await gqlapi.query<ParticipantsBySchoolQuery, ParticipantsBySchoolQueryVariables>({
        query: ParticipantsBySchoolDocument,
        variables: {
          school_id: schoolInfo.me?.membership?.schoolMemberships![0]?.school_id as string,
        },
      });
      return data.school;
    } else {
      return { classes: [{ students: [], teachers: [] }] };
    }
  }
});

export const getClassesBySchool = createAsyncThunk("getClassesBySchool", async () => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  const { data } = await gqlapi.query<MySchoolIDsQuery, MySchoolIDsQueryVariables>({
    query: MySchoolIDsDocument,
    variables: { organization_id },
  });
  return gqlapi.query<ClassesBySchoolQuery, ClassesBySchoolQueryVariables>({
    query: ClassesBySchoolDocument,
    variables: {
      school_id: data.me?.membership?.schoolMemberships![0]?.school_id as string,
    },
  });
});

export const getSchoolInfo = createAsyncThunk("getSchoolInfo", async () => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
    query: QeuryMeDocument,
    variables: {
      organization_id,
    },
  });
  return gqlapi.query<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>({
    query: UserSchoolIDsDocument,
    variables: {
      user_id: meInfo.me?.user_id as string,
    },
  });
});

type feedbackSchedulesParams = Parameters<typeof api.schedules.getScheduleNewestFeedbackByOperator>[0];
type feedbackSchedulesResult = ReturnType<typeof api.schedules.getScheduleNewestFeedbackByOperator>;
export const getScheduleNewetFeedback = createAsyncThunk<feedbackSchedulesResult, feedbackSchedulesParams>(
  "schedule/feedback",
  (schedule_id) => {
    return api.schedules.getScheduleNewestFeedbackByOperator(schedule_id);
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

type ScheduleShowOptionParams = {
  schedule_id: Parameters<typeof api.schedules.updateScheduleShowOption>[0];
  show_option: Parameters<typeof api.schedules.updateScheduleShowOption>[1];
};
type ScheduleShowOptionResult = ReturnType<typeof api.schedules.updateScheduleShowOption>;
export const scheduleShowOption = createAsyncThunk<ScheduleShowOptionResult, ScheduleShowOptionParams>(
  "updateScheduleShowOption",
  ({ schedule_id, show_option }) => {
    return api.schedules.updateScheduleShowOption(schedule_id, show_option);
  }
);

type getScheduleRealTimeStatusParams = { schedule_id: Parameters<typeof api.schedules.getScheduleRealTimeStatus>[0] } & LoadingMetaPayload;
type getScheduleRealTimeStatusResult = ReturnType<typeof api.schedules.getScheduleRealTimeStatus>;
export const getScheduleRealTimeStatusPath = createAsyncThunk<getScheduleRealTimeStatusResult, getScheduleRealTimeStatusParams>(
  "schedule/getScheduleRealTimeStatus",
  ({ schedule_id }) => {
    return api.schedules.getScheduleRealTimeStatus(schedule_id);
  }
);

type getScheduleNewestFeedbackParams = {
  schedule_id: Parameters<typeof api.schedules.getScheduleNewestFeedbackByOperator>[0];
} & LoadingMetaPayload;
type getScheduleNewestFeedbackResult = ReturnType<typeof api.schedules.getScheduleNewestFeedbackByOperator>;
export const getScheduleNewestFeedback = createAsyncThunk<getScheduleNewestFeedbackResult, getScheduleNewestFeedbackParams>(
  "schedule/getScheduleNewestFeedback",
  ({ schedule_id }) => {
    return api.schedules.getScheduleNewestFeedbackByOperator(schedule_id);
  }
);

export const saveScheduleFeedback = createAsyncThunk<
  ApiSuccessRequestResponse,
  EntityScheduleFeedbackAddInput & LoadingMetaPayload,
  { state: Rootstate }
>("schedules_feedbacks", async (payload, { getState }) => {
  return api.schedulesFeedbacks.addScheduleFeedback(payload);
});

type UpdateStatusResourseParams = {
  schedule_id: Parameters<typeof api.schedules.updateStatus>[0];
  status: Parameters<typeof api.schedules.updateStatus>[1];
};
type UpdateStatusResourseResult = ReturnType<typeof api.schedules.updateStatus>;
export const scheduleUpdateStatus = createAsyncThunk<UpdateStatusResourseResult, UpdateStatusResourseParams>(
  "content/getContentResourceUploadPath",
  ({ schedule_id, status }) => {
    return api.schedules.updateStatus(schedule_id, status);
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
  subjectList: LinkedMockOptionsItem[];
  programList: LinkedMockOptionsItem[];
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

    const [subjectList, programList, classTypeList] = await Promise.all([
      api.subjects.getSubject(),
      api.programs.getProgram(),
      api.classTypes.getClassType(),
    ]);
    return { subjectList, programList, classTypeList, teacherList };
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

type GetContentsAuthedParams = Parameters<typeof api.contentsAuthed.queryAuthContent>[0];
type GetContentsAuthedResult = ReturnType<typeof api.contentsAuthed.queryAuthContent>;
export const getContentsAuthed = createAsyncThunk<GetContentsAuthedResult, GetContentsAuthedParams>("getContentsAuthed", async (query) => {
  return api.contentsAuthed.queryAuthContent({ ...query });
});

interface LiveSchedulePayload extends LoadingMetaPayload {
  schedule_id: Parameters<typeof api.schedules.getScheduleLiveToken>[0];
  live_token_type: "preview" | "live";
}
type LiveScheduleResult = ReturnType<typeof api.schedules.getScheduleLiveToken>;
export const getScheduleLiveToken = createAsyncThunk<LiveScheduleResult, LiveSchedulePayload>(
  "schedule/live",
  async ({ schedule_id, live_token_type }) => {
    return api.schedules.getScheduleLiveToken(schedule_id, { live_token_type: live_token_type }).catch((err) => Promise.reject(err.label));
  }
);

export const getMockOptions = createAsyncThunk("mock/options", async () => {
  return apiGetMockOptions();
});

const scheduleTimeViewDataFormat = (data: EntityScheduleListView[]) => {
  const newViewData: any = [];
  if (data.length > 0) {
    data.forEach((item: EntityScheduleListView) => {
      if (!item) return;
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
    changeParticipants: (state, { payload }: PayloadAction<ChangeParticipants>) => {
      payload.type === "classRoster" ? (state.classRosterIds = payload.data) : (state.participantsIds = payload.data);
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
      if (payload.label !== "schedule_msg_users_conflict") state.scheduleDetial = payload;
    },
    [saveScheduleData.rejected.type]: (state, { error }: any) => {
      state.errorLable = error.message;
    },
    [getScheduleTimeViewData.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleTimeViewData = scheduleTimeViewDataFormat(payload.scheduleTimeViewData);
      state.scheduleTimeViewYearData = payload.scheduleTimeViewYearData;
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
    [getScheduleLiveToken.rejected.type]: (state, { error }: any) => {
      state.liveToken = "";
    },
    [getMockOptions.fulfilled.type]: (state, { payload }: any) => {
      state.mockOptions = payload;
    },
    [getScheduleMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getScheduleMockOptions>>) => {
      state.scheduleMockOptions = payload;
    },
    [getScheduleParticipant.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getScheduleParticipant>>) => {
      state.participantMockOptions = payload;
    },
    [scheduleUpdateStatus.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof scheduleUpdateStatus>>) => {
      console.log(payload);
    },
    [getContentsAuthed.fulfilled.type]: (state, { payload }: any) => {
      state.contentsAuthList = payload.list;
    },
    [getClassesByTeacher.fulfilled.type]: (state, { payload }: any) => {
      state.classOptions.classListTeacher = { user: payload.data.user.membership };
    },
    [getClassesByOrg.fulfilled.type]: (state, { payload }: any) => {
      state.classOptions.classListOrg = payload.data;
    },
    [getClassesBySchool.fulfilled.type]: (state, { payload }: any) => {
      state.classOptions.classListSchool = payload.data;
    },
    [saveScheduleFeedback.fulfilled.type]: (state, { payload }: any) => {
      console.log(saveScheduleFeedback);
    },
    [getParticipantsData.fulfilled.type]: (state, { payload }: any) => {
      // console.log(payload)
      // state.ParticipantsData = payload;
      let teachers: RolesData[] = [];
      let students: RolesData[] = [];
      payload.classes.forEach((item: ClassesData) => {
        teachers = teachers.concat(item.teachers);
        students = students.concat(item.students);
      });
      state.ParticipantsData = { classes: { students, teachers } };
    },
    [getSchoolInfo.fulfilled.type]: (state, { payload }: any) => {
      state.mySchoolId = payload.data.user.school_memberships[0]?.school_id;
    },
    [getScheduleNewestFeedback.fulfilled.type]: (state, { payload }: any) => {
      console.log(payload);
    },
    [scheduleShowOption.fulfilled.type]: (state, { payload }: any) => {
      console.log(payload);
    },
    [getScheduleNewetFeedback.fulfilled.type]: (state, { payload }: any) => {
      state.feedbackData = payload;
    },
  },
});

export const { resetScheduleDetial, resetParticipantList, changeParticipants } = actions;
export default reducer;
