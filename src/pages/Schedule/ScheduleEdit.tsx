import DateFnsUtils from "@date-io/date-fns";
import { Box, Button, MenuItem, TextField, ThemeProvider } from "@material-ui/core";
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
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Maybe, User } from "../../api/api-ko-schema.auto";
import { ParticipantsByClassQuery } from "../../api/api-ko.auto";
import {
  EntityContentInfoWithDetails,
  EntityScheduleAddView,
  EntityScheduleDetailsView,
  EntityScheduleShortInfo,
} from "../../api/api.auto";
import { MockOptionsItem, MockOptionsOptionsItem } from "../../api/extra";
import { PermissionType, usePermission } from "../../components/Permission";
import { initialState, useRepeatSchedule } from "../../hooks/useRepeatSchedule";
import { d, t, localeManager } from "../../locale/LocaleManager";
import { modelSchedule } from "../../models/ModelSchedule";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned } from "../../reducers/content";
import { actError, actSuccess } from "../../reducers/notify";
import {
  changeParticipants,
  getScheduleLiveToken,
  getScheduleMockOptionsResponse,
  getScheduleParticipant,
  getScheduleParticipantsMockOptionsResponse,
  getScheduleTimeViewData,
  initScheduleDetial,
  removeSchedule,
  resetParticipantList,
  resetScheduleDetial,
  saveScheduleData,
  scheduleShowOption,
} from "../../reducers/schedule";
import theme from "../../theme";
import {
  ClassOptionsItem,
  EntityLessonPlanShortInfo,
  EntityScheduleClassInfo,
  FilterQueryTypeProps,
  memberType,
  modeViewType,
  ParticipantsData,
  ParticipantsShortInfo,
  repeatOptionsType,
  timestampType,
} from "../../types/scheduleTypes";
import ContentPreview from "../ContentPreview";
import AddParticipantsTemplate from "./AddParticipantsTemplate";
import ConfilctTestTemplate from "./ConfilctTestTemplate";
import RepeatSchedule from "./Repeat";
import ScheduleAttachment from "./ScheduleAttachment";
import ScheduleFeedback from "./ScheduleFeedback";
import ScheduleFilter from "./ScheduleFilter";
import TimeConflictsTemplate from "./TimeConflictsTemplate";
import { zhCN, enAU, vi, ko, id } from "date-fns/esm/locale";

