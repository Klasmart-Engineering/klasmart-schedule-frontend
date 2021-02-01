import { Box, Divider, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { useHistory } from "react-router-dom";
import { User } from "../../api/api-ko-schema.auto";
import { EntityScheduleShortInfo } from "../../api/api.auto";
import LayoutBox from "../../components/LayoutBox";
import { PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { GetReportMockOptionsResponse } from "../../reducers/report";
import { ClassItem, QueryCondition } from "./types";

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

function getSpecificName(reportMockOptions: GetReportMockOptionsResponse, type: string, id: string) {
  const teacherList = reportMockOptions.teacherList;
  const classList =
    reportMockOptions.classList &&
    reportMockOptions.classList.user?.classesTeaching &&
    (reportMockOptions.classList.user.classesTeaching as ClassItem[]);
  if (type === "teacher" && teacherList) {
    const temp = teacherList.filter((item: Pick<User, "user_id" | "user_name">) => item.user_id === id)[0];
    return temp ? temp.user_name : "";
  }
  if (type === "class" && classList) {
    const tempClass = classList.filter((item: ClassItem) => item.class_id === id)[0];
    return tempClass ? tempClass.class_name : "";
  }
}

interface BriefIntroductionProps {
  value: QueryCondition;
  student_name: string | undefined;
  hiddenLegend?: Boolean;
  backByLessonPlan?: (urlParams: string) => void;
  reportMockOptions?: GetReportMockOptionsResponse;
}

export default function BriefIntroduction(props: BriefIntroductionProps) {
  const { value, student_name, backByLessonPlan, reportMockOptions, hiddenLegend } = props;
  const lessonPlanList = reportMockOptions?.lessonPlanList;
  const css = useStyles();
  const history = useHistory();
  const [lessonPlanName, setLessonPlanName] = React.useState("");
  const perm = usePermission([
    PermissionType.view_reports_610,
    PermissionType.view_my_reports_614,
    PermissionType.view_my_school_reports_611,
    PermissionType.view_my_organizations_reports_612,
  ]);
  React.useEffect(() => {
    if (lessonPlanList && lessonPlanList.length) {
      const res = lessonPlanList.filter((item: EntityScheduleShortInfo) => item.id === value.lesson_plan_id)[0];
      if (res && res.name) {
        setLessonPlanName(res.name as typeof backByLessonPlan[keyof typeof backByLessonPlan]);
      }
    }
  }, [backByLessonPlan, lessonPlanList, value.lesson_plan_id]);

  const handleClick = () => {
    // history.go(-1)
    // const urlParams =
    //   "?" +
    //   setQuery("", {
    //     teacher_id: value.teacher_id as string,
    //     class_id: value.class_id as string,
    //     lesson_plan_id: value.lesson_plan_id as string,
    //   });
    if (backByLessonPlan) {
      history.go(-1);
    }
  };

  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Divider className={css.divider} />
      {(perm.view_my_reports_614 || perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organization_reports_612) && (
        <Box className={css.container_intro}>
          <Box className={css.leftName}>
            {value.teacher_id && (
              <span className={css.teacherAndClass}>
                {getSpecificName(reportMockOptions as GetReportMockOptionsResponse, "teacher", value.teacher_id)}
              </span>
            )}
            {value.class_id && (
              <span className={css.teacherAndClass}>
                {" - " + getSpecificName(reportMockOptions as GetReportMockOptionsResponse, "class", value.class_id)}
              </span>
            )}
            {value.lesson_plan_id && (
              <span style={{ cursor: value.student_id ? "pointer" : "default" }} className={css.lessonPlan} onClick={handleClick}>
                {" - " + lessonPlanName}
              </span>
            )}
            {value.student_id && <span className={css.teacherAndClass}>{"- " + student_name}</span>}
          </Box>
          {!hiddenLegend && (
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
          )}
        </Box>
      )}
    </LayoutBox>
  );
}
