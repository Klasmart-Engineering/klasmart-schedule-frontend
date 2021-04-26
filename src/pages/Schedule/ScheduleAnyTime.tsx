import { Box, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import { VisibilityOff } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { EntityScheduleListView } from "../../api/api.auto";
import AnyTimeNoData from "../../assets/icons/any_time_no_data.png";
import { Permission, PermissionType } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { AsyncTrunkReturned } from "../../reducers/content";
import { actSuccess } from "../../reducers/notify";
import { getScheduleLiveToken, getScheduleTimeViewData, removeSchedule, scheduleShowOption } from "../../reducers/schedule";
import { memberType, modeViewType, repeatOptionsType, timestampType } from "../../types/scheduleTypes";
import ConfilctTestTemplate from "./ConfilctTestTemplate";
import ScheduleButton from "./ScheduleButton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "black",
      zIndex: 999,
      opacity: 0.6,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    scrollBox: {
      display: "flex",
      flexDirection: "column",
      maxHeight: "230px",
      overflow: "auto",
      "&::-webkit-scrollbar": {
        width: "3px",
      },
      "&::-webkit-scrollbar-track": {
        boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
      },
      "&::-webkit-scrollbar-thumb": {
        borderRadius: "3px",
        backgroundColor: "rgb(220, 220, 220)",
        boxShadow: "inset 0 0 3px rgba(0,0,0,0.5)",
      },
      "&::-webkit-scrollbar-thumb:window-inactive": {
        backgroundColor: "rgba(220,220,220,0.4)",
      },
    },
    anyTimeBox: {
      width: "80%",
      height: "700px",
      position: "absolute",
      backgroundColor: "white",
      zIndex: 999,
      left: "11%",
      top: "16%",
    },
    anyTimeTitle: {
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "1px solid #eeeeee",
      padding: "8px 16px 24px 20px",
      "& span": {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    itemBox: {
      padding: "0px 30px 0px 30px",
      "& p": {
        fontSize: "16px",
        fontWeight: "bold",
        padding: "10px 0px 0px 30px",
      },
      "& div": {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px 10px 50px",
        "& span": {
          display: "flex",
        },
      },
    },
  })
);

interface SearchListProps {
  timesTamp: timestampType;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id?: string) => void;
  scheduleAnyTimeViewData: EntityScheduleListView[];
  privilegedMembers: (member: memberType) => boolean;
  toLive: (schedule_id?: string, token?: string) => void;
  changeModalDate: (data: object) => void;
  handleChangeHidden: (is_hidden: boolean) => void;
  modelView: modeViewType;
  anyTimeName: string;
  stateCurrentCid: string;
}

interface AnyTimeData {
  study: EntityScheduleListView[];
  homeFun: EntityScheduleListView[];
}

