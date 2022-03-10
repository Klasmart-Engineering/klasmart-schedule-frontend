import { EntityLearnerMonthlyReportOverview } from "@api/api.auto";
import { t } from "@locale/LocaleManager";
import { Box, Grid, makeStyles } from "@material-ui/core";
import ReportStudentProgress from "@pages/ReportStudentProgress";
import { RootState } from "@reducers/index";
import { ParentSize } from "@visx/responsive";
import { sumBy } from "lodash";
import { useSelector } from "react-redux";
import BottomButton from "./BottomButton";
import StatisticPieCharts from "./StatisticPieCharts";

const useStyles = makeStyles(() => ({
  container: {
    width: "100%",
    height: "321px",
    borderRadius: "12px",
    padding: "0px 19px 19px",
    background: "#fff",
  },
  titleTip: {
    height: "0px",
    lineHeight: "47px",
    fontSize: "12px",
    color: "#6D8199",
  },
  scoreContainer: {
    width: "25%",
    marginTop: "36px",
    marginLeft: "25px",
    marginRight: "15px",
  },
  scoreName: {
    lineHeight: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
    fontSize: "13px",
    color: "#A5A5A5",
  },
  scoreValue: {
    fontSize: "30px",
    lineHeight: "35px",
    fontWeight: "bold",
  },
  scoreItem: {
    marginBottom: "12px",
  },
}));

const COLORS = ["#3ab8f3", "#ffd038", "#e80861"];

const computeDatum = (value: number | undefined, count: number) => {
  return count === 0 ? 0 : Math.floor(((value || 0) / count) * 100);
};
export default function LearningWeeklyTabs() {
  const css = useStyles();
  const learningMonthlyOverview: EntityLearnerMonthlyReportOverview = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  ).learningMonthlyOverview;
  const count =
    (learningMonthlyOverview.num_above || 0) + (learningMonthlyOverview.num_meet || 0) + (learningMonthlyOverview.num_below || 0);
  let handleData = [
    {
      name: t("report_label_above"),
      count: computeDatum(learningMonthlyOverview.num_above, count),
    },
    {
      name: t("report_label_meets"),
      count: computeDatum(learningMonthlyOverview.num_meet, count),
    },
    {
      name: t("report_label_below"),
      count: computeDatum(learningMonthlyOverview.num_below, count),
    },
  ];

  const filterData = handleData.filter((item) => item.count);
  if (filterData.length === 2) {
    filterData[1].count = 100 - filterData[0].count;
  } else if (filterData.length === 3) {
    filterData[2].count = 100 - filterData[0].count - filterData[1].count;
  }

  const renderScore = (name: string, number: number, color: string, i: number) => {
    return (
      <Grid container direction="column" className={css.scoreItem} key={i}>
        <div title={name} className={css.scoreName}>
          {name}
        </div>
        <span style={{ color }} className={css.scoreValue}>
          {number}%
        </span>
      </Grid>
    );
  };

  const renderCountNumber = () => {
    return (
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"} position={"absolute"}>
        <Box color={"#777"}>{t("assess_detail_attendance")}</Box>
        <Box color={"#14b799"} fontSize={42} fontWeight={"bold"}>
          {learningMonthlyOverview.attendees}
        </Box>
      </Box>
    );
  };

  return (
    <Grid container direction="column">
      <Grid wrap="nowrap" container direction="column" className={css.container}>
        <Box className={css.titleTip}>{t("report_label_4_weeks")}</Box>
        <Box flex={1} display={"flex"}>
          <Box
            flex={1}
            display={"flex"}
            marginTop={"44px"}
            marginBottom={"10px"}
            position={"relative"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <ParentSize>
              {(info) => {
                return (
                  <Box position={"absolute"}>
                    <StatisticPieCharts
                      width={info.width}
                      height={info.height}
                      value={sumBy(handleData, "count") === 0 ? Array(3).fill(100 / 3) : handleData.map((item) => item.count || 0)}
                      colors={sumBy(handleData, "count") === 0 ? Array<string>(3).fill("#eee") : COLORS}
                    />
                  </Box>
                );
              }}
            </ParentSize>
            {renderCountNumber()}
          </Box>
          <Grid container direction="column" justifyContent="center" className={css.scoreContainer}>
            {handleData.map((item, i) => renderScore(item.name || "", item.count || 0, COLORS[i], i))}
          </Grid>
        </Box>
        <Grid container justifyContent="center" alignItems="center">
          <BottomButton text={t("report_label_student_progress_report")} to={ReportStudentProgress.routeBasePath} marginTop={20} />
        </Grid>
      </Grid>
    </Grid>
  );
}
