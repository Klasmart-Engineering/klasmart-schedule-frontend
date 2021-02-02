import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { DeleteOutlined, EditOutlined } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { apiLivePath } from "../../api/extra";
import { Permission, PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { RootState } from "../../reducers";
import { scheduleUpdateStatus } from "../../reducers/schedule";
import ContentPreview from "../ContentPreview";

const useStyles = makeStyles({
  previewContainer: {
    width: "500px",
    maxHeight: "300px",
    borderRadius: "4px",
    boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 9px 46px 8px rgba(0,0,0,0.12), 0px 24px 38px 3px rgba(0,0,0,0.14)",
    padding: "20px 30px",
    position: "relative",
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
    position: "absolute",
    top: "15px",
    right: "25px",
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
    textAlign: "right",
    marginTop: "60px",
  },
  checkPlan: {
    color: "#E02020",
    fontWeight: "bold",
    paddingTop: "10px",
  },
});

// type scheduleInfoProps = {
//   end: Date;
//   id: string;
//   start: Date;
//   title: string;
//   lesson_plan_id: string;
//   status: string;
//   class_type: string;
//   class_id: string;
// };

interface scheduleInfoProps {
  end: Date;
  id: string;
  start: Date;
  title: string;
  is_repeat: boolean;
  lesson_plan_id: string;
  status: string;
  class_type: string;
  class_id: string;
  due_at: number;
}

interface InfoProps {
  handleDelete: (scheduleInfo: scheduleInfoProps) => void;
  handleClose: () => void;
  scheduleInfo: scheduleInfoProps;
  toLive: () => void;
  changeModalDate: (data: object) => void;
  checkLessonPlan: boolean;
}

export default function CustomizeTempalte(props: InfoProps) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { handleDelete, handleClose, scheduleInfo, changeModalDate, toLive, checkLessonPlan } = props;
  const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
  const weekArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const { liveToken } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const permissionShowPreview = usePermission(PermissionType.attend_live_class_as_a_teacher_186);
  const permissionShowLive = usePermission(PermissionType.attend_live_class_as_a_student_187);

  const timestampToTime = (timestamp: Date | null): string => {
    const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
    const [Y, M, D, W, h, m] = [
      (timestamp as Date).getFullYear(),
      (timestamp as Date).getMonth(),
      (timestamp as Date).getDate(),
      (timestamp as Date).getDay(),
      dateNumFun((timestamp as Date).getHours()),
      dateNumFun((timestamp as Date).getMinutes()),
    ];
    return `${weekArr[W]}, ${monthArr[M]} ${D}, ${Y} ${h}:${m}`;
  };

  const handleEditSchedule = (scheduleInfo: scheduleInfoProps): void => {
    const currentTime = Math.floor(new Date().getTime());
    if (scheduleInfo.class_type === "Homework" || scheduleInfo.class_type === "Task") {
      if (scheduleInfo.due_at !== 0 && scheduleInfo.due_at * 1000 < currentTime) {
        changeModalDate({
          title: "",
          text: "You cannot edit this event after the due date",
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

  const handleGoLive = (scheduleInfo: scheduleInfoProps) => {
    const currentTime = Math.floor(new Date().getTime());
    if (permissionShowLive && scheduleInfo.class_type === "Homework") {
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
                  />
                ),
                openStatus: true,
                handleClose: () => {
                  changeModalDate({ openStatus: false });
                },
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

  return (
    <div className={classes.previewContainer}>
      {!checkLessonPlan && scheduleInfo.class_type !== "Task" && (
        <p className={classes.checkPlan}>
          {d("Oops! The lesson plan included for this lesson has already been deleted!").t("schedule_msg_recall_lesson_plan")}
        </p>
      )}
      <div>
        <p className={classes.title}>{scheduleInfo.title}</p>
        <p className={classes.date}>
          <span className={classes.time}>{d("Start Time").t("schedule_detail_start_time")}: </span>
          {timestampToTime(scheduleInfo.start)}
        </p>
        <p className={classes.date}>
          <span className={classes.time}>{d("End Time").t("schedule_detail_end_time")}: </span>
          {timestampToTime(scheduleInfo.end)}
        </p>
      </div>
      <div className={classes.iconPart}>
        <Permission
          value={PermissionType.edit_event_530}
          render={(value) => value && <EditOutlined className={classes.firstIcon} onClick={() => handleEditSchedule(scheduleInfo)} />}
        />
        {scheduleInfo.status !== "NotStart" && <DeleteOutlined className={classes.disableLastIcon} />}
        {scheduleInfo.status === "NotStart" && (
          <Permission
            value={PermissionType.delete_event_540}
            render={(value) =>
              value && (
                <DeleteOutlined
                  className={classes.lastIcon}
                  onClick={() => {
                    handleDelete(scheduleInfo);
                  }}
                />
              )
            }
          />
        )}
      </div>
      {scheduleInfo.class_type !== "Task" && (
        <div className={classes.buttonPart}>
          <Button
            color="primary"
            variant="contained"
            disabled={scheduleInfo.class_type === "Task" || !checkLessonPlan}
            style={{ visibility: permissionShowPreview ? "visible" : "hidden" }}
            href={`#${ContentPreview.routeRedirectDefault}?id=${scheduleInfo.lesson_plan_id}&sid=${scheduleInfo.id}&class_id=${scheduleInfo.class_id}`}
          >
            {d("Preview").t("schedule_button_preview")}
          </Button>
          <Button
            color="primary"
            variant="contained"
            autoFocus
            className={classes.lastButton}
            style={{ visibility: permissionShowLive && scheduleInfo.class_type === "OfflineClass" ? "hidden" : "visible" }}
            disabled={
              (scheduleInfo.status !== "NotStart" && scheduleInfo.status !== "Started") ||
              (!permissionShowLive && scheduleInfo.class_type === "Homework") ||
              !checkLessonPlan
            }
            onClick={() => handleGoLive(scheduleInfo)}
          >
            {scheduleInfo.class_type === "Homework" && d("Go Study").t("schedule_button_go_study")}
            {scheduleInfo.class_type === "OfflineClass" && d("Start Class").t("schedule_button_start_class")}
            {scheduleInfo.class_type === "OnlineClass" && d("Go Live").t("schedule_button_go_live")}
          </Button>
        </div>
      )}
    </div>
  );
}
