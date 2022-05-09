import DateFnsUtils from "@date-io/date-fns";
import { Box, Button, MenuItem, TextField, ThemeProvider, useMediaQuery, useTheme } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import {
  AddCircleOutlineOutlined,
  Close,
  DeleteOutlineOutlined,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  FileCopyOutlined,
  PermIdentity,
  VisibilityOff,
} from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import ScheduleLessonPlan from "@pages/Material/ScheduleLessonPlan";
import {
  actOutcomeList,
  changeParticipants,
  checkScheduleReview,
  getLessonPlansBySchedule,
  getLessonPlansByScheduleLoadingPage,
  getProgramChild,
  getScheduleMockOptionsResponse,
  getScheduleParticipant,
  getScheduleParticipantsMockOptionsResponse,
  getScheduleTimeViewData,
  getStudentUserNamesById,
  getSubjectByProgramId,
  initscheduleDetail,
  removeSchedule,
  resetActOutcomeList,
  resetParticipantList,
  resetParticipantsData,
  resetscheduleDetail,
  saveScheduleData,
  saveScheduleDataReview,
  ScheduleFilterPrograms,
  scheduleShowOption,
} from "@reducers/schedule";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import clsx from "clsx";
import { enAU, es, id, ko, th, vi, zhCN } from "date-fns/esm/locale";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { ConnectionDirection, Maybe, User } from "@api/api-ko-schema.auto";
import {
  GetClassFilterListQuery,
  GetProgramsQuery,
  GetSchoolsFilterListQuery,
  GetUserQuery,
  ParticipantsByClassQuery,
} from "@api/api-ko.auto";
import {
  EntityContentInfoWithDetails,
  EntityLessonPlanForSchedule,
  EntityScheduleAddView,
  EntityScheduleDetailsView,
  EntityScheduleShortInfo,
} from "@api/api.auto";
import { enableReviewClass, MockOptionsItem, MockOptionsOptionsItem } from "@api/extra";
import PermissionType from "@api/PermissionType";
import { usePermission } from "@hooks/usePermission";
import { initialState, useRepeatSchedule } from "@hooks/useRepeatSchedule";
import { d, localeManager, t } from "@locale/LocaleManager";
import { modelSchedule } from "@models/ModelSchedule";
import { RootState } from "@reducers/index";
import { actError, actSuccess } from "@reducers/notify";
import theme from "../../theme";
import {
  ClassOptionsItem,
  classTypeLabel,
  EntityLessonPlanShortInfo,
  EntityScheduleClassInfo,
  filterOptionItem,
  FilterQueryTypeProps,
  LearningComesFilterQuery,
  LearningContentListForm,
  memberType,
  modeViewType,
  ParticipantsData,
  ParticipantsShortInfo,
  ParticipantString,
  ParticipantValue,
  repeatOptionsType,
  timestampType,
} from "../../types/scheduleTypes";
import AddParticipantsTemplate from "../Participants/AddParticipantsTemplate";
import { AddParticipantsTemplateMb, useAddParticipant } from "../Participants/AddParticipantsTemplateMb";
import ConflictTestTemplate from "../Conflicts/ConflictTestTemplate";
import LearningOutcome from "../Material/LearningOutcome";
import RepeatSchedule from "../Repeat/Repeat";
import ScheduleAttachment from "../Attachments/ScheduleAttachment";
import ScheduleButton from "../Tools/ScheduleButton";
import ScheduleFeedback from "../Attachments/ScheduleFeedback";
import ScheduleFilter from "../Filter/ScheduleFilter";
import ScheduleReviewTemplate from "../Templates/ScheduleReviewTemplate";
import TimeConflictsTemplate from "../Conflicts/TimeConflictsTemplate";

const useStyles = makeStyles(({ shadows, breakpoints }) => ({
  fieldset: {
    marginTop: 20,
    width: "100%",
  },
  fieldsetDisabled: {
    marginTop: 20,
    width: "100%",
    "& .Mui-disabled": {
      color: "rgba(0, 0, 0, 0.54)",
    },
  },
  halfFieldset: {
    marginTop: 20,
    width: "calc(50% - 10px)",
    "&:not(:first-child)": {
      marginLeft: 20,
    },
  },
  formControlSet: {
    padding: "10px 10px 20px 10px",
    boxShadow: shadows[3],
    position: "relative",
    boxSizing: "content-box",
  },
  toolset: {
    fontSize: "20px",
    cursor: "pointer",
  },
  fieldBox: {
    position: "relative",
  },
  iconField: {
    position: "absolute",
    right: "10px",
    top: "22%",
  },
  descFiled: {
    height: "100px",
  },
  repeatBox: {
    position: "absolute",
    top: "0",
    left: "101%",
    boxShadow: shadows[3],
    zIndex: 999,
  },
  smallCalendarBox: {
    boxShadow: shadows[3],
    margin: "0 auto",
  },
  participantBox: {
    width: "100%",
    [breakpoints.down(600)]: {
      width: document.body.clientWidth - 40 + "px",
    },
    maxHeight: "260px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    marginTop: "20px",
    borderRadius: "5px",
    overflow: "auto",
    position: "relative",
  },
  participantSaveBox: {
    width: "100%",
    maxHeight: "200px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    marginTop: "20px",
    borderRadius: "5px",
    padding: "0px 0px 20px 0px",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "3px",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "3px",
      backgroundColor: "rgb(220, 220, 220)",
      boxShadow: "inset 0 0 3px rgba(0,0,0,0.5)",
    },
    "&::-webkit-scrollbar-thumb:window-inactive": {
      backgroundColor: "rgba(220,220,220,0.4)",
    },
  },
  participantContent: {
    backgroundColor: "#E6E6E6",
    padding: "8px 10px 8px 10px",
    marginTop: "10px",
    marginLeft: "10px",
    borderRadius: "18px",
    float: "left",
    display: "flex",
    height: "23px",
  },
  scrollRoster: {
    display: "flex",
    maxHeight: "160px",
    [theme.breakpoints.down("lg")]: {
      height: "200px",
    },
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "3px",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "3px",
      backgroundColor: "rgb(220, 220, 220)",
      boxShadow: "inset 0 0 3px rgba(0,0,0,0.5)",
    },
    "&::-webkit-scrollbar-thumb:window-inactive": {
      backgroundColor: "rgba(220,220,220,0.4)",
    },
  },
  participantButton: {
    float: "right",
    margin: "6px 8px 6px 0px",
    backgroundColor: "#C5DFF5",
    color: "#0E78D5",
  },
  splitLine: {
    width: "1px",
    height: "130px",
    backgroundColor: "rgb(191, 191, 191)",
    position: "absolute",
    left: "50%",
    top: "20%",
  },
  participantText: {
    width: "150px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    margin: "0 auto",
  },
  participantTitle: {
    display: "block",
    fontWeight: "bold",
    fontSize: "14px",
  },
  paper: {
    width: "100%",
  },
  rosterNotice: {
    position: "absolute",
    top: "-9px",
    left: "8px",
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "12px",
    zIndex: 10,
    padding: "0 5px 0 5px",
  },
  learnOutcomeCounter: {
    width: "1.5rem",
    height: "1.5rem",
    backgroundColor: "white",
    color: "blue",
    fontWeight: "bold",
    borderRadius: "1.5rem",
    textAlign: "center",
    lineHeight: "1.5rem",
    marginLeft: "4px",
  },
  addOutcomeBox: {
    "& svg": {
      display: "none",
    },
    "& button": {
      display: "none",
    },
    "& span": {
      maxWidth: "200px",
    },
  },
  saveMb: {
    width: "70%",
    height: "50px",
    background: "#0E78D5",
    borderRadius: "8px",
    textAlign: "center",
    marginTop: "6px",
    fontWeight: 700,
  },
  repeatBoxMb: {
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    display: "flex",
    zIndex: 99,
    position: "fixed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
}));

const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

function SmallCalendar(props: CalendarStateProps) {
  const {
    timesTamp,
    changeTimesTamp,
    modelView,
    mockOptions,
    scheduleMockOptions,
    handleChangeShowAnyTime,
    stateOnlyMine,
    handleChangeOnlyMine,
    privilegedMembers,
    filterOption,
    viewSubjectPermission,
    schoolsConnection,
    getSchoolsConnection,
    getClassesConnection,
    classesConnection,
    getUserOfUndefined,
    userInUndefined,
    filterOtherClasses,
    getClassesWithoutSchool,
  } = props;
  const dispatch = useDispatch();
  const getTimestamp = (date: any | null) => new Date(date).getTime() / 1000;

  const handleDateChange = (date: Date | null) => {
    changeTimesTamp({
      start: getTimestamp(date),
      end: getTimestamp(date),
    });
  };

  const handleChangeLoadScheduleView = useCallback(
    async (filterQuery: FilterQueryTypeProps | []) => {
      dispatch(
        getScheduleTimeViewData({
          view_type: modelView,
          time_at: timesTamp.start,
          time_zone_offset: -new Date().getTimezoneOffset() * 60,
          metaLoading: true,
          ...filterQuery,
        })
      );
    },
    [dispatch, modelView, timesTamp]
  );

  const css = useStyles();

  const lang = { en: enAU, zh: zhCN, vi: vi, ko: ko, id: id, es: es, th: th, zh_CN: zhCN };

  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down(320));

  return (
    <Box className={css.smallCalendarBox} style={{ width: sm ? "310px" : "310px" }}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={lang[localeManager.getLocale()!]}>
        <Grid container justifyContent="space-around">
          <DatePicker autoOk variant="static" openTo="date" value={new Date(timesTamp.start * 1000)} onChange={handleDateChange} />
        </Grid>
        <ScheduleFilter
          getClassesWithoutSchool={getClassesWithoutSchool}
          filterOtherClasses={filterOtherClasses}
          handleChangeLoadScheduleView={handleChangeLoadScheduleView}
          mockOptions={mockOptions}
          scheduleMockOptions={scheduleMockOptions}
          handleChangeShowAnyTime={handleChangeShowAnyTime}
          stateOnlyMine={stateOnlyMine}
          handleChangeOnlyMine={handleChangeOnlyMine}
          modelView={modelView}
          timesTamp={timesTamp}
          privilegedMembers={privilegedMembers}
          filterOption={filterOption}
          viewSubjectPermission={viewSubjectPermission}
          schoolsConnection={schoolsConnection}
          getSchoolsConnection={getSchoolsConnection}
          getClassesConnection={getClassesConnection}
          classesConnection={classesConnection}
          userInUndefined={userInUndefined}
          getUserOfUndefined={getUserOfUndefined}
        />
      </MuiPickersUtilsProvider>
    </Box>
  );
}

