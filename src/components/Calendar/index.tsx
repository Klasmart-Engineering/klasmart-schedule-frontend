import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import events from "../../mocks/events";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

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
  return (
    <Box className={css.calendarBox}>
      <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" toolbar={true} style={{ height: "100vh" }} />
    </Box>
  );
}

export default function KidsCalendar() {
  return <MyCalendar />;
}
