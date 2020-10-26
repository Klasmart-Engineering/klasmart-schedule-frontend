import { Grid, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import LayoutBox from "../../components/LayoutBox";
import { reportMiss } from "../../locale/LocaleManager";

const useStyles = makeStyles(() => ({
  container_intro: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 0",
  },
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
  rightContainer: {
    display: "flex",
    alignItems: "center",
    "& div": {
      margin: "0 10px",
    },
    "& span": {
      color: "black",
      fontWeight: 500,
      fontSize: "14px",
    },
  },
  lessonPlan: {
    color: "blue",
    fontWeight: 500,
  },
  teacherAndClass: {
    color: "black",
    fontWeight: 500,
  },
}));

export default function BriefIntroduction() {
  const css = useStyles();
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Grid container className={css.container_intro}>
        <Grid item md={3} lg={5} xl={7}>
          <span className={css.teacherAndClass}>Teacher 1 - Class 1 - </span>
          <span className={css.lessonPlan}>Lesson plan 1</span>
          <span className={css.teacherAndClass}> - Student 1</span>
        </Grid>
        <Grid container md={9} lg={7} xl={5} justify="flex-end" item className={css.rightContainer}>
          <div className={css.rightContainer}>
            <div className={clsx(css.colorPart, css.blue)}></div>
            <span>{reportMiss("All Archieved", "all_archived")}</span>
          </div>
          <div className={clsx(css.rightContainer)}>
            <div className={clsx(css.colorPart, css.pink)}></div>
            <span>{reportMiss("Non Archieved", "non_archived")}</span>
          </div>
          <div className={css.rightContainer}>
            <div className={clsx(css.colorPart, css.gray)}></div>
            <span>{reportMiss("Not Attempted", "not_attempted")}</span>
          </div>
        </Grid>
      </Grid>
    </LayoutBox>
  );
}
