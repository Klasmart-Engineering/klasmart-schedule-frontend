import { Box, createStyles, makeStyles, Paper, Theme } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import PercentCircle from "../../../components/Chart/PercentCircle";

interface IProps {
  title: string;
  value: number;
  total: number;
  active?: boolean;
  tip: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: 228,
      height: 90,
      padding: 20,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      boxShadow: "0 0 10px #cccccc",
      cursor: "pointer",
      "&.active": {
        backgroundColor: "#0E78D5",
        boxShadow: "0 0 10px #0E78D5",
        "& > .text": {
          color: "#ffffff",
        },
      },
    },
    text: {
      width: "60%",
      overflow: "hidden",
    },
    title: {
      fontSize: 16,
    },
    value: {
      fontSize: 26,
      marginTop: 18,
      fontWeight: "bold",
    },
    chart: {
      // width: "40%",
      width: "90px",
      height: "90px",
    },
    tipStyle: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "63px",
      height: "70px",
      fontSize: "12px",
      textAlign: "center",
      wordBreak: "break-word",
    },
  })
);

export default function Statistics({ title, value, total, active, tip }: IProps) {
  const classes = useStyles();

  return (
    <Paper className={clsx(classes.container, active ? "active" : "")}>
      <Box className={clsx(classes.text, "text")}>
        <Box className={clsx(classes.title, "title")}>{title}</Box>
        <Box className={clsx(classes.value, "value")}>{total}</Box>
      </Box>
      <Box className={clsx(classes.chart, "chart")}>
        <Box style={{ position: "relative", height: "90px" }}>
          <PercentCircle
            width={90}
            height={90}
            {...{
              value,
              total: 1,
            }}
            fontSize={22}
            colors={active ? ["#fff", "#4A9ADF"] : ["#0E78D5", "#E4E4E4"]}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          />
          <Box className={classes.tipStyle} style={{ color: active ? "rgba(255, 255, 255, 0.5)" : "#999999" }}>
            {tip}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
