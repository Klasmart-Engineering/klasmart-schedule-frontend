import { MessageDescriptor } from "react-intl";

export type LangName = "en" | "es" | "id" | "ko" | "th" | "vi" | "zh" | "zh_CN";

export function assertLangName(name?: string): asserts name is LangName {
  if (!name || !["en", "es", "id", "ko", "th", "vi", "zh", "zh_CN"].includes(name)) throw new TypeError();
}

export function shouldBeLangName(name?: string): LangName {
  assertLangName(name);
  return name;
}

type LangRecord =
  | { id: "library_label_create"; description: `Create`; values: undefined }
  | { id: "library_label_for_organizations"; description: `For Organizations`; values: undefined }
  | { id: "library_label_cancel"; description: `Cancel`; values: undefined }
  | { id: "library_label_save"; description: `Save`; values: undefined }
  | { id: "library_label_publish"; description: `Publish`; values: undefined }
  | { id: "library_msg_publish_content"; description: `Are you sure you want to publish these contents?`; values: undefined }
  | { id: "library_label_ok"; description: `OK`; values: undefined }
  | { id: "library_label_create_new_content"; description: `Create New Content`; values: undefined }
  | { id: "library_label_lesson_material"; description: `Lesson Material`; values: undefined }
  | { id: "library_label_lesson_plan"; description: `Lesson Plan`; values: undefined }
  | { id: "library_label_details"; description: `Details`; values: undefined }
  | { id: "library_label_learning_outcomes"; description: `Learning Outcomes`; values: undefined }
  | { id: "library_label_added_learning_outcomes"; description: `Added Learning Outcomes`; values: undefined }
  | { id: "library_msg_coming_soon"; description: `Coming soon...`; values: undefined }
  | { id: "library_label_assets"; description: `Assets`; values: undefined }
  | { id: "library_label_material_name"; description: `Material Name`; values: undefined }
  | { id: "library_label_thumbnail"; description: `Thumbnail`; values: undefined }
  | { id: "library_label_clip_image"; description: `Clip Image`; values: undefined }
  | { id: "library_label_duration"; description: `Duration:min`; values: undefined }
  | { id: "library_label_plan_duration"; description: `Duration:min(Should be greater than lesson materials' sum)`; values: undefined }
  | { id: "library_label_program"; description: `Program`; values: undefined }
  | { id: "library_label_subject"; description: `Subject`; values: undefined }
  | { id: "library_label_category"; description: `Category`; values: undefined }
  | { id: "library_label_subcategory"; description: `Subcategory`; values: undefined }
  | { id: "library_label_age"; description: `Age`; values: undefined }
  | { id: "library_label_grade"; description: `Grade`; values: undefined }
  | { id: "library_label_visibility_settings"; description: `Visibility Settings`; values: undefined }
  | { id: "library_label_visibility_school"; description: `School`; values: undefined }
  | { id: "library_label_visibility_organization"; description: `Organization`; values: undefined }
  | { id: "library_label_description"; description: `Description`; values: undefined }
  | { id: "library_label_keywords"; description: `Keywords`; values: undefined }
  | { id: "library_label_plan_name"; description: `Plan Name`; values: undefined }
  | { id: "library_label_start"; description: `Start`; values: undefined }
  | { id: "library_msg_drag_lesson_material"; description: `Drag and drop a lesson material here`; values: undefined }
  | { id: "library_label_published"; description: `Published`; values: undefined }
  | { id: "library_label_pending"; description: `Pending`; values: undefined }
  | { id: "library_label_unpublished"; description: `Unpublished`; values: undefined }
  | { id: "library_label_archived"; description: `Archived`; values: undefined }
  | { id: "library_label_empty"; description: `Empty`; values: undefined }
  | { id: "library_label_search"; description: `Search`; values: undefined }
  | { id: "library_msg_no_results_found"; description: `No results found`; values: undefined }
  | { id: "library_label_my_only"; description: `Show My Content`; values: undefined }
  | { id: "library_label_bulk_actions"; description: `Bulk Actions`; values: undefined }
  | { id: "library_label_remove"; description: `Remove`; values: undefined }
  | { id: "library_msg_remove_content"; description: `Are you sure you want to archive this content?`; values: undefined }
  | { id: "library_msg_bulk_remove_content"; description: `Are you sure you want to remove these contents?`; values: undefined }
  | { id: "library_msg_remove_select_one"; description: `At least one content should be selected.`; values: undefined }
  | { id: "library_label_sort_by"; description: `Sort By`; values: undefined }
  | { id: "library_label_content_name_atoz"; description: `Content Name (A-Z)`; values: undefined }
  | { id: "library_label_content_name_ztoa"; description: `Content Name (Z-A)`; values: undefined }
  | { id: "library_label_created_on_newtoold"; description: `Created On (New-Old)`; values: undefined }
  | { id: "library_label_created_on_oldtonew"; description: `Created On (Old-New)`; values: undefined }
  | { id: "library_label_material"; description: `Material`; values: undefined }
  | { id: "library_label_plan"; description: `Plan`; values: undefined }
  | { id: "library_label_delete"; description: `Delete`; values: undefined }
  | { id: "library_msg_delete_content"; description: `Are you sure you want to delete this content?`; values: undefined }
  | { id: "library_msg_bulk_delete_content"; description: `Are you sure you want to delete these contents?`; values: undefined }
  | { id: "library_label_draft"; description: `Draft`; values: undefined }
  | { id: "library_label_waiting_for_approval"; description: `Waiting for Approval`; values: undefined }
  | { id: "library_label_rejected"; description: `Rejected`; values: undefined }
  | { id: "library_label_republish"; description: `Republish`; values: undefined }
  | { id: "library_msg_republish_content"; description: `Are you sure you want to republish this content?`; values: undefined }
  | { id: "library_msg_bulk_republish_content"; description: `Are you sure you want to republish these contents?`; values: undefined }
  | { id: "library_label_name"; description: `Name`; values: undefined }
  | { id: "library_label_created_on"; description: `Created On`; values: undefined }
  | { id: "library_label_author"; description: `Author`; values: undefined }
  | { id: "library_label_edit"; description: `Edit`; values: undefined }
  | { id: "library_label_view_in"; description: `View in`; values: undefined }
  | { id: "library_label_kidsloop_live"; description: `Live Class`; values: undefined }
  | { id: "library_label_approve"; description: `Approve`; values: undefined }
  | { id: "library_msg_approve_content"; description: `Are you sure you want to approve these contents?`; values: undefined }
  | { id: "library_label_reject"; description: `Reject`; values: undefined }
  | { id: "library_label_inappropriate_content"; description: `Inappropriate Content`; values: undefined }
  | { id: "library_label_quality_of_lesson"; description: `Quality of Lesson is Poor`; values: undefined }
  | { id: "library_label_no_permissions_use_assets"; description: `No Permissions to Use Assets`; values: undefined }
  | { id: "library_label_add_remove_learning_outcomes"; description: `Add/Remove Learning Outcomes`; values: undefined }
  | { id: "library_label_other"; description: `Other`; values: undefined }
  | { id: "library_msg_reject_content"; description: `Are you sure you want to reject these contents?`; values: undefined }
  | { id: "library_msg_reject_reason"; description: `Please specify the reason for rejection.`; values: undefined }
  | { id: "library_label_reason"; description: `Reason`; values: undefined }
  | { id: "library_msg_file_deleted"; description: `The file has been deleted`; values: undefined }
  | { id: "library_label_previous"; description: `Previous`; values: undefined }
  | { id: "library_label_next"; description: `Next`; values: undefined }
  | { id: "library_label_edit_content"; description: `Edit Content`; values: undefined }
  | { id: "library_error_no_permissions"; description: `You have no permission.`; values: undefined }
  | { id: "library_error_no_network_connection"; description: `No network connection`; values: undefined }
  | { id: "library_error_unknown_error"; description: `Unknown error`; values: undefined }
  | { id: "library_label_image"; description: `Image`; values: undefined }
  | { id: "library_label_video"; description: `Video`; values: undefined }
  | { id: "library_label_audio"; description: `Audio`; values: undefined }
  | { id: "library_label_document"; description: `Document`; values: undefined }
  | { id: "library_label_asset_name"; description: `Asset Name`; values: undefined }
  | { id: "library_label_upload_a_file"; description: `Upload a File`; values: undefined }
  | { id: "library_label_upload_a"; description: `Upload a {fillfileType} here`; values: { fillfileType: string | number } }
  | { id: "library_label_upload"; description: `Upload`; values: undefined }
  | { id: "library_label_file_type"; description: `File Type`; values: undefined }
  | { id: "library_label_h5p"; description: `Create Content`; values: undefined }
  | { id: "library_label_non_h5p"; description: `Upload from Device`; values: undefined }
  | { id: "library_label_select_a_file"; description: `Select a File`; values: undefined }
  | { id: "library_msg_drag_asset"; description: `Drag from Assets Library`; values: undefined }
  | { id: "library_label_upload_from_device"; description: `Upload from Device`; values: undefined }
  | { id: "library_label_preview"; description: `Preview`; values: undefined }
  | { id: "library_msg_publish_lesson_material"; description: `How would you like to publish?`; values: undefined }
  | { id: "library_msg_only_publish_lesson_material"; description: `Only publish a lesson material`; values: undefined }
  | {
      id: "library_msg_publish_lesson_material_and_asset";
      description: `Publish a lesson material, and add to assets library`;
      values: undefined;
    }
  | { id: "library_label_lesson_type"; description: `Lesson Type`; values: undefined }
  | { id: "library_label_test"; description: `Test`; values: undefined }
  | { id: "library_label_not_test"; description: `Not Test`; values: undefined }
  | { id: "library_label_self_study"; description: `Suitable for Self Study`; values: undefined }
  | { id: "library_label_drawing_activity"; description: `Drawing Activity`; values: undefined }
  | { id: "library_label_program_esl"; description: `Badanamu ESL`; values: undefined }
  | { id: "library_label_program_math"; description: `Bada Math`; values: undefined }
  | { id: "library_label_program_steam"; description: `Bada STEAM`; values: undefined }
  | { id: "library_error_unsupported_format"; description: `Unsupported Format`; values: undefined }
  | { id: "library_error_no_content"; description: `Content does not exist`; values: undefined }
  | {
      id: "library_error_content_locked";
      description: `This content is locked by editor at {email}. To use this content, ask the editor to check their Draft or Waiting for Approval or Rejected content, publish, then get it approved.`;
      values: { email: string | number };
    }
  | {
      id: "library_error_content_locked_by_me";
      description: `This content is in your Waiting for Approval list. To edit this content, ask administrator to approve or reject it.`;
      values: undefined;
    }
  | { id: "library_error_content_data_invalid"; description: `Content is empty, please upload a file.`; values: undefined }
  | {
      id: "library_error_delete_lesson_plan_in_schedule";
      description: `Unable to delete lesson plan which is scheduled`;
      values: undefined;
    }
  | { id: "library_error_update_content_failed"; description: `Update content failed`; values: undefined }
  | { id: "library_error_read_content_failed"; description: `Read content failed`; values: undefined }
  | { id: "library_error_delete_content_failed"; description: `Delete content failed`; values: undefined }
  | { id: "library_error_invalid_visibility_settings"; description: `Invalid Visibility Settings`; values: undefined }
  | { id: "library_error_associate_learning_outcome_failed"; description: `Associate learning outcome failed`; values: undefined }
  | { id: "library_label_teacher_manual"; description: `Teacher Manual`; values: undefined }
  | { id: "library_label_supported_format"; description: `Supported Format`; values: undefined }
  | { id: "library_label_max_size"; description: `Max Size`; values: undefined }
  | { id: "library_label_new_folder"; description: `New Folder`; values: undefined }
  | { id: "library_label_folder_name"; description: `Folder Name`; values: undefined }
  | { id: "library_error_duplicate_folder_name"; description: `Folder name should be unique, please use another name.`; values: undefined }
  | { id: "library_label_folder"; description: `Folder`; values: undefined }
  | { id: "library_label_items"; description: `items`; values: undefined }
  | { id: "library_label_visible"; description: `visible`; values: undefined }
  | { id: "library_label_rename"; description: `Rename`; values: undefined }
  | { id: "library_label_move"; description: `Move to`; values: undefined }
  | { id: "library_error_move_folder_to_own"; description: `Folder cannot be moved to itself or a subdirectory`; values: undefined }
  | { id: "library_label_delete_folder"; description: `Delete Folder`; values: undefined }
  | { id: "library_msg_delete_folder"; description: `Are you sure you want to delete these folders?`; values: undefined }
  | { id: "library_error_delete_folder"; description: `Folder cannot be deleted unless it is empty`; values: undefined }
  | { id: "library_label_export_as_csv"; description: `Export as CSV`; values: undefined }
  | { id: "library_label_distribute"; description: `Distribute`; values: undefined }
  | { id: "library_label_preset"; description: `Preset`; values: undefined }
  | {
      id: "library_msg_preset";
      description: `Choosing this option will make the selected content available to current and future organizations.`;
      values: undefined;
    }
  | { id: "library_label_select_organizations"; description: `Select Organizations`; values: undefined }
  | { id: "library_label_all_organizations"; description: `All`; values: undefined }
  | { id: "library_label_org"; description: `Org`; values: undefined }
  | { id: "library_label_badanamu"; description: `Badanamu`; values: undefined }
  | { id: "library_label_max_file_number"; description: `Max File Number`; values: undefined }
  | { id: "library_error_excceed_max_size"; description: `Cannot excceed max size 500 MB`; values: undefined }
  | {
      id: "library_error_excceed_max_file_number";
      description: `Failed to upload as total files number exceeds limitation 5`;
      values: undefined;
    }
  | { id: "library_label_new_content"; description: `New Content`; values: undefined }
  | { id: "library_msg_only_publish_lesson_plan"; description: `Only publish a Lesson plan`; values: undefined }
  | {
      id: "library_msg_publish_lesson_plan_and asset";
      description: `Publish a lesson plan, and add teacher manuals to assets library`;
      values: undefined;
    }
  | { id: "library_label_edit_folder"; description: `Edit Folder`; values: undefined }
  | { id: "library_label_contentType"; description: `Content Type`; values: undefined }
  | { id: "library_label_files_selected"; description: `( {value} files selected )`; values: { value: string | number } }
  | { id: "library_label_more"; description: `More`; values: undefined }
  | { id: "library_error_plan_duration"; description: `Plan's duration should be greater than lesson materials' sum`; values: undefined }
  | {
      id: "library_label_uploadInfo1";
      description: `Supported format: PDF, JPG, JPEG, PNG, GIF, BMP, AVI, MP4, MP3, WAV`;
      values: undefined;
    }
  | {
      id: "library_label_uploadInfo2";
      description: `(For Office documents, we suggest converting to PDF then upload, or using screen-sharing during class time)`;
      values: undefined;
    }
  | {
      id: "library_error_include_archived_lesson_material";
      description: `This lesson plan includes archived lesson material, please remove it and try publishing again.`;
      values: undefined;
    }
  | { id: "assess_tab_assessments"; description: `Assessments`; values: undefined }
  | { id: "assess_button_search"; description: `Search`; values: undefined }
  | { id: "assess_text_search teacher"; description: `Search Teacher`; values: undefined }
  | { id: "assess_filter_column_status"; description: `Status`; values: undefined }
  | { id: "assess_filter_all"; description: `All`; values: undefined }
  | { id: "assess_filter_complete"; description: `Complete`; values: undefined }
  | { id: "assess_filter_in_progress"; description: `Incomplete`; values: undefined }
  | { id: "assess_sort_by"; description: `Sort By`; values: undefined }
  | { id: "assess_class_end_time_new_old"; description: `Class End Time (New-Old)`; values: undefined }
  | { id: "assess_class_end_time_old_new"; description: `Class End Time (Old -New)`; values: undefined }
  | { id: "assess_complete_time_new_old"; description: `Complete Time (New-Old)`; values: undefined }
  | { id: "assess_complete_time_old_new"; description: `Complete Time (Old-New)`; values: undefined }
  | { id: "assess_column_title"; description: `Assessment Title`; values: undefined }
  | { id: "assess_column_subject"; description: `Subject`; values: undefined }
  | { id: "assess_column_program"; description: `Program`; values: undefined }
  | { id: "assess_column_teacher"; description: `Teacher`; values: undefined }
  | { id: "assess_column_class_end_time"; description: `Class End Time`; values: undefined }
  | { id: "assess_column_complete_time"; description: `Complete Time`; values: undefined }
  | { id: "assess_button_cancel"; description: `Cancel`; values: undefined }
  | { id: "assess_button_save"; description: `Save`; values: undefined }
  | { id: "assess_button_complete"; description: `Complete`; values: undefined }
  | { id: "assess_assessment_details"; description: `Assessment Details`; values: undefined }
  | { id: "assess_class_summary"; description: `Class Summary`; values: undefined }
  | { id: "assess_detail_attendance"; description: `Attendance`; values: undefined }
  | { id: "assess_button_edit"; description: `Edit`; values: undefined }
  | { id: "assess_detail_class_length"; description: `Class Length`; values: undefined }
  | { id: "assess_detail_minutes"; description: `Minutes`; values: undefined }
  | { id: "assess_detail_number_activity"; description: `Number of Activities`; values: undefined }
  | { id: "assess_detail_number_lo"; description: `Number of Learning Outcomes`; values: undefined }
  | { id: "assess_detail_assessment_complete_time"; description: `Assessment Complete Time`; values: undefined }
  | { id: "assess_popup_edit_attendance"; description: `Edit Attendance`; values: undefined }
  | { id: "assess_button_ok"; description: `OK`; values: undefined }
  | { id: "assess_filter_assumed"; description: `Assumed`; values: undefined }
  | { id: "assess_filter_unassumed"; description: `Unassumed`; values: undefined }
  | { id: "assess_column_lo"; description: `Learning Outcomes`; values: undefined }
  | { id: "assess_option_award all"; description: `Award All`; values: undefined }
  | { id: "assess_option_skip"; description: `Skip`; values: undefined }
  | { id: "assess_option_assessing_actions"; description: `Assessing Actions`; values: undefined }
  | { id: "assess_msg_discard"; description: `Discard unsaved changes?`; values: undefined }
  | { id: "assess_msg_cannot_delete"; description: `You cannot change the assessment after clicking Complete.`; values: undefined }
  | { id: "assess_msg_ one_student"; description: `You must choose at least one student.`; values: undefined }
  | { id: "assess_button_discard"; description: `Discard`; values: undefined }
  | { id: "assess_msg_no_lo"; description: `No learning outcome is available.`; values: undefined }
  | { id: "assess_msg_missing_infor"; description: `Please fill in all the information.`; values: undefined }
  | { id: "assess_msg_save_successfully"; description: `Saved Successfully.`; values: undefined }
  | { id: "assess_msg_compete_successfully"; description: `Completed Successfully.`; values: undefined }
  | { id: "assess_option_all_achieved"; description: `All Achieved`; values: undefined }
  | { id: "assess_option_none_achieved"; description: `None Achieved`; values: undefined }
  | { id: "assess_option_not_attempted"; description: `Not Covered`; values: undefined }
  | { id: "assess_msg_no_permission"; description: `You do not have permission to access this feature.`; values: undefined }
  | { id: "assess_class_type"; description: `Class Type`; values: undefined }
  | { id: "assess_class_type_class_live"; description: `Class / Live`; values: undefined }
  | { id: "assess_class_type_homefun"; description: `Study / Home Fun`; values: undefined }
  | { id: "assess_column_due_date"; description: `Due Date`; values: undefined }
  | { id: "assess_column_submit_time"; description: `Submit Time`; values: undefined }
  | { id: "assess_column_assessment_score"; description: `Assessment Score`; values: undefined }
  | { id: "assess_column_no_class"; description: `NoClass`; values: undefined }
  | { id: "assess_column_n_a"; description: `N/A`; values: undefined }
  | { id: "assess_detail_study_homefun_summary"; description: `Study / Home Fun Summary`; values: undefined }
  | { id: "assess_assignment_of_student"; description: `Assignment of {studentname}`; values: { studentname: string | number } }
  | { id: "assess_assignment_uploaded"; description: `Assignment Uploaded`; values: undefined }
  | { id: "assess_comment"; description: `Comment`; values: undefined }
  | { id: "assess_teacher_assessment"; description: `Teacher Assessment`; values: undefined }
  | { id: "assess_score_poor"; description: `Poor`; values: undefined }
  | { id: "assess_score_fair"; description: `Fair`; values: undefined }
  | { id: "assess_score_average"; description: `Average`; values: undefined }
  | { id: "assess_score_good"; description: `Good`; values: undefined }
  | { id: "assess_score_excellent"; description: `Excellent`; values: undefined }
  | { id: "assess_leave_a_comment_here"; description: `Leave a comment here`; values: undefined }
  | { id: "assess_submission_history"; description: `Submission History`; values: undefined }
  | { id: "assess_msg_new_version"; description: `A new version of the assignment has been submitted, please refresh`; values: undefined }
  | { id: "assess_submit_new_old"; description: `Submit Time (New-Old)`; values: undefined }
  | { id: "assess_submit_old_new"; description: `Submit Time (Old-New)`; values: undefined }
  | {
      id: "assess_new_version_comment";
      description: `We update to get this student's newest assignment, please assess again.`;
      values: undefined;
    }
  | { id: "assess_detail_room_id"; description: `Room ID`; values: undefined }
  | { id: "assess_detail_class_name"; description: `Class Name`; values: undefined }
  | { id: "assess_detail_lesson_name"; description: `Lesson Name`; values: undefined }
  | { id: "assess_detail_date_of_class"; description: `Date of Class`; values: undefined }
  | { id: "assess_detail_teacher_list"; description: `Teacher List`; values: undefined }
  | { id: "assess_detail_student_list"; description: `Student List`; values: undefined }
  | { id: "assess_detail_edit_student"; description: `Edit Student`; values: undefined }
  | { id: "assess_detail_see_more"; description: `See More`; values: undefined }
  | { id: "assess_detail_see_less"; description: `See Less`; values: undefined }
  | { id: "assess_detail_lesson_materials_covered"; description: `Lesson Materials Covered`; values: undefined }
  | { id: "assess_detail_edit_covered"; description: `Edit Lesson Materials Covered`; values: undefined }
  | { id: "assess_detail_edit_student_list"; description: `Edit Student List`; values: undefined }
  | { id: "assess_detail_students"; description: `Students`; values: undefined }
  | { id: "assess_detail_lesson_materials_exposed"; description: `Lesson Materials Covered`; values: undefined }
  | { id: "assess_msg_one_exposed"; description: `At least one lesson material needs to be selected as covered.`; values: undefined }
  | { id: "assess_detail_student"; description: `Student`; values: undefined }
  | { id: "assess_detail_view_covered"; description: `View Lesson Materials Covered`; values: undefined }
  | { id: "assess_detail_button_view"; description: `View`; values: undefined }
  | { id: "assess_detail_comment_here"; description: `Comment here`; values: undefined }
  | { id: "assess_study_list_study"; description: `Study`; values: undefined }
  | { id: "assess_study_teacher_name"; description: `Teacher Name`; values: undefined }
  | { id: "assess_list_study_title"; description: `Study Title`; values: undefined }
  | { id: "assess_list_completion_rate"; description: `Completion Rate`; values: undefined }
  | { id: "assess_list_assessment_remaining"; description: `Assessment Remaining`; values: undefined }
  | { id: "assess_list_remaining_days"; description: `Day(s)`; values: undefined }
  | { id: "assess_detail_no"; description: `No`; values: undefined }
  | { id: "assess_detail_lesson_material_name"; description: `Lesson Material Name`; values: undefined }
  | { id: "assess_detail_lesson_material_type"; description: `Lesson Material Type`; values: undefined }
  | { id: "assess_detail_answer"; description: `Answer`; values: undefined }
  | { id: "assess_detail_click_to_view"; description: `Click to View`; values: undefined }
  | { id: "assess_detail_maximum_possible_score"; description: `Maximum Possible Score`; values: undefined }
  | { id: "assess_detail_achieved_score"; description: `Achieved Score`; values: undefined }
  | { id: "assess_msg_exceed_maximum"; description: `The score you entered cannot exceed the maximum score.`; values: undefined }
  | { id: "assess_detail_not_attempted"; description: `Not Attempted`; values: undefined }
  | { id: "assess_detail_percentage"; description: `Percentage`; values: undefined }
  | { id: "assess_detail_click_to_add_comments"; description: `Click to add comments`; values: undefined }
  | { id: "assess_detail_click_to_view_comments"; description: `Click to view comments`; values: undefined }
  | { id: "assess_popup_add_comments"; description: `Add Comments`; values: undefined }
  | { id: "assess_popup_leave_msg"; description: `Leave a message to your student!`; values: undefined }
  | { id: "assess_popup_view_comments"; description: `View Comments`; values: undefined }
  | { id: "assess_popup_detailed_answer"; description: `Detailed Answer`; values: undefined }
  | {
      id: "assess_popup_students_not_started";
      description: `There are still students who have not started the Study activities. You cannot change the assessment after Clicking complete!`;
      values: undefined;
    }
  | { id: "assess_detail_lesson_plan_assessment"; description: `Lesson Plan Assessment`; values: undefined }
  | { id: "assess_detail_score_assessment"; description: `Score Assessment`; values: undefined }
  | { id: "assess_detail_score_full_marks"; description: `Score / Full Marks`; values: undefined }
  | { id: "assess_study_summary"; description: `Study Summary`; values: undefined }
  | { id: "assess_detail_all_students"; description: `All Students`; values: undefined }
  | { id: "assess_detail_view_by_students"; description: `View by Students`; values: undefined }
  | { id: "assess_detail_view_by_lesson_material"; description: `View by Lesson Material`; values: undefined }
  | { id: "assess_detail_all_lesson_materials"; description: `All Lesson Materials`; values: undefined }
  | { id: "assess_detail_please_select_here"; description: `Please select here`; values: undefined }
  | { id: "assess_label_create"; description: `Create`; values: undefined }
  | { id: "assess_label_for_organizations"; description: `For Organizations`; values: undefined }
  | { id: "assess_label_cancel"; description: `Cancel`; values: undefined }
  | { id: "assess_label_save"; description: `Save`; values: undefined }
  | { id: "assess_label_publish"; description: `Publish`; values: undefined }
  | { id: "assess_msg_publish_content"; description: `Are you sure you want to publish this learning outcome?`; values: undefined }
  | { id: "assess_label_ok"; description: `OK`; values: undefined }
  | { id: "assess_label_create_new_learning_outcome"; description: `Create New Learning Outcome`; values: undefined }
  | { id: "assess_label_details"; description: `Details`; values: undefined }
  | { id: "assess_label_learning_outcome_name"; description: `Learning Outcome Name`; values: undefined }
  | { id: "assess_label_short_code"; description: `Short Code`; values: undefined }
  | { id: "assess_label_assumed"; description: `Assumed`; values: undefined }
  | { id: "assess_label_program"; description: `Program`; values: undefined }
  | { id: "assess_label_subject"; description: `Subject`; values: undefined }
  | { id: "assess_label_category"; description: `Category`; values: undefined }
  | { id: "assess_label_subcategory"; description: `Subcategory`; values: undefined }
  | { id: "assess_label_age"; description: `Age`; values: undefined }
  | { id: "assess_label_grade"; description: `Grade`; values: undefined }
  | { id: "assess_label_estimated_time"; description: `Estimated Time (Minutes)`; values: undefined }
  | { id: "assess_label_keywords"; description: `Keywords`; values: undefined }
  | { id: "assess_label_description"; description: `Description`; values: undefined }
  | { id: "assess_label_published"; description: `Published`; values: undefined }
  | { id: "assess_label_pending"; description: `Pending`; values: undefined }
  | { id: "assess_label_unpublished"; description: `Unpublished`; values: undefined }
  | { id: "assess_label_assessments"; description: `Assessments`; values: undefined }
  | { id: "assess_label_empty"; description: `Empty`; values: undefined }
  | { id: "assess_label_search"; description: `Search`; values: undefined }
  | { id: "assess_msg_no_results_found"; description: `No results found`; values: undefined }
  | { id: "assess_label_my_only"; description: `Show My Content`; values: undefined }
  | { id: "assess_label_bulk_actions"; description: `Bulk Actions`; values: undefined }
  | { id: "assess_label_delete"; description: `Delete`; values: undefined }
  | { id: "assess_msg_delete_content"; description: `Are you sure you want to delete this learning outcome?`; values: undefined }
  | { id: "assess_msg_remove_select_one"; description: `At least one learning outcome should be selected.`; values: undefined }
  | { id: "assess_label_sort_by"; description: `Sort By`; values: undefined }
  | { id: "assess_label_name_atoz"; description: `Name (A-Z)`; values: undefined }
  | { id: "assess_label_name_ztoa"; description: `Name (Z-A)`; values: undefined }
  | { id: "assess_label_created_on_newtoold"; description: `Created On (New-Old)`; values: undefined }
  | { id: "assess_label_created_on_oldtonew"; description: `Created On (Old-New)`; values: undefined }
  | { id: "assess_label_learning_outcome"; description: `Learning Outcome`; values: undefined }
  | { id: "assess_label_milestone"; description: `Milestones`; values: undefined }
  | { id: "assess_label_Standard"; description: `Standards`; values: undefined }
  | { id: "assess_label_yes"; description: `Yes`; values: undefined }
  | { id: "assess_label_created_on"; description: `Created On`; values: undefined }
  | { id: "assess_label_author"; description: `Author`; values: undefined }
  | { id: "assess_label_actions"; description: `Actions`; values: undefined }
  | { id: "assess_label_draft"; description: `Draft`; values: undefined }
  | { id: "assess_label_waiting_for_approval"; description: `Waiting for Approval`; values: undefined }
  | { id: "assess_label_rejected"; description: `Rejected`; values: undefined }
  | { id: "assess_label_republish"; description: `Republish`; values: undefined }
  | { id: "assess_msg_republish_content"; description: `Are you sure you want to republish this learning outcome?`; values: undefined }
  | { id: "assess_label_organization"; description: `Organization`; values: undefined }
  | { id: "assess_label_approve"; description: `Approve`; values: undefined }
  | { id: "assess_label_reject"; description: `Reject`; values: undefined }
  | { id: "assess_msg_reject_reason"; description: `Please specify the reason for rejection.`; values: undefined }
  | { id: "assess_label_reason"; description: `Reason`; values: undefined }
  | { id: "assess_error_no_permissions"; description: `No permissions`; values: undefined }
  | { id: "assess_error_no_network_connection"; description: `No network connection`; values: undefined }
  | { id: "assess_error_unknown_error"; description: `Unknown error`; values: undefined }
  | { id: "assess_bulk_approval"; description: `Are you sure you want to approve these learning outcomes?`; values: undefined }
  | { id: "assess_set_learning_outcome_set"; description: `Learning Outcome Set`; values: undefined }
  | { id: "assess_set_add_more_sets"; description: `Add more sets`; values: undefined }
  | { id: "assess_set_create_set"; description: `Create '{setname}'`; values: { setname: string | number } }
  | { id: "assess_set_add_to_set"; description: `Add to Set`; values: undefined }
  | { id: "assess_set_select_create"; description: `Select or create a new one`; values: undefined }
  | { id: "assess_search_all"; description: `All`; values: undefined }
  | { id: "assess_search_name"; description: `Name`; values: undefined }
  | { id: "assess_search_code"; description: `Code`; values: undefined }
  | { id: "assess_search_set"; description: `Set`; values: undefined }
  | { id: "assess_msg_exist_short_code"; description: `This short code already exists, please enter it again.`; values: undefined }
  | { id: "assess_msg_short_code_error"; description: `The short code needs to be five characters long, 0-9, A-Z.`; values: undefined }
  | { id: "assess_msg_set_myonly"; description: `You can only do bulk action to your own learning outcomes.`; values: undefined }
  | { id: "assess_msg_locked_lo"; description: `You cannot do bulk actions on locked learning outcomes.`; values: undefined }
  | { id: "assess_msg_existing_set"; description: `This set already exists in the system, please try again.`; values: undefined }
  | { id: "assess_msg_locked_milestone"; description: `You cannot do bulk actions on locked milestones.`; values: undefined }
  | { id: "assess_milestone_details"; description: `Milestone Details`; values: undefined }
  | { id: "assess_milestone_detail_name"; description: `Milestone Name`; values: undefined }
  | { id: "assess_milestone_contained_lo"; description: `Contained Learning Outcomes`; values: undefined }
  | { id: "assess_milestone_detail_add"; description: `Add`; values: undefined }
  | { id: "assess_milestone_code_requirement"; description: `5 characters long, number 0-9 & letters A-Z only`; values: undefined }
  | {
      id: "assess_msg_exist_milestone_short_code";
      description: `This milestone short code already exists, please enter it again.`;
      values: undefined;
    }
  | { id: "assess_msg_deleted_successfully"; description: `Deleted Successfully`; values: undefined }
  | { id: "assess_msg_saved_successfully"; description: `Saved Successfully`; values: undefined }
  | { id: "assess_msg_updated_successfully"; description: `Updated Successfully`; values: undefined }
  | { id: "assess_msg_published_successfully"; description: `Published Successfully`; values: undefined }
  | { id: "assess_msg_delete_milestone"; description: `Are you sure you want to delete this milestone?`; values: undefined }
  | {
      id: "assess_error_message_locked";
      description: `This content is locked by editor at {email}. To use this content, ask the editor to get it approved.`;
      values: { email: string | number };
    }
  | { id: "assess_create_new_milestone"; description: `Create New Milestone`; values: undefined }
  | {
      id: "assess_msg_unlocked_milestone";
      description: `This content has been republished with a new version, please refresh.`;
      values: undefined;
    }
  | { id: "assess_approved_successfully"; description: `Approved Successfully`; values: undefined }
  | { id: "schedule_tab_schedule"; description: `Schedule`; values: undefined }
  | { id: "schedule_button_schedule_class"; description: `Schedule Class`; values: undefined }
  | { id: "schedule_button_search"; description: `Search`; values: undefined }
  | { id: "schedule_text_search_teacher"; description: `Search teacher`; values: undefined }
  | { id: "schedule_button_today"; description: `Today`; values: undefined }
  | { id: "schedule_option_week"; description: `Week`; values: undefined }
  | { id: "schedule_option_day"; description: `Day`; values: undefined }
  | { id: "schedule_option_year"; description: `Year`; values: undefined }
  | { id: "schedule_option_workweek"; description: `Workweek`; values: undefined }
  | { id: "schedule_calendar_january"; description: `January`; values: undefined }
  | { id: "schedule_calendar_february"; description: `February`; values: undefined }
  | { id: "schedule_calendar_march"; description: `March`; values: undefined }
  | { id: "schedule_calendar_april"; description: `April`; values: undefined }
  | { id: "schedule_calendar_may"; description: `May`; values: undefined }
  | { id: "schedule_calendar_june"; description: `June`; values: undefined }
  | { id: "schedule_calendar_july"; description: `July`; values: undefined }
  | { id: "schedule_calendar_august"; description: `August`; values: undefined }
  | { id: "schedule_calendar_september"; description: `September`; values: undefined }
  | { id: "schedule_calendar_october"; description: `October`; values: undefined }
  | { id: "schedule_calendar_november"; description: `November`; values: undefined }
  | { id: "schedule_calendar_december"; description: `December`; values: undefined }
  | { id: "schedule_calendar_jan"; description: `Jan`; values: undefined }
  | { id: "schedule_calendar_feb"; description: `Feb`; values: undefined }
  | { id: "schedule_calendar_mar"; description: `Mar`; values: undefined }
  | { id: "schedule_calendar_apr"; description: `Apr`; values: undefined }
  | { id: "schedule_calendar_jun"; description: `Jun`; values: undefined }
  | { id: "schedule_calendar_jul"; description: `Jul`; values: undefined }
  | { id: "schedule_calendar_aug"; description: `Aug`; values: undefined }
  | { id: "schedule_calendar_sep"; description: `Sep`; values: undefined }
  | { id: "schedule_calendar_oct"; description: `Oct`; values: undefined }
  | { id: "schedule_calendar_nov"; description: `Nov`; values: undefined }
  | { id: "schedule_calendar_dec"; description: `Dec`; values: undefined }
  | { id: "schedule_calendar_mon"; description: `Mon`; values: undefined }
  | { id: "schedule_calendar_tue"; description: `Tue`; values: undefined }
  | { id: "schedule_calendar_wed"; description: `Wed`; values: undefined }
  | { id: "schedule_calendar_thu"; description: `Thu`; values: undefined }
  | { id: "schedule_calendar_fri"; description: `Fri`; values: undefined }
  | { id: "schedule_calendar_sat"; description: `Sat`; values: undefined }
  | { id: "schedule_calendar_sun"; description: `Sun`; values: undefined }
  | { id: "schedule_calendar_mo"; description: `Mo`; values: undefined }
  | { id: "schedule_calendar_tu"; description: `Tu`; values: undefined }
  | { id: "schedule_calendar_we"; description: `We`; values: undefined }
  | { id: "schedule_calendar_th"; description: `Th`; values: undefined }
  | { id: "schedule_calendar_fr"; description: `Fr`; values: undefined }
  | { id: "schedule_calendar_sa"; description: `Sa`; values: undefined }
  | { id: "schedule_calendar_su"; description: `Su`; values: undefined }
  | { id: "schedule_detail_lesson_name"; description: `Lesson Name`; values: undefined }
  | { id: "schedule_detail_add_class"; description: `Add Class`; values: undefined }
  | { id: "schedule_detail_lesson_plan"; description: `Lesson Plan`; values: undefined }
  | { id: "schedule_detail_teacher"; description: `Teacher`; values: undefined }
  | { id: "schedule_detail_start_time"; description: `Start Time`; values: undefined }
  | { id: "schedule_detail_end_time"; description: `End Time`; values: undefined }
  | { id: "schedule_detail_year"; description: `Year`; values: undefined }
  | { id: "schedule_detail_month"; description: `Month`; values: undefined }
  | { id: "schedule_detail_day"; description: `Day`; values: undefined }
  | { id: "schedule_detail_all_day"; description: `All day`; values: undefined }
  | { id: "schedule_detail_repeat"; description: `Repeat`; values: undefined }
  | { id: "schedule_detail_subject"; description: `Subject`; values: undefined }
  | { id: "schedule_detail_program"; description: `Program`; values: undefined }
  | { id: "schedule_detail_class_type"; description: `Class Type`; values: undefined }
  | { id: "schedule_detail_online_class"; description: `Live`; values: undefined }
  | { id: "schedule_detail_offline_class"; description: `Class`; values: undefined }
  | { id: "schedule_detail_homework"; description: `Study`; values: undefined }
  | { id: "schedule_detail_task"; description: `Task`; values: undefined }
  | { id: "schedule_detail_due_date"; description: `Due Date`; values: undefined }
  | { id: "schedule_detail_pick_time"; description: `Pick Time`; values: undefined }
  | { id: "schedule_detail_description"; description: `Description`; values: undefined }
  | { id: "schedule_detail_attachment"; description: `Attachment`; values: undefined }
  | { id: "schedule_detail_max"; description: `Max`; values: undefined }
  | { id: "schedule_detail_support_files_in"; description: `Support files in`; values: undefined }
  | { id: "schedule_detail_video"; description: `Video`; values: undefined }
  | { id: "schedule_detail_audio"; description: `Audio`; values: undefined }
  | { id: "schedule_detail_image"; description: `Image`; values: undefined }
  | { id: "schedule_detail_document"; description: `Document`; values: undefined }
  | { id: "schedule_button_preview"; description: `Preview`; values: undefined }
  | { id: "schedule_button_go_live"; description: `Go Live`; values: undefined }
  | { id: "schedule_repeat_daily"; description: `Daily`; values: undefined }
  | { id: "schedule_repeat_weekly"; description: `Weekly`; values: undefined }
  | { id: "schedule_repeat_monthly"; description: `Monthly`; values: undefined }
  | { id: "schedule_repeat_yearly"; description: `Yearly`; values: undefined }
  | { id: "schedule_repeat_every"; description: `Repeat every`; values: undefined }
  | { id: "schedule_repeat_day"; description: `day(s)`; values: undefined }
  | { id: "schedule_repeat_week"; description: `week(s)`; values: undefined }
  | { id: "schedule_repeat_month"; description: `month(s)`; values: undefined }
  | { id: "schedule_repeat_year"; description: `year(s)`; values: undefined }
  | { id: "schedule_end_repeat"; description: `End Repeat`; values: undefined }
  | { id: "schedule_repeat_never"; description: `Never`; values: undefined }
  | { id: "schedule_repeat_after"; description: `After`; values: undefined }
  | { id: "schedule_repeat_occurrence(s)"; description: `Occurrence(s)`; values: undefined }
  | { id: "schedule_repeat_on"; description: `On`; values: undefined }
  | { id: "schedule_frequency_month"; description: `of every month`; values: undefined }
  | { id: "schedule_frequency_year"; description: `of every year`; values: undefined }
  | { id: "schedule_month_the"; description: `The`; values: undefined }
  | { id: "schedule_frequency_first"; description: `first`; values: undefined }
  | { id: "schedule_frequency_second"; description: `second`; values: undefined }
  | { id: "schedule_frequency_third"; description: `thrid`; values: undefined }
  | { id: "schedule_frequency_fourth"; description: `fourth`; values: undefined }
  | { id: "schedule_frequency_last"; description: `last`; values: undefined }
  | { id: "schedule_frequency_monday"; description: `Monday`; values: undefined }
  | { id: "schedule_frequency_tuesday"; description: `Tuesday`; values: undefined }
  | { id: "schedule_frequency_wednesday"; description: `Wednesday`; values: undefined }
  | { id: "schedule_frequency_thursday"; description: `Thursday`; values: undefined }
  | { id: "schedule_frequency_friday"; description: `Friday`; values: undefined }
  | { id: "schedule_frequency_saturday"; description: `Saturday`; values: undefined }
  | { id: "schedule_frequency_sunday"; description: `Sunday`; values: undefined }
  | { id: "schedule_yearly_every"; description: `Every`; values: undefined }
  | { id: "schedule_yearly_of_jan"; description: `of January`; values: undefined }
  | { id: "schedule_yearly_of_feb"; description: `of February`; values: undefined }
  | { id: "schedule_yearly_of_mar"; description: `of March`; values: undefined }
  | { id: "schedule_yearly_of_apr"; description: `of April`; values: undefined }
  | { id: "schedule_yearly_of_may"; description: `of May`; values: undefined }
  | { id: "schedule_yearly_of_jun"; description: `of June`; values: undefined }
  | { id: "schedule_yearly_of_jul"; description: `of July`; values: undefined }
  | { id: "schedule_yearly_of_aug"; description: `of August`; values: undefined }
  | { id: "schedule_yearly_of_sep"; description: `of September`; values: undefined }
  | { id: "schedule_yearly_of_oct"; description: `of October`; values: undefined }
  | { id: "schedule_yearly_of_nov"; description: `of November`; values: undefined }
  | { id: "schedule_yearly_of_dec"; description: `of December`; values: undefined }
  | { id: "schedule_msg_delete"; description: `Are you sure you want to delete this event?`; values: undefined }
  | { id: "schedule_button_delete"; description: `DELETE`; values: undefined }
  | { id: "schedule_button_cancel"; description: `CANCEL`; values: undefined }
  | { id: "schedule_msg_discard"; description: `Discard unsaved changes?`; values: undefined }
  | { id: "schedule_button_discard"; description: `DISCARD`; values: undefined }
  | { id: "schedule_msg_two_year"; description: `You cannot schedule a class beyond two years.`; values: undefined }
  | { id: "schedule_button_ok"; description: `OK`; values: undefined }
  | {
      id: "schedule_msg_overlap";
      description: `You already have a class scheduled during this time. Confirm to schedule?`;
      values: undefined;
    }
  | { id: "schedule_button_confirm"; description: `CONFIRM`; values: undefined }
  | { id: "schedule_msg_edit_recurring"; description: `Edit recurring event`; values: undefined }
  | { id: "schedule_msg_delete_recurring"; description: `Delete recurring event`; values: undefined }
  | { id: "schedule_option_this_event"; description: `This event`; values: undefined }
  | { id: "schedule_option_all_events"; description: `This and following events`; values: undefined }
  | { id: "schedule_msg_edit_overlap"; description: `This event has been changed. Please refresh.`; values: undefined }
  | { id: "schedule_msg_delete_overlap"; description: `This event is deleted.`; values: undefined }
  | { id: "schedule_msg_attachment"; description: `The attachment you uploaded does not meet the requirement.`; values: undefined }
  | { id: "schedule_msg_no_result"; description: `No results found.`; values: undefined }
  | {
      id: "schedule_schedule_msg_edit_all";
      description: `This is an event in a series. Are you sure you want to edit this and following events?`;
      values: undefined;
    }
  | { id: "schedule_msg_delete_success"; description: `Deleted successfully`; values: undefined }
  | { id: "schedule_msg_upload_format"; description: `Please upload the file in the correct format`; values: undefined }
  | { id: "schedule_label_teacher_name"; description: `Teacher Name`; values: undefined }
  | { id: "schedule_msg_start_current"; description: `Start time cannot be earlier than current time`; values: undefined }
  | {
      id: "schedule_msg_due_date_earlier";
      description: `The due date cannot be earlier than the scheduled class end time.`;
      values: undefined;
    }
  | { id: "schedule_msg_end_time_earlier"; description: `End time cannot be earlier than start time`; values: undefined }
  | { id: "schedule_button_edit"; description: `Edit`; values: undefined }
  | { id: "schedule_popup_fillin"; description: `Please fill out this field`; values: undefined }
  | { id: "schedule_popup_valid"; description: `Please enter a valid date`; values: undefined }
  | { id: "schedule_preview_live"; description: `KidsLoop Live`; values: undefined }
  | { id: "schedule_preview_class"; description: `KidsLoop Class`; values: undefined }
  | { id: "schedule_preview_study"; description: `KidsLoop Study`; values: undefined }
  | { id: "schedule_detail_participants"; description: `Add Participants`; values: undefined }
  | { id: "scheudule_filter_all_my_schedule"; description: `My Schedule`; values: undefined }
  | { id: "schedule_filter_schools"; description: `Schools`; values: undefined }
  | { id: "schedule_filter_teachers"; description: `Teachers`; values: undefined }
  | { id: "schedule_filter_classes"; description: `Classes`; values: undefined }
  | { id: "schedule_filter_subjects"; description: `Subjects`; values: undefined }
  | { id: "schedule_filter_programs"; description: `Programs`; values: undefined }
  | { id: "schedule_filter_no_data"; description: `No Data`; values: undefined }
  | { id: "schedule_msg_no_permission"; description: `You do not have permission to access this feature.`; values: undefined }
  | { id: "schedule_msg_no_student"; description: `There is no student in this class`; values: undefined }
  | {
      id: "schedule_msg_delete_minutes";
      description: `You can only delete a class at least 5 minutes before the start time.`;
      values: undefined;
    }
  | {
      id: "schedule_msg_edit_minutes";
      description: `You can only edit a class at least 5 minutes before the start time.`;
      values: undefined;
    }
  | { id: "schedule_msg_start_minutes"; description: `You can only start a class 15 minutes before the start time.`; values: undefined }
  | { id: "schedule_button_click_to schedule"; description: `Click to Schedule`; values: undefined }
  | { id: "schedule_msg_time_expired"; description: `Time Expired`; values: undefined }
  | {
      id: "schedule_msg_recall_lesson_plan";
      description: `Oops! The lesson plan included for this lesson has already been deleted!`;
      values: undefined;
    }
  | { id: "schedule_button_start_class"; description: `Start Class`; values: undefined }
  | { id: "schedule_button_go_study"; description: `Go Study`; values: undefined }
  | { id: "schedule_msg_earlier_today"; description: `Due date cannot be earlier than today.`; values: undefined }
  | { id: "schedule_detail_class_roster"; description: `Class Roster`; values: undefined }
  | { id: "schedule_detail_select_all"; description: `Select All`; values: undefined }
  | { id: "schedule_detail_unselect_all"; description: `Unselect All`; values: undefined }
  | { id: "schedule_time_conflict_msg"; description: `Time conflicts occurred, please specify`; values: undefined }
  | { id: "schedule_time_conflict_option_1"; description: `Not schedule`; values: undefined }
  | { id: "schedule_time_conflict_option_2"; description: `Schedule anyway`; values: undefined }
  | { id: "schedule_time_conflict_student"; description: `Student`; values: undefined }
  | { id: "schedule_participants_button_add"; description: `Add`; values: undefined }
  | { id: "schedule_time_conflict_checking"; description: `Participants`; values: undefined }
  | { id: "schedule_msg_roster_no_ok"; description: `Please confirm the field of ‘Class Roster’ by clicking OK`; values: undefined }
  | {
      id: "schedule_msg_no_user";
      description: `For ‘Add Class’ (Class Roster) and ‘Add Participants’, at least a student and a teacher will need to be added into either of the field.`;
      values: undefined;
    }
  | {
      id: "schedule_msg_roster_update";
      description: `The class roster has just been updated, please refresh and try again`;
      values: undefined;
    }
  | {
      id: "schedule_msg_participants_update";
      description: `The participants' list has just been updated, please refresh and try again`;
      values: undefined;
    }
  | {
      id: "schedule_msg_roster_participants_edit";
      description: `Please kindly be notified that the users included in this event had been updated.`;
      values: undefined;
    }
  | {
      id: "schedule_msg_participants_no_ok";
      description: `Please confirm the field of ‘Add Participants’ by clicking OK`;
      values: undefined;
    }
  | { id: "schedule_msg_edit_due_date"; description: `You cannot edit this event after the due date.`; values: undefined }
  | { id: "schedule_msg_delete_due_date"; description: `You cannot delete this event after the due date.`; values: undefined }
  | { id: "schedule_checkbox_home_fun"; description: `Home Fun`; values: undefined }
  | { id: "schedule_student_feedback"; description: `Student Feedback`; values: undefined }
  | { id: "schedule_detail_comment"; description: `Comment`; values: undefined }
  | { id: "schedule_upload_assignment"; description: `Upload Assignment`; values: undefined }
  | { id: "schedule_upload_more"; description: `Upload More`; values: undefined }
  | { id: "schedule_button_submit"; description: `Submit`; values: undefined }
  | {
      id: "schedule_msg_assignment_new";
      description: `Students have already submitted assignments, a new event will be created.`;
      values: undefined;
    }
  | {
      id: "schedule_msg_hide";
      description: `This event cannot be deleted because assignments have already been uploaded. Do you want to hide it instead?`;
      values: undefined;
    }
  | { id: "schedule_msg_visible"; description: `This event is visible again.`; values: undefined }
  | { id: "schedule_msg_submit"; description: `Your assignment will be submitted for assessment.`; values: undefined }
  | {
      id: "schedule_msg_cannot_submit";
      description: `You cannot submit again because your assignment has already been assessed.`;
      values: undefined;
    }
  | { id: "schedule_detail_see_more"; description: `See More`; values: undefined }
  | { id: "schedule_msg_hidden"; description: `This event has been hidden`; values: undefined }
  | { id: "schedule_msg_three_attachment"; description: `You can upload no more than three attachments.`; values: undefined }
  | { id: "schedule_msg_one_attachment"; description: `You can upload only one attachment.`; values: undefined }
  | { id: "schedule_attachment_size_each"; description: `each`; values: undefined }
  | { id: "schedule_assignment_no_class"; description: `No Class`; values: undefined }
  | { id: "schedule_filter_all_my_schools"; description: `All My Schools`; values: undefined }
  | { id: "schedule_filter_others"; description: `Others`; values: undefined }
  | { id: "schedule_filter_undefined"; description: `Undefined`; values: undefined }
  | { id: "schedule_filter_class_types"; description: `Class Types`; values: undefined }
  | { id: "schedule_filter_only_mine"; description: `Only Mine`; values: undefined }
  | { id: "schedule_filter_view_any_time_study"; description: `View Anytime Study`; values: undefined }
  | { id: "schedule_filter_all"; description: `All`; values: undefined }
  | { id: "schedule_any_anytime_study"; description: `Anytime Study`; values: undefined }
  | { id: "schedule_detail_see_less"; description: `See Less`; values: undefined }
  | { id: "schedule_detail_students"; description: `Students`; values: undefined }
  | { id: "schedule_calendar_more"; description: `More`; values: undefined }
  | { id: "schedule_msg_no_available"; description: `No anytime study is available`; values: undefined }
  | { id: "schedule_popup_room_id"; description: `Room ID`; values: undefined }
  | { id: "schedule_popup_class_name"; description: `Class Name`; values: undefined }
  | { id: "schedule_detail_lesson_material"; description: `Lesson Material`; values: undefined }
  | {
      id: "schedule_msg_cannot_edit_study";
      description: `This event cannot be edited because some students already made progress for Study activities.`;
      values: undefined;
    }
  | {
      id: "schedule_msg_cannot_delete_study";
      description: `This event cannot be deleted because some students already made progress for this activity.`;
      values: undefined;
    }
  | { id: "report_label_student_achievement"; description: `Learning Outcome Report`; values: undefined }
  | { id: "report_label_teacher"; description: `Teacher`; values: undefined }
  | { id: "report_label_class"; description: `Class`; values: undefined }
  | { id: "report_label_lesson_plan"; description: `Lesson Plan`; values: undefined }
  | { id: "report_label_status"; description: `Status`; values: undefined }
  | { id: "report_label_all"; description: `All`; values: undefined }
  | { id: "report_label_achieved"; description: `Achieved`; values: undefined }
  | { id: "report_label_not_achieved"; description: `Not Achieved`; values: undefined }
  | { id: "report_label_not_attempted"; description: `Not Covered`; values: undefined }
  | { id: "report_label_sort_by"; description: `Sort By Outcomes`; values: undefined }
  | { id: "report_label_ascending"; description: `Ascending`; values: undefined }
  | { id: "report_label_descending"; description: `Descending`; values: undefined }
  | { id: "report_label_learning_outcomes_percentage"; description: `Learning Outcomes %`; values: undefined }
  | { id: "report_label_absent"; description: `Absent`; values: undefined }
  | { id: "report_error_no_permissions"; description: `You have no permission.`; values: undefined }
  | { id: "report_error_no_network_connection"; description: `No network connection`; values: undefined }
  | { id: "report_error_unknown_error"; description: `Unknown error`; values: undefined }
  | { id: "report_label_lo_in_categories"; description: `Skill Coverage Report`; values: undefined }
  | { id: "report_label_lo"; description: `LOs`; values: undefined }
  | { id: "report_label_student_performance"; description: `Student Performance`; values: undefined }
  | { id: "report_label_learning_outcome_completion"; description: `Learning Outcome Completion`; values: undefined }
  | { id: "report_label_time_spent_on_h5p_activities"; description: `Time Spent on Activities`; values: undefined }
  | { id: "report_label_time_spent_on_h5p_activities_break_down"; description: `Time Spent on Activities Break Down`; values: undefined }
  | { id: "report_label_total_duration"; description: `Total Duration`; values: undefined }
  | { id: "report_label_avg_duration"; description: `Avg Duration`; values: undefined }
  | { id: "report_label_report_list"; description: `Analytics and Reports`; values: undefined }
  | { id: "report_label_teaching_load"; description: `Teacher Usage Report`; values: undefined }
  | { id: "report_label_school"; description: `School`; values: undefined }
  | { id: "report_label_0_2_hours"; description: `0~2 Hours`; values: undefined }
  | { id: "report_label_2_4_hours"; description: `2~4 Hours`; values: undefined }
  | { id: "report_label_4_6_hours"; description: `4~6 Hours`; values: undefined }
  | { id: "report_label_more_than_6_hours"; description: `More than 6 Hours`; values: undefined }
  | { id: "report_label_total"; description: `Total`; values: undefined }
  | { id: "report_label_live"; description: `Live`; values: undefined }
  | { id: "report_label_hours"; description: `Hours`; values: undefined }
  | { id: "report_label_mins"; description: `mins`; values: undefined }
  | { id: "report_label_go_back"; description: `Return to Analytics and Reports`; values: undefined }
  | { id: "report_label_individual_achievement"; description: `Learner Skill Achievement`; values: undefined }
  | { id: "general_error_unauthorized"; description: `User not logged in, please log in`; values: undefined }
  | { id: "general_error_no_organization"; description: `You have no organization`; values: undefined }
  | { id: "general_error_unknown"; description: `Server request failed`; values: undefined }
  | { id: "general_button_CANCEL"; description: `CANCEL`; values: undefined }
  | { id: "general_button_SAVE"; description: `SAVE`; values: undefined }
  | { id: "general_button_OK"; description: `OK`; values: undefined }
  | { id: "general_button_DISCARD"; description: `DISCARD`; values: undefined }
  | { id: "general_button_CONFIRM"; description: `CONFIRM`; values: undefined }
  | { id: "general_button_NO "; description: `NO`; values: undefined }
  | { id: "general_button_YES"; description: `YES`; values: undefined }
  | { id: "general_button_DELETE"; description: `DELETE`; values: undefined }
  | { id: "general_error_no_permission"; description: `You have no permission`; values: undefined }
  | { id: "h5p_label_commonFields"; description: `Text overrides and translations`; values: undefined }
  | {
      id: "h5p_label_commonFieldsDescription";
      description: `Here you can edit settings or translate texts used in this content.`;
      values: undefined;
    }
  | { id: "h5p_label_language"; description: `Language`; values: undefined }
  | { id: "h5p_label_ADD"; description: `Add`; values: undefined }
  | { id: "h5p_label_ITEM"; description: `Item`; values: undefined }
  | { id: "h5p_label_dragQuestion_transform"; description: `Transform`; values: undefined }
  | { id: "h5p_label_dragQuestion_position"; description: `Position`; values: undefined }
  | { id: "h5p_label_dragQuestion_size"; description: `Size`; values: undefined }
  | { id: "h5p_label_dragQuestion_copy"; description: `Copy`; values: undefined }
  | { id: "h5p_label_dragQuestion_BringtoFront"; description: `Bring to Front`; values: undefined }
  | { id: "h5p_label_dragQuestion_SendtoBack"; description: `Send to Back`; values: undefined }
  | { id: "h5p_label_dragQuestion_AddDropZones"; description: `Add Drop Zones`; values: undefined }
  | { id: "h5p_label_dragQuestion_Text"; description: `Text`; values: undefined }
  | { id: "h5p_label_dragQuestion_Paste"; description: `Paste`; values: undefined }
  | { id: "h5p_label_removeItem"; description: `Remove Item`; values: undefined }
  | { id: "h5p_label_step"; description: `Step{index}`; values: { index: string | number } }
  | { id: "h5p_label_PreviousStep"; description: `Previous Step`; values: undefined }
  | { id: "h5p_label_NextStep"; description: `Next Step`; values: undefined }
  | { id: "h5p_label_content_types"; description: `Search for Content Types`; values: undefined }
  | { id: "h5p_label_all_content_types"; description: `All Content Types`; values: undefined }
  | { id: "h5p_label_results"; description: `Results`; values: undefined }
  | { id: "h5p_label_show"; description: `Show`; values: undefined }
  | { id: "h5p_label_popular_first"; description: `Popular First`; values: undefined }
  | { id: "h5p_label_newest_first"; description: `Newest First`; values: undefined }
  | { id: "h5p_label_a_to_z"; description: `A to Z`; values: undefined }
  | { id: "h5p_label_select_content_type"; description: `Select Content Type`; values: undefined }
  | { id: "h5p_label_license"; description: `License`; values: undefined }
  | { id: "h5p_label_detail"; description: `Detail`; values: undefined }
  | { id: "h5p_label_change_content_type"; description: `Change Content Type?`; values: undefined }
  | {
      id: "h5p_label_dialog_content";
      description: `By doing this you will lose all work done with the current content type. Are you sure you wish to change content type?`;
      values: undefined;
    }
  | { id: "h5p_label_cancel"; description: `Cancel`; values: undefined }
  | { id: "h5p_label_confirm"; description: `Confirm`; values: undefined }
  | { id: "h5p_label_imageSummary"; description: `Here you can upload image types like jpg, jpeg, png, gif, bmp.`; values: undefined }
  | { id: "h5p_label_imageDes"; description: `Here you can upload image types like jpg, jpeg, png, gif, bmp.`; values: undefined }
  | { id: "h5p_label_desOwner"; description: `-`; values: undefined }
  | { id: "h5p_label_audioSummary"; description: `Here you can upload audio types like mp3, wav.`; values: undefined }
  | { id: "h5p_label_audioDes"; description: `Here you can upload audio types like mp3, wav.`; values: undefined }
  | { id: "h5p_label_videoSummary"; description: `Here you can upload video types like avi, mp4.`; values: undefined }
  | { id: "h5p_label_videoDes"; description: `Here you can upload video types like avi, mp4.`; values: undefined }
  | { id: "h5p_label_pdf"; description: `Document`; values: undefined }
  | { id: "h5p_label_pdfSummary"; description: `Here you can upload document types like pdf.`; values: undefined }
  | { id: "h5p_label_pdfDes"; description: `Here you can upload document types like pdf.`; values: undefined }
  | { id: "h5p_label_lib_title_Accordion"; description: `Accordion`; values: undefined }
  | { id: "h5p_label_lib_title_ArithmeticQuiz"; description: `Arithmetic Quiz`; values: undefined }
  | { id: "h5p_label_lib_title_Chart"; description: `Chart`; values: undefined }
  | { id: "h5p_label_lib_title_Collage"; description: `Collage`; values: undefined }
  | { id: "h5p_label_lib_title_Column"; description: `Column`; values: undefined }
  | { id: "h5p_label_lib_title_CoursePresentation"; description: `Course Presentation`; values: undefined }
  | { id: "h5p_label_lib_title_Dialogcards"; description: `Dialog Cards`; values: undefined }
  | { id: "h5p_label_lib_title_DocumentationTool"; description: `Documentation Tool`; values: undefined }
  | { id: "h5p_label_lib_title_DragQuestion"; description: `Drag and Drop`; values: undefined }
  | { id: "h5p_label_lib_title_DragText"; description: `Drag the Words`; values: undefined }
  | { id: "h5p_label_lib_title_Blanks"; description: `Fill in the Blanks`; values: undefined }
  | { id: "h5p_label_lib_title_ImageHotspotQuestion"; description: `Find the Hotspot`; values: undefined }
  | { id: "h5p_label_lib_title_GuessTheAnswer"; description: `Guess the Answer`; values: undefined }
  | { id: "h5p_label_lib_title_IFrameEmbed"; description: `Iframe Embedder`; values: undefined }
  | { id: "h5p_label_lib_title_InteractiveVideo"; description: `Interactive Video`; values: undefined }
  | { id: "h5p_label_lib_title_MarkTheWords"; description: `Mark the Words`; values: undefined }
  | { id: "h5p_label_lib_title_MemoryGame"; description: `Memory Game`; values: undefined }
  | { id: "h5p_label_lib_title_MultiChoice"; description: `Multiple Choice`; values: undefined }
  | { id: "h5p_label_lib_title_PersonalityQuiz"; description: `Personality Quiz`; values: undefined }
  | { id: "h5p_label_lib_title_Questionnaire"; description: `Questionnaire`; values: undefined }
  | { id: "h5p_label_lib_title_QuestionSet"; description: `Quiz (Question Set)`; values: undefined }
  | { id: "h5p_label_lib_title_SingleChoiceSet"; description: `Single Choice Set`; values: undefined }
  | { id: "h5p_label_lib_title_Summary"; description: `Summary`; values: undefined }
  | { id: "h5p_label_lib_title_Timeline"; description: `Timeline`; values: undefined }
  | { id: "h5p_label_lib_title_TrueFalse"; description: `True/False Question`; values: undefined }
  | { id: "h5p_label_lib_title_ImageHotspots"; description: `Image Hotspots`; values: undefined }
  | { id: "h5p_label_lib_title_ImageMultipleHotspotQuestion"; description: `Find Multiple Hotspots`; values: undefined }
  | { id: "h5p_label_lib_title_ImageJuxtaposition"; description: `Image Juxtaposition`; values: undefined }
  | { id: "h5p_label_lib_title_Audio"; description: `Audio`; values: undefined }
  | { id: "h5p_label_lib_title_AudioRecorder"; description: `Audio Recorder`; values: undefined }
  | { id: "h5p_label_lib_title_SpeakTheWords"; description: `Speak the Words`; values: undefined }
  | { id: "h5p_label_lib_title_Agamotto"; description: `Agamotto (Image Blender)`; values: undefined }
  | { id: "h5p_label_lib_title_ImageSequencing"; description: `Image Sequencing`; values: undefined }
  | { id: "h5p_label_lib_title_Flashcards"; description: `Flashcards`; values: undefined }
  | { id: "h5p_label_lib_title_SpeakTheWordsSet"; description: `Speak the Words Set`; values: undefined }
  | { id: "h5p_label_lib_title_ImageSlider"; description: `Image Slider`; values: undefined }
  | { id: "h5p_label_lib_title_Essay"; description: `Essay`; values: undefined }
  | { id: "h5p_label_lib_title_ImagePair"; description: `Image Pairing`; values: undefined }
  | { id: "h5p_label_lib_title_Dictation"; description: `Dictation`; values: undefined }
  | { id: "h5p_label_lib_title_BranchingScenario"; description: `Branching Scenario (beta)`; values: undefined }
  | { id: "h5p_label_lib_title_ThreeImage"; description: `Virtual Tour (360)`; values: undefined }
  | { id: "h5p_label_lib_title_FindTheWords"; description: `Find the words`; values: undefined }
  | { id: "h5p_label_lib_title_InteractiveBook"; description: `Interactive Book`; values: undefined }
  | { id: "h5p_label_lib_title_KewArCode"; description: `KewAr Code`; values: undefined }
  | { id: "h5p_label_lib_title_AdventCalendar"; description: `Advent Calendar (beta)`; values: undefined }
  | { id: "h5p_label_lib_summary_Accordion"; description: `Create vertically stacked expandable items`; values: undefined }
  | { id: "h5p_label_lib_summary_ArithmeticQuiz"; description: `Create time-based arithmetic quizzes`; values: undefined }
  | { id: "h5p_label_lib_summary_Chart"; description: `Quickly generate bar and pie charts`; values: undefined }
  | { id: "h5p_label_lib_summary_Collage"; description: `Create a collage of multiple images`; values: undefined }
  | { id: "h5p_label_lib_summary_Column"; description: `Organize content into a column layout`; values: undefined }
  | { id: "h5p_label_lib_summary_CoursePresentation"; description: `Create a presentation with interactive slides`; values: undefined }
  | { id: "h5p_label_lib_summary_Dialogcards"; description: `Create text-based turning cards`; values: undefined }
  | { id: "h5p_label_lib_summary_DocumentationTool"; description: `Create a form wizard with text export`; values: undefined }
  | { id: "h5p_label_lib_summary_DragQuestion"; description: `Create drag and drop tasks with images`; values: undefined }
  | { id: "h5p_label_lib_summary_DragText"; description: `Create text-based drag and drop tasks`; values: undefined }
  | { id: "h5p_label_lib_summary_Blanks"; description: `Create a task with missing words in a text`; values: undefined }
  | { id: "h5p_label_lib_summary_ImageHotspotQuestion"; description: `Create image hotspot for users to find`; values: undefined }
  | { id: "h5p_label_lib_summary_GuessTheAnswer"; description: `Create an image with a question and answer`; values: undefined }
  | { id: "h5p_label_lib_summary_IFrameEmbed"; description: `Embed from a url or a set of files`; values: undefined }
  | { id: "h5p_label_lib_summary_InteractiveVideo"; description: `Create videos enriched with interactions`; values: undefined }
  | { id: "h5p_label_lib_summary_MarkTheWords"; description: `Create a task where users highlight words`; values: undefined }
  | { id: "h5p_label_lib_summary_MemoryGame"; description: `Create the classic image pairing game`; values: undefined }
  | { id: "h5p_label_lib_summary_MultiChoice"; description: `Create flexible multiple choice questions`; values: undefined }
  | { id: "h5p_label_lib_summary_PersonalityQuiz"; description: `Create personality quizzes`; values: undefined }
  | { id: "h5p_label_lib_summary_Questionnaire"; description: `Create a questionnaire to receive feedback`; values: undefined }
  | { id: "h5p_label_lib_summary_QuestionSet"; description: `Create a sequence of various question types`; values: undefined }
  | { id: "h5p_label_lib_summary_SingleChoiceSet"; description: `Create questions with one correct answer`; values: undefined }
  | { id: "h5p_label_lib_summary_Summary"; description: `Create tasks with a list of statements`; values: undefined }
  | { id: "h5p_label_lib_summary_Timeline"; description: `Create a timeline of events with multimedia`; values: undefined }
  | { id: "h5p_label_lib_summary_TrueFalse"; description: `Create True/False questions`; values: undefined }
  | { id: "h5p_label_lib_summary_ImageHotspots"; description: `Create an image with multiple info hotspots`; values: undefined }
  | { id: "h5p_label_lib_summary_ImageMultipleHotspotQuestion"; description: `Create many hotspots for users to find`; values: undefined }
  | { id: "h5p_label_lib_summary_ImageJuxtaposition"; description: `Create interactive images`; values: undefined }
  | { id: "h5p_label_lib_summary_Audio"; description: `Upload an audio recording`; values: undefined }
  | { id: "h5p_label_lib_summary_AudioRecorder"; description: `Create an audio recording`; values: undefined }
  | { id: "h5p_label_lib_summary_SpeakTheWords"; description: `Answer a question using your voice (Chrome only)`; values: undefined }
  | { id: "h5p_label_lib_summary_Agamotto"; description: `Present a sequence of images and explanations`; values: undefined }
  | { id: "h5p_label_lib_summary_ImageSequencing"; description: `Place images in the correct order`; values: undefined }
  | { id: "h5p_label_lib_summary_Flashcards"; description: `Create stylish and modern flashcards`; values: undefined }
  | {
      id: "h5p_label_lib_summary_SpeakTheWordsSet";
      description: `Create a series of questions answered by speech (Chrome only)`;
      values: undefined;
    }
  | { id: "h5p_label_lib_summary_ImageSlider"; description: `Easily create an Image Slider`; values: undefined }
  | { id: "h5p_label_lib_summary_Essay"; description: `Create Essay with instant feedback`; values: undefined }
  | { id: "h5p_label_lib_summary_ImagePair"; description: `Drag and drop image matching game`; values: undefined }
  | { id: "h5p_label_lib_summary_Dictation"; description: `Create a dictation with instant feedback`; values: undefined }
  | { id: "h5p_label_lib_summary_BranchingScenario"; description: `Create dilemmas and self paced learning`; values: undefined }
  | { id: "h5p_label_lib_summary_ThreeImage"; description: `Create 360 environments with interactions`; values: undefined }
  | { id: "h5p_label_lib_summary_FindTheWords"; description: `Grid word search game`; values: undefined }
  | { id: "h5p_label_lib_summary_InteractiveBook"; description: `Create small courses, books and tests`; values: undefined }
  | { id: "h5p_label_lib_summary_KewArCode"; description: `Create QR codes for different purposes`; values: undefined }
  | { id: "h5p_label_lib_summary_AdventCalendar"; description: `Create surprises that will be unveiled daily`; values: undefined }
  | {
      id: "h5p_label_lib_description_Accordion";
      description: `Reduce the amount of text presented to readers by using this responsive accordion. Readers decide which headlines to take a closer look at by expanding the title. Excellent for providing an overview with optional in-depth explanations.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_ArithmeticQuiz";
      description: `Create arithmetic quizzes consisting of multiple choice questions. As an author, all you have to do is decide the type and length of the quiz. Users keep track of score and time spent when solving the quiz.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Chart";
      description: `Need to present simple statistical data graphically without creating the artwork manually? Chart is your answer.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Collage";
      description: `The Collage tool allows you to organize images into a soothing composition.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Column";
      description: `Organize your content type into a column layout with H5P Column. Content types that address similar material or share a common theme can now be grouped together to create a coherent learning experience. In addition, authors are free to be creative by combining almost all of the existing H5P content types.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_CoursePresentation";
      description: `Course presentations consist of slides with multimedia, text, and many different types of interactions like interactive summaries, multiple choice questions and interactive videos. Learners can experience new interactive learning material and test their knowledge and memory in Course Presentations. As always with H5P, content is editable in web browsers, and the Course Presentation activity type includes a WYSIWYG drag and drop based authoring tool. A typical use of the Course Presentation activity is to use a few slides to introduce a subject and follow these with a few more slides in which the user’s knowledge is tested. Course Presentations may however be used in many different ways, including as a presentation tool for use in the classroom, or as a game where the usual navigation is replaced with navigation buttons on top of the slides to let the user make choices and see the consequences of their choices.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Dialogcards";
      description: `Dialog cards can be used as a drill to help learners memorize words, expressions or sentences. On the front of the card, there's a hint for a word or expression. By turning the card the learner reveals a corresponding word or expression. Dialog cards can be used in language learning, to present math problems or help learners remember facts such as historical events, formulas or names.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_DocumentationTool";
      description: `The documentation tool aims to make it easy to create assessment wizards for goal driven activities. It can also be used as a form wizard. While editing, the author can add multiple steps to the wizard. In each step, the author can define which content goes into that step. Content can be plain text, input fields, goal definition and goal assessment. Once published, the end user will be taken through the steps of the wizard. On the last step of the wizard, the user can generate a document with all the input that has been submitted. This document can be downloaded. The Documentation tool is fully responsive and works great on smaller screens as well as on your desktop.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_DragQuestion";
      description: `Drag and drop question enables the learner to associate two or more elements and to make logical connections in a visual way. Create Drag and drop questions using both text and images as draggable alternatives. H5P Drag and drop questions support one-to-one, one-to-many, many-to-one and many-to-many relations between questions and answers.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_DragText";
      description: `Drag the Words allows content designers to create textual expressions with missing pieces of text. The end user drags a missing piece of text to its correct place, to form a complete expression. May be used to check if the user remembers a text she has read, or if she understands something. Helps the user think through a text. It's super easy to create a drag the words task. The editor just writes the text and encloses the words that are to be draggable with asterisk signs like *draggableWord*.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Blanks";
      description: `Learners fill in the missing words in a text. The learner is shown a solution after filling in all the missing words, or after each word depending on settings. Authors enter text and mark words to be replaced with an asterix. In addition to native and second language learning, Fill in the blanks can be used to test the learner's ability to reproduce facts or produce mathematical inferences.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_ImageHotspotQuestion";
      description: `This content type allows end users to press somewhere on an image and get feedback on whether that was correct or incorrect according to the task description. The author uploads an image and defines various hotspots corresponding to details or sections of the image. Hotspots can either be defined as correct or incorrect, and the author provides appropriate feedback text in both cases. The author can also define a feedback if the end user presses somewhere which is neither defined as a correct nor incorrect hotspot.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_GuessTheAnswer";
      description: `This content type allows authors to upload an image and add a suitable description. End users can guess the answer and press the bar below the image to reveal the correct answer.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_IFrameEmbed";
      description: `The Iframe embedder makes it easy to make an H5P of already existing JavaScript applications.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_InteractiveVideo";
      description: `Add interactivity to your video with explanations, extra pictures, tables, Fill in the Blank and multiple choice questions. Quiz questions support adaptivity, meaning that you can jump to another part of the video based on the user's input. Interactive summaries can be added at the end of the video. Interactive videos are created and edited using the H5P authoring tool in a standard web browser.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_MarkTheWords";
      description: `Mark the words allows content designers to create textual expressions with a defined set of correct words. The end user highlights words according to the task description and is given a score. For the editor it is super easy to create a click the words challenge. The editor types in the text and encloses the words that the user is supposed to click, the right answers, in asterix like *correctWord*.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_MemoryGame";
      description: `Create your own memory games and test the memory of your site's users with this simple yet beautiful HTML5 game.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_MultiChoice";
      description: `Multiple Choice questions can be an effective assesment tool. The learner is given immediate performance feedback. The H5P Multiple Choice questions can have a single or multiple correct options per question.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_PersonalityQuiz";
      description: `In this content type, the author defines a series of questions with alternatives, where each alternative is matched against one or more personalities. At the end of the quiz, the end user will see which personality matches the best. There are several ways of making this quiz visually appealing, by eg. representing questions, alternatives, and personalities using images.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Questionnaire";
      description: `Gain feedback and ask open ended questions in Interactive Videos and other content types with Questionnaire. Questionnaire makes the user's answers available via an xAPI integration. This means that website owners may store the answers in many different ways. Answers may be stored in an LRS, the sites own custom storage or a script can fetch the e-mail address and use it to send the user an e-mail. On H5P.org answers are stored in Google Analytics.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_QuestionSet";
      description: `Question Set is your typical quiz content type. It allows the learner to solve a sequence of various question types such as Multichoice, Drag and drop and Fill in the blanks in a Question set. As an author, there are many settings you can use to make it behave just the way you want it to. You may, for instance, customize the Question set with background images and define a pass percentage for the learner. The Question Set also allows you to add videos that are played at the end. One video for success, another if the learner fails the test. This might motivate learners to try again if they fail so that they get to see the success video.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_SingleChoiceSet";
      description: `Single choice set allows content designers to create question sets with one correct answer per question. The end user gets immediate feedback after submitting each answer.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Summary";
      description: `Summaries help the learner remember key information in a text, video or presentation, by actively buliding a summary about the topic at hand. When the learner has completed a summary, a complete list of key statements about the topic is shown.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Timeline";
      description: `This is Timeline.js developed by Knight Lab, packaged as an H5P content type in order to make timelines easily editable, shareable and reuseable. The Timeline content type allows you to place a sequence of events in a chronological order. For each event you may add images and texts. You may also include assets from Twitter, YouTube, Flickr, Vimeo, Google Maps and SoundCloud.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_TrueFalse";
      description: `True/False Question is a simple and straightforward content type that can work by itself or be inserted into other content types such as Course Presentation. A more complex question can be created by adding an image or a video.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_ImageHotspots";
      description: `Image hotspots makes it possible to create an image with interactive hotspots. When the user presses a hotspot, a popup containing a header and text or video is displayed. Using the H5P editor, you may add as many hotspots as you like.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_ImageMultipleHotspotQuestion";
      description: `A free HTML5 based question type allowing creatives to create an image based test where the learner is to find the correct spots on an image. Use this content type with the H5P plugin for WordPress, Moodle or Drupal to challenge your users.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_ImageJuxtaposition";
      description: `A free HTML5-based image content type that allows users to compare two images interactively. Tell your image stories with H5P and Image Juxtaposition on WordPress, Moodle or Drupal.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Audio";
      description: `Upload an audio recording in .mp3, .wav, .ogg or provide the link for an audio recording.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_AudioRecorder";
      description: `An HTML5 audio recorder. Record your voice and play back or download a .wav file of your recording. Use the H5P plugin to create the H5P Audio Recorder to your Drupal, Wordpress or Moodle site.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_SpeakTheWords";
      description: `Speak the Words is only supported in browsers that implements the Web Speech API (Chrome browsers, except on iOS). You need a microphone to answer the question. Ask a question to users and make them answer using their voice. You can choose multiple correct answers. The user will be able to see what his words were interpreted as, and how close it was to the correct answers.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Agamotto";
      description: `Present a sequence of images that people are supposed to look at one after the other, e.g. photos of an item that changes over time, schematics or maps that are organized in different layers or images that reveal more and more details.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_ImageSequencing";
      description: `A free HTML5 based image sequencing content type that allows authors to add a sequence of their own images (and optional image description) to the game in a particular order. The order of the images will be randomized and players will have to reorder them based on the task description.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Flashcards";
      description: `This content type allows authors to create a single flash card or a set of flashcards, where each card has images paired with questions and answers. Learners are required to fill in the text field and then check the correctness of their solution.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_SpeakTheWordsSet";
      description: `Speak the Words Set is only supported in browsers that implement the Web Speech API (Chrome browsers, except on ios). You need a microphone to answer the question. Create a set of questions that learners can answer using their voice. you can choose multiple correct answers. The user will be able to see what his words were interpreted as, and how close it was to the correct answers.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_ImageSlider";
      description: `Present your images in an appealing way with ease. Authors just have to upload images and provide alternative texts for the images. The next two images are always preloaded so switching between images will usually be snappy with no delay for loading the next image. Images may be experienced as part of the page or in full-screen mode. When used as part of the page the system will pick a fixed aspect ratio depending on the images being used. Authors may decide to handle aspect ratios differently.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Essay";
      description: `In this content type, the author defines a set of keywords that represent crucial aspects of a topic. These keywords are matched against a text that students have composed and can be used to immediately provide feedback - either suggesting to revise certain topic details if a keyword is missing or, confirming the student's ideas if the text contains a keyword.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_ImagePair";
      description: `Image pairing is a simple and effective activity that require learners to match pairs of images. Since it is not required for both images in a pair to be the same, authors are also able to test the understanding of a relation between two different images.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_Dictation";
      description: `You can add audio samples containing a sentence for dictation and enter the correct transcription. Your students can listen to the samples and enter what they have heard in to a text field. Their answers will be evaluated automatically. Several options will allow you to control the exercise's difficulty. You can optionally add a second audio sample for a sentence that could hold a version spoken slowly. You can also set a limit for how often a sample can be played, define if punctuation should be relevant for scoring, and decide whether small mistakes like typing errors should be counted as no mistake, a full mistake, or just a half mistake.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_BranchingScenario";
      description: `Branching Scenario allow authors to present the learners with a variety of rich interactive content and choices. The choices the learners make will determine the next content they see. May be used to create dilemmas, serious games, and self-paced learning.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_ThreeImage";
      description: `360 (equirectangular) and normal images may be enriched with interactivities like explanations, videos, sounds, and interactive questions. The images create scenes that also may be linked together to give the user an impression of moving between environments or between different viewpoints within the same environment.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_FindTheWords";
      description: `A free HTML5-based word search activity that allows authors to create a list of words that will be drawn in a grid. The learner's task is to find and select the words in the grid.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_InteractiveBook";
      description: `Create small courses, books, or tests. Interactive Book allows authors to combine large amounts of interactive content like interactive videos, questions, course presentations, and more on multiple pages. There is a summary at the end summing up the scores obtained by the learner throughout the book.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_KewArCode";
      description: `KewAr Code enables content designers to create well-known QR codes. Those QR codes can encode URLs, but also contact information, events, geo-locations, etc. People can scan them with a QR code reader in order to trigger the chosen action.`;
      values: undefined;
    }
  | {
      id: "h5p_label_lib_description_AdventCalendar";
      description: `Build and customize a beautiful advent calendar. You may add a background image to the entire calendar, on each door, and as a background on the content inside each door. You may also add snow- effect and music. Inside each door, you may add a sound, video, text, image, or link. Do note that it is easy for computer-savvy users to reveal the content of all doors right away. If you plan to reveal big secrets on future days you should wait until that day before adding your big secrets to the calendar.`;
      values: undefined;
    }
  | { id: "h5p_label_license_useCommercially"; description: `Use Commercially`; values: undefined }
  | { id: "h5p_label_license_modifiable"; description: `Modifiable`; values: undefined }
  | { id: "h5p_label_license_distributable"; description: `Distributable`; values: undefined }
  | { id: "h5p_label_license_sublicensable"; description: `Sublicensable`; values: undefined }
  | { id: "h5p_label_license_canHoldLiable"; description: `Hold Liable`; values: undefined }
  | { id: "h5p_label_license_mustIncludeCopyright"; description: `Must Include Copyright`; values: undefined }
  | { id: "h5p_label_license_mustIncludeLicense"; description: `Must Include License`; values: undefined }
  | { id: "h5p_label_Slides"; description: `Slides`; values: undefined }
  | { id: "h5p_label_slide_background"; description: `Slide background`; values: undefined }
  | { id: "h5p_label_slide_index"; description: `Slide {slide}`; values: { slide: string | number } }
  | { id: "h5p_label_add_new_slide"; description: `Add New Slide`; values: undefined }
  | { id: "h5p_label_clone_slide"; description: `Clone Slide`; values: undefined }
  | { id: "h5p_label_move_slide_left"; description: `Move Slide Left`; values: undefined }
  | { id: "h5p_label_move_slide_right"; description: `Move Slide Right`; values: undefined }
  | { id: "h5p_label_delete_slide"; description: `Delete Slide`; values: undefined }
  | { id: "h5p_label_bookmarks"; description: `Bookmarks`; values: undefined }
  | { id: "h5p_label_add_bookmark_at"; description: `Add bookmark at {time}`; values: { time: string | number } }
  | { id: "h5p_label_submit_screens"; description: `Submit Screens`; values: undefined }
  | { id: "h5p_label_add_submit_screen_at"; description: `Add submit screen at {time}`; values: { time: string | number } }
  | { id: "h5p_label_submit_screen"; description: `Submit screen`; values: undefined }
  | { id: "h5p_label_playback_rate"; description: `Playback rate`; values: undefined }
  | { id: "h5p_label_colorChose"; description: `Choose`; values: undefined }
  | { id: "h5p_label_label"; description: `Label`; values: undefined }
  | { id: "h5p_label_statements"; description: `Statements`; values: undefined }
  | { id: "h5p_label_presentation_template"; description: `Template`; values: undefined }
  | { id: "h5p_label_presentation_this_slide"; description: `This Slide`; values: undefined }
  | { id: "H5p_label_image_background"; description: `Image background`; values: undefined }
  | { id: "h5p_label_fill_background"; description: `Color fill background`; values: undefined }
  | {
      id: "h5p_label_templete_title";
      description: `Will be applied to this slide only, and will override any 'Template' settings.`;
      values: undefined;
    }
  | {
      id: "h5p_label_thisSlide_title";
      description: `Will be applied to all slides not overridden by any 'This slide' settings.`;
      values: undefined;
    }
  | { id: "h5p_label_coursepresentation_noTitle"; description: `no title`; values: undefined }
  | { id: "h5p_label_link"; description: `Link`; values: undefined }
  | {
      id: "library_error_cannot_delete_lesson_plan";
      description: `This lesson plan cannot be deleted because it has already been used in Schedule.`;
      values: undefined;
    }
  | { id: "library_label_visibility_schools"; description: `Schools`; values: undefined }
  | { id: "report_msg_no_data"; description: `There was no data to display in this week.`; values: undefined }
  | { id: "report_navigation_class_view"; description: `Class View`; values: undefined }
  | {
      id: "report_msg_individual_infor";
      description: `This report offers insight into an individual student’s performance in a lesson in terms of learning outcomes.`;
      values: undefined;
    }
  | {
      id: "report_msg_overall_infor";
      description: `The Learning Outcome Report gives insight into the performance of a class in terms of learning outcomes, and comparisons between students. Click a student name for individual student details.
<ul>
  <li>The report shows results from Live, Class, and Study assessments.
</li>
  <li>Student absences seen in the Live and Class mean that learner wasn’t attended.
</li>
  <li>Student absences seen in the Study mean that the learner didn’t try at all.</li>
</ul>`;
      values: undefined;
    }
  | { id: "report_msg_no_achieve"; description: `No achievement data available for this lesson.`; values: undefined }
  | { id: "report_msg_no_plan"; description: `There are no lesson plans for this teacher. Would you like to add one?`; values: undefined }
  | { id: "report_button_create_plan"; description: `Create a Lesson Plan`; values: undefined }
  | { id: "report_label_0_hour"; description: `0 Hour`; values: undefined }
  | { id: "report_achieved_lo"; description: `Achieved of All Learning Outcomes`; values: undefined }
  | { id: "assess_in_lock_status"; description: `Lock Status`; values: undefined }
  | { id: "assess_last_edited_by"; description: `Last edited by`; values: undefined }
  | { id: "assess_locked_location"; description: `Locked location`; values: undefined }
  | { id: "assess_date_edited"; description: `Date edited`; values: undefined }
  | { id: "assess_time_edited"; description: `Time edited`; values: undefined }
  | { id: "assess_msg_approve_milestone"; description: `Are you sure you want to approve these milestones?`; values: undefined }
  | { id: "schedule_set_learning_outcome"; description: `Set Learning Outcome`; values: undefined }
  | { id: "report_learning_summary_report"; description: `Learner Weekly Report`; values: undefined }
  | {
      id: "report_msg_lsr";
      description: `This report shows an overall summary of student learning activities for the past week. Report data is refreshed weekly.`;
      values: undefined;
    }
  | { id: "report_filter_year"; description: `Year`; values: undefined }
  | { id: "report_filter_week"; description: `Week`; values: undefined }
  | { id: "report_filter_subject"; description: `Subject`; values: undefined }
  | { id: "report_filter_class"; description: `Class`; values: undefined }
  | { id: "report_filter_teacher"; description: `Teacher`; values: undefined }
  | { id: "report_filter_school"; description: `School`; values: undefined }
  | { id: "report_tab_live_classes"; description: `Live Classes`; values: undefined }
  | { id: "report_liveclass_attended"; description: `Attended`; values: undefined }
  | { id: "report_liveclass_absent"; description: `Absent`; values: undefined }
  | { id: "report_tab_assignments"; description: `Assignments`; values: undefined }
  | { id: "report_pie_completed"; description: `Completed`; values: undefined }
  | { id: "report_pie_incomplete"; description: `Incomplete`; values: undefined }
  | { id: "report_learning_outcomes_covered"; description: `Learning Outcomes Covered`; values: undefined }
  | { id: "report_no_learning_outcome"; description: `No learning outcomes are available`; values: undefined }
  | { id: "report_teacher_feedback"; description: `Teacher’s Feedback`; values: undefined }
  | { id: "report_no_feedback"; description: `No feedback is available`; values: undefined }
  | { id: "report_no_data_available"; description: `No Data Available`; values: undefined }
  | { id: "assessment_assignment_assessment"; description: `Assignment Assessment`; values: undefined }
  | { id: "assessment_learning_outcomes_assessment"; description: `Learning Outcomes Assessment`; values: undefined }
  | {
      id: "assessment_learning_outcomes_achievement";
      description: `Learning Outcomes Achievement of {StudentName}`;
      values: { StudentName: string | number };
    }
  | { id: "schedule_lo_number_added"; description: `Added`; values: undefined }
  | { id: "schedule_filter_select_all_classes"; description: `Select All Classes`; values: undefined }
  | { id: "report_filter_student"; description: `Student`; values: undefined }
  | { id: "report_tab_assessments_completed"; description: `Assessments Completed`; values: undefined }
  | { id: "report_no_class"; description: `Please select a class from the list on the left to view the results.`; values: undefined }
  | {
      id: "report_no_assessment";
      description: `Please select an assessment from the list on the left to view the results.`;
      values: undefined;
    }
  | { id: "assessment_not_applicable"; description: `Not Applicable`; values: undefined }
  | { id: "assessment_activity_attempted"; description: `Attempted`; values: undefined }
  | { id: "assessment_partially_achieved"; description: `Partially Achieved`; values: undefined }
  | { id: "report_lsr_view_all"; description: `View All`; values: undefined }
  | { id: "assessment_learning_outcome_assessment"; description: `Learning Outcome Assessment`; values: undefined }
  | { id: "assessment_assigned_to"; description: `Assigned to`; values: undefined }
  | { id: "library_label_add_learning_outcomes"; description: `Add Learning Outcomes`; values: undefined }
  | { id: "schedule_sub_category"; description: `Sub Category`; values: undefined }
  | { id: "schedule_add_learning_outcome"; description: `Add Learning Outcome`; values: undefined }
  | { id: "assessment_in_progress"; description: `In Progress`; values: undefined }
  | { id: "assessment_student_name"; description: `Student Name`; values: undefined }
  | { id: "assessment_lesson_material_assessment"; description: `Lesson Material Assessment`; values: undefined }
  | { id: "report_student_usage_report"; description: `Learner Usage Report`; values: undefined }
  | { id: "report_student_usage_registration"; description: `Registration`; values: undefined }
  | { id: "report_student_usage_materialusage"; description: `Material Usage`; values: undefined }
  | { id: "report_student_usage_classesandassignments"; description: `Classes & Assignments`; values: undefined }
  | { id: "report_student_usage_live"; description: `Live Scheduled (latest 3 months)`; values: undefined }
  | { id: "report_student_usage_class"; description: `Class`; values: undefined }
  | { id: "report_student_usage_total"; description: `Total`; values: undefined }
  | { id: "report_student_usage_unattendedStudents"; description: `Unattended Students`; values: undefined }
  | { id: "report_student_usage_missed_schedules"; description: `List of students missed live schedules`; values: undefined }
  | { id: "report_student_usage_student_name"; description: `Student name`; values: undefined }
  | { id: "report_student_usage_lesson_missed"; description: `Lesson missed`; values: undefined }
  | { id: "report_student_usage_lesson_date"; description: `Lesson date`; values: undefined }
  | { id: "report_student_usage_lesson_time"; description: `Lesson time`; values: undefined }
  | { id: "report_student_usage_results"; description: `Results`; values: undefined }
  | { id: "report_student_usage_live_scheduled"; description: `Live Scheduled`; values: undefined }
  | { id: "report_student_usage_study"; description: `Study Scheduled`; values: undefined }
  | { id: "report_student_usage_home_fun"; description: `Home Fun Scheduled`; values: undefined }
  | { id: "report_filter_content"; description: `Content`; values: undefined }
  | { id: "report_student_usage_h5p_viewed"; description: `No. of H5P viewed`; values: undefined }
  | { id: "report_student_usage_video_viewed"; description: `Video viewed`; values: undefined }
  | { id: "report_student_usage_images_viewed"; description: `Image viewed`; values: undefined }
  | { id: "report_student_usage_document_viewed"; description: `Document viewed`; values: undefined }
  | { id: "report_student_usage_audio_listened"; description: `Audio listened`; values: undefined }
  | { id: "report_student_usage_this_months_class_attendance_rate"; description: `This month‘s class attendance rate`; values: undefined }
  | {
      id: "library_msg_pdf_validation";
      description: `The PDF file you uploaded cannot be displayed properly in live classes. Please upload a different file.`;
      values: undefined;
    }
  | { id: "report_content_total_viewed"; description: `Content total viewed (latest 3 months)`; values: undefined }
  | {
      id: "report_numbers_of_scheduled_classes_in_the_past_3_months";
      description: `Numbers of scheduled classes in the past 3 months`;
      values: undefined;
    }
  | { id: "library_label_category_subcategory"; description: `Category — Subcategory`; values: undefined }
  | { id: "report_label_none"; description: `None`; values: undefined }
  | { id: "report_student_usage_study_title"; description: `Study Scheduled (latest 3 months)`; values: undefined }
  | { id: "report_student_usage_home_fun_title"; description: `Home Fun Scheduled (latest 3 months)`; values: undefined }
  | { id: "report_student_usage_missed_study"; description: `List of students missed study`; values: undefined }
  | { id: "report_student_usage_missed_home_fun"; description: `List of students missed home fun`; values: undefined }
  | { id: "report_student_usage_of"; description: `{value} of {total}`; values: { value: string | number; total: string | number } }
  | { id: "report_label_lessons"; description: `Lessons`; values: undefined }
  | { id: "report_label_assignments"; description: `Assignments`; values: undefined }
  | { id: "report_label_lesson_load"; description: `Next 7 Days Lesson Load`; values: undefined }
  | { id: "report_label_total_lessons"; description: `Total Lessons (Live and In Class) Scheduled`; values: undefined }
  | { id: "report_label_hrs"; description: `hrs`; values: undefined }
  | { id: "report_label_past_7_days"; description: `Last 7 days`; values: undefined }
  | { id: "report_label_past_30_days"; description: `Past 30 Days`; values: undefined }
  | { id: "report_label_classes_number"; description: `No. of Classes`; values: undefined }
  | { id: "report_label_students_number"; description: `No. of Students`; values: undefined }
  | { id: "report_label_current"; description: `Current`; values: undefined }
  | { id: "report_label_live_lessons_completed"; description: `Live Lessons Completed`; values: undefined }
  | { id: "report_label_in_class_lessons_completed"; description: `In Class Lessons Completed`; values: undefined }
  | { id: "report_label_live_lessons_missed"; description: `Live Lessons Missed`; values: undefined }
  | { id: "report_label_in_class_lessons_Missed"; description: `In Class Lessons Missed`; values: undefined }
  | { id: "report_label_total_scheduled"; description: `Total Scheduled`; values: undefined }
  | { id: "report_label_missed_lessons"; description: `Missed Lessons`; values: undefined }
  | { id: "report_label_lesson_type"; description: `Lesson Type`; values: undefined }
  | { id: "report_label_lesson_name"; description: `Lesson Name`; values: undefined }
  | { id: "report_label_class_name"; description: `Class Name`; values: undefined }
  | { id: "report_label_start_date_time"; description: `Start Date & Time`; values: undefined }
  | { id: "report_label_end_date_time"; description: `End Date & Time`; values: undefined }
  | { id: "report_label_class_type"; description: `Class Type`; values: undefined }
  | { id: "report_label_study"; description: `Study`; values: undefined }
  | { id: "report_label_home_fun"; description: `Home Fun`; values: undefined }
  | { id: "report_label_assignments_scheduled"; description: `Assignments Scheduled`; values: undefined }
  | { id: "report_label_assessments_completed"; description: `Assessments Completed`; values: undefined }
  | { id: "report_label_feedback"; description: `% Feedback`; values: undefined }
  | { id: "report_label_assessments_pending"; description: `Assessments Pending`; values: undefined }
  | { id: "report_label_avg_days_pending"; description: `Avg Days Pending`; values: undefined }
  | {
      id: "report_msg_learning_outcomes_covered";
      description: `Observable competency that can be demonstrated by the student by the end of the lesson.`;
      values: undefined;
    }
  | { id: "report_label_teaching_hours"; description: `Teaching Hours in Next 7 Days`; values: undefined }
  | {
      id: "report_msg_students_number";
      description: `Number of students currently assigned to the teacher. Values are based on filter selection.`;
      values: undefined;
    }
  | {
      id: "report_msg_classes_number";
      description: `Number of classes currently assigned to the teacher. Values are based on filter selection.`;
      values: undefined;
    }
  | {
      id: "report_msg_assignments_scheduled";
      description: `Number of assignments the teacher has newly planned and assigned during the time range. Values are based on filter selection.`;
      values: undefined;
    }
  | {
      id: "report_msg_assessments_completed";
      description: `Number of assessments completed by the teacher for each student submission. Values are based on filter selection.`;
      values: undefined;
    }
  | {
      id: "report_msg_feedback";
      description: `% of individual student assessments that are completed of which the teacher has provided feedback for. Values are based on filter selection.`;
      values: undefined;
    }
  | {
      id: "report_msg_assessments_pending";
      description: `Number of assessments pending for the teacher to complete for every student submission. Pending status means the due date has passed but assessment has not been completed yet. Values are based on filter selection.`;
      values: undefined;
    }
  | {
      id: "report_msg_avg_days_pending";
      description: `Average number of days the assessments have been in pending status. Pending status means the due date has passed but assessment has not been completed yet. Values are based on filter selection.`;
      values: undefined;
    }
  | { id: "schedule_search_school_name"; description: `Search School Name`; values: undefined }
  | {
      id: "report_msg_lo_default";
      description: `{Name} is continuing to learn on KidsLoop. This week, {Name} achieved {AchievedLoCount} learning outcomes out of {LearntLoCount}.`;
      values: { Name: string | number; AchievedLoCount: string | number; LearntLoCount: string | number };
    }
  | {
      id: "report_msg_lo_new";
      description: `{Name} started learning on KidsLoop this week. So far, {Name} achieved {AchievedLoCount} learning outcomes out of {LearntLoCount}.`;
      values: { Name: string | number; AchievedLoCount: string | number; LearntLoCount: string | number };
    }
  | {
      id: "report_msg_lo_increase_previous_w";
      description: `{Name} has achieved {LOCompareLastWeek}% more learning outcomes compared to the previous week.`;
      values: { Name: string | number; LOCompareLastWeek: string | number };
    }
  | {
      id: "report_msg_lo_decrease_previous_w";
      description: `{Name} has achieved {LOCompareLastWeek}% less learning outcomes compared to the previous week.`;
      values: { Name: string | number; LOCompareLastWeek: string | number };
    }
  | {
      id: "report_msg_lo_increase_previous_large_w";
      description: `{Name} has achieved {LOCompareLastWeek}% more learning outcomes compared to the previous week. Give {Name} a big high-five for a job well done!`;
      values: { Name: string | number; LOCompareLastWeek: string | number };
    }
  | {
      id: "report_msg_lo_decrease_previous_large_w";
      description: `{Name} has achieved {LOCompareLastWeek}% less learning outcomes compared to the previous week. It might be time to check in with {Name}.`;
      values: { Name: string | number; LOCompareLastWeek: string | number };
    }
  | {
      id: "report_msg_lo_increase_3w";
      description: `{Name} achieved more learning outcomes in the last 3 consecutive weeks. In total, {Name} achieved {LOCompareLast3Week}% more learning outcomes as compared to 3 weeks ago.`;
      values: { Name: string | number; LOCompareLast3Week: string | number };
    }
  | {
      id: "report_msg_lo_decrease_3w";
      description: `{Name} achieved fewer learning outcomes in the last 3 consecutive weeks. In total, {Name} achieved {LOCompareLast3Week}% less learning outcomes as compared to 3 weeks ago.`;
      values: { Name: string | number; LOCompareLast3Week: string | number };
    }
  | {
      id: "report_msg_lo_high_class_w";
      description: `This week, {Name} has achieved {LOCompareClass}% more learning outcomes than the class average.`;
      values: { Name: string | number; LOCompareClass: string | number };
    }
  | {
      id: "report_msg_lo_low_class_w";
      description: `This week, {Name} has achieved {LOCompareClass}% less learning outcomes than the class average.`;
      values: { Name: string | number; LOCompareClass: string | number };
    }
  | {
      id: "report_msg_lo_high_class_3w";
      description: `During these past 3 consecutive weeks, {Name} has achieved {LOCompareClass3week}% more learning outcomes than the class average.`;
      values: { Name: string | number; LOCompareClass3week: string | number };
    }
  | {
      id: "report_msg_lo_low_class_3w";
      description: `During these past 3 consecutive weeks, {Name} has achieved {LOCompareClass3week}% less learning outcomes than the class average.`;
      values: { Name: string | number; LOCompareClass3week: string | number };
    }
  | {
      id: "report_msg_lo_high_class_review_w";
      description: `This week, {Name} has achieved {LOReviewCompareClass}% more reviewed learning outcomes than the class average.`;
      values: { Name: string | number; LOReviewCompareClass: string | number };
    }
  | {
      id: "report_msg_lo_low_class_review_w";
      description: `This week, {Name} has achieved {LOReviewCompareClass}% less reviewed learning outcomes than the class average.`;
      values: { Name: string | number; LOReviewCompareClass: string | number };
    }
  | {
      id: "report_msg_att_default";
      description: `{Name} is continuing to learn on KidsLoop. This week, {Name} attended {AttendedCount} classes among {ScheduledCount} scheduled classes.`;
      values: { Name: string | number; AttendedCount: string | number; ScheduledCount: string | number };
    }
  | {
      id: "report_msg_att_new";
      description: `{Name} started learning on KidsLoop. So far, {Name} attended {AttendedCount} classes among {ScheduledCount} scheduled classes.`;
      values: { Name: string | number; AttendedCount: string | number; ScheduledCount: string | number };
    }
  | {
      id: "report_msg_att_increase_previous_w";
      description: `{Name} has attended {AttendCompareLastWeek}% more classes as compared to the previous week.`;
      values: { Name: string | number; AttendCompareLastWeek: string | number };
    }
  | {
      id: "report_msg_att_decrease_previous_w";
      description: `{Name} has attended {AttendCompareLastWeek}% less classes as compared to the previous week.`;
      values: { Name: string | number; AttendCompareLastWeek: string | number };
    }
  | {
      id: "report_msg_att_increase_previous_large_w";
      description: `{Name} has attended {AttendCompareLastWeek}% more classes as compared to the previous week. Tell {Name}, "Awesome job!"`;
      values: { Name: string | number; AttendCompareLastWeek: string | number };
    }
  | {
      id: "report_msg_att_decrease_previous_large_w";
      description: `{Name} has attended {AttendCompareLastWeek}% less classes as compared to the previous week. Please check if {Name} has any problems with the learning environment.`;
      values: { Name: string | number; AttendCompareLastWeek: string | number };
    }
  | {
      id: "report_msg_att_increase_3w";
      description: `During these past 3 consecutive weeks, {Name} has attended {AttendCompareLast3Week}% more classes.`;
      values: { Name: string | number; AttendCompareLast3Week: string | number };
    }
  | {
      id: "report_msg_att_decrease_3w";
      description: `During these past 3 consecutive weeks, {Name} has attended {AttendCompareLast3Week}% less classes.`;
      values: { Name: string | number; AttendCompareLast3Week: string | number };
    }
  | {
      id: "report_msg_att_high_class_w";
      description: `This week, {Name} has attended {LOCompareClass}% more classes than the class average.`;
      values: { Name: string | number; LOCompareClass: string | number };
    }
  | {
      id: "report_msg_att_low_class_w";
      description: `This week, {Name} has attended {LOCompareClass}% less classes than the class average.`;
      values: { Name: string | number; LOCompareClass: string | number };
    }
  | {
      id: "report_msg_att_high_class_3w";
      description: `During these past 3 consecutive weeks, {Name} has attended {LOCompareClass3week}% more classes than the class average.`;
      values: { Name: string | number; LOCompareClass3week: string | number };
    }
  | {
      id: "report_msg_att_low_class_3w";
      description: `During these past 3 consecutive weeks, {Name} has attended {LOCompareClass3week}% less classes than the class average.`;
      values: { Name: string | number; LOCompareClass3week: string | number };
    }
  | {
      id: "report_msg_assign_default";
      description: `{Name} is continuing to learn on KidsLoop. This week, {Name} completed {AssignCompleteCount} assignments among {AssignmentCount} given assignments.`;
      values: { Name: string | number; AssignCompleteCount: string | number; AssignmentCount: string | number };
    }
  | {
      id: "report_msg_assign_new";
      description: `{Name} started learning on KidsLoop. So far, {Name} completed {AssignmentCompleteCount} assignments among {AssignmentCount} given assignments.`;
      values: { Name: string | number; AssignmentCompleteCount: string | number; AssignmentCount: string | number };
    }
  | {
      id: "report_msg_assign_increase_previous_w";
      description: `{Name} has completed {AssignCompareLastWeek}% more assignments as compared to the previous week.`;
      values: { Name: string | number; AssignCompareLastWeek: string | number };
    }
  | {
      id: "report_msg_assign_decrease_previous_w";
      description: `{Name} has completed {AssignCompareLastWeek}% less assignments as compared to the previous week.`;
      values: { Name: string | number; AssignCompareLastWeek: string | number };
    }
  | {
      id: "report_msg_assign_increase_previous_large_w";
      description: `{Name} has completed {AssignCompareLastWeek}% more assignments as compared to the previous week. Give {Name} a big compliment!`;
      values: { Name: string | number; AssignCompareLastWeek: string | number };
    }
  | {
      id: "report_msg_assign_decrease_previous_large_w";
      description: `{Name} has completed {AssignCompareLastWeek}% less assignments as compared to the previous week. Please check if {Name} needs more support.`;
      values: { Name: string | number; AssignCompareLastWeek: string | number };
    }
  | {
      id: "report_msg_assign_increase_3w";
      description: `During these past 3 consecutive weeks, {Name} has completed {AssignCompare3Week}% more assignments.`;
      values: { Name: string | number; AssignCompare3Week: string | number };
    }
  | {
      id: "report_msg_assign_decrease_3w";
      description: `During these past 3 consecutive weeks, {Name} has completed {AssignCompare3Week}% less assignments.`;
      values: { Name: string | number; AssignCompare3Week: string | number };
    }
  | {
      id: "report_msg_assign_high_class_w";
      description: `This week, {Name} has completed {AssignCompareClass}% more assignments than the class average.`;
      values: { Name: string | number; AssignCompareClass: string | number };
    }
  | {
      id: "report_msg_assign_low_class_w";
      description: `This week, {Name} has completed {AssignCompareClass}% less assignments than the class average.`;
      values: { Name: string | number; AssignCompareClass: string | number };
    }
  | {
      id: "report_msg_assign_high_class_3w";
      description: `During these past 3 consecutive weeks, {Name} has completed {AssignCompareClass3week}% more assignments than the class average.`;
      values: { Name: string | number; AssignCompareClass3week: string | number };
    }
  | {
      id: "report_msg_assign_low_class_3w";
      description: `During these past 3 consecutive weeks, {Name} has completed {AssignCompareClass3week}% less assignments than the class average.`;
      values: { Name: string | number; AssignCompareClass3week: string | number };
    }
  | { id: "schedule_msg_one_assignment"; description: `Please upload at least one assignment.`; values: undefined }
  | { id: "report_label_learning_outcomes_achievement"; description: `Learning Outcomes Achievement`; values: undefined }
  | { id: "report_label_class_attendance"; description: `Class Attendance`; values: undefined }
  | { id: "report_label_assignment_completion"; description: `Assignment Completion`; values: undefined }
  | { id: "report_label_4_weeks"; description: `Past 4 Weeks`; values: undefined }
  | { id: "report_label_6_months"; description: `Past 6 Months`; values: undefined }
  | { id: "report_label_learning_outcomes_achieved"; description: `Learning Outcomes Achieved %`; values: undefined }
  | { id: "report_label_newly_achieved_lo"; description: `Newly Achieved Learning Outcomes %`; values: undefined }
  | { id: "report_label_reachieved_lo"; description: `Re-achieved Learning Outcomes %`; values: undefined }
  | { id: "report_label_achieved_lo_class_average"; description: `Achieved Learning Outcomes % for class average`; values: undefined }
  | { id: "report_label_achieved_lo_Subject_Average"; description: `Achieved Learning Outcomes % for subject average`; values: undefined }
  | { id: "report_label_total_newly_achieved_lo"; description: `Total Newly Achieved Learning Outcomes`; values: undefined }
  | { id: "report_label_total_reachieved_lo"; description: `Total Re-achieved Learning Outcomes`; values: undefined }
  | {
      id: "report_label_total_achieved_lo_class_average";
      description: `Total Achieved Learning Outcomes for Class Average`;
      values: undefined;
    }
  | {
      id: "report_label_total_achieved_lo_subject_average";
      description: `Total Achieved Learning Outcomes for Subject Average`;
      values: undefined;
    }
  | { id: "report_label_class_attendance_rate"; description: `Class Attendance Rate (Live only)`; values: undefined }
  | { id: "report_label_student_attendance_rate"; description: `Student Average Attendance Rate for Subjects`; values: undefined }
  | { id: "report_label_class_average_attendance_rate"; description: `Class Average Attendance Rate`; values: undefined }
  | { id: "report_label_subject_average_attendance_rate"; description: `Subject Average Attendance Rate`; values: undefined }
  | { id: "report_label_assignments_completion_rate"; description: `Assignments Completion Rate`; values: undefined }
  | {
      id: "report_label_student_assignments_completion_rate";
      description: `Student Average Assignments Completion Rate for Subjects`;
      values: undefined;
    }
  | {
      id: "report_label_class_average_assignments_completion_rate";
      description: `Class Average Assignments Completion Rate`;
      values: undefined;
    }
  | {
      id: "report_label_subject_average_assignments_completion_rate";
      description: `Subject Average Assignments Completion Rate`;
      values: undefined;
    }
  | { id: "report_label_student_progress_report"; description: `Learner Monthly Report`; values: undefined }
  | { id: "report_label_overall_attendance"; description: `Overall Attendance`; values: undefined }
  | { id: "report_label_overall_completion"; description: `Overall Completion`; values: undefined }
  | { id: "report_msg_participants_not_included"; description: `Participants are not included`; values: undefined }
  | { id: "report_student_usage_incomplete_students"; description: `Incomplete by Students`; values: undefined }
  | { id: "general_error_fail_get_permission"; description: `Failed to get permission, please refresh`; values: undefined }
  | { id: "library_error_pdf_validation"; description: `PDF validation failed, please try again.`; values: undefined }
  | { id: "schedule_search_class_name"; description: `Search Class Name`; values: undefined }
  | { id: "schedule_conflict_popup"; description: `Schedule Conflict`; values: undefined }
  | { id: "schedule_further_action"; description: `Please select a further action`; values: undefined }
  | {
      id: "schedule_msg_assignment_sumbit";
      description: `Your assignment will be submitted for assessment. Do you want to continue?`;
      values: undefined;
    }
  | { id: "report_label_skill_coverage"; description: `Skill Coverage`; values: undefined }
  | {
      id: "report_label_skill_coverage_info";
      description: `A breakdown of the learning outcomes covered by skill category as defined by your organization.`;
      values: undefined;
    }
  | { id: "report_label_learner_usage"; description: `Learner Usage`; values: undefined }
  | {
      id: "report_label_learner_usage_info";
      description: `Understand the level of usage of the learners over the last 7 days: 
<ul>
  <li>Material consumption metrics
</li>
  <li>Class attendance
</li>
  <li>Assignments details
</li>
</ul>`;
      values: undefined;
    }
  | { id: "report_label_content_used"; description: `Content Used`; values: undefined }
  | { id: "report_label_5_types"; description: `5 types`; values: undefined }
  | { id: "report_label_class_scheduled"; description: `Class Scheduled`; values: undefined }
  | { id: "report_label_live_class"; description: `Live Class`; values: undefined }
  | { id: "report_label_assignment_scheduled"; description: `Assignment Scheduled`; values: undefined }
  | { id: "report_label_study_and_home_fun"; description: `Study & Home Fun`; values: undefined }
  | { id: "schedule_msg_no_matching_result"; description: `No matching result`; values: undefined }
  | { id: "report_label_no_report"; description: `No report available`; values: undefined }
  | { id: "schedule_lesson_plan_search"; description: `Lesson Plan Search`; values: undefined }
  | { id: "schedule_lesson_plan_popup_group"; description: `Group`; values: undefined }
  | { id: "schedule_lesson_plan_popup_library"; description: `Library`; values: undefined }
  | { id: "schedule_lesson_plan_popup_reset"; description: `Reset`; values: undefined }
  | { id: "schedule_lesson_plan_popup_results"; description: `Results`; values: undefined }
  | { id: "schedule_popup_search_for_lesson_plan"; description: `Search for lesson plan`; values: undefined }
  | { id: "schedule_popup_no_data_available"; description: `No data available`; values: undefined }
  | { id: "schedule_popup_no_matching_result"; description: `No matching result`; values: undefined }
  | { id: "library_label_organization"; description: `Organization`; values: undefined }
  | { id: "library_label_org_owner_email"; description: `Org Owner Email`; values: undefined }
  | { id: "report_label_learning_outcome"; description: `Learning Outcome`; values: undefined }
  | { id: "report_label_learning_outcome_report"; description: `Learning Outcome Report`; values: undefined }
  | {
      id: "report_label_learning_outcome_info";
      description: `Based on the learning outcomes covered in the last 7 days:
<ul>
  <li>Highly Achieved: learners that have achieved more than 80% of the learning outcomes
</li>
  <li>Low Achieved: learners that have achieved less than 50% of the learning outcomes
</li>
</ul>`;
      values: undefined;
    }
  | { id: "report_label_covered"; description: `Covered`; values: undefined }
  | { id: "report_label_above"; description: `Above`; values: undefined }
  | { id: "report_label_meets"; description: `Meets`; values: undefined }
  | { id: "report_label_below"; description: `Below`; values: undefined }
  | { id: "schedule_study_due_on"; description: `Due on`; values: undefined }
  | { id: "library_label_organization_id"; description: `Organization ID`; values: undefined }
  | {
      id: "report_label_learner_weekly_report_info";
      description: `"Attendance and assignment completion rates are calculated among the learners who have generated Study data in the last 7 days:
-Above Expectations: learners that have achieved more than 80%, on average, of the attendance and assignment completion.
-Below Expectations: learners that have achieved less than 50%, on average, of the attendance and assignment completion."`;
      values: undefined;
    }
  | {
      id: "report_label_learner_monthly_report_info";
      description: `"Attendance and assignment completion rates are calculated among the learners who have generated Study data in the last 4 weeks:
-Above Expectations: learners that have achieved more than 80% of the learning outcomes
-Below Expectations: learners that have achieved less than 50% of the learning outcomes"`;
      values: undefined;
    }
  | { id: "app2web_badanamu_activities"; description: `Badanamu Activities`; values: undefined }
  | { id: "app2web_please_enter_the_link"; description: `Please enter the link`; values: undefined }
  | { id: "app2web_badanamu_activities_link"; description: `Badanamu Activities Link`; values: undefined }
  | { id: "schedule_label_class_type_review"; description: `Auto Review`; values: undefined }
  | {
      id: "schedule_due_date_info";
      description: `Due Date can only be set after +1 days from today to allow time for students to complete.`;
      values: undefined;
    }
  | { id: "schedule_review_date_range_info"; description: `I would like content to be reviewed that was covered:`; values: undefined }
  | { id: "schedule_review_start_date"; description: `Start Date`; values: undefined }
  | { id: "schedule_review_end_date"; description: `End Date`; values: undefined }
  | { id: "schedule_review_dafault_date_range"; description: `Past 2 Weeks`; values: undefined }
  | { id: "schedule_review_review_area"; description: `Review Area`; values: undefined }
  | {
      id: "schedule_review_pop_up_all_success";
      description: `Publishing your auto review

A new ‘Auto review’ lesson will appear on students’ calendar once our platform has finished an analysis for each student.`;
      values: undefined;
    }
  | {
      id: "schedule_review_popup_partial_success";
      description: `Please note that we do not have enough data for the following students during the time range selected – they will each be given a random lesson. To avoid this in future, please ensure that students have worked on at least 10 activities before setting an Auto review.`;
      values: undefined;
    }
  | { id: "learning_outcome_label_threshold"; description: `Score Threshold`; values: undefined }
  | { id: "assessment_summary_label_attendance_unknown"; description: `Unknown`; values: undefined }
  | { id: "learning_outcome_threshold_blank_alert"; description: `A score threshold must be entered`; values: undefined }
  | { id: "learning_outcome_threshold_error_toast"; description: `Please input an integer from 1 to 100`; values: undefined }
  | {
      id: "schedule_review_group_fail_no_data";
      description: `There was not enough content covered for this group of students during the date range specified to create an auto review session. Please try again with a different date range or student group.`;
      values: undefined;
    }
  | { id: "schedule_review_popup_date_range"; description: `Date Range`; values: undefined }
  | { id: "schedule_review_popup_student_list"; description: `Students with Personalized Lesson Plans`; values: undefined }
  | {
      id: "schedule_review_popup_random_student_list";
      description: `Students who receive a random Lesson Plan due to no enough content to review`;
      values: undefined;
    }
  | {
      id: "schedule_review_popup_fail_notice";
      description: `There was a problem generating an auto review session on {value}. Please try again.`;
      values: { value: string | number };
    }
  | {
      id: "schedule_review_popup_pending_notice";
      description: `We are still analyzing data to generate the ‘auto review’ lesson plan for each student. Students will be able to see the new ‘auto review’ session on the calendar once this process is complete.`;
      values: undefined;
    }
  | { id: "schedule_review_popup_confirm"; description: `Confirm`; values: undefined }
  | { id: "schedule_review_class_name"; description: `Auto Review: {value} Materials`; values: { value: string | number } }
  | { id: "schedule_repeat_end_on"; description: `On`; values: undefined }
  | { id: "assessment_list_study_review"; description: `Study / Auto Review`; values: undefined }
  | { id: "assessment_review_summary"; description: `Auto Review Summary`; values: undefined }
  | { id: "assessment_review_title"; description: `Auto Review Title`; values: undefined }
  | { id: "assessment_review_detail_student_name"; description: `Student Name`; values: undefined }
  | {
      id: "report_label_teacher_usage_info";
      description: `View teachers that have not missed the scheduled sessions in the last 7 days, including the number of missed sessions and lesson details.`;
      values: undefined;
    }
  | { id: "report_label_completed_all_lessons"; description: `Completed All Lessons`; values: undefined }
  | { id: "report_label_missed_some_lessons"; description: `Missed Some Lessons`; values: undefined }
  | { id: "report_label_missed_all_lessons"; description: `Missed All Lessons`; values: undefined }
  | { id: "report_label_completed_all"; description: `Completed All`; values: undefined }
  | { id: "report_label_missed_some"; description: `Missed Some`; values: undefined }
  | { id: "report_label_missed_frequently"; description: `Missed Frequently`; values: undefined }
  | {
      id: "assessment_audio_suggest_browser";
      description: `Please use another browser (Chrome) for a better experience.`;
      values: undefined;
    }
  | { id: "assessment_audio_no_data"; description: `Audio data is not successfully stored by student.`; values: undefined }
  | { id: "assessment_hfs_submitted"; description: `Submitted`; values: undefined }
  | { id: "assessment_hfs_all"; description: `All`; values: undefined }
  | { id: "assessment_hfs_not_submitted"; description: `Not Submitted`; values: undefined }
  | { id: "assessment_hfs_score_edit"; description: `Click to Edit`; values: undefined }
  | { id: "assessment_hfs_writing_feedback"; description: `Writing Feedback`; values: undefined }
  | { id: "assessment_hfs_drawing_feedback"; description: `Drawing Feedback`; values: undefined }
  | { id: "assessment_hfs_comment_rating"; description: `Comments & Ratings`; values: undefined }
  | { id: "assessment_hfs_select_file"; description: `Select a file to provide feedback`; values: undefined }
  | { id: "assessmeng_hfs_select_image"; description: `Select Image`; values: undefined }
  | { id: "schedule_msg_file_not_ready_to_download"; description: `This file is not ready. Please try again later.`; values: undefined }
  | { id: "assessment_hfs_drawing_feedback_exit"; description: `Exit`; values: undefined }
  | { id: "assessment_hfs_drawing_feedback_done"; description: `Done`; values: undefined }
  | { id: "assessment_hfs_view_writing_feedback"; description: `View Writing Feedback`; values: undefined }
  | { id: "assessment_hfs_view_drawing_feedback"; description: `View Drawing Feedback`; values: undefined }
  | { id: "assessment_hfs_no_teacher_feedback"; description: `No feedback has been provided to this file.`; values: undefined }
  | { id: "assessment_hfs_student_assessment"; description: `Assessment`; values: undefined }
  | { id: "assessment_hfs_student_feedback"; description: `Feedback`; values: undefined }
  | { id: "assessment_detail_screenshot_results"; description: `Results`; values: undefined }
  | { id: "assessment_detail_screenshot_result_screen"; description: `Results Screen`; values: undefined }
  | { id: "assessment_detail_total_score"; description: `Total Score`; values: undefined };

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
