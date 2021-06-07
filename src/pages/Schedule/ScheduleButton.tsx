import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { d } from "../../locale/LocaleManager";
import { ScheduleEditExtend, scheduleInfoViewProps, EntityScheduleListViewExtend } from "../../types/scheduleTypes";
import ContentPreview from "../ContentPreview";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editButton: {
      width: "45%",
      textAlign: "center",
    },
    popupButton: {
      width: "160px",
      textAlign: "center",
      marginLeft: "20px",
    },
    anyTimeButton: {
      marginRight: "20px",
    },
  })
);

interface ButtonProps {
  scheduleInfo: scheduleInfoViewProps | ScheduleEditExtend | EntityScheduleListViewExtend;
  templateType: "scheduleEdit" | "schedulePopup" | "scheduleAnyTime";
  handleGoLive: (scheduleDetial: ScheduleEditExtend) => void;
}

function RouterButton(props: ButtonProps) {
  const { scheduleInfo, templateType, handleGoLive } = props;
  const classes = useStyles();
  const buttonClass = {
    scheduleEdit: classes.editButton,
    schedulePopup: classes.popupButton,
    scheduleAnyTime: classes.anyTimeButton,
  };
  return (
    <>
      <Button
        color="primary"
        variant="contained"
        className={buttonClass[templateType]}
        disabled={!scheduleInfo.lesson_plan_id || scheduleInfo.role_type === "Student" || scheduleInfo.class_type === "Task"}
        style={{
          display:
            (scheduleInfo.role_type === "Student" && scheduleInfo.class_type === "Homework") ||
            (scheduleInfo.role_type === "Student" && scheduleInfo.class_type === "OfflineClass")
              ? "none"
              : "block",
        }}
        href={`#${ContentPreview.routeRedirectDefault}?id=${scheduleInfo.lesson_plan_id}&sid=${scheduleInfo.id}&class_id=${scheduleInfo.class_id}`}
      >
        {d("Preview").t("schedule_button_preview")}
      </Button>
      <Button
        color="primary"
        variant="outlined"
        autoFocus
        className={buttonClass[templateType]}
        style={{
          display:
            (scheduleInfo.role_type !== "Student" && scheduleInfo.class_type === "Homework") ||
            (scheduleInfo.role_type === "Student" && scheduleInfo.class_type === "OfflineClass")
              ? "none"
              : "block",
        }}
        disabled={
          (scheduleInfo.status !== "NotStart" && scheduleInfo.status !== "Started") ||
          (scheduleInfo.role_type === "Student" && scheduleInfo.complete_assessment) ||
          !scheduleInfo.lesson_plan_id ||
          !scheduleInfo.lesson_plan?.is_auth
        }
        onClick={() => handleGoLive(scheduleInfo as ScheduleEditExtend)}
      >
        {scheduleInfo.class_type === "Homework" && d("Go Study").t("schedule_button_go_study")}
        {scheduleInfo.class_type === "OfflineClass" && d("Start Class").t("schedule_button_start_class")}
        {scheduleInfo.class_type === "OnlineClass" && d("Go Live").t("schedule_button_go_live")}
      </Button>
    </>
  );
}

export default function ScheduleButton(props: ButtonProps) {
  const { scheduleInfo, templateType, handleGoLive } = props;
  return <RouterButton scheduleInfo={scheduleInfo} templateType={templateType} handleGoLive={handleGoLive} />;
}
