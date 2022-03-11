import rightArrow from "@assets/icons/rightArrow.svg";
import { noReportTip } from "@components/TipImages";
import { Box, Button, Grid, Icon, Link, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Theme, withStyles } from "@material-ui/core/styles";
import { InfoOutlined, KeyboardBackspace } from "@material-ui/icons";
import ReportTeachingLoad from "@pages/ReportTeachingLoad";
import { RootState } from "@reducers/index";
import {
  getAchievementOverview,
  getLearnerMonthlyReportOverview,
  getLearnerUsageOverview,
  getLearnerWeeklyReportOverview,
} from "@reducers/report";
import { getAWeek, getSingleOfFourWeeks } from "@utilities/dateUtilities";
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
import LearningMonthlyTabs from "./components/LearningMonthlyTabs";
import LearningOutcomeTabs from "./components/LearningOutcomeTabs";
import LearningWeeklyTabs from "./components/LearningWeeklyTabs";
import SkillCoverageTab from "./components/SkillCoverageTab";

const useStyles = makeStyles(({ shadows, breakpoints }) => ({
  layoutBoxWrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  layoutBoxMain: {
    background: "#F2F3F8",
    flexGrow: 1,
    minHeight: "100%",
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
    marginTop: 24,
  },

  navContainer: {
    "& > ul": {
      margin: 0,
      padding: 0,
      paddingTop: 24,
      "& > li": {
        listStyle: "none",
        paddingBottom: 13,
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
  reportTop: {
    color: "#6D8199",
    fontSize: "16px",
    marginBottom: "3px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    position: "absolute",
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
    backgroundColor: theme.palette.common.black,
    color: "#fff",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    padding: 10,
    borderRadius: 14,
    lineHeight: "18px",
  },
}))(Tooltip);

export function ReportDashboard() {
  const css = useStyles();
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
    PermissionType.report_organization_student_usage_654,
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
    dispatch(getAchievementOverview({ time_range: getAWeek().join("-") }));
    dispatch(getLearnerWeeklyReportOverview({ time_range: getAWeek().join("-") }));
    dispatch(getLearnerMonthlyReportOverview({ time_range: getSingleOfFourWeeks().join("-") }));
  }, [dispatch]);

  const [hasSkillCoveragePerm, hasLearnerUsagePerm, hasReportListPerm, reportList, isPending] = React.useMemo(() => {
    const hasSkillCoveragePerm = !!perm.report_learning_outcomes_in_categories_616;
    const hasLearnerUsagePerm = !!perm.student_usage_report_657;
    const reportList: ReportItem[] = [
      {
        hasPerm: !!perm.teachers_classes_teaching_time_report_620,
        label: t("report_label_teaching_load"),
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
      <DiyTooltip placement={"right-start"} title={<div className={css.infoul} dangerouslySetInnerHTML={{ __html: tip }}></div>}>
        <InfoOutlined
          style={{
            fontSize: 20,
            marginLeft: 6,
            color: "#000",
          }}
        ></InfoOutlined>
      </DiyTooltip>
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
            {Boolean(perm.student_progress_report_662) && (
              <Grid item xs={12} md={4}>
                {reportTip(t("report_label_student_progress_report"), t("report_label_learner_monthly_report_info"))}
                <Box className={clsx(css.gridItem, css.gridItemWithBg)}>
                  <LearningMonthlyTabs />
                </Box>
              </Grid>
            )}
            {Boolean(perm.learning_summary_report_653) && (
              <Grid item xs={12} md={4}>
                {reportTip(t("report_learning_summary_report"), t("report_label_learner_weekly_report_info"))}
                <Box className={clsx(css.gridItem, css.gridItemWithBg)}>
                  <LearningWeeklyTabs />
                </Box>
              </Grid>
            )}
            {Boolean(perm.organization_class_achievements_report_626) && (
              <Grid item xs={12} md={4}>
                {reportTip(t("report_label_learning_outcome"), t("report_label_learning_outcome_info"))}
                <Box className={clsx(css.gridItem, css.gridItemWithBg)}>
                  <LearningOutcomeTabs />
                </Box>
              </Grid>
            )}
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
          {d("Return to Analytics and Reports").t("report_label_go_back")}
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
