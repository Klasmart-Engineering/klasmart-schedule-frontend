import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import events from "../../mocks/events";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import ModalBox from "../../components/ModalBox";

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  calendarBox: {
    boxShadow: shadows[3],
  },
}));

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = momentLocalizer(moment);

function MyCalendar() {
  const css = useStyles();
  const selected = (event: Object) => {
    console.log(event);
  };

  const handleSelect = (e: any) => {
    console.log(e);
  };

  return (
    <Box className={css.calendarBox}>
      <Calendar
        selectable={true}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        toolbar={true}
        onSelectEvent={selected}
        onSelectSlot={(e) => {
          handleSelect(e);
        }}
        style={{ height: "100vh" }}
      />
    </Box>
  );
}

export default function KidsCalendar() {
  return <MyCalendar />;
}
