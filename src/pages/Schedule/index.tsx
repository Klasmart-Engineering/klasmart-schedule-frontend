import React from "react";
import ScheduleTool from "./ScheduleTool";
import ScheduleEdit from "./ScheduleEdit";
import LayoutBox from "../../components/LayoutBox";
import { Grid } from "@material-ui/core";
import KidsCalendar from "../../components/Calendar";
import { useHistory, useParams } from "react-router";
import SearchList from "./SearchList";
import HeaderNavBar from "../MyContentList/HeaderNavBar";

interface RouteParams {
  rightside: "scheduleTable" | "scheduleList";
  model: "edit" | "preview";
}

const parseRightside = (rightside: RouteParams["rightside"]) => ({
  includeTable: rightside.includes("scheduleTable"),
  includeList: rightside.includes("scheduleList"),
});

const parseModel = (model: RouteParams["model"]) => ({
  includeEdit: model.includes("edit"),
  includePreview: model.includes("preview"),
});

function ScheduleContent() {
  const { model, rightside } = useParams();
  const { includeTable, includeList } = parseRightside(rightside);
  const { includeEdit, includePreview } = parseModel(model);

  return (
    <>
      {/* <HeaderNavBar /> */}
      <LayoutBox holderMin={40} holderBase={80} mainBase={1920}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ScheduleTool includeList={includeList} />
          </Grid>
          <Grid item xs={3}>
            <ScheduleEdit includePreview={includePreview} />
          </Grid>
          <Grid item xs={9}>
            {includeTable && <KidsCalendar />}
            {includeList && <SearchList />}
          </Grid>
        </Grid>
      </LayoutBox>
    </>
  );
}

export default function Schedule() {
  return <ScheduleContent />;
}

Schedule.routeBasePath = "/schedule/calendar";
Schedule.routeMatchPath = "/schedule/calendar/rightside/:rightside/model/:model";
Schedule.routeRedirectDefault = "/schedule/calendar/rightside/scheduleTable/model/edit";
