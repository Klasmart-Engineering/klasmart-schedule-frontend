import { Grid } from "@material-ui/core";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import { apiLivePath } from "../../api/extra";
import KidsCalendar from "../../components/Calendar";
import LayoutBox from "../../components/LayoutBox";
import ModalBox from "../../components/ModalBox";
import { PermissionType, usePermission } from "../../components/Permission";
import { useRepeatSchedule } from "../../hooks/useRepeatSchedule";
import { d } from "../../locale/LocaleManager";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned, contentLists } from "../../reducers/content";
import { actError } from "../../reducers/notify";
import {
  getClassesByOrg,
  getClassesBySchool,
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
} from "../../reducers/schedule";
import { AlertDialogProps, modeViewType, ParticipantsShortInfo, RouteParams, timestampType } from "../../types/scheduleTypes";
import ConfilctTestTemplate from "./ConfilctTestTemplate";
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

function ScheduleContent() {
  const { model, rightside } = useParams();
  const { includeTable, includeList } = parseRightside(rightside);
  const { includePreview } = parseModel(model);
  const timestampInt = (timestamp: number) => Math.floor(timestamp);
  const { mockOptions, scheduleMockOptions, participantMockOptions, liveToken, scheduleTimeViewYearData, ParticipantsData } = useSelector<
    RootState,
    RootState["schedule"]
  >((state) => state.schedule);
  const dispatch = useDispatch();
  const { scheduleId, teacherName } = useQuery();
  const [state] = useRepeatSchedule();
  const { type } = state;
  const [, setChangeProgram] = React.useState<string>("");
  const [modelYear, setModelYear] = React.useState<boolean>(false);

  const [participantsIds, setParticipantsIds] = React.useState<ParticipantsShortInfo>({ student: [], teacher: [] });
  const [classRosterIds, setClassRosterIds] = React.useState<ParticipantsShortInfo>({ student: [], teacher: [] });

  const handleChangeProgramId = (programId: string) => {
    setChangeProgram(programId);
  };

  const handleChangeParticipants = (type: string, data: ParticipantsShortInfo) => {
    type === "classRoster" ? setClassRosterIds(data) : setParticipantsIds(data);
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

  const toLive = () => {
    dispatch(scheduleUpdateStatus({ schedule_id: scheduleId, status: { status: "Started" } }));
    if (liveToken) window.open(apiLivePath(liveToken));
  };

  const getParticipants = (is_org: boolean = true) => {
    dispatch(getParticipantsData(is_org));
  };

  React.useEffect(() => {
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
  }, [modelView, timesTamp, dispatch]);

  const getOrgByClass = usePermission(PermissionType.create_event_520);
  const getOrgBySchool = usePermission(PermissionType.create_my_schools_schedule_events_522);

  React.useEffect(() => {
    // getParticipants(getOrgByClass)
    dispatch(getParticipantsData(getOrgByClass));
  }, [dispatch, getOrgByClass]);

  React.useEffect(() => {
    dispatch(getMockOptions());
    dispatch(getScheduleMockOptions({}));
  }, [dispatch]);

  React.useEffect(() => {
    if (getOrgByClass) {
      dispatch(getClassesByOrg());
    } else if (getOrgBySchool) {
      dispatch(getClassesBySchool());
    } else {
      dispatch(getClassesByTeacher());
    }
  }, [dispatch, getOrgByClass, getOrgBySchool]);

  React.useEffect(() => {
    dispatch(contentLists({ publish_status: "published", content_type: "2" }));
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
              participantsIds={participantsIds}
              classRosterIds={classRosterIds}
              handleChangeParticipants={handleChangeParticipants}
              ParticipantsData={ParticipantsData}
              getParticipantsData={getParticipants}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={9}>
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
