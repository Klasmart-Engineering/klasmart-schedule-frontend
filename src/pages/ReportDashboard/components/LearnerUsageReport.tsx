import { EntityLearnerUsageResponse } from "@api/api.auto";
import { t } from "@locale/LocaleManager";
import { makeStyles } from "@material-ui/core";
import ReportStudentUsage from "@pages/ReportStudentUsage";
import React from "react";
import BottomButton from "./BottomButton";

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
    color: "#6D8199",
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
    fontWeight: "bold",
    wordBreak: "normal",
    wordWrap: "break-word",
    maxWidth: "150px",
  },
  reportRight: {
    display: "flex",
    alignItems: "center",
    fontSize: "30px",
    color: "#1896EA",
  },
  value: {
    flex: 1,
    textAlign: "right",
  },
  category: {
    width: "77px",
    fontSize: "12px",
    color: "#6D8199",
    textAlign: "left",
    marginLeft: "18px",
    wordBreak: "normal",
    wordWrap: "break-word",
  },
}));

interface ILearnerUsageReportProps {
  learnerUsageOverview: EntityLearnerUsageResponse;
}

export default function LearnerUsageReport({ learnerUsageOverview }: ILearnerUsageReportProps) {
  const css = useStyles();
  const { assignment_scheduled, class_scheduled, contents_used } = learnerUsageOverview;

  const reportList = [
    {
      content: t("report_label_content_used"),
      value: Math.floor(contents_used || 0),
      category: t("report_label_5_types"),
    },
    {
      content: t("report_label_class_scheduled"),
      value: Math.floor(class_scheduled || 0),
      category: t("report_label_live_class"),
    },
    {
      content: t("report_label_assignment_scheduled"),
      value: Math.floor(assignment_scheduled || 0),
      category: t("report_label_study_and_home_fun"),
    },
  ];

  return (
    <div className={css.reportContainer}>
      <div className={css.reportListContainer}>
        <div className={css.content}>{t("report_label_past_7_days")}</div>
        {reportList.map((item, idx) => {
          return (
            <div className={css.reportList} key={idx}>
              <div className={css.reportLeft}>{item.content}</div>
              <div className={css.reportRight}>
                <div className={css.value}>{item.value}</div>
                <div className={css.category}>{item.category}</div>
              </div>
            </div>
          );
        })}
        <BottomButton text={t("report_student_usage_report")} to={ReportStudentUsage.routeBasePath} marginTop={20} />
      </div>
    </div>
  );
}
