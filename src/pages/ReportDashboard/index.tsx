import React, { cloneElement, useMemo } from "react";
import { useHistory } from "react-router";
import { makeStyles, SvgIcon, Typography } from "_@material-ui_core@4.11.3@@material-ui/core";
import { AccessTime, CategoryOutlined, ChevronRight } from "_@material-ui_icons@4.11.2@@material-ui/icons";
import { ReactComponent as SaIconUrl } from "../../assets/icons/student_archievement-24px.svg";
import LayoutBox from "../../components/LayoutBox";
import { LangRecordId } from "../../locale/lang/type";
import { t } from "../../locale/LocaleManager";
import { ReportAchievementList } from "../ReportAchievementList";
import { ReportCategories } from "../ReportCategories";
import ReportTeachingLoad from "../ReportTeachingLoad";
const useStyles = makeStyles(({ shadows, breakpoints }) => ({
  reportTitle: {
    height: 129,
    display: "flex",
    alignItems: "center",
  },
  reportList: {
    [breakpoints.up("lg")]: {
      display: "flex",
      justifyContent: "space-between",
    },
  },
  reportItem: {
    borderRadius: 8,
    boxShadow: shadows[3],
    padding: "32px 28px",
    minWidth: 160,
    width: "25%",
    cursor: "pointer",
    marginBottom: 20,
    [breakpoints.down("md")]: {
      width: "90%",
    },
  },
  iconBoxBorder: {
    border: "1px dashed #ccc ",
    width: 64,
    height: 64,
    marginBottom: 24,
  },
  iconBox: {
    backgroundColor: "#89c4f9",
    borderRadius: 8,
    color: "#fff",
    height: 64,
    fontSize: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  reportItemTitleBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportItemTitle: {
    fontSize: 18,
    fontWeight: 700,
  },
}));
interface ReportItem {
  title: LangRecordId;
  url: string;
  icon: JSX.Element;
  bgColor: string;
}

export function ReportDashboard() {
  const css = useStyles();
  const history = useHistory();
  const reportList: ReportItem[] = [
    {
      title: "report_label_student_achievement",
      url: ReportAchievementList.routeBasePath,
      icon: <SvgIcon component={SaIconUrl}></SvgIcon>,
      bgColor: "#89c4f9",
    },
    {
      title: "report_label_lo_in_categories",
      url: ReportCategories.routeBasePath,
      icon: <CategoryOutlined />,
      bgColor: "#77dcb7",
    },
    {
      title: "report_label_teaching_load",
      url: ReportTeachingLoad.routeBasePath,
      icon: <AccessTime />,
      bgColor: "#ffa966",
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
        <Typography variant="h4">{t("report_label_report_list")}</Typography>
      </div>
      <div className={css.reportList}>
        {reportList.map((item) => (
          <div key={item.title} className={css.reportItem} onClick={() => handleClick(item.url)}>
            <div className={css.iconBoxBorder}>
              {" "}
              <div className={css.iconBox} style={{ backgroundColor: item.bgColor }}>
                {cloneElement(item.icon, { style: { fontSize: 42 } })}{" "}
              </div>
            </div>
            <div className={css.reportItemTitleBox}>
              <Typography className={css.reportItemTitle}>{t(item.title)}</Typography>
              <ChevronRight style={{ opacity: 0.54 }} />
            </div>
          </div>
        ))}
      </div>
    </LayoutBox>
  );
}

export const ReportTitle = (props: { title: string }) => {
  const css = useStyles();
  const { title } = props;
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div className={css.reportTitle}>
        <Typography variant="h4">{title}</Typography>
      </div>
    </LayoutBox>
  );
};

ReportDashboard.routeBasePath = "/report/achievement-list";
ReportDashboard.routeRedirectDefault = `/report/achievement-list`;
