import React, { ReactNode } from "react";
import { useQeuryPermissionOfMeQuery } from "../../api/api-ko.auto";
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
  create_schedule_paage_501 = "create_schedule_paage_501",
  view_my_calendar_510 = "view_my_calendar_510",
  view_org_calendar__511 = "view_org_calendar__511",
  create_event__520 = "create_event__520",
  edit_event__530 = "edit_event__530",
  delete_event_540 = "delete_event_540",
  schedule_search_582 = "schedule_search_582",
  view_school_calendar_512 = "view_school_calendar_512",
}

// const mockPermissionList = [
//   PermissionType.create_content_page_201,
//   PermissionType.unpublished_content_page_202,
//   PermissionType.pending_content_page_203,
//   PermissionType.published_content_page_204,
// ];

const usePermissionList = () => {
  const organization_id = apiOrganizationOfPage() || "";
  const { loading, error, data } = useQeuryPermissionOfMeQuery({ variables: { organization_id } });
  const result: PermissionType[] = [];
  data?.me?.membership?.roles?.forEach((role) =>
    role?.permissions?.forEach((permission) => {
      if (permission) result.push(permission.permission_name as PermissionType);
    })
  );
  return { loading, error, data: result };
};

const isPermissionType = (x: PermissionType | PermissionType[]): x is PermissionType => !Array.isArray(x);

export type PermissionResult<V> = V extends PermissionType[] ? Record<PermissionType, boolean> : boolean;

export function usePermission<V extends PermissionType | PermissionType[]>(value: V): PermissionResult<V> {
  const { data: permissionList } = usePermissionList();

  let result: PermissionResult<PermissionType> | PermissionResult<PermissionType[]>;
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
  const perm = !Object.values(pemJson).some((v) => !v);
  if (render) return <>{render(perm)}</>;
  return perm ? <>{children}</> : null;
}
