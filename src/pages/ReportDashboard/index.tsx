import { Box, Button, Grid, Link, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Theme, withStyles } from "@material-ui/core/styles";
import { Info, InfoOutlined, KeyboardBackspace } from "@material-ui/icons";
import { ReportLearningSummary } from "@pages/ReportLearningSummary";
import ReportStudentProgress from "@pages/ReportStudentProgress";
import ReportTeachingLoad from "@pages/ReportTeachingLoad";
import clsx from "clsx";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import LayoutBox from "../../components/LayoutBox";
import { usePermission } from "../../hooks/usePermission";
import { d, t } from "../../locale/LocaleManager";
import { actSetLoading } from "../../reducers/loading";
import { resetReportMockOptions } from "../../reducers/report";
import { ReportAchievementList } from "../ReportAchievementList";
import LearnerUsageReport from "./components/LearnerUsageReport";

const useStyles = makeStyles(({ shadows, breakpoints }) => ({
  layoutBoxWrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  layoutBoxMain: {
    background: "#F2F3F8",
    flexGrow: 1,
    height: "100%",
    paddingTop: 24,
  },

  reportTitle: {
    paddingTop: 32,
    paddingBottom: 32,
    boxSizing: "border-box",
    alignItems: "center",
  },

  gridItem: {
    borderRadius: 12,
  },

  gridItemWithBg: {
    background: "#FFFFFF",
  },

  navContainer: {
    "& > ul": {
      margin: 0,
      padding: 0,
      paddingTop: 30,
      "& > li": {
        listStyle: "none",
        paddingBottom: 14,
        "& > a": {
          width: "calc(100% - 48px)",
          padding: 24,
          lineHeight: 1,
          display: "block",
          background: "#6C99D0",
          borderRadius: 12,
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: 600,
          textDecoration: "none",
          position: "relative",

          "&::after": {
            content: "''",
            display: "block",
            position: "absolute",
            right: 30,
            top: "50%",
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "7.5px 0 7.5px 10px",
            borderColor: "transparent transparent transparent #FFFFFF",
            transform: "translateY(-50%)",
          },
          "&:hover": {
            background: "#4A7ABE",
            textDecorationLine: "none",
          },
        },
      },
    },
  },

  reportItemTitleBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [breakpoints.down("sm")]: {
      display: "block",
    },
  },
  reportItemTitleTop: {
    fontSize: 32,
    fontWeight: 700,
    [breakpoints.down("sm")]: {
      fontSize: 20,
    },
  },
  reportItemTitle: {
    fontSize: 18,
    fontWeight: 700,
    [breakpoints.down("sm")]: {
      fontSize: 12,
    },
  },
  infoul: {
    "& ul": {
      paddingLeft: 10,
    },
  },
  arrow: {
    color: "#fff",
    "&::before": {
      content: "' '",
      border: "0.7px solid #B7B7B7",
      width: "100%",
      height: "100%",
      margin: "auto",
      display: "block",
      transform: "rotate(45deg)",
      backgroundColor: "currentColor",
    },
  },
  tooltip: {
    backgroundColor: "#fff",
    maxWidth: 196,
    padding: 10,
    textAlign: "center",
    color: "#333333",
    border: "0.7px solid #B7B7B7",
  },
  reportTop: {
    color: "#6D8199",
    fontSize: "16px",
    marginBottom: "3px",
  },
}));
/*
interface ReportItem {
  title: LangRecordId;
  url: string;
  icon: JSX.Element;
  bgColor: string;
  hasPerm: boolean;
}
*/

interface ReportItem {
  hasPerm: boolean;
  label: string;
  url: string;
}

const DiyTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    padding: 10,
    lineHeight: "18px",
  },
}))(Tooltip);

