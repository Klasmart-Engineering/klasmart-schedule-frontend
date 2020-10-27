import { Box, Divider, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import LayoutBox from "../../components/LayoutBox";
import { reportMiss } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ breakpoints }) => ({
  container_intro: {
    display: "flex",
    // justifyContent: "space-between",
    padding: "10px 0 20px 0",
    flexWrap: "wrap",
    // alignItems: 'center'
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
    // justifyContent: "flex-end",
    flexWrap: "wrap",
    [breakpoints.down("sm")]: {
      // justifyContent: "left",
      // marginTop: "10px",
    },
    "& div": {
      marginRight: "10px",
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
  divider: {
    marginTop: "20px",
  },
  leftName: {
    paddingTop: "15px",
    marginRight: "auto",
  },
  marginItem: {
    paddingTop: "15px",
  },
}));

export default function BriefIntroduction() {
  const css = useStyles();
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Divider className={css.divider} />
      <Box className={css.container_intro}>
        <Box className={css.leftName}>
          <span className={css.teacherAndClass}>Teacher 1 - Class 1 - </span>
          <span className={css.lessonPlan}>Lesson plan 1</span>
          <span className={css.teacherAndClass}> - Student 1</span>
        </Box>
        <Box className={css.rightContainer}>
          <Box className={clsx(css.rightContainer, css.marginItem)}>
            <div className={clsx(css.colorPart, css.blue)}></div>
            <span>{reportMiss("All Archieved", "all_archived")}</span>
          </Box>
          <Box className={clsx(css.rightContainer, css.marginItem)}>
            <div className={clsx(css.colorPart, css.pink)}></div>
            <span>{reportMiss("Non Archieved", "non_archived")}</span>
          </Box>
          <Box className={clsx(css.rightContainer, css.marginItem)}>
            <div className={clsx(css.colorPart, css.gray)}></div>
            <span>{reportMiss("Not Attempted", "not_attempted")}</span>
          </Box>
        </Box>
      </Box>
    </LayoutBox>
  );
}
