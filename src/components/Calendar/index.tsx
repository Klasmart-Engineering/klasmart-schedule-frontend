import PermissionType from "@api/PermissionType";
import { usePermission } from "@hooks/usePermission";
import { Box, Collapse, useMediaQuery, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import ChevronLeftOutlinedIcon from "@material-ui/icons/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@material-ui/icons/ChevronRightOutlined";
import LiveTvOutlinedIcon from "@material-ui/icons/LiveTvOutlined";
import LocalLibraryOutlinedIcon from "@material-ui/icons/LocalLibraryOutlined";
import SchoolOutlinedIcon from "@material-ui/icons/SchoolOutlined";
import { RootState } from "@reducers/index";
import { actSuccess } from "@reducers/notify";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import "moment/locale/en-au";
import "moment/locale/es";
import "moment/locale/id";
import "moment/locale/ko";
import "moment/locale/th";
import "moment/locale/vi";
import "moment/locale/zh-cn";
import React, { useCallback, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { EntityScheduleTimeView, EntityScheduleViewDetail } from "../../api/api.auto";
import { d, localeManager } from "../../locale/LocaleManager";
import ConfilctTestTemplate from "../../pages/Schedule/ConfilctTestTemplate";
import CustomizeTempalte from "../../pages/Schedule/CustomizeTempalte";
import { getScheduleLiveToken, getScheduleTimeViewData, removeSchedule, resetScheduleTimeViewData } from "../../reducers/schedule";
import { memberType, modeViewType, repeatOptionsType, scheduleInfoViewProps, timestampType } from "../../types/scheduleTypes";
import YearCalendar from "./YearView";
import { Data } from "@dnd-kit/core/dist/store";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@material-ui/icons/KeyboardArrowDownOutlined";

const useStyles = makeStyles(({ shadows }) => ({
  calendarBox: {
    boxShadow: shadows[3],
    marginBottom: "10px",
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
  eventTemplateCalendar: {
    height: "26px",
    borderRadius: "16px",
    borderBottomRightRadius: "12px",
    borderTopRightRadius: "12px",
    position: "relative",
    "& span": {
      position: "absolute",
      top: "1px",
      left: "32px",
      fontWeight: 600,
    },
  },
  eventTemplateIcon: {
    width: "26px",
    height: "26px",
    borderRadius: "26px",
    border: "2px solid white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scheduleListBox: {
    marginBottom: 12,
    "& p": {
      padding: "16px 10px 10px 20px",
      boxShadow: "3px 3px 3px #888888",
      margin: 0,
    },
  },
  scheduleListItem: {
    color: "white",
    height: 36,
    width: "90%",
    display: "flex",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 8,
    marginLeft: "5%",
  },
  filterArrow: {
    float: "left",
    marginRight: 12,
    cursor: "pointer",
    fontSize: 23,
  },
  classTypeMb: {
    width: "18px",
    height: "21px",
  },
  customerEventMb: {
    display: "flex",
    height: "100%",
    width: "100%",
    position: "absolute",
    left: 0,
    paddingLeft: "8px",
    top: 0,
    "& div": {
      marginRight: "6px",
    },
    "& span": {
      marginTop: "2px",
    },
  },
}));

interface ScheduleListProps {
  scheduleTimeViewData: EntityScheduleTimeView[];
  timesTamp: timestampType;
  scheduleSelected: (event: scheduleInfoViewProps) => void;
}

function ScheduleList(props: ScheduleListProps) {
  const css = useStyles();
  const { scheduleTimeViewData, timesTamp, scheduleSelected } = props;
  const [checked, setChecked] = React.useState(false);
  const eventColor = [
    { id: "OnlineClass", color: "#0E78D5", icon: <LiveTvOutlinedIcon style={{ width: "16%" }} /> },
    { id: "OfflineClass", color: "#1BADE5", icon: <SchoolOutlinedIcon style={{ width: "16%" }} /> },
    { id: "Homework", color: "#13AAA9", icon: <LocalLibraryOutlinedIcon style={{ width: "16%" }} /> },
    { id: "Task", color: "#AFBA0A", icon: <AssignmentOutlinedIcon style={{ width: "16%" }} /> },
  ];
  const reBytesStr = (str: string, len: number) => {
    let bytesNum = 0;
    let afterCutting = "";
    for (let i = 0, lens = str.length; i < lens; i++) {
      bytesNum += str.charCodeAt(i) > 255 ? 2 : 1;
      if (bytesNum > len) break;
      afterCutting = str.substring(0, i + 1);
    }
    return bytesNum > len ? `${afterCutting} ....` : afterCutting;
  };

  const textEllipsis = (value?: string) => {
    const CharacterCount = 17;
    return value ? reBytesStr(value, CharacterCount) : "";
  };

  const dateFormat = (timesTamp: number) => {
    const date = new Date(timesTamp * 1000);
    return new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`).getTime() / 1000;
  };

  const isSameDay = () => {
    return scheduleTimeViewData.filter((schedule) => {
      return (
        schedule.start_at! < dateFormat(timesTamp.start) + 86399 &&
        dateFormat(timesTamp.start) < schedule.end_at! &&
        schedule.end_at! - schedule.start_at! > 86398
      );
    });
  };
  const eventTemplate = (schedule: EntityScheduleTimeView) => eventColor.filter((item) => item.id === schedule.class_type);
  const getScheduleInfo = (schedule: EntityScheduleTimeView) => {
    const fullDay =
      schedule.end_at! - schedule.start_at! > 86400
        ? `(DAY ${GetDateDiff(timesTamp.start as number, schedule.start_at as number)}/${GetDateDiff(
            schedule.end_at as number,
            schedule.start_at as number
          )})`
        : "";
    return `${textEllipsis(schedule.title)}  ${fullDay}`;
  };
  const formatDate = (now: Data) => {
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  };
  const GetDateDiff = (timestampStart: number, timestampEnd: number) => {
    const startDate = formatDate(new Date(timestampStart * 1000));
    const endDate = formatDate(new Date(timestampEnd * 1000));
    const startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
    const endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    const dates = Math.floor(startTime - endTime) / (1000 * 60 * 60 * 24);
    return dates + 1;
  };
  const scheduleViewInfo = (info: EntityScheduleTimeView) => {
    scheduleSelected({ ...info, start: new Date(info.start_at! * 1000), end: new Date(info.end_at! * 1000) } as scheduleInfoViewProps);
  };

  React.useEffect(() => {
    setChecked(false);
  }, [timesTamp]);

  const height = isSameDay().length > 3 ? 3 * 43 : isSameDay().length * 43;

  return (
    <Box className={css.scheduleListBox}>
      <Collapse in={checked} style={{ height: height + "px" }} collapsedSize={height}>
        {isSameDay().map((schedule) => {
          return (
            <div
              className={css.scheduleListItem}
              style={{ backgroundColor: eventTemplate(schedule)[0].color }}
              onClick={() => {
                scheduleViewInfo(schedule);
              }}
            >
              {eventTemplate(schedule)[0].icon} {getScheduleInfo(schedule)}
            </div>
          );
        })}
      </Collapse>
      {isSameDay().length > 3 && (
        <p
          onClick={() => {
            setChecked(!checked);
          }}
        >
          <span>
            {checked && <KeyboardArrowUpOutlinedIcon className={css.filterArrow} />}
            {!checked && <KeyboardArrowDownOutlinedIcon className={css.filterArrow} />}
          </span>
          {d("See More").t("schedule_detail_see_more")}
        </p>
      )}
    </Box>
  );
}

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

  const lang = { en: "en-au", zh: "zh-cn", vi: "vi", ko: "ko", id: "id", es: "es", th: "th" };

  // Setup the localizer by providing the moment (or globalize) Object
  // to the correct localizer.
  moment.locale(lang[localeManager.getLocale()!]);
  const localizer = momentLocalizer(moment);

  const deleteScheduleByid = useCallback(
    async (repeat_edit_options: repeatOptionsType = "only_current", scheduleInfo: scheduleInfoViewProps) => {
      await dispatch(removeSchedule({ schedule_id: scheduleInfo.id, repeat_edit_options: { repeat_edit_options: repeat_edit_options } }));
      const { payload } = (await dispatch(
        removeSchedule({ schedule_id: scheduleInfo.id, repeat_edit_options: { repeat_edit_options: repeat_edit_options } })
      )) as unknown as PayloadAction<AsyncTrunkReturned<typeof removeSchedule>>;
      changeModalDate({ openStatus: false, enableCustomization: false });
      if (await payload) {
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

  const perm = usePermission([
    PermissionType.attend_live_class_as_a_student_187,
    PermissionType.view_my_calendar_510,
    PermissionType.create_schedule_page_501,
  ]);
  const permissionShowLive = perm.attend_live_class_as_a_student_187;

  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down(600));

  const scheduleTimeViewDataFormat = useMemo(() => {
    const newViewData: any = [];
    if (scheduleTimeViewData.length > 0) {
      scheduleTimeViewData.forEach((item: EntityScheduleTimeView) => {
        if (!item) return;
        if (item.end_at! - item.start_at! > 86398 && mobile) return;
        newViewData.push({
          ...item,
          end: new Date(Number(item.end_at) * 1000),
          start: new Date(Number(item.start_at) * 1000),
        });
      });
    }
    return newViewData;
  }, [scheduleTimeViewData, mobile]);

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
        if (document.getElementsByClassName("rbc-current-time-indicator").length > 0) {
          const indicator: any = document.getElementsByClassName("rbc-current-time-indicator")[0];
          indicator.style.backgroundColor = "black";
          indicator.style.height = "2px";
          console.log(indicator.firstChild);
          if (!indicator.firstChild) {
            const blackBall = document.createElement("DIV");
            blackBall.style.backgroundColor = "black";
            blackBall.style.width = "10px";
            blackBall.style.height = "10px";
            blackBall.style.borderRadius = "10px";
            blackBall.style.margin = "-4px";
            indicator.appendChild(blackBall);
          }
        }
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
      const conditionByLabel = scheduleInfo.class_type_label?.id === "Homework" || scheduleInfo.class_type_label?.id === "Task";
      const condition = scheduleInfo.class_type === "Homework" || scheduleInfo.class_type === "Task";
      if (conditionByLabel || condition) {
        if (scheduleInfo.due_at !== 0 && scheduleInfo.due_at * 1000 < currentTime) {
          changeModalDate({
            title: "",
            // text: "You cannot delete this event after the due date",
            text: d("You cannot delete this event after the due date.").t("schedule_msg_delete_due_date"),
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
      (permissionShowLive && event.class_type === "Homework")
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

  const eventColor = [
    { id: "OnlineClass", color: "#0E78D5", icon: <LiveTvOutlinedIcon style={{ width: "78%" }} /> },
    { id: "OfflineClass", color: "#1BADE5", icon: <SchoolOutlinedIcon style={{ width: "86%" }} /> },
    { id: "Homework", color: "#13AAA9", icon: <LocalLibraryOutlinedIcon style={{ width: "86%" }} /> },
    { id: "Task", color: "#AFBA0A", icon: <AssignmentOutlinedIcon style={{ width: "86%" }} /> },
  ];

  const eventStyleGetter = (event: any) => {
    const eventTemplate = eventColor.filter((item) => item.id === event.class_type);
    const style = {
      backgroundColor: "white",
      height: "26px",
      padding: 0,
    };
    return {
      style: modelView === "month" ? style : { backgroundColor: eventTemplate[0].color },
    };
  };

  const eventColorMb = [
    { id: "OnlineClass", color: "#0E78D5", icon: <LiveTvOutlinedIcon className={css.classTypeMb} /> },
    { id: "OfflineClass", color: "#1BADE5", icon: <SchoolOutlinedIcon className={css.classTypeMb} /> },
    { id: "Homework", color: "#13AAA9", icon: <LocalLibraryOutlinedIcon className={css.classTypeMb} /> },
    { id: "Task", color: "#AFBA0A", icon: <AssignmentOutlinedIcon className={css.classTypeMb} /> },
  ];

  const CustomEventMonth = (event: any) => {
    const eventTemplate = eventColor.filter((item) => item.id === event.event.class_type);
    return (
      <div className={css.eventTemplateCalendar} style={{ backgroundColor: eventTemplate[0].color }}>
        <div className={css.eventTemplateIcon}>{eventTemplate[0].icon}</div>
        <span>{event.event.title}</span>
      </div>
    );
  };

  const CustomEventDay = (event: any) => {
    const padding = event.event.end_at - event.event.start_at > 3600;
    const eventTemplate = eventColorMb.filter((item) => item.id === event.event.class_type);
    return (
      <div className={css.customerEventMb} style={{ backgroundColor: eventTemplate[0].color, paddingTop: padding ? "8px" : "0px" }}>
        <div>{eventTemplate[0].icon}</div>
        <span>{event.event.title}</span>
      </div>
    );
  };

  return (
    <>
      {modelView === "day" && mobile && (
        <ScheduleList scheduleTimeViewData={scheduleTimeViewData} timesTamp={timesTamp} scheduleSelected={scheduleSelected} />
      )}
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
            events={scheduleTimeViewDataFormat}
            startAccessor="start"
            endAccessor="end"
            toolbar={false}
            onSelectEvent={scheduleSelected}
            onSelectSlot={(e) => {
              creteSchedule(e);
            }}
            style={{ height: "100vh" }}
            eventPropGetter={eventStyleGetter}
            components={{
              event: modelView === "month" ? CustomEventMonth : modelView === "day" ? CustomEventDay : undefined,
            }}
          />
        )}
      </Box>
    </>
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
