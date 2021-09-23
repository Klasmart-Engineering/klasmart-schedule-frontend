import React, { Fragment, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { PermissionType, usePermission } from "../../components/Permission";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { d } from "../../locale/LocaleManager";
import { setQuery } from "../../models/ModelContentDetailForm";
import { formatTeachingLoadList } from "../../models/ModelReports";
import { RootState } from "../../reducers";
import { getClassListByschool, getTeachingLoadList, TeachingLoadPayload } from "../../reducers/report";
import { ReportTitle } from "../ReportDashboard";
import { InfoTeacherLoad } from "./components/InfoTeacherLoad";
import { TeacherLoadChart } from "./components/TeacherLoadChart";
import { FilterTeacherLoad } from "./FilterTeacherLoad";
const ALL = "all";
const TIME_OFFSET = ((0 - new Date().getTimezoneOffset() / 60) * 3600);
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
  const { teachingLoadList, user_id } = teachingLoadOnloadState;
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
          const newTeacher_ids =
            perm.view_my_reports_614 &&
            !perm.view_reports_610 &&
            !perm.view_my_school_reports_611 &&
            !perm.view_my_organizations_reports_612
              ? user_id
              : ALL;
          history.push({
            search: setQuery(history.location.search, { school_id: value, teacher_ids: newTeacher_ids, class_ids: ALL }),
          });
          break;
        }
        case "teacher_ids": {
          const newValue = removeoneValueOfList(value as unknown as string[]) || ALL;
          history.push({
            search: setQuery(history.location.search, { school_id: school_id, teacher_ids: newValue, class_ids: ALL }),
          });
          if (newValue !== "all" && !newValue.includes(",")) {
            dispatch(getClassListByschool({ school_id, teacher_ids: newValue }));
          }
          dispatch(getTeachingLoadList({ teacher_ids: newValue.split(","), class_ids: [ALL], time_offset: TIME_OFFSET, metaLoading: true }));

          break;
        }
        case "class_ids":
          {
            const newTeacher_ids =
              perm.view_my_reports_614 &&
              !perm.view_reports_610 &&
              !perm.view_my_school_reports_611 &&
              !perm.view_my_organizations_reports_612
                ? user_id
                : teacher_ids;
            const newValue = removeoneValueOfList(value as unknown as string[]) || ALL;
            history.push({
              search: setQuery(history.location.search, { school_id: school_id, teacher_ids: newTeacher_ids, class_ids: newValue }),
            });
            // dispatch(
            //   getTeachingLoadList({
            //     school_id,
            //     teacher_ids: newTeacher_ids,
            //     class_ids: newValue,
            //     time_offset: TIME_OFFSET,
            //     metaLoading: true,
            //   })
            // );
          }
          break;
      }
    },
    [
      perm.view_my_reports_614,
      perm.view_reports_610,
      perm.view_my_school_reports_611,
      perm.view_my_organizations_reports_612,
      user_id,
      history,
      school_id,
      dispatch,
      teacher_ids,
    ]
  );
  useEffect(() => {
    // dispatch(teachingLoadOnload({ school_id, teacher_ids, class_ids, metaLoading: true }));
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

