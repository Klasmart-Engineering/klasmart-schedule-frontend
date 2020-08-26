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
  const { modelView } = props;
  const history = useHistory();
  const [openStatus, setOpenStatus] = React.useState(false);

  /**
   * click current schedule
   * @param event
   */
  const scheduleSelected = (event: Object) => {
    setEnableCustomization(true);
    setOpenStatus(true);
  };

  /**
   * crete schedule
   * @param e
   */
  const creteSchedule = (e: any) => {
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

  const [enableCustomization, setEnableCustomization] = React.useState(true);

  const modalDate: any = {
    title: "",
    text: "Are you sure you want to delete this event?",
    openStatus: openStatus,
    enableCustomization: enableCustomization,
    customizeTemplate: <CustomizeTempalte handleDelete={handleDelete} scheduleId={1} handleClose={handleClose} />,
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
          setOpenStatus(false);
        },
      },
    ],
    handleClose: handleClose,
  };

  return (
    <>
      <Box className={css.calendarBox}>
        <Calendar
          onView={() => {}}
          view={modelView}
          selectable={true}
          localizer={localizer}
          events={events}
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

interface CalendarProps {
  modelView: any;
}
export default function KidsCalendar(props: CalendarProps) {
  const { modelView } = props;
  return <MyCalendar modelView={modelView} />;
}