function EditBox(props: CalendarStateProps) {
  const css = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const defaults: EntityScheduleShortInfo = {
    id: "",
    name: "",
  };
  const lessonPlanDefaults: EntityLessonPlanShortInfo = {
    title: "",
    id: "",
    name: "",
  };
  const {
    timesTamp,
    modelView,
    scheduleId,
    includeTable,
    changeTimesTamp,
    handleChangeProgramId,
    toLive,
    changeModalDate,
    scheduleMockOptions,
    participantMockOptions,
    getParticipantOptions,
    setSpecificStatus,
    specificStatus,
    participantsIds,
    classRosterIds,
    // ParticipantsData,
    handleChangeParticipants,
    getParticipantsData,
    LinkageLessonPlan,
    contentPreview,
    isHidden,
    handleChangeHidden,
    scheduleDetail,
    privilegedMembers,
    handleChangeShowAnyTime,
    isShowAnyTime,
    stateCurrentCid,
    stateMaterialArr,
    viewSubjectPermission,
    lessonPlans,
    mobile,
    checkFileExist,
  } = props;
  const { classOptions, outcomeListInit } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const [selectedDueDate, setSelectedDate] = React.useState<Date | null>(new Date(new Date().setHours(new Date().getHours())));
  const [classItem, setClassItem] = React.useState<EntityScheduleShortInfo | undefined>(defaults);
  const [lessonPlan, setLessonPlan] = React.useState<EntityLessonPlanShortInfo | undefined>(lessonPlanDefaults);
  const [subjectItem, setSubjectItem] = React.useState<EntityScheduleShortInfo[]>([]);
  const [programItem, setProgramItem] = React.useState<EntityScheduleShortInfo | undefined>(defaults);
  const [attachmentId, setAttachmentId] = React.useState<string>("");
  const [attachmentName, setAttachmentName] = React.useState<string>("");
  const [isRepeatSame, setIsRepeatSame] = React.useState(true);
  const [scheduleRestNum, setScheduleRestNum] = React.useState(0);

  const perm = usePermission([
    PermissionType.attend_live_class_as_a_teacher_186,
    PermissionType.create_event_520,
    PermissionType.create_my_schedule_events_521,
    PermissionType.create_my_schools_schedule_events_522,
    PermissionType.attend_live_class_as_a_student_187,
  ]);

  const permissionShowPreview = perm.attend_live_class_as_a_teacher_186;

  const timestampInt = (timestamp: number) => Math.floor(timestamp);

  const rosterSelectAll = () => {
    const participant: ParticipantsByClassQuery = participantMockOptions.participantList;
    const student = participant?.class?.students?.map((item) => {
      return { id: item?.user_id, name: item?.user_name };
    });
    const teacher = participant?.class?.teachers?.map((item) => {
      return { id: item?.user_id, name: item?.user_name };
    });
    handleChangeParticipants("classRoster", { student, teacher } as ParticipantsShortInfo);
    setIsForce(false);
  };

  const handleRosterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "all") {
      rosterSelectAll();
    } else {
      handleChangeParticipants("classRoster", { student: [], teacher: [] } as ParticipantsShortInfo);
    }
    setIsForce(false);
  };

  const handleParticipantsChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const participantsItem = [{ id: event.target.value, name: event.target.name }];
    const ids = type === "students" ? participantsIds?.student : participantsIds?.teacher;
    // @ts-ignore
    const deconstructIds = [...ids];
    deconstructIds?.forEach((item: ClassOptionsItem, index: number) => {
      if (JSON.stringify({ id: item.id, name: item.name }) === JSON.stringify(participantsItem[0])) {
        deconstructIds.splice(index, 1);
      }
    });
    handleChangeParticipants("participants", {
      student: type === "students" ? deconstructIds : participantsIds?.student,
      teacher: type === "teacher" ? deconstructIds : participantsIds?.teacher,
    } as ParticipantsShortInfo);
    setIsForce(false);
  };

  const handleRosterChangeBox = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const rosterItem = [{ id: event.target.value, name: event.target.name }];
    if (event.target.checked) {
      handleChangeParticipants("classRoster", {
        student: type === "students" ? classRosterIds?.student.concat(rosterItem) : classRosterIds?.student,
        teacher: type === "students" ? classRosterIds?.teacher : classRosterIds?.teacher.concat(rosterItem),
      } as ParticipantsShortInfo);
    } else {
      const ids = type === "students" ? classRosterIds?.student : classRosterIds?.teacher;
      // @ts-ignore
      const deconstructIds = [...ids];
      deconstructIds?.forEach((item: ClassOptionsItem, index: number) => {
        if (JSON.stringify({ id: item.id, name: item.name }) === JSON.stringify(rosterItem[0])) {
          deconstructIds.splice(index, 1);
        }
      });
      handleChangeParticipants("classRoster", {
        student: type === "students" ? deconstructIds : classRosterIds?.student,
        teacher: type === "teacher" ? deconstructIds : classRosterIds?.teacher,
      } as ParticipantsShortInfo);
    }
    setIsForce(false);
  };

  const rosterIsExist = (item: Maybe<{ __typename?: "User" | undefined } & Pick<User, "user_id" | "user_name">>, type: string) => {
    const rosterItem = [{ id: item?.user_id, name: item?.user_name }];
    const searchData = type === "students" ? classRosterIds?.student : classRosterIds?.teacher;
    return searchData?.some(
      (item) =>
        JSON.stringify({
          id: item.id,
          name: item.name,
        }) === JSON.stringify(rosterItem[0])
    ) as boolean;
  };

  React.useEffect(() => {
    if (scheduleId) {
      setAttachmentName(scheduleDetail?.attachment?.name as string);
      setAttachmentId(scheduleDetail?.attachment?.id as string);
    } else {
      setAttachmentName("");
      setAttachmentId("");
    }
    dispatch(resetActOutcomeList([]));
  }, [scheduleDetail, dispatch, scheduleDetail.attachment, scheduleId]);

  React.useEffect(() => {
    const defaults: EntityScheduleShortInfo = {
      id: "",
      name: "",
    };
    const timesTampDada = {
      start_at: timesTamp.start,
      end_at: timesTamp.end,
    };
    setStatus({
      allDayCheck: false,
      repeatCheck: false,
      dueDateCheck: false,
      homeFunCheck: false,
      reviewCheck: false,
      past2: true,
    });
    const newData: any = {
      attachment_path: "",
      class_id: "",
      class_type: "",
      description: "",
      due_at: Math.floor(new Date().getTime() / 1000),
      is_all_day: false,
      is_force: true,
      is_repeat: false,
      lesson_plan_id: "",
      program_id: "",
      repeat: {},
      subject_id: "",
      teacher_ids: [],
      title: "",
      outcome_ids: [],
      ...timesTampDada,
    };
    setClassItem(defaults);
    setLessonPlan(defaults);
    setSubjectItem([]);
    setProgramItem(defaults);
    setScheduleList(newData);
    setInitScheduleList(newData);
    dispatch(resetscheduleDetail(initscheduleDetail));
    dispatch(resetParticipantList());
    dispatch(changeParticipants({ type: "classRoster", data: { student: [], teacher: [] } }));
    dispatch(changeParticipants({ type: "addParticipants", data: { student: [], teacher: [] } }));
    setRosterSaveStatus(false);
    setParticipantSaveStatus(false);
  }, [dispatch, timesTamp, scheduleRestNum]);

  React.useEffect(() => {
    if (scheduleId && scheduleDetail.id) {
      const newData: EntityScheduleAddView = {
        attachment: scheduleDetail.attachment,
        class_id: scheduleDetail.class?.id || "",
        class_type: (scheduleDetail.class_type_label?.id as "Task" | "OnlineClass" | "OfflineClass" | "Homework") || "",
        description: scheduleDetail.description,
        due_at: scheduleDetail.due_at,
        end_at: scheduleDetail.end_at || (scheduleDetail.due_at as number),
        is_all_day: scheduleDetail.is_all_day,
        is_force: true,
        is_repeat: true,
        lesson_plan_id: scheduleDetail.lesson_plan?.id || "",
        program_id: scheduleDetail.program?.id || "",
        repeat: {},
        start_at: scheduleDetail.start_at || (scheduleDetail.due_at as number),
        title: scheduleDetail.title || "",
        is_home_fun: scheduleDetail.is_home_fun,
      };
      setStatus({
        allDayCheck: !!newData.is_all_day,
        repeatCheck: false,
        dueDateCheck: !!newData.due_at,
        homeFunCheck: !!newData.is_home_fun,
        reviewCheck: false,
        past2: true,
      });
      if (scheduleDetail.class) setClassItem(scheduleDetail.class);
      setLessonPlan(scheduleDetail.lesson_plan);
      setSubjectItem((scheduleDetail.subjects ?? []) as EntityScheduleShortInfo[]);
      setProgramItem(scheduleDetail.program);
      setScheduleList(newData);
      setInitScheduleList(newData);

      if (newData.program_id) dispatch(getSubjectByProgramId({ program_id: newData.program_id }));

      const getClassOptionsItem = (item: ClassOptionsItem[]) => {
        const items = item?.map((item: ClassOptionsItem) => {
          return { id: item.id, name: item.name, enable: item.enable };
        });
        return items ?? [];
      };

      dispatch(
        changeParticipants({
          type: "classRoster",
          data: {
            student: getClassOptionsItem(scheduleDetail.class_roster_students as ClassOptionsItem[]),
            teacher: getClassOptionsItem(scheduleDetail.class_roster_teachers as ClassOptionsItem[]),
          },
        })
      );

      dispatch(
        changeParticipants({
          type: "addParticipants",
          data: {
            student: getClassOptionsItem(scheduleDetail.participants_students as ClassOptionsItem[]),
            teacher: getClassOptionsItem(scheduleDetail.participants_teachers as ClassOptionsItem[]),
          },
        })
      );

      if ((scheduleDetail.due_at as number) > 0) {
        setSelectedDate(new Date((scheduleDetail.due_at as number) * 1000));
      }
      // getParticipantOptions("");
      // const currentTime = Math.floor(new Date().getTime());
      // if (
      //   (scheduleDetail.status === "NotStart" || scheduleDetail.status === "Started") &&
      //   newData.start_at! * 1000 - currentTime < 5 * 60 * 1000
      // ) {
      //   dispatch(getScheduleLiveToken({ schedule_id: scheduleDetail.id, live_token_type: "live", metaLoading: true }));
      // }
      if (scheduleDetail.class) dispatch(getScheduleParticipant({ class_id: newData.class_id as string }));

      if (scheduleDetail.class_roster_students || scheduleDetail.class_roster_teachers) setRosterSaveStatus(true);

      if (scheduleDetail.participants_students || scheduleDetail.participants_teachers) setParticipantSaveStatus(true);
      setLinkageLessonPlanOpen(false);
    }
  }, [dispatch, scheduleDetail, scheduleId]);
  const [state, dispatchRepeat] = useRepeatSchedule();
  const { type } = state;
  const repeatData = {
    type,
    [type]: state[type],
  };
  React.useEffect(() => {
    if (scheduleId && scheduleDetail.repeat) {
      // @ts-ignore
      const isSame = JSON.stringify(state[type]) === JSON.stringify(scheduleDetail.repeat[type]);
      setIsRepeatSame(isSame);
    }
  }, [scheduleDetail.repeat, scheduleId, state, type]);
  React.useEffect(() => {
    if (scheduleDetail?.repeat?.type) {
      const data = scheduleDetail.repeat;
      dispatchRepeat({
        type: "changeData",
        data,
      });
    }
  }, [dispatchRepeat, scheduleDetail]);
  React.useEffect(() => {
    const program = modelSchedule.LinkageLessonPlan(contentPreview).program[0] as EntityScheduleShortInfo;
    const subject = modelSchedule.LinkageLessonPlan(contentPreview).subject as EntityScheduleShortInfo[];
    setProgramItem(program);
    setSubjectItem(subject[0].id ? [subject[0]] : []);
  }, [contentPreview]);
  const currentTime = timestampInt(new Date().getTime() / 1000);
  const initData: EntityScheduleAddView = {
    attachment: {},
    class_id: "",
    class_type: "OnlineClass",
    description: "",
    due_at: currentTime,
    end_at: currentTime,
    is_all_day: false,
    is_force: true,
    is_repeat: false,
    lesson_plan_id: "",
    org_id: "",
    program_id: "",
    repeat: {},
    start_at: currentTime,
    subject_ids: [],
    participants_student_ids: [],
    time_zone_offset: 0,
    title: "",
    version: 0,
  };
  const [scheduleList, setScheduleList] = React.useState<EntityScheduleAddView>(initData);
  const [initScheduleList, setInitScheduleList] = React.useState<EntityScheduleAddView>(initData);
  const [linkageLessonPlanOpen, setLinkageLessonPlanOpen] = React.useState<boolean>(false);
  const [rosterSaveStatus, setRosterSaveStatus] = React.useState(false);
  const [isForce, setIsForce] = React.useState(false);
  const [participantSaveStatus, setParticipantSaveStatus] = React.useState(false);

  const timeToTimestamp = (time: string) => {
    const currentTime = time.replace(/-/g, "/").replace(/T/g, " ");
    return timestampInt(new Date(currentTime).getTime() / 1000);
  };

  const timestampToTime = (timestamp: number | undefined, type: string = "default") => {
    const date = timestamp ? new Date(Number(timestamp) * 1000) : new Date();
    const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);

    const [Y, M, D, h, m] = [
      date.getFullYear(),
      dateNumFun(date.getMonth() + 1),
      dateNumFun(date.getDate()),
      dateNumFun(date.getHours()),
      dateNumFun(date.getMinutes()),
      dateNumFun(date.getSeconds()),
    ];

    if (type === "all_day_start") {
      const currentDate = new Date();
      if (dateNumFun(currentDate.getMonth() + 1) === M && dateNumFun(currentDate.getDate()) === D) {
        return (currentTime as number) + 60;
      } else {
        return timestampInt(new Date(Y, date.getMonth(), date.getDate(), 0, 0, 0).getTime() / 1000);
      }
    } else if (type === "all_day_end") {
      return timestampInt(new Date(Y, date.getMonth(), date.getDate(), 23, 59, 59).getTime() / 1000);
    } else if (type === "feedback") {
      return `${Y}-${M}-${D}`;
    } else {
      return `${Y}-${M}-${D}T${h}:${m}`;
    }
  };
  /**
   * autocomplete input change
   * @param value
   * @param name
   */

  const autocompleteChange = async (value: any | null, name: string) => {
    let ids: string[];
    ids = value ? value["id"] : "";
    if (name === "class_id") {
      if (value?.id) {
        let resultInfo: any;
        const getClassOptionsItem = (item: Maybe<{ __typename?: "User" | undefined } & Pick<User, "user_id" | "user_name">>[]) => {
          const items = item?.map((val) => {
            return { id: val?.user_id, name: val?.user_name, enable: true };
          });
          return items ?? [];
        };
        resultInfo = await getParticipantOptions(value["id"]);
        handleChangeParticipants("classRoster", {
          student: getClassOptionsItem(resultInfo.payload.participantList.class.students),
          teacher: getClassOptionsItem(resultInfo.payload.participantList.class.teachers),
        } as ParticipantsShortInfo);
        setRosterSaveStatus(false);
        setIsForce(false);
      } else {
        dispatch(resetParticipantList());
        handleChangeParticipants("classRoster", { student: [], teacher: [] } as ParticipantsShortInfo);
      }
      setClassItem(value);
    }

    if (name === "subject_id") {
      setSubjectItem(checkedStatus.reviewCheck ? [value] : value);
    }

    if (name === "program_id") {
      if (value?.id) {
        if (viewSubjectPermission) {
          const LinkageProgramData: any = await handleChangeProgramId(value.id);
          setSubjectItem(LinkageProgramData && LinkageProgramData.length ? [LinkageProgramData[0]] : []);
        } else {
          dispatch(actError(d("You do not have permission to access this feature.").t("schedule_msg_no_permission")));
        }
      }
      setProgramItem(value);
    }

    if (name === "lesson_plan_id") {
      if (value?.id) {
        const LinkageLessonData: any = await LinkageLessonPlan(value["id"]);
        setScheduleList({ ...scheduleList, ...LinkageLessonData, lesson_plan_id: ids });
      }
      setLessonPlan(value);
    } else {
      setScheduleData(name, ids);
    }
  };
  /**
   * Normal input box change
   * @param event
   * @param name
   */

  const handleTopicListChange = (
    event: React.ChangeEvent<{
      value: String | Number;
    }>,
    name: string
  ) => {
    const value = name === "start_at" || name === "end_at" ? timeToTimestamp(event.target.value as string) : (event.target.value as string);
    if (name === "title" && (event.target.value as string).trim().split(/\s+/).length > 60) return;
    if (name === "description" && (event.target.value as string).length > 100) return;
    if (name === "class_type") {
      dispatch(resetActOutcomeList([]));
      setCondition({ page: 1, exect_search: "all", assumed: -1 });
      setOutcomeIds([]);
      setStatus({
        allDayCheck: false,
        repeatCheck: false,
        dueDateCheck: false,
        homeFunCheck: false,
        reviewCheck: false,
        past2: true,
      });
    }
    setScheduleData(name, value);
  };

  const setScheduleData = (name: string, value: string | number | object | null) => {
    const newTopocList = { ...scheduleList, [name]: value as string | number | object | null };
    setScheduleList(newTopocList as unknown as { [key in keyof EntityScheduleAddView]: EntityScheduleAddView[key] });
  };
  /**
   * form input validator
   */

  const isValidator = {
    title: false,
    lesson_plan_id: false,
    start_at: false,
    end_at: false,
    program_id: false,
    class_type: false,
  };
  const taskValidator = {
    title: false,
    start_at: false,
    end_at: false,
    class_type: false,
  };
  const [validator, setValidator] = React.useState<{
    title?: boolean;
    lesson_plan_id?: boolean;
    start_at: boolean;
    end_at: boolean;
    program_id?: boolean;
    class_type: boolean;
  }>(isValidator);

  const validatorFun = () => {
    let verificaPath = true;
    const validator =
      scheduleList.class_type === "Task"
        ? taskValidator
        : checkedStatus.homeFunCheck
        ? { ...taskValidator, program_id: false }
        : checkedStatus.reviewCheck
        ? { start_at: false, end_at: false, class_type: false, program_id: false }
        : isValidator;

    for (let name in scheduleList) {
      if (validator.hasOwnProperty(name)) {
        // @ts-ignore
        const result = scheduleList[name].toString().length > 0;
        // @ts-ignore
        validator[name] = !result;
        if (!result) {
          // @ts-ignore
          verificaPath = false;
        }
      }
    }
    if (scheduleList.class_type === "Homework") {
      validator.start_at = validator.end_at = false;
    }
    setValidator({ ...validator });
    return verificaPath;
  };
  /**
   * save schedule data
   */
  const saveSchedule = async (
    repeat_edit_options: repeatOptionsType = "only_current",
    is_force: boolean = true,
    is_new_schedule: boolean = false,
    is_check_review: boolean = true
  ) => {
    if (!validatorFun()) return;
    changeModalDate({
      OpenStatus: false,
    });
    const addData: any = {};
    addData["due_at"] = 0;
    const currentTime = Math.floor(new Date().getTime() / 1000);
    // @ts-ignore
    const dueDateTimestamp = timestampInt(selectedDueDate.getTime() / 1000);
    if (checkedStatus.dueDateCheck && (scheduleList.class_type === "Homework" || scheduleList.class_type === "Task")) {
      if (dueDateTimestamp <= scheduleList.end_at! && scheduleList.class_type !== "Homework" && scheduleList.class_type !== "Task") {
        dispatch(actError(d("The due date cannot be earlier than the scheduled class end time.").t("schedule_msg_due_date_earlier")));
        return;
      }
      if (
        (scheduleList.class_type === "Homework" || scheduleList.class_type === "Task") &&
        timestampToTime(dueDateTimestamp, "all_day_end") <= currentTime
      ) {
        dispatch(actError(d("Due date cannot be earlier than today.").t("schedule_msg_earlier_today")));
        return;
      }

      addData["due_at"] = dueDateTimestamp;
    }
    if (scheduleList.start_at! < currentTime && !checkedStatus.repeatCheck && scheduleList.class_type !== "Homework") {
      dispatch(actError(d("Start time cannot be earlier than current time").t("schedule_msg_start_current")));
      return;
    }

    if (scheduleList.end_at! <= scheduleList.start_at! && scheduleList.class_type !== "Homework") {
      dispatch(actError(d("End time cannot be earlier than start time").t("schedule_msg_end_time_earlier")));
      return;
    }

    if (
      scheduleId &&
      checkedStatus.repeatCheck &&
      scheduleList.start_at! < currentTime &&
      repeat_edit_options === "only_current" &&
      scheduleList.class_type !== "Homework"
    ) {
      dispatch(actError(d("Start time cannot be earlier than current time").t("schedule_msg_start_current")));
      return;
    }

    if (scheduleList.class_type === "Homework" && checkedStatus.homeFunCheck) addData["lesson_plan_id"] = "";

    const participant: any = participantMockOptions.participantList;
    const participantSet = participant.class.teachers.concat(participant.class.students);
    let ids: any[] = [];
    participantSet.map((item: any) => ids.push(item.user_id.toString()));
    addData["teacher_ids"] = ids;
    addData["is_all_day"] = checkedStatus.allDayCheck;
    addData["is_repeat"] = checkedStatus.repeatCheck;
    addData["repeat"] = checkedStatus.repeatCheck ? repeatData : {};
    addData["subject_ids"] = [];
    subjectItem.forEach((item: EntityScheduleShortInfo) => {
      addData["subject_ids"].push(item.id);
    });
    addData["attachment"] = {
      id: attachmentId,
      name: attachmentName,
    };

    if (scheduleId) {
      addData["repeat_edit_options"] = repeat_edit_options;
    }

    addData["time_zone_offset"] = -new Date().getTimezoneOffset() * 60;

    addData["is_force"] = isForce ?? is_force;

    const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
    const timestampToTimeReviewTitle = (timestamp: number): string => {
      if (!timestamp) return "N/A";
      const timestampDate = new Date(timestamp * 1000);
      const [M, D] = [(timestampDate as Date).getMonth(), (timestampDate as Date).getDate()];
      return `${monthArr[M]} ${D}`;
    };

    if (checkedStatus.reviewCheck) {
      addData["content_start_at"] = timestampToTime(
        new Date(new Date().setHours(new Date().getHours() - 14 * 24)).getTime() / 1000,
        "all_day_start"
      );
      addData["content_end_at"] = timestampToTime(
        new Date(new Date().setHours(new Date().getHours() - 24)).getTime() / 1000,
        "all_day_end"
      );
      addData["due_at"] = dueDateTimestamp;
      addData["title"] = `${d("Auto Review").t("schedule_label_class_type_review")}: ${classItem?.name ?? ""} ${timestampToTimeReviewTitle(
        addData["content_start_at"] as number
      )} - ${timestampToTimeReviewTitle(addData["content_end_at"] as number)} ${d("Material").t("library_label_material")}`;
    }

    if (scheduleList.class_type === "Homework") {
      addData["is_home_fun"] = checkedStatus.homeFunCheck;
    } else {
      addData["is_home_fun"] = false;
    }

    if (scheduleList.class_type === "Homework" && checkedStatus.homeFunCheck) {
      addData["outcome_ids"] = outComeIds;
    }

    if (scheduleList.class_type === "Homework" || scheduleList.class_type === "Task") addData["is_force"] = true;

    // participants && class roster collision detection
    const participantsIsEmpty: boolean = !(participantsIds?.student.length || participantsIds?.teacher.length);
    const rosterIsEmpty: boolean = !(classRosterIds?.student.length || classRosterIds?.teacher.length);

    if (
      (!scheduleList.class_id && !participantsIds?.teacher.length && !participantsIds?.student.length) ||
      !(participantsIds?.teacher.length || classRosterIds?.teacher.length) ||
      !(participantsIds?.student.length || classRosterIds?.student.length)
    ) {
      dispatch(
        actError(
          d(
            "For ‘Add Class’ (Class Roster) and ‘Add Participants’, at least a student and a teacher will need to be added into either of the field."
          ).t("schedule_msg_no_user")
        )
      );
      return;
    }

    if (!rosterSaveStatus && !rosterIsEmpty) {
      dispatch(actError(d("Please confirm the field of ‘Class Roster’ by clicking OK").t("schedule_msg_roster_no_ok")));
      return;
    }
    if (!participantSaveStatus && !participantsIsEmpty) {
      dispatch(actError(d("Please confirm the field of ‘Add Participants’ by clicking OK").t("schedule_msg_participants_no_ok")));
      return;
    }
    addData["class_roster_student_ids"] = classRosterIds?.student.map((item: ClassOptionsItem) => {
      return item.id;
    });
    addData["class_roster_teacher_ids"] = classRosterIds?.teacher.map((item: ClassOptionsItem) => {
      return item.id;
    });
    addData["participants_student_ids"] = [];
    participantsIds?.student.forEach((item: ClassOptionsItem) => {
      if (!addData["class_roster_student_ids"].includes(item.id)) addData["participants_student_ids"].push(item.id);
    });
    addData["participants_teacher_ids"] = [];
    participantsIds?.teacher.forEach((item: ClassOptionsItem) => {
      if (!addData["class_roster_teacher_ids"].includes(item.id)) addData["participants_teacher_ids"].push(item.id);
    });

    addData["is_review"] = checkedStatus.reviewCheck;

    if (checkedStatus.reviewCheck && is_check_review) {
      let reviewResultInfo: any;
      reviewResultInfo = (await dispatch(
        checkScheduleReview({
          content_end_at: addData["content_end_at"],
          content_start_at: addData["content_start_at"],
          program_id: scheduleList["program_id"],
          student_ids: addData["class_roster_student_ids"].concat(addData["participants_student_ids"]),
          subject_ids: addData["subject_ids"],
          time_zone_offset: addData["time_zone_offset"],
          metaLoading: true,
        })
      )) as unknown as PayloadAction<AsyncTrunkReturned<typeof checkScheduleReview>>;
      const studentInfo = reviewResultInfo.payload.results.filter((item: any) => !item.status).map((student: any) => student.student_id);

      if (studentInfo.length) {
        let reviewStudentInfo: any;
        reviewStudentInfo = (await dispatch(
          getStudentUserNamesById({ metaLoading: true, userIds: studentInfo })
        )) as unknown as PayloadAction<AsyncTrunkReturned<typeof getStudentUserNamesById>>;
        changeModalDate({
          openStatus: true,
          enableCustomization: true,
          customizeTemplate: (
            <ScheduleReviewTemplate
              saveSchedule={saveSchedule}
              handleClose={() => {
                changeModalDate({
                  openStatus: false,
                });
              }}
              checkScheduleReviewData={reviewStudentInfo.payload.data}
              disabledConfirm={
                reviewStudentInfo.payload.data?.usersConnection?.edges?.length ===
                addData["class_roster_student_ids"].concat(addData["participants_student_ids"]).length
              }
            />
          ),
        });
      } else {
        changeModalDate({
          title: "",
          text: d(
            "Publishing your auto review\n\nA new ‘Auto review’ lesson will appear on students’ calendar once our platform has finished an analysis for each student."
          ).t("schedule_review_pop_up_all_success"),
          openStatus: true,
          enableCustomization: false,
          buttons: [
            {
              label: d("OK").t("schedule_button_ok"),
              event: () => {
                saveSchedule("only_current", true, false, false);
                changeModalDate({ openStatus: false, enableCustomization: false });
              },
            },
          ],
          handleClose: () => {
            changeModalDate({ openStatus: false, enableCustomization: false });
          },
        });
      }
      return;
    }

    let resultInfo: any;
    if (checkedStatus.reviewCheck) {
      resultInfo = (await dispatch(
        saveScheduleDataReview({
          payload: { ...scheduleList, ...addData },
          is_new_schedule: is_new_schedule,
          metaLoading: true,
        })
      )) as unknown as PayloadAction<AsyncTrunkReturned<typeof saveScheduleData>>;
    } else {
      resultInfo = (await dispatch(
        saveScheduleData({
          payload: { ...scheduleList, ...addData },
          is_new_schedule: is_new_schedule,
          metaLoading: true,
        })
      )) as unknown as PayloadAction<AsyncTrunkReturned<typeof saveScheduleData>>;
    }

    if (resultInfo.payload) {
      if (resultInfo.payload.data && resultInfo.payload.label && resultInfo.payload.label === "schedule_msg_users_conflict") {
        changeModalDate({
          openStatus: true,
          enableCustomization: true,
          customizeTemplate: (
            <TimeConflictsTemplate
              handleClose={() => {
                changeModalDate({
                  openStatus: false,
                });
              }}
              conflictsData={resultInfo.payload.data}
              handleChangeParticipants={handleChangeParticipants}
              handleDestroyOperations={DestroyOperations}
              classRosterIds={classRosterIds}
              participantsIds={participantsIds}
            />
          ),
        });
        return;
      }
      dispatch(ScheduleFilterPrograms());
      dispatch(resetActOutcomeList([]));
      setCondition({ page: 1, exect_search: "all", assumed: -1 });
      setOutcomeIds([]);
      dispatch(actSuccess(d("Saved Successfully.").t("assess_msg_save_successfully")));
      dispatchRepeat({
        type: "changeData",
        data: initialState,
      });
      const timesTampCallback: timestampType =
        scheduleList.class_type === "Homework"
          ? {
              start: dueDateTimestamp,
              end: dueDateTimestamp,
            }
          : {
              start: scheduleList.start_at as number,
              end: scheduleList.end_at as number,
            };
      changeTimesTamp(timesTampCallback);
      setIsForce(false);
      if (isShowAnyTime) await handleChangeShowAnyTime(true, scheduleDetail.class?.name as string, stateCurrentCid as string);
      if (checkedStatus.reviewCheck) {
        history.push(`/schedule/calendar/rightside/scheduleTable/model/preview`);
      } else {
        history.push(`/schedule/calendar/rightside/${includeTable ? "scheduleTable" : "scheduleList"}/model/preview`);
      }
    } else if (resultInfo.error.message === "schedule_msg_overlap") {
      changeModalDate({
        openStatus: true,
        enableCustomization: false,
        text: d("You already have a class scheduled during this time. Confirm to schedule?").t("schedule_msg_overlap"),
        buttons: [
          {
            label: d("CANCEL").t("schedule_button_cancel"),
            event: () => {
              changeModalDate({
                openStatus: false,
              });
            },
          },
          {
            label: d("CONFIRM").t("schedule_button_confirm"),
            event: () => {
              saveSchedule("with_following", false);
            },
          },
        ],
      });
    }
  };

  const DestroyOperations = (keepRosterOpen: boolean = true): void => {
    setRosterSaveStatus(keepRosterOpen);
    setIsForce(true);
  };

  const isScheduleExpired = (): boolean => {
    return scheduleId
      ? scheduleDetail.status !== "NotStart" ||
          privilegedMembers("Student") ||
          (scheduleDetail.exist_assessment as boolean) ||
          ((scheduleDetail.is_home_fun as boolean) && scheduleDetail.role_type === "Student")
      : false;
  };

  const isScheduleExpiredMulti = (): boolean => {
    return scheduleId
      ? scheduleDetail.status !== "NotStart" || privilegedMembers("Student") || (scheduleDetail.exist_assessment as boolean)
      : false;
  };

  const isLimit = (): boolean => {
    const is_expire = scheduleDetail.due_at && Date.now() > (scheduleDetail.due_at as number) * 1000;
    return scheduleId && checkedStatus.homeFunCheck && scheduleDetail.class_type === "Homework" ? is_expire || isHidden : false;
  };

  const feedBackNoticeEdit = () => {
    changeModalDate({
      title: "",
      text: d("Students have already submitted assignments, a new event will be created.").t("schedule_msg_assignment_new"),
      openStatus: true,
      enableCustomization: false,
      buttons: [
        {
          label: d("CANCEL").t("schedule_button_cancel"),
          event: () => {
            changeModalDate({
              openStatus: false,
            });
          },
        },
        {
          label: d("OK").t("schedule_button_ok"),
          event: () => {
            saveSchedule("only_current", true, true);
          },
        },
      ],
    });
  };

  const feedBackNoticeDelete = () => {
    changeModalDate({
      title: "",
      text: d("This event cannot be deleted because assignments have already been uploaded. Do you want to hide it instead?").t(
        "schedule_msg_hide"
      ),
      openStatus: true,
      enableCustomization: false,
      buttons: [
        {
          label: d("CANCEL").t("schedule_button_cancel"),
          event: () => {
            changeModalDate({
              openStatus: false,
            });
          },
        },
        {
          label: d("OK").t("schedule_button_ok"),
          event: () => {
            handleHide();
          },
        },
      ],
      handleClose: () => {
        changeModalDate({ openStatus: false, enableCustomization: false });
      },
    });
  };

  const getClassOption = (): EntityScheduleShortInfo[] => {
    let lists: EntityScheduleClassInfo[];
    if (perm.create_event_520) {
      lists = classOptions.classListOrg.organization?.classes as EntityScheduleClassInfo[];
    } else if (perm.create_my_schools_schedule_events_522) {
      lists = classOptions.classListSchool.school?.classes as EntityScheduleClassInfo[];
    } else {
      lists = classOptions.classListTeacher.user?.membership?.classesTeaching as EntityScheduleClassInfo[];
    }
    const classResult: EntityScheduleShortInfo[] = [];
    lists?.forEach((item: EntityScheduleClassInfo) => {
      if (item.status === "active") classResult.push({ id: item.class_id, name: item.class_name });
    });
    return classResult;
  };

  const saveTheTest = () => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (scheduleDetail.exist_feedback) {
      feedBackNoticeEdit();
      return;
    }
    if (
      scheduleId &&
      scheduleDetail &&
      scheduleList.start_at &&
      scheduleList.start_at - currentTime < 5 * 60 &&
      scheduleList.class_type !== "Task" &&
      scheduleList.class_type !== "Homework"
    ) {
      changeModalDate({
        title: "",
        // text: reportMiss("You can not edit a class 15 minutes before the start time.", "schedule_msg_edit_minutes"),
        text: d("You can only edit a class at least 5 minutes before the start time.").t("schedule_msg_edit_minutes"),
        openStatus: true,
        enableCustomization: false,
        buttons: [
          {
            label: d("OK").t("schedule_button_ok"),
            event: () => {
              changeModalDate({ openStatus: false, enableCustomization: false });
            },
          },
        ],
        handleClose: () => {
          changeModalDate({ openStatus: false, enableCustomization: false });
        },
      });
      return;
    }

    if (scheduleId && scheduleDetail.is_repeat && checkedStatus.repeatCheck) {
      if (isRepeatSame) {
        changeModalDate({
          openStatus: true,
          enableCustomization: true,
          customizeTemplate: (
            <ConflictTestTemplate
              handleDelete={saveSchedule}
              handleClose={() => {
                changeModalDate({
                  openStatus: false,
                });
              }}
              title="Edit"
            />
          ),
        });
      } else {
        changeModalDate({
          openStatus: true,
          enableCustomization: false,
          text: d("This is an event in a series. Are you sure you want to edit this and following events?").t(
            "schedule_schedule_msg_edit_all"
          ),
          buttons: [
            {
              label: d("CANCEL").t("schedule_button_cancel"),
              event: () => {
                changeModalDate({
                  openStatus: false,
                });
              },
            },
            {
              label: d("CONFIRM").t("schedule_button_confirm"),
              event: () => {
                saveSchedule("with_following", false);
              },
            },
          ],
        });
      }
    } else {
      saveSchedule(checkedStatus.repeatCheck ? "with_following" : "only_current", false);
    }
  };

  const [name, setName] = React.useState("");

  const setSearchName = (v: string) => {
    setName(v);
  };

  const { addParticipantShowIndex, participantActive, openAddParticipant, closeAddParticipant } = useAddParticipant();
  const addParticipants = async () => {
    if (perm.create_my_schedule_events_521 && !perm.create_event_520 && !perm.create_my_schools_schedule_events_522) return;
    if (getParticipantsData) {
      dispatch(resetParticipantsData());
      await getParticipantsData(true, name, "", ParticipantValue.student);
    }
    //
    if (mobile) {
      document.body.style.height = "100vh";
      document.body.style["overflowY"] = "hidden";
      openAddParticipant();
    } else {
      document.body.style.height = "unset";
      document.body.style["overflowY"] = "auto";
      changeModalDate({
        openStatus: true,
        enableCustomization: true,
        customizeTemplate: (
          <AddParticipantsTemplate
            handleClose={() => {
              changeModalDate({
                openStatus: false,
              });
            }}
            handleChangeParticipants={handleChangeParticipants}
            getParticipantsData={getParticipantsData}
            participantsIds={participantsIds as ParticipantsShortInfo}
            participantList={participantMockOptions.participantList}
            nameUpperLevel={name}
            setSearchName={setSearchName}
          />
        ),
      });
      setParticipantSaveStatus(false);
    }
  };

  const [checkedStatus, setStatus] = React.useState({
    allDayCheck: false,
    repeatCheck: false,
    dueDateCheck: false,
    homeFunCheck: false,
    reviewCheck: false,
    past2: true,
  });

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "allDayCheck" && event.target.checked) {
      const newTopocList = {
        ...scheduleList,
        start_at: timestampToTime(scheduleList.start_at, "all_day_start"),
        end_at: timestampToTime(scheduleList.end_at, "all_day_end"),
      };
      setScheduleList(newTopocList as unknown as { [key in keyof EntityScheduleAddView]: EntityScheduleAddView[key] });
    }

    let studyCheck = {};

    if (event.target.name === "homeFunCheck" && event.target.checked) studyCheck = { reviewCheck: false };
    if (event.target.name === "reviewCheck" && event.target.checked) {
      studyCheck = { homeFunCheck: false };
      setSelectedDate(new Date(new Date().setHours(new Date().getHours() + 24)));
    } else {
      setSelectedDate(new Date(new Date().setHours(new Date().getHours())));
    }

    setStatus({ ...checkedStatus, [event.target.name]: event.target.checked, ...studyCheck });

    mobile && event.target.name === "repeatCheck" && showRepeatMbHandle(event.target.checked);
  };

  const handleDueDateChange = (date: Date | null) => {
    if ((timestampToTime(date?.getTime()! / 1000, "all_day_end") as number) * 1000 < new Date().getTime()) return;
    setSelectedDate(date);
  };

  const deleteScheduleById = async (repeat_edit_options: repeatOptionsType = "only_current") => {
    const res: any = await dispatch(
      removeSchedule({
        schedule_id: scheduleDetail.id as string,
        repeat_edit_options: {
          repeat_edit_options: repeat_edit_options,
        },
      })
    );
    if (res.payload === "OK") {
      dispatch(actSuccess(d("Deleted successfully").t("schedule_msg_delete_success")));
      dispatch(
        getScheduleTimeViewData({
          view_type: modelView,
          time_at: timesTamp.start,
          time_zone_offset: -new Date().getTimezoneOffset() * 60,
        })
      );
      setScheduleRestNum(scheduleRestNum + 1);
      changeModalDate({
        openStatus: false,
      });
      if (isShowAnyTime) await handleChangeShowAnyTime(true, scheduleDetail.class?.name as string, stateCurrentCid as string);
      history.push("/schedule/calendar/rightside/scheduleTable/model/preview");
      return;
    }
    changeModalDate({
      openStatus: false,
    });
  };

  const handleHide = async () => {
    await dispatch(
      scheduleShowOption({
        schedule_id: scheduleId as string,
        show_option: { show_option: isHidden ? "visible" : "hidden" },
      })
    );
    handleChangeHidden(!isHidden);
    dispatch(
      getScheduleTimeViewData({
        view_type: modelView,
        time_at: timesTamp.start,
        time_zone_offset: -new Date().getTimezoneOffset() * 60,
      })
    );
    if (isShowAnyTime) await handleChangeShowAnyTime(true, scheduleDetail.class?.name as string, stateCurrentCid as string);
    dispatch(
      actSuccess(
        isHidden ? d("This event is visible again.").t("schedule_msg_visible") : d("This event has been hidden").t("schedule_msg_hidden")
      )
    );
    changeModalDate({
      openStatus: false,
    });
  };

  /**
   * modal type delete
   */

  const handleDelete = () => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (scheduleDetail.exist_feedback) {
      feedBackNoticeDelete();
      return;
    }
    if (scheduleDetail.class_type === "Homework" || scheduleDetail.class_type === "Task") {
      if (scheduleDetail.due_at && scheduleDetail.due_at !== 0 && scheduleDetail.due_at < currentTime) {
        changeModalDate({
          title: "",
          text: "You cannot delete this event after the due date",
          openStatus: true,
          enableCustomization: false,
          buttons: [
            {
              label: d("OK").t("schedule_button_ok"),
              event: () => {
                changeModalDate({ openStatus: false, enableCustomization: false });
              },
            },
          ],
          handleClose: () => {
            changeModalDate({ openStatus: false, enableCustomization: false });
          },
        });
        return;
      }
    } else {
      if (scheduleId && scheduleDetail && scheduleList.start_at && scheduleList.start_at - currentTime < 5 * 60) {
        changeModalDate({
          title: "",
          // text: reportMiss("You can not edit a class 15 minutes before the start time.", "schedule_msg_edit_minutes"),
          text: d("You can only delete a class at least 5 minutes before the start time.").t("schedule_msg_delete_minutes"),
          openStatus: true,
          enableCustomization: false,
          buttons: [
            {
              label: d("OK").t("schedule_button_ok"),
              event: () => {
                changeModalDate({ openStatus: false, enableCustomization: false });
              },
            },
          ],
          handleClose: () => {
            changeModalDate({ openStatus: false, enableCustomization: false });
          },
        });
        return;
      }
    }
    if (scheduleDetail.is_repeat) {
      changeModalDate({
        openStatus: true,
        enableCustomization: true,
        customizeTemplate: (
          <ConflictTestTemplate
            handleDelete={deleteScheduleById}
            handleClose={() => {
              changeModalDate({
                openStatus: false,
              });
            }}
            title={d("Delete").t("assess_label_delete")}
          />
        ),
      });
    } else {
      changeModalDate({
        openStatus: true,
        enableCustomization: false,
        text: d("Are you sure you want to delete this event?").t("schedule_msg_delete"),
        buttons: [
          {
            label: d("CANCEL").t("schedule_button_cancel"),
            event: () => {
              changeModalDate({
                openStatus: false,
              });
            },
          },
          {
            label: d("Delete").t("assess_label_delete"),
            event: () => {
              deleteScheduleById();
            },
          },
        ],
      });
    }
  };
  /**
   * modal type confirm close
   */

  const closeEdit = () => {
    changeModalDate({
      enableCustomization: false,
    });
    const scheduleListOld = JSON.stringify(initScheduleList);
    const scheduleListNew = JSON.stringify(scheduleList);

    if (scheduleListNew === scheduleListOld && !checkedStatus.allDayCheck && !checkedStatus.repeatCheck && !checkedStatus.dueDateCheck) {
      changeTimesTamp({
        start: currentTime,
        end: currentTime,
      });
      history.push("/schedule/calendar/rightside/scheduleTable/model/preview");
      return;
    }

    changeModalDate({
      openStatus: true,
      enableCustomization: false,
      text: d("Discard unsaved changes?").t("schedule_msg_discard"),
      buttons: [
        {
          label: d("CANCEL").t("schedule_button_cancel"),
          event: () => {
            changeModalDate({
              openStatus: false,
            });
          },
        },
        {
          label: d("DISCARD").t("schedule_button_discard"),
          event: () => {
            changeModalDate({
              openStatus: false,
            });
            changeTimesTamp({
              start: currentTime,
              end: currentTime,
            });
            dispatch(resetActOutcomeList([]));
            setCondition({ page: 1, exect_search: "all", assumed: -1 });
            setOutcomeIds([]);
            history.push("/schedule/calendar/rightside/scheduleTable/model/preview");
          },
        },
      ],
    });
  };

  const handleRepeatData = (data: any) => {
    dispatchRepeat({
      type: "changeData",
      data,
    });
  };

  const permsClassType = usePermission([
    PermissionType.create_live_calendar_events_524,
    PermissionType.create_class_calendar_events_525,
    PermissionType.create_study_calendar_events_526,
    PermissionType.create_home_fun_calendar_events_527,
  ]);

  const menuItemListClassType = (list: MockOptionsItem[]) => {
    const permsArr = [
      {
        id: "OfflineClass",
        perms: permsClassType.create_class_calendar_events_525,
      },
      {
        id: "OnlineClass",
        perms: permsClassType.create_live_calendar_events_524,
      },
      {
        id: "Homework",
        perms: permsClassType.create_study_calendar_events_526,
      },
      {
        id: "Task",
        perms: permsClassType.create_home_fun_calendar_events_527,
      },
    ];
    const classType = list
      .filter((item) => privilegedMembers("Student") || permsArr.filter((perm) => perm.id === item.id)[0].perms)
      .map((item) => t(item.name as classTypeLabel))
      .sort();
    const getKey = (name: string) => {
      const key = list.filter((item) => t(item.name as classTypeLabel) === name);
      return key.length ? key[0].id : "";
    };
    return classType.map((name) => (
      <MenuItem key={getKey(name)} value={getKey(name)}>
        {name}
      </MenuItem>
    ));
  };

  const menuItemListClassKr = (type: string) => {
    const classRosterIdsTeacher = classRosterIds?.teacher.map((item: any) => {
      return { ...item, type: "teacher" };
    });
    const classRosterIdsStudent = classRosterIds?.student.map((item: any) => {
      return { ...item, type: "student" };
    });
    const participantsIdsTeacher = participantsIds?.teacher.map((item: any) => {
      return { ...item, type: "teacher" };
    });
    const participantsIdsStudent = participantsIds?.student.map((item: any) => {
      return { ...item, type: "student" };
    });
    const participantSet: any =
      type === "roster" ? classRosterIdsTeacher?.concat(classRosterIdsStudent) : participantsIdsTeacher?.concat(participantsIdsStudent);
    return participantSet.map((item: any, key: number) => (
      <span key={key} className={css.participantContent}>
        {item.type === "teacher" && <PermIdentity />}
        <span>{item.name}</span>
      </span>
    ));
  };

  const menuItemListMaterial = () => {
    const materialArr = (stateMaterialArr.length > 0 ? stateMaterialArr : scheduleDetail.lesson_plan?.materials) as (
      | EntityContentInfoWithDetails
      | undefined
    )[];
    return materialArr?.map((item: any, key: number) => (
      <p key={key} style={{ fontWeight: 500, paddingLeft: "10px", wordBreak: "break-all" }}>{`${key + 1}. ${item.name}`}</p>
    ));
  };

  const menuItemListClassKrParticipants = (type: string) => {
    const participant: ParticipantsByClassQuery = participantMockOptions.participantList;
    const participantSet = type === "teacher" ? participant?.class?.teachers : participant?.class?.students;
    return participantSet
      ? participantSet?.map((item) => (
          <Tooltip key={item?.user_id} title={item?.user_name as string} placement="right-start">
            <FormControlLabel
              className={css.participantText}
              control={
                <Checkbox
                  checked={rosterIsExist(item, type)}
                  name={item?.user_name as string}
                  color="primary"
                  value={item?.user_id}
                  onChange={(e) => {
                    handleRosterChangeBox(e, type);
                  }}
                />
              }
              label={item?.user_name}
            />
          </Tooltip>
        ))
      : [];
  };

  const handleGoLive = (scheduleDetail: EntityScheduleDetailsView) => {
    const currentTime = Math.floor(new Date().getTime() / 1000);

    if (permissionShowPreview && scheduleList.class_type === "Homework") {
      toLive();
      return;
    }

    if (scheduleDetail && scheduleDetail.start_at && scheduleDetail.start_at - currentTime > 15 * 60) {
      changeModalDate({
        title: "",
        text: d("You can only start a class 15 minutes before the start time.").t("schedule_msg_start_minutes"),
        openStatus: true,
        enableCustomization: false,
        buttons: [
          {
            label: d("OK").t("schedule_button_ok"),
            event: () => {
              changeModalDate({ openStatus: false, enableCustomization: false });
            },
          },
        ],
        handleClose: () => {
          changeModalDate({ openStatus: false, enableCustomization: false });
        },
      });
      return;
    }
    toLive();
  };

  const arrEmpty = (item: ClassOptionsItem[] | undefined): boolean => {
    return JSON.stringify(item) === "[]";
  };

  const repeatHide = () => {
    return scheduleList.class_type === "Task" && checkedStatus.dueDateCheck;
  };

  const dueDataHide = () => {
    return scheduleList.class_type === "Task" && checkedStatus.repeatCheck;
  };

  const conditionFormMethods = useForm<LearningContentListForm>();
  const { getValues } = conditionFormMethods;
  const [outComeIds, setOutcomeIds] = React.useState<string[]>([]);
  const [condition, setCondition] = React.useState<any>({ page: 1, exect_search: "all", assumed: -1 });
  const [programChildInfo, setProgramChildInfo] = React.useState<GetProgramsQuery[]>();
  const [showRepeatMb, setShowRepeatMb] = React.useState<boolean>(false);
  const handelSetProgramChildInfo = (data: GetProgramsQuery[]) => {
    setProgramChildInfo(data);
  };

  useEffect(() => {
    setOutcomeIds(scheduleDetail.outcome_ids ?? []);
  }, [scheduleDetail.outcome_ids, setOutcomeIds]);

  const getLearningOutcomeData = async (conditionOt: any) => {
    const query =
      conditionOt.exect_search === "all"
        ? {
            ...conditionOt,
            page_size: -1,
            search_key: conditionOt.search_key,
            metaLoading: true,
            exect_search: null,
            page: null,
            publish_status: "published",
          }
        : {
            ...conditionOt,
            [conditionOt.exect_search]: conditionOt.search_key,
            page_size: -1,
            exect_search: null,
            search_key: null,
            metaLoading: true,
            page: null,
            publish_status: "published",
          };
    await dispatch(actOutcomeList(clearNull(query)));
  };

  const searchOutcomesList = async (filterQueryAssembly: object, is_assumed?: boolean) => {
    const query = {
      exect_search: "all",
      search_key: getValues().search_value,
      assumed: is_assumed ? 1 : -1,
      page: getValues().page,
      ...filterQueryAssembly,
    };
    setCondition({ ...query });
    const condition = scheduleDetail.id ? { ...query, schedule_id: scheduleDetail.id } : query;
    await getLearningOutcomeData(condition);
  };

  const saveOutcomesList = (value: string[]) => {
    setOutcomeIds(value);
    changeModalDate({ openStatus: false });
  };

  const learningOutcomeData: LearningContentListForm = {
    search_type: condition.exect_search ?? "all",
    search_value: condition.search_key ?? "",
    is_assumed: condition.assumed === 1,
    content_list: [],
    page: condition.page ?? 1,
  };
  const subjectIds = subjectItem.map((item: EntityScheduleShortInfo) => {
    return item.id;
  });

  const filterGroupData: LearningComesFilterQuery = {
    programs: Array.from(new Set((condition.program_ids ?? []).concat(scheduleList.program_id ? [scheduleList.program_id] : []))),
    subjects: Array.from(new Set((condition.subject_ids ?? []).concat(subjectIds))),
    category: condition.category_ids ?? [],
    subs: condition.sub_category_ids ?? [],
    ages: condition.age_ids ?? [],
    grades: condition.grade_ids ?? [],
  };

  const [lessonPlanCondition, setLessonPlanCondition] = React.useState<any>({
    page: 1,
    page_size: 10,
    group_names: [],
  });

  const filterLessonGroupData: LearningComesFilterQuery = {
    programs: lessonPlanCondition.program_ids ?? [],
    subjects: lessonPlanCondition.subject_ids ?? [],
    category: lessonPlanCondition.category_ids ?? [],
    subs: lessonPlanCondition.sub_category_ids ?? [],
    ages: lessonPlanCondition.age_ids ?? [],
    grades: lessonPlanCondition.grade_ids ?? [],
  };

  const searchLessonPlanList = async (filterQueryAssembly: object) => {
    const query = {
      ...lessonPlanCondition,
      ...filterQueryAssembly,
    };

    setLessonPlanCondition({ ...query });

    if (query.page > 1) {
      await dispatch(getLessonPlansByScheduleLoadingPage({ metaLoading: true, ...query }));
    } else {
      await dispatch(getLessonPlansBySchedule({ metaLoading: true, ...query }));
    }
  };

  const handleLessonPlan = async () => {
    changeModalDate({
      enableCustomization: true,
      customizeTemplate: (
        <ScheduleLessonPlan
          viewSubjectPermission={viewSubjectPermission}
          autocompleteChange={autocompleteChange}
          lessonPlanCondition={lessonPlanCondition}
          handleClose={() => {
            changeModalDate({ openStatus: false, enableCustomization: false });
          }}
          filterGroupData={filterLessonGroupData}
          searchOutcomesList={searchLessonPlanList}
          programs={modelSchedule.Deduplication(
            modelSchedule.LinkageLessonPlan(contentPreview).program.concat(scheduleMockOptions.programList).concat(programItem!)
          )}
          lessonPlanId={scheduleList.lesson_plan_id}
          handelSetProgramChildInfo={handelSetProgramChildInfo}
          programChildInfoParent={programChildInfo}
          lessonPlans={lessonPlans}
        />
      ),
      openStatus: true,
      handleClose: () => {
        changeModalDate({ openStatus: false });
      },
      showScheduleInfo: true,
    });
  };

  const handeLearningOutcome = async () => {
    let resultInfo: any;
    if (scheduleList.program_id) {
      if (viewSubjectPermission) {
        resultInfo = (await dispatch(
          getProgramChild({ program_id: scheduleList.program_id, metaLoading: true })
        )) as unknown as PayloadAction<AsyncTrunkReturned<typeof getProgramChild>>;
      } else {
        dispatch(actError(d("You do not have permission to access this feature.").t("schedule_msg_no_permission")));
      }
    }
    await getLearningOutcomeData({
      ...condition,
      program_ids: filterGroupData.programs.length ? filterGroupData.programs : null,
      subject_ids: filterGroupData.subjects.length ? filterGroupData.subjects : null,
    });
    changeModalDate({
      enableCustomization: true,
      customizeTemplate: (
        <LearningOutcome
          viewSubjectPermission={viewSubjectPermission}
          handleClose={() => {
            setCondition({ page: 1, exect_search: "all", assumed: -1 });
            changeModalDate({ openStatus: false, enableCustomization: false });
          }}
          learningOutcomeData={learningOutcomeData}
          filterGroupData={filterGroupData}
          conditionFormMethods={conditionFormMethods}
          searchOutcomesList={searchOutcomesList}
          saveOutcomesList={saveOutcomesList}
          outComeIds={outComeIds}
          scheduleDetail={scheduleDetail}
          programs={modelSchedule.Deduplication(
            modelSchedule.LinkageLessonPlan(contentPreview).program.concat(scheduleMockOptions.programList).concat(programItem!)
          )}
          handelSetProgramChildInfo={handelSetProgramChildInfo}
          programChildInfoParent={
            (programChildInfo
              ? programChildInfo?.concat(resultInfo && resultInfo.payload ? [resultInfo.payload.programChildInfo] : [])
              : resultInfo && resultInfo.payload
              ? [resultInfo.payload.programChildInfo]
              : []) as GetProgramsQuery[]
          }
        />
      ),
      openStatus: true,
      handleClose: () => {
        setCondition({ page: 1, exect_search: "all", assumed: -1 });
        changeModalDate({ openStatus: false });
      },
      showScheduleInfo: true,
    });
  };

  const learningOutcomeDefault = () => {
    const list = outcomeListInit.filter((item) => outComeIds.includes(item.outcome_id as string));
    return outComeIds
      .map((id) => {
        return list.filter((item) => {
          return id === item.outcome_id;
        })[0];
      })
      .reverse();
  };

  const showRepeatMbHandle = (show: boolean) => {
    setShowRepeatMb(show);
    document.getElementsByTagName("html")[0].style.overflow = show ? "hidden" : "auto";
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={css.formControlSet}>
        <Box>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={6}>
              <Close
                style={{
                  color: "#666666",
                }}
                className={css.toolset}
                onClick={closeEdit}
              />
            </Grid>
            {!isScheduleExpiredMulti() && (
              <Grid
                item
                xs={6}
                style={{
                  textAlign: "right",
                }}
              >
                {!isHidden && (
                  <DeleteOutlineOutlined
                    style={{
                      color: "#D74040",
                      visibility: scheduleId ? "visible" : "hidden",
                    }}
                    className={css.toolset}
                    onClick={handleDelete}
                  />
                )}
                {scheduleDetail.exist_feedback && isHidden && (
                  <VisibilityOff style={{ color: "#000000" }} onClick={handleHide} className={css.toolset} />
                )}
              </Grid>
            )}
          </Grid>
        </Box>
        <TextField
          className={css.fieldset}
          label={d("Class Type").t("schedule_detail_class_type")}
          value={scheduleList.class_type}
          onChange={(e) => handleTopicListChange(e, "class_type")}
          error={validator.class_type && !scheduleList.class_type}
          select
          required
          disabled={isScheduleExpired() || scheduleDetail.exist_feedback}
        >
          {menuItemListClassType(scheduleMockOptions.classTypeList)}
        </TextField>
        {scheduleList.class_type === "Homework" && (
          <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", paddingLeft: "8px" }}>
            <FormGroup row>
              <FormControlLabel
                disabled={isScheduleExpired() || isLimit()}
                control={<Checkbox name="homeFunCheck" color="primary" checked={checkedStatus.homeFunCheck} onChange={handleCheck} />}
                label={d("Home Fun").t("schedule_checkbox_home_fun")}
              />
              {!scheduleId && enableReviewClass && (
                <FormControlLabel
                  disabled={isScheduleExpired() || isLimit()}
                  control={<Checkbox name="reviewCheck" color="primary" checked={checkedStatus.reviewCheck} onChange={handleCheck} />}
                  label={d("Auto Review").t("schedule_label_class_type_review")}
                />
              )}
            </FormGroup>
            {checkedStatus.reviewCheck && (
              <span style={{ color: "#666666", fontSize: "16px", fontWeight: 400 }}>
                {d("Due Date can only be set after +1 days from today to allow time for students to complete.").t("schedule_due_date_info")}
              </span>
            )}
          </Box>
        )}
        {checkedStatus.reviewCheck && (
          <Box className={css.fieldBox}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Due Date"
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className={css.fieldset}
                required
                value={selectedDueDate}
                disabled={isScheduleExpired() || isLimit()}
                onChange={handleDueDateChange}
              />
            </MuiPickersUtilsProvider>
          </Box>
        )}
        {!(scheduleList.class_type === "Homework" && checkedStatus.reviewCheck) && (
          <Box className={css.fieldBox}>
            <TextField
              error={validator.title && !scheduleList.title}
              className={css.fieldset}
              multiline
              rows={6}
              label={d("Lesson Name").t("schedule_detail_lesson_name")}
              value={scheduleList.title}
              onChange={(e) => handleTopicListChange(e, "title")}
              required
              disabled={isScheduleExpired() || isLimit()}
            />
            <FileCopyOutlined className={css.iconField} />
          </Box>
        )}
        {scheduleList.class_type === "Homework" && checkedStatus.reviewCheck && (
          <Box>
            {scheduleList.class_type === "Homework" && checkedStatus.reviewCheck && (
              <span style={{ color: "#666666", fontSize: "16px", fontWeight: 400, paddingLeft: "8px", marginTop: "8px", display: "block" }}>
                {d("I would like content to be reviewed that was covered:").t("schedule_review_date_range_info")}
              </span>
            )}
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label={d("Start Time").t("schedule_detail_start_time")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className={css.fieldset}
                required
                value={new Date(new Date().setHours(new Date().getHours() - 14 * 24))}
                disabled
                onChange={handleDueDateChange}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label={d("End Time").t("schedule_detail_end_time")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className={css.fieldset}
                required
                value={new Date(new Date().setHours(new Date().getHours() - 24))}
                disabled
                onChange={handleDueDateChange}
              />
            </MuiPickersUtilsProvider>
          </Box>
        )}
        {scheduleList.class_type !== "Homework" && (
          <Box>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    id="datetime-local"
                    label={d("Start Time").t("schedule_detail_start_time")}
                    type="datetime-local"
                    className={css.fieldset}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    value={timestampToTime(scheduleList.start_at)}
                    disabled={isScheduleExpired() || checkedStatus.allDayCheck || isLimit()}
                    onChange={(e) => handleTopicListChange(e, "start_at")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="datetime-local"
                    label={d("End Time").t("schedule_detail_end_time")}
                    type="datetime-local"
                    className={css.fieldset}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    value={timestampToTime(scheduleList.end_at)}
                    disabled={isScheduleExpired() || checkedStatus.allDayCheck || isLimit()}
                    onChange={(e) => handleTopicListChange(e, "end_at")}
                  />
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
          </Box>
        )}
        {scheduleList.class_type === "Homework" && checkedStatus.reviewCheck && (
          <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", paddingLeft: "8px" }}>
            <FormGroup row>
              <FormControlLabel
                disabled
                control={<Checkbox name="past2" color="primary" checked={checkedStatus.past2} onChange={handleCheck} />}
                label="Past 2 week"
              />
            </FormGroup>
          </Box>
        )}
        {scheduleList.class_type !== "Homework" && (
          <Box>
            <FormGroup row>
              <FormControlLabel
                disabled={isScheduleExpired() || isLimit()}
                control={<Checkbox name="allDayCheck" color="primary" checked={checkedStatus.allDayCheck} onChange={handleCheck} />}
                label={d("All day").t("schedule_detail_all_day")}
              />
              {!repeatHide() && (
                <FormControlLabel
                  disabled={isScheduleExpired() || isLimit()}
                  control={<Checkbox name="repeatCheck" color="primary" checked={checkedStatus.repeatCheck} onChange={handleCheck} />}
                  label={d("Repeat").t("schedule_detail_repeat")}
                />
              )}
            </FormGroup>
          </Box>
        )}
        <Box
          style={{
            display:
              (scheduleList?.class_type === "Task" || (scheduleList?.class_type === "Homework" && !checkedStatus.reviewCheck)) &&
              !dueDataHide()
                ? "block"
                : "none",
          }}
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs={5}>
                <FormControlLabel
                  disabled={isScheduleExpired() || isLimit()}
                  control={<Checkbox name="dueDateCheck" color="primary" checked={checkedStatus.dueDateCheck} onChange={handleCheck} />}
                  label={d("Due Date").t("schedule_detail_due_date")}
                />
              </Grid>
              <Grid item xs={7}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label={d("Pick Time").t("schedule_detail_pick_time")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  value={selectedDueDate}
                  disabled={isScheduleExpired() || isLimit()}
                  onChange={handleDueDateChange}
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        </Box>
        <Autocomplete
          id="combo-box-demo"
          options={getClassOption()}
          getOptionLabel={(option: any) => option.name}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "class_id");
          }}
          value={classItem}
          disabled={isScheduleExpired() || scheduleDetail?.class?.enable === false || isLimit()}
          renderInput={(params) => (
            <TextField
              {...params}
              className={css.fieldset}
              label={d("Add Class").t("schedule_detail_add_class")}
              required
              variant="outlined"
            />
          )}
        />
        {!privilegedMembers("Student") &&
          (menuItemListClassKrParticipants("teacher").length > 0 || menuItemListClassKrParticipants("students").length > 0) &&
          !rosterSaveStatus && (
            <Box style={{ position: "relative" }}>
              <span className={css.rosterNotice}>
                {d("Class Roster").t("schedule_detail_class_roster")} <span style={{ color: "#D32F2F" }}>*</span>
              </span>
              <Box className={css.participantBox}>
                <div style={{ textAlign: "end" }}>
                  <FormControlLabel
                    control={
                      <Radio
                        name="checkedA"
                        value="all"
                        color="primary"
                        checked={modelSchedule.ClassRosterDigital(classRosterIds, participantMockOptions) === 1}
                        onChange={handleRosterChange}
                      />
                    }
                    label={d("Select All").t("schedule_detail_select_all")}
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        name="checkedB"
                        value="empty"
                        color="primary"
                        checked={modelSchedule.ClassRosterDigital(classRosterIds, participantMockOptions) === 2}
                        onChange={handleRosterChange}
                      />
                    }
                    label={d("Unselect All").t("schedule_detail_unselect_all")}
                  />
                </div>
                <div className={css.scrollRoster} style={{ marginBottom: "10px" }}>
                  <div style={{ textAlign: "center", width: "202px" }}>
                    <span className={css.participantTitle}>{d("Students").t("assess_detail_students")}</span>
                    {menuItemListClassKrParticipants("students")}
                  </div>
                  <div className={css.splitLine} />
                  <div style={{ textAlign: "center", width: "202px" }}>
                    <span className={css.participantTitle}>{d("Teachers").t("schedule_filter_teachers")}</span>
                    {menuItemListClassKrParticipants("teacher")}
                  </div>
                </div>
                <Button
                  variant="contained"
                  onClick={() => {
                    setRosterSaveStatus(true);
                  }}
                  className={css.participantButton}
                >
                  {d("OK").t("assess_label_ok")}
                </Button>
              </Box>
            </Box>
          )}
        {!privilegedMembers("Student") && menuItemListClassKr("roster").length > 0 && rosterSaveStatus && (
          <Box style={{ position: "relative" }}>
            <span className={css.rosterNotice}>
              {d("Class Roster").t("schedule_detail_class_roster")} <span style={{ color: "#D32F2F" }}>*</span>
            </span>
            <Box className={css.participantSaveBox}>
              {!(isScheduleExpired() || isLimit()) && (
                <CreateOutlinedIcon
                  onClick={() => {
                    if (isScheduleExpired() || isLimit()) return;
                    if (scheduleDetail?.class?.enable !== false) {
                      setRosterSaveStatus(false);
                      setIsForce(false);
                    }
                  }}
                  style={{
                    float: "right",
                    marginLeft: "8px",
                    cursor: scheduleDetail?.class?.enable !== false ? "pointer" : "no-drop",
                  }}
                />
              )}
              <br />
              {menuItemListClassKr("roster")}
            </Box>
          </Box>
        )}
        {(!arrEmpty(participantsIds?.student) || !arrEmpty(participantsIds?.teacher)) && !participantSaveStatus && (
          <>
            <Box style={{ position: "relative" }}>
              <span className={css.rosterNotice}>
                {d("Add Participants").t("schedule_detail_participants")} <span style={{ color: "#D32F2F" }}>*</span>
              </span>
              <Box className={css.participantBox}>
                <div className={css.scrollRoster} style={{ marginTop: "20px", marginBottom: "10px" }}>
                  <div style={{ textAlign: "center", width: "202px" }}>
                    <span className={css.participantTitle}>{d("Students").t("assess_detail_students")}</span>
                    {participantsIds?.student.map((item: ClassOptionsItem) => {
                      return (
                        <Tooltip title={item.name as string} placement="right-start">
                          <FormControlLabel
                            className={css.participantText}
                            control={
                              <Checkbox
                                name={item.name}
                                value={item.id}
                                color="primary"
                                checked={true}
                                disabled={item.enable === false}
                                onChange={(e) => {
                                  handleParticipantsChange(e, "students");
                                }}
                              />
                            }
                            label={item.name}
                          />
                        </Tooltip>
                      );
                    })}
                  </div>
                  <div className={css.splitLine} />
                  <div style={{ textAlign: "center", width: "202px" }}>
                    <span className={css.participantTitle}>{d("Teachers").t("schedule_filter_teachers")}</span>
                    {participantsIds?.teacher.map((item: ClassOptionsItem) => {
                      return (
                        <Tooltip title={item.name as string} placement="right-start">
                          <FormControlLabel
                            className={css.participantText}
                            control={
                              <Checkbox
                                name={item.name}
                                value={item.id}
                                color="primary"
                                checked={true}
                                disabled={item.enable === false}
                                onChange={(e) => {
                                  handleParticipantsChange(e, "teacher");
                                }}
                              />
                            }
                            label={item.name}
                          />
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setParticipantSaveStatus(true);
                    setIsForce(false);
                  }}
                  className={css.participantButton}
                >
                  {d("OK").t("general_button_OK")}
                </Button>
                <Button variant="contained" onClick={addParticipants} className={css.participantButton}>
                  {d("Add").t("schedule_participants_button_add")}
                </Button>
              </Box>
            </Box>
          </>
        )}
        {!privilegedMembers("Student") && menuItemListClassKr("teacher").length > 0 && participantSaveStatus && (
          <Box style={{ position: "relative" }}>
            <span className={css.rosterNotice}>
              {d("Add Participants").t("schedule_detail_participants")} <span style={{ color: "#D32F2F" }}>*</span>
            </span>
            <Box className={css.participantSaveBox}>
              {!(isScheduleExpired() || isLimit()) && (
                <CreateOutlinedIcon
                  onClick={() => {
                    if (isScheduleExpired() || isLimit()) return;
                    if (scheduleDetail?.class?.enable !== false) {
                      setParticipantSaveStatus(false);
                    }
                  }}
                  style={{
                    float: "right",
                    marginLeft: "8px",
                    cursor: scheduleDetail?.class?.enable !== false ? "pointer" : "no-drop",
                  }}
                />
              )}
              <br />
              {menuItemListClassKr("teacher")}
            </Box>
          </Box>
        )}
        {!privilegedMembers("Student") && arrEmpty(participantsIds?.student) && arrEmpty(participantsIds?.teacher) && (
          <Box className={css.fieldBox}>
            <TextField
              className={isScheduleExpired() || isLimit() ? css.fieldset : css.fieldsetDisabled}
              multiline
              label={d("Add Participants").t("schedule_detail_participants")}
              required
              disabled
            />
            {!(isScheduleExpired() || isLimit()) && (
              <AddCircleOutlineOutlined
                onClick={() => {
                  if (isScheduleExpired() || isLimit()) return;
                  if (scheduleDetail?.class?.enable !== false) addParticipants();
                }}
                className={css.iconField}
                style={{ top: "46%", cursor: scheduleDetail?.class?.enable !== false ? "pointer" : "no-drop" }}
              />
            )}
          </Box>
        )}
        {scheduleList.class_type !== "Task" &&
          !((checkedStatus.homeFunCheck || checkedStatus.reviewCheck) && scheduleList.class_type === "Homework") && (
            <Box className={css.fieldBox}>
              <TextField
                className={isScheduleExpired() || isLimit() ? css.fieldset : css.fieldsetDisabled}
                multiline
                value={lessonPlan?.name}
                label={lessonPlan?.name ? "" : d("Lesson Plan").t("library_label_lesson_plan")}
                required
                error={validator.lesson_plan_id && !scheduleList.lesson_plan_id}
                disabled
              />
              {!(isScheduleExpired() || isLimit()) && (
                <AddCircleOutlineOutlined
                  onClick={() => {
                    if (isScheduleExpired() || isLimit()) return;
                    if (scheduleDetail?.class?.enable !== false) handleLessonPlan();
                  }}
                  className={css.iconField}
                  style={{ top: "46%", cursor: scheduleDetail?.class?.enable !== false ? "pointer" : "no-drop" }}
                />
              )}
            </Box>
          )}
        {scheduleList.class_type === "Homework" && checkedStatus.reviewCheck && (
          <span style={{ fontSize: "16px", fontWeight: 400, paddingLeft: "8px", marginTop: "30px", display: "block" }}>
            {d("Review Area").t("schedule_review_review_area")}
          </span>
        )}
        {scheduleList.class_type !== "Task" && (
          <>
            {!((checkedStatus.homeFunCheck || checkedStatus.reviewCheck) && scheduleList.class_type === "Homework") && (
              <span
                style={{ color: "#0E78D5", cursor: "pointer", fontSize: "14px" }}
                onClick={() => {
                  setLinkageLessonPlanOpen(!linkageLessonPlanOpen);
                }}
              >
                {linkageLessonPlanOpen ? (
                  <>
                    {d("See Less").t("assess_detail_see_less")} <ExpandLessOutlined style={{ position: "absolute" }} />
                  </>
                ) : (
                  <>
                    {d("See More").t("schedule_detail_see_more")} <ExpandMoreOutlined style={{ position: "absolute" }} />
                  </>
                )}
              </span>
            )}
            <Collapse
              in={
                linkageLessonPlanOpen ||
                ((checkedStatus.homeFunCheck || checkedStatus.reviewCheck) && scheduleList.class_type === "Homework")
              }
            >
              <Paper elevation={0} className={css.paper}>
                {menuItemListMaterial() &&
                  !((checkedStatus.homeFunCheck || checkedStatus.reviewCheck) && scheduleList.class_type === "Homework") && (
                    <Box style={{ position: "relative" }}>
                      <span className={css.rosterNotice}>
                        {d("Lesson Material").t("schedule_detail_lesson_material")} <span style={{ color: "#D32F2F" }}>*</span>
                      </span>
                      <Box className={css.participantSaveBox} style={{ padding: "0px" }}>
                        {menuItemListMaterial()}
                      </Box>
                    </Box>
                  )}
                <Autocomplete
                  id="combo-box-demo"
                  options={modelSchedule.Deduplication(
                    modelSchedule.LinkageLessonPlan(contentPreview).program.concat(scheduleMockOptions.programList).concat(programItem!)
                  )}
                  getOptionLabel={(option: any) => option.name}
                  onChange={(e: any, newValue) => {
                    autocompleteChange(newValue, "program_id");
                  }}
                  value={programItem}
                  disabled={isScheduleExpired() || isLimit()}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className={css.fieldset}
                      label={d("Program").t("assess_label_program")}
                      variant="outlined"
                      error={validator.program_id && !scheduleList.program_id}
                      value={scheduleList.program_id}
                      required
                    />
                  )}
                />
                <Autocomplete
                  multiple={!checkedStatus.reviewCheck}
                  id="combo-box-demo"
                  options={modelSchedule.Deduplication(scheduleMockOptions.subjectList.concat(subjectItem!))}
                  getOptionLabel={(option: any) => option.name}
                  onChange={(e: any, newValue) => {
                    autocompleteChange(newValue, "subject_id");
                  }}
                  value={checkedStatus.reviewCheck ? subjectItem[0] : subjectItem}
                  disabled={isScheduleExpired() || isLimit() || !scheduleList.program_id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className={css.fieldset}
                      label={d("Subject").t("assess_label_subject")}
                      variant="outlined"
                      value={checkedStatus.reviewCheck ? scheduleList.subject_ids && scheduleList.subject_ids[0] : scheduleList.subject_ids}
                      disabled={isScheduleExpired() || isLimit()}
                    />
                  )}
                />
              </Paper>
            </Collapse>
          </>
        )}
        {checkedStatus.homeFunCheck && !privilegedMembers("Student") && scheduleDetail.role_type !== "Student" && (
          <Box className={css.fieldBox} style={{ position: "relative" }}>
            <Autocomplete
              id="combo-box-demo"
              options={outcomeListInit}
              getOptionLabel={(option: any) => option?.outcome_name}
              multiple
              limitTags={1}
              value={learningOutcomeDefault()}
              disabled
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={clsx(isScheduleExpired() || isLimit() ? css.fieldset : css.fieldsetDisabled, css.addOutcomeBox)}
                  label={d("Add Learning Outcome").t("schedule_add_learning_outcome")}
                />
              )}
            />
            {!(isScheduleExpired() || isLimit()) && (
              <>
                {outComeIds.length > 0 && (
                  <CreateOutlinedIcon
                    onClick={() => {
                      handeLearningOutcome();
                    }}
                    style={{ cursor: "pointer", position: "absolute", top: "22px", right: "1px" }}
                  />
                )}
                {!outComeIds.length && (
                  <AddCircleOutlineOutlined
                    onClick={() => {
                      handeLearningOutcome();
                    }}
                    className={css.iconField}
                    style={{ top: "46%", cursor: "pointer" }}
                  />
                )}
              </>
            )}
          </Box>
        )}
        {!(checkedStatus.reviewCheck && scheduleList.class_type === "Homework") && (
          <>
            <TextField
              id="outlined-multiline-static"
              className={css.fieldset}
              label={d("Description").t("assess_label_description")}
              multiline
              rows={4}
              variant="outlined"
              value={scheduleList.description}
              disabled={isScheduleExpired() || isLimit()}
              onChange={(e) => handleTopicListChange(e, "description")}
            />
            <ScheduleAttachment
              setAttachmentId={setAttachmentId}
              attachmentId={attachmentId}
              attachmentName={attachmentName}
              setAttachmentName={setAttachmentName}
              setSpecificStatus={setSpecificStatus}
              specificStatus={specificStatus}
              isStudent={privilegedMembers("Student")}
              isDisabled={isScheduleExpired() || isLimit()}
              checkFileExist={checkFileExist}
            />
          </>
        )}
        {scheduleId && scheduleDetail.role_type === "Student" && scheduleDetail.class_type === "Homework" && checkedStatus.homeFunCheck && (
          <ScheduleFeedback
            schedule_id={scheduleId}
            changeModalDate={changeModalDate}
            className={scheduleDetail.class}
            due_date={scheduleDetail.due_at}
            teacher={(scheduleDetail?.class_roster_teachers ?? []).concat(scheduleDetail?.participants_teachers ?? [])}
            includeTable={includeTable}
            due_time={timestampToTime(scheduleDetail.due_at, "feedback") as string}
            is_hidden={isHidden}
            checkFileExist={checkFileExist}
          />
        )}
        {!isScheduleExpired() &&
          (perm.create_event_520 || perm.create_my_schedule_events_521 || perm.create_my_schools_schedule_events_522) && (
            <Box
              className={css.fieldset}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button variant="contained" color="primary" style={{ width: "80%" }} disabled={isLimit()} onClick={saveTheTest}>
                {d("Click to Schedule").t("schedule_button_click_to schedule")}
              </Button>
            </Box>
          )}
        {scheduleList.class_type !== "Task" && !checkedStatus.homeFunCheck && (
          <Box
            className={css.fieldset}
            style={{
              display: scheduleId ? "flex" : "none",
              justifyContent: "space-around",
            }}
          >
            <ScheduleButton
              scheduleInfo={{
                class_id: scheduleList.class_id as string,
                lesson_plan_id: scheduleList.lesson_plan_id as string,
                ...scheduleDetail,
              }}
              templateType="scheduleEdit"
              handleGoLive={handleGoLive}
            />
          </Box>
        )}
        {checkedStatus.repeatCheck && !mobile && (
          <Box className={css.repeatBox}>
            <RepeatSchedule handleRepeatData={handleRepeatData} repeatState={state} />
          </Box>
        )}
      </Box>
      <AddParticipantsTemplateMb
        key={addParticipantShowIndex}
        open={participantActive}
        onClose={closeAddParticipant}
        handleChangeParticipants={handleChangeParticipants}
        participantsIds={participantsIds as ParticipantsShortInfo}
        getParticipantsData={getParticipantsData}
        participantList={participantMockOptions.participantList}
        setSearchName={setSearchName}
        searchName={name}
      />
      {showRepeatMb && mobile && (
        <div className={css.repeatBoxMb}>
          <Box style={{ paddingBottom: "10px", paddingTop: "10px", backgroundColor: "white" }}>
            <div style={{ textAlign: "end", paddingRight: "10px" }}>
              <CloseIcon
                onClick={() => {
                  setStatus({ ...checkedStatus, repeatCheck: false });
                  showRepeatMbHandle(false);
                }}
              />
            </div>
            <div style={{ maxHeight: window.innerHeight - 200 + "px", overflow: "auto" }}>
              <RepeatSchedule handleRepeatData={handleRepeatData} repeatState={state} />
            </div>
            <div style={{ textAlign: "center" }}>
              <Button
                className={css.saveMb}
                color="primary"
                variant="contained"
                onClick={() => {
                  showRepeatMbHandle(false);
                }}
              >
                {d("OK").t("general_button_OK")}
              </Button>
            </div>
          </Box>
        </div>
      )}
    </ThemeProvider>
  );
}

