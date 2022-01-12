import { t } from "@locale/LocaleManager";
import { makeStyles } from "@material-ui/core";
import { ArrowRight } from "@material-ui/icons";
import ReportStudentUsage from "@pages/ReportStudentUsage";
import { getAWeek } from "@utilities/dateUtilities";
import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
// import { RootState } from "../../../reducers";

const useStyles = makeStyles(() => ({
  reportContainer: {
    width: "100%",
  },
  reportListContainer: {
    height: "321px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "0px 19px 28px",
    boxSizing: "border-box",
  },
  content: {
    height: "47px",
    lineHeight: "47px",
    fontSize: "12px",
    "&:before": {
      display: "inline-block",
      content: "''",
      width: "4px",
      height: "4px",
      borderRadius: "50%",
      backgroundColor: "#00C7FD",
      marginRight: "5px",
      marginBottom: "2.5px",
    },
  },
  reportList: {
    width: "100%",
    height: "63px",
    backgroundColor: "#f4f4f4",
    borderRadius: "10px",
    marginBottom: "6px",
    padding: "0 20px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportLeft: {
    fontSize: "14px",
    fontWeight: 600,
    wordBreak: "normal",
    wordWrap: "break-word",
    maxWidth: "150px",
  },
  reportRight: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "right",
    fontSize: "29px",
    color: "#1896EA",
  },
  category: {
    maxWidth: "50px",
    fontSize: "12px",
    color: "#000",
    textAlign: "left",
    marginLeft: "18px",
    wordBreak: "normal",
    wordWrap: "break-word",
  },
  reportBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6D8199",
    width: "65%",
    height: "33px",
    margin: "0 auto",
    marginTop: "10px",
    padding: "0 14px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "13px",
    boxSizing: "border-box",
    cursor: "pointer",
  },
}));

export default function LearnerUsageReport() {
  const css = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  // const {
  //   ContentsUsed,
  //   ClassScheduled,
  //   AssignmentScheduled
  // } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const reportList = [
    {
      content: t("report_label_content_used"),
      value: 32 || 0,
      // value: ContentsUsed || 0,
      category: t("report_label_5_types"),
    },
    {
      content: t("report_label_class_scheduled"),
      value: 12 || 0,
      // value: ClassScheduled || 0,
      category: t("report_label_live_class"),
    },
    {
      content: t("report_label_assignment_scheduled"),
      value: 8 || 0,
      // value: AssignmentScheduled || 0,
      category: t("report_label_study_and_home_fun"),
    },
  ];

  const handleClick = useMemo(
    () => () => {
      history.push(ReportStudentUsage.routeBasePath);
    },
    [history]
  );

  // React.useEffect(() => {
  //   dispatch(LearnerUsageRequest({
  //     Durations: getAWeek(),
  //     ContentTypeList: ["Content Used", "Class Scheduled", "Assignment Scheduled"]
  //   }))
  // }, [dispatch])

  React.useEffect(() => {
    console.log("getAWeek", getAWeek());
  }, [dispatch]);

  return (
    <div className={css.reportContainer}>
      <div className={css.reportListContainer}>
        <div className={css.content}>{t("report_label_past_7_days")}</div>
        {reportList.map((item, idx) => {
          return (
            <div className={css.reportList} key={idx}>
              <div className={css.reportLeft}>{item.content}</div>
              <div className={css.reportRight}>
                <div>{item.value}</div>
                <div className={css.category}>{item.category}</div>
              </div>
            </div>
          );
        })}
        <div onClick={handleClick} className={css.reportBottom}>
          {t("report_student_usage_report")}
          <ArrowRight />
        </div>
      </div>
    </div>
  );
}
