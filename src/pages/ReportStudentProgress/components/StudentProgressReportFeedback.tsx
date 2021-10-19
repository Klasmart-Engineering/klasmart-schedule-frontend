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
      // height: "124px",
      lineHeight: "36px",
      fontSize: "20px",
      fontFamily: "Helvetica, Helvetica-Regular",
      padding: "26px 72px 26px 120px",
      borderRadius: "8px",
      boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.20), 0px 1px 10px 0px rgba(0,0,0,0.12), 0px 4px 5px 0px rgba(0,0,0,0.14)",
      marginTop: "56px",
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

// function getFeedback (data: any, Name: string, AchievedLoCount: number | string, LearntLoCount: number | string) {
//   switch (data) {
//     case "上周都没有数据":
//       return t("lo_new", {Name, AchievedLoCount, LearntLoCount });
//       break;
//     case "连续三周高于班级平均数或者低于班级平均数":
//       return 连续三周高于班级平均数 ? t("lo_high_class_3w", {Name, AchievedLoCount, LearntLoCount }) : t("lo_low_class_3w", {Name, AchievedLoCount, LearntLoCount });
//       break;
//     case "较前一周显著增加(>= 20%)或减少(>= 20%)":
//        return 较前一周显著增加(>= 20%) ? t("lo_increase_previous_large_w", {Name, AchievedLoCount, LearntLoCount }) : t("lo_decrease_previous_large_w", {Name, AchievedLoCount, LearntLoCount });
//       break;
//     case "Learing Outcome Achivement && 复习的LO %明显高于班级(>= 10%)或低于班级(>= 10%)":
//        return 复习的LO %明显高于班级(>= 10%) ? t("lo_high_class_review_w", {Name, AchievedLoCount, LearntLoCount }) : t("lo_low_class_review_w", {Name, AchievedLoCount, LearntLoCount });
//       break;
//     case "连续增加了三周或连续减少了三周":
//        return 连续增加了三周 ? t("lo_increase_3w", {Name, AchievedLoCount, LearntLoCount }) : t("lo_decrease_3w", {Name, AchievedLoCount, LearntLoCount });
//       break;
//     case "高于班级平均水平或低于班级平均水平":
//        return 连续增加了三周 ? t("lo_high_class_w", {Name, AchievedLoCount, LearntLoCount }) : t("lo_low_class_w", {Name, AchievedLoCount, LearntLoCount });
//       break;
//     case "比前一周增加(< 20%)或减少(< 20%)":
//        return 连续增加了三周 ? t("lo_increase_previous_w", {Name, AchievedLoCount, LearntLoCount }) : t("lo_decrease_previous_w", {Name, AchievedLoCount, LearntLoCount });
//       break;
//     default:
//       return t("lo_default", {Name, AchievedLoCount, LearntLoCount });
//       break;
//   }
// }

export default function StudentProgressReportFeedback() {
  const css = useStyle();

  return (
    <div className={css.feedbackContainer}>
      <CheckCircle className={css.checkCircleStyle} />
      <span>
        Name is continue learning in KidsLoop. In this week, Name achieved AchievedLoCount learning outcomes among LearntLoCount.{" "}
      </span>
      {/* {getFeedback(data, )} */}
    </div>
  );
}