export function ReportDashboard() {
  const css = useStyles();
  //const history = useHistory();
  const dispatch = useDispatch();
  const perm = usePermission([
    PermissionType.view_reports_610,
    PermissionType.view_my_reports_614,
    PermissionType.view_my_organizations_reports_612,
    PermissionType.view_my_school_reports_611,
    PermissionType.learning_summary_report_653,
    // Skills Coverage
    PermissionType.report_learning_outcomes_in_categories_616,
    PermissionType.report_organizations_skills_taught_640,
    PermissionType.report_schools_skills_taught_641,
    PermissionType.report_my_skills_taught_642,
    PermissionType.report_my_skills_taught_642,
    // Learner Usage
    PermissionType.student_usage_report_657,
    PermissionType.report_organizational_student_usage_654,
    PermissionType.report_school_student_usage_655,
    PermissionType.report_teacher_student_usage_656,
    // list
    PermissionType.student_progress_report_662,
    PermissionType.learning_summary_report_653,
    PermissionType.organization_class_achievements_report_626,
    PermissionType.teachers_classes_teaching_time_report_620,
  ]);

  React.useEffect(() => {
    if (Object.keys(perm).length === 0) {
      dispatch(actSetLoading(true));
    } else {
      dispatch(actSetLoading(false));
    }
  }, [dispatch, perm]);

  const [hasSkillCoveragePerm, hasLearnerUsagePerm, hasReportListPerm, reportList, isPending] = React.useMemo(() => {
    const hasSkillCoveragePerm = !!perm.report_learning_outcomes_in_categories_616;
    const hasLearnerUsagePerm = !!perm.student_usage_report_657;
    const reportList: ReportItem[] = [
      {
        hasPerm: !!perm.student_progress_report_662,
        label: t("report_label_learner_usage_info"),
        url: ReportStudentProgress.routeBasePath,
      },
      {
        hasPerm: !!perm.learning_summary_report_653,
        label: t("report_learning_summary_report"),
        url: ReportLearningSummary.routeRedirectDefault,
      },
      {
        hasPerm: !!perm.organization_class_achievements_report_626,
        label: t("report_label_student_achievement"),
        url: ReportAchievementList.routeBasePath,
      },
      {
        hasPerm: !!perm.teachers_classes_teaching_time_report_620,
        label: t("report_label_student_achievement"),
        url: ReportTeachingLoad.routeBasePath,
      },
    ].filter((item) => item.hasPerm);
    const hasReportListPerm = reportList.length > 0;
    const isPending = perm.report_learning_outcomes_in_categories_616 === undefined;
    return [hasSkillCoveragePerm, hasLearnerUsagePerm, hasReportListPerm, reportList, isPending];
  }, [perm]);

  const hasPerm = hasSkillCoveragePerm || hasLearnerUsagePerm || hasReportListPerm;

  return (
    <Box className={css.layoutBoxWrapper}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <div className={css.reportTitle}>
          <Typography className={css.reportItemTitleTop}>{t("report_label_report_list")}</Typography>
        </div>
      </LayoutBox>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517} className={css.layoutBoxMain}>
        {!isPending && !hasPerm && (
          <svg width="122" height="148" viewBox="0 0 122 148" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.73486 28.4156L13.2516 31.1752" stroke="#FFBA08" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M28.0273 3.7291L30.6867 13.2606" stroke="#FFBA08" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.6689 14.7672L20.0941 21.2707" stroke="#FFBA08" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M72.6828 28.6244C65.9001 28.6244 48.6891 28.6245 41.8167 28.9378C34.9443 29.251 31.0151 33.2784 30.2382 37.1417C29.4614 41.0051 29.0581 73.0901 29.0581 84.3072V90.2738C29.0581 101.491 29.4464 133.531 30.2382 137.439C31.0301 141.347 34.9443 145.24 41.8167 145.628C48.6891 146.016 65.9001 146.091 72.6828 146.091C79.4656 146.091 100.411 146.091 107.284 145.777C114.156 145.464 118.086 141.437 118.862 137.573C119.243 134.17 119.453 130.75 119.49 127.326C119.49 127.043 119.49 126.759 119.49 126.476V123.194C119.669 116.168 119.789 107.815 119.863 100.82L120.013 92.0189C120.013 91.1239 120.013 89.513 120.013 87.3948C120.013 85.2767 120.013 83.6658 120.013 82.7708L119.863 73.9701C119.863 70.3753 119.774 66.4225 119.714 62.4547L91.3279 28.6692C84.0521 28.6393 76.3282 28.6244 72.6828 28.6244Z"
              fill="#F7F7F7"
              stroke="#41A6DF"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M94.9736 57.0252C93.4982 56.3662 92.202 55.3644 91.1936 54.1033C90.1852 52.8421 89.4937 51.3583 89.1769 49.7759C88.7156 46.3592 88.8775 42.8874 89.6549 39.5283C89.9388 37.7533 90.2377 35.9931 90.5365 34.218C90.671 33.4275 91.9258 29.236 91.4925 28.6991L119.878 62.4846C119.311 61.8134 115.83 61.709 114.978 61.5449L108.36 60.3216C104.087 59.5012 98.9178 59.0091 94.9736 57.0252Z"
              fill="#41A6DF"
              stroke="#41A6DF"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M74.1772 65.7213C67.1447 65.7212 60.3978 68.4992 55.4097 73.4486C50.4216 78.3981 47.5976 85.1171 47.5542 92.1383H74.4462V65.7363L74.1772 65.7213Z"
              fill="#46ADE8"
            />
            <path
              d="M47.4942 92.1383C47.4942 92.1383 47.4942 92.2427 47.4942 92.3024C47.4878 98.65 49.762 104.789 53.9035 109.605L74.3263 92.1383H47.4942Z"
              fill="#2689DD"
            />
            <path
              d="M100.785 92.1383C100.742 85.1545 97.9465 78.4685 93.003 73.5273C88.0596 68.5861 81.3661 65.7871 74.3713 65.7363V92.1383L53.9482 109.605C57.4873 113.735 62.2094 116.682 67.4778 118.05C72.7462 119.417 78.3078 119.14 83.4133 117.254C88.5188 115.369 92.9227 111.966 96.0315 107.504C99.1404 103.043 100.805 97.7373 100.8 92.3024C100.803 92.2473 100.798 92.1921 100.785 92.1383Z"
              fill="#67C1ED"
            />
          </svg>
        )}
        {!isPending && hasPerm && (
          <Grid container spacing={7}>
            {hasSkillCoveragePerm && (
              <Grid item xs={4}>
                <Box className={clsx(css.gridItem, css.gridItemWithBg)}>1</Box>
              </Grid>
            )}
            {hasLearnerUsagePerm && (
              <Grid item xs={4}>
                <div className={css.reportTop}>
                  {t("report_label_learner_usage")}
                  <Tooltip
                    arrow
                    placement="bottom"
                    title={t("report_label_learner_usage_info")}
                    classes={css}
                    aria-label="info"
                    style={{
                      position: "relative",
                      left: "7px",
                      top: "3px",
                      fontSize: "19px",
                      color: "#6D8199",
                      width: "15px",
                      height: "15px",
                    }}
                  >
                    <Info></Info>
                  </Tooltip>
                </div>
                <Box className={clsx(css.gridItem, css.gridItemWithBg)}>
                  <LearnerUsageReport />
                </Box>
              </Grid>
            )}
            <>
              {hasReportListPerm && (
                <Grid item xs={4}>
                  <Box className={clsx(css.gridItem, css.navContainer)}>
                    <ul>
                      {reportList.map((item, index) => {
                        return (
                          <li key={index}>
                            <Link component={RouterLink} to={item.url}>
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </Box>
                </Grid>
              )}
            </>
          </Grid>
        )}
      </LayoutBox>
    </Box>
  );
}

export const ReportTitle = (props: { title: string; info?: string }) => {
  const css = useStyles();
  const { title, info } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const handleBack = useCallback(() => {
    dispatch(resetReportMockOptions());
    history.push(ReportDashboard.routeBasePath);
  }, [dispatch, history]);
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div className={css.reportTitle}>
        <Button color="primary" startIcon={<KeyboardBackspace />} onClick={handleBack}>
          {d("Return to Reports List").t("report_label_go_back")}
        </Button>
        <Typography className={css.reportItemTitleTop}>
          {title}
          {info && (
            <DiyTooltip title={<div className={css.infoul} dangerouslySetInnerHTML={{ __html: info }}></div>}>
              <InfoOutlined style={{ marginLeft: "10px", color: "gray" }} />
            </DiyTooltip>
          )}
        </Typography>
      </div>
    </LayoutBox>
  );
};

ReportDashboard.routeBasePath = "/report/achievement-list";
ReportDashboard.routeRedirectDefault = `/report/achievement-list`;
