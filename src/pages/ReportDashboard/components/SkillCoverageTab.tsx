import { EntityTeacherReportCategory } from "@api/api.auto";
import { t } from "@locale/LocaleManager";
import { Box, Grid, makeStyles } from "@material-ui/core";
import { ArrowRight } from "@material-ui/icons";
import { ReportCategories } from "@pages/ReportCategories";
import { RootState } from "@reducers/index";
import { getSkillCoverageReportAll } from "@reducers/report";
import { ParentSize } from "@visx/responsive";
import _ from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import StatisticPieCharts from "./StatisticPieCharts";

const useStyles = makeStyles(() => ({
  body: {},
  container: {
    width: "100%",
    height: "321px",
    borderRadius: "12px",
    padding: "30px 15px 28px 30px",
    background: "#fff",
  },
  score: {},
  scoreName: {
    lineHeight: "18px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
  scoreValue: {
    fontSize: "30px",
    lineHeight: "38px",
  },
  scoreContainer: {
    width: "38%",
    marginLeft: "25px",
  },
  scoreItem: {
    marginBottom: "7px",
  },
  reportBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6D8199",
    width: "65%",
    height: "33px",
    margin: "0 auto",
    marginTop: "35px",
    padding: "0 14px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "13px",
    boxSizing: "border-box",
    cursor: "pointer",
  },
}));

const COLORS = ["#61AAFF", "#64D1BE", "#F6A97D"];

function handleListData(data: EntityTeacherReportCategory[]) {
  const amount = data.reduce((preValue, item) => preValue + (item.items?.length || 0), 0);
  if (data.length) {
    let handleData = _.sortBy(
      data.map((item) => ({ ...item, count: item.items?.length || 0 })),
      ["count", "name"]
    );
    const secondNum =
      handleData[1].items?.length === handleData[2].items?.length
        ? _.sortBy([handleData[1], handleData[2]], "name")[0]
        : _.sortBy([handleData[1], handleData[2]], "count")[1];
    handleData = [
      { name: handleData[0].name, count: Math.floor(((handleData[0].count || 0) / amount) * 100) },
      { name: secondNum.name, count: Math.floor(((secondNum.count || 0) / amount) * 100) },
      { name: t("library_label_other"), count: 100 - (((handleData[0].count || 0) + (secondNum.count || 0)) / amount) * 100 },
    ];
    handleData[2].count = 100 - handleData[0].count - handleData[1].count;
    return handleData;
  }
  return [];
}

export default function SkillCoverageTab() {
  const css = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { categoriesAll } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const handleData = handleListData(categoriesAll || []);

  const handleClick = () => {
    history.push(ReportCategories.routeBasePath);
  };

  useEffect(() => {
    dispatch(getSkillCoverageReportAll({ metaLoading: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <Grid container direction="column">
      <Grid wrap="nowrap" container direction="column" className={css.container}>
        <Box flex={1} display={"flex"}>
          <Box flex={1} display={"flex"} position={"relative"}>
            <ParentSize>
              {(info) => {
                return (
                  <Box position={"absolute"}>
                    <StatisticPieCharts
                      width={info.width}
                      height={info.height}
                      value={_.sum(handleData) === 0 ? Array(3).fill(100 / 3) : handleData.map((item) => item.count || 0)}
                      colors={_.sum(handleData) === 0 ? Array<string>(3).fill("#eee") : COLORS}
                    />
                  </Box>
                );
              }}
            </ParentSize>
          </Box>
          <Grid container direction="column" justifyContent="center" className={css.scoreContainer}>
            {handleData.map((item, i) => renderScore(item.name || "", item.count || 0, COLORS[i], i))}
          </Grid>
        </Box>
        <Grid container justifyContent="center" alignItems="center">
          <div onClick={handleClick} className={css.reportBottom}>
            {t("report_label_lo_in_categories")}
            <ArrowRight />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
