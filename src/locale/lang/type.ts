import { IntlFormatters, MessageDescriptor } from "react-intl";

type FormatMessageValue<T> = NonNullable<Parameters<IntlFormatters<T>["formatMessage"]>[1]> extends Record<any, infer V> ? V : never;
export type LangName = "en" | "k" | "cn";

type LangRecord<T = string> =
  | { id: "assess_label__reject_reason"; description: "Reject Reason"; values: undefined }
  | { id: "library_label_title"; description: "Title"; values: undefined }
  | { id: "library_label_suitable_age"; description: "Suitable Age"; values: undefined }
  | { id: "library_label_view_in"; description: "View in"; values: undefined }
  | { id: "library_label_kidsloop_live"; description: "KidsLoop Live"; values: undefined }
  | { id: "library_label_display_by"; description: "Display By"; values: undefined }
  | { id: "library_label_scrollable_tabs"; description: "scrollable force tabs example"; values: undefined }
  | { id: "library_label_archive"; description: "Archive"; values: undefined }
  | { id: "library_label_create"; description: "Create"; values: undefined }
  | { id: "library_label_cancel"; description: "Cancel"; values: undefined }
  | { id: "library_label_save"; description: "Save"; values: undefined }
  | { id: "library_label_publish"; description: "Publish"; values: undefined }
  | { id: "library_msg_publish_content"; description: "Are you sure you want to publish this content?"; values: undefined }
  | { id: "library_label_ok"; description: "OK"; values: undefined }
  | { id: "library_label_create_new_content"; description: "Create New Content"; values: undefined }
  | { id: "library_label_lesson_material"; description: "Lesson Material"; values: undefined }
  | { id: "library_label_lesson_plan"; description: "Lesson Plan"; values: undefined }
  | { id: "library_label_details"; description: "Details"; values: undefined }
  | { id: "library_label_learning_outcomes"; description: "Learning Outcomes"; values: undefined }
  | { id: "library_msg_coming_soon"; description: "Coming soon..."; values: undefined }
  | { id: "library_label_assets"; description: "Assets"; values: undefined }
  | { id: "library_label_material_name"; description: "Material Name"; values: undefined }
  | { id: "library_label_thumbnail"; description: "Thumbnail"; values: undefined }
  | { id: "library_label_duration"; description: "Duration(Minutes)"; values: undefined }
  | { id: "library_label_program"; description: "Program"; values: undefined }
  | { id: "library_label_subject"; description: "Subject"; values: undefined }
  | { id: "library_label_development"; description: "Development"; values: undefined }
  | { id: "library_label_skills"; description: "Skills"; values: undefined }
  | { id: "library_label_age"; description: "Age"; values: undefined }
  | { id: "library_label_grade"; description: "Grade"; values: undefined }
  | { id: "library_label_visibility_settings"; description: "Visibility Settings"; values: undefined }
  | { id: "library_label_description"; description: "Description"; values: undefined }
  | { id: "library_label_keywords"; description: "Keywords"; values: undefined }
  | { id: "library_label_plan_name"; description: "Plan Name"; values: undefined }
  | { id: "library_label_start"; description: "Start"; values: undefined }
  | { id: "library_msg_drag_lesson_material"; description: "Drag and drop a lesson material here"; values: undefined }
  | { id: "library_label_published"; description: "Published"; values: undefined }
  | { id: "library_label_pending"; description: "Pending"; values: undefined }
  | { id: "library_label_unpublished"; description: "Unpublished"; values: undefined }
  | { id: "library_label_archived"; description: "Archived"; values: undefined }
  | { id: "library_label_empty"; description: "Empty"; values: undefined }
  | { id: "library_label_search"; description: "Search"; values: undefined }
  | { id: "library_msg_no_results_found"; description: "No results found"; values: undefined }
  | { id: "library_label_my_only"; description: "My Only"; values: undefined }
  | { id: "library_label_bulk_actions"; description: "Bulk Actions"; values: undefined }
  | { id: "library_label_remove"; description: "Remove"; values: undefined }
  | { id: "library_msg_remove_content"; description: "Are you sure you want to remove this content?"; values: undefined }
  | { id: "library_label_sort_by"; description: "Sort By"; values: undefined }
  | { id: "library_label_content_name_atoz"; description: "Content Name(A-Z)"; values: undefined }
  | { id: "library_label_content_name_ztoa"; description: "Content Name(Z-A)"; values: undefined }
  | { id: "library_label_created_on_newtoold"; description: "Created On(New-Old)"; values: undefined }
  | { id: "library_label_created_on_oldtonew"; description: "Created On(Old-New)"; values: undefined }
  | { id: "library_label_material"; description: "Material"; values: undefined }
  | { id: "library_label_plan"; description: "Plan"; values: undefined }
  | { id: "library_label_delete"; description: "Delete"; values: undefined }
  | { id: "library_msg_delete_content"; description: "Are you sure you want to delete this content?"; values: undefined }
  | { id: "library_label_draft"; description: "Draft"; values: undefined }
  | { id: "library_label_waiting_for_approval"; description: "Waiting for Approval"; values: undefined }
  | { id: "library_label_rejected"; description: "Rejected"; values: undefined }
  | { id: "library_label_republish"; description: "Republish"; values: undefined }
  | { id: "library_msg_republish_content"; description: "Are you sure you want to republish this content?"; values: undefined }
  | { id: "library_label_name"; description: "Name"; values: undefined }
  | { id: "library_label_created_on"; description: "Created On"; values: undefined }
  | { id: "library_label_author"; description: "Author"; values: undefined }
  | { id: "library_label_edit"; description: "Edit"; values: undefined }
  | { id: "library_label_approve"; description: "Approve"; values: undefined }
  | { id: "library_label_reject"; description: "Reject"; values: undefined }
  | { id: "library_label_inappropriate_content"; description: "Inappropriate Content"; values: undefined }
  | { id: "library_label_quality_of_lesson"; description: "Quality of Lesson is Poor"; values: undefined }
  | { id: "library_label_no_permissions_use_assets"; description: "No Permissions to Use Assets"; values: undefined }
  | { id: "library_label_add_remove_learning_outcomes"; description: "Add/Remove Learning Outcomes"; values: undefined }
  | { id: "library_label_other"; description: "Other"; values: undefined }
  | { id: "library_msg_reject_content"; description: "Are you sure you want to reject this content?"; values: undefined }
  | { id: "library_msg_reject_reason"; description: "Please specify the reason for rejection."; values: undefined }
  | { id: "library_label_reason"; description: "Reason"; values: undefined }
  | { id: "library_msg_file_deleted"; description: "The file has been deleted"; values: undefined }
  | { id: "library_label_previous"; description: "Previous"; values: undefined }
  | { id: "library_label_next"; description: "Next"; values: undefined }
  | { id: "library_label_edit_content"; description: "Edit Content"; values: undefined }
  | { id: "library_error_no_permissions"; description: "No permissions"; values: undefined }
  | { id: "library_error_no_network_connection"; description: "No network connection"; values: undefined }
  | { id: "library_error_unknown_error"; description: "Unknown error"; values: undefined }
  | { id: "assess_label_create"; description: "Create"; values: undefined }
  | { id: "assess_label_cancel"; description: "Cancel"; values: undefined }
  | { id: "assess_label_save"; description: "Save"; values: undefined }
  | { id: "assess_label_publish"; description: "Publish"; values: undefined }
  | { id: "assess_msg_publish_content"; description: "Are you sure you want to publish this learning outcome?"; values: undefined }
  | { id: "assess_label_ok"; description: "OK"; values: undefined }
  | { id: "assess_label_create_new_learning_outcome"; description: "Create New Learning Outcome"; values: undefined }
  | { id: "assess_label_learning_outcome_name"; description: "Learning Outcome Name"; values: undefined }
  | { id: "assess_label_short_code"; description: "Short Code"; values: undefined }
  | { id: "assess_label_assumed"; description: "Assumed"; values: undefined }
  | { id: "assess_label_program"; description: "Program"; values: undefined }
  | { id: "assess_label_subject"; description: "Subject"; values: undefined }
  | { id: "assess_label_development"; description: "Development"; values: undefined }
  | { id: "assess_label_skills"; description: "Skills"; values: undefined }
  | { id: "assess_label_age"; description: "Age"; values: undefined }
  | { id: "assess_label_grade"; description: "Grade"; values: undefined }
  | { id: "assess_label_estimated_time"; description: "Estimated Time(Minutes)"; values: undefined }
  | { id: "assess_label_keywords"; description: "Keywords"; values: undefined }
  | { id: "assess_label_description"; description: "Description"; values: undefined }
  | { id: "assess_label_published"; description: "Published"; values: undefined }
  | { id: "assess_label_pending"; description: "Pending"; values: undefined }
  | { id: "assess_label_unpublished"; description: "Unpublished"; values: undefined }
  | { id: "assess_label_assessments"; description: "Assessments"; values: undefined }
  | { id: "assess_label_empty"; description: "Empty"; values: undefined }
  | { id: "assess_label_search"; description: "Search"; values: undefined }
  | { id: "assess_msg_no_results_found"; description: "No results found"; values: undefined }
  | { id: "assess_label_my_only"; description: "My Only"; values: undefined }
  | { id: "assess_label_bulk_actions"; description: "Bulk Actions"; values: undefined }
  | { id: "assess_label_delete"; description: "Delete"; values: undefined }
  | { id: "assess_msg_delete_content"; description: "Are you sure you want to delete this learning outcome?"; values: undefined }
  | { id: "assess_label_sort_by"; description: "Sort By"; values: undefined }
  | { id: "assess_label_name_atoz"; description: "Name(A-Z)"; values: undefined }
  | { id: "assess_label_name_ztoa"; description: "Name(Z-A)"; values: undefined }
  | { id: "assess_label_created_on_newtoold"; description: "Created On(New-Old)"; values: undefined }
  | { id: "assess_label_created_on_oldtonew"; description: "Created On(Old-New)"; values: undefined }
  | { id: "assess_label_learning_outcome"; description: "Learning Outcome"; values: undefined }
  | { id: "assess_label_milestone"; description: "Milestone"; values: undefined }
  | { id: "assess_label_Standard"; description: "Standard"; values: undefined }
  | { id: "assess_label_yes"; description: "Yes"; values: undefined }
  | { id: "assess_label_created_on"; description: "Created On"; values: undefined }
  | { id: "assess_label_author"; description: "Author"; values: undefined }
  | { id: "assess_label_actions"; description: "Actions"; values: undefined }
  | { id: "assess_label_draft"; description: "Draft"; values: undefined }
  | { id: "assess_label_waiting_for_approval"; description: "Waiting for Approval"; values: undefined }
  | { id: "assess_label_rejected"; description: "Rejected"; values: undefined }
  | { id: "assess_label_republish"; description: "Republish"; values: undefined }
  | { id: "assess_msg_republish_content"; description: "Are you sure you want to republish this learning outcome?"; values: undefined }
  | { id: "assess_label_organization"; description: "Organization"; values: undefined }
  | { id: "assess_label_approve"; description: "Approve"; values: undefined }
  | { id: "assess_label_reject"; description: "Reject"; values: undefined }
  | { id: "assess_msg_reject_reason"; description: "Please specify the reason for rejection."; values: undefined }
  | { id: "assess_label_reason"; description: "Reason"; values: undefined }
  | { id: "assess_error_no_permissions"; description: "No permissions"; values: undefined }
  | { id: "assess_error_no_network_connection"; description: "No network connection"; values: undefined }
  | { id: "assess_error_unknown_error"; description: "Unknown error"; values: undefined };

export type LangRecordId = LangRecord["id"];
export type LangRecodeDescription = LangRecord["description"];
export type LangRecordValues = LangRecord["values"];
export type LangRecordIdByDescription<Desc extends LangRecord["description"]> = Extract<
  LangRecord,
  { id: any; description: Desc; values: any }
>["id"];
export type LangeRecordValuesByDesc<Desc extends LangRecord["description"]> = Extract<
  LangRecord,
  { id: any; description: Desc; values: any }
>["values"];
export type LangeRecordValuesById<Id extends LangRecord["id"]> = Extract<LangRecord, { id: Id; description: any; values: any }>["values"];

export interface LangMessageDescriptor extends Omit<MessageDescriptor, "id"> {
  id: LangRecordId;
}
