import { makeStyles } from "@material-ui/core";
import { DeleteOutlined, EditOutlined, VisibilityOff } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { apiLivePath } from "../../api/extra";
import { Permission, PermissionType, usePermission } from "../../components/Permission";
import { d, t } from "../../locale/LocaleManager";
import { RootState } from "../../reducers";
import { scheduleShowOption, scheduleUpdateStatus } from "../../reducers/schedule";
import { scheduleInfoViewProps, EntityScheduleShortInfo, memberType, classTypeLabel, ScheduleEditExtend } from "../../types/scheduleTypes";
import Box from "@material-ui/core/Box";
import GetAppIcon from "@material-ui/icons/GetApp";
import { EntityScheduleViewDetail } from "../../api/api.auto";
import { apiResourcePathById } from "../../api/extra";
import ScheduleButton from "./ScheduleButton";

const useStyles = makeStyles({
  previewContainer: {
    width: document.body.clientWidth < 600 ? "99%" : "600px",
    borderRadius: "4px",
    boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 9px 46px 8px rgba(0,0,0,0.12), 0px 24px 38px 3px rgba(0,0,0,0.14)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  date: {
    color: "#666",
  },
  time: {
    fontSize: "18px",
    color: "black",
  },
  iconPart: {
    /*    position: "absolute",
    top: "15px",
    right: "25px",*/
  },
  firstIcon: {
    color: "#0e78d5",
    cursor: "pointer",
  },
  lastIcon: {
    color: "red",
    marginLeft: "25px",
    cursor: "pointer",
  },
  disableLastIcon: {
    color: "gray",
    marginLeft: "25px",
    cursor: "no-drop",
  },
  lastButton: {
    margin: "0 20px !important",
  },
  buttonPart: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "6%",
  },
  checkPlan: {
    color: "#E02020",
    fontWeight: "bold",
    paddingTop: "10px",
    textAlign: "center",
  },
  customizeTitleBox: {
    display: "flex",
    width: "94%",
    height: "2rem",
    boxShadow: "0px 0px 6px gray",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "3%",
    "& span": {
      fontSize: document.body.clientWidth < 600 ? "0.8rem" : "1.4rem",
      fontWeight: "bold",
      width: "68%",
    },
  },
  customizeContentBox: {
    width: "100%",
    maxHeight: document.body.clientWidth < 600 ? "65vh" : "56vh",
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
  contentRow: {
    marginTop: "28px",
    display: "flex",
    "& span": {
      display: "block",
    },
  },
  row: {
    fontWeight: "bold",
    width: document.body.clientWidth < 600 ? "30%" : "18%",
    textAlign: "left",
    fontSize: document.body.clientWidth < 600 ? "0.9rem" : "1.1rem",
    paddingLeft: "8%",
  },
  row2: {
    width: "60%",
    wordBreak: "break-word",
    fontWeight: 500,
    paddingLeft: document.body.clientWidth < 600 ? "38px" : "6%",
    fontSize: document.body.clientWidth < 600 ? "0.8rem" : "1rem",
  },
});

interface InfoProps {
  handleDelete: (scheduleInfo: scheduleInfoViewProps) => void;
  handleClose: () => void;
  scheduleInfo: scheduleInfoViewProps;
  toLive: () => void;
  changeModalDate: (data: object) => void;
  checkLessonPlan: boolean;
  handleChangeHidden: (is_hidden: boolean) => void;
  isHidden: boolean;
  refreshView: (template: string) => void;
  ScheduleViewInfo: EntityScheduleViewDetail;
  privilegedMembers: (member: memberType) => boolean;
}

export default function CustomizeTempalte(props: InfoProps) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    handleDelete,
    handleClose,
    scheduleInfo,
    changeModalDate,
    toLive,
    checkLessonPlan,
    handleChangeHidden,
    isHidden,
    refreshView,
    ScheduleViewInfo,
    privilegedMembers,
  } = props;
  const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
  const weekArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const { liveToken } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const permissionShowLive = usePermission(PermissionType.attend_live_class_as_a_student_187);

  const timestampToTime = (timestamp: number): string => {
    if (!timestamp) return "N/A";
    const timestampDate = new Date(timestamp * 1000);
    const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
    const [Y, M, D, W, h, m] = [
      (timestampDate as Date).getFullYear(),
      (timestampDate as Date).getMonth(),
      (timestampDate as Date).getDate(),
      (timestampDate as Date).getDay(),
      dateNumFun((timestampDate as Date).getHours()),
      dateNumFun((timestampDate as Date).getMinutes()),
    ];
    return `${weekArr[W]}, ${monthArr[M]} ${D}, ${Y} ${h}:${m}`;
  };

  const handleEditSchedule = (scheduleInfo: scheduleInfoViewProps): void => {
    const currentTime = Math.floor(new Date().getTime());
    if (scheduleInfo.class_type_label?.id === "Homework" || scheduleInfo.class_type_label?.id === "Task") {
      if (scheduleInfo.due_at !== 0 && scheduleInfo.due_at * 1000 < currentTime) {
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
    handleClose();
    history.push(`/schedule/calendar/rightside/scheduleTable/model/edit?schedule_id=${scheduleInfo.id}`);
  };

  const handleGoLive = (scheduleInfos: ScheduleEditExtend) => {
    const currentTime = Math.floor(new Date().getTime());
    if (permissionShowLive && scheduleInfo.class_type_label?.id === "Homework") {
      handleClose();
      dispatch(scheduleUpdateStatus({ schedule_id: scheduleInfo.id, status: { status: "Started" } }));
      window.open(apiLivePath(liveToken));
      return;
    }
    if (scheduleInfo.start.valueOf() - currentTime > 15 * 60 * 1000) {
      changeModalDate({
        title: "",
        text: d("You can only start a class 15 minutes before the start time.").t("schedule_msg_start_minutes"),
        openStatus: true,
        enableCustomization: false,
        buttons: [
          {
            label: d("OK").t("schedule_button_ok"),
            event: () => {
              changeModalDate({
                enableCustomization: true,
                customizeTemplate: (
                  <CustomizeTempalte
                    handleDelete={() => {
                      handleDelete(scheduleInfo);
                    }}
                    handleClose={() => {
                      changeModalDate({ openStatus: false, enableCustomization: false });
                    }}
                    scheduleInfo={scheduleInfo}
                    toLive={toLive}
                    changeModalDate={changeModalDate}
                    checkLessonPlan={checkLessonPlan}
                    handleChangeHidden={handleChangeHidden}
                    isHidden={isHidden}
                    refreshView={refreshView}
                    ScheduleViewInfo={ScheduleViewInfo}
                    privilegedMembers={privilegedMembers}
                  />
                ),
                openStatus: true,
                handleClose: () => {
                  changeModalDate({ openStatus: false });
                },
                showScheduleInfo: true,
              });
            },
          },
        ],
        handleClose: () => {
          changeModalDate({ openStatus: false, enableCustomization: false });
        },
      });
      return;
    }

    handleClose();
    dispatch(scheduleUpdateStatus({ schedule_id: scheduleInfo.id, status: { status: "Started" } }));
    window.open(apiLivePath(liveToken));
  };

  const deleteHandle = () => {
    if (scheduleInfo.class_type_label?.id === "Homework" && scheduleInfo.exist_assessment && !scheduleInfo.is_home_fun) {
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
              handleHide();
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

  const handleHide = async () => {
    await dispatch(
      scheduleShowOption({
        schedule_id: scheduleInfo.id as string,
        show_option: { show_option: scheduleInfo.is_hidden ? "visible" : "hidden" },
      })
    );
    handleChangeHidden(!scheduleInfo.is_hidden);
    refreshView(
      scheduleInfo.is_hidden
        ? d("This event is visible again.").t("schedule_msg_visible")
        : d("This event has been hidden").t("schedule_msg_hidden")
    );
    changeModalDate({
      openStatus: false,
    });
  };

  const multiStructure = (item?: EntityScheduleShortInfo[]) => {
    return item?.map((ite: EntityScheduleShortInfo, key: number) => {
      return `${ite.name}${key + 1 < item?.length ? "," : ` (${item.length})`} `;
    });
  };

  const disableDelete = () => {
    if (!scheduleInfo.is_home_fun && scheduleInfo.class_type_label?.id === "Homework") {
      return scheduleInfo.complete_assessment;
    } else {
      return scheduleInfo.status !== "NotStart";
    }
  };

  const showDelete = () => {
    return !scheduleInfo.is_home_fun && scheduleInfo.class_type_label?.id === "Homework"
      ? scheduleInfo.status !== "Closed"
      : scheduleInfo.status === "NotStart";
  };

  return (
    <Box className={classes.previewContainer}>
      <div className={classes.customizeTitleBox}>
        <span>{ScheduleViewInfo.title}</span>
        <div className={classes.iconPart}>
          <EditOutlined className={classes.firstIcon} onClick={() => handleEditSchedule(scheduleInfo)} />
          {scheduleInfo.exist_feedback && scheduleInfo.is_hidden && !privilegedMembers("Student") && (
            <VisibilityOff style={{ color: "#000000" }} onClick={handleHide} className={classes.lastIcon} />
          )}
          {!scheduleInfo.is_hidden && disableDelete() && <DeleteOutlined className={classes.disableLastIcon} />}
          {!scheduleInfo.is_hidden && showDelete() && (
            <Permission
              value={PermissionType.delete_event_540}
              render={(value) =>
                value && (
                  <DeleteOutlined
                    className={classes.lastIcon}
                    onClick={() => {
                      deleteHandle();
                    }}
                  />
                )
              }
            />
          )}
        </div>
      </div>
      {(!ScheduleViewInfo.lesson_plan || !ScheduleViewInfo.lesson_plan?.is_auth) &&
        scheduleInfo.class_type_label?.id !== "Task" &&
        !scheduleInfo.is_home_fun && (
          <p className={classes.checkPlan}>
            {d("Oops! The lesson plan included for this lesson has already been deleted!").t("schedule_msg_recall_lesson_plan")}
          </p>
        )}
      <div className={classes.customizeContentBox}>
        <p className={classes.contentRow}>
          <span className={classes.row}>{d("Description").t("assess_label_description")}</span>
          <span className={classes.row2}>{!ScheduleViewInfo.description ? "N/A" : ScheduleViewInfo.description}</span>
        </p>
        <p className={classes.contentRow}>
          <span className={classes.row}>{d("Class Type").t("schedule_detail_class_type")}</span>
          <span className={classes.row2}>{t(ScheduleViewInfo.class_type?.name as classTypeLabel)}</span>
        </p>
        <p className={classes.contentRow}>
          <span className={classes.row}>{d("Room ID").t("schedule_popup_room_id")}</span>
          <span className={classes.row2}>{ScheduleViewInfo.room_id}</span>
        </p>
        {ScheduleViewInfo.class_type_label?.id !== "Homework" && (
          <>
            <p className={classes.contentRow}>
              <span className={classes.row}>{d("Start Time").t("schedule_detail_start_time")}</span>
              <span className={classes.row2}>{timestampToTime(ScheduleViewInfo.start_at as number)}</span>
            </p>
            <p className={classes.contentRow}>
              <span className={classes.row}>{d("End Time").t("schedule_detail_end_time")}</span>
              <span className={classes.row2}>{timestampToTime(ScheduleViewInfo.end_at as number)}</span>
            </p>
          </>
        )}
        <p className={classes.contentRow}>
          <span className={classes.row}>{d("Class Name").t("assess_detail_class_name")}</span>
          <span className={classes.row2}>{ScheduleViewInfo.class ? ScheduleViewInfo.class?.name : "N/A"}</span>
        </p>
        <p className={classes.contentRow}>
          <span className={classes.row}>{d("Teacher").t("schedule_detail_teacher")}</span>
          <span className={classes.row2}>{multiStructure(ScheduleViewInfo.teachers)}</span>
        </p>
        {!privilegedMembers("Student") && (
          <p className={classes.contentRow}>
            <span className={classes.row}>{d("Student").t("assess_detail_student")}</span>
            <span className={classes.row2}>{multiStructure(ScheduleViewInfo.students)}</span>
          </p>
        )}
        {ScheduleViewInfo.lesson_plan && (
          <p className={classes.contentRow}>
            <span className={classes.row}>{d("Lesson Plan").t("schedule_detail_lesson_plan")}</span>
            <span style={{ width: "60%", wordBreak: "break-word", paddingLeft: document.body.clientWidth < 600 ? "38px" : "6%" }}>
              <div style={{ fontWeight: 500 }}>{ScheduleViewInfo.lesson_plan?.name}</div>
              {ScheduleViewInfo.lesson_plan?.materials?.map((material: EntityScheduleShortInfo) => {
                return <div style={{ marginTop: "10px" }}>{material.name}</div>;
              })}
            </span>
          </p>
        )}
        <p className={classes.contentRow}>
          <span className={classes.row}>{d("Attachment").t("schedule_detail_attachment")}</span>
          <span className={classes.row2} style={{ display: "flex" }}>
            {ScheduleViewInfo.attachment?.id ? (
              <>
                {ScheduleViewInfo.attachment?.name}{" "}
                <GetAppIcon
                  onClick={() => {
                    window.open(`${apiResourcePathById(ScheduleViewInfo.attachment?.id)}`, "_blank");
                  }}
                  style={{ color: "#0E78D5", cursor: "pointer", fontSize: "20px", marginLeft: "10px" }}
                />
              </>
            ) : (
              "N/A"
            )}
          </span>
        </p>
      </div>
      {ScheduleViewInfo.class_type_label?.id !== "Task" && !ScheduleViewInfo.is_home_fun && (
        <div className={classes.buttonPart}>
          <ScheduleButton scheduleInfo={ScheduleViewInfo} templateType="schedulePopup" handleGoLive={handleGoLive} />
        </div>
      )}
    </Box>
  );
}
