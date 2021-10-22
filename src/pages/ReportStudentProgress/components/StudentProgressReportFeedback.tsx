import { createStyles, makeStyles } from "@material-ui/core/styles";
import { CheckCircle } from "@material-ui/icons";
import React from "react";

const useStyle = makeStyles(({ palette }) =>
  createStyles({
    feedbackContainer: {
      position: "relative",
      display: "flex",
      alignItem: "center",
      boxSizing: "border-box",
      width: "100%",
      lineHeight: "36px",
      fontSize: "20px",
      fontFamily: "Helvetica, Helvetica-Regular",
      padding: "26px 72px 26px 120px",
      borderRadius: "8px",
      boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.20), 0px 1px 10px 0px rgba(0,0,0,0.12), 0px 4px 5px 0px rgba(0,0,0,0.14)",
      marginTop: "45px",
    },
    checkCircleStyle: {
      position: "absolute",
      left: "47px",
      top: "50%",
      width: "30px",
      height: "30px",
      transform: "translateY(-50%)",
    },
  })
);

interface ILearnOutcomeAchievement {
  fourWeeksMassage: string;
}

export default function StudentProgressReportFeedback(props: ILearnOutcomeAchievement) {
  const css = useStyle();
  const { fourWeeksMassage } = props;

  return (
    <div className={css.feedbackContainer}>
      <CheckCircle className={css.checkCircleStyle} />
      <span>{fourWeeksMassage}</span>
    </div>
  );
}
