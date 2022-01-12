import { Box, Button, Grid, Link, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Theme, withStyles } from "@material-ui/core/styles";
import { Info, InfoOutlined, KeyboardBackspace } from "@material-ui/icons";
import clsx from "clsx";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import LayoutBox from "../../components/LayoutBox";
import { permissionTip } from "../../components/TipImages";
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
      "& > li": {
        listStyle: "none",
        paddingBottom: 14,
        "& > a": {
          width: "calc(100% -48px)",
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
    PermissionType.student_usage_report_657,
    PermissionType.student_progress_report_662,
  ]);

  const [hasPerm, hasSummaryPerm, hasStudentUsagePermission, hasStudentProgressPermission, isPending] = React.useMemo(() => {
    const hasPerm =
      perm.view_reports_610 ||
      perm.view_my_reports_614 ||
      perm.view_my_organizations_reports_612 ||
      (perm.view_my_school_reports_611 as boolean);
    const hasSummaryPerm = perm.learning_summary_report_653 as boolean;
    const hasStudentUsagePermission = perm.student_usage_report_657 as boolean;
    const hasStudentProgressPermission = perm.student_progress_report_662 as boolean;
    const isPending = perm.view_reports_610 === undefined;
    return [hasPerm, hasSummaryPerm, hasStudentUsagePermission, hasStudentProgressPermission, isPending];
  }, [perm]);

  React.useEffect(() => {
    if (Object.keys(perm).length === 0) {
      dispatch(actSetLoading(true));
    } else {
      dispatch(actSetLoading(false));
    }
  }, [dispatch, perm]);
  /*
  const reportList: ReportItem[] = [
    {
      title: "report_label_student_achievement",
      url: ReportAchievementList.routeBasePath,
      icon: <SvgIcon component={SaIconUrl}></SvgIcon>,
      bgColor: "#89c4f9",
      hasPerm: hasPerm,
    },
    {
      title: "report_label_lo_in_categories",
      url: ReportCategories.routeBasePath,
      icon: <CategoryOutlined />,
      bgColor: "#77dcb7",
      hasPerm: hasPerm,
    },
    {
      title: "report_label_teaching_load",
      url: ReportTeachingLoad.routeBasePath,
      icon: <AccessTime />,
      bgColor: "#ffa966",
      hasPerm: hasPerm,
    },
    {
      title: "report_learning_summary_report",
      url: ReportLearningSummary.routeRedirectDefault,
      icon: <AssignmentTurnedInOutlined />,
      bgColor: "#FE9494",
      hasPerm: hasSummaryPerm,
    },
    {
      title: "report_student_usage_report",
      url: ReportStudentUsage.routeBasePath,
      icon: <ShowChart />,
      bgColor: "#DCCDFF",
      hasPerm: hasStudentUsagePermission,
    },
    {
      title: "report_label_student_progress_report",
      url: ReportStudentProgress.routeBasePath,
      icon: <ShortText />,
      bgColor: "#607d8b",
      hasPerm: hasStudentProgressPermission,
    },
  ];

  const handleClick = useMemo(
    () => (value: string) => {
      history.push(value);
    },
    [history]
  );
    */
  return (
    <Box className={css.layoutBoxWrapper}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <div className={css.reportTitle}>
          <Typography className={css.reportItemTitleTop}>{t("report_label_report_list")}</Typography>
        </div>
      </LayoutBox>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517} className={css.layoutBoxMain}>
        <Grid container spacing={7}>
          <Grid item xs={4}>
            <Box className={clsx(css.gridItem, css.gridItemWithBg)}>1</Box>
          </Grid>
          {hasStudentUsagePermission && (
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
              <Box className={clsx(css.gridItem, css.gridItemWithBg)}>
                <LearnerUsageReport />
              </Box>
            </Grid>
          )}
          <>
            {(hasPerm || hasSummaryPerm || hasStudentUsagePermission || hasStudentProgressPermission) && (
              <Grid item xs={4}>
                <Box className={clsx(css.gridItem, css.navContainer)}>
                  <ul>
                    <li style={{ marginTop: "30px" }}>
                      <Link component={RouterLink} to={ReportAchievementList.routeBasePath}>
                        Learner Monthly Report
                      </Link>
                    </li>
                    <li>
                      <Link component={RouterLink} to={ReportAchievementList.routeBasePath}>
                        Learner Weekly Report
                      </Link>
                    </li>
                    <li>
                      <Link component={RouterLink} to={ReportAchievementList.routeBasePath}>
                        Learning Outcome Report
                      </Link>
                    </li>
                    <li>
                      <Link component={RouterLink} to={ReportAchievementList.routeBasePath}>
                        Teacher Usage Report
                      </Link>
                    </li>
                  </ul>
                </Box>
              </Grid>
            )}
          </>
        </Grid>

        {isPending ? (
          ""
        ) : hasPerm || hasSummaryPerm ? (
          <>
            {/*
          <Hidden smDown>
            <div className={css.reportList}>
              {reportList.map(
                (item) =>
                  item.hasPerm && (
                    <div key={item.title} className={css.reportItem} onClick={() => handleClick(item.url)}>
                      <div className={css.iconBox} style={{ backgroundColor: item.bgColor }}>
                        {cloneElement(item.icon, { style: { fontSize: 42 } })}{" "}
                      </div>
                      <div className={css.reportItemTitleBox}>
                        <Typography className={css.reportItemTitle}>{t(item.title)}</Typography>
                        <ChevronRight style={{ opacity: 0.54 }} />
                      </div>
                    </div>
                  )
              )}
            </div>
          </Hidden>
          <Hidden mdUp>




            <Grid container spacing={4}>
              {reportList.map(
                (item) =>
                  item.hasPerm && (
                    <Grid key={item.title} item xs={6} className={css.gridCon}>
                      <div className={css.reportItemMb} onClick={() => handleClick(item.url)}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <div className={css.iconBox} style={{ backgroundColor: item.bgColor }}>
                            {cloneElement(item.icon, { style: { fontSize: 22 } })}{" "}
                          </div>
                        </div>
                        <div className={css.reportItemTitleBox}>
                          <Typography className={css.reportItemTitle}>{t(item.title)}</Typography>
                          <ChevronRight style={{ opacity: 0.54, marginTop: 7 }} />
                        </div>
                      </div>
                    </Grid>
                  )
              )}
            </Grid>
          </Hidden>
                  */}
          </>
        ) : (
          permissionTip
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
