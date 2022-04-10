import { enableNewGql } from "@api/extra";
import { uniq } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import LayoutBox from "../../components/LayoutBox";
import TabPages from "../../components/TabPages";
import { d, t } from "../../locale/LocaleManager";
import { getStudentSubjectsByOrg, getStudentSubjectsByOrgNew } from "../../reducers/report";
import { ReportTitle } from "../ReportDashboard";
import StudentSubjectFilter from "./components/StudentSubjectFilter";
import { AssignmentCompletion, ClassAttendance, LearningOutcomesAchievement } from "./Tabs";

interface IState {
  classId: string;
  studentId: string;
  allSubjectId: string[];
  selectedSubjectId: string[];
}

export const SelectContext = React.createContext<IState>({
  classId: "",
  studentId: "",
  allSubjectId: [],
  selectedSubjectId: [],
});

export default function ReportStudentProgress() {
  const dispatch = useDispatch();
  const [state, setState] = React.useState<IState>({
    classId: "",
    studentId: "",
    allSubjectId: [],
    selectedSubjectId: [],
  });
  const tabs: ITabItem[] = [
    {
      label: d("Learning Outcomes Achievement").t("report_label_learning_outcomes_achievement"),
      index: 0,
      display: true,
      Component: LearningOutcomesAchievement,
    },
    {
      label: d("Class Attendance").t("report_label_class_attendance"),
      index: 1,
      display: true,
      Component: ClassAttendance,
    },
    {
      label: d("Assignment Completion").t("report_label_assignment_completion"),
      index: 2,
      display: true,
      Component: AssignmentCompletion,
    },
  ];
  React.useEffect(() => {
    if (enableNewGql) {
      dispatch(getStudentSubjectsByOrgNew({ metaLoading: true }));
    } else {
      dispatch(getStudentSubjectsByOrg({ metaLoading: true }));
    }
  }, [dispatch]);
  return (
    <>
      <ReportTitle title={t("report_label_student_progress_report")}></ReportTitle>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <StudentSubjectFilter
          onInitial={(allSubjectId) => {
            setState({
              ...state,
              // allSubjectId: allSubjectId.concat([""]),
              allSubjectId: uniq(allSubjectId.concat([""])),
            });
          }}
          onChange={(classId, studentId, selectedSubjectId) => {
            setState({
              ...state,
              classId,
              studentId,
              selectedSubjectId: uniq(selectedSubjectId),
            });
          }}
        />
        <SelectContext.Provider value={state}>
          <TabPages tabs={tabs} />
        </SelectContext.Provider>
      </LayoutBox>
    </>
  );
}

ReportStudentProgress.routeBasePath = "/report/student-progress";
