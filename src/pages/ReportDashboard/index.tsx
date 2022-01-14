import rightArrow from "@assets/icons/rightArrow.svg";
import { noReportTip } from "@components/TipImages";
import { Box, Button, Grid, Icon, Link, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Theme, withStyles } from "@material-ui/core/styles";
import { Info, InfoOutlined, KeyboardBackspace } from "@material-ui/icons";
import { ReportAchievementList } from "@pages/ReportAchievementList";
import { ReportLearningSummary } from "@pages/ReportLearningSummary";
import ReportStudentProgress from "@pages/ReportStudentProgress";
import ReportTeachingLoad from "@pages/ReportTeachingLoad";
import { RootState } from "@reducers/index";
import { getLearnerUsageOverview } from "@reducers/report";
import { getAWeek } from "@utilities/dateUtilities";
import clsx from "clsx";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import LayoutBox from "../../components/LayoutBox";
import { usePermission } from "../../hooks/usePermission";
import { d, t } from "../../locale/LocaleManager";
import { actSetLoading } from "../../reducers/loading";
import { resetReportMockOptions } from "../../reducers/report";
import LearnerUsageReport from "./components/LearnerUsageReport";
import SkillCoverageTab from "./components/SkillCoverageTab";

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
      paddingTop: 20,
      "& > li": {
        listStyle: "none",
        paddingBottom: 14,
        "& > a": {
          width: "calc(100% - 48px)",
          padding: 24,

          background: "#6C99D0",
          borderRadius: 12,
          color: "#FFFFFF",
          fontSize: 18,
          lineHeight: 1,
          fontWeight: 600,
          textDecoration: "none",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
    width: "308px",
    backgroundColor: "#fff",
    padding: "30 24 25",
    lineHeight: "20px",
    color: "#333333",
    border: "0.7px solid #B7B7B7",
  },
  reportTop: {
    color: "#6D8199",
    fontSize: "16px",
    marginBottom: "3px",
  },
  rightIcon: {
    width: 10,
    height: 22,
  },
  rightIconImg: {},
}));
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
  const { learnerUsageOverview } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const { assignment_scheduled, class_scheduled, contents_used } = learnerUsageOverview;
  const perm = usePermission([
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
    if (
      Object.keys(perm).length === 0 &&
      assignment_scheduled === undefined &&
      class_scheduled === undefined &&
      contents_used === undefined
    ) {
      dispatch(actSetLoading(true));
    } else {
      dispatch(actSetLoading(false));
    }
  }, [dispatch, perm, assignment_scheduled, class_scheduled, contents_used]);

  React.useEffect(() => {
    dispatch(
      getLearnerUsageOverview({
        durations: getAWeek(),
        content_type_list: ["h5p", "image", "video", "audio", "document"],
      })
    );
  }, [dispatch]);

  const [hasSkillCoveragePerm, hasLearnerUsagePerm, hasReportListPerm, reportList, isPending] = React.useMemo(() => {
    const hasSkillCoveragePerm = !!perm.report_learning_outcomes_in_categories_616;
    const hasLearnerUsagePerm = !!perm.student_usage_report_657;
    const reportList: ReportItem[] = [
      {
        hasPerm: !!perm.student_progress_report_662,
        label: t("report_label_student_progress_report"),
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

  const reportTip = (title: string, tip: string) => (
    <div className={css.reportTop}>
      {title}
      <Tooltip
        arrow
        placement="bottom"
        title={tip}
        classes={css}
        aria-label="info"
        style={{
          position: "relative",
          left: "5px",
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
  );

  return (
    <Box className={css.layoutBoxWrapper}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <div className={css.reportTitle}>
          <Typography className={css.reportItemTitleTop}>{t("report_label_report_list")}</Typography>
        </div>
      </LayoutBox>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517} className={css.layoutBoxMain}>
        {!isPending && !hasPerm && noReportTip}
        {!isPending && hasPerm && (
          <Grid container spacing={2}>
            {hasSkillCoveragePerm && (
              <Grid item xs={12} md={4}>
                {reportTip(t("report_label_skill_coverage"), t("report_label_skill_coverage_info"))}
                <Box className={clsx(css.gridItem, css.gridItemWithBg)}>
                  <SkillCoverageTab />
                </Box>
              </Grid>
            )}
            {hasLearnerUsagePerm && (
              <Grid item xs={12} md={4}>
                {reportTip(t("report_label_learner_usage"), t("report_label_learner_usage_info"))}
                <Box className={clsx(css.gridItem, css.gridItemWithBg)}>
                  <LearnerUsageReport learnerUsageOverview={learnerUsageOverview} />
                </Box>
              </Grid>
            )}
            <>
              {hasReportListPerm && (
                <Grid item xs={12} md={4}>
                  <Box className={clsx(css.gridItem, css.navContainer)}>
                    <ul>
                      {reportList.map((item, index) => {
                        return (
                          <li key={index}>
                            <Link component={RouterLink} to={item.url}>
                              {item.label}
                              <Icon classes={{ root: css.rightIcon }}>
                                <img alt="" className={css.rightIconImg} src={rightArrow} />
                              </Icon>
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