const useStyles = makeStyles(({ shadows }) => ({
  fieldset: {
    marginTop: 20,
    width: "100%",
  },
  halfFieldset: {
    marginTop: 20,
    width: "calc(50% - 10px)",
    "&:not(:first-child)": {
      marginLeft: 20,
    },
  },
  formControset: {
    padding: "10px 10px 20px 10px",
    boxShadow: shadows[3],
    position: "relative",
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
    width: "310px",
    margin: "0 auto",
  },
  participantBox: {
    width: "100%",
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
}));

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

  const lang = { en: enAU, zh: zhCN, vi: vi, ko: ko, id: id };

  return (
    <Box className={css.smallCalendarBox}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={lang[localeManager.getLocale()!]}>
        <Grid container justify="space-around">
          <DatePicker autoOk variant="static" openTo="date" value={new Date(timesTamp.start * 1000)} onChange={handleDateChange} />
        </Grid>
        <ScheduleFilter
          handleChangeLoadScheduleView={handleChangeLoadScheduleView}
          mockOptions={mockOptions}
          scheduleMockOptions={scheduleMockOptions}
          handleChangeShowAnyTime={handleChangeShowAnyTime}
          stateOnlyMine={stateOnlyMine}
          handleChangeOnlyMine={handleChangeOnlyMine}
          modelView={modelView}
          timesTamp={timesTamp}
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
    ParticipantsData,
    handleChangeParticipants,
    getParticipantsData,
    LinkageLessonPlan,
    contentPreview,
    isHidden,
    handleChangeHidden,
    scheduleDetial,
    privilegedMembers,
    mediaList,
    handleChangeShowAnyTime,
    isShowAnyTime,
  } = props;
  const { contentsAuthList, classOptions, mySchoolId } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const { contentsList } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const [selectedDueDate, setSelectedDate] = React.useState<Date | null>(new Date(new Date().setHours(new Date().getHours())));
  const [classItem, setClassItem] = React.useState<EntityScheduleShortInfo | undefined>(defaults);
  const [lessonPlan, setLessonPlan] = React.useState<EntityLessonPlanShortInfo | undefined>(lessonPlanDefaults);
  const [subjectItem, setSubjectItem] = React.useState<EntityScheduleShortInfo | undefined>(defaults);
  const [programItem, setProgramItem] = React.useState<EntityScheduleShortInfo | undefined>(defaults);
  const [attachmentId, setAttachmentId] = React.useState<string>("");
  const [attachmentName, setAttachmentName] = React.useState<string>("");
  const [isRepeatSame, setIsRepeatSame] = React.useState(true);
  const [scheduleRestNum, setScheduleRestNum] = React.useState(0);
  const permissionShowPreview = usePermission(PermissionType.attend_live_class_as_a_teacher_186);
  const perm = usePermission([
    PermissionType.create_event_520,
    PermissionType.create_my_schedule_events_521,
    PermissionType.create_my_schools_schedule_events_522,
    PermissionType.attend_live_class_as_a_student_187,
  ]);
  const [rosterChecked, setRosterChecked] = React.useState("other");

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
    setRosterChecked(event.target.value);
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
    setRosterChecked("other");
    setIsForce(false);
  };

  const rosterIsExist = (item: Maybe<{ __typename?: "User" | undefined } & Pick<User, "user_id" | "user_name">>) => {
    const rosterItem = [{ id: item?.user_id, name: item?.user_name }];
    return classRosterIds?.teacher
      .concat(classRosterIds?.student)
      .some((item) => JSON.stringify({ id: item.id, name: item.name }) === JSON.stringify(rosterItem[0])) as boolean;
  };

  React.useEffect(() => {
    if (scheduleId) {
      setAttachmentName(scheduleDetial?.attachment?.name as string);
      setAttachmentId(scheduleDetial?.attachment?.id as string);
    } else {
      setAttachmentName("");
      setAttachmentId("");
    }
  }, [scheduleDetial, scheduleDetial.attachment, scheduleId]);

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
      ...timesTampDada,
    };
    setClassItem(defaults);
    setLessonPlan(defaults);
    setSubjectItem(defaults);
    setProgramItem(defaults);
    setScheduleList(newData);
    setInitScheduleList(newData);
    dispatch(resetScheduleDetial(initScheduleDetial));
    dispatch(resetParticipantList());
    dispatch(changeParticipants({ type: "classRoster", data: { student: [], teacher: [] } }));
    dispatch(changeParticipants({ type: "addParticipants", data: { student: [], teacher: [] } }));
    setRosterSaveStatus(false);
    setParticipantSaveStatus(false);
  }, [dispatch, timesTamp, scheduleRestNum]);

  React.useEffect(() => {
    if (scheduleId && scheduleDetial.id) {
      const newData: EntityScheduleAddView = {
        attachment: scheduleDetial.attachment,
        class_id: scheduleDetial.class?.id || "",
        class_type: scheduleDetial.class_type,
        description: scheduleDetial.description,
        due_at: scheduleDetial.due_at,
        end_at: scheduleDetial.end_at || (scheduleDetial.due_at as number),
        is_all_day: scheduleDetial.is_all_day,
        is_force: true,
        is_repeat: true,
        lesson_plan_id: scheduleDetial.lesson_plan?.id || "",
        program_id: scheduleDetial.program?.id || "",
        repeat: {},
        start_at: scheduleDetial.start_at || (scheduleDetial.due_at as number),
        subject_id: scheduleDetial.subject?.id || "",
        title: scheduleDetial.title || "",
        is_home_fun: scheduleDetial.is_home_fun,
      };
      setStatus({
        allDayCheck: newData.is_all_day ? true : false,
        repeatCheck: false,
        dueDateCheck: newData.due_at ? true : false,
        homeFunCheck: newData.is_home_fun ? true : false,
      });
      if (scheduleDetial.class) setClassItem(scheduleDetial.class);
      setLessonPlan(scheduleDetial.lesson_plan);
      setSubjectItem(scheduleDetial.subject);
      setProgramItem(scheduleDetial.program);
      setScheduleList(newData);
      setInitScheduleList(newData);

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
            student: getClassOptionsItem(scheduleDetial.class_roster_students as ClassOptionsItem[]),
            teacher: getClassOptionsItem(scheduleDetial.class_roster_teachers as ClassOptionsItem[]),
          },
        })
      );

      dispatch(
        changeParticipants({
          type: "addParticipants",
          data: {
            student: getClassOptionsItem(scheduleDetial.participants_students as ClassOptionsItem[]),
            teacher: getClassOptionsItem(scheduleDetial.participants_teachers as ClassOptionsItem[]),
          },
        })
      );

      if ((scheduleDetial.due_at as number) > 0) {
        setSelectedDate(new Date((scheduleDetial.due_at as number) * 1000));
      }
      // getParticipantOptions("");
      const currentTime = Math.floor(new Date().getTime());
      if (
        (scheduleDetial.status === "NotStart" || scheduleDetial.status === "Started") &&
        newData.start_at! * 1000 - currentTime < 15 * 60 * 1000
      ) {
        dispatch(getScheduleLiveToken({ schedule_id: scheduleDetial.id, live_token_type: "live", metaLoading: true }));
      }
      if (scheduleDetial.class) dispatch(getScheduleParticipant({ class_id: newData.class_id as string }));

      if (scheduleDetial.class_roster_students || scheduleDetial.class_roster_teachers) setRosterSaveStatus(true);

      if (scheduleDetial.participants_students || scheduleDetial.participants_teachers) setParticipantSaveStatus(true);
      setLinkageLessonPlanOpen(false);
    }
  }, [dispatch, scheduleDetial, scheduleId]);
  const [state, dispatchRepeat] = useRepeatSchedule();
  const { type } = state;
  const repeatData = {
    type,
    [type]: state[type],
  };
  React.useEffect(() => {
    if (scheduleId && scheduleDetial.repeat) {
      // @ts-ignore
      const isSame = JSON.stringify(state[type]) === JSON.stringify(scheduleDetial.repeat[type]);
      setIsRepeatSame(isSame);
    }
  }, [scheduleDetial.repeat, scheduleId, state, type]);
  React.useEffect(() => {
    if (scheduleDetial?.repeat?.type) {
      const data = scheduleDetial.repeat;
      dispatchRepeat({
        type: "changeData",
        data,
      });
    }
  }, [dispatchRepeat, scheduleDetial]);
  React.useEffect(() => {
    const program = modelSchedule.LinkageLessonPlan(contentPreview).program[0] as EntityScheduleShortInfo;
    const subject = modelSchedule.LinkageLessonPlan(contentPreview).subject[0] as EntityScheduleShortInfo;
    setProgramItem(program);
    setSubjectItem(subject);
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
    subject_id: "",
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
    const date = new Date(Number(timestamp) * 1000);

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
    let ids: string[] = [];
    ids = value ? value["id"] : "";
    if (name === "class_id") {
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
      if (resultInfo.payload.participantList.class.students.length || resultInfo.payload.participantList.class.teachers.length) {
        setRosterChecked("all");
      } else {
        setRosterChecked("other");
      }
      setRosterSaveStatus(false);
      setClassItem(value);
    }

    if (name === "subject_id") {
      setSubjectItem(value);
    }

    if (name === "program_id") {
      const LinkageProgramData: any = await handleChangeProgramId(value.id);
      setSubjectItem(LinkageProgramData[0] ?? defaults);
      setProgramItem(value);
      scheduleList.subject_id = LinkageProgramData[0] ? LinkageProgramData[0].id : "";
    }

    if (name === "lesson_plan_id") {
      const LinkageLessonData: any = await LinkageLessonPlan(value["id"]);
      setScheduleList({ ...scheduleList, ...LinkageLessonData, lesson_plan_id: ids });
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
    setScheduleData(name, value);
  };

  const setScheduleData = (name: string, value: string | number | object | null) => {
    const newTopocList = { ...scheduleList, [name]: value as string | number | object | null };
    setScheduleList((newTopocList as unknown) as { [key in keyof EntityScheduleAddView]: EntityScheduleAddView[key] });
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
  const [validator, setValidator] = React.useState(isValidator);

  const validatorFun = () => {
    let verificaPath = true;

    const taskValidator = {
      title: false,
      start_at: false,
      end_at: false,
      class_type: false,
    };

    const validator = scheduleList.class_type === "Task" || checkedStatus.homeFunCheck ? taskValidator : isValidator;

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
    if (scheduleList.class_type === "Task") {
      isValidator.lesson_plan_id = isValidator.program_id = false;
    }
    if (scheduleList.class_type === "Homework") {
      isValidator.start_at = isValidator.end_at = false;
    }
    if (checkedStatus.homeFunCheck) {
      isValidator.lesson_plan_id = false;
    }
    setValidator({ ...isValidator });
    return verificaPath;
  };
  /**
   * save schedule data
   */
  const saveSchedule = async (
    repeat_edit_options: repeatOptionsType = "only_current",
    is_force: boolean = true,
    is_new_schedule: boolean = false
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
    addData["attachment"] = {
      id: attachmentId,
      name: attachmentName,
    };

    if (scheduleId) {
      addData["repeat_edit_options"] = repeat_edit_options;
    }

    addData["time_zone_offset"] = -new Date().getTimezoneOffset() * 60;

    addData["is_force"] = isForce ?? is_force;

    if (scheduleList.class_type === "Homework") {
      addData["is_home_fun"] = checkedStatus.homeFunCheck;
    } else {
      addData["is_home_fun"] = false;
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
      dispatch(actError(d("Please confirm the fileld of ‘Add Participants’ by clicking OK").t("schedule_msg_participants_no_ok")));
      return;
    }
    addData["participants_student_ids"] = participantsIds?.student.map((item: ClassOptionsItem) => {
      return item.id;
    });
    addData["participants_teacher_ids"] = participantsIds?.teacher.map((item: ClassOptionsItem) => {
      return item.id;
    });
    addData["class_roster_student_ids"] = classRosterIds?.student.map((item: ClassOptionsItem) => {
      return item.id;
    });
    addData["class_roster_teacher_ids"] = classRosterIds?.teacher.map((item: ClassOptionsItem) => {
      return item.id;
    });

    let resultInfo: any;
    resultInfo = ((await dispatch(
      saveScheduleData({ payload: { ...scheduleList, ...addData }, is_new_schedule: is_new_schedule, metaLoading: true })
    )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof saveScheduleData>>;

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
      dispatch(
        getScheduleTimeViewData({
          view_type: modelView,
          time_at: timesTamp.start,
          time_zone_offset: -new Date().getTimezoneOffset() * 60,
        })
      );
      dispatch(actSuccess(d("Save Successfully.").t("assess_msg_save_successfully")));
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
      if (isShowAnyTime) await handleChangeShowAnyTime(true, scheduleDetial.class?.name as string, scheduleDetial.class?.id as string);
      history.push(`/schedule/calendar/rightside/${includeTable ? "scheduleTable" : "scheduleList"}/model/preview`);
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
    return scheduleId ? scheduleDetial.status !== "NotStart" || privilegedMembers("Student") : false;
  };

  const isLimit = (): boolean => {
    const is_expire = scheduleDetial.due_at && Date.now() > (scheduleDetial.due_at as number) * 1000;
    return scheduleId && checkedStatus.homeFunCheck && scheduleDetial.class_type === "Homework" ? is_expire || isHidden : false;
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
      lists = classOptions.classListTeacher.user?.classesTeaching as EntityScheduleClassInfo[];
    }
    const classResult: EntityScheduleShortInfo[] = [];
    lists?.forEach((item: EntityScheduleClassInfo) => {
      if (item.status === "active") classResult.push({ id: item.class_id, name: item.class_name });
    });
    return classResult;
  };

  const saveTheTest = () => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (scheduleDetial.exist_feedback) {
      feedBackNoticeEdit();
      return;
    }
    if (
      scheduleId &&
      scheduleDetial &&
      scheduleList.start_at &&
      scheduleList.start_at - currentTime < 15 * 60 &&
      scheduleList.class_type !== "Task" &&
      scheduleList.class_type !== "Homework"
    ) {
      changeModalDate({
        title: "",
        // text: reportMiss("You can not edit a class 15 minutes before the start time.", "schedule_msg_edit_minutes"),
        text: d("You can only edit a class at least 15 minutes before the start time.").t("schedule_msg_edit_minutes"),
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

    if (scheduleId && scheduleDetial.is_repeat && checkedStatus.repeatCheck) {
      if (isRepeatSame) {
        changeModalDate({
          openStatus: true,
          enableCustomization: true,
          customizeTemplate: (
            <ConfilctTestTemplate
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

  const addParticipants = () => {
    if (perm.create_my_schedule_events_521 && !perm.create_event_520 && !perm.create_my_schools_schedule_events_522) return;
    const isFillter = !menuItemListClassKr("roster").length && rosterSaveStatus;
    const isVested = (item: any): boolean => item.some((list: any) => (perm.create_event_520 ? true : list.school_id === mySchoolId));

    // will class roster data remove in ParticipantsData
    const participantsFilterData = {
      classes: {
        students: isFillter
          ? ParticipantsData?.classes.students
          : ParticipantsData?.classes.students.filter(
              (a: any) =>
                !participantMockOptions?.participantList?.class?.students?.some(
                  (b: any) => b.user_id === a.user_id || !isVested(a.school_memberships)
                )
            ),
        teachers: isFillter
          ? ParticipantsData?.classes.teachers
          : ParticipantsData?.classes.teachers.filter(
              (a: any) =>
                !participantMockOptions?.participantList?.class?.teachers?.some(
                  (b: any) => b.user_id === a.user_id || !isVested(a.school_memberships)
                )
            ),
      },
    } as ParticipantsData;
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
          ParticipantsData={participantsFilterData}
          handleChangeParticipants={handleChangeParticipants}
          getParticipantsData={getParticipantsData}
          participantsIds={participantsIds as ParticipantsShortInfo}
        />
      ),
    });
    setParticipantSaveStatus(false);
  };

  const [checkedStatus, setStatus] = React.useState({
    allDayCheck: false,
    repeatCheck: false,
    dueDateCheck: false,
    homeFunCheck: false,
  });

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "allDayCheck" && event.target.checked) {
      const newTopocList = {
        ...scheduleList,
        start_at: timestampToTime(scheduleList.start_at, "all_day_start"),
        end_at: timestampToTime(scheduleList.end_at, "all_day_end"),
      };
      setScheduleList((newTopocList as unknown) as { [key in keyof EntityScheduleAddView]: EntityScheduleAddView[key] });
    }

    setStatus({ ...checkedStatus, [event.target.name]: event.target.checked });
  };

  const handleDueDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const deleteScheduleByid = async (repeat_edit_options: repeatOptionsType = "only_current") => {
    const res: any = await dispatch(
      removeSchedule({
        schedule_id: scheduleDetial.id as string,
        repeat_edit_options: {
          repeat_edit_options: repeat_edit_options,
        },
      })
    );
    if (res.payload === "OK") {
      dispatch(actSuccess(d("Delete sucessfully").t("schedule_msg_delete_success")));
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
      if (isShowAnyTime) await handleChangeShowAnyTime(true, scheduleDetial.class?.name as string, scheduleDetial.class?.id as string);
      history.push("/schedule/calendar/rightside/scheduleTable/model/preview");
      return;
    }
    changeModalDate({
      openStatus: false,
    });
  };

  const handleHide = async () => {
    await dispatch(
      scheduleShowOption({ schedule_id: scheduleId as string, show_option: { show_option: isHidden ? "visible" : "hidden" } })
    );
    handleChangeHidden(!isHidden);
    dispatch(
      getScheduleTimeViewData({
        view_type: modelView,
        time_at: timesTamp.start,
        time_zone_offset: -new Date().getTimezoneOffset() * 60,
      })
    );
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
    if (scheduleDetial.exist_feedback) {
      feedBackNoticeDelete();
      return;
    }
    if (scheduleDetial.class_type === "Homework" || scheduleDetial.class_type === "Task") {
      if (scheduleDetial.due_at && scheduleDetial.due_at !== 0 && scheduleDetial.due_at < currentTime) {
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
      if (scheduleId && scheduleDetial && scheduleList.start_at && scheduleList.start_at - currentTime < 15 * 60) {
        changeModalDate({
          title: "",
          // text: reportMiss("You can not edit a class 15 minutes before the start time.", "schedule_msg_edit_minutes"),
          text: d("You can only edit a class at least 15 minutes before the start time.").t("schedule_msg_edit_minutes"),
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
    if (scheduleDetial.is_repeat) {
      changeModalDate({
        openStatus: true,
        enableCustomization: true,
        customizeTemplate: (
          <ConfilctTestTemplate
            handleDelete={deleteScheduleByid}
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
              deleteScheduleByid();
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
      text: d("Discard unsave changes?").t("schedule_msg_discard"),
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

  type classTypeLabel =
    | "schedule_detail_online_class"
    | "schedule_detail_offline_class"
    | "schedule_detail_homework"
    | "schedule_detail_task";

  const menuItemListClassType = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {t(item.name as classTypeLabel)}
      </MenuItem>
    ));

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

  const menuItemListClassKrParticipants = (type: string) => {
    const participant: ParticipantsByClassQuery = participantMockOptions.participantList;
    const participantSet = type === "teacher" ? participant?.class?.teachers : participant?.class?.students;
    return participantSet
      ? participantSet?.map((item) => (
          <Tooltip title={item?.user_name as string} placement="right-start">
            <FormControlLabel
              className={css.participantText}
              control={
                <Checkbox
                  checked={rosterIsExist(item)}
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

  const handleGoLive = (scheduleDetial: EntityScheduleDetailsView) => {
    const currentTime = Math.floor(new Date().getTime() / 1000);

    if (permissionShowPreview && scheduleList.class_type === "Homework") {
      toLive();
      return;
    }

    if (scheduleDetial && scheduleDetial.start_at && scheduleDetial.start_at - currentTime > 15 * 60) {
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

  const options = (): EntityLessonPlanShortInfo[] => {
    const newContentsData: EntityLessonPlanShortInfo[] = [];
    contentsList.forEach((item: EntityLessonPlanShortInfo) => {
      newContentsData.push({
        title: "Organization Content",
        id: item.id,
        name: item.name,
      });
    });
    contentsAuthList.forEach((item: EntityLessonPlanShortInfo) => {
      newContentsData.push({
        title: "Badanamu Content",
        id: item.id,
        name: item.name,
      });
    });
    mediaList.forEach((item: EntityContentInfoWithDetails) => {
      newContentsData.push({
        title: "More Featured Content",
        id: item.id,
        name: item.name,
      });
    });
    return newContentsData;
  };

  const arrEmpty = (item: ClassOptionsItem[] | undefined): boolean => {
    return JSON.stringify(item) === "[]";
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={css.formControset}>
        <Box>
          <Grid container justify="space-between" alignItems="center">
            <Grid item xs={6}>
              <Close
                style={{
                  color: "#666666",
                }}
                className={css.toolset}
                onClick={closeEdit}
              />
            </Grid>
            {!isScheduleExpired() && (
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
                {scheduleDetial.exist_feedback && isHidden && (
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
          error={validator.class_type}
          select
          required
          disabled={isScheduleExpired() || scheduleDetial.exist_feedback}
        >
          {menuItemListClassType(scheduleMockOptions.classTypeList)}
        </TextField>
        {scheduleList.class_type === "Homework" && (
          <Box>
            <FormGroup row>
              <FormControlLabel
                disabled={isScheduleExpired() || isLimit()}
                control={<Checkbox name="homeFunCheck" color="primary" checked={checkedStatus.homeFunCheck} onChange={handleCheck} />}
                label={d("Home Fun").t("schedule_checkbox_home_fun")}
              />
            </FormGroup>
          </Box>
        )}
        <Box className={css.fieldBox}>
          <TextField
            error={validator.title}
            className={css.fieldset}
            multiline
            rows={6}
            label={d("Lesson Name").t("schedule_detail_lesson_name")}
            value={scheduleList.title}
            onChange={(e) => handleTopicListChange(e, "title")}
            required
            disabled={isScheduleExpired() || isLimit()}
          ></TextField>
          <FileCopyOutlined className={css.iconField} />
        </Box>
        {scheduleList.class_type !== "Homework" && (
          <Box>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-between" alignItems="center">
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
                    error={validator.start_at}
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
                    error={validator.end_at}
                    value={timestampToTime(scheduleList.end_at)}
                    disabled={isScheduleExpired() || checkedStatus.allDayCheck || isLimit()}
                    onChange={(e) => handleTopicListChange(e, "end_at")}
                  />
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
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
              <FormControlLabel
                disabled={isScheduleExpired() || isLimit()}
                control={<Checkbox name="repeatCheck" color="primary" checked={checkedStatus.repeatCheck} onChange={handleCheck} />}
                label={d("Repeat").t("schedule_detail_repeat")}
              />
            </FormGroup>
          </Box>
        )}
        <Box
          style={{
            display: scheduleList?.class_type === "Task" || scheduleList?.class_type === "Homework" ? "block" : "none",
          }}
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-between" alignItems="center">
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
          disabled={isScheduleExpired() || scheduleDetial?.class?.enable === false || isLimit()}
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
                      <Radio name="checkedA" value="all" color="primary" checked={rosterChecked === "all"} onChange={handleRosterChange} />
                    }
                    label={d("Select All").t("schedule_detail_select_all")}
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        name="checkedB"
                        value="empty"
                        color="primary"
                        checked={rosterChecked === "empty"}
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
                  <div className={css.splitLine}></div>
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
              <CreateOutlinedIcon
                onClick={() => {
                  if (scheduleDetial?.class?.enable !== false) {
                    setRosterSaveStatus(false);
                    setIsForce(false);
                  }
                }}
                style={{ float: "right", marginLeft: "8px", cursor: scheduleDetial?.class?.enable !== false ? "pointer" : "no-drop" }}
              />
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
                  <div className={css.splitLine}></div>
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
              <CreateOutlinedIcon
                onClick={() => {
                  setParticipantSaveStatus(false);
                }}
                style={{ float: "right", marginLeft: "8px", cursor: scheduleDetial?.class?.enable !== false ? "pointer" : "no-drop" }}
              />
              <br />
              {menuItemListClassKr("teacher")}
            </Box>
          </Box>
        )}
        {!privilegedMembers("Student") && arrEmpty(participantsIds?.student) && arrEmpty(participantsIds?.teacher) && (
          <Box className={css.fieldBox}>
            <TextField
              className={css.fieldset}
              multiline
              label={d("Add Participants").t("schedule_detail_participants")}
              onChange={(e) => handleTopicListChange(e, "title")}
              required
              disabled
            ></TextField>
            <AddCircleOutlineOutlined
              onClick={() => {
                if (scheduleDetial?.class?.enable !== false) addParticipants();
              }}
              className={css.iconField}
              style={{ top: "46%", cursor: scheduleDetial?.class?.enable !== false ? "pointer" : "no-drop" }}
            />
          </Box>
        )}
        {scheduleList.class_type !== "Task" && !(checkedStatus.homeFunCheck && scheduleList.class_type === "Homework") && (
          <Autocomplete
            id="combo-box-demo"
            freeSolo
            options={options()}
            groupBy={(option) => option.title as string}
            getOptionLabel={(option: any) => option.name}
            onChange={(e: any, newValue) => {
              autocompleteChange(newValue, "lesson_plan_id");
            }}
            value={lessonPlan}
            disabled={isScheduleExpired() || isLimit()}
            renderInput={(params) => (
              <TextField
                {...params}
                className={css.fieldset}
                label={d("Lesson Plan").t("library_label_lesson_plan")}
                error={validator.lesson_plan_id}
                value={scheduleList.lesson_plan_id}
                variant="outlined"
                required={scheduleList.class_type !== "Task"}
              />
            )}
          />
        )}
        {scheduleList.class_type !== "Task" && (
          <>
            {!(checkedStatus.homeFunCheck && scheduleList.class_type === "Homework") && (
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
            <Collapse in={linkageLessonPlanOpen || (checkedStatus.homeFunCheck && scheduleList.class_type === "Homework")}>
              <Paper elevation={0} className={css.paper}>
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
                      error={validator.program_id}
                      value={scheduleList.program_id}
                      required
                    />
                  )}
                />
                <Autocomplete
                  id="combo-box-demo"
                  options={modelSchedule.Deduplication(scheduleMockOptions.subjectList.concat(subjectItem!))}
                  getOptionLabel={(option: any) => option.name}
                  onChange={(e: any, newValue) => {
                    autocompleteChange(newValue, "subject_id");
                  }}
                  value={subjectItem}
                  disabled={isScheduleExpired() || isLimit()}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className={css.fieldset}
                      label={d("Subject").t("assess_label_subject")}
                      variant="outlined"
                      value={scheduleList.subject_id}
                      disabled={isScheduleExpired() || isLimit()}
                    />
                  )}
                />
              </Paper>
            </Collapse>
          </>
        )}
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
        />
        {scheduleId && privilegedMembers("Student") && scheduleDetial.class_type === "Homework" && checkedStatus.homeFunCheck && (
          <ScheduleFeedback
            schedule_id={scheduleId}
            changeModalDate={changeModalDate}
            className={scheduleDetial.class}
            due_date={scheduleDetial.due_at}
            teacher={(scheduleDetial?.class_roster_teachers ?? []).concat(scheduleDetial?.participants_teachers ?? [])}
            includeTable={includeTable}
            due_time={timestampToTime(scheduleDetial.due_at, "feedback") as string}
            is_hidden={isHidden}
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
              display: scheduleId ? "block" : "none",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              style={{
                width: "45%",
                marginRight: "10%",
                visibility: permissionShowPreview ? "visible" : "hidden",
              }}
              disabled={!scheduleDetial.real_time_status?.lesson_plan_is_auth}
              href={`#${ContentPreview.routeRedirectDefault}?id=${scheduleList.lesson_plan_id}&sid=${scheduleId}&class_id=${scheduleList.class_id}`}
            >
              {d("Preview").t("schedule_button_preview")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={
                scheduleDetial.status === "Closed" ||
                !scheduleDetial.real_time_status?.lesson_plan_is_auth ||
                (!privilegedMembers("Student") && scheduleList.class_type === "Homework")
              }
              style={{
                width: "45%",
                visibility: scheduleDetial.role_type === "Student" && scheduleList.class_type === "OfflineClass" ? "hidden" : "visible",
              }}
              onClick={() => handleGoLive(scheduleDetial)}
            >
              {scheduleList.class_type === "Homework" && d("Go Study").t("schedule_button_go_study")}
              {scheduleList.class_type === "OfflineClass" && d("Start Class").t("schedule_button_start_class")}
              {scheduleList.class_type === "OnlineClass" && d("Go Live").t("schedule_button_go_live")}
            </Button>
          </Box>
        )}
        {checkedStatus.repeatCheck && (
          <Box className={css.repeatBox}>
            <RepeatSchedule handleRepeatData={handleRepeatData} repeatState={state} />
          </Box>
        )}
      </Box>
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
  getParticipantsData?: (is_org: boolean) => void;
  LinkageLessonPlan: (content_id: string) => void;
  contentPreview: EntityContentInfoWithDetails;
  handleChangeHidden: (is_hidden: boolean) => void;
  isHidden: boolean;
  scheduleDetial: EntityScheduleDetailsView;
  privilegedMembers: (member: memberType) => boolean;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id?: string) => void;
  mediaList: EntityContentInfoWithDetails[];
  stateOnlyMine: string[];
  handleChangeOnlyMine: (data: string[]) => void;
  isShowAnyTime: boolean;
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
    scheduleDetial,
    privilegedMembers,
    handleChangeShowAnyTime,
    mediaList,
    stateOnlyMine,
    handleChangeOnlyMine,
    isShowAnyTime,
  } = props;

  const template = (
    <>
      <Box
        style={{
          display: includePreview ? "block" : "none",
        }}
      >
        <SmallCalendar
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
          scheduleDetial={scheduleDetial}
          privilegedMembers={privilegedMembers}
          handleChangeShowAnyTime={handleChangeShowAnyTime}
          mediaList={mediaList}
          stateOnlyMine={stateOnlyMine}
          handleChangeOnlyMine={handleChangeOnlyMine}
          isShowAnyTime={isShowAnyTime}
        />
      </Box>
      <Box
        style={{
          display: includePreview ? "none" : "block",
        }}
      >
        <EditBox
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
          scheduleDetial={scheduleDetial}
          privilegedMembers={privilegedMembers}
          handleChangeShowAnyTime={handleChangeShowAnyTime}
          mediaList={mediaList}
          stateOnlyMine={stateOnlyMine}
          handleChangeOnlyMine={handleChangeOnlyMine}
          isShowAnyTime={isShowAnyTime}
        />
      </Box>
    </>
  );
  return template;
}
