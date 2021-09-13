import { Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "../../../locale/LocaleManager";
import { RootState } from "../../../reducers";
import { getClassesAssignments, getClassesAssignmentsOverview } from "../../../reducers/report";
import ClassesAndAssignmentsTable from "../components/ClassesAndAssignmentsTable";
import ClassFilter from "../components/ClassFilter";
import Statistics from "../components/Statistics";

const PAGESIZE = 10;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    styles: {
      display: "inline-block",
      width: "260px",
      height: "130px",
      boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.10), 0px 9px 40px 0px rgba(0,0,0,0.12)",
      borderRadius: "8px",
      marginRight: "40px",
      padding: "32px 20px",
      boxSizing: "border-box",
    },
    LiveScheduled: {
      boxShadow: "0px 4px 16px 0px rgba(14,120,213,0.80)",
      background: "#0e78d5",
      color: "#fff",
    },
    selectContainer: {
      display: "flex",
      justifyContent: "space-between",
      height: "112px",
      alignItems: "center",
    },
    text: {
      fontSize: "20px",
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
      color: "#000000",
    },
    left: {
      float: "left",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    },
    right: {
      float: "right",
    },
    textStyle: {
      fontSize: "16px",
      fontFamily: "Helvetica, Helvetica-Regular",
      fontWeight: 400,
    },
    number: {
      fontSize: "26px",
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
    },
  })
);
const getTimeDots = (): ILatestThreeMonths => {
  const currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1;
  switch (month) {
    case 1:
      year--;
      return {
        latestThreeMonthsDate: [11, 12, 1],
        latestThreeMonthsDots: [`${year}-11-01 00:00:00`, `${year}-12-01 00:00:00`, `${year + 1}-01-01 00:00:00`],
      };
    case 2:
      year--;
      return {
        latestThreeMonthsDate: [12, 1, 2],
        latestThreeMonthsDots: [`${year}-12-01 00:00:00`, `${year}-01-01 00:00:00`, `${year + 1}-02-01 00:00:00`],
      };
    default:
      return {
        latestThreeMonthsDate: [parseInt(`${month - 2}`), parseInt(`${month - 1}`), parseInt(`${month}`)],
        latestThreeMonthsDots: [`${year}-${month - 2}-01 00:00:00`, `${year}-${month - 1}-01 00:00:00`, `${year}-${month}-01 00:00:00`],
      };
  }
};
export interface ILatestThreeMonths {
  latestThreeMonthsDate: number[];
  latestThreeMonthsDots: string[];
}

export function formatTime(time: any) {
  var date = new Date(time);
  return Math.floor(date.getTime() / 1000);
}

export default function () {
  const css = useStyles();
  const currentDate = new Date();
  const { classesAssignments, overview, studentUsage } = useSelector<RootState, RootState["report"]>((state) => state.report);

  const classIdsInit = studentUsage.schoolList.reduce((prev: string[], current) => {
    const classId = current.classes?.map((item) => item?.class_id).filter((item) => !!item) as string[];
    return prev.concat(classId);
  }, []);
  const [classIds, setClassIds] = useState<string[]>(classIdsInit);
  const dispatch = useDispatch();
  const latestThreeMonths = getTimeDots();
  const [page, setPage] = React.useState(1);
  const [state, setState] = React.useState({
    activeTab: 0,
  });

  const topChatData = React.useMemo(() => {
    return [
      {
        title: t("report_student_usage_live_scheduled"),
        total: overview[0]?.count || 0,
        value: overview[0]?.ratio || 0,
        id: "live",
      },
      {
        title: t("report_student_usage_study"),
        total: overview[1]?.count || 0,
        value: overview[1]?.ratio || 0,
        id: "study",
      },
      {
        title: t("report_student_usage_home_fun"),
        total: overview[2]?.count || 0,
        value: overview[2]?.ratio || 0,
        id: "home_fun",
      },
    ];
  }, [overview]);

  const handleTabClick = (index: number) => () => {
    setState({ activeTab: index });
  };
  const type = topChatData[state.activeTab].id;

  useEffect(() => {
    classIds &&
      dispatch(
        getClassesAssignments({
          metaLoading: true,
          class_ids: classIds.slice((page - 1) * PAGESIZE, (page - 1) * PAGESIZE + PAGESIZE),
          type,
          durations: [
            `${formatTime(latestThreeMonths.latestThreeMonthsDots[0])}-${formatTime(latestThreeMonths.latestThreeMonthsDots[1])}`,
            `${formatTime(latestThreeMonths.latestThreeMonthsDots[1])}-${formatTime(latestThreeMonths.latestThreeMonthsDots[2])}`,
            `${formatTime(latestThreeMonths.latestThreeMonthsDots[2])}-${Math.floor((currentDate as any) / 1000)}`,
          ],
        })
      );
    // eslint-disable-next-line
  }, [dispatch, classIds, type, page]);

  useEffect(() => {
    classIds &&
      dispatch(
        getClassesAssignmentsOverview({
          metaLoading: true,
          class_ids: classIds,
          durations: [
            `${formatTime(latestThreeMonths.latestThreeMonthsDots[0])}-${formatTime(latestThreeMonths.latestThreeMonthsDots[1])}`,
            `${formatTime(latestThreeMonths.latestThreeMonthsDots[1])}-${formatTime(latestThreeMonths.latestThreeMonthsDots[2])}`,
            `${formatTime(latestThreeMonths.latestThreeMonthsDots[2])}-${Math.floor((currentDate as any) / 1000)}`,
          ],
        })
      );
    // eslint-disable-next-line
  }, [dispatch, classIds]);

  return (
    <div>
      <div style={{ marginTop: "32px", display: "flex" }}>
        {topChatData.map((item, index) => {
          return (
            <Box key={index} style={{ paddingRight: 40 }} onClick={handleTabClick(index)}>
              <Statistics {...item} active={index === state.activeTab} />
            </Box>
          );
        })}
      </div>

      <div className={css.selectContainer}>
        <div className={css.text}>
          {topChatData[state.activeTab].title}
          {t("report_student_usage_live")}
        </div>
        <div>
          <ClassFilter
            onChange={(v) => {
              v[0]?.value !== "all" ? setClassIds(v.map((item) => item.value)) : setClassIds(classIdsInit);
            }}
            onClose={() => {
              //console.log("close");
            }}
          />
        </div>
      </div>
      <ClassesAndAssignmentsTable
        total={classIds.length}
        page={page}
        handleChangePage={setPage}
        classesAssignments={classesAssignments}
        latestThreeMonths={latestThreeMonths}
        studentUsage={studentUsage}
        type={type}
      />
    </div>
  );
}
