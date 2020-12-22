import { IntlFormatters, MessageDescriptor } from "react-intl";

type FormatMessageValue<T> = NonNullable<Parameters<IntlFormatters<T>["formatMessage"]>[1]> extends Record<any, infer V> ? V : never;
export type LangName = "en" | "ko" | "zh" | "vi" | "id";

type LangRecord<T = string> =
  | { id: "library_label_create"; description: "Create"; values: undefined }
  | { id: "library_label_for_organizations"; description: "For Organizations"; values: undefined }
  | { id: "library_label_cancel"; description: "Cancel"; values: undefined }
  | { id: "library_label_save"; description: "Save"; values: undefined }
  | { id: "library_label_publish"; description: "Publish"; values: undefined }
  | { id: "library_msg_publish_content"; description: "Are you sure you want to publish these contents?"; values: undefined }
  | { id: "library_label_ok"; description: "OK"; values: undefined }
  | { id: "library_label_create_new_content"; description: "Create New Content"; values: undefined }
  | { id: "library_label_lesson_material"; description: "Lesson Material"; values: undefined }
  | { id: "library_label_lesson_plan"; description: "Lesson Plan"; values: undefined }
  | { id: "library_label_details"; description: "Details"; values: undefined }
  | { id: "library_label_learning_outcomes"; description: "Learning Outcomes"; values: undefined }
  | { id: "library_label_added_learning_outcomes"; description: "Added Learning Outcomes"; values: undefined }
  | { id: "library_msg_coming_soon"; description: "Coming soon..."; values: undefined }
  | { id: "library_label_assets"; description: "Assets"; values: undefined }
  | { id: "library_label_material_name"; description: "Material Name"; values: undefined }
  | { id: "library_label_thumbnail"; description: "Thumbnail"; values: undefined }
  | { id: "library_label_clip_image"; description: "Clip Image"; values: undefined }
  | { id: "library_label_duration"; description: "Duration:min"; values: undefined }
  | { id: "library_label_plan_duration"; description: "Duration:min(Should be greater than lesson materials' sum)"; values: undefined }
  | { id: "library_label_program"; description: "Program"; values: undefined }
  | { id: "library_label_subject"; description: "Subject"; values: undefined }
  | { id: "library_label_category"; description: "Category"; values: undefined }
  | { id: "library_label_subcategory"; description: "Subcategory"; values: undefined }
  | { id: "library_label_age"; description: "Age"; values: undefined }
  | { id: "library_label_grade"; description: "Grade"; values: undefined }
  | { id: "library_label_visibility_settings"; description: "Visibility Settings"; values: undefined }
  | { id: "library_label_visibility_school"; description: "School"; values: undefined }
  | { id: "library_label_visibility_organization"; description: "Organization"; values: undefined }
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
  | { id: "library_msg_bulk_remove_content"; description: "Are you sure you want to remove these contents?"; values: undefined }
  | { id: "library_msg_remove_select_one"; description: "At least one content should be selected."; values: undefined }
  | { id: "library_label_sort_by"; description: "Sort By"; values: undefined }
  | { id: "library_label_content_name_atoz"; description: "Content Name (A-Z)"; values: undefined }
  | { id: "library_label_content_name_ztoa"; description: "Content Name (Z-A)"; values: undefined }
  | { id: "library_label_created_on_newtoold"; description: "Created On (New-Old)"; values: undefined }
  | { id: "library_label_created_on_oldtonew"; description: "Created On (Old-New)"; values: undefined }
  | { id: "library_label_material"; description: "Material"; values: undefined }
  | { id: "library_label_plan"; description: "Plan"; values: undefined }
  | { id: "library_label_delete"; description: "Delete"; values: undefined }
  | { id: "library_msg_delete_content"; description: "Are you sure you want to delete this content?"; values: undefined }
  | { id: "library_msg_bulk_delete_content"; description: "Are you sure you want to delete these contents?"; values: undefined }
  | { id: "library_label_draft"; description: "Draft"; values: undefined }
  | { id: "library_label_waiting_for_approval"; description: "Waiting for Approval"; values: undefined }
  | { id: "library_label_rejected"; description: "Rejected"; values: undefined }
  | { id: "library_label_republish"; description: "Republish"; values: undefined }
  | { id: "library_msg_republish_content"; description: "Are you sure you want to republish this content?"; values: undefined }
  | { id: "library_msg_bulk_republish_content"; description: "Are you sure you want to republish these contents?"; values: undefined }
  | { id: "library_label_name"; description: "Name"; values: undefined }
  | { id: "library_label_created_on"; description: "Created On"; values: undefined }
  | { id: "library_label_author"; description: "Author"; values: undefined }
  | { id: "library_label_edit"; description: "Edit"; values: undefined }
  | { id: "library_label_view_in"; description: "View in"; values: undefined }
  | { id: "library_label_kidsloop_live"; description: "KidsLoop Live"; values: undefined }
  | { id: "library_label_approve"; description: "Approve"; values: undefined }
  | { id: "library_msg_approve_content"; description: "Are you sure you want to approve these contents?"; values: undefined }
  | { id: "library_label_reject"; description: "Reject"; values: undefined }
  | { id: "library_label_inappropriate_content"; description: "Inappropriate Content"; values: undefined }
  | { id: "library_label_quality_of_lesson"; description: "Quality of Lesson is Poor"; values: undefined }
  | { id: "library_label_no_permissions_use_assets"; description: "No Permissions to Use Assets"; values: undefined }
  | { id: "library_label_add_remove_learning_outcomes"; description: "Add/Remove Learning Outcomes"; values: undefined }
  | { id: "library_label_other"; description: "Other"; values: undefined }
  | { id: "library_msg_reject_content"; description: "Are you sure you want to reject these contents?"; values: undefined }
  | { id: "library_msg_reject_reason"; description: "Please specify the reason for rejection."; values: undefined }
  | { id: "library_label_reason"; description: "Reason"; values: undefined }
  | { id: "library_msg_file_deleted"; description: "The file has been deleted"; values: undefined }
  | { id: "library_label_previous"; description: "Previous"; values: undefined }
  | { id: "library_label_next"; description: "Next"; values: undefined }
  | { id: "library_label_edit_content"; description: "Edit Content"; values: undefined }
  | { id: "library_error_no_permissions"; description: "You have no permission."; values: undefined }
  | { id: "library_error_no_network_connection"; description: "No network connection"; values: undefined }
  | { id: "library_error_unknown_error"; description: "Unknown error"; values: undefined }
  | { id: "library_label_image"; description: "Image"; values: undefined }
  | { id: "library_label_video"; description: "Video"; values: undefined }
  | { id: "library_label_audio"; description: "Audio"; values: undefined }
  | { id: "library_label_document"; description: "Document"; values: undefined }
  | { id: "library_label_asset_name"; description: "Asset Name"; values: undefined }
  | { id: "library_label_upload_a_file"; description: "Upload a File"; values: undefined }
  | { id: "library_label_upload_a"; description: "Upload a {fillfileType} here"; values: { fillfileType: string | number } }
  | { id: "library_label_upload"; description: "Upload"; values: undefined }
  | { id: "library_label_file_type"; description: "File Type"; values: undefined }
  | { id: "library_label_h5p"; description: "H5P"; values: undefined }
  | { id: "library_label_non_h5p"; description: "Non H5P"; values: undefined }
  | { id: "library_label_select_a_file"; description: "Select a File"; values: undefined }
  | { id: "library_msg_drag_asset"; description: "Drag from Assets Library"; values: undefined }
  | { id: "library_label_upload_from_device"; description: "Upload from Device"; values: undefined }
  | { id: "library_label_preview"; description: "Preview"; values: undefined }
  | { id: "library_msg_publish_lesson_material"; description: "How would you like to publish?"; values: undefined }
  | { id: "library_msg_only_publish_lesson_material"; description: "Only publish as a lesson material"; values: undefined }
  | {
      id: "library_msg_publish_lesson_material_and_asset";
      description: "Publish as a lesson material, and add to assets library";
      values: undefined;
    }
  | { id: "library_label_lesson_type"; description: "Lesson Type"; values: undefined }
  | { id: "library_label_test"; description: "Test"; values: undefined }
  | { id: "library_label_not_test"; description: "Not Test"; values: undefined }
  | { id: "library_label_self_study"; description: "Suitable for Self Study"; values: undefined }
  | { id: "library_label_drawing_activity"; description: "Drawing Activity"; values: undefined }
  | { id: "library_label_program_esl"; description: "Badanamu ESL"; values: undefined }
  | { id: "library_label_program_math"; description: "Bada Math"; values: undefined }
  | { id: "library_error_unsupported_format"; description: "Unsupported Format"; values: undefined }
  | { id: "library_error_no_content"; description: "Content does not exist"; values: undefined }
  | {
      id: "library_error_content_locked";
      description: "This content is locked by editor at {email}. To use this content, ask the editor to check their Draft or Waiting for Approval or Rejected content, publish, then get it approved.";
      values: { email: string | number };
    }
  | {
      id: "library_error_delete_lesson_plan_in_schedule";
      description: "Unable to delete lesson plan which is scheduled";
      values: undefined;
    }
  | { id: "library_error_update_content_failed"; description: "Update content failed"; values: undefined }
  | { id: "library_error_read_content_failed"; description: "Read content failed"; values: undefined }
  | { id: "library_error_delete_content_failed"; description: "Delete content failed"; values: undefined }
  | { id: "library_error_invalid_visibility_settings"; description: "Invalid Visibility Settings"; values: undefined }
  | { id: "library_error_associate_learning_outcome_failed"; description: "Associate learning outcome failed"; values: undefined }
  | { id: "library_label_teacher_manual"; description: "Teacher Manual"; values: undefined }
  | { id: "library_label_supported_format"; description: "Supported Format"; values: undefined }
  | { id: "library_label_max_size"; description: "Max Size"; values: undefined }
  | { id: "library_label_new_folder"; description: "New Folder"; values: undefined }
  | { id: "library_label_folder_name"; description: "Folder Name"; values: undefined }
  | { id: "library_error_duplicate_folder_name"; description: "Folder name should be unique, please use another name."; values: undefined }
  | { id: "library_label_folder"; description: "Folder"; values: undefined }
  | { id: "library_label_items"; description: "items"; values: undefined }
  | { id: "library_label_visible"; description: "visible"; values: undefined }
  | { id: "library_label_rename"; description: "Rename"; values: undefined }
  | { id: "library_label_move"; description: "Move to"; values: undefined }
  | { id: "library_error_move_folder_to_own"; description: "Folder cannot be moved to itself or a subdirectory"; values: undefined }
  | { id: "library_label_delete_folder"; description: "Delete Folder"; values: undefined }
  | { id: "library_msg_delete_folder"; description: "Are you sure you want to delete these folders?"; values: undefined }
  | { id: "library_error_delete_folder"; description: "Folder cannot be deleted unless it is empty"; values: undefined }
  | { id: "library_label_export_as_csv"; description: "Export as CSV"; values: undefined }
  | { id: "library_label_distribute"; description: "Distribute"; values: undefined }
  | { id: "library_label_preset"; description: "Preset"; values: undefined }
  | {
      id: "library_msg_preset";
      description: "Choosing this option will make the selected content available to current and future organizations.";
      values: undefined;
    }
  | { id: "library_label_select_organizations"; description: "Select Organizations"; values: undefined }
  | { id: "library_label_all_organizations"; description: "All"; values: undefined }
  | { id: "assess_tab_assessments"; description: "Assessments"; values: undefined }
  | { id: "assess_button_search"; description: "Search"; values: undefined }
  | { id: "assess_text_search teacher"; description: "Search Teacher"; values: undefined }
  | { id: "assess_filter_column_status"; description: "Status"; values: undefined }
  | { id: "assess_filter_all"; description: "All"; values: undefined }
  | { id: "assess_filter_complete"; description: "Complete"; values: undefined }
  | { id: "assess_filter_in_progress"; description: "In Progress"; values: undefined }
  | { id: "assess_sort_by"; description: "Sort By"; values: undefined }
  | { id: "assess_class_end_time_new_old"; description: "Class End Time (New-Old)"; values: undefined }
  | { id: "assess_class_end_time_old_new"; description: "Class End Time (Old -New)"; values: undefined }
  | { id: "assess_complete_time_new_old"; description: "Complete Time (New-Old)"; values: undefined }
  | { id: "assess_complete_time_old_new"; description: "Complete Time (Old-New)"; values: undefined }
  | { id: "assess_column_title"; description: "Assessment Title"; values: undefined }
  | { id: "assess_column_subject"; description: "Subject"; values: undefined }
  | { id: "assess_column_program"; description: "Program"; values: undefined }
  | { id: "assess_column_teacher"; description: "Teacher"; values: undefined }
  | { id: "assess_column_class_end_time"; description: "Class End Time"; values: undefined }
  | { id: "assess_column_complete_time"; description: "Complete Time"; values: undefined }
  | { id: "assess_button_cancel"; description: "Cancel"; values: undefined }
  | { id: "assess_button_save"; description: "Save"; values: undefined }
  | { id: "assess_button_complete"; description: "Complete"; values: undefined }
  | { id: "assess_assessment_details"; description: "Assessment Details"; values: undefined }
  | { id: "assess_class_summary"; description: "Class Summary"; values: undefined }
  | { id: "assess_detail_attendance"; description: "Attendance"; values: undefined }
  | { id: "assess_button_edit"; description: "Edit"; values: undefined }
  | { id: "assess_detail_class_length"; description: "Class Length"; values: undefined }
  | { id: "assess_detail_minutes"; description: "Minutes"; values: undefined }
  | { id: "assess_detail_number_activity"; description: "Number of Activities"; values: undefined }
  | { id: "assess_detail_number_lo"; description: "Number of Learning Outcomes"; values: undefined }
  | { id: "assess_detail_assessment_complete_time"; description: "Assessment Complete Time"; values: undefined }
  | { id: "assess_popup_edit_attendance"; description: "Edit Attendance"; values: undefined }
  | { id: "assess_button_ok"; description: "Ok"; values: undefined }
  | { id: "assess_filter_assumed"; description: "Assumed"; values: undefined }
  | { id: "assess_filter_unassumed"; description: "Unassumed"; values: undefined }
  | { id: "assess_column_lo"; description: "Learning Outcomes"; values: undefined }
  | { id: "assess_option_award all"; description: "Award All"; values: undefined }
  | { id: "assess_option_skip"; description: "Skip"; values: undefined }
  | { id: "assess_option_assessing_actions"; description: "Assessing Actions"; values: undefined }
  | { id: "assess_msg_discard"; description: "Discard unsaved changes?"; values: undefined }
  | { id: "assess_msg_cannot_delete"; description: "You cannot change the assessment after clicking Complete."; values: undefined }
  | { id: "assess_msg_ one_student"; description: "You must choose at least one student."; values: undefined }
  | { id: "assess_button_discard"; description: "Discard"; values: undefined }
  | { id: "assess_msg_no_lo"; description: "No learning outcome is available."; values: undefined }
  | { id: "assess_msg_missing_infor"; description: "Please fill in all the information."; values: undefined }
  | { id: "assess_msg_save_successfully"; description: "Save Successfully."; values: undefined }
  | { id: "assess_msg_compete_successfully"; description: "Complete Successfully."; values: undefined }
  | { id: "assess_option_all_achieved"; description: "All Achieved"; values: undefined }
  | { id: "assess_option_none_achieved"; description: "None Achieved"; values: undefined }
  | { id: "assess_option_not_attempted"; description: "Not Attempted"; values: undefined }
  | { id: "assess_msg_no_permission"; description: "You do not have permission to access this feature. "; values: undefined }
  | { id: "assess_label_create"; description: "Create"; values: undefined }
  | { id: "assess_label_for_organizations"; description: "For Organizations"; values: undefined }
  | { id: "assess_label_cancel"; description: "Cancel"; values: undefined }
  | { id: "assess_label_save"; description: "Save"; values: undefined }
  | { id: "assess_label_publish"; description: "Publish"; values: undefined }
  | { id: "assess_msg_publish_content"; description: "Are you sure you want to publish this learning outcome?"; values: undefined }
  | { id: "assess_label_ok"; description: "OK"; values: undefined }
  | { id: "assess_label_create_new_learning_outcome"; description: "Create New Learning Outcome"; values: undefined }
  | { id: "assess_label_details"; description: "Details"; values: undefined }
  | { id: "assess_label_learning_outcome_name"; description: "Learning Outcome Name"; values: undefined }
  | { id: "assess_label_short_code"; description: "Short Code"; values: undefined }
  | { id: "assess_label_assumed"; description: "Assumed"; values: undefined }
  | { id: "assess_label_program"; description: "Program"; values: undefined }
  | { id: "assess_label_subject"; description: "Subject"; values: undefined }
  | { id: "assess_label_category"; description: "Category"; values: undefined }
  | { id: "assess_label_subcategory"; description: "Subcategory"; values: undefined }
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
  | { id: "assess_msg_remove_select_one"; description: "At least one learning outcome should be selected."; values: undefined }
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
  | { id: "assess_error_unknown_error"; description: "Unknown error"; values: undefined }
  | { id: "assess_bulk_approval"; description: "Are you sure you want to approve these learning outcomes?"; values: undefined }
  | { id: "schedule_tab_schedule"; description: "Schedule"; values: undefined }
  | { id: "schedue_button_schedule_class"; description: "Schedule Class"; values: undefined }
  | { id: "schedule_button_search"; description: "Search"; values: undefined }
  | { id: "schedule_text_search_teacher"; description: "Search teacher"; values: undefined }
  | { id: "schedule_button_today"; description: "Today"; values: undefined }
  | { id: "schedule_option_week"; description: "Week"; values: undefined }
  | { id: "schedule_option_day"; description: "Day"; values: undefined }
  | { id: "schedule_option_year"; description: "Year"; values: undefined }
  | { id: "schedule_option_workweek"; description: "Workweek"; values: undefined }
  | { id: "schedule_calendar_january"; description: "January"; values: undefined }
  | { id: "schedule_calendar_february"; description: "February"; values: undefined }
  | { id: "schedule_calendar_march"; description: "March"; values: undefined }
  | { id: "schedule_calendar_april"; description: "April"; values: undefined }
  | { id: "schedule_calendar_may"; description: "May"; values: undefined }
  | { id: "schedule_calendar_june"; description: "June"; values: undefined }
  | { id: "schedule_calendar_july"; description: "July"; values: undefined }
  | { id: "schedule_calendar_august"; description: "August"; values: undefined }
  | { id: "schedule_calendar_september"; description: "September"; values: undefined }
  | { id: "schedule_calendar_october"; description: "October"; values: undefined }
  | { id: "schedule_calendar_november"; description: "November"; values: undefined }
  | { id: "schedule_calendar_december"; description: "December"; values: undefined }
  | { id: "schedule_calendar_jan"; description: "Jan"; values: undefined }
  | { id: "schedule_calendar_feb"; description: "Feb"; values: undefined }
  | { id: "schedule_calendar_mar"; description: "Mar"; values: undefined }
  | { id: "schedule_calendar_apr"; description: "Apr"; values: undefined }
  | { id: "schedule_calendar_jun"; description: "Jun"; values: undefined }
  | { id: "schedule_calendar_jul"; description: "Jul"; values: undefined }
  | { id: "schedule_calendar_aug"; description: "Aug"; values: undefined }
  | { id: "schedule_calendar_sep"; description: "Sep"; values: undefined }
  | { id: "schedule_calendar_oct"; description: "Oct"; values: undefined }
  | { id: "schedule_calendar_nov"; description: "Nov"; values: undefined }
  | { id: "schedule_calendar_dec"; description: "Dec"; values: undefined }
  | { id: "schedule_calendar_mon"; description: "Mon"; values: undefined }
  | { id: "schedule_calendar_tue"; description: "Tue"; values: undefined }
  | { id: "schedule_calendar_wed"; description: "Wed"; values: undefined }
  | { id: "schedule_calendar_thu"; description: "Thu"; values: undefined }
  | { id: "schedule_calendar_fri"; description: "Fri"; values: undefined }
  | { id: "schedule_calendar_sat"; description: "Sat"; values: undefined }
  | { id: "schedule_calendar_sun"; description: "Sun"; values: undefined }
  | { id: "schedule_calendar_mo"; description: "Mo"; values: undefined }
  | { id: "schedule_calendar_tu"; description: "Tu"; values: undefined }
  | { id: "schedule_calendar_we"; description: "We"; values: undefined }
  | { id: "schedule_calendar_th"; description: "Th"; values: undefined }
  | { id: "schedule_calendar_fr"; description: "Fr"; values: undefined }
  | { id: "schedule_calendar_sa"; description: "Sa"; values: undefined }
  | { id: "schedule_calendar_su"; description: "Su"; values: undefined }
  | { id: "schedule_detail_lesson_name"; description: "Lesson Name"; values: undefined }
  | { id: "schedule_detail_add_class"; description: "Add Class"; values: undefined }
  | { id: "schedule_detail_lesson_plan"; description: "Lesson plan"; values: undefined }
  | { id: "schedule_detail_teacher"; description: "Teacher"; values: undefined }
  | { id: "schedule_detail_start_time"; description: "Start Time"; values: undefined }
  | { id: "schedule_detail_end_time"; description: "End Time"; values: undefined }
  | { id: "schedule_detail_year"; description: "Year"; values: undefined }
  | { id: "schedule_detail_month"; description: "Month"; values: undefined }
  | { id: "schedule_detail_day"; description: "Day"; values: undefined }
  | { id: "schedule_detail_all_day"; description: "All day"; values: undefined }
  | { id: "schedule_detail_repeat"; description: "Repeat"; values: undefined }
  | { id: "schedule_detail_subject"; description: "Subject"; values: undefined }
  | { id: "schedule_detail_program"; description: "Program"; values: undefined }
  | { id: "schedule_detail_class_type"; description: "Class Type"; values: undefined }
  | { id: "schedule_detail_online_class"; description: "Live"; values: undefined }
  | { id: "schedule_detail_offline_class"; description: "Class"; values: undefined }
  | { id: "schedule_detail_homework"; description: "Study"; values: undefined }
  | { id: "schedule_detail_task"; description: "Task"; values: undefined }
  | { id: "schedule_detail_due_date"; description: "Due Date"; values: undefined }
  | { id: "schedule_detail_pick_time"; description: "Pick Time"; values: undefined }
  | { id: "schedule_detail_description"; description: "Description"; values: undefined }
  | { id: "schedule_detail_attachment"; description: "Attachment"; values: undefined }
  | { id: "schedule_detail_max"; description: "Max"; values: undefined }
  | { id: "schedule_detail_support_files_in"; description: "Support files in"; values: undefined }
  | { id: "schedule_detail_video"; description: "Video"; values: undefined }
  | { id: "schedule_detail_audio"; description: "Audio"; values: undefined }
  | { id: "schedule_detail_image"; description: "Image"; values: undefined }
  | { id: "schedule_detail_document"; description: "Document"; values: undefined }
  | { id: "schedule_button_preview"; description: "Preview"; values: undefined }
  | { id: "schedule_button_go_live"; description: "Go Live"; values: undefined }
  | { id: "schedule_repeat_daily"; description: "Daily"; values: undefined }
  | { id: "schedule_repeat_weekly"; description: "Weekly"; values: undefined }
  | { id: "schedule_repeat_monthly"; description: "Monthly"; values: undefined }
  | { id: "schedule_repeat_yearly"; description: "Yearly"; values: undefined }
  | { id: "schedule_repeat_every"; description: "Repeat every"; values: undefined }
  | { id: "schedule_repeat_day"; description: "day(s)"; values: undefined }
  | { id: "schedule_repeat_week"; description: "week(s)"; values: undefined }
  | { id: "schedule_repeat_month"; description: "month(s)"; values: undefined }
  | { id: "schedule_repeat_year"; description: "year(s)"; values: undefined }
  | { id: "schedule_end_repeat"; description: "End Repeat"; values: undefined }
  | { id: "schedule_repeat_never"; description: "Never"; values: undefined }
  | { id: "schedule_repeat_after"; description: "After"; values: undefined }
  | { id: "schedule_repeat_occurrence(s)"; description: "Occurrence(s)"; values: undefined }
  | { id: "schedule_repeat_on"; description: "On"; values: undefined }
  | { id: "schedule_frequency_month"; description: "of every month"; values: undefined }
  | { id: "schedule_frequency_year"; description: "of every year"; values: undefined }
  | { id: "schedule_month_the"; description: "The"; values: undefined }
  | { id: "schedule_frequency_first"; description: "first"; values: undefined }
  | { id: "schedule_frequency_second"; description: "second"; values: undefined }
  | { id: "schedule_frequency_third"; description: "thrid"; values: undefined }
  | { id: "schedule_frequency_fourth"; description: "fourth"; values: undefined }
  | { id: "schedule_frequency_last"; description: "last"; values: undefined }
  | { id: "schedule_frequency_monday"; description: "Monday"; values: undefined }
  | { id: "schedule_frequency_tuesday"; description: "Tuesday"; values: undefined }
  | { id: "schedule_frequency_wednesday"; description: "Wednesday"; values: undefined }
  | { id: "schedule_frequency_thursday"; description: "Thursday"; values: undefined }
  | { id: "schedule_frequency_friday"; description: "Friday"; values: undefined }
  | { id: "schedule_frequency_saturday"; description: "Saturday"; values: undefined }
  | { id: "schedule_frequency_sunday"; description: "Sunday"; values: undefined }
  | { id: "schedule_yearly_every"; description: "Every"; values: undefined }
  | { id: "schedule_yearly_of_jan"; description: "of January"; values: undefined }
  | { id: "schedule_yearly_of_feb"; description: "of Febuary"; values: undefined }
  | { id: "schedule_yearly_of_mar"; description: "of March"; values: undefined }
  | { id: "schedule_yearly_of_apr"; description: "of April"; values: undefined }
  | { id: "schedule_yearly_of_may"; description: "of May"; values: undefined }
  | { id: "schedule_yearly_of_jun"; description: "of June"; values: undefined }
  | { id: "schedule_yearly_of_jul"; description: "of July"; values: undefined }
  | { id: "schedule_yearly_of_aug"; description: "of August"; values: undefined }
  | { id: "schedule_yearly_of_sep"; description: "of September"; values: undefined }
  | { id: "schedule_yearly_of_oct"; description: "of October"; values: undefined }
  | { id: "schedule_yearly_of_nov"; description: "of November"; values: undefined }
  | { id: "schedule_yearly_of_dec"; description: "of December"; values: undefined }
  | { id: "schedule_msg_delete"; description: "Are you sure you want to delete this event?"; values: undefined }
  | { id: "schedule_button_delete"; description: "DELETE"; values: undefined }
  | { id: "schedule_button_cancel"; description: "CANCEL"; values: undefined }
  | { id: "schedule_msg_discard"; description: "Discard unsave changes?"; values: undefined }
  | { id: "schedule_button_discard"; description: "DISCARD"; values: undefined }
  | { id: "schedule_msg_two_year"; description: "You cannot schedule a class beyond two years."; values: undefined }
  | { id: "schedule_button_ok"; description: "OK"; values: undefined }
  | {
      id: "schedule_msg_overlap";
      description: "You already have a class scheduled during this time. Confirm to schedule?";
      values: undefined;
    }
  | { id: "schedule_button_confirm"; description: "CONFIRM"; values: undefined }
  | { id: "schedule_msg_edit_recurring"; description: "Edit recurring event"; values: undefined }
  | { id: "schedule_msg_delete_recurring"; description: "Delete recurring event"; values: undefined }
  | { id: "schedule_option_this_event"; description: "This event"; values: undefined }
  | { id: "schedule_option_all_events"; description: "This and following events"; values: undefined }
  | { id: "schedule_msg_edit_overlap"; description: "This event has been changed. Please refresh."; values: undefined }
  | { id: "schedule_msg_delete_overlap"; description: "This event is deleted."; values: undefined }
  | { id: "schedule_msg_attachment"; description: "The attachment you uploaded does not meet the requirement."; values: undefined }
  | { id: "schedule_msg_no_result"; description: "No results found."; values: undefined }
  | {
      id: "schedule_schedule_msg_edit_all";
      description: "This is an event in a series. Are you sure you want to edit this and following events?";
      values: undefined;
    }
  | { id: "schedule_msg_delete_success"; description: "Delete sucessfully"; values: undefined }
  | { id: "schedule_msg_upload_format"; description: "Please upload the file in the correct format"; values: undefined }
  | { id: "schedule_label_teacher_name"; description: "teacher name"; values: undefined }
  | { id: "schedule_msg_start_current"; description: "Start time cannot be earlier than current time"; values: undefined }
  | {
      id: "schedule_msg_due_date_earlier";
      description: "The due date cannot be earlier than the scheduled class end time.";
      values: undefined;
    }
  | { id: "schedule_msg_end_time_earlier"; description: "End time cannot be earlier than start time"; values: undefined }
  | { id: "schedule_button_edit"; description: "Edit"; values: undefined }
  | { id: "schedule_popup_fillin"; description: "Please fill out this field"; values: undefined }
  | { id: "schedule_popup_valid"; description: "Please enter a valid date"; values: undefined }
  | { id: "schedule_preview_live"; description: "KidsLoop Live"; values: undefined }
  | { id: "schedule_preview_class"; description: "KidsLoop Class"; values: undefined }
  | { id: "schedule_preview_study"; description: "KidsLoop Study"; values: undefined }
  | { id: "schedule_detail_participants"; description: "Add Participants"; values: undefined }
  | { id: "scheudule_filter_all_my_schedule"; description: "My Schedule"; values: undefined }
  | { id: "schedule_filter_schools"; description: "Schools"; values: undefined }
  | { id: "schedule_filter_teachers"; description: "Teachers"; values: undefined }
  | { id: "schedule_filter_classes"; description: "Classes"; values: undefined }
  | { id: "schedule_filter_subjects"; description: "Subjects"; values: undefined }
  | { id: "schedule_filter_programs"; description: "Programs"; values: undefined }
  | { id: "schedule_filter_no_data"; description: "No Data"; values: undefined }
  | { id: "schedule_msg_no_permission"; description: "You do not have permission to access this feature. "; values: undefined }
  | { id: "schedule_msg_no_student"; description: "There is no student in this class"; values: undefined }
  | {
      id: "schedule_msg_delete_minutes";
      description: "You can only delete a class at least 15 minutes before the start time.";
      values: undefined;
    }
  | {
      id: "schedule_msg_edit_minutes";
      description: "You can only edit a class at least 15 minutes before the start time.";
      values: undefined;
    }
  | { id: "schedule_msg_start_minutes"; description: "You can only start a class 15 minutes before the start time."; values: undefined }
  | { id: "schedule_button_click_to schedule"; description: "Click to Schedule"; values: undefined }
  | { id: "schedule_msg_time_expired"; description: "Time expired"; values: undefined }
  | {
      id: "schedule_msg_recall_lesson_plan";
      description: "Oops! The lesson plan included for this lesson has already been deleted!";
      values: undefined;
    }
  | { id: "report_label_student_achievement"; description: "Student Achievement"; values: undefined }
  | { id: "report_label_teacher"; description: "Teacher"; values: undefined }
  | { id: "report_label_class"; description: "Class"; values: undefined }
  | { id: "report_label_lesson_plan"; description: "Lesson Plan"; values: undefined }
  | { id: "report_label_status"; description: "Status"; values: undefined }
  | { id: "report_label_all"; description: "All"; values: undefined }
  | { id: "report_label_achieved"; description: "Achieved"; values: undefined }
  | { id: "report_label_not_achieved"; description: "Not Achieved"; values: undefined }
  | { id: "report_label_not_attempted"; description: "Not Attempted"; values: undefined }
  | { id: "report_label_sort_by"; description: "Sort By"; values: undefined }
  | { id: "report_label_ascending"; description: "Ascending"; values: undefined }
  | { id: "report_label_descending"; description: "Descending"; values: undefined }
  | { id: "report_label_learning_outcomes_percentage"; description: "Learning Outcomes %"; values: undefined }
  | { id: "report_label_absent"; description: "Absent"; values: undefined }
  | { id: "report_error_no_permissions"; description: "You have no permission."; values: undefined }
  | { id: "report_error_no_network_connection"; description: "No network connection"; values: undefined }
  | { id: "report_error_unknown_error"; description: "Unknown error"; values: undefined }
  | { id: "report_label_lo_in_categories"; description: "Learning Outcomes in Categories"; values: undefined }
  | { id: "report_label_lo"; description: "LOs"; values: undefined }
  | { id: "general_error_unauthorized"; description: "User not logged in, please log in"; values: undefined }
  | { id: "general_error_no_organization"; description: "You have no organization"; values: undefined }
  | { id: "general_error_unknown"; description: "Server request failed"; values: undefined };

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
