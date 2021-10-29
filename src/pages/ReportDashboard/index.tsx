import { Button, Grid, Hidden, makeStyles, SvgIcon, Tooltip, Typography } from "@material-ui/core";
import { Theme, withStyles } from "@material-ui/core/styles";
import {
  AccessTime,
  AssignmentTurnedInOutlined,
  CategoryOutlined,
  ChevronRight,
  InfoOutlined,
  KeyboardBackspace,
  ShortText,
  ShowChart,
} from "@material-ui/icons";
import React, { cloneElement, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { ReactComponent as SaIconUrl } from "../../assets/icons/student_archievement-24px.svg";
import LayoutBox from "../../components/LayoutBox";
import { PermissionType, usePermission } from "../../components/Permission";
import { permissionTip } from "../../components/TipImages";
import { LangRecordId } from "../../locale/lang/type";
import { d, t } from "../../locale/LocaleManager";
import { resetReportMockOptions } from "../../reducers/report";
import { ReportAchievementList } from "../ReportAchievementList";
import { ReportCategories } from "../ReportCategories";
import { ReportLearningSummary } from "../ReportLearningSummary";
import ReportStudentProgress from "../ReportStudentProgress";
import ReportStudentUsage from "../ReportStudentUsage";
import ReportTeachingLoad from "../ReportTeachingLoad";
const useStyles = makeStyles(({ shadows, breakpoints }) => ({
  reportTitle: {
    height: 129,
    paddingTop: 30,
    boxSizing: "border-box",
    alignItems: "center",
  },
  reportList: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gridTemplateRows: "repeat(2,180px)",
    gridAutoRows: "33%",
    gridColumnGap: 80,
    gridRowGap: 32,
  },

  reportItem: {
    minWidth: 160,
    cursor: "pointer",
    borderRadius: 8,
    boxShadow: shadows[3],
    padding: "32px 28px",
    flex: 1,
    flexWrap: "wrap",
  },
  reportItemMb: {
    textAlign: "center",
    cursor: "pointer",
    boxShadow: shadows[3],
    borderRadius: 8,
    boxSizing: "border-box",
    padding: "32px 28px",
    minWidth: 140,
  },
  gridCon: {
    // "&:nth-child(n+4)": {
    //   visibility: "hidden",
    // },
  },
  iconBox: {
    backgroundColor: "#89c4f9",
    borderRadius: 8,
    color: "#fff",
    width: 64,
    height: 64,
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [breakpoints.down("sm")]: {
      height: 40,
      width: 40,
      marginBottom: 20,
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
}));
interface ReportItem {
  title: LangRecordId;
  url: string;
  icon: JSX.Element;
  bgColor: string;
  hasPerm: boolean;
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
  const history = useHistory();
  const perm = usePermission([
    PermissionType.view_reports_610,
    PermissionType.view_my_reports_614,
    PermissionType.view_my_organizations_reports_612,
    PermissionType.view_my_school_reports_611,
    PermissionType.learning_summary_report_653,
    PermissionType.student_usage_report_657,
    PermissionType.student_progress_report_662,
  ]);

  const hasPerm =
    perm.view_reports_610 ||
    perm.view_my_reports_614 ||
    perm.view_my_organizations_reports_612 ||
    (perm.view_my_school_reports_611 as boolean);
  const hasSummaryPerm = perm.learning_summary_report_653 as boolean;
  const hasStudentUsagePermission = perm.student_usage_report_657 as boolean;
  const hasStudentProgressPermission = perm.student_progress_report_662 as boolean;
  const isPending = useMemo(() => perm.view_reports_610 === undefined, [perm.view_reports_610]);
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
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div className={css.reportTitle}>
        <Typography className={css.reportItemTitleTop}>{t("report_label_report_list")}</Typography>
      </div>
      {isPending ? (
        ""
      ) : hasPerm || hasSummaryPerm ? (
        <>
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
        </>
      ) : (
        permissionTip
      )}
    </LayoutBox>
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
            <DiyTooltip title={info}>
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
