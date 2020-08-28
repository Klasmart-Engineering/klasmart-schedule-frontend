import { Grid } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router";
import KidsCalendar from "../../components/Calendar";
import LayoutBox from "../../components/LayoutBox";
import ScheduleEdit from "./ScheduleEdit";
import ScheduleTool from "./ScheduleTool";
import SearchList from "./SearchList";
import { useDispatch } from "react-redux";
import { getScheduleTimeViewData } from "../../reducers/schedule";

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
  const timestampInt = (timestamp: number) => Math.floor(timestamp);
  const dispatch = useDispatch();

  /**
   * calendar model view change
   */
  const [modelView, setModelView] = React.useState<string>("month");
  const changeModelView = (event: React.ChangeEvent<{ value: unknown }>) => {
    setModelView(event.target.value as string);
  };

  /**
   * calendar model view change
   */
  const [timesTamp, setTimesTamp] = React.useState<any>({
    start: timestampInt(new Date().getTime() / 1000),
    end: timestampInt(new Date().getTime() / 1000),
  });
  const changeTimesTamp = (times: object) => {
    setTimesTamp(times);
  };

  React.useEffect(() => {
    dispatch(getScheduleTimeViewData({ view_type: modelView, time_at: timesTamp.start }));
  }, [modelView, timesTamp, dispatch]);

  return (
    <>
      <LayoutBox holderMin={40} holderBase={80} mainBase={1920}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ScheduleTool
              includeList={includeList}
              changeModelView={changeModelView}
              modelView={modelView}
              changeTimesTamp={changeTimesTamp}
              timesTamp={timesTamp}
            />
          </Grid>
          <Grid item xs={3}>
            <ScheduleEdit includePreview={includePreview} timesTamp={timesTamp} changeTimesTamp={changeTimesTamp} />
          </Grid>
          <Grid item xs={9}>
            {includeTable && <KidsCalendar modelView={modelView} timesTamp={timesTamp} changeTimesTamp={changeTimesTamp} />}
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
