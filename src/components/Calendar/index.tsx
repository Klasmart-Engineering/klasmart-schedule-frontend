import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import ModalBox from "../../components/ModalBox";
import CustomizeTempalte from "../../pages/Schedule/CustomizeTempalte";
import { RootState } from "../../reducers";
import { getScheduleTimeViewData, removeSchedule } from "../../reducers/schedule";
import { timestampType, repeatOptionsType } from "../../types/scheduleTypes";
import ConfilctTestTemplate from "../../pages/Schedule/ConfilctTestTemplate";

interface scheduleInfoProps {
  end: Date;
  id: string;
  start: Date;
  title: string;
  is_repeat: boolean;
  lesson_plan_id: string;
}

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
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
  const { modelView, timesTamp, changeTimesTamp } = props;
  const history = useHistory();
  const [openStatus, setOpenStatus] = React.useState(false);
  const [scheduleInfoStatus, setScheduleInfoStatus] = React.useState(true);
  const [scheduleInfo, setscheduleInfo] = React.useState<scheduleInfoProps>({
    end: new Date(new Date().getTime()),
    id: "",
    start: new Date(new Date().getTime()),
    title: "",
    is_repeat: false,
    lesson_plan_id: "",
  });
  const getTimestamp = (data: string) => new Date(data).getTime() / 1000;
  const { scheduleTimeViewData } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const dispatch = useDispatch();

  /**
   * click current schedule
   * @param event
   */
  const scheduleSelected = (event: scheduleInfoProps) => {
    setscheduleInfo(event);
    setEnableCustomization(true);
    setOpenStatus(true);
  };

  /**
   * crete schedule
   * @param e
   */
  const creteSchedule = (e: any) => {
    changeTimesTamp({ start: getTimestamp(e.start), end: getTimestamp(e.end) });
    history.push(`/schedule/calendar/rightside/scheduleTable/model/edit`);
  };

  /**
   * close popup box
   */
  const handleClose = () => {
    setOpenStatus(false);
    setTimeout(() => {
      setScheduleInfoStatus(true);
    }, 200);
  };

  /**
   * close Customization template && show delete template
   */
  const handleDelete = () => {
    if (scheduleInfo.is_repeat) {
      setScheduleInfoStatus(false);
    } else {
      setEnableCustomization(false);
    }
  };

  const deleteScheduleByid = async (repeat_edit_options: repeatOptionsType = "only_current") => {
    await dispatch(removeSchedule({ schedule_id: scheduleInfo.id, repeat_edit_options: { repeat_edit_options: repeat_edit_options } }));
    dispatch(getScheduleTimeViewData({ view_type: modelView, time_at: timesTamp.start.toString() }));
    changeTimesTamp({
      start: Math.floor(new Date().getTime() / 1000),
      end: Math.floor(new Date().getTime() / 1000),
    });
    setOpenStatus(false);
    history.push("/schedule/calendar/rightside/scheduleTable/model/preview");
  };

  const [enableCustomization, setEnableCustomization] = React.useState(true);

  const modalDate: any = {
    title: "",
    text: "Are you sure you want to delete this event?",
    openStatus: openStatus,
    enableCustomization: enableCustomization,
    customizeTemplate: scheduleInfoStatus ? (
      <CustomizeTempalte handleDelete={handleDelete} handleClose={handleClose} scheduleInfo={scheduleInfo} />
    ) : (
      <ConfilctTestTemplate handleDelete={deleteScheduleByid} handleClose={handleClose} title="Delete" />
    ),
    buttons: [
      {
        label: "Cancel",
        event: () => {
          setOpenStatus(false);
        },
      },
      {
        label: "Delete",
        event: () => {
          deleteScheduleByid();
        },
      },
    ],
    handleClose: handleClose,
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
      <ModalBox modalDate={modalDate} />
    </Box>
  );
}

interface CalendarProps {
  modelView: any;
  timesTamp: timestampType;
  changeTimesTamp: (value: timestampType) => void;
}
export default function KidsCalendar(props: CalendarProps) {
  const { modelView, timesTamp, changeTimesTamp } = props;
  return <MyCalendar modelView={modelView} timesTamp={timesTamp} changeTimesTamp={changeTimesTamp} />;
}
