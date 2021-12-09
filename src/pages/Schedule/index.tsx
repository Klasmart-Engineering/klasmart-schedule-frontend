import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Zoom from "@material-ui/core/Zoom";
import { onLoadContentPreview } from "@reducers/content";
import { RootState } from "@reducers/index";
import { actError } from "@reducers/notify";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import { ConnectionDirection, StringOperator, UuidExclusiveOperator } from "../../api/api-ko-schema.auto";
import { EntityContentInfoWithDetails, EntityScheduleViewDetail } from "../../api/api.auto";
import { apiLivePath } from "../../api/extra";
import PermissionType from "../../api/PermissionType";
import KidsCalendar from "../../components/Calendar";
import LayoutBox from "../../components/LayoutBox";
import ModalBox from "../../components/ModalBox";
import { usePermission } from "../../hooks/usePermission";
import { useRepeatSchedule } from "../../hooks/useRepeatSchedule";
import { d } from "../../locale/LocaleManager";
import { ModelLessonPlan, Segment } from "../../models/ModelLessonPlan";
import { modelSchedule } from "../../models/ModelSchedule";
import {
  actOutcomeListLoading,
  changeParticipants,
  classesWithoutSchool,
  getClassesByOrg,
  getClassesBySchool,
  getClassesByStudent,
  getClassesByTeacher,
  getClassFilterList,
  getLessonPlansBySchedule,
  getLinkedMockOptions,
  getParticipantsData,
  getScheduleAnyTimeViewData,
  getScheduleInfo,
  getScheduleMockOptions,
  getScheduleParticipant,
  getScheduleTimeViewData,
  getScheduleTimeViewDataByYear,
  getScheduleViewInfo,
  getSchoolsFilterList,
  getSubjectByProgramId,
  getUserInUndefined,
  ScheduleFilterPrograms,
  scheduleUpdateStatus,
} from "../../reducers/schedule";
import { AlertDialogProps, memberType, modeViewType, ParticipantsShortInfo, RouteParams, timestampType } from "../../types/scheduleTypes";
import ConfilctTestTemplate from "./ConfilctTestTemplate";
import ScheduleAnyTime from "./ScheduleAnyTime";
import ScheduleEdit from "./ScheduleEdit";
import ScheduleTool from "./ScheduleTool";
import SearchList from "./SearchList";

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

interface ParamTypes {
  model: "edit" | "preview";
  rightside: "scheduleTable" | "scheduleList";
}

