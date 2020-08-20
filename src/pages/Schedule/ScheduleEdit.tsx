import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

function SmallCalendar() {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date("2014-08-18T21:11:54"));
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <DatePicker autoOk variant="static" openTo="date" value={selectedDate} onChange={handleDateChange} />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

function EditBox() {
  return <div>我是编辑框</div>;
}

export default function ScheduleEdit() {
  return <SmallCalendar />;
}
