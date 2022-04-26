import { Button, createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { d } from "@locale/LocaleManager";
import {
  ScheduleEditExtend,
  scheduleInfoViewProps,
  EntityScheduleListViewExtend,
  EntityScheduleViewDetailExtend,
} from "../../types/scheduleTypes";
import { apiOrganizationOfPage } from "../../../src/api/extra";

const useStyles = makeStyles(() =>
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
  scheduleInfo: scheduleInfoViewProps | ScheduleEditExtend | EntityScheduleListViewExtend | EntityScheduleViewDetailExtend;
  templateType: "scheduleEdit" | "schedulePopup" | "scheduleAnyTime";
  handleGoLive: (scheduleDetail: ScheduleEditExtend) => void;
  handleClose?: () => void;
}

function RouterButton(props: ButtonProps) {
  const { scheduleInfo, templateType, handleGoLive, handleClose } = props;
  const classes = useStyles();
  const buttonClass = {
    scheduleEdit: classes.editButton,
    schedulePopup: classes.popupButton,
    scheduleAnyTime: classes.anyTimeButton,
  };
  const disabled = () => {
    return (
      (scheduleInfo.status !== "NotStart" && scheduleInfo.status !== "Started") ||
      (scheduleInfo.role_type === "Student" && scheduleInfo.assessment_status === "complete") ||
      !scheduleInfo.lesson_plan_id ||
      scheduleInfo.lesson_plan?.is_auth === false
    );
  };
  return (
    <>
      <Button
        color="primary"
        variant="contained"
        className={buttonClass[templateType]}
        disabled={
          !scheduleInfo.lesson_plan_id ||
          scheduleInfo.lesson_plan?.is_auth === false ||
          scheduleInfo.role_type === "Student" ||
          (scheduleInfo.class_type_label?.id ?? scheduleInfo.class_type) === "Task"
        }
        style={{
          display:
            (scheduleInfo.role_type === "Student" && (scheduleInfo.class_type_label?.id ?? scheduleInfo.class_type) === "Homework") ||
            (scheduleInfo.role_type === "Student" && (scheduleInfo.class_type_label?.id ?? scheduleInfo.class_type) === "OfflineClass") ||
            scheduleInfo.is_review
              ? "none"
              : "block",
          backgroundColor: "#E4F1FF",
          color: "#0E78D5",
          border: "1px solid #ADC5E0",
          boxShadow: "none",
        }}
        onClick={() => {
          window.open(
            `https://${process.env.REACT_APP_BASE_DOMAIN}/?org_id=${apiOrganizationOfPage()}#/library/content-preview/tab/details?id=${
              scheduleInfo.lesson_plan_id
            }&sid=${scheduleInfo.id}&class_id=${scheduleInfo.class_id}`
          );
        }}
      >
        {d("Preview").t("schedule_button_preview")}
      </Button>
      <Button
        color="primary"
        variant="outlined"
        autoFocus
        className={buttonClass[templateType]}
        style={{
          backgroundColor: disabled() ? "" : "#0E78D5",
          color: disabled() ? "" : "#E5E5E5",
          display:
            (scheduleInfo.role_type !== "Student" && (scheduleInfo.class_type_label?.id ?? scheduleInfo.class_type) === "Homework") ||
            (scheduleInfo.role_type === "Student" && (scheduleInfo.class_type_label?.id ?? scheduleInfo.class_type) === "OfflineClass") ||
            scheduleInfo.is_review
              ? "none"
              : "block",
        }}
        disabled={disabled()}
        onClick={() => handleGoLive(scheduleInfo as ScheduleEditExtend)}
      >
        {(scheduleInfo.class_type_label?.id ?? scheduleInfo.class_type) === "Homework" && d("Go Study").t("schedule_button_go_study")}
        {(scheduleInfo.class_type_label?.id ?? scheduleInfo.class_type) === "OfflineClass" &&
          d("Start Class").t("schedule_button_start_class")}
        {(scheduleInfo.class_type_label?.id ?? scheduleInfo.class_type) === "OnlineClass" && d("Go Live").t("schedule_button_go_live")}
      </Button>
      <Button
        color="primary"
        variant="outlined"
        autoFocus
        disabled={new Date().getTime() / 1000 > (scheduleInfo.due_at ?? 0) || scheduleInfo.complete_assessment}
        className={buttonClass[templateType]}
        style={{ display: scheduleInfo.is_review && scheduleInfo.role_type === "Student" ? "block" : "none" }}
        onClick={() => handleGoLive(scheduleInfo as ScheduleEditExtend)}
      >
        {scheduleInfo.is_review && scheduleInfo.review_status === "success" && "Go Review"}
      </Button>
      <Button
        color="primary"
        variant="outlined"
        autoFocus
        className={buttonClass[templateType]}
        style={{
          display: scheduleInfo.is_review && scheduleInfo.role_type !== "Student" ? "block" : "none",
          backgroundColor: "#0E78D5",
          color: "white",
        }}
        onClick={() => {
          handleClose && handleClose();
        }}
      >
        {d("OK").t("general_button_OK")}
      </Button>
    </>
  );
}

export default function ScheduleButton(props: ButtonProps) {
  const { scheduleInfo, templateType, handleGoLive, handleClose } = props;
  return <RouterButton scheduleInfo={scheduleInfo} handleClose={handleClose} templateType={templateType} handleGoLive={handleGoLive} />;
}
