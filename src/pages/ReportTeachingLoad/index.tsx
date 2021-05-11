import React, { Fragment, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { PermissionType, usePermission } from "../../components/Permission";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { d } from "../../locale/LocaleManager";
import { setQuery } from "../../models/ModelContentDetailForm";
import { formatTeachingLoadList } from "../../models/ModelReports";
import { RootState } from "../../reducers";
import { getClassListByschool, getTeachingLoadList, teachingLoadOnload, TeachingLoadPayload } from "../../reducers/report";
import { ReportTitle } from "../ReportDashboard";
import { FilterTeacherLoad } from "./FilterTeacherLoad";
import { InfoTeacherLoad } from "./InfoTeacherLoad";
import { TeacherLoadChart } from "./TeacherLoadChart";
const ALL = "all";
const TIME_OFFSET = ((0 - new Date().getTimezoneOffset() / 60) * 3600).toString();
const removeoneValueOfList = (value: string[]): string => {
  return value[value.length - 1] === ALL ? "all" : value.filter((id) => id !== ALL).join(",");
};

const useTeacherLoadReportQuery = () => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const teacher_ids = query.get("teacher_ids") || ALL;
    const class_ids = query.get("class_ids") || ALL;
    const school_id = query.get("school_id") || ALL;
    return { teacher_ids, class_ids, school_id };
  }, [search]);
};
export default function ReportTeachingLoad() {
  const teacherLoadQuery = useTeacherLoadReportQuery();
  const { teacher_ids, school_id, class_ids } = teacherLoadQuery;
  const dispatch = useDispatch();
  const history = useHistory();
  const teachingLoadOnloadState = useSelector<RootState, RootState["report"]["teachingLoadOnload"]>(
    (state) => state.report.teachingLoadOnload
  );
  const { teachingLoadList } = teachingLoadOnloadState;
  const perm = usePermission([
    PermissionType.view_reports_610,
    PermissionType.view_my_reports_614,
    PermissionType.view_my_organizations_reports_612,
    PermissionType.view_my_school_reports_611,
  ]);

  const handleChange = useMemo(
    () => (value: string, tab: keyof TeachingLoadPayload) => {
      switch (tab) {
        case "school_id": {
          history.push({
            search: setQuery(history.location.search, { school_id: value, teacher_ids: ALL, class_ids: ALL }),
          });
          break;
        }
        case "teacher_ids": {
          const newValue = removeoneValueOfList((value as unknown) as string[]);
          console.log("newValue =", newValue);
          history.push({
            search: setQuery(history.location.search, { school_id: school_id, teacher_ids: newValue, class_ids: ALL }),
          });
          if (newValue !== "all" && !newValue.includes(",")) {
            dispatch(getClassListByschool({ school_id, teacher_ids: newValue }));
          }
          dispatch(getTeachingLoadList({ school_id, teacher_ids: newValue, class_ids: ALL, time_offset: TIME_OFFSET, metaLoading: true }));

          break;
        }
        case "class_ids":
          {
            const newValue = removeoneValueOfList((value as unknown) as string[]);
            history.push({
              search: setQuery(history.location.search, { school_id: school_id, teacher_ids: teacher_ids, class_ids: newValue }),
            });
            dispatch(getTeachingLoadList({ school_id, teacher_ids, class_ids: newValue, time_offset: TIME_OFFSET, metaLoading: true }));
          }
          break;
      }
    },
    [school_id, teacher_ids, dispatch, history]
  );
  useEffect(() => {
    dispatch(teachingLoadOnload({ school_id, teacher_ids, class_ids, metaLoading: true }));
    // eslint-disable-next-line
  }, [dispatch, school_id]);

  return (
    <Fragment>
      <ReportTitle title={d("Teaching Load").t("report_label_teaching_load")}></ReportTitle>
      <FilterTeacherLoad value={teacherLoadQuery} onChange={handleChange} teachingLoadOnload={teachingLoadOnloadState}></FilterTeacherLoad>
      {perm.view_reports_610 || perm.view_my_reports_614 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612 ? (
        teachingLoadList.items && teachingLoadList.items.length > 0 ? (
          <>
            <InfoTeacherLoad />
            <TeacherLoadChart
              data={formatTeachingLoadList(teachingLoadList?.items).formatedData}
              xLabels={formatTeachingLoadList(teachingLoadList?.items).xLabels}
            />
          </>
        ) : (
          emptyTip
        )
      ) : (
        permissionTip
      )}
    </Fragment>
  );
}
ReportTeachingLoad.routeBasePath = "/report/teaching-load";
ReportTeachingLoad.routeRedirectDefault = "/report/teaching-load";
