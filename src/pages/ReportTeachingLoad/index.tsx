import React from "react";
import { useDispatch } from "react-redux";
import LayoutBox from "../../components/LayoutBox";
import TabPages from "../../components/TabPages";
import { d } from "../../locale/LocaleManager";
import { getTeachersByOrg } from "../../reducers/report";
import { ReportTitle } from "../ReportDashboard";
import TeacherFilter from "./components/TeacherFilter";
import { Assignments, Lessons, NextSevenDaysLessonLoad } from "./Tabs";

interface IState {
  teachers: MutiSelect.ISelect[];
  classes: MutiSelect.ISelect[];
}

export const SelectContext = React.createContext<IState>({
  teachers: [],
  classes: [],
});

export default function ReportTeachingLoad() {
  const dispatch = useDispatch();
  const [state, setState] = React.useState<IState>({
    teachers: [],
    classes: [],
  });
  const tabs: ITabItem[] = [
    {
      label: d("Lessons").t("report_label_lessons"),
      index: 0,
      display: true,
      Component: Lessons,
    },
    {
      label: d("Assignments").t("report_label_assignments"),
      index: 1,
      display: true,
      Component: Assignments,
    },

    {
      label: d("Next 7 Days Lesson Load").t("report_label_lesson_load"),
      index: 2,
      display: true,
      Component: NextSevenDaysLessonLoad,
    },
  ];
  React.useEffect(() => {
    dispatch(
      getTeachersByOrg({
        metaLoading: true,
      })
    );
  }, [dispatch]);
  return (
    <>
      <ReportTitle title={d("Teacher Load Report").t("report_label_teaching_load")}></ReportTitle>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <TeacherFilter
          onChange={(teachers, classes) => {
            setState({
              teachers,
              classes,
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

ReportTeachingLoad.routeBasePath = "/report/teaching-load";
ReportTeachingLoad.routeRedirectDefault = "/report/teaching-load";
