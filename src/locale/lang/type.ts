import { IntlFormatters, MessageDescriptor } from "react-intl";

type FormatMessageValue<T> = NonNullable<Parameters<IntlFormatters<T>["formatMessage"]>[1]> extends Record<any, infer V> ? V : never;
export type LangName = "en" | "ko" | "zh" | "vi";

type LangRecord<T = string> =
  | { id: "library_label_archive"; description: "Archive"; values: undefined }
  | { id: "library_label_asssets_name"; description: "Assets Name"; values: undefined }
  | { id: "library_label_content_type"; description: "Content type"; values: undefined }
  | { id: "library_label_upload_files"; description: "Upload Files"; values: undefined }
  | { id: "assess_label_display_by"; description: "Display By"; values: undefined }
  | { id: "library_label_program1"; description: "Badanamu ESL"; values: undefined }
  | { id: "library_label_program2"; description: "Bada Math"; values: undefined }
  | { id: "library_label_program3"; description: "Bada STEM"; values: undefined }
  | { id: "library_label_program4"; description: "ESL"; values: undefined }
  | { id: "library_label_program5"; description: "Math"; values: undefined }
  | { id: "library_label_program6"; description: "Science"; values: undefined }
  | { id: "library_label_program7"; description: "Bada Rhyme"; values: undefined }
  | { id: "library_label_subject1"; description: "Language/Literacy"; values: undefined }
  | { id: "library_label_subject2"; description: "Math"; values: undefined }
  | { id: "library_label_developmental1"; description: "Speech & Language Skills"; values: undefined }
  | { id: "library_label_developmental2"; description: "Fine Motor Skills"; values: undefined }
  | { id: "library_label_developmental3"; description: "Gross Motor Skills"; values: undefined }
  | { id: "library_label_developmental4"; description: "Cognitive Skills"; values: undefined }
  | { id: "library_label_developmental5"; description: "Personal Development"; values: undefined }
  | { id: "library_label_developmental6"; description: "Langulibrary_label_age and Numeracy Skills"; values: undefined }
  | { id: "library_label_developmental7"; description: "Cognitive"; values: undefined }
  | { id: "library_label_developmental8"; description: "Social and Emotional"; values: undefined }
  | { id: "library_label_developmental9"; description: "Oral"; values: undefined }
  | { id: "library_label_developmental10"; description: "Literacy"; values: undefined }
  | { id: "library_label_developmental11"; description: "Whole-Child"; values: undefined }
  | { id: "library_label_developmental12"; description: "Knowledge"; values: undefined }
  | { id: "library_label_skills1"; description: "Speaking & Listening"; values: undefined }
  | { id: "library_label_skills2"; description: "Phonics"; values: undefined }
  | { id: "library_label_skills3"; description: "Vocabulary"; values: undefined }
  | { id: "library_label_skills4"; description: "Thematic Concepts"; values: undefined }
  | { id: "library_label_skills5"; description: "Reading Skills and Comprehension"; values: undefined }
  | { id: "library_label_skills6"; description: "Sight Words"; values: undefined }
  | { id: "library_label_skills7"; description: "Sensory"; values: undefined }
  | { id: "library_label_skills8"; description: "Hand-Eye Coordination"; values: undefined }
  | { id: "library_label_skills9"; description: "Simple Movements"; values: undefined }
  | { id: "library_label_skills10"; description: "Complex Movements"; values: undefined }
  | { id: "library_label_skills11"; description: "Physical Skills"; values: undefined }
  | { id: "library_label_skills12"; description: "Logic & Memory"; values: undefined }
  | { id: "library_label_skills13"; description: "Visual"; values: undefined }
  | { id: "library_label_skills14"; description: "Social Skills"; values: undefined }
  | { id: "library_label_skills15"; description: "Emotional Skills"; values: undefined }
  | { id: "library_label_skills16"; description: "Reasoning"; values: undefined }
  | { id: "library_label_skills17"; description: "Listening"; values: undefined }
  | { id: "library_label_skills18"; description: "Speaking"; values: undefined }
  | { id: "library_label_skills19"; description: "Interpreting"; values: undefined }
  | { id: "library_label_skills20"; description: "Numbers"; values: undefined }
  | { id: "library_label_skills21"; description: "Fluency"; values: undefined }
  | { id: "library_label_skills22"; description: "Academic Skill (Drawing, Tracing, Coloring, Writing)"; values: undefined }
  | { id: "library_label_skills23"; description: "Play Skill (Drag and Drop, Screen Click)"; values: undefined }
  | { id: "library_label_skills24"; description: "Body Coordination"; values: undefined }
  | { id: "library_label_skills25"; description: "Spatial Representation"; values: undefined }
  | { id: "library_label_skills26"; description: "Counting and Operations"; values: undefined }
  | { id: "library_label_skills27"; description: "Logical Problem-Solving"; values: undefined }
  | { id: "library_label_skills28"; description: "Patterns"; values: undefined }
  | { id: "library_label_skills29"; description: "Social Interactions"; values: undefined }
  | { id: "library_label_skills30"; description: "Empathy"; values: undefined }
  | { id: "library_label_skills31"; description: "Self-Identity"; values: undefined }
  | { id: "library_label_skills32"; description: "Self-Control"; values: undefined }
  | { id: "library_label_skills33"; description: "Writing"; values: undefined }
  | {
      id: "library_label_skills34";
      description: "Science Process (Observing, Classifying, Communicating, Measuring, Predicting)";
      values: undefined;
    }
  | {
      id: "library_label_skills35";
      description: "Critical Thinking (Interpretation, Analysis, Evaluation, Inference, Explanation, and Self-Regulation)";
      values: undefined;
    }
  | { id: "library_label_skills36"; description: "Reasoning Skills"; values: undefined }
  | { id: "library_label_skills37"; description: "Colors"; values: undefined }
  | { id: "library_label_skills38"; description: "Shapes"; values: undefined }
  | { id: "library_label_skills39"; description: "Letters"; values: undefined }
  | { id: "library_label_skills40"; description: "Science"; values: undefined }
  | { id: "library_label_skills41"; description: "Math"; values: undefined }
  | { id: "library_label_skills42"; description: "Coding"; values: undefined }
  | { id: "library_label_skills43"; description: "Experimenting & Problem Solving"; values: undefined }
  | { id: "library_label_skills44"; description: "Phonological Awareness"; values: undefined }
  | { id: "library_label_skills45"; description: "Langulibrary_label_age Support"; values: undefined }
  | { id: "library_label_skills46"; description: "Communication"; values: undefined }
  | { id: "library_label_skills47"; description: "Emergent Reading"; values: undefined }
  | { id: "library_label_skills48"; description: "Emergent Writing"; values: undefined }
  | { id: "library_label_skills49"; description: "Social-Emotional Learning"; values: undefined }
  | { id: "library_label_skills50"; description: "Cognitive Development"; values: undefined }
  | { id: "library_label_skills51"; description: "Physical Coordination"; values: undefined }
  | { id: "library_label_skills52"; description: "Technology"; values: undefined }
  | { id: "library_label_skills53"; description: "Engineering"; values: undefined }
  | { id: "library_label_skills54"; description: "Miscellaneous"; values: undefined }
  | { id: "library_label_grade1"; description: "Not Specific"; values: undefined }
  | { id: "library_label_grade2"; description: "PreK-1"; values: undefined }
  | { id: "library_label_grade3"; description: "PreK-2"; values: undefined }
  | { id: "library_label_grade4"; description: "K"; values: undefined }
  | { id: "library_label_grade5"; description: "Grade 1"; values: undefined }
  | { id: "library_label_grade6"; description: "Grade 2"; values: undefined }
  | { id: "library_label_grade7"; description: "PreK-3"; values: undefined }
  | { id: "library_label_grade8"; description: "PreK-4"; values: undefined }
  | { id: "library_label_grade9"; description: "PreK-5"; values: undefined }
  | { id: "library_label_grade10"; description: "PreK-6"; values: undefined }
  | { id: "library_label_grade11"; description: "PreK-7"; values: undefined }
  | { id: "library_label_grade12"; description: "Kindergarten"; values: undefined }
  | { id: "library_label_library_label_age1"; description: "3-4"; values: undefined }
  | { id: "library_label_library_label_age2"; description: "4-5"; values: undefined }
  | { id: "library_label_library_label_age3"; description: "5-6"; values: undefined }
  | { id: "library_label_library_label_age4"; description: "6-7"; values: undefined }
  | { id: "library_label_library_label_age5"; description: "7-8"; values: undefined }
  | { id: "library_label_visibility settings1"; description: "School"; values: undefined }
  | { id: "library_label_visibility settings2"; description: "Orgnization"; values: undefined }
  | { id: "schedule_label_Class-1"; description: "Class1"; values: undefined }
  | { id: "schedule_label_Class-2"; description: "Class2"; values: undefined }
  | { id: "schedule_label_OnlineClass"; description: "online class"; values: undefined }
  | { id: "schedule_label_OfflineClass"; description: "offline class"; values: undefined }
  | { id: "schedule_label_Homework"; description: "task"; values: undefined }
  | { id: "schedule_label_Task"; description: "homework"; values: undefined }
  | { id: "schedule_label_org-1"; description: "org1"; values: undefined }
  | { id: "schedule_label_parent_id"; description: "0"; values: undefined }
  | { id: "schedule_label_org-2"; description: "org2"; values: undefined }
  | { id: "schedule_label_Teacher-1"; description: "Teacher1"; values: undefined }
  | { id: "schedule_label_Teacher-2"; description: "Teacher2"; values: undefined }
  | { id: "schedule_label_student1"; description: "student one"; values: undefined }
  | { id: "schedule_label_student2"; description: "student two"; values: undefined }
  | { id: "schedule_label_student3"; description: "student three"; values: undefined }
  | { id: "schedule_label_student4"; description: "student four"; values: undefined }
  | { id: "schedule_label_student5"; description: "student five"; values: undefined }
  | { id: "schedule_label_student6"; description: "student six"; values: undefined }
  | { id: "schedule_label_student7"; description: "student senven"; values: undefined }
  | { id: "schedule_label_student8"; description: "student eight"; values: undefined }
  | { id: "schedule_label_student9"; description: "student nine"; values: undefined }
  | { id: "schedule_label_student10"; description: "student ten"; values: undefined }
  | { id: "schedule_label_work_week"; description: "Work Week"; values: undefined }
  | { id: "schedule_button_add_class"; description: "Add Class"; values: undefined }
  | { id: "schedule_label_all_day"; description: "All Day"; values: undefined }
  | { id: "schedule_label_continue"; description: "Continue"; values: undefined }
  | { id: "schedule_label_edit"; description: "Edit"; values: undefined }
  | { id: "schedule_label_beyond_two_years"; description: "You cannot schedule a class beyond two years"; values: undefined }
  | { id: "schedule_label_on"; description: "On"; values: undefined }
  | { id: "library_label_suitable_age"; description: "Suitable age"; values: undefined }
  | { id: "assess_label_category"; description: "Category"; values: undefined }
  | { id: "assess_label_subcategory"; description: "Subcategory"; values: undefined }
  | { id: "assess_label_create_time"; description: "Create Time"; values: undefined }
  | { id: "assess_tab_assessments"; description: "Assessments"; values: undefined }
  | { id: "assess_button_search"; description: "Search"; values: undefined }
  | { id: "assess_text_search teacher"; description: "Search Teacher"; values: undefined }
  | { id: "assess_filter_column_status"; description: "Status"; values: undefined }
  | { id: "assess_filter_all"; description: "All"; values: undefined }
  | { id: "assess_filter_complete"; description: "Complete"; values: undefined }
  | { id: "assess_filter_in_progress"; description: "In Progress"; values: undefined }
  | { id: "assess_display_by"; description: "Display By"; values: undefined }
  | { id: "assess_class_end_time_new_old"; description: "Class End Time (New-Old)"; values: undefined }
  | { id: "assess_class_end_time_old_new"; description: "Class End Time (Old -New)"; values: undefined }
  | { id: "assess_complete_time_new_old"; description: "Complete Time(New-Old)"; values: undefined }
  | { id: "assess_complete_time_old_new"; description: "Complete Time(Old-New)"; values: undefined }
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
  | { id: "library_label_create"; description: "Create"; values: undefined }
  | { id: "library_label_for_organizations"; description: "For Organizations"; values: undefined }
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
  | { id: "library_label_added_learning_outcomes"; description: "Added Learning Outcomes"; values: undefined }
  | { id: "library_msg_coming_soon"; description: "Coming soon..."; values: undefined }
  | { id: "library_label_assets"; description: "Assets"; values: undefined }
  | { id: "library_label_material_name"; description: "Material Name"; values: undefined }
  | { id: "library_label_thumbnail"; description: "Thumbnail"; values: undefined }
  | { id: "library_label_duration"; description: "Duration(Minutes)"; values: undefined }
  | { id: "library_label_program"; description: "Program"; values: undefined }
  | { id: "library_label_subject"; description: "Subject"; values: undefined }
  | { id: "library_label_category"; description: "Category"; values: undefined }
  | { id: "library_label_subcategory"; description: "Subcategory"; values: undefined }
  | { id: "library_label_age"; description: "Age"; values: undefined }
  | { id: "library_label_grade"; description: "Grade"; values: undefined }
  | { id: "library_label_visibility_settings"; description: "Visibility Settings"; values: undefined }
  | { id: "library_label_visibility_settings1"; description: "School"; values: undefined }
  | { id: "library_label_visibility_settings2"; description: "Organization"; values: undefined }
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
  | { id: "library_msg_remove_select_one"; description: "At least one content should be selected."; values: undefined }
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
  | { id: "library_label_view_in"; description: "View in"; values: undefined }
  | { id: "library_label_kidsloop_live"; description: "KidsLoop Live"; values: undefined }
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
  | { id: "library_label_image"; description: "Image"; values: undefined }
  | { id: "library_label_video"; description: "Video"; values: undefined }
  | { id: "library_label_audio"; description: "Audio"; values: undefined }
  | { id: "library_label_document"; description: "Document"; values: undefined }
  | { id: "library_label_asset_name"; description: "Asset Name"; values: undefined }
  | { id: "library_label_upload_a_file"; description: "Upload"; values: undefined }
  | { id: "library_label_upload_a"; description: "Upload a () here"; values: undefined }
  | { id: "library_label_upload"; description: "Upload"; values: undefined }
  | { id: "library_label_file_type"; description: "File Type"; values: undefined }
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
  | { id: "schedule_detail_online_class"; description: "Online Class"; values: undefined }
  | { id: "schedule_detail_offline_class"; description: "Offline Class"; values: undefined }
  | { id: "schedule_detail_homework"; description: "Homework"; values: undefined }
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
  | { id: "schedule_button_edit"; description: "Edit"; values: undefined };

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
