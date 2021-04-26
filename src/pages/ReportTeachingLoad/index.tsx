import React, { Fragment, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { reportMiss } from "../../locale/LocaleManager";
import { RootState } from "../../reducers";
import { teachingLoadOnload, TeachingLoadPayload } from "../../reducers/report";
import { ReportTitle } from "../ReportDashboard";
import { FilterTeacherLoad } from "./FilterTeacherLoad";

const useTeacherLoadReportQuery = () => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const teacher_ids = query.get("teacher_id") || "all";
    const class_ids = query.get("class_id") || "all";
    const school_id = query.get("school_id") || "all";
    return { teacher_ids, class_ids, school_id };
  }, [search]);
};
export default function ReportTeachingLoad() {
  const teacherLoadQuery = useTeacherLoadReportQuery();
  const dispatch = useDispatch();
  const teachingLoadOnloadState = useSelector<RootState, RootState["report"]["teachingLoadOnload"]>(
    (state) => state.report.teachingLoadOnload
  );

  console.log(" teacherLoadQuery = , teachingLoadOnloadState =  ", teacherLoadQuery, teachingLoadOnloadState);

  const handleChange = useMemo(() => (value: string, tab: keyof TeachingLoadPayload) => {}, []);
  useEffect(() => {
    dispatch(teachingLoadOnload({ ...teacherLoadQuery, metaLoading: true }));
  }, [dispatch, teacherLoadQuery]);

  return (
    <Fragment>
      <ReportTitle title={reportMiss("Teaching Load", "report_label_teaching_load")}></ReportTitle>;
      <FilterTeacherLoad value={teacherLoadQuery} onChange={handleChange} teachingLoadOnload={teachingLoadOnloadState}></FilterTeacherLoad>
    </Fragment>
  );
}
ReportTeachingLoad.routeBasePath = "/report/teaching-load";
ReportTeachingLoad.routeRedirectDefault = "/report/teaching-load";
