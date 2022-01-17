/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { getLastedMonths } from "@utilities/dateUtilities";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { d, t } from "../../../locale/LocaleManager";
import { sortByStudentName } from "../../../models/ModelReports";
import { RootState } from "../../../reducers";
import { getClassesAssignments, getClassesAssignmentsOverview, getClassesAssignmentsUnattended } from "../../../reducers/report";
import ClassesAndAssignmentsTable from "../components/ClassesAndAssignmentsTable";
import ClassFilter from "../components/ClassFilter";
import Statistics from "../components/Statistics";

const PAGESIZE = 10;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    styles: {
      display: "inline-block",
      width: "260px",
      height: "130px",
      boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.10), 0px 9px 40px 0px rgba(0,0,0,0.12)",
      borderRadius: "8px",
      marginRight: "40px",
      padding: "32px 20px",
      boxSizing: "border-box",
    },
    LiveScheduled: {
      boxShadow: "0px 4px 16px 0px rgba(14,120,213,0.80)",
      background: "#0e78d5",
      color: "#fff",
    },
    selectContainer: {
      display: "flex",
      justifyContent: "space-between",
      height: "112px",
      alignItems: "center",
    },
    text: {
      fontSize: "20px",
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
      color: "#000000",
    },
    left: {
      float: "left",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    },
    right: {
      float: "right",
    },
    textStyle: {
      fontSize: "16px",
      fontFamily: "Helvetica, Helvetica-Regular",
      fontWeight: 400,
    },
    number: {
      fontSize: "26px",
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
    },
  })
);

export function formatTime(time: any) {
  var date = new Date(time);
  return Math.floor(date.getTime() / 1000);
}
export default function ClassesAndAssignments() {
  const css = useStyles();
  const dispatch = useDispatch();
  const {
    classesAssignments,
    overview,
    classesAssignmentsUnattend: classesAssignmentsUnattendRow,
  } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const [classList, setClassList] = useState<MutiSelect.ISelect[] | undefined>(undefined);
  const [unattendedTableOpenId, setUnattendedTableOpenId] = useState<string | undefined>("");
  const [page, setPage] = React.useState(1);
  const [state, setState] = React.useState({ activeTab: 0 });

  const classIds = classList?.map((item) => item.value);
  const classesAssignmentsUnattend = classesAssignmentsUnattendRow.length
    ? classesAssignmentsUnattendRow.slice().sort(sortByStudentName("student_name"))
    : [];
  const topTitle = [
    d("Live Scheduled (latest 3 months)").t("report_student_usage_live"),
    d("Study Scheduled (latest 3 months)").t("report_student_usage_study_title"),
    d("Home Fun Scheduled (latest 3 months)").t("report_student_usage_home_fun_title"),
  ];
  const listTitle = [
    d("List of students missed live schedules").t("report_student_usage_missed_schedules"),
    d("List of students missed study").t("report_student_usage_missed_study"),
    d("List of students missed home fun").t("report_student_usage_missed_home_fun"),
  ];
  const topChatData = React.useMemo(() => {
    return [
      {
        title: t("report_student_usage_live_scheduled"),
        total: overview[0]?.count || 0,
        value: overview[0]?.ratio || 0,
        id: "live",
      },
      {
        title: t("report_student_usage_study"),
        total: overview[1]?.count || 0,
        value: overview[1]?.ratio || 0,
        id: "study",
      },
      {
        title: t("report_student_usage_home_fun"),
        total: overview[2]?.count || 0,
        value: overview[2]?.ratio || 0,
        id: "home_fun",
      },
    ];
  }, [overview]);
  const type = topChatData[state.activeTab].id;
  const durations = getLastedMonths(3);

  const handleclickUnattendedTable = React.useMemo(
    () => (class_id?: string) => {
      setUnattendedTableOpenId(class_id);
      if (!class_id) return;
      dispatch(getClassesAssignmentsUnattended({ metaLoading: true, class_id, query: { type, durations } }));
    },
    [dispatch, type, durations]
  );

  const handleTabClick = (index: number) => () => {
    setState({ activeTab: index });
    setUnattendedTableOpenId("");
  };

  const handleChangePage = React.useMemo(
    () => (page: number) => {
      if (!classList) return;
      setPage(page);
      const class_ids = classIds?.slice((page - 1) * PAGESIZE, (page - 1) * PAGESIZE + PAGESIZE);
      dispatch(getClassesAssignments({ metaLoading: true, class_ids, type, durations }));
    },
    // eslint-disable-next-line
    [dispatch, setPage, classList, type]
  );

  useEffect(() => {
    setPage(1);
    classList && dispatch(getClassesAssignments({ metaLoading: true, class_ids: classIds?.slice(0, PAGESIZE), type, durations }));
    // eslint-disable-next-line
  }, [dispatch, classList, type]);

  useEffect(() => {
    classList && dispatch(getClassesAssignmentsOverview({ metaLoading: true, class_ids: classIds, durations }));
    // eslint-disable-next-line
  }, [dispatch, classList]);

  return (
    <div>
      <div style={{ marginTop: "32px", display: "flex" }}>
        {topChatData.map((item, index) => {
          return (
            <Box key={index} style={{ paddingRight: 40 }} onClick={handleTabClick(index)}>
              <Statistics {...item} active={index === state.activeTab} />
            </Box>
          );
        })}
      </div>
      <div className={css.selectContainer}>
        <div className={css.text}>{topTitle[state.activeTab]}</div>
        <div>
          <ClassFilter onChange={setClassList} />
        </div>
      </div>
      <ClassesAndAssignmentsTable
        unattendedTableOpenId={unattendedTableOpenId}
        total={classList?.length || 0}
        page={page}
        handleChangePage={handleChangePage}
        classesAssignments={classesAssignments}
        classList={classList}
        classesAssignmentsUnattend={classesAssignmentsUnattend}
        handleclickUnattendedTable={handleclickUnattendedTable}
        type={type}
        listTitle={listTitle[state.activeTab]}
      />
    </div>
  );
}
