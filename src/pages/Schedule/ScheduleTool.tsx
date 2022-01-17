import { Grid, useMediaQuery, useTheme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputBase from "@material-ui/core/InputBase";
import NativeSelect from "@material-ui/core/NativeSelect";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import { ArrowBackIosOutlined, SearchOutlined } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import { Permission, PermissionsWrapper } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { modeViewType, timestampType } from "../../types/scheduleTypes";

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
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
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
      "& .MuiNativeSelect-icon": {
        right: "10px",
      },
    },
  })
);

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const name = query.get("name") || "";
  return name;
};

function Tool(props: ToolProps) {
  const css = useStyles();
  const [teacherName, setTeacherName] = React.useState(useQuery());
  const history = useHistory();
  const { includeList, changeTimesTamp, changeModelView, modelView, scheduleId, modelYear } = props;

  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down(600));

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
    } else if (place === "search") {
      if (!teacherName) return;
      history.push(`/schedule/calendar/rightside/scheduleList/model/preview?name=${teacherName}`);
    } else {
      history.goBack();
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13 && event.target.value.trim()) {
      history.push(`/schedule/calendar/rightside/scheduleList/model/preview?name=${teacherName}`);
    }
  };

  return (
    <Box className={css.toolBox}>
      <Grid container spacing={2} alignItems="center">
        <PermissionsWrapper value={[PermissionType.create_schedule_page_501, PermissionType.schedule_search_582]}>
          <>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              {!includeList && !mobile && (
                <Permission
                  value={PermissionType.create_schedule_page_501}
                  render={(value) =>
                    value && (
                      <Button
                        variant="contained"
                        color="primary"
                        className={css.btnRadio}
                        style={{ width: mobile ? "100%" : "160px" }}
                        onClick={() => {
                          toolRouter("create");
                        }}
                      >
                        <span style={{ fontSize: "23px", marginRight: "8px" }}>+</span>
                        {d("Schedule Class").t("schedue_button_schedule_class")}
                      </Button>
                    )
                  }
                />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sm={8}
              md={4}
              lg={4}
              style={{ display: "flex", alignItems: "center", justifyContent: mobile ? "center" : "flex-start" }}
            >
              <Permission
                value={PermissionType.schedule_search_582}
                render={(value) =>
                  value && (
                    <>
                      {includeList && (
                        <ArrowBackIosOutlined
                          className={css.arrowLeft}
                          onClick={() => {
                            toolRouter("create");
                          }}
                        />
                      )}
                      <FormControl style={{ width: mobile ? "68%" : "230px" }}>
                        <BootstrapInput
                          id="demo-customized-textbox"
                          value={teacherName}
                          onChange={(event) => setTeacherName(event.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={d("Search teacher").t("schedule_text_search_teacher")}
                        />
                      </FormControl>
                      <Button
                        variant="contained"
                        color="primary"
                        className={css.searchBtn}
                        startIcon={<SearchOutlined />}
                        onClick={() => {
                          toolRouter("search");
                        }}
                      >
                        {d("Search").t("schedule_button_search")}
                      </Button>
                    </>
                  )
                }
              />
            </Grid>
            {!includeList && !mobile && (
              <Grid item xs={12} sm={12} md={5} lg={5} style={{ textAlign: mobile ? "center" : "right" }}>
                <FormControl className={css.selectControl} style={{ width: mobile ? "68%" : "230px" }}>
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
}

export default function ScheduleTool(props: ToolProps) {
  const { includeList, timesTamp, changeTimesTamp, changeModelView, modelView, scheduleId, modelYear } = props;
  return (
    <Tool
      includeList={includeList}
      changeTimesTamp={changeTimesTamp}
      timesTamp={timesTamp}
      changeModelView={changeModelView}
      modelView={modelView}
      scheduleId={scheduleId}
      modelYear={modelYear}
    />
  );
}
