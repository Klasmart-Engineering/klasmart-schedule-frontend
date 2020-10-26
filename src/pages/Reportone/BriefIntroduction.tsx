import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

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
  },
  lessonPlan: {
    color: "blue",
  },
}));

export default function BriefIntroduction() {
  const css = useStyles();
  return (
    <div className={css.container_intro}>
      <div>
        Teacher 1 - Class 1 - <span className={css.lessonPlan}>Lesson plan 1</span>
      </div>
      <div className={css.rightContainer}>
        <div className={css.rightContainer}>
          <div className={clsx(css.colorPart, css.blue)}></div>
          <span>All Archieved</span>
        </div>
        <div className={clsx(css.rightContainer)}>
          <div className={clsx(css.colorPart, css.pink)}></div>
          <span>Non Archieved</span>
        </div>
        <div className={css.rightContainer}>
          <div className={clsx(css.colorPart, css.gray)}></div>
          <span>Not Attempted</span>
        </div>
      </div>
    </div>
  );
}

BriefIntroduction.routeBasePath = "/report";
