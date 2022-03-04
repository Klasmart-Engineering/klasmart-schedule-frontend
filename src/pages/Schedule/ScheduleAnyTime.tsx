import { Box, Button, createStyles, makeStyles, Theme, useMediaQuery, useTheme } from "@material-ui/core";
import { CloseOutlined, DeleteOutlined, EditOutlined, VisibilityOff } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import LocalLibraryOutlinedIcon from "@material-ui/icons/LocalLibraryOutlined";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { EntityScheduleListView } from "../../api/api.auto";
import PermissionType from "../../api/PermissionType";
import AnyTimeNoData from "../../assets/icons/any_time_no_data.png";
import { Permission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { actSuccess } from "../../reducers/notify";
import { getScheduleTimeViewData, removeSchedule, scheduleShowOption } from "../../reducers/schedule";
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
    deleteButton: {
      border: "1px solid red",
      color: "red",
    },
    disabledButton: {
      border: "1px solid gray",
      color: "gray",
    },
    editButton: {
      border: "1px solid #009688",
      color: "#009688",
    },
    previewContainerMb: {
      position: "fixed",
      backgroundColor: "white",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      zIndex: 999,
    },
    lastIcon: {
      color: "red",
      marginLeft: "25px",
      cursor: "pointer",
    },
    previewDetailMb: {
      overflow: "auto",
      marginBottom: "18px",
      paddingRight: "5%",
    },
    eventIcon: {
      fontSize: "25px",
      marginRight: "16px",
    },
    anyTimeTitleMb: {
      display: "flex",
      alignItems: "center",
      color: "#4DA7A8",
      marginTop: "40px",
      fontSize: "15px",
      fontWeight: "bold",
    },
    anyTimeItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px 0 16px 0px",
      justifyContent: "space-between",
    },
  })
);

