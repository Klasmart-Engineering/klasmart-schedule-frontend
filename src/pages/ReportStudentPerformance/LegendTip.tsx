import { Box, createStyles, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { d, reportMiss } from "../../locale/LocaleManager";
const useStyles = makeStyles(() =>
  createStyles({
    colorPart: {
      width: "32px",
      height: "20px",
    },
    blue: {
      backgroundColor: "#8693f0",
    },
    pink: {
      backgroundColor: "#fea69b",
    },
    gray: {
      backgroundColor: "#c9c9c9",
    },
    green: {
      backgroundColor: "#77DCB7",
    },
    deepBlue: {
      backgroundColor: "#8693F0",
    },
    rightContainer: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      "& div": {
        marginRight: "10px",
      },
      "& span": {
        color: "black",
        fontWeight: 500,
        fontSize: "14px",
      },
    },
    container: {
      marginBottom: 10,
    },
  })
);

export function LegendTip() {
  const css = useStyles();
  return (
    <>
      <div className={clsx(css.rightContainer, css.container)}>
        <Box className={clsx(css.rightContainer)}>
          <div className={clsx(css.colorPart, css.blue)}></div>
          <span>
            {d("All").t("report_label_all")} {d("Achieved").t("report_label_achieved")}
          </span>
        </Box>
        <Box className={clsx(css.rightContainer)}>
          <div className={clsx(css.colorPart, css.pink)}></div>
          <span>{d("Not Achieved").t("report_label_not_achieved")}</span>
        </Box>
        <Box className={clsx(css.rightContainer)}>
          <div className={clsx(css.colorPart, css.gray)}></div>
          <span>{d("Not Attempted").t("assess_option_not_attempted")}</span>
        </Box>
      </div>
    </>
  );
}

export function LegendTip2() {
  const css = useStyles();
  return (
    <>
      <div className={clsx(css.rightContainer, css.container)}>
        <Box className={clsx(css.rightContainer)}>
          <div className={clsx(css.colorPart, css.blue)}></div>
          <span>{reportMiss("Total duration", "label_report_total_duration")}</span>
        </Box>
        <Box className={clsx(css.rightContainer)}>
          <div className={clsx(css.colorPart, css.pink)}></div>
          <span>{reportMiss("Avg duration", "label_report_avg_duration")}</span>
        </Box>
      </div>
    </>
  );
}