function AnyTimeSchedule(props: SearchListProps) {
  const classes = useStyles();
  const {
    handleChangeShowAnyTime,
    scheduleAnyTimeViewData,
    privilegedMembers,
    toLive,
    changeModalDate,
    handleChangeHidden,
    timesTamp,
    modelView,
    anyTimeName,
    stateCurrentCid,
  } = props;
  const [anyTimeData, setAnyTimeData] = React.useState<AnyTimeData>({ homeFun: [], study: [] });
  const dispatch = useDispatch();
  const history = useHistory();

  React.useEffect(() => {
    if (scheduleAnyTimeViewData) {
      const study: EntityScheduleListView[] = [];
      const homeFun: EntityScheduleListView[] = [];
      scheduleAnyTimeViewData.forEach((view: EntityScheduleListView) => {
        if (view.is_home_fun) {
          homeFun.push(view);
        } else {
          study.push(view);
        }
      });
      setAnyTimeData({ study, homeFun });
    }
  }, [scheduleAnyTimeViewData]);

  const handleGoLive = async (scheduleDetial: EntityScheduleListView) => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (scheduleDetial && scheduleDetial.start_at && scheduleDetial.start_at - currentTime > 15 * 60) {
      changeModalDate({
        title: "",
        text: d("You can only start a class 15 minutes before the start time.").t("schedule_msg_start_minutes"),
        openStatus: true,
        enableCustomization: false,
        buttons: [
          {
            label: d("OK").t("schedule_button_ok"),
            event: () => {
              changeModalDate({ openStatus: false, enableCustomization: false });
            },
          },
        ],
        handleClose: () => {
          changeModalDate({ openStatus: false, enableCustomization: false });
        },
      });
      return;
    }
    let resultInfo: any;
    resultInfo = await dispatch(
      getScheduleLiveToken({ schedule_id: scheduleDetial.id as string, live_token_type: "live", metaLoading: true })
    );
    if (resultInfo.payload.token) {
      if (privilegedMembers("Student") && scheduleDetial.class_type === "Homework") {
        toLive(scheduleDetial.id, resultInfo.payload.token);
        return;
      }
      toLive(scheduleDetial.id, resultInfo.payload.token);
    }
  };

  const deleteScheduleByid = useCallback(
    async (repeat_edit_options: repeatOptionsType = "only_current", scheduleInfo: EntityScheduleListView) => {
      await dispatch(
        removeSchedule({ schedule_id: scheduleInfo.id as string, repeat_edit_options: { repeat_edit_options: repeat_edit_options } })
      );
      const { payload } = ((await dispatch(
        removeSchedule({ schedule_id: scheduleInfo.id as string, repeat_edit_options: { repeat_edit_options: repeat_edit_options } })
      )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof removeSchedule>>;
      changeModalDate({ openStatus: false, enableCustomization: false });
      if (payload) {
        dispatch(actSuccess(d("Deleted sucessfully").t("schedule_msg_delete_success")));
        dispatch(
          getScheduleTimeViewData({
            view_type: modelView,
            time_at: timesTamp.start,
            time_zone_offset: -new Date().getTimezoneOffset() * 60,
          })
        );
        await handleChangeShowAnyTime(true, anyTimeName, stateCurrentCid);
        history.push("/schedule/calendar/rightside/scheduleTable/model/preview");
      }
    },
    [handleChangeShowAnyTime, anyTimeName, stateCurrentCid, changeModalDate, dispatch, history, modelView, timesTamp]
  );

  /**
   * close Customization template && show delete templates
   */
  const handleDelete = useCallback(
    (scheduleInfo: EntityScheduleListView) => {
      const currentTime = Math.floor(new Date().getTime());
      if (scheduleInfo.class_type === "Homework" || scheduleInfo.class_type === "Task") {
        if (scheduleInfo.due_at !== 0 && (scheduleInfo.due_at as number) * 1000 < currentTime) {
          changeModalDate({
            title: "",
            // text: "You cannot delete this event after the due date",
            text: d("You cannot delete this event after the due date. ").t("schedule_msg_delete_due_date"),
            openStatus: true,
            enableCustomization: false,
            buttons: [
              {
                label: d("OK").t("schedule_button_ok"),
                event: () => {
                  changeModalDate({ openStatus: false, enableCustomization: false });
                },
              },
            ],
            handleClose: () => {
              changeModalDate({ openStatus: false, enableCustomization: false });
            },
          });
          return;
        }
      } else {
        if ((scheduleInfo.start_at as number).valueOf() - currentTime < 15 * 60 * 1000) {
          changeModalDate({
            title: "",
            text: d("You can only delete a class at least 15 minutes before the start time.").t("schedule_msg_delete_minutes"),
            openStatus: true,
            enableCustomization: false,
            buttons: [
              {
                label: d("OK").t("schedule_button_ok"),
                event: () => {
                  changeModalDate({ openStatus: false, enableCustomization: false });
                },
              },
            ],
            handleClose: () => {
              changeModalDate({ openStatus: false, enableCustomization: false });
            },
          });
          return;
        }
      }
      if (scheduleInfo.is_repeat) {
        changeModalDate({
          openStatus: true,
          enableCustomization: true,
          customizeTemplate: (
            <ConfilctTestTemplate
              handleDelete={(repeat_edit_options: repeatOptionsType = "only_current") => {
                deleteScheduleByid(repeat_edit_options, scheduleInfo);
              }}
              handleClose={() => {
                changeModalDate({ openStatus: false, enableCustomization: false });
              }}
              title={d("Delete").t("assess_label_delete")}
            />
          ),
        });
      } else {
        changeModalDate({
          openStatus: true,
          enableCustomization: false,
          text: d("Are you sure you want to delete this event?").t("schedule_msg_delete"),
          buttons: [
            {
              label: d("CANCEL").t("general_button_CANCEL"),
              event: () => {
                changeModalDate({ openStatus: false, enableCustomization: false });
              },
            },
            {
              label: d("DELETE").t("general_button_DELETE"),
              event: () => {
                deleteScheduleByid("only_current", scheduleInfo);
              },
            },
          ],
        });
      }
    },
    [changeModalDate, deleteScheduleByid]
  );

  const refreshView = useCallback(
    async (template: string) => {
      dispatch(actSuccess(template));
      await handleChangeShowAnyTime(true, anyTimeName, stateCurrentCid);
    },
    [dispatch, handleChangeShowAnyTime, anyTimeName, stateCurrentCid]
  );

  const handleHide = async (scheduleInfo: EntityScheduleListView) => {
    await dispatch(
      scheduleShowOption({
        schedule_id: scheduleInfo.id as string,
        show_option: { show_option: scheduleInfo.is_hidden ? "visible" : "hidden" },
      })
    );
    handleChangeHidden(!scheduleInfo.is_hidden);
    changeModalDate({
      openStatus: false,
    });
    refreshView(
      scheduleInfo.is_hidden
        ? d("This event is visible again.").t("schedule_msg_visible")
        : d("This event has been hidden").t("schedule_msg_hidden")
    );
  };

  const handleEditSchedule = (scheduleInfo: EntityScheduleListView): void => {
    const currentTime = Math.floor(new Date().getTime());
    if (scheduleInfo.class_type === "Homework" || scheduleInfo.class_type === "Task") {
      if (scheduleInfo.due_at !== 0 && (scheduleInfo.due_at as number) * 1000 < currentTime) {
        changeModalDate({
          title: "",
          // text: "You cannot edit this event after the due date",
          text: d("You cannot edit this event after the due date. ").t("schedule_msg_edit_due_date"),
          openStatus: true,
          enableCustomization: false,
          buttons: [
            {
              label: d("OK").t("schedule_button_ok"),
              event: () => {
                changeModalDate({ openStatus: false, enableCustomization: false });
              },
            },
          ],
          handleClose: () => {
            changeModalDate({ openStatus: false, enableCustomization: false });
          },
        });
        return;
      }
    }
    history.push(`/schedule/calendar/rightside/scheduleTable/model/edit?schedule_id=${scheduleInfo.id}`);
  };

  const deleteHandle = (scheduleInfo: EntityScheduleListView) => {
    if (scheduleInfo.exist_feedback) {
      changeModalDate({
        title: "",
        text: d("This event cannot be deleted because assignments have already been uploaded. Do you want to hide it instead?").t(
          "schedule_msg_hide"
        ),
        openStatus: true,
        enableCustomization: false,
        buttons: [
          {
            label: d("CANCEL").t("schedule_button_cancel"),
            event: () => {
              changeModalDate({
                openStatus: false,
              });
            },
          },
          {
            label: d("OK").t("schedule_button_ok"),
            event: () => {
              handleHide(scheduleInfo);
            },
          },
        ],
        handleClose: () => {
          changeModalDate({ openStatus: false, enableCustomization: false });
        },
      });
    } else {
      handleDelete(scheduleInfo);
    }
  };

  const buttonGroup = (type: string, scheduleInfo: EntityScheduleListView, showDeleteButto: boolean) => {
    return (
      <span>
        {type === "study" && (
          <>
            <ScheduleButton scheduleInfo={scheduleInfo} templateType="scheduleAnyTime" handleGoLive={handleGoLive} />
          </>
        )}
        {showDeleteButto && (
          <Button
            style={{ border: "1px solid #009688", color: "#009688" }}
            onClick={() => handleEditSchedule(scheduleInfo)}
            variant="outlined"
            color="inherit"
          >
            {d("Edit").t("schedule_button_edit")}
          </Button>
        )}
        {!scheduleInfo.is_hidden && scheduleInfo.status === "NotStart" && scheduleInfo.role_type !== "Student" && (
          <Permission
            value={PermissionType.delete_event_540}
            render={(value) =>
              value && (
                <Button
                  style={{ marginLeft: "20px", border: "1px solid red", color: "red" }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    deleteHandle(scheduleInfo);
                  }}
                >
                  {d("Delete").t("assess_label_delete")}
                </Button>
              )
            }
          />
        )}
      </span>
    );
  };

  return (
    <Box className={classes.anyTimeBox}>
      <p className={classes.anyTimeTitle}>
        <span>
          {d("View Anytime Study").t("schedule_filter_view_any_time_study")} - {anyTimeName}
        </span>
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleChangeShowAnyTime(false, "");
          }}
        />
      </p>
      {anyTimeData.study.length < 1 && anyTimeData.homeFun.length < 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <img src={AnyTimeNoData} style={{ width: "50%" }} alt="" />
          <span>{d("No anytime study is available ").t("schedule_msg_no_available")}</span>
        </div>
      )}
      {anyTimeData.study.length > 0 && (
        <div className={classes.itemBox}>
          <p>{d("Anytime Study").t("schedule_any_anytime_study")}</p>
          <Box className={classes.scrollBox}>
            {anyTimeData.study.map((view: EntityScheduleListView) => {
              return (
                <div>
                  <span>{view.title} </span>
                  {buttonGroup("study", view, !privilegedMembers("Student"))}
                </div>
              );
            })}
          </Box>
        </div>
      )}
      {anyTimeData.homeFun.length > 0 && (
        <div className={classes.itemBox}>
          <p>
            {d("Anytime Study").t("schedule_any_anytime_study")}- {d("Home Fun").t("schedule_checkbox_home_fun")}
          </p>
          <Box className={classes.scrollBox}>
            {anyTimeData.homeFun.map((view: EntityScheduleListView) => {
              return (
                <div>
                  <span>
                    {view.title}{" "}
                    {view.exist_feedback && view.is_hidden && (
                      <VisibilityOff
                        style={{ color: "#000000", marginLeft: "10px", cursor: "pointer" }}
                        onClick={() => {
                          handleHide(view);
                        }}
                      />
                    )}
                  </span>
                  {buttonGroup("home_fun", view, true)}
                </div>
              );
            })}
          </Box>
        </div>
      )}
    </Box>
  );
}

export default function ScheduleAnyTime(props: SearchListProps) {
  const {
    handleChangeShowAnyTime,
    scheduleAnyTimeViewData,
    privilegedMembers,
    toLive,
    changeModalDate,
    handleChangeHidden,
    modelView,
    timesTamp,
    anyTimeName,
    stateCurrentCid,
  } = props;
  const classes = useStyles();
  return (
    <>
      <Box className={classes.listContainer} />
      <AnyTimeSchedule
        timesTamp={timesTamp}
        handleChangeShowAnyTime={handleChangeShowAnyTime}
        scheduleAnyTimeViewData={scheduleAnyTimeViewData}
        privilegedMembers={privilegedMembers}
        changeModalDate={changeModalDate}
        toLive={toLive}
        handleChangeHidden={handleChangeHidden}
        modelView={modelView}
        anyTimeName={anyTimeName}
        stateCurrentCid={stateCurrentCid}
      />
    </>
  );
}
