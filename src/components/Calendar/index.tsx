import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import events from "../../mocks/events";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = momentLocalizer(moment);

function MyCalendar() {
  return (
    <div>
      <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{ height: "88vh" }} />
    </div>
  );
}

export default function KidsCalendar() {
  return <MyCalendar />;
}