interface CalendarStateProps {
  timesTamp: timestampType;
  changeTimesTamp: (value: timestampType) => void;
  repeatData: object;
  modelView: modeViewType;
  scheduleId?: string;
  includeTable?: boolean;
  handleChangeProgramId: (value: string) => void;
  toLive: () => void;
  changeModalDate: (data: object) => void;
  mockOptions?: MockOptionsOptionsItem[];
  scheduleMockOptions: getScheduleMockOptionsResponse;
  participantMockOptions: getScheduleParticipantsMockOptionsResponse;
  getParticipantOptions: (class_id: string) => void;
  specificStatus?: boolean;
  setSpecificStatus?: (value: boolean) => void;
  participantsIds?: ParticipantsShortInfo;
  classRosterIds?: ParticipantsShortInfo;
  handleChangeParticipants: (type: string, data: ParticipantsShortInfo) => void;
  ParticipantsData?: ParticipantsData;
  getParticipantsData?: (metaLoading: boolean, search: string, hash: string, roleName: ParticipantString["key"]) => void;
  LinkageLessonPlan: (content_id: string) => void;
  contentPreview: EntityContentInfoWithDetails;
  handleChangeHidden: (is_hidden: boolean) => void;
  isHidden: boolean;
  scheduleDetail: EntityScheduleDetailsView;
  privilegedMembers: (member: memberType) => boolean;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id?: string, user_id?: string) => void;
  stateOnlyMine: string[];
  handleChangeOnlyMine: (data: string[]) => void;
  isShowAnyTime: boolean;
  stateCurrentCid: string;
  stateMaterialArr: (EntityContentInfoWithDetails | undefined)[];
  filterOption: filterOptionItem;
  viewSubjectPermission?: boolean;
  schoolsConnection: GetSchoolsFilterListQuery;
  getSchoolsConnection: (cursor: string, value: string, loading: boolean) => any;
  getClassesConnection: (
    cursor: string,
    school_id: string,
    loading: boolean,
    direction: ConnectionDirection.Forward | ConnectionDirection.Backward
  ) => void;
  getUserOfUndefined: (cursor: string, loading: boolean, direction: ConnectionDirection.Forward | ConnectionDirection.Backward) => void;
  userInUndefined: GetUserQuery;
  classesConnection: GetClassFilterListQuery;
  lessonPlans: EntityLessonPlanForSchedule[];
  filterOtherClasses: GetClassFilterListQuery;
  getClassesWithoutSchool: (cursor: string, value: string, loading: boolean) => any;
  mobile?: boolean;
  checkFileExist: (source_id?: string) => Promise<boolean | undefined>;
}

