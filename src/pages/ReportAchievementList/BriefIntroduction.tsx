import { Box, Divider, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { EntityScheduleShortInfo } from "../../api/api.auto";
import { MockOptions, MockOptionsItem } from "../../api/extra";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { setQuery } from "../../models/ModelContentDetailForm";
import { QueryCondition } from "./types";

const useStyles = makeStyles(({ breakpoints }) => ({
  container_intro: {
    display: "flex",
    padding: "10px 0 20px 0",
    flexWrap: "wrap",
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
  lessonPlan: {
    color: "blue",
    fontWeight: 500,
    cursor: "pointer",
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
  student_name: string | undefined;
  backByLessonPlan?: (urlParams: string) => void;
  lessonPlanList?: EntityScheduleShortInfo[];
}

export default function BriefIntroduction(props: BriefIntroductionProps) {
  const { value, mockOptions, student_name, backByLessonPlan, lessonPlanList } = props;
  const css = useStyles();
  const [lessonPlanName, setLessonPlanName] = React.useState("");

  React.useEffect(() => {
    if (lessonPlanList && lessonPlanList.length) {
      const res = lessonPlanList.filter((item: EntityScheduleShortInfo) => item.id === value.lesson_plan_id)[0];
      if (res && res.name) {
        setLessonPlanName(res.name as typeof backByLessonPlan[keyof typeof backByLessonPlan]);
      }
    }
  }, [backByLessonPlan, lessonPlanList, value.lesson_plan_id]);

  const handleClick = () => {
    const urlParams =
      "?" +
      setQuery("", {
        teacher_id: value.teacher_id as string,
        class_id: value.class_id as string,
        lesson_plan_id: value.lesson_plan_id as string,
      });
    if (backByLessonPlan) backByLessonPlan(urlParams);
    // history.push({ pathname: '/report/achievement-list', search: '?' + setQuery('', { teacher_id: value.teacher_id as string, class_id: value.class_id as string, lesson_plan_id: value.lesson_plan_id as string }) });
  };

  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Divider className={css.divider} />
      <Box className={css.container_intro}>
        <Box className={css.leftName}>
          {value.teacher_id && <span className={css.teacherAndClass}>{getSpecificName(mockOptions, "teacher", value.teacher_id)}</span>}
          {value.class_id && <span className={css.teacherAndClass}>{" - " + getSpecificName(mockOptions, "class", value.class_id)}</span>}
          {value.lesson_plan_id && (
            <span style={{ cursor: value.student_id ? "pointer" : "default" }} className={css.lessonPlan} onClick={handleClick}>
              {" - " + lessonPlanName}
            </span>
          )}
          {value.student_id && <span className={css.teacherAndClass}>{"- " + student_name}</span>}
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
