import { Box, Divider, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { MockOptions, MockOptionsItem } from "../../api/extra";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
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

function getSpecificName(mockOptions: MockOptions, type: string, id: string) {
  if (type === "teacher" && mockOptions.teachers[0]) {
    return mockOptions.teachers.filter((item: MockOptionsItem) => item.id === id)[0].name;
  }
  if (type === "class" && mockOptions.classes[0]) {
    return mockOptions.classes.filter((item: MockOptionsItem) => item.id === id)[0].name;
  }
}

interface BriefIntroductionProps {
  value: QueryCondition;
  mockOptions: MockOptions;
  contentPreview: EntityContentInfoWithDetails;
}

export default function BriefIntroduction(props: BriefIntroductionProps) {
  const { value, mockOptions, contentPreview } = props;
  const css = useStyles();

  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Divider className={css.divider} />
      <Box className={css.container_intro}>
        <Box className={css.leftName}>
          {value.teacher_id && <span className={css.teacherAndClass}>{getSpecificName(mockOptions, "teacher", value.teacher_id)}</span>}
          {value.class_id && <span className={css.teacherAndClass}>{" - " + getSpecificName(mockOptions, "class", value.class_id)}</span>}
          {contentPreview.name && value.lesson_plan_id && <span className={css.lessonPlan}>{" - " + contentPreview.name}</span>}
          {/* <span className={css.teacherAndClass}>{'- Student 1'}</span> */}
        </Box>
        <Box className={css.rightContainer}>
          <Box className={clsx(css.rightContainer, css.marginItem)}>
            <div className={clsx(css.colorPart, css.blue)}></div>
            <span>
              {d("All").t("report_label_all")} {d("Achieved").t("report_label_achieved")}
            </span>
          </Box>
          <Box className={clsx(css.rightContainer, css.marginItem)}>
            <div className={clsx(css.colorPart, css.pink)}></div>
            <span>{d("Not Achieved").t("report_label_not_achieved")}</span>
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