interface SearchListProps {
  timesTamp: timestampType;
  handleChangeShowAnyTime: (is_show: boolean, name: string, class_id?: string, user_id?: string) => void;
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
    if (scheduleDetial && scheduleDetial.start_at && scheduleDetial.start_at - currentTime > 5 * 60) {
      changeModalDate({
        title: "",
        text: d("You can only start a class 5 minutes before the start time.").t("schedule_msg_start_minutes"),
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
    // let resultInfo: any;
    // resultInfo = await dispatch(
    //   getScheduleLiveToken({ schedule_id: scheduleDetial.id as string, live_token_type: "live", metaLoading: true })
    // );
    // if (resultInfo.payload.token) {
    if (privilegedMembers("Student") && scheduleDetial.class_type_label?.id === "Homework") {
      toLive(scheduleDetial.id);
      // toLive(scheduleDetial.id, resultInfo.payload.token);
      return;
    } else {
      toLive(scheduleDetial.id);
    }
    // toLive(scheduleDetial.id, resultInfo.payload.token);
    // }
  };

  const deleteScheduleByid = useCallback(
    async (repeat_edit_options: repeatOptionsType = "only_current", scheduleInfo: EntityScheduleListView) => {
      await dispatch(
        removeSchedule({
          schedule_id: scheduleInfo.id as string,
          repeat_edit_options: { repeat_edit_options: repeat_edit_options },
        })
      );
      const { payload } = (await dispatch(
        removeSchedule({
          schedule_id: scheduleInfo.id as string,
          repeat_edit_options: { repeat_edit_options: repeat_edit_options },
        })
      )) as unknown as PayloadAction<AsyncTrunkReturned<typeof removeSchedule>>;
      changeModalDate({ openStatus: false, enableCustomization: false });
      if (await payload) {
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
      if (scheduleInfo.class_type_label?.id === "Homework" || scheduleInfo.class_type_label?.id === "Task") {
        if (scheduleInfo.due_at !== 0 && (scheduleInfo.due_at as number) * 1000 < currentTime) {
          changeModalDate({
            title: "",
            // text: "You cannot delete this event after the due date",
            text: d("You cannot delete this event after the due date.").t("schedule_msg_delete_due_date"),
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
        if ((scheduleInfo.start_at as number).valueOf() - currentTime < 5 * 60 * 1000) {
          changeModalDate({
            title: "",
            text: d("You can only delete a class at least 5 minutes before the start time.").t("schedule_msg_delete_minutes"),
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
    if (scheduleInfo.class_type_label?.id === "Homework" || scheduleInfo.class_type_label?.id === "Task") {
      if (scheduleInfo.exist_assessment && !scheduleInfo.is_home_fun) {
        changeModalDate({
          title: "",
          // text: "You cannot edit this event after the due date",
          text: d("This event cannot be edited because some students already made progress for Study activities.").t(
            "schedule_msg_cannot_edit_study"
          ),
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
      if (scheduleInfo.due_at !== 0 && (scheduleInfo.due_at as number) * 1000 < currentTime) {
        changeModalDate({
          title: "",
          // text: "You cannot edit this event after the due date",
          text: d("You cannot edit this event after the due date.").t("schedule_msg_edit_due_date"),
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
    if (scheduleInfo.exist_assessment && !scheduleInfo.is_home_fun) {
      changeModalDate({
        title: "",
        // text: "You cannot edit this event after the due date",
        text: d("This event cannot be deleted because some students already made progress for Study activities.").t(
          "schedule_msg_cannot_delete_study"
        ),
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
    const isScheduleExpiredMulti = (): boolean => {
      if (scheduleInfo.is_home_fun) {
        return scheduleInfo.id ? scheduleInfo.status !== "NotStart" || privilegedMembers("Student") : false;
      } else {
        return scheduleInfo.id ? privilegedMembers("Student") : false;
      }
    };

    return (
      <span>
        {type === "study" && (
          <>
            <ScheduleButton scheduleInfo={scheduleInfo} templateType="scheduleAnyTime" handleGoLive={handleGoLive} />
          </>
        )}
        {showDeleteButto && (
          <Button
            className={
              !scheduleInfo.is_home_fun && scheduleInfo.assessment_status === "complete" ? classes.disabledButton : classes.editButton
            }
            onClick={() => handleEditSchedule(scheduleInfo)}
            variant="outlined"
            color="inherit"
            disabled={!scheduleInfo.is_home_fun && scheduleInfo.assessment_status === "complete"}
          >
            {d("Edit").t("schedule_button_edit")}
          </Button>
        )}
        {!scheduleInfo.is_hidden && !isScheduleExpiredMulti() && (
          <Permission
            value={PermissionType.delete_event_540}
            render={(value) =>
              value && (
                <Button
                  className={
                    !scheduleInfo.is_home_fun && scheduleInfo.assessment_status === "complete"
                      ? classes.disabledButton
                      : classes.deleteButton
                  }
                  style={{ marginLeft: "20px" }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    deleteHandle(scheduleInfo);
                  }}
                  disabled={!scheduleInfo.is_home_fun && scheduleInfo.assessment_status === "complete"}
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

  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down(600));

  const buttonGroupMb = (scheduleInfo: EntityScheduleListView, showDeleteButto: boolean) => {
    const isScheduleExpiredMulti = (): boolean => {
      if (scheduleInfo.is_home_fun) {
        return scheduleInfo.id ? scheduleInfo.status !== "NotStart" || privilegedMembers("Student") : false;
      } else {
        return scheduleInfo.id ? privilegedMembers("Student") : false;
      }
    };
    return (
      <span>
        {showDeleteButto && !(!scheduleInfo.is_home_fun && scheduleInfo.assessment_status === "complete") && (
          <EditOutlined
            style={{ marginRight: "20px" }}
            onClick={() => {
              handleEditSchedule(scheduleInfo);
              if (mobile) {
                handleChangeShowAnyTime(false, "");
              }
            }}
          />
        )}
        {!scheduleInfo.is_hidden && !isScheduleExpiredMulti() && (
          <Permission
            value={PermissionType.delete_event_540}
            render={(value) =>
              value &&
              !(!scheduleInfo.is_home_fun && scheduleInfo.assessment_status === "complete") && (
                <DeleteOutlined
                  onClick={() => {
                    deleteHandle(scheduleInfo);
                  }}
                />
              )
            }
          />
        )}
      </span>
    );
  };

  return mobile ? (
    <ScheduleAnyTimeMb
      timesTamp={timesTamp}
      handleChangeShowAnyTime={handleChangeShowAnyTime}
      scheduleAnyTimeViewData={scheduleAnyTimeViewData}
      privilegedMembers={privilegedMembers}
      changeModalDate={changeModalDate}
      toLive={toLive}
      handleChangeHidden={handleChangeHidden}
      modelView={modelView}
      anyTimeName={anyTimeName}
      anyTimeData={anyTimeData}
      stateCurrentCid={stateCurrentCid}
      handleGoLive={handleGoLive}
      buttonGroupMb={buttonGroupMb}
    />
  ) : (
    <>
      <Box className={classes.listContainer} />
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
            <img src={AnyTimeNoData} style={{ width: "20%", marginTop: "20%" }} alt="" />
            <span>{d("No anytime study is available").t("schedule_msg_no_available")}</span>
          </div>
        )}
        {anyTimeData.study.length > 0 && (
          <div className={classes.itemBox}>
            <p>{d("Anytime Study").t("schedule_any_anytime_study")}</p>
            <Box className={classes.scrollBox}>
              {anyTimeData.study.map((view: EntityScheduleListView) => {
                return (
                  <div key={view.id}>
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
                  <div key={view.id}>
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
    </>
  );
}

interface InfoMbProps extends SearchListProps {
  handleGoLive: (scheduleDetial: EntityScheduleListView) => void;
  anyTimeData: AnyTimeData;
  buttonGroupMb: (scheduleInfo: EntityScheduleListView, showDeleteButto: boolean) => JSX.Element;
}

function ScheduleAnyTimeMb(props: InfoMbProps) {
  const classes = useStyles();
  const { handleChangeShowAnyTime, anyTimeName, handleGoLive, anyTimeData, buttonGroupMb } = props;
  const previewDetailMbHeight = () => {
    const offset = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    return `${window.innerHeight - (offset ? 218 : 110)}px`;
  };

  return (
    <Box className={classes.previewContainerMb}>
      <div style={{ textAlign: "end", padding: "4.6%" }}>
        <CloseOutlined
          className={classes.lastIcon}
          style={{ color: "#000000" }}
          onClick={() => {
            handleChangeShowAnyTime(false, "");
          }}
        />
      </div>
      <div style={{ paddingLeft: "8%", paddingRight: "1%" }}>
        <h2 style={{ margin: 0 }}>{anyTimeName}</h2>
        <div className={classes.previewDetailMb} style={{ height: previewDetailMbHeight() }}>
          <div className={classes.anyTimeTitleMb}>
            <LocalLibraryOutlinedIcon className={classes.eventIcon} /> {d("Anytime Study").t("schedule_any_anytime_study")}
          </div>
          {anyTimeData.study.map((view: EntityScheduleListView) => {
            return (
              <div key={view.id} style={{ marginBottom: "18px" }}>
                <div className={classes.anyTimeItem}>
                  <span style={{ fontSize: "17px", color: "#666666", fontWeight: 600 }}>{view.title} </span>
                  {buttonGroupMb(view, true)}
                </div>
                <div style={{ display: "flex" }}>
                  <ScheduleButton scheduleInfo={view} templateType="scheduleAnyTime" handleGoLive={handleGoLive} />
                </div>
              </div>
            );
          })}
          <div className={classes.anyTimeTitleMb}>
            <LocalLibraryOutlinedIcon className={classes.eventIcon} /> {d("Anytime Study").t("schedule_any_anytime_study")}-{" "}
            {d("Home Fun").t("schedule_checkbox_home_fun")}
          </div>
          {anyTimeData.homeFun.map((view: EntityScheduleListView) => {
            return (
              <div key={view.id}>
                <div className={classes.anyTimeItem}>
                  <span style={{ fontSize: "17px", color: "#666666", fontWeight: 600 }}>{view.title} </span>
                  {buttonGroupMb(view, true)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
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

  return (
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
  );
}
