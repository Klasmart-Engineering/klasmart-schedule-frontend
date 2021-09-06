import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    lineStyle: {
      width: "1099px",
      height: "746px",
      opacity: 1,
      background: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.20), 0px 1px 10px 0px rgba(0,0,0,0.12), 0px 4px 5px 0px rgba(0,0,0,0.14)",
      padding: "24px 24px 40px 24px",
      boxSizing: "border-box",
    },
    pieStyle: {
      width: "369px",
      height: "746px",
      opacity: 1,
      background: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.20), 0px 1px 10px 0px rgba(0,0,0,0.12), 0px 4px 5px 0px rgba(0,0,0,0.14)",
    },
    detailStyle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textStyle: {
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
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
      <div className={css.lineStyle}>
        <div className={css.detailStyle}>
          <div className={css.textStyle}>Class Registration Details</div>
          <div>11111</div>
        </div>
        <div></div>
      </div>
      <div className={css.pieStyle}></div>
    </div>
  );
}
