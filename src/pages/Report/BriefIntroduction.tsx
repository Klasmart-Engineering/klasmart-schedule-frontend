import { Box, Divider, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { MockOptions } from "../../api/extra";
import LayoutBox from "../../components/LayoutBox";
import { d, reportMiss } from "../../locale/LocaleManager";
import { QueryCondition } from "./types";

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

interface BriefIntroductionProps {
  value: QueryCondition;
  mockOptions: MockOptions;
}

export default function BriefIntroduction(props: BriefIntroductionProps) {
  const { value } = props;
  const css = useStyles();
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Divider className={css.divider} />
      <Box className={css.container_intro}>
        <Box className={css.leftName}>
          {value.teacher && <span className={css.teacherAndClass}>{"Teacher " + value.teacher} - </span>}
          {value.class_search && <span className={css.teacherAndClass}>{"Class " + value.class_search} - </span>}
          {value.lesson_plain_id && <span className={css.lessonPlan}>{"Lesson Plan " + value.lesson_plain_id}</span>}
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
            <span>{d("Not Attempted").t("assess_option_not_attempted")}</span>
          </Box>
        </Box>
      </Box>
    </LayoutBox>
  );
}
