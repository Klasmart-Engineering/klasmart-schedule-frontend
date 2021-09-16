import { Box, createStyles, makeStyles, Paper, Theme } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import PercentCircle from "../../../components/Chart/PercentCircle";

interface IProps {
  title: string;
  value: number;
  total: number;
  active?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: 220,
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
      width: "40%",
    },
  })
);
export default function ({ title, value, total, active }: IProps) {
  const classes = useStyles();
  return (
    <Paper className={clsx(classes.container, active ? "active" : "")}>
      <Box className={clsx(classes.text, "text")}>
        <Box className={clsx(classes.title, "title")}>{title}</Box>
        <Box className={clsx(classes.value, "value")}>{total}</Box>
      </Box>
      <Box className={clsx(classes.chart, "chart")}>
        <Box>
          <PercentCircle
            width={90}
            height={90}
            {...{
              value,
              total: 1,
            }}
            fontSize={22}
            colors={active ? ["#fff", "#E4E4E4"] : ["#0E78D5", "#E4E4E4"]}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          />
        </Box>
      </Box>
    </Paper>
  );
}
