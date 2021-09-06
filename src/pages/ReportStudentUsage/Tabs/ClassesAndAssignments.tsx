import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import ClassesAndAssignmentsTable from "./ClassesAndAssignmentsTable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    styles: {
      display: "inline-block",
      width: "260px",
      height: "130px",
      boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.10), 0px 9px 40px 0px rgba(0,0,0,0.12)",
      borderRadius: "8px",
      marginRight: "40px",
    },
    LiveScheduled: {
      boxShadow: "0px 4px 16px 0px rgba(14,120,213,0.80)",
      background: "#0e78d5",
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
  })
);

export default function () {
  const css = useStyles();
  return (
    <div>
      <div style={{ marginTop: "32px" }}>
        <div className={clsx(css.LiveScheduled, css.styles)}></div>
        <div className={css.styles}></div>
        <div className={css.styles}></div>
      </div>
      <div className={css.selectContainer}>
        <div className={css.text}>Live Scheduled(latest 3 moths)</div>
        <div>11111</div>
      </div>
      <ClassesAndAssignmentsTable />
    </div>
  );
}