function ScheduleContent() {
  const { model, rightside } = useParams<ParamTypes>();
  const { includeTable, includeList } = parseRightside(rightside);
  const { includePreview, includeEdit } = parseModel(model);
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
    ScheduleViewInfo,
    filterOption,
    schoolByOrgOrUserData,
    schoolsConnection,
    classesConnection,
    userInUndefined,
    lessonPlans,
    filterOtherClasses,
  } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const dispatch = useDispatch();
  const { scheduleId } = useQuery();
  const [state] = useRepeatSchedule();
  const { type } = state;
  const [modelYear, setModelYear] = React.useState<boolean>(false);
  const { contentPreview } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const [isHidden, setIsHidden] = React.useState<boolean>(false);
  const [isShowAnyTime, setIsShowAnyTime] = React.useState<boolean>(false);
  const [anyTimeName, setAnyTimeName] = React.useState<string>("");
  const [stateOnlyMine, setStateOnlyMine] = React.useState<string[]>([]);
  const [stateCurrentCid, setStateCurrentCid] = React.useState<string>("");
  const [stateMaterialArr, setStateMaterialArr] = React.useState<(EntityContentInfoWithDetails | undefined)[]>([]);
  const [stateFlag, setStateFlag] = React.useState<boolean>(true);

  const handleChangeOnlyMine = (data: string[]) => {
    setStateOnlyMine(data);
  };

  const handleChangeHidden = (is_hidden: boolean) => {
    setIsHidden(is_hidden);
  };

  const handleChangeProgramId = async (programId: string) => {
    let resultInfo: any;
    resultInfo = (await dispatch(getSubjectByProgramId({ program_id: programId, metaLoading: true }))) as unknown as PayloadAction<
      AsyncTrunkReturned<typeof getSubjectByProgramId>
    >;
    return resultInfo.payload ? resultInfo.payload : [{ id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" }];
  };

  const LinkageLessonPlan = async (content_id: string) => {
    let resultInfo: any;
    resultInfo = (await dispatch(onLoadContentPreview({ metaLoading: true, content_id }))) as unknown as PayloadAction<
      AsyncTrunkReturned<typeof onLoadContentPreview>
    >;
    const segment: Segment = JSON.parse(resultInfo.payload.contentDetail.data || "{}");
    const materialArr = ModelLessonPlan.toArray(segment);
    const newMaterialArr: (EntityContentInfoWithDetails | undefined)[] = [];
    materialArr.forEach((value) => {
      if (value) newMaterialArr.push(value);
    });
    setStateMaterialArr(newMaterialArr);

    await dispatch(getSubjectByProgramId({ program_id: resultInfo.payload.contentDetail.program }));
    return {
      program_id: resultInfo.payload.contentDetail.program as string,
      subject_id: resultInfo.payload.contentDetail.subject![0] as string,
    };
  };

  const handleChangeParticipants = (type: string, data: ParticipantsShortInfo) => {
    dispatch(changeParticipants({ type: type, data: data }));
  };

  const handleChangeShowAnyTime = async (is_show: boolean, name: string, class_id?: string, user_id?: string) => {
    if (class_id || user_id)
      await dispatch(
        getScheduleAnyTimeViewData({
          view_type: "full_view",
          filter_option: "any_time",
          class_ids: class_id,
          user_ids: user_id,
          order_by: "-create_at",
          metaLoading: true,
        })
      );
    if (class_id) setStateCurrentCid(class_id);
    if (user_id) setStateCurrentCid(user_id);
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
    showScheduleInfo: false,
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
  const [modelView, setModelView] = React.useState<modeViewType>(document.body.clientWidth < 600 ? "day" : "month");
  const changeModelView = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (event.target.value === "year") {
      setModelYear(true);
    } else {
      setModelYear(false);
      setModelView(event.target.value as modeViewType);
    }
  };

  window.addEventListener("resize", () => {
    if (document.body.clientWidth < 600) {
      setModelView("day");
    } else {
      setModelView("month");
    }
  });

  /**
   * get participants
   * @param class_id
   */
  const getParticipantOptions = async (class_id: string) => {
    let resultInfo: any;
    resultInfo = (await dispatch(getScheduleParticipant({ class_id: class_id, metaLoading: true }))) as unknown as PayloadAction<
      AsyncTrunkReturned<typeof getScheduleParticipant>
    >;
    if (resultInfo.payload.participantList.class.teachers.concat(resultInfo.payload.participantList.class.students).length < 1)
      dispatch(actError(d("There is no student in this class").t("schedule_msg_no_student")));
    return resultInfo;
  };

  const getHandleScheduleViewInfo = async (schedule_id: string) => {
    let resultInfo: any;
    resultInfo = (await dispatch(getScheduleViewInfo({ schedule_id, metaLoading: true }))) as unknown as PayloadAction<
      AsyncTrunkReturned<typeof getScheduleViewInfo>
    >;
    return resultInfo.payload as EntityScheduleViewDetail;
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

  const perms = usePermission([
    PermissionType.create_event_520,
    PermissionType.create_my_schools_schedule_events_522,
    PermissionType.create_my_schedule_events_521,
    PermissionType.attend_live_class_as_a_student_187,
    PermissionType.view_subjects_20115,
  ]);

  const isAdmin = perms.create_event_520;
  const isSchool = perms.create_my_schools_schedule_events_522;
  const isTeacher = perms.create_my_schedule_events_521;
  const isStudent = perms.attend_live_class_as_a_student_187;
  const viewSubjectPermission = perms.view_subjects_20115;

  const privilegedMembers = useCallback(
    (member: memberType): boolean => {
      const permissions = {
        Admin: isAdmin,
        School: !isAdmin && isSchool,
        Teacher: !isAdmin && !isSchool && isTeacher,
        Student: !isAdmin && !isSchool && !isTeacher && isStudent,
      };
      return permissions[member] as boolean;
    },
    [isAdmin, isSchool, isTeacher, isStudent]
  );

  const toLive = (schedule_id?: string, token?: string) => {
    dispatch(scheduleUpdateStatus({ schedule_id: schedule_id ?? scheduleId, status: { status: "Started" } }));
    if (liveToken || token) window.open(apiLivePath(token ?? liveToken));
  };

  const getParticipants = async (metaLoading: boolean = true, search: string, hash: string) => {
    await dispatch(getParticipantsData({ is_org: isAdmin as boolean, hash: hash, name: search, metaLoading: metaLoading }));
  };

  const getClassesConnection = async (
    cursor: string,
    school_id: string,
    loading: boolean,
    direction: ConnectionDirection.Forward | ConnectionDirection.Backward
  ) => {
    await dispatch(
      getClassFilterList({
        filter: {
          schoolId: { operator: UuidExclusiveOperator.Eq, value: school_id },
          status: { operator: StringOperator.Eq, value: "active" },
        },
        direction: direction,
        directionArgs: { count: 5, cursor: cursor ?? "" },
        metaLoading: loading,
      })
    );
  };

  const getUesrOfUndefined = async (
    cursor: string,
    loading: boolean,
    direction: ConnectionDirection.Forward | ConnectionDirection.Backward
  ) => {
    await dispatch(
      getUserInUndefined({
        direction: direction,
        directionArgs: { count: 5, cursor: cursor ?? "" },
        metaLoading: loading,
      })
    );
  };

  const getSchoolsConnection = async (cursor: string, value: string, loading: boolean) => {
    let resultInfo: any;
    resultInfo = await dispatch(
      getSchoolsFilterList({
        filter: { name: { operator: StringOperator.Contains, value: value }, status: { operator: StringOperator.Eq, value: "active" } },
        direction: ConnectionDirection.Forward,
        directionArgs: { count: 5, cursor: cursor ?? "" },
        metaLoading: loading,
      })
    );
    return resultInfo.payload ? resultInfo.payload.data.schoolsConnection.edges : [];
  };

  const getClassesWithoutSchool = async (cursor: string, value: string, loading: boolean) => {
    let resultInfo: any;
    resultInfo = await dispatch(
      classesWithoutSchool({
        filter: { name: { operator: StringOperator.Contains, value: value } },
        direction: ConnectionDirection.Forward,
        directionArgs: { count: 5, cursor: cursor ?? "" },
        metaLoading: loading,
      })
    );
    return resultInfo.payload ? resultInfo.payload.data.classesConnection.edges : [];
  };

  React.useEffect(() => {
    if (includeEdit && stateFlag) {
      // get content
      if (privilegedMembers("Student") !== undefined && !privilegedMembers("Student")) {
        dispatch(actOutcomeListLoading({ page_size: -1, assumed: -1 }));
      }
      // get class by role
      if (privilegedMembers("Admin")) {
        dispatch(getClassesByOrg());
      } else if (privilegedMembers("School")) {
        dispatch(getClassesBySchool());
      } else if (privilegedMembers("Teacher")) {
        dispatch(getClassesByTeacher());
      } else if (privilegedMembers("Student")) {
        dispatch(getClassesByStudent());
      }
      // get materials
      dispatch(getLessonPlansBySchedule({ metaLoading: true }));
      dispatch(getScheduleMockOptions({}));
      dispatch(getLinkedMockOptions({ metaLoading: true }));
      setStateFlag(false);
    }
  }, [includeEdit, privilegedMembers, stateFlag, isAdmin, dispatch]);

  React.useEffect(() => {
    dispatch(
      getScheduleTimeViewData({
        view_type: modelView,
        time_at: timesTamp.start,
        time_zone_offset: -new Date().getTimezoneOffset() * 60,
        ...modelSchedule.AssemblyFilterParameter(stateOnlyMine),
      })
    );
  }, [modelView, timesTamp, stateOnlyMine, dispatch]);

  React.useEffect(() => {
    if (modelYear)
      dispatch(
        getScheduleTimeViewDataByYear({
          view_type: "year",
          time_at: timesTamp.start,
          time_zone_offset: -new Date().getTimezoneOffset() * 60,
          ...modelSchedule.AssemblyFilterParameter(stateOnlyMine),
          metaLoading: true,
        })
      );
  }, [modelYear, timesTamp, stateOnlyMine, dispatch]);

  React.useEffect(() => {
    if (scheduleId && scheduleDetial.id) setIsHidden(scheduleDetial.is_hidden as boolean);
  }, [dispatch, scheduleDetial, scheduleId]);

  React.useEffect(() => {
    setStateMaterialArr([]);
  }, [timesTamp]);

  React.useEffect(() => {
    dispatch(ScheduleFilterPrograms());
    dispatch(
      getSchoolsFilterList({
        filter: { status: { operator: StringOperator.Eq, value: "active" } },
        direction: ConnectionDirection.Forward,
        directionArgs: { count: 5 },
      })
    );
    dispatch(
      classesWithoutSchool({
        direction: ConnectionDirection.Forward,
        directionArgs: { count: 5 },
      })
    );
  }, [dispatch]);

  React.useEffect(() => {
    if (scheduleId) {
      dispatch(getScheduleInfo(scheduleId));
      setStateMaterialArr([]);
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
      <LayoutBox holderMin={10} holderBase={80} mainBase={1920}>
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
              getClassesWithoutSchool={getClassesWithoutSchool}
              getUesrOfUndefined={getUesrOfUndefined}
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
              stateCurrentCid={stateCurrentCid}
              stateMaterialArr={stateMaterialArr}
              filterOption={filterOption}
              schoolByOrgOrUserData={schoolByOrgOrUserData}
              viewSubjectPermission={viewSubjectPermission}
              schoolsConnection={schoolsConnection}
              filterOtherClasses={filterOtherClasses}
              getSchoolsConnection={getSchoolsConnection}
              getClassesConnection={getClassesConnection}
              classesConnection={classesConnection}
              userInUndefined={userInUndefined}
              lessonPlans={lessonPlans}
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
                getHandleScheduleViewInfo={getHandleScheduleViewInfo}
                ScheduleViewInfo={ScheduleViewInfo}
                privilegedMembers={privilegedMembers}
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
