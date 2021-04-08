import { Grid } from "@material-ui/core";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import { apiLivePath } from "../../api/extra";
import KidsCalendar from "../../components/Calendar";
import ScheduleAnyTime from "./ScheduleAnyTime";
import LayoutBox from "../../components/LayoutBox";
import ModalBox from "../../components/ModalBox";
import { useRepeatSchedule } from "../../hooks/useRepeatSchedule";
import { d } from "../../locale/LocaleManager";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned, contentLists, onLoadContentPreview, searchAuthContentLists } from "../../reducers/content";
import { actError } from "../../reducers/notify";
import {
  getClassesByOrg,
  getClassesByTeacher,
  getContentsAuthed,
  getMockOptions,
  getParticipantsData,
  getScheduleInfo,
  getScheduleMockOptions,
  getScheduleParticipant,
  getScheduleTimeViewData,
  getSearchScheduleList,
  scheduleUpdateStatus,
  getClassesBySchool,
  changeParticipants,
  getSchoolInfo,
  getSubjectByProgramId,
  ScheduleFilterPrograms,
  ScheduleClassTypesFilter,
  getScheduleAnyTimeViewData,
  getScheduleFilterClasses,
  getScheduleUserId,
  getClassesByStudent,
  getSchoolByUser,
  getSchoolByOrg,
} from "../../reducers/schedule";
import {
  AlertDialogProps,
  EntityScheduleClassesInfo,
  EntityScheduleSchoolInfo,
  memberType,
  modeViewType,
  ParticipantsShortInfo,
  RouteParams,
  timestampType,
} from "../../types/scheduleTypes";
import ConfilctTestTemplate from "./ConfilctTestTemplate";
import ScheduleEdit from "./ScheduleEdit";
import ScheduleTool from "./ScheduleTool";
import SearchList from "./SearchList";
import { PermissionType, usePermission } from "../../components/Permission";
import Paper from "@material-ui/core/Paper";
import Zoom from "@material-ui/core/Zoom";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const scheduleId = query.get("schedule_id") || "";
  const teacherName = query.get("name") || "";
  return { scheduleId, teacherName };
};

const parseRightside = (rightside: RouteParams["rightside"]) => ({
  includeTable: rightside.includes("scheduleTable"),
  includeList: rightside.includes("scheduleList"),
});

const parseModel = (model: RouteParams["model"]) => ({
  includeEdit: model.includes("edit"),
  includePreview: model.includes("preview"),
});

