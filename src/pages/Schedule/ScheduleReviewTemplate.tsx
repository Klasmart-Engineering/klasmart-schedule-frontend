import { Button, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import { d } from "../../locale/LocaleManager";
import { School } from "@material-ui/icons";

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
}

export default function ScheduleReviewTemplate(props: InfoProps) {
  const { handleClose } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down(600));

  return (
    <div className={css.reviewBox}>
      <div className={css.title}></div>
      <p>
        The schedule will appear on the students’ calendar once the system completes publishing a personalized Lesson Plan for each student.{" "}
      </p>
      <p>
        The following students will receive a random Lesson Plan as they have not enough data during the time range selected. To avoid this,
        let your student working on at least 10 activities before setting a review session:
      </p>
      <div className={css.checkboxContainer}>
        <span> {!mobile && <School style={{ marginRight: 12 }} />} Dahee Jung</span>
        <span> {!mobile && <School style={{ marginRight: 12 }} />} Angela Chae</span>
        <span> {!mobile && <School style={{ marginRight: 12 }} />} Huyen Nguyen</span>
        <span> {!mobile && <School style={{ marginRight: 12 }} />} Dahee Jung</span>
        <span> {!mobile && <School style={{ marginRight: 12 }} />} Angela Chae</span>
        <span> {!mobile && <School style={{ marginRight: 12 }} />} Huyen Nguyen</span>
        <span> {!mobile && <School style={{ marginRight: 12 }} />} Dahee Jung</span>
        <span> {!mobile && <School style={{ marginRight: 12 }} />} Angela Chae</span>
        <span> {!mobile && <School style={{ marginRight: 12 }} />} Huyen Nguyen</span>
        <span> {!mobile && <School style={{ marginRight: 12 }} />} Dahee Jung</span>
        <span> {!mobile && <School style={{ marginRight: 12 }} />} Angela Chae</span>
        <span> {!mobile && <School style={{ marginRight: 12 }} />} Huyen Nguyen</span>
      </div>
      <div className={css.buttons}>
        <Button variant="outlined" onClick={handleClose}>
          {d("Cancel").t("assess_button_cancel")}
        </Button>
        <Button variant="contained" color="primary" className={css.lastButton}>
          {d("OK").t("assess_label_ok")}
        </Button>
      </div>
    </div>
  );
}
