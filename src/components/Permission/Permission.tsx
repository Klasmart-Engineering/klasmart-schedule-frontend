import React, { ReactNode } from "react";
import { QeuryMeQuery, useQeuryMeQuery } from "../../api/api-ko.auto";
import { apiOrganizationOfPage } from "../../api/extra";

export enum PermissionType {
  create_content_page_201 = "create_content_page_201",
  unpublished_content_page_202 = "unpublished_content_page_202",
  pending_content_page_203 = "pending_content_page_203",
  published_content_page_204 = "published_content_page_204",
  archived_content_page_205 = "archived_content_page_205",
  create_lesson_material_220 = "create_lesson_material_220",
  create_lesson_plan_221 = "create_lesson_plan_221",
  edit_org_published_content_235 = "edit_org_published_content_235",
  edit_lesson_material_metadata_and_content_236 = "edit_lesson_material_metadata_and_content_236",
  edit_lesson_plan_metadata_237 = "edit_lesson_plan_metadata_237",
  edit_lesson_plan_content_238 = "edit_lesson_plan_content_238",
  approve_pending_content_271 = "approve_pending_content_271",
  reject_pending_content_272 = "reject_pending_content_272",
  archive_published_content_273 = "archive_published_content_273",
  republish_archived_content_274 = "republish_archived_content_274",
  delete_archived_content_275 = "delete_archived_content_275",
  associate_learning_outcomes_284 = "associate_learning_outcomes_284",
  create_asset_page_301 = "create_asset_page_301",
  create_asset_320 = "create_asset_320",
  delete_asset_340 = "delete_asset_340",
  attend_live_class_as_a_student_187 = "attend_live_class_as_a_student_187",
  attend_live_class_as_a_teacher_186 = "attend_live_class_as_a_teacher_186",
  schedule_500 = "schedule_500",
  create_schedule_page_501 = "create_schedule_page_501",
  view_my_calendar_510 = "view_my_calendar_510",
  view_org_calendar_511 = "view_org_calendar_511",
  create_event_520 = "create_event_520",
  edit_event_530 = "edit_event_530",
  delete_event_540 = "delete_event_540",
  schedule_search_582 = "schedule_search_582",
  view_school_calendar_512 = "view_school_calendar_512",
  assessments_400 = "assessments_400",
  unpublished_page_402 = "unpublished_page_402",
  pending_page_403 = "pending_page_403",
  learning_outcome_page_404 = "learning_outcome_page_404",
  assessments_page_406 = "assessments_page_406",
  view_my_unpublished_learning_outcome_410 = "view_my_unpublished_learning_outcome_410",
  view_org_unpublished_learning_outcome_411 = "view_org_unpublished_learning_outcome_411",
  view_my_pending_learning_outcome_412 = "view_my_pending_learning_outcome_412",
  view_org_pending_learning_outcome_413 = "view_org_pending_learning_outcome_413",
  view_completed_assessments_414 = "view_completed_assessments_414",
  view_in_progress_assessments_415 = "view_in_progress_assessments_415",
  view_published_learning_outcome_416 = "view_published_learning_outcome_416",
  create_learning_outcome_421 = "create_learning_outcome_421",
  edit_my_unpublished_learning_outcome_430 = "edit_my_unpublished_learning_outcome_430",
  edit_published_learning_outcome_436 = "edit_published_learning_outcome_436",
  edit_attendance_for_in_progress_assessment_438 = "edit_attendance_for_in_progress_assessment_438",
  edit_in_progress_assessment_439 = "edit_in_progress_assessment_439",
  delete_my_unpublished_learning_outcome_444 = "delete_my_unpublished_learning_outcome_444",
  delete_org_unpublished_learning_outcome_445 = "delete_org_unpublished_learning_outcome_445",
  delete_my_pending_learning_outcome_446 = "delete_my_pending_learning_outcome_446",
  delete_org_pending_learning_outcome_447 = "delete_org_pending_learning_outcome_447",
  delete_published_learning_outcome_448 = "delete_published_learning_outcome_448",
  approve_pending_learning_outcome_481 = "approve_pending_learning_outcome_481",
  reject_pending_learning_outcome_482 = "reject_pending_learning_outcome_482",
  add_learning_outcome_to_content_485 = "add_learning_outcome_to_content_485",
  view_org_completed_assessments_424 = "view_org_completed_assessments_424",
  view_org_in_progress_assessments_425 = "view_org_in_progress_assessments_425",
  view_school_completed_assessments_426 = "view_school_completed_assessments_426",
  view_school_in_progress_assessments_427 = "view_school_in_progress_assessments_427",
  teacher_reports_603 = "teacher_reports_603",
  view_reports_610 = "view_reports_610",
  view_my_reports_614 = "view_my_reports_614",
  create_my_schedule_events_521 = "create_my_schedule_events_521",
  create_folder_289 = "create_folder_289",
  publish_featured_content_for_all_hub_79000 = "publish_featured_content_for_all_hub_79000",
  create_my_schools_schedule_events_522 = "create_my_schools_schedule_events_522",
  view_my_school_reports_611 = "view_my_school_reports_611",
  view_my_organizations_reports_612 = "view_my_organization_reports_612",
}

const isPermissionType = (x: PermissionType | PermissionType[]): x is PermissionType => !Array.isArray(x);

export type PermissionResult<V> = V extends PermissionType[] ? Record<PermissionType, boolean> : boolean;

export function hasPermissionOfMe<V extends PermissionType | PermissionType[]>(value: V, me: QeuryMeQuery["me"]): PermissionResult<V> {
  const permissionList: PermissionType[] = [];
  let result: PermissionResult<PermissionType> | PermissionResult<PermissionType[]>;
  me?.membership?.roles?.forEach((role) => {
    role?.permissions?.forEach((permission) => {
      if (permission) permissionList.push(permission.permission_name as PermissionType);
    });
  });
  if (isPermissionType(value)) {
    result = permissionList.includes(value);
  } else {
    result = (value as PermissionType[]).reduce((s, name) => {
      s[name] = permissionList.includes(name);
      return s;
    }, {} as PermissionResult<PermissionType[]>);
  }
  return result as PermissionResult<V>;
}

export function usePermission<V extends PermissionType | PermissionType[]>(value: V): PermissionResult<V> {
  const organization_id = apiOrganizationOfPage() || "";
  const { data } = useQeuryMeQuery({ variables: { organization_id }, fetchPolicy: "cache-first" });
  return hasPermissionOfMe<V>(value, data?.me);
}

export interface PermissionProps<V> {
  value: V;
  render?: (value: PermissionResult<V>) => ReactNode;
  children?: ReactNode;
}
export function Permission<V extends PermissionType | PermissionType[]>(props: PermissionProps<V>) {
  const { value, render, children } = props;
  const perm = usePermission(value);
  if (render) return <>{render(perm as any)}</>;
  return perm ? <>{children}</> : null;
}

export interface PermissionOrProps {
  value: PermissionType[];
  render?: (value: boolean) => ReactNode;
  children?: ReactNode;
}
export function PermissionOr(props: PermissionOrProps) {
  const { value, render, children } = props;
  const pemJson = usePermission(value);
  const perm = Object.values(pemJson).some((v) => v);
  if (render) return <>{render(perm)}</>;
  return perm ? <>{children}</> : null;
}
