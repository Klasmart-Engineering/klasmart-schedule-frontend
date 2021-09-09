import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PercentCircle from "../../../components/Chart/PercentCircle";
import { t } from "../../../locale/LocaleManager";
import { RootState } from "../../../reducers";
import { getClassesAssignments } from "../../../reducers/report";
import ClassesAndAssignmentsTable from "../components/ClassesAndAssignmentsTable";
import ClassFilter from "../components/ClassFilter";

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
  return date.getTime() / 1000;
}

export default function () {
  const css = useStyles();
  const currentDate = new Date();
  const { classesAssignments } = useSelector<RootState, RootState["report"]>((state) => state.report);

  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();
  // const [latestThreeMonths, setLatestThreeMonths] = useState<ILatestThreeMonths>({
  //   latestThreeMonthsDate: [],
  //   latestThreeMonthsDots: []
  // })
  const latestThreeMonths = getTimeDots();
  console.log("latestThreeMonths=", latestThreeMonths);

  const getPageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };
  useEffect(() => {
    dispatch(
      getClassesAssignments({
        metaLoading: true,
        page_size: pageSize,
        class_ids: [],
        durations: [
          `${formatTime(latestThreeMonths.latestThreeMonthsDots[0])}-${formatTime(latestThreeMonths.latestThreeMonthsDots[1])}`,
          `${formatTime(latestThreeMonths.latestThreeMonthsDots[1])}-${formatTime(latestThreeMonths.latestThreeMonthsDots[2])}`,
          `${formatTime(latestThreeMonths.latestThreeMonthsDots[2])}-${(currentDate as any) / 1000}`,
        ],
      })
    );
  }, [dispatch, pageSize, currentDate, latestThreeMonths.latestThreeMonthsDots]);

  return (
    <div>
      <div style={{ marginTop: "32px" }}>
        <div className={clsx(css.LiveScheduled, css.styles)}>
          <div className={css.left}>
            <div className={css.textStyle}>{t("report_student_usage_live_scheduled")}</div>
            <div className={css.number}>4000</div>
          </div>
          <div className={css.right}>
            <PercentCircle
              width={80}
              height={80}
              total={9600}
              value={4000}
              fontSize={22}
              colors={["#fff", "#E4E4E4"]}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            />
          </div>
        </div>
        <div className={css.styles}>
          <div className={css.left}>
            <div className={css.textStyle}>{t("report_student_usage_study")}</div>
            <div className={css.number}>4000</div>
          </div>
          <div className={css.right}>
            <PercentCircle
              width={80}
              height={80}
              total={9600}
              value={4000}
              fontSize={22}
              colors={["#0E78D5", "#E4E4E4"]}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            />
          </div>
        </div>
        <div className={css.styles}>
          <div className={css.left}>
            <div className={css.textStyle}>{t("report_student_usage_home_fun")}</div>
            <div className={css.number}>4000</div>
          </div>
          <div className={css.right}>
            <PercentCircle
              width={80}
              height={80}
              total={9600}
              value={4000}
              fontSize={22}
              colors={["#0E78D5", "#E4E4E4"]}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            />
          </div>
        </div>
      </div>

      <div className={css.selectContainer}>
        <div className={css.text}>{t("report_student_usage_live")}</div>
        <div>
          <ClassFilter
            onChange={(v) => {
              console.log(v);
            }}
            onClose={() => {
              console.log("close");
            }}
          />
        </div>
      </div>
      <ClassesAndAssignmentsTable classesAssignments={classesAssignments} latestThreeMonths={latestThreeMonths} getPageSize={getPageSize} />
    </div>
  );
}
