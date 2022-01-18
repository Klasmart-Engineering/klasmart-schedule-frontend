import { EntityTeacherReportCategory } from "@api/api.auto";
import rightArrow from "@assets/icons/rightArrow.svg";
import { t } from "@locale/LocaleManager";
import { Box, Grid, Icon, Link, makeStyles } from "@material-ui/core";
import { ReportCategories } from "@pages/ReportCategories";
import { RootState } from "@reducers/index";
import { getSkillCoverageReportAll } from "@reducers/report";
import { ParentSize } from "@visx/responsive";
import _ from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
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
    lineHeight: "22px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
  scoreValue: {
    fontSize: "30px",
    lineHeight: "35px",
  },
  scoreContainer: {
    width: "38%",
    marginTop: "19px",
    marginLeft: "25px",
  },
  scoreItem: {
    marginBottom: "7px",
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

const COLORS = ["#61AAFF", "#64D1BE", "#F6A97D"];

function handleListData(data: EntityTeacherReportCategory[]) {
  const amount = data.reduce((preValue, item) => preValue + (item.items?.length || 0), 0);
  const mergedData = new Map<string, number>();
  data.forEach((item) => mergedData.set(item.name || "", (item.items?.length || 0) + (mergedData.get(item.name || "") || 0)));
  let handleData = Array.from(mergedData.entries()).map((item) => ({ name: item[0], count: item[1] }));
  handleData = _.orderBy(_.orderBy(handleData, "name", "asc"), "count", "desc");

  if (handleData.length && handleData.length >= 3) {
    const secondNum =
      handleData[1]?.count === handleData[2]?.count
        ? _.orderBy([handleData[1], handleData[2]], "name")[0]
        : _.orderBy([handleData[1], handleData[2]], "count", "desc")[0];
    handleData = [
      { name: handleData[0].name, count: Math.floor(((handleData[0].count || 0) / amount) * 100) },
      { name: secondNum.name, count: Math.floor(((secondNum.count || 0) / amount) * 100) },
      { name: t("library_label_other"), count: 100 - (((handleData[0].count || 0) + (secondNum.count || 0)) / amount) * 100 },
    ];
    handleData[2].count = 100 - handleData[0].count - handleData[1].count;
    return handleData;
  } else if (handleData.length === 1) {
    return [{ name: handleData[0].name, count: Math.floor(((handleData[0].count || 0) / amount) * 100) }];
  } else if (handleData.length === 2) {
    return [
      { name: handleData[0].name, count: Math.floor(((handleData[0].count || 0) / amount) * 100) },
      { name: handleData[1].name, count: 100 - Math.floor(((handleData[0].count || 0) / amount) * 100) },
    ];
  }
  return [];
}

export default function SkillCoverageTab() {
  const css = useStyles();
  const dispatch = useDispatch();
  const { categoriesAll } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const handleData = handleListData(categoriesAll || []);

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
          <Box flex={1} display={"flex"} marginTop={"15px"} position={"relative"}>
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
          <div className={css.reportBottom}>
            <Link component={RouterLink} to={ReportCategories.routeBasePath}>
              {t("report_label_lo_in_categories")}
              <Icon fontSize="inherit" classes={{ root: css.rightIcon }}>
                <img alt="" className={css.rightIconImg} src={rightArrow} />
              </Icon>
            </Link>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
