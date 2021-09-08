import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
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

export default function () {
  const css = useStyles();

  return (
    <div>
      <div style={{ marginTop: "32px" }}>
        <div className={clsx(css.LiveScheduled, css.styles)}>
          <div className={css.left}>
            <div className={css.textStyle}>Live Scheduled</div>
            <div className={css.number}>4000</div>
          </div>
          <div className={css.right}>饼图</div>
        </div>
        <div className={css.styles}>
          <div className={css.left}>
            <div className={css.textStyle}>Study</div>
            <div className={css.number}>4000</div>
          </div>
          <div className={css.right}>饼图</div>
        </div>
        <div className={css.styles}>
          <div className={css.left}>
            <div className={css.textStyle}>Home Fun</div>
            <div className={css.number}>4000</div>
          </div>
          <div className={css.right}>饼图</div>
        </div>
      </div>
      <div className={css.selectContainer}>
        <div className={css.text}>Live Scheduled(latest 3 moths)</div>
        <div>
          <ClassFilter />
        </div>
      </div>
      <ClassesAndAssignmentsTable />
    </div>
  );
}
