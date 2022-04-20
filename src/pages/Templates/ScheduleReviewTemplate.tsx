import { Button, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import { d } from "@locale/LocaleManager";
import { School } from "@material-ui/icons";
import { repeatOptionsType } from "../../types/scheduleTypes";

const useStyles = makeStyles((theme) => ({
  reviewBox: {
    width: "600px",
    [theme.breakpoints.down(600)]: {
      width: "100%",
    },
    "& p": {
      fontSize: "18px",
      fontWeight: 400,
      textAlign: "left",
      [theme.breakpoints.down(600)]: {
        textAlign: "center",
        color: "#666666",
        paddingLeft: "12px",
        paddingRight: "16px",
      },
    },
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    paddingBottom: "20px",
    borderBottom: "1px solid #eeeeee",
  },
  buttons: {
    textAlign: "right",
    marginTop: "20px",
    [theme.breakpoints.down(600)]: {
      textAlign: "center",
      marginBottom: "10px",
    },
  },
  lastButton: {
    marginLeft: "30px",
  },
  checkboxContainer: {
    paddingBottom: "8px",
    marginTop: "20px",
    maxHeight: "250px",
    overflow: "auto",
    flexWrap: "nowrap",
    "&::-webkit-scrollbar": {
      backgroundColor: "#fff",
      width: "5px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#d8d8d8",
      borderRadius: "4px",
    },
    "& span": {
      display: "flex",
      fontSize: "18px",
      fontWeight: "400",
      color: "#666666",
      paddingLeft: "12px",
      marginTop: "8px",
      [theme.breakpoints.down(600)]: {
        justifyContent: "center",
        color: "#999999",
      },
    },
  },
}));

interface InfoProps {
  handleClose: () => void;
  checkScheduleReviewData: any;
  saveSchedule: (repeat_edit_options: repeatOptionsType, is_force: boolean, is_new_schedule: boolean, is_check_review: boolean) => void;
  disabledConfirm: boolean;
}

export default function ScheduleReviewTemplate(props: InfoProps) {
  const { handleClose, checkScheduleReviewData, saveSchedule, disabledConfirm } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down(600));

  return (
    <div className={css.reviewBox}>
      <div className={css.title} />
      {disabledConfirm && (
        <p style={{ color: "red" }}>
          {d(
            "There was not enough content covered for this group of students during the date range specified to create an auto review session. Please try again with a different date range or student group."
          ).t("schedule_review_group_fail_no_data")}{" "}
        </p>
      )}
      {!disabledConfirm && (
        <>
          <p>
            {d(
              "Publishing your auto review\n\nA new ‘Auto review’ lesson will appear on students’ calendar once our platform has finished an analysis for each student."
            ).t("schedule_review_pop_up_all_success")}{" "}
          </p>
          <p>
            {d(
              "Please note that we do not have enough data for the following students during the time range selected – they will each be given a random lesson. To avoid this in future, please ensure that students have worked on at least 10 activities before setting an Auto review."
            ).t("schedule_review_popup_partial_success")}
          </p>
        </>
      )}
      <div className={css.checkboxContainer}>
        {checkScheduleReviewData?.usersConnection?.edges?.map((item: any) => {
          return (
            <span>
              {" "}
              {!mobile && <School style={{ marginRight: 12 }} />} {item.node.givenName} {item.node.familyName}
            </span>
          );
        })}
      </div>
      <div className={css.buttons}>
        <Button variant="outlined" onClick={handleClose}>
          {d("Cancel").t("assess_button_cancel")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={disabledConfirm}
          className={css.lastButton}
          onClick={() => {
            saveSchedule("only_current", true, false, false);
            handleClose();
          }}
        >
          {d("Confirm").t("h5p_label_confirm")}
        </Button>
      </div>
    </div>
  );
}
