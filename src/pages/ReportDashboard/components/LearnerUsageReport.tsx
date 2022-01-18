import { EntityLearnerUsageResponse } from "@api/api.auto";
import rightArrow from "@assets/icons/rightArrow.svg";
import { t } from "@locale/LocaleManager";
import { Icon, Link, makeStyles } from "@material-ui/core";
import ReportStudentUsage from "@pages/ReportStudentUsage";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

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
  reportBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "73%",
    height: "33px",
    margin: "0 auto",
    marginTop: "20px",
    color: "#fff",
    boxSizing: "border-box",
    cursor: "pointer",
    fontWeight: "bold",
    "& > a": {
      width: "100%",
      color: "#fff",
      fontSize: 14,
      fontWeight: 600,
      padding: 7,
      paddingLeft: 14,
      paddingRight: 14,
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "10px",
      backgroundColor: "#6D8199",
      "&:hover": {
        backgroundColor: "#556577",
        textDecorationLine: "none",
      },
    },
  },
  rightIcon: {
    width: 10,
    height: 16,
  },
  rightIconImg: {
    width: 10,
    height: 11,
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
        <div className={css.reportBottom}>
          <Link component={RouterLink} to={ReportStudentUsage.routeBasePath}>
            {t("report_student_usage_report")}
            <Icon fontSize="inherit" classes={{ root: css.rightIcon }}>
              <img alt="" className={css.rightIconImg} src={rightArrow} />
            </Icon>
          </Link>
        </div>
      </div>
    </div>
  );
}