interface ScheduleEditProps extends CalendarStateProps {
  includePreview: boolean;
}

export default function ScheduleEdit(props: ScheduleEditProps) {
  const {
    includePreview,
    timesTamp,
    changeTimesTamp,
    repeatData,
    modelView,
    scheduleId,
    includeTable,
    handleChangeProgramId,
    toLive,
    changeModalDate,
    mockOptions,
    scheduleMockOptions,
    participantMockOptions,
    getParticipantOptions,
    setSpecificStatus,
    specificStatus,
    participantsIds,
    classRosterIds,
    handleChangeParticipants,
    getParticipantsData,
    ParticipantsData,
    LinkageLessonPlan,
    contentPreview,
    handleChangeHidden,
    isHidden,
    scheduleDetail,
    privilegedMembers,
    handleChangeShowAnyTime,
    stateOnlyMine,
    handleChangeOnlyMine,
    isShowAnyTime,
    stateCurrentCid,
    stateMaterialArr,
    filterOption,
    viewSubjectPermission,
    schoolsConnection,
    getSchoolsConnection,
    getClassesConnection,
    classesConnection,
    lessonPlans,
    getUserOfUndefined,
    userInUndefined,
    filterOtherClasses,
    getClassesWithoutSchool,
    mobile,
    checkFileExist,
  } = props;

  return (
    <>
      <Box
        style={{
          display: includePreview ? "block" : "none",
        }}
      >
        <SmallCalendar
          getClassesWithoutSchool={getClassesWithoutSchool}
          filterOtherClasses={filterOtherClasses}
          changeTimesTamp={changeTimesTamp}
          timesTamp={timesTamp}
          repeatData={repeatData}
          modelView={modelView}
          handleChangeProgramId={handleChangeProgramId}
          toLive={toLive}
          changeModalDate={changeModalDate}
          mockOptions={mockOptions}
          scheduleMockOptions={scheduleMockOptions}
          participantMockOptions={participantMockOptions}
          getParticipantOptions={getParticipantOptions}
          handleChangeParticipants={handleChangeParticipants}
          LinkageLessonPlan={LinkageLessonPlan}
          contentPreview={contentPreview}
          handleChangeHidden={handleChangeHidden}
          isHidden={isHidden}
          scheduleDetail={scheduleDetail}
          privilegedMembers={privilegedMembers}
          handleChangeShowAnyTime={handleChangeShowAnyTime}
          stateOnlyMine={stateOnlyMine}
          handleChangeOnlyMine={handleChangeOnlyMine}
          isShowAnyTime={isShowAnyTime}
          stateCurrentCid={stateCurrentCid}
          stateMaterialArr={stateMaterialArr}
          filterOption={filterOption}
          viewSubjectPermission={viewSubjectPermission}
          schoolsConnection={schoolsConnection}
          getSchoolsConnection={getSchoolsConnection}
          getClassesConnection={getClassesConnection}
          classesConnection={classesConnection}
          lessonPlans={lessonPlans}
          userInUndefined={userInUndefined}
          getUserOfUndefined={getUserOfUndefined}
          mobile={mobile}
          checkFileExist={checkFileExist}
        />
      </Box>
      <Box
        style={{
          display: includePreview ? "none" : "block",
        }}
      >
        <EditBox
          getClassesWithoutSchool={getClassesWithoutSchool}
          filterOtherClasses={filterOtherClasses}
          userInUndefined={userInUndefined}
          getUserOfUndefined={getUserOfUndefined}
          changeTimesTamp={changeTimesTamp}
          timesTamp={timesTamp}
          repeatData={repeatData}
          modelView={modelView}
          scheduleId={scheduleId}
          includeTable={includeTable}
          handleChangeProgramId={handleChangeProgramId}
          toLive={toLive}
          changeModalDate={changeModalDate}
          scheduleMockOptions={scheduleMockOptions}
          participantMockOptions={participantMockOptions}
          getParticipantOptions={getParticipantOptions}
          setSpecificStatus={setSpecificStatus}
          specificStatus={specificStatus}
          participantsIds={participantsIds}
          classRosterIds={classRosterIds}
          handleChangeParticipants={handleChangeParticipants}
          getParticipantsData={getParticipantsData}
          ParticipantsData={ParticipantsData}
          LinkageLessonPlan={LinkageLessonPlan}
          contentPreview={contentPreview}
          handleChangeHidden={handleChangeHidden}
          isHidden={isHidden}
          scheduleDetail={scheduleDetail}
          privilegedMembers={privilegedMembers}
          handleChangeShowAnyTime={handleChangeShowAnyTime}
          stateOnlyMine={stateOnlyMine}
          handleChangeOnlyMine={handleChangeOnlyMine}
          isShowAnyTime={isShowAnyTime}
          stateCurrentCid={stateCurrentCid}
          stateMaterialArr={stateMaterialArr}
          filterOption={filterOption}
          viewSubjectPermission={viewSubjectPermission}
          schoolsConnection={schoolsConnection}
          getSchoolsConnection={getSchoolsConnection}
          getClassesConnection={getClassesConnection}
          classesConnection={classesConnection}
          lessonPlans={lessonPlans}
          mobile={mobile}
          checkFileExist={checkFileExist}
        />
      </Box>
    </>
  );
}
