import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ChevronLeftOutlinedIcon from "@material-ui/icons/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@material-ui/icons/ChevronRightOutlined";
import { PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import React, { useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { d, localeManager } from "../../locale/LocaleManager";
import ConfilctTestTemplate from "../../pages/Schedule/ConfilctTestTemplate";
import CustomizeTempalte from "../../pages/Schedule/CustomizeTempalte";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned } from "../../reducers/content";
import { actSuccess } from "../../reducers/notify";
import { getScheduleLiveToken, getScheduleTimeViewData, removeSchedule, resetScheduleTimeViewData } from "../../reducers/schedule";
import { modeViewType, repeatOptionsType, timestampType, scheduleInfoViewProps, memberType } from "../../types/scheduleTypes";
import { PermissionType, usePermission } from "../Permission";
import YearCalendar from "./YearView";
import { EntityScheduleListView, EntityScheduleViewDetail } from "../../api/api.auto";
import "moment/locale/zh-cn";
import "moment/locale/vi";
import "moment/locale/ko";
import "moment/locale/id";
import "moment/locale/en-au";
import "moment/locale/es";

const useStyles = makeStyles(({ shadows }) => ({
  calendarBox: {
    boxShadow: shadows[3],
  },
  calendarNav: {
    height: "50px",
    display: "flex",
    alignItems: "center",
  },
  chevron: {
    marginLeft: "20px",
    fontSize: "26px",
    color: "#757575",
    cursor: "pointer",
    marginRight: "10px",
  },
}));

function MyCalendar(props: CalendarProps) {
  const css = useStyles();
  const {
    modelView,
    timesTamp,
    changeTimesTamp,
    toLive,
    changeModalDate,
    setSpecificStatus,
    modelYear,
    scheduleTimeViewYearData,
    isHidden,
    handleChangeHidden,
    getHandleScheduleViewInfo,
    privilegedMembers,
  } = props;
  const history = useHistory();
  const getTimestamp = (data: string) => new Date(data).getTime() / 1000;
  const { scheduleTimeViewData } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const dispatch = useDispatch();
  const monthArr = [
    d("Jan").t("schedule_calendar_jan"),
    d("Feb").t("schedule_calendar_feb"),
    d("Mar").t("schedule_calendar_mar"),
    d("Apr").t("schedule_calendar_apr"),
    d("May").t("schedule_calendar_may"),
    d("Jun").t("schedule_calendar_jun"),
    d("Jul").t("schedule_calendar_jul"),
    d("Aug").t("schedule_calendar_aug"),
    d("Sep").t("schedule_calendar_sep"),
    d("Oct").t("schedule_calendar_oct"),
    d("Nov").t("schedule_calendar_nov"),
    d("Dec").t("schedule_calendar_dec"),
  ];

  const views = { work_week: true, day: true, agenda: true, month: true, week: true };

  const lang = { en: "en-au", zh: "zh-cn", vi: "vi", ko: "ko", id: "id", es: "es" };

  // Setup the localizer by providing the moment (or globalize) Object
  // to the correct localizer.
  moment.locale(lang[localeManager.getLocale()!]);
  const localizer = momentLocalizer(moment);

  const deleteScheduleByid = useCallback(
    async (repeat_edit_options: repeatOptionsType = "only_current", scheduleInfo: scheduleInfoViewProps) => {
      await dispatch(removeSchedule({ schedule_id: scheduleInfo.id, repeat_edit_options: { repeat_edit_options: repeat_edit_options } }));
      const { payload } = ((await dispatch(
        removeSchedule({ schedule_id: scheduleInfo.id, repeat_edit_options: { repeat_edit_options: repeat_edit_options } })
      )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof removeSchedule>>;
      changeModalDate({ openStatus: false, enableCustomization: false });
      if (payload) {
        dispatch(actSuccess(d("Deleted sucessfully").t("schedule_msg_delete_success")));
        dispatch(
          getScheduleTimeViewData({
            view_type: modelView,
            time_at: timesTamp.start,
            time_zone_offset: -new Date().getTimezoneOffset() * 60,
          })
        );
        history.push("/schedule/calendar/rightside/scheduleTable/model/preview");
      }
    },
    [changeModalDate, dispatch, history, modelView, timesTamp]
  );
  const refreshView = useCallback(
    async (template: string) => {
      dispatch(actSuccess(template));
      dispatch(
        getScheduleTimeViewData({
          view_type: modelView,
          time_at: timesTamp.start,
          time_zone_offset: -new Date().getTimezoneOffset() * 60,
        })
      );
    },
    [dispatch, modelView, timesTamp]
  );

  const permissionShowLive = usePermission(PermissionType.attend_live_class_as_a_student_187);

  const scheduleTimeViewDataFormat = (data: EntityScheduleListView[]): scheduleInfoViewProps[] => {
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

  /**
   * rander data
   * @param timesTamp
   */
  const getPeriod = (timesTamp: timestampType) => {
    if (modelYear) return new Date(timesTamp.start * 1000).getFullYear();
    const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
    const timesTampData = new Date(timesTamp.start * 1000);
    const [Y, M, D] = [
      (timesTampData as Date).getFullYear(),
      (timesTampData as Date).getMonth(),
      (timesTampData as Date).getDate(),
      (timesTampData as Date).getDay(),
      dateNumFun((timesTampData as Date).getHours()),
      dateNumFun((timesTampData as Date).getMinutes()),
    ];
    switch (modelView) {
      case "day":
        return `${monthArr[M]} ${D}, ${Y}`;
      case "month":
        return `${Y} ${monthArr[M]}`;
      case "week":
      case "work_week":
        let startWeek = 1;
        let endWeek = 7;
        let month = "";
        if (document.getElementsByClassName("rbc-time-header-cell").length > 0) {
          const firstNode: any = document.getElementsByClassName("rbc-time-header-cell")[0].firstChild;
          const lastNode: any = document.getElementsByClassName("rbc-time-header-cell")[0].lastChild;
          startWeek = firstNode.getElementsByTagName("span")[0].textContent.split(" ")[0] as number;
          endWeek = lastNode.getElementsByTagName("span")[0].textContent.split(" ")[0] as number;
          month = startWeek < endWeek ? "" : monthArr[M === 11 ? 1 : M + 1];
        }
        return `${Y}, ${monthArr[M]} ${startWeek} - ${month} ${endWeek}`;
    }
  };

  /**
   * change week data
   * @param week_type
   * @param type
   * @param year
   * @param month
   */
  const changeWeek = (week_type: string, type: string, year: number, month: number) => {
    const offsets = 604800;
    if (document.getElementsByClassName("rbc-time-header-cell").length > 0) {
      const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
      const firstNode: any = document.getElementsByClassName("rbc-time-header-cell")[0].firstChild;
      const startWeek = firstNode.getElementsByTagName("span")[0].textContent.split(" ")[0] as number;
      debugger;
      const timestampResult =
        type === "preve"
          ? getTimestamp(`${year}-${dateNumFun(month + 1)}-${startWeek}`) - offsets
          : getTimestamp(`${year}-${dateNumFun(month + 1)}-${startWeek}`) + offsets;
      changeTimesTamp({ start: timestampResult, end: timestampResult });
    }
  };

  /**
   *  switch calendar
   * @param type
   */
  const switchData = (type: "preve" | "next") => {
    const timesTampData = new Date(timesTamp.start * 1000);
    const [Y, M] = [(timesTampData as Date).getFullYear(), (timesTampData as Date).getMonth()];

    if (modelYear) {
      const times = type === "preve" ? timesTamp.start - 31536000 : timesTamp.start + 31536000;
      changeTimesTamp({ start: times, end: times });
      return;
    }

    switch (modelView) {
      case "day":
        const times = type === "preve" ? timesTamp.start - 86400 : timesTamp.start + 86400;
        changeTimesTamp({ start: times, end: times });
        break;
      case "month":
        const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
        let offsetYear = 0;
        let offsetMonth = 0;
        if (type === "preve") {
          offsetYear = M === 0 ? Y - 1 : Y;
          offsetMonth = M === 0 ? 11 : M - 1;
        } else {
          offsetYear = M === 11 ? Y + 1 : Y;
          offsetMonth = M === 11 ? 0 : M + 1;
        }
        changeTimesTamp({
          start: getTimestamp(`${offsetYear}-${dateNumFun(offsetMonth + 1)}-01`),
          end: getTimestamp(`${offsetYear}-${dateNumFun(offsetMonth + 1)}-01`),
        });
        dispatch(resetScheduleTimeViewData([]));
        break;
      case "week":
        changeWeek("week", type, Y, M);
        break;
      case "work_week":
        changeWeek("work_week", type, Y, M);
        break;
    }
  };

  /**
   * close Customization template && show delete templates
   */
  const handleDelete = useCallback(
    (scheduleInfo: scheduleInfoViewProps) => {
      const currentTime = Math.floor(new Date().getTime());
      if (scheduleInfo.class_type_label?.id === "Homework" || scheduleInfo.class_type_label?.id === "Task") {
        if (scheduleInfo.due_at !== 0 && scheduleInfo.due_at * 1000 < currentTime) {
          changeModalDate({
            title: "",
            // text: "You cannot delete this event after the due date",
            text: d("You cannot delete this event after the due date. ").t("schedule_msg_delete_due_date"),
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
        if (scheduleInfo.start.valueOf() - currentTime < 15 * 60 * 1000) {
          changeModalDate({
            title: "",
            text: d("You can only delete a class at least 15 minutes before the start time.").t("schedule_msg_delete_minutes"),
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
      if (scheduleInfo.is_repeat) {
        changeModalDate({
          openStatus: true,
          enableCustomization: true,
          customizeTemplate: (
            <ConfilctTestTemplate
              handleDelete={(repeat_edit_options: repeatOptionsType = "only_current") => {
                deleteScheduleByid(repeat_edit_options, scheduleInfo);
              }}
              handleClose={() => {
                changeModalDate({ openStatus: false, enableCustomization: false });
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
              label: d("CANCEL").t("general_button_CANCEL"),
              event: () => {
                changeModalDate({ openStatus: false, enableCustomization: false });
              },
            },
            {
              label: d("DELETE").t("general_button_DELETE"),
              event: () => {
                deleteScheduleByid("only_current", scheduleInfo);
              },
            },
          ],
        });
      }
    },
    [changeModalDate, deleteScheduleByid]
  );

  /**
   * click current schedule
   * @param event
   */
  const scheduleSelected = async (event: scheduleInfoViewProps) => {
    const currentTime = Math.floor(new Date().getTime());
    if (
      ((event.status === "NotStart" || event.status === "Started") && event.start.valueOf() - currentTime < 15 * 60 * 1000) ||
      (permissionShowLive && event.class_type_label?.id === "Homework")
    ) {
      await dispatch(getScheduleLiveToken({ schedule_id: event.id, live_token_type: "live", metaLoading: true }));
    }
    const scheduleInfoView = await getHandleScheduleViewInfo(event.id);
    if (!scheduleInfoView) return;
    changeModalDate({
      enableCustomization: true,
      customizeTemplate: (
        <CustomizeTempalte
          handleDelete={() => {
            handleDelete(event);
          }}
          handleClose={() => {
            changeModalDate({ openStatus: false, enableCustomization: false });
          }}
          scheduleInfo={event}
          toLive={toLive}
          changeModalDate={changeModalDate}
          checkLessonPlan={event.lesson_plan_id !== ""}
          handleChangeHidden={handleChangeHidden}
          isHidden={isHidden}
          refreshView={refreshView}
          ScheduleViewInfo={scheduleInfoView}
          privilegedMembers={privilegedMembers}
        />
      ),
      openStatus: true,
      handleClose: () => {
        changeModalDate({ openStatus: false });
      },
      showScheduleInfo: true,
    });
  };

  const perm = usePermission([PermissionType.view_my_calendar_510, PermissionType.create_schedule_page_501]);

  /**
   * crete schedule
   * @param e
   */
  const creteSchedule = (e: any) => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (getTimestamp(e.start) + 86400 < currentTime || !perm.create_schedule_page_501) return;
    changeTimesTamp({ start: getTimestamp(e.start), end: getTimestamp(e.end) });
    setSpecificStatus(false);
    history.push(`/schedule/calendar/rightside/scheduleTable/model/edit`);
  };

  return (
    <Box className={css.calendarBox}>
      <Box className={css.calendarNav}>
        <ChevronLeftOutlinedIcon
          className={css.chevron}
          onClick={() => {
            switchData("preve");
          }}
        />
        <ChevronRightOutlinedIcon
          className={css.chevron}
          onClick={() => {
            switchData("next");
          }}
        />
        <span style={{ color: "#666666", fontSize: "16px" }}>{getPeriod(timesTamp)}</span>
      </Box>
      {modelYear && <YearCalendar timesTamp={timesTamp} scheduleTimeViewYearData={scheduleTimeViewYearData} />}
      {!modelYear && (
        <Calendar
          date={new Date(timesTamp.start * 1000)}
          onView={() => {}}
          onNavigate={() => {}}
          view={modelView}
          views={views}
          popup={true}
          selectable={true}
          localizer={localizer}
          events={scheduleTimeViewDataFormat(scheduleTimeViewData)}
          startAccessor="start"
          endAccessor="end"
          toolbar={false}
          onSelectEvent={scheduleSelected}
          onSelectSlot={(e) => {
            creteSchedule(e);
          }}
          style={{ height: "100vh" }}
        />
      )}
    </Box>
  );
}

interface CalendarProps {
  modelView: modeViewType;
  timesTamp: timestampType;
  changeTimesTamp: (value: timestampType) => void;
  toLive: () => void;
  changeModalDate: (data: object) => void;
  setSpecificStatus: (value: boolean) => void;
  modelYear: boolean;
  scheduleTimeViewYearData: [];
  handleChangeHidden: (is_hidden: boolean) => void;
  isHidden: boolean;
  getHandleScheduleViewInfo: (schedule_id: string) => Promise<EntityScheduleViewDetail>;
  ScheduleViewInfo: EntityScheduleViewDetail;
  privilegedMembers: (member: memberType) => boolean;
}

export default function KidsCalendar(props: CalendarProps) {
  const {
    modelView,
    timesTamp,
    changeTimesTamp,
    toLive,
    changeModalDate,
    setSpecificStatus,
    modelYear,
    scheduleTimeViewYearData,
    handleChangeHidden,
    isHidden,
    getHandleScheduleViewInfo,
    ScheduleViewInfo,
    privilegedMembers,
  } = props;

  return (
    <MyCalendar
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
  );
}
