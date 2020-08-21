import React from "react";
import ScheduleTool from "./ScheduleTool";
import ScheduleEdit from "./ScheduleEdit";
import LayoutBox from "../../components/LayoutBox";
import { Grid } from "@material-ui/core";
import KidsCalendar from "../../components/Calendar";

function ScheduleContent() {
  return (
    <LayoutBox holderMin={40} holderBase={80} mainBase={1920}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ScheduleTool />
        </Grid>
        <Grid item xs={3}>
          <ScheduleEdit />
        </Grid>
        <Grid item xs={9}>
          <KidsCalendar />
        </Grid>
      </Grid>
    </LayoutBox>
  );
}

export default function Schedule() {
  return <ScheduleContent />;
}
