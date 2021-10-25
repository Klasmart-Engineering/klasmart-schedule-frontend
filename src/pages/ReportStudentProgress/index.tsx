import React from "react";
import { useDispatch } from "react-redux";
import LayoutBox from "../../components/LayoutBox";
import TabPages from "../../components/TabPages";
import { t } from "../../locale/LocaleManager";
import { getStudentSubjectsByOrg } from "../../reducers/report";
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
      label: "Learning Outcomes Achievement",
      index: 0,
      display: true,
      Component: LearningOutcomesAchievement,
    },
    {
      label: "Class Attendance",
      index: 1,
      display: true,
      Component: ClassAttendance,
    },
    {
      label: "Assignment Completion",
      index: 2,
      display: true,
      Component: AssignmentCompletion,
    },
  ];
  React.useEffect(() => {
    dispatch(
      getStudentSubjectsByOrg({
        metaLoading: true,
      })
    );
  }, [dispatch]);
  return (
    <>
      <ReportTitle title={t("report_label_student_progress_report")}></ReportTitle>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <StudentSubjectFilter
          onInitial={(allSubjectId) => {
            setState({
              ...state,
              allSubjectId,
            });
          }}
          onChange={(classId, studentId, selectedSubjectId) => {
            setState({
              ...state,
              classId,
              studentId,
              selectedSubjectId,
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
