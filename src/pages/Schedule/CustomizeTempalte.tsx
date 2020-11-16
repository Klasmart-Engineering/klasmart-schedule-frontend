import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { DeleteOutlined, EditOutlined } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router";
import { Permission, PermissionType } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import ContentPreview from "../ContentPreview";

const useStyles = makeStyles({
  previewContainer: {
    width: "500px",
    height: "260px",
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
});

type scheduleInfoProps = {
  end: Date;
  id: string;
  start: Date;
  title: string;
  lesson_plan_id: string;
  status: string;
  class_type: string;
};

interface InfoProps {
  handleDelete: (scheduleInfo: scheduleInfoProps) => void;
  handleClose: () => void;
  scheduleInfo: scheduleInfoProps;
  toLive: (schedule_id: string) => void;
}

export default function CustomizeTempalte(props: InfoProps) {
  const classes = useStyles();
  const history = useHistory();
  const { handleDelete, handleClose, scheduleInfo, toLive } = props;
  const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
  const weekArr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
    return `${weekArr[W - 1]}, ${monthArr[M]} ${D}, ${Y} ${h}:${m} ${h > 12 ? "PM" : "AM"}`;
  };

  const handleEditSchedule = (): void => {
    handleClose();
    history.push(`/schedule/calendar/rightside/scheduleTable/model/edit?schedule_id=${scheduleInfo.id}`);
  };

  return (
    <div className={classes.previewContainer}>
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
          value={PermissionType.edit_event__530}
          render={(value) => value && <EditOutlined className={classes.firstIcon} onClick={handleEditSchedule} />}
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
      <div className={classes.buttonPart}>
        <Button
          color="primary"
          variant="contained"
          disabled={scheduleInfo.class_type === "Task"}
          href={`#${ContentPreview.routeRedirectDefault}?id=${scheduleInfo.lesson_plan_id}&sid=${scheduleInfo.id}`}
        >
          {d("Preview").t("schedule_button_preview")}
        </Button>
        <Button
          color="primary"
          variant="contained"
          autoFocus
          className={classes.lastButton}
          disabled={scheduleInfo.status !== "NotStart" && scheduleInfo.status !== "Started"}
          onClick={() => {
            handleClose();
            toLive(scheduleInfo.id as string);
          }}
        >
          {d("Go Live").t("schedule_button_go_live")}
        </Button>
      </div>
    </div>
  );
}
