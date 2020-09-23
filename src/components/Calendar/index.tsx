import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import React, { useCallback, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import CustomizeTempalte from "../../pages/Schedule/CustomizeTempalte";
import { RootState } from "../../reducers";
import { getScheduleTimeViewData, removeSchedule } from "../../reducers/schedule";
import { timestampType, repeatOptionsType, modeViewType } from "../../types/scheduleTypes";
import ConfilctTestTemplate from "../../pages/Schedule/ConfilctTestTemplate";
import { actSuccess } from "../../reducers/notify";
import { d } from "../../locale/LocaleManager";
import { PayloadAction } from "@reduxjs/toolkit";
import { AsyncTrunkReturned } from "../../reducers/content";

interface scheduleInfoProps {
  end: Date;
  id: string;
  start: Date;
  title: string;
  is_repeat: boolean;
  lesson_plan_id: string;
  status: string;
}

const useStyles = makeStyles(({ shadows }) => ({
  calendarBox: {
    boxShadow: shadows[3],
  },
}));

const views = { work_week: true, day: true, agenda: true, month: true, week: true };

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = momentLocalizer(moment);

function MyCalendar(props: CalendarProps) {
  const css = useStyles();
  const { modelView, timesTamp, changeTimesTamp, toLive, changeModalDate } = props;
  const history = useHistory();
  const [scheduleInfo, setscheduleInfo] = React.useState<scheduleInfoProps>({
    end: new Date(new Date().getTime()),
    id: "",
    start: new Date(new Date().getTime()),
    title: "",
    is_repeat: false,
    lesson_plan_id: "",
    status: "",
  });
  const getTimestamp = (data: string) => new Date(data).getTime() / 1000;
  const { scheduleTimeViewData } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const dispatch = useDispatch();

  const deleteScheduleByid = useCallback(
    async (repeat_edit_options: repeatOptionsType = "only_current") => {
      await dispatch(removeSchedule({ schedule_id: scheduleInfo.id, repeat_edit_options: { repeat_edit_options: repeat_edit_options } }));
      const { payload } = ((await dispatch(
        removeSchedule({ schedule_id: scheduleInfo.id, repeat_edit_options: { repeat_edit_options: repeat_edit_options } })
      )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof removeSchedule>>;
      changeModalDate({ openStatus: false, enableCustomization: false });
      if (payload) {
        dispatch(actSuccess(d("Delete sucessfully").t("schedule_msg_delete_success")));
        dispatch(
          getScheduleTimeViewData({
            view_type: modelView,
            time_at: timesTamp.start,
            time_zone_offset: -new Date().getTimezoneOffset() * 60,
          })
        );
        changeTimesTamp({
          start: Math.floor(new Date().getTime() / 1000),
          end: Math.floor(new Date().getTime() / 1000),
        });
        history.push("/schedule/calendar/rightside/scheduleTable/model/preview");
      }
    },
    [scheduleInfo, changeModalDate, changeTimesTamp, dispatch, history, modelView, timesTamp]
  );

  /**
   * close Customization template && show delete template
   */
  const handleDelete = useCallback(() => {
    if (scheduleInfo.is_repeat) {
      changeModalDate({
        openStatus: true,
        enableCustomization: true,
        customizeTemplate: (
          <ConfilctTestTemplate handleDelete={deleteScheduleByid} handleClose={() => {}} title={d("Delete").t("assess_label_delete")} />
        ),
      });
    } else {
      changeModalDate({
        openStatus: true,
        enableCustomization: false,
        text: d("Are you sure you want to delete this event?").t("schedule_msg_delete"),
        buttons: [
          {
            label: d("Cancel").t("assess_label_cancel"),
            event: () => {
              changeModalDate({ openStatus: false, enableCustomization: false });
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
  }, [scheduleInfo, changeModalDate, deleteScheduleByid]);

  /**
   * click current schedule
   * @param event
   */
  const scheduleSelected = (event: scheduleInfoProps) => {
    if (event.id === scheduleInfo.id) {
      changeModalDate({
        enableCustomization: true,
        customizeTemplate: (
          <CustomizeTempalte handleDelete={handleDelete} handleClose={() => {}} scheduleInfo={scheduleInfo} toLive={toLive} />
        ),
        openStatus: true,
      });
    } else {
      setscheduleInfo(event);
    }
  };

  useEffect(() => {
    changeModalDate({
      enableCustomization: true,
      customizeTemplate: (
        <CustomizeTempalte handleDelete={handleDelete} handleClose={() => {}} scheduleInfo={scheduleInfo} toLive={toLive} />
      ),
      openStatus: true,
    });
  }, [scheduleInfo, handleDelete, toLive, changeModalDate]);

  /**
   * crete schedule
   * @param e
   */
  const creteSchedule = (e: any) => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (getTimestamp(e.start) < currentTime) return;
    changeTimesTamp({ start: getTimestamp(e.start), end: getTimestamp(e.end) });
    history.push(`/schedule/calendar/rightside/scheduleTable/model/edit`);
  };

  return (
    <Box className={css.calendarBox}>
      <Calendar
        date={new Date(timesTamp.start * 1000)}
        onView={() => {}}
        onNavigate={() => {}}
        view={modelView}
        views={views}
        popup={true}
        selectable={true}
        localizer={localizer}
        events={scheduleTimeViewData}
        startAccessor="start"
        endAccessor="end"
        toolbar={false}
        onSelectEvent={scheduleSelected}
        onSelectSlot={(e) => {
          creteSchedule(e);
        }}
        style={{ height: "100vh" }}
      />
    </Box>
  );
}

interface CalendarProps {
  modelView: modeViewType;
  timesTamp: timestampType;
  changeTimesTamp: (value: timestampType) => void;
  toLive: (schedule_id: string) => void;
  changeModalDate: (data: object) => void;
}

export default function KidsCalendar(props: CalendarProps) {
  const { modelView, timesTamp, changeTimesTamp, toLive, changeModalDate } = props;
  return (
    <MyCalendar
      modelView={modelView}
      timesTamp={timesTamp}
      changeTimesTamp={changeTimesTamp}
      toLive={toLive}
      changeModalDate={changeModalDate}
    />
  );
}
