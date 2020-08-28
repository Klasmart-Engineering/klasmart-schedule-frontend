import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useHistory } from "react-router";
import ModalBox from "../../components/ModalBox";
import events from "../../mocks/events";
import CustomizeTempalte from "../../pages/Schedule/CustomizeTempalte";
import { removeSchedule } from "../../reducers/schedule";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";

interface scheduleInfoProps {
  end: Date;
  id: string;
  start: Date;
  title: string;
}

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  calendarBox: {
    boxShadow: shadows[3],
  },
}));

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = momentLocalizer(moment);

function MyCalendar(props: CalendarProps) {
  const css = useStyles();
  const { modelView, timesTamp, changeTimesTamp } = props;
  const history = useHistory();
  const [openStatus, setOpenStatus] = React.useState(false);
  const [scheduleInfo, setscheduleInfo] = React.useState<scheduleInfoProps>({
    end: new Date(new Date().getTime()),
    id: "",
    start: new Date(new Date().getTime()),
    title: "",
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
  };

  /**
   * close Customization template && show delete template
   */
  const handleDelete = () => {
    setEnableCustomization(false);
  };

  const deleteScheduleByid = () => {
    dispatch(removeSchedule("1"));
    setOpenStatus(false);
  };

  const [enableCustomization, setEnableCustomization] = React.useState(true);

  const modalDate: any = {
    title: "",
    text: "Are you sure you want to delete this event?",
    openStatus: openStatus,
    enableCustomization: enableCustomization,
    customizeTemplate: (
      <CustomizeTempalte handleDelete={handleDelete} scheduleId={1} handleClose={handleClose} scheduleInfo={scheduleInfo} />
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
    <>
      <Box className={css.calendarBox}>
        <Calendar
          date={new Date(timesTamp.start * 1000)}
          onView={() => {}}
          onNavigate={() => {}}
          view={modelView}
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
    </>
  );
}

interface timesTampType {
  start: number;
  end: number;
}

interface CalendarProps {
  modelView: any;
  timesTamp: timesTampType;
  changeTimesTamp: (value: object) => void;
}
export default function KidsCalendar(props: CalendarProps) {
  const { modelView, timesTamp, changeTimesTamp } = props;
  return <MyCalendar modelView={modelView} timesTamp={timesTamp} changeTimesTamp={changeTimesTamp} />;
}