function ScheduleContent() {
  const { model, rightside } = useParams();
  const { includeTable, includeList } = parseRightside(rightside);
  const { includePreview } = parseModel(model);
  const timestampInt = (timestamp: number) => Math.floor(timestamp);
  const {
    mockOptions,
    scheduleMockOptions,
    participantMockOptions,
    liveToken,
    scheduleTimeViewYearData,
    ParticipantsData,
    classRosterIds,
    participantsIds,
    scheduleDetial,
    scheduleAnyTimeViewData,
    schoolByOrgOrUserData,
  } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const dispatch = useDispatch();
  const { scheduleId, teacherName } = useQuery();
  const [state] = useRepeatSchedule();
  const { type } = state;
  const [modelYear, setModelYear] = React.useState<boolean>(false);
  const { contentPreview, mediaList } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const [isHidden, setIsHidden] = React.useState<boolean>(false);
  const [isShowAnyTime, setIsShowAnyTime] = React.useState<boolean>(false);
  const [anyTimeName, setAnyTimeName] = React.useState<string>("");
  const [stateOnlyMine, setStateOnlyMine] = React.useState<string[]>([]);
  const [stateCurrentCid, setStateCurrentCid] = React.useState<string>("");

  const handleChangeOnlyMine = (data: string[]) => {
    setStateOnlyMine(data);
  };

  const handleChangeHidden = (is_hidden: boolean) => {
    setIsHidden(is_hidden);
  };

  const handleChangeProgramId = async (programId: string) => {
    let resultInfo: any;
    resultInfo = ((await dispatch(getSubjectByProgramId({ program_id: programId, metaLoading: true }))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof getSubjectByProgramId>
    >;
    return resultInfo.payload ? resultInfo.payload : [{ id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" }];
  };

  const LinkageLessonPlan = async (content_id: string) => {
    let resultInfo: any;
    resultInfo = ((await dispatch(
      onLoadContentPreview({ metaLoading: true, content_id: content_id, schedule_id: "", tokenToCall: false })
    )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof onLoadContentPreview>>;
    await dispatch(getSubjectByProgramId({ program_id: resultInfo.payload.contentDetail.program }));
    return {
      program_id: resultInfo.payload.contentDetail.program as string,
      subject_id: resultInfo.payload.contentDetail.subject![0] as string,
    };
  };

  const handleChangeParticipants = (type: string, data: ParticipantsShortInfo) => {
    dispatch(changeParticipants({ type: type, data: data }));
  };

  const handleChangeShowAnyTime = async (is_show: boolean, name: string, class_id?: string) => {
    if (class_id)
      await dispatch(
        getScheduleAnyTimeViewData({
          view_type: "full_view",
          filter_option: "any_time",
          class_ids: class_id,
          order_by: "-create_at",
          metaLoading: true,
        })
      );
    if (class_id) setStateCurrentCid(class_id);
    setIsShowAnyTime(is_show);
    setAnyTimeName(name);
  };

  const initModalDate: AlertDialogProps = {
    handleChange: function (p1: number) {},
    radioValue: 0,
    radios: undefined,
    title: "",
    text: "",
    enableCustomization: false,
    customizeTemplate: <ConfilctTestTemplate handleDelete={() => {}} handleClose={() => {}} title={d("Edit").t("assess_button_edit")} />,
    openStatus: false,
    buttons: [],
    handleClose: () => {
      changeModalDate({ openStatus: false });
    },
  };

  const [modalDate, setModalDate] = React.useState<AlertDialogProps>(initModalDate);

  const changeModalDate = useCallback(
    (data: object) => {
      setModalDate({ ...modalDate, ...data });
    },
    [modalDate]
  );

  /**
   * calendar model view change
   */
  const [modelView, setModelView] = React.useState<modeViewType>("month");
  const changeModelView = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value === "year") {
      setModelYear(true);
    } else {
      setModelYear(false);
      setModelView(event.target.value as modeViewType);
    }
  };

  /**
   * get participants
   * @param class_id
   */
  const getParticipantOptions = async (class_id: string) => {
    let resultInfo: any;
    resultInfo = ((await dispatch(getScheduleParticipant({ class_id: class_id }))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof getScheduleParticipant>
    >;
    if (resultInfo.payload.participantList.class.teachers.concat(resultInfo.payload.participantList.class.students).length < 1)
      dispatch(actError(d("There is no student in this class").t("schedule_msg_no_student")));
    return resultInfo;
  };

  /**
   * calendar model view change
   */
  const [timesTamp, setTimesTamp] = React.useState<timestampType>({
    start: timestampInt(new Date().getTime() / 1000),
    end: timestampInt(new Date().getTime() / 1000),
  });
  const changeTimesTamp = (times: timestampType) => {
    setTimesTamp(times);
  };

  const isAdmin = usePermission(PermissionType.create_event_520);
  const isSchool = usePermission(PermissionType.create_my_schools_schedule_events_522);
  const isTeacher = usePermission(PermissionType.create_my_schedule_events_521);
  const isStudent = usePermission(PermissionType.attend_live_class_as_a_student_187);

  const privilegedMembers = useCallback(
    (member: memberType): boolean => {
      const permissions = {
        Admin: isAdmin,
        School: !isAdmin && isSchool,
        Teacher: !isAdmin && !isSchool && isTeacher,
        Student: !isAdmin && !isSchool && !isTeacher && isStudent,
      };
      return permissions[member];
    },
    [isAdmin, isSchool, isTeacher, isStudent]
  );

  const toLive = () => {
    dispatch(scheduleUpdateStatus({ schedule_id: scheduleId, status: { status: "Started" } }));
    if (liveToken) window.open(apiLivePath(liveToken));
  };

  const getParticipants = (is_org: boolean = true) => {
    dispatch(getParticipantsData(is_org));
  };

  React.useEffect(() => {
    if (stateOnlyMine.length > 0) return;
    if (teacherName) {
      const data = {
        teacher_name: teacherName,
        page: 1,
        page_size: 10,
        time_zone_offset: -new Date().getTimezoneOffset() * 60,
        start_at: timesTamp.start,
      };
      dispatch(getSearchScheduleList({ data, metaLoading: true }));
    } else {
      dispatch(
        getScheduleTimeViewData({
          view_type: modelView,
          time_at: timesTamp.start,
          time_zone_offset: -new Date().getTimezoneOffset() * 60,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelView, timesTamp, stateOnlyMine, dispatch]);

  React.useEffect(() => {
    if (scheduleId && scheduleDetial.id) setIsHidden(scheduleDetial.is_hidden as boolean);
  }, [dispatch, scheduleDetial, scheduleId]);

  React.useEffect(() => {
    dispatch(getMockOptions());
    dispatch(getScheduleMockOptions({}));
    dispatch(getSchoolInfo());
    dispatch(ScheduleClassTypesFilter());
    dispatch(ScheduleFilterPrograms());
    dispatch(getScheduleFilterClasses({ school_id: "-1" }));
    dispatch(getScheduleUserId());
    dispatch(
      searchAuthContentLists({
        metaLoading: true,
        program_group: "More+Featured+Content",
        page_size: 1000,
      })
    );
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(getParticipantsData(isAdmin));
  }, [dispatch, isAdmin]);

  React.useEffect(() => {
    if (schoolByOrgOrUserData) {
      const existData: string[] = [];
      schoolByOrgOrUserData?.forEach((schoolItem: EntityScheduleSchoolInfo) => {
        schoolItem.classes?.forEach((classItem: EntityScheduleClassesInfo) => {
          existData.push(`class+${classItem.class_id}+${schoolItem.school_id}` as string);
        });
        if (schoolItem.classes.length > 0) existData.push(`class+All+${schoolItem.school_id}`);
      });
      setStateOnlyMine([...existData, "All_My_Schools"]);
    }
  }, [schoolByOrgOrUserData]);

  React.useEffect(() => {
    if (privilegedMembers("Admin")) {
      dispatch(getClassesByOrg());
      dispatch(getSchoolByOrg());
    } else if (privilegedMembers("School")) {
      dispatch(getClassesBySchool());
      dispatch(getSchoolByUser());
    } else if (privilegedMembers("Teacher")) {
      dispatch(getClassesByTeacher());
      dispatch(getSchoolByUser());
    } else if (privilegedMembers("Student")) {
      dispatch(getClassesByStudent());
      dispatch(getSchoolByUser());
    }
  }, [dispatch, privilegedMembers]);

  React.useEffect(() => {
    dispatch(contentLists({ publish_status: "published", content_type: "2", page_size: 1000, order_by: "create_at" }));
    dispatch(getContentsAuthed({ content_type: "2", page_size: 1000 }));
    if (scheduleId) {
      dispatch(getScheduleInfo(scheduleId));
    }
    setModalDate({
      handleChange: function (p1: number) {},
      radioValue: 0,
      radios: undefined,
      title: "",
      text: "",
      enableCustomization: false,
      customizeTemplate: <></>,
      openStatus: false,
      buttons: [],
      handleClose: () => {},
    });
  }, [scheduleId, setModalDate, dispatch]);
  const [specificStatus, setSpecificStatus] = React.useState(true);

  return (
    <>
      <LayoutBox holderMin={40} holderBase={80} mainBase={1920}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ScheduleTool
              includeList={includeList}
              changeModelView={changeModelView}
              modelView={modelView}
              changeTimesTamp={changeTimesTamp}
              timesTamp={timesTamp}
              scheduleId={scheduleId}
              modelYear={modelYear}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={3}>
            <ScheduleEdit
              includePreview={includePreview}
              timesTamp={timesTamp}
              changeTimesTamp={changeTimesTamp}
              repeatData={{ type, [type]: state[type] }}
              modelView={modelView}
              scheduleId={scheduleId}
              includeTable={includeTable}
              handleChangeProgramId={handleChangeProgramId}
              toLive={toLive}
              changeModalDate={changeModalDate}
              mockOptions={mockOptions.options}
              scheduleMockOptions={scheduleMockOptions}
              participantMockOptions={participantMockOptions}
              getParticipantOptions={getParticipantOptions}
              setSpecificStatus={setSpecificStatus}
              specificStatus={specificStatus}
              contentPreview={contentPreview}
              mediaList={mediaList}
              LinkageLessonPlan={LinkageLessonPlan}
              participantsIds={participantsIds}
              classRosterIds={classRosterIds}
              handleChangeParticipants={handleChangeParticipants}
              ParticipantsData={ParticipantsData}
              getParticipantsData={getParticipants}
              handleChangeHidden={handleChangeHidden}
              isHidden={isHidden}
              scheduleDetial={scheduleDetial}
              privilegedMembers={privilegedMembers}
              handleChangeShowAnyTime={handleChangeShowAnyTime}
              stateOnlyMine={stateOnlyMine}
              handleChangeOnlyMine={handleChangeOnlyMine}
              isShowAnyTime={isShowAnyTime}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={9} style={{ position: "relative" }}>
            <Zoom in={isShowAnyTime}>
              <Paper elevation={4}>
                <ScheduleAnyTime
                  anyTimeName={anyTimeName}
                  modelView={modelView}
                  timesTamp={timesTamp}
                  handleChangeShowAnyTime={handleChangeShowAnyTime}
                  scheduleAnyTimeViewData={scheduleAnyTimeViewData}
                  privilegedMembers={privilegedMembers}
                  changeModalDate={changeModalDate}
                  toLive={toLive}
                  handleChangeHidden={handleChangeHidden}
                  stateCurrentCid={stateCurrentCid}
                />
              </Paper>
            </Zoom>
            {includeTable && (
              <KidsCalendar
                modelView={modelView}
                timesTamp={timesTamp}
                changeTimesTamp={changeTimesTamp}
                toLive={toLive}
                changeModalDate={changeModalDate}
                setSpecificStatus={setSpecificStatus}
                modelYear={modelYear}
                scheduleTimeViewYearData={scheduleTimeViewYearData}
                handleChangeHidden={handleChangeHidden}
                isHidden={isHidden}
              />
            )}
            {includeList && <SearchList timesTamp={timesTamp} />}
          </Grid>
        </Grid>
      </LayoutBox>
      <ModalBox modalDate={modalDate} />
    </>
  );
}

export default function Schedule() {
  return <ScheduleContent />;
}

Schedule.routeBasePath = "/schedule/calendar";
Schedule.routeMatchPath = "/schedule/calendar/rightside/:rightside/model/:model";
Schedule.routeRedirectDefault = "/schedule/calendar/rightside/scheduleTable/model/preview";
