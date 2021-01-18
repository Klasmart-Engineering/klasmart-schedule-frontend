import { Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { timestampType } from "../../types/scheduleTypes";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
  weekDay: {
    fontSize: "14px",
    marginLeft: "18px",
    color: "#B3B3B3",
  },
  monthTitle: {
    marginLeft: "15px",
  },
  weekDayTd: {
    width: "36px",
    textAlign: "center",
    position: "relative",
  },
  weekDayTr: {
    display: "flex",
  },
  currentBox: {
    borderRadius: "50px",
    backgroundColor: "#0E78D5",
    color: "white",
  },
  yearTag: {
    width: "4px",
    height: "4px",
    display: "block",
    position: "absolute",
    borderRadius: "10px",
    backgroundColor: "#D32F2F",
    left: "16px",
    top: "26px",
  },
}));

function MyCalendar(props: CalendarProps) {
  const { timesTamp, scheduleTimeViewYearData } = props;
  const css = useStyles();

  const weekDay = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "Jul",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getMonthView = (year: number, month: number) => {
    const d = new Date(year, month, 0);
    return d.getDate();
  };

  const getMonthDay = (month: number) => {
    const arr: any = [[]];
    let idx = 0;
    const weekDay = new Date(`${month}/1/${new Date(timesTamp.start * 1000).getFullYear()}`).getDay();
    for (let d = 1; d <= weekDay; d++) {
      arr[0].push("");
    }
    for (let i = 1; i <= getMonthView(2020, 12); i++) {
      if (!arr.hasOwnProperty(idx)) arr[idx] = [];
      arr[idx].push(i);
      if ((i + weekDay) % 7 === 0) idx++;
    }
    return arr;
  };

  const checkCurrentTime = (month: number, day: number) => {
    return new Date().getMonth() === month && new Date().getDate() === day;
  };

  const checkCurrentExist = (month: number, day: number) => {
    if (!day) return;
    return scheduleTimeViewYearData.includes(
      `${new Date(timesTamp.start * 1000).getFullYear()}-${month < 9 ? "0" + (month + 1) : month + 1}-${
        day < 10 ? "0" + day : day
      }` as never
    );
  };

  return (
    <>
      {monthArr.map((m: string, key: number) => {
        return (
          <Grid style={{ display: "flex", justifyContent: "center" }} item md={6} lg={4} xl={3}>
            <Box>
              <h3 className={css.monthTitle}>{monthArr[key]}</h3>
              <p>
                {weekDay.map((val: string) => {
                  return <span className={css.weekDay}>{val}</span>;
                })}
              </p>
              {getMonthDay(key + 1).map((val: []) => {
                return (
                  <p className={css.weekDayTr}>
                    {val.map((v: number) => {
                      return (
                        <span className={clsx(css.weekDayTd, checkCurrentTime(key, v) ? css.currentBox : "")}>
                          {v}
                          {checkCurrentExist(key, v) && <span className={css.yearTag}></span>}
                        </span>
                      );
                    })}
                  </p>
                );
              })}
            </Box>
          </Grid>
        );
      })}
    </>
  );
}

interface CalendarProps {
  timesTamp: timestampType;
  scheduleTimeViewYearData: [];
}

export default function YearCalendar(props: CalendarProps) {
  const { timesTamp, scheduleTimeViewYearData } = props;
  return (
    <Grid container spacing={2}>
      <MyCalendar timesTamp={timesTamp} scheduleTimeViewYearData={scheduleTimeViewYearData} />
    </Grid>
  );
}
