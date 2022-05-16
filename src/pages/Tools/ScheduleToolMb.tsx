import { Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";
import NativeSelect from "@material-ui/core/NativeSelect";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import React from "react";
import { useHistory } from "react-router";
import PermissionType from "@api/PermissionType";
import { Permission, PermissionsWrapper } from "@components/Permission";
import { d } from "@locale/LocaleManager";
import { modeViewType, timestampType } from "../../types/scheduleTypes";
import { EntityScheduleTimeView } from "@api/api.auto";

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    input: {
      width: "100%",
      borderRadius: 6,
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "10px 26px 10px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segue UI"',
        "Roboto",
        '"Helvetica Neu"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segue UI Emoji"',
        '"Segue UI Symbol"',
      ].join(","),
      "&:focus": {
        borderRadius: 6,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
  })
)(InputBase);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnRadio: {
      borderRadius: "20px",
      height: "46px",
    },
    searchBtn: {
      marginLeft: "12px",
      height: "40px",
    },
    toolBox: {
      padding: "36px 0px 20px 0px",
      [theme.breakpoints.down(600)]: {
        padding: 0,
      },
    },
    arrowLeft: {
      margin: "0px 20px 0px 20px",
      cursor: "pointer",
    },
    selectControl: {
      "& .schedule-MuiNativeSelect-icon": {
        right: "10px",
      },
    },
  })
);

function Tool(props: ToolProps) {
  const css = useStyles();
  const history = useHistory();
  const { includeList, changeTimesTamp, changeModelView, modelView, scheduleId, modelYear } = props;

  const selectToday = (): void => {
    changeTimesTamp({
      start: Math.floor(new Date().getTime() / 1000),
      end: Math.floor(new Date().getTime() / 1000),
    });
  };

  const toolRouter = (place: string = "create"): void => {
    if (place === "create") {
      if (scheduleId) selectToday();
      history.push("/schedule/calendar/rightside/scheduleTable/model/edit");
    } else {
      history.goBack();
    }
  };

  return (
    <Box className={css.toolBox}>
      <Grid container spacing={2} alignItems="center">
        <PermissionsWrapper value={[PermissionType.create_schedule_page_501, PermissionType.schedule_search_582]}>
          <>
            <Grid item xs={12} sm={12} md={3} lg={3} style={{ textAlign: "center" }}>
              {!includeList && (
                <Permission
                  value={PermissionType.create_schedule_page_501}
                  render={(value) =>
                    value && (
                      <Button
                        variant="contained"
                        color="primary"
                        className={css.btnRadio}
                        style={{ width: "50%" }}
                        onClick={() => {
                          toolRouter("create");
                          document.body.scrollTop = document.documentElement.scrollTop = 0;
                          const appDom = document.getElementById("app");
                          const childDom: any = appDom && appDom.firstChild;
                          if (childDom) {
                            childDom.scrollTop = 0;
                          }
                        }}
                      >
                        <span style={{ fontSize: "1.2rem", marginRight: "1rem" }}>+</span>{" "}
                        {d("Schedule Class").t("schedule_button_schedule_class")}
                      </Button>
                    )
                  }
                />
              )}
            </Grid>
            {!includeList && (
              <Grid item xs={12} sm={12} md={5} lg={5} style={{ textAlign: "center" }}>
                <FormControl className={css.selectControl} style={{ width: "68%" }}>
                  <NativeSelect
                    id="demo-customized-select-native"
                    value={modelYear ? "year" : modelView}
                    onChange={changeModelView}
                    input={<BootstrapInput />}
                  >
                    <option value="work_week">{d("Workweek").t("schedule_option_workweek")}</option>
                    <option value="day">{d("Day").t("schedule_option_day")}</option>
                    <option value="week">{d("Week").t("schedule_option_week")}</option>
                    <option value="month">{d("Month").t("schedule_detail_month")}</option>
                    <option value="year">{d("Year").t("schedule_detail_year")}</option>
                  </NativeSelect>
                </FormControl>
                <Button
                  size="large"
                  variant="outlined"
                  color="primary"
                  style={{ margin: "0 0 0 14px", width: "85px" }}
                  onClick={selectToday}
                >
                  {d("Today").t("schedule_button_today")}
                </Button>
              </Grid>
            )}
          </>
        </PermissionsWrapper>
      </Grid>
    </Box>
  );
}

interface CalendarStateProps {
  timesTamp: timestampType;
  changeTimesTamp: (value: timestampType) => void;
}

interface ToolProps extends CalendarStateProps {
  includeList: boolean;
  modelView: modeViewType;
  changeModelView: (event: React.ChangeEvent<{ value: unknown }>) => void;
  scheduleId: string;
  modelYear: boolean;
  scheduleTimeViewData: EntityScheduleTimeView[];
}

export default function ScheduleToolMb(props: ToolProps) {
  const { includeList, timesTamp, changeTimesTamp, changeModelView, modelView, scheduleId, modelYear, scheduleTimeViewData } = props;
  return (
    <Tool
      includeList={includeList}
      changeTimesTamp={changeTimesTamp}
      timesTamp={timesTamp}
      changeModelView={changeModelView}
      modelView={modelView}
      scheduleId={scheduleId}
      modelYear={modelYear}
      scheduleTimeViewData={scheduleTimeViewData}
    />
  );
}
