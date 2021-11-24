/* tslint:disable */
/* eslint-disable */

/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApiBadRequestResponse {
  data?: object;
  label?: string;
}

export interface ApiBulkBindOutcomeSetRequest {
  outcome_ids?: string[];
  set_ids?: string[];
}

export interface ApiCheckAccountResponse {
  status?: string;
}

export interface ApiConflictResponse {
  data?: object;
  label?: string;
}

export interface ApiCreateContentResponse {
  id?: string;
}

export interface ApiCreateFolderResponse {
  id?: string;
}

export interface ApiDownloadPathResource {
  path?: string;
}

export interface ApiFolderItemsResponse {
  items?: EntityFolderItemInfo[];
}

export interface ApiFolderItemsResponseWithTotal {
  items?: EntityFolderItemInfo[];
  total?: number;
}

export interface ApiForbiddenResponse {
  data?: object;
  label?: string;
}

export interface ApiForgottenPasswordRequest {
  auth_code?: string;
  auth_to?: string;
  password?: string;
}

export interface ApiHasPermissionRequest {
  permission_name?: string[];
}

export type ApiHasPermissionResponse = Record<string, boolean>;

export interface ApiIDResponse {
  id?: string;
}

export interface ApiInternalServerErrorResponse {
  data?: object;
  label?: string;
}

export interface ApiLoginRequest {
  auth_code?: string;
  auth_to?: string;
  auth_type?: string;
}

export interface ApiLoginResponse {
  token?: string;
}

export interface ApiNotFoundResponse {
  data?: object;
  label?: string;
}

export interface ApiOrganizationRegionInfoResponse {
  orgs?: EntityRegionOrganizationInfo[];
}

export interface ApiPublishContentRequest {
  scope?: string[];
}

export interface ApiPullOutcomeSetResponse {
  sets?: ModelOutcomeSetCreateView[];
}

export interface ApiRegisterRequest {
  /** phone number for now 当前是电话号码 */
  account?: string;

  /** register manner 注册类型 */
  act_type?: string;

  /** verification code 验证码 */
  auth_code?: string;

  /** password 密码 */
  password?: string;
}

export interface ApiRejectReasonBulkRequest {
  ids?: string[];
  reject_reason?: string[];
  remark?: string;
}

export interface ApiRejectReasonRequest {
  reject_reason?: string[];
  remark?: string;
}

export interface ApiResetPasswordRequest {
  new_password?: string;
  old_password?: string;
}

export interface ApiSendCodeRequest {
  email?: string;
  mobile?: string;
}

export interface ApiShortcodeRequest {
  kind?: string;
}

export interface ApiShortcodeResponse {
  shortcode?: string;
}

export interface ApiSignatureResponse {
  url?: string;
}

export interface ApiSuccessRequestResponse {
  data?: object;
  label?: string;
}

export interface ApiTokenResponse {
  token?: string;
}

export interface ApiUnAuthorizedResponse {
  data?: object;
  label?: string;
}

export interface ApiContentBulkOperateRequest {
  id?: string[];
}

export interface EntityAddAssessmentResult {
  id?: string;
}

export interface EntityAddAuthedContentRequest {
  content_id?: string;
  from_folder_id?: string;
  org_id?: string;
}

export interface EntityAddClassAndLiveAssessmentArgs {
  attendance_ids?: string[];
  class_end_time?: number;
  class_length?: number;
  schedule_id?: string;
}

export interface EntityAssessHomeFunStudyArgs {
  action?: "save" | "complete";
  assess_comment?: string;
  assess_feedback_id?: string;
  assess_score?: 1 | 2 | 3 | 4 | 5;
  id?: string;
  outcomes?: EntityUpdateHomeFunStudyOutcomeArgs[];
}

export interface EntityAssessmentClass {
  id?: string;
  name?: string;
}

export interface EntityAssessmentDetail {
  class?: EntityAssessmentClass;
  class_end_time?: number;
  class_length?: number;
  complete_time?: number;
  id?: string;
  lesson_materials?: EntityAssessmentDetailContent[];
  lesson_plan?: EntityAssessmentDetailContent;
  outcomes?: EntityAssessmentDetailOutcome[];
  program?: EntityAssessmentProgram;
  remaining_time?: number;
  room_id?: string;
  schedule?: EntitySchedule;
  status?: string;
  student_view_items?: EntityAssessmentStudentViewH5PItem[];
  students?: EntityAssessmentStudent[];
  subjects?: EntityAssessmentSubject[];
  teachers?: EntityAssessmentTeacher[];
  title?: string;
}

export interface EntityAssessmentDetailContent {
  checked?: boolean;
  comment?: string;
  id?: string;
  name?: string;
  outcome_ids?: string[];
}

export interface EntityAssessmentDetailContentOutcome {
  assumed?: boolean;
  checked?: boolean;
  content_id?: string;
  none_achieved?: boolean;
  outcome_id?: string;
  outcome_name?: string;
}

export interface EntityAssessmentDetailOutcome {
  assigned_to?: ("lesson_plan" | "lesson_material")[];
  assumed?: boolean;
  attendance_ids?: string[];
  checked?: boolean;
  none_achieved?: boolean;
  outcome_id?: string;
  outcome_name?: string;
  skip?: boolean;
}

export interface EntityAssessmentItem {
  class_end_time?: number;
  complete_time?: number;
  id?: string;
  lesson_plan?: EntityAssessmentLessonPlan;
  program?: EntityAssessmentProgram;
  status?: string;
  subjects?: EntityAssessmentSubject[];
  teachers?: EntityAssessmentTeacher[];
  title?: string;
}

export interface EntityAssessmentLessonPlan {
  id?: string;
  name?: string;
}

export interface EntityAssessmentProgram {
  id?: string;
  name?: string;
}

export interface EntityAssessmentStudent {
  checked?: boolean;
  id?: string;
  name?: string;
}

export interface EntityAssessmentStudentViewH5PItem {
  comment?: string;
  lesson_materials?: EntityAssessmentStudentViewH5PLessonMaterial[];
  student_id?: string;
  student_name?: string;
}

export interface EntityAssessmentStudentViewH5PLessonMaterial {
  achieved_score?: number;
  answer?: string;
  attempted?: boolean;
  children?: EntityAssessmentStudentViewH5PLessonMaterial[];

  /** add: 2021.06.24 */
  h5p_id?: string;
  has_sub_items?: boolean;
  is_h5p?: boolean;
  lesson_material_id?: string;
  lesson_material_name?: string;

  /** internal */
  lesson_material_ordered_number?: number;
  lesson_material_type?: string;
  max_score?: number;
  not_applicable_scoring?: boolean;
  number?: string;
  ordered_id?: number;
  outcomes?: EntityAssessmentDetailContentOutcome[];
  parent_id?: string;

  /** add: 2021.06.24 */
  sub_h5p_id?: string;
}

export interface EntityAssessmentSubject {
  id?: string;
  name?: string;
}

export interface EntityAssessmentTeacher {
  id?: string;
  name?: string;
}

export interface EntityAssessmentsSummary {
  complete?: number;
  in_progress?: number;
}

export interface EntityAssignmentCompletionRate {
  class_designated_subject?: number;
  duration?: string;
  student_complete_assignment?: number;
  student_designated_subject?: number;
  student_id?: string;
  student_non_designated_subject?: number;
  student_total_assignment?: number;
}

export interface EntityAssignmentRequest {
  class_id: string;
  durations?: string[];
  selected_subject_id_list?: string[];
  student_id: string;
  un_selected_subject_id_list?: string[];
}

export interface EntityAssignmentsSummaryItem {
  assessment_id?: string;
  assessment_title?: string;
  assessment_type?: "class" | "live" | "study" | "home_fun_study";

  /** for sorting */
  complete_at?: number;
  create_at?: number;
  lesson_plan_name?: string;
  outcomes?: EntityLearningSummaryOutcome[];

  /** for debug */
  schedule_id?: string;
  status?: "in_progress" | "complete";
  teacher_feedback?: string;
}

export interface EntityAuthedContentRecordInfo {
  age?: string[];
  age_name?: string[];
  author?: string;
  author_name?: string;
  content_id?: string;
  content_type?: number;
  content_type_name?: string;
  create_at?: number;
  created_at?: number;
  creator?: string;

  /** AuthorName string `json:"author_name"` */
  creator_name?: string;
  data?: string;
  delete_at?: number;
  description?: string;
  developmental?: string[];
  developmental_name?: string[];
  draw_activity?: boolean;
  duration?: number;
  extra?: string;
  from_folder_id?: string;
  grade?: string[];
  grade_name?: string[];
  id?: string;
  is_mine?: boolean;
  keywords?: string[];
  latest_id?: string;
  lesson_type?: string;
  lesson_type_name?: string;
  locked_by?: string;
  name?: string;
  org?: string;
  org_id?: string;
  org_name?: string;
  outcome_entities?: EntityOutcome[];
  outcomes?: string[];
  permission?: EntityContentPermission;
  program?: string;
  program_name?: string;
  publish_scope?: string[];
  publish_scope_name?: string[];
  publish_status?: string;
  record_id?: string;
  reject_reason?: string[];
  remark?: string;
  self_study?: boolean;
  skills?: string[];
  skills_name?: string[];
  source_id?: string;
  source_type?: string;
  subject?: string[];
  subject_name?: string[];
  suggest_time?: number;

  /**
   * TeacherManual     []string `json:"teacher_manual"`
   * Name []string `json:"teacher_manual_name"`
   */
  teacher_manual_batch?: EntityTeacherManualFile[];
  thumbnail?: string;
  updated_at?: number;
  version?: number;
}

export interface EntityAuthedContentRecordInfoResponse {
  list?: EntityAuthedContentRecordInfo[];
  total?: number;
}

export interface EntityAuthedOrgList {
  orgs?: EntityOrganizationInfo[];
  total?: number;
}

export interface EntityBatchAddAuthedContentRequest {
  content_ids?: string[];
  folder_id?: string;
  org_id?: string;
}

export interface EntityBatchDeleteAuthedContentByOrgsRequest {
  content_ids?: string[];
  folder_ids?: string[];
  org_ids?: string[];
}

export interface EntityClassAttendanceRequest {
  class_id: string;
  durations?: string[];
  selected_subject_id_list?: string[];
  student_id: string;
  un_selected_subject_id_list?: string[];
}

export interface EntityClassAttendanceResponse {
  items?: EntityClassAttendanceResponseItem[];
  request_student_id?: string;
}

export interface EntityClassAttendanceResponseItem {
  attendance_percentage?: number;
  attended_count?: number;
  class_average_attendance_percentage?: number;
  duration?: string;
  scheduled_count?: number;
  un_selected_subjects_average_attendance_percentage?: number;
}

export interface EntityClassEventBody {
  token?: string;
}

export interface EntityClassUsage {
  content_usage_list?: EntityContentUsage[];
  id?: string;
}

export interface EntityClassesAssignmentOverView {
  count?: number;
  ratio?: number;
  type?: string;
}

export interface EntityClassesAssignmentOverViewRequest {
  class_ids?: string[];
  durations?: string[];
}

export interface EntityClassesAssignmentsDurationRatio {
  key?: string;
  ratio?: number;
}

export interface EntityClassesAssignmentsUnattendedStudentsView {
  schedule?: EntityScheduleView;
  student_id?: string;

  /** fill by frontend */
  student_name?: string;
  time?: number;
}

export interface EntityClassesAssignmentsUnattendedViewRequest {
  classID?: string;
  durations?: string[];
  type?: string;
}

export interface EntityClassesAssignmentsView {
  class_id?: string;
  durations_ratio?: EntityClassesAssignmentsDurationRatio[];
  total?: number;
}

export interface EntityClassesAssignmentsViewRequest {
  class_ids?: string[];
  durations?: string[];
  type?: string;
}

export interface EntityContentInfoWithDetails {
  age?: string[];
  age_name?: string[];
  author?: string;
  author_name?: string;
  content_type?: number;
  content_type_name?: string;
  created_at?: number;
  creator?: string;

  /** AuthorName string `json:"author_name"` */
  creator_name?: string;
  data?: string;
  description?: string;
  developmental?: string[];
  developmental_name?: string[];
  draw_activity?: boolean;
  extra?: string;
  grade?: string[];
  grade_name?: string[];
  id?: string;
  is_mine?: boolean;
  keywords?: string[];
  latest_id?: string;
  lesson_type?: string;
  lesson_type_name?: string;
  locked_by?: string;
  name?: string;
  org?: string;
  org_name?: string;
  outcome_entities?: EntityOutcome[];
  outcomes?: string[];
  permission?: EntityContentPermission;
  program?: string;
  program_name?: string;
  publish_scope?: string[];
  publish_scope_name?: string[];
  publish_status?: string;
  reject_reason?: string[];
  remark?: string;
  self_study?: boolean;
  skills?: string[];
  skills_name?: string[];
  source_id?: string;
  source_type?: string;
  subject?: string[];
  subject_name?: string[];
  suggest_time?: number;

  /**
   * TeacherManual     []string `json:"teacher_manual"`
   * Name []string `json:"teacher_manual_name"`
   */
  teacher_manual_batch?: EntityTeacherManualFile[];
  thumbnail?: string;
  updated_at?: number;
  version?: number;
}

export interface EntityContentPermission {
  allow_approve?: boolean;
  allow_delete?: boolean;
  allow_edit?: boolean;
  allow_reject?: boolean;
  allow_republish?: boolean;
  id?: string;
}

export interface EntityContentSimplified {
  author_id?: string;
  content_name?: string;
  content_type?: number;
  create_at?: number;
  data?: string;
  id?: string;
  publish_status?: string;
}

export interface EntityContentSimplifiedList {
  list?: EntityContentSimplified[];
  total?: number;
}

export interface EntityContentStatisticsInfo {
  outcomes_count?: number;
  subcontent_count?: number;
}

export interface EntityContentUsage {
  count?: number;
  time_range?: string;
  type?: string;
}

export interface EntityCreateContentRequest {
  age?: string[];
  content_type?: number;
  data?: string;
  description?: string;
  developmental?: string[];
  draw_activity?: boolean;
  extra?: string;
  grade?: string[];
  keywords?: string[];
  lesson_type?: string;
  name?: string;
  outcomes?: string[];
  parent_folder?: string;
  program?: string;
  publish_scope?: string[];
  self_study?: boolean;
  skills?: string[];
  source_type?: string;
  subject?: string[];
  suggest_time?: number;

  /**
   * TeacherManual     string `json:"teacher_manual"`
   * Name string `json:"teacher_manual_name"`
   */
  teacher_manual_batch?: EntityTeacherManualFile[];
  thumbnail?: string;
}

export interface EntityCreateFolderRequest {
  description?: string;
  keywords?: string[];
  name?: string;
  owner_type?: number;
  parent_id?: string;
  partition?: string;
  thumbnail?: string;
}

export interface EntityDeleteAuthedContentRequest {
  content_id?: string;
  org_id?: string;
}

export interface EntityFeedbackAssignmentView {
  attachment_id?: string;
  attachment_name?: string;
  number?: number;
}

export interface EntityFolderContentData {
  author?: string;
  author_name?: string;
  content_type?: number;
  content_type_name?: string;
  create_at?: number;
  data?: string;
  description?: string;
  dir_path?: string;
  id?: string;
  items_count?: number;
  keywords?: string[];
  name?: string;
  permission?: EntityContentPermission;
  publish_status?: string;
  thumbnail?: string;
  update_at?: number;
}

export interface EntityFolderContentInfoWithDetailsResponse {
  list?: EntityFolderContentData[];
  total?: number;
}

export interface EntityFolderIdWithFileType {
  folder_file_type?: "content" | "folder";
  id?: string;
}

export interface EntityFolderItemInfo {
  available?: number;
  create_at?: number;
  creator?: string;
  creator_name?: string;
  description?: string;
  dir_path?: string;
  editor?: string;
  editor_name?: string;
  id?: string;
  item_type?: number;
  items?: EntityFolderItemInfo[];
  items_count?: number;
  keywords?: string[];
  link?: string;
  name?: string;
  owner?: string;
  owner_type?: number;
  parent_id?: string;
  partition?: string;
  thumbnail?: string;
  update_at?: number;
}

export interface EntityFolderShareRecord {
  folder_id?: string;
  orgs?: EntityOrganizationInfo[];
}

export interface EntityFolderShareRecords {
  data?: EntityFolderShareRecord[];
}

export interface EntityGetHomeFunStudyResult {
  assess_comment?: string;
  assess_feedback_id?: string;
  assess_score?: 1 | 2 | 3 | 4 | 5;
  complete_at?: number;
  due_at?: number;
  id?: string;
  outcomes?: EntityHomeFunStudyOutcome[];
  schedule_id?: string;
  status?: string;
  student_id?: string;
  student_name?: string;
  teacher_ids?: string[];
  teacher_names?: string[];
  title?: string;
}

export interface EntityGetStudentPerformanceReportResponse {
  assessment_ids?: string[];
  items?: EntityStudentPerformanceReportItem[];
}

export interface EntityHomeFunStudyOutcome {
  assumed?: boolean;
  outcome_id?: string;
  outcome_name?: string;
  status?: "achieved" | "not_achieved" | "not_attempted";
}

export interface EntityJwtToken {
  token?: string;
}

export interface EntityLearnOutcomeAchievementRequest {
  class_id: string;
  durations?: string[];
  selected_subject_id_list?: string[];
  student_id: string;
  un_selected_subject_id_list?: string[];
}

export interface EntityLearnOutcomeAchievementResponse {
  class_average_achieved_count?: number;
  first_achieved_count?: number;
  items?: EntityLearnOutcomeAchievementResponseItem[];
  re_achieved_count?: number;
  request?: EntityLearnOutcomeAchievementRequest;
  un_selected_subjects_average_achieve_count?: number;
}

export interface EntityLearnOutcomeAchievementResponseItem {
  class_average_achieved_percentage?: number;
  duration?: string;
  first_achieved_count?: number;
  first_achieved_percentage?: number;
  re_achieved_count?: number;
  re_achieved_percentage?: number;
  un_achieved_count?: number;
  un_selected_subjects_average_achieved_percentage?: number;
}

export interface EntityLearningSummaryFilterWeek {
  week_end?: number;
  week_start?: number;
}

export interface EntityLearningSummaryFilterYear {
  weeks?: EntityLearningSummaryFilterWeek[];
  year?: number;
}

export interface EntityLearningSummaryOutcome {
  id?: string;
  name?: string;
  status?: "achieved" | "not_achieved" | "partially";
}

export interface EntityLessonPlanForSchedule {
  group_name?: string;
  id?: string;
  name?: string;
}

export interface EntityLessonType {
  createAt?: number;
  createID?: string;
  deleteAt?: number;
  deleteID?: string;
  id?: string;
  name?: string;
  number?: number;
  updateAt?: number;
  updateID?: string;
}

export interface EntityListAssessmentsResult {
  items?: EntityAssessmentItem[];
  total?: number;
}

export interface EntityListHomeFunStudiesResult {
  items?: EntityListHomeFunStudiesResultItem[];
  total?: number;
}

export interface EntityListHomeFunStudiesResultItem {
  assess_score?: number;
  complete_at?: number;
  due_at?: number;
  id?: string;
  latest_feedback_at?: number;
  lesson_plan?: EntityAssessmentLessonPlan;

  /** debug */
  schedule_id?: string;
  status?: string;
  student_name?: string;
  teacher_names?: string[];
  title?: string;
}

export interface EntityListStudentsPerformanceReportResponse {
  assessment_ids?: string[];
  items?: EntityStudentsPerformanceReportItem[];
}

export interface EntityListStudyAssessmentsResult {
  items?: EntityListStudyAssessmentsResultItem[];
  total?: number;
}

export interface EntityListStudyAssessmentsResultItem {
  class_name?: string;
  complete_at?: number;
  complete_rate?: number;
  create_at?: number;
  due_at?: number;
  id?: string;
  lesson_plan?: EntityAssessmentLessonPlan;
  remaining_time?: number;

  /** debug */
  schedule_id?: string;
  teacher_names?: string[];
  title?: string;
}

export interface EntityLiveClassSummaryItem {
  absent?: boolean;
  assessment_id?: string;
  class_start_time?: number;

  /** for sorting */
  complete_at?: number;
  create_at?: number;
  lesson_plan_name?: string;
  outcomes?: EntityLearningSummaryOutcome[];

  /** for debug */
  schedule_id?: string;
  schedule_title?: string;
  status?: "in_progress" | "complete";
  teacher_feedback?: string;
}

export interface EntityLiveTokenView {
  token?: string;
}

export interface EntityMilestone {
  ages?: string[];
  ancestor_id?: string;
  author_id?: string;
  categories?: string[];
  created_at?: number;
  deleted_at?: number;
  description?: string;
  grades?: string[];
  latest_id?: string;
  lo_counts?: number;
  locked_by?: string;
  milestone_id?: string;
  milestone_name?: string;
  organization_id?: string;
  outcomes?: EntityOutcome[];
  programs?: string[];
  reject_reason?: string;
  shortcode?: string;
  source_id?: string;
  status?: string;
  subcategories?: string[];
  subjects?: string[];
  type?: string;
  updated_at?: number;
}

export interface EntityMoveFolderIDBulkRequest {
  dist?: string;
  folder_info?: EntityFolderIdWithFileType[];
  owner_type?: number;
  partition?: string;
}

export interface EntityMoveFolderRequest {
  dist?: string;
  folder_file_type?: "content" | "folder";
  id?: string;
  owner_type?: number;
  partition?: string;
}

export interface EntityOrganizationInfo {
  id?: string;
  name?: string;
}

export interface EntityOrganizationProperty {
  id?: string;
  region?: "global" | "vn";
  type?: "normal" | "headquarters";
}

export interface EntityOutcome {
  age?: string;
  ages?: string[];
  ancestor_id?: string;
  assumed?: boolean;
  author?: string;
  author_name?: string;
  categories?: string[];
  created_at?: number;
  deleted_at?: number;
  description?: string;

  /** Category */
  developmental?: string;
  extra?: number;
  grade?: string;
  grades?: string[];
  keywords?: string;
  latest_id?: string;
  locked_by?: string;
  milestones?: EntityMilestone[];
  organization_id?: string;
  outcome_id?: string;
  outcome_name?: string;
  program?: string;
  programs?: string[];
  publish_scope?: string;
  publish_status?: string;
  reject_reason?: string;
  sets?: EntitySet[];
  shortcode?: string;

  /** SubCategory */
  skills?: string;
  source_id?: string;
  subcategories?: string[];
  subject?: string;
  subjects?: string[];
  updated_at?: number;
  version?: number;
}

export interface EntityOutcomeCondition {
  age_ids?: string[];
  assumed?: number;
  author_name?: string;
  category_ids?: string[];
  description?: string;
  grade_ids?: string[];
  ids?: string[];
  keywords?: string;
  order_by?: string;
  organization_id?: string;
  outcome_name?: string;
  page?: number;
  page_size?: number;
  program_ids?: string[];
  publish_scope?: string;
  publish_status?: string;
  search_key?: string;
  set_name?: string;
  shortcode?: string;
  sub_category_ids?: string[];
  subject_ids?: string[];
}

export interface EntityQueryAssignmentsSummaryResult {
  home_fun_study_count?: number;
  items?: EntityAssignmentsSummaryItem[];
  study_count?: number;
}

export interface EntityQueryContentItem {
  author?: string;
  author_name?: string;
  content_type?: number;
  content_type_name?: string;
  data?: string;
  id?: string;
  name?: string;
  permission?: EntityContentPermission;
  publish_status?: string;
  suggest_time?: number;
  thumbnail?: string;
}

export interface EntityQueryContentResponse {
  list?: EntityQueryContentItem[];
  total?: number;
}

export interface EntityQueryLiveClassesSummaryResult {
  attend?: number;
  items?: EntityLiveClassSummaryItem[];
}

export interface EntityRegionOrganizationInfo {
  organization_id?: string;
  organization_name?: string;
}

export interface EntityRemoveItemBulk {
  folder_ids?: string[];
}

export interface EntityRepeatDaily {
  end?: EntityRepeatEnd;
  interval?: number;
}

export interface EntityRepeatEnd {
  after_count?: number;
  after_time?: number;
  type?: "never" | "after_count" | "after_time";
}

export interface EntityRepeatMonthly {
  end?: EntityRepeatEnd;
  interval?: number;
  on_date_day?: number;
  on_type?: "date" | "week";
  on_week?: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
}

export interface EntityRepeatOptions {
  daily?: EntityRepeatDaily;
  monthly?: EntityRepeatMonthly;
  type?: "daily" | "weekly" | "monthly" | "yearly";
  weekly?: EntityRepeatWeekly;
  yearly?: EntityRepeatYearly;
}

export interface EntityRepeatWeekly {
  end?: EntityRepeatEnd;
  interval?: number;
  on?: ("Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday")[];
}

export interface EntityRepeatYearly {
  end?: EntityRepeatEnd;
  interval?: number;
  on_date_day?: number;
  on_date_month?: number;
  on_type?: "date" | "week";
  on_week?: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  on_week_month?: number;
  on_week_seq?: "first" | "second" | "third" | "fourth" | "last";
}

export interface EntityReportListTeachingLoadArgs {
  class_ids?: string[];
  teacher_ids?: string[];
  time_offset?: number;
}

export interface EntityReportListTeachingLoadDuration {
  end_at?: number;
  offline?: number;
  online?: number;
  start_at?: number;
}

export interface EntityReportListTeachingLoadItem {
  durations?: EntityReportListTeachingLoadDuration[];
  teacher_id?: string;
  teacher_name?: string;
}

export interface EntityReportListTeachingLoadResult {
  items?: EntityReportListTeachingLoadItem[];
  total?: number;
}

export interface EntitySchedule {
  attachment?: string;

  /** disabled */
  class_id?: string;
  class_type?: string;
  created_at?: number;
  created_id?: string;
  delete_at?: number;
  deleted_id?: string;
  description?: string;
  due_at?: number;
  end_at?: number;
  id?: string;
  is_all_day?: boolean;
  is_hidden?: boolean;
  is_home_fun?: boolean;
  lesson_plan_id?: string;
  org_id?: string;
  program_id?: string;
  repeat_id?: string;
  repeat_json?: string;
  schedule_version?: number;
  start_at?: number;
  status?: string;

  /** disabled */
  subject_id?: string;
  title?: string;
  updated_at?: number;
  updated_id?: string;
}

export interface EntityScheduleAccessibleUserView {
  enable?: boolean;
  id?: string;
  name?: string;
  type?: string;
}

export interface EntityScheduleAddView {
  attachment?: EntityScheduleShortInfo;
  class_id?: string;
  class_roster_student_ids?: string[];
  class_roster_teacher_ids?: string[];
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";
  description?: string;
  due_at?: number;
  end_at?: number;
  is_all_day?: boolean;
  is_force?: boolean;
  is_home_fun?: boolean;
  is_repeat?: boolean;
  lesson_plan_id?: string;
  org_id?: string;
  outcome_ids?: string[];
  participants_student_ids?: string[];
  participants_teacher_ids?: string[];
  program_id?: string;
  repeat?: EntityRepeatOptions;
  start_at?: number;
  subject_ids?: string[];
  time_zone_offset?: number;
  title?: string;
  version?: number;
}

export interface EntityScheduleDetailsView {
  attachment?: EntityScheduleShortInfo;
  class?: EntityScheduleAccessibleUserView;
  class_roster_students?: EntityScheduleAccessibleUserView[];
  class_roster_teachers?: EntityScheduleAccessibleUserView[];
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";
  class_type_label?: EntityScheduleShortInfo;
  complete_assessment?: boolean;
  description?: string;
  due_at?: number;
  end_at?: number;
  exist_assessment?: boolean;
  exist_feedback?: boolean;
  id?: string;
  is_all_day?: boolean;
  is_hidden?: boolean;
  is_home_fun?: boolean;
  is_repeat?: boolean;
  lesson_plan?: EntityScheduleLessonPlan;
  org_id?: string;
  outcome_ids?: string[];
  participants_students?: EntityScheduleAccessibleUserView[];
  participants_teachers?: EntityScheduleAccessibleUserView[];
  program?: EntityScheduleShortInfo;
  real_time_status?: EntityScheduleRealTimeView;
  repeat?: EntityRepeatOptions;
  role_type?: "Student" | "Teacher" | "Unknown";
  start_at?: number;
  status?: "NotStart" | "Started" | "Closed";
  subjects?: EntityScheduleShortInfo[];
  teachers?: EntityScheduleAccessibleUserView[];
  title?: string;
  version?: number;
}

export interface EntityScheduleFeedbackAddInput {
  assignments?: EntityFeedbackAssignmentView[];
  comment?: string;
  schedule_id?: string;
}

export interface EntityScheduleFeedbackView {
  assignments?: EntityFeedbackAssignmentView[];
  comment?: string;
  create_at?: number;
  id?: string;
  is_allow_submit?: boolean;
  schedule_id?: string;
  user_id?: string;
}

export interface EntityScheduleFilterClass {
  id?: string;
  name?: string;
  operator_role_type?: "Student" | "Teacher" | "Unknown";
}

export interface EntityScheduleFilterSchool {
  id?: string;
  name?: string;
}

export interface EntityScheduleLessonPlan {
  id?: string;
  is_auth?: boolean;
  materials?: EntityScheduleLessonPlanMaterial[];
  name?: string;
}

export interface EntityScheduleLessonPlanMaterial {
  id?: string;
  name?: string;
}

export interface EntityScheduleListView {
  class_id?: string;
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";
  class_type_label?: EntityScheduleShortInfo;
  complete_assessment?: boolean;
  due_at?: number;
  end_at?: number;
  exist_assessment?: boolean;
  exist_feedback?: boolean;
  id?: string;
  is_hidden?: boolean;
  is_home_fun?: boolean;
  is_repeat?: boolean;
  lesson_plan_id?: string;
  role_type?: string;
  start_at?: number;
  status?: "NotStart" | "Started" | "Closed";
  title?: string;
}

export interface EntitySchedulePageView {
  data?: EntityScheduleSearchView[];
  total?: number;
}

export interface EntityScheduleRealTimeView {
  id?: string;
  lesson_plan_is_auth?: boolean;
}

export interface EntityScheduleSearchView {
  class?: EntityScheduleAccessibleUserView;
  due_at?: number;
  end_at?: number;
  id?: string;
  lesson_plan?: EntityScheduleShortInfo;
  member_teachers?: EntityScheduleShortInfo[];
  program?: EntityScheduleShortInfo;
  start_at?: number;
  student_count?: number;
  subjects?: EntityScheduleShortInfo[];
  teachers?: EntityScheduleShortInfo[];
  title?: string;
}

export interface EntityScheduleShortInfo {
  id?: string;
  name?: string;
}

export interface EntityScheduleSimplified {
  id?: string;
  lesson_plan_id?: string;
  org_id?: string;
}

export interface EntityScheduleSimplifiedPageView {
  data?: EntityScheduleSimplified[];
  total?: number;
}

export interface EntityScheduleTimeView {
  /** Accurate for Home Fun Study only, in_progress: submitted, complete: completed, empty string: never submitted */
  assessment_status?: "in_progress" | "complete";
  class_id?: string;
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";
  due_at?: number;
  end_at?: number;
  id?: string;
  is_home_fun?: boolean;
  is_repeat?: boolean;
  lesson_plan_id?: string;
  start_at?: number;
  status?: "NotStart" | "Started" | "Closed";
  title?: string;
}

export interface EntityScheduleTimeViewListRequest {
  anytime?: boolean;
  class_ids?: string[];
  class_types?: string[];
  due_at_eq?: number;
  end_at_le?: number;
  order_by?: string;
  page?: number;
  page_size?: number;
  program_ids?: string[];
  school_ids?: string[];
  start_at_ge?: number;
  subject_ids?: string[];
  teacher_ids?: string[];
  time_at?: number;

  /** apply to StartAtGe and EndAtLe, union will include schedules that are only partially within the specified time frame, intersect will not */
  time_boundary?: "intersect" | "union";
  time_zone_offset?: number;
  view_type?: string;
  with_assessment_status?: boolean;
}

export interface EntityScheduleTimeViewListResponse {
  data?: EntityScheduleTimeView[];
  total?: number;
}

export interface EntityScheduleTimeViewQuery {
  anytime?: boolean;
  class_ids?: string[];
  class_types?: string[];
  end_at_le?: number;
  order_by?: string;
  program_ids?: string[];
  school_ids?: string[];
  start_at_ge?: number;
  subject_ids?: string[];
  teacher_ids?: string[];
  time_at?: number;
  time_zone_offset?: number;
  view_type?: string;
}

export interface EntityScheduleUpdateView {
  attachment?: EntityScheduleShortInfo;
  class_id?: string;
  class_roster_student_ids?: string[];
  class_roster_teacher_ids?: string[];
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";
  description?: string;
  due_at?: number;
  end_at?: number;
  id?: string;
  is_all_day?: boolean;
  is_force?: boolean;
  is_home_fun?: boolean;
  is_repeat?: boolean;
  lesson_plan_id?: string;
  org_id?: string;
  outcome_ids?: string[];
  participants_student_ids?: string[];
  participants_teacher_ids?: string[];
  program_id?: string;
  repeat?: EntityRepeatOptions;
  repeat_edit_options?: "only_current" | "with_following";
  start_at?: number;
  subject_ids?: string[];
  time_zone_offset?: number;
  title?: string;
  version?: number;
}

export interface EntityScheduleView {
  schedule_id?: string;
  schedule_name?: string;
  type?: string;
}

export interface EntityScheduleViewDetail {
  attachment?: EntityScheduleShortInfo;
  class?: EntityScheduleShortInfo;
  class_id?: string;
  class_type?: EntityScheduleShortInfo;
  class_type_label?: EntityScheduleShortInfo;
  complete_assessment?: boolean;
  description?: string;
  due_at?: number;
  end_at?: number;
  exist_assessment?: boolean;
  exist_feedback?: boolean;
  id?: string;
  is_hidden?: boolean;
  is_home_fun?: boolean;
  is_repeat?: boolean;
  lesson_plan?: EntityScheduleLessonPlan;
  lesson_plan_id?: string;
  outcome_ids?: string[];
  role_type?: "Student" | "Teacher" | "Unknown";
  room_id?: string;
  start_at?: number;
  status?: "NotStart" | "Started" | "Closed";
  students?: EntityScheduleShortInfo[];
  teachers?: EntityScheduleShortInfo[];
  title?: string;
}

export interface EntitySearchStudentAssessmentsResponse {
  list?: EntityStudentAssessment[];
  total?: number;
}

export interface EntitySet {
  created_at?: number;
  deleted_at?: number;
  organization_id?: string;
  set_id?: string;
  set_name?: string;
  updated_at?: number;
}

export interface EntityShareFoldersRequest {
  folder_ids?: string[];
  org_ids?: string[];
}

export interface EntityStudentAchievementReportCategoryItem {
  achieved_items?: string[];
  name?: string;
  not_achieved_items?: string[];
  not_attempted_items?: string[];
}

export interface EntityStudentAchievementReportItem {
  achieved_count?: number;
  attend?: boolean;
  not_achieved_count?: number;
  not_attempted_count?: number;
  student_id?: string;
  student_name?: string;
}

export interface EntityStudentAchievementReportResponse {
  assessment_ids?: string[];
  attend?: boolean;
  categories?: EntityStudentAchievementReportCategoryItem[];
  student_name?: string;
}

export interface EntityStudentAssessment {
  complete_at?: number;
  create_at?: number;
  id?: string;
  schedule?: EntityStudentAssessmentSchedule;
  score?: number;
  status?: string;
  student_attachments?: EntityStudentAssessmentAttachment[];
  teacher_comments?: EntityStudentAssessmentTeacher[];
  title?: string;
  update_at?: number;
}

export interface EntityStudentAssessmentAttachment {
  id?: string;
  name?: string;
}

export interface EntityStudentAssessmentSchedule {
  attachment?: EntityStudentAssessmentAttachment;
  id?: string;
  title?: string;
  type?: string;
}

export interface EntityStudentAssessmentTeacher {
  comment?: string;
  teacher?: EntityStudentAssessmentTeacherInfo;
}

export interface EntityStudentAssessmentTeacherInfo {
  avatar?: string;
  family_name?: string;
  given_name?: string;
  id?: string;
}

export interface EntityStudentPerformanceReportItem {
  achieved_names?: string[];
  attend?: boolean;
  not_achieved_names?: string[];
  not_attempted_names?: string[];
  schedule_id?: string;
  schedule_start_time?: number;
  student_id?: string;
  student_name?: string;
}

export interface EntityStudentUsageMaterialReportRequest {
  class_id_list?: string[];
  content_type_list?: string[];
  time_range_list?: string[];
}

export interface EntityStudentUsageMaterialReportResponse {
  class_usage_list?: EntityClassUsage[];
  request?: EntityStudentUsageMaterialReportRequest;
}

export interface EntityStudentUsageMaterialViewCountReportRequest {
  class_id_list?: string[];
  content_type_list?: string[];
  time_range_list?: string[];
}

export interface EntityStudentUsageMaterialViewCountReportResponse {
  content_usage_list?: EntityContentUsage[];
  request?: EntityStudentUsageMaterialViewCountReportRequest;
}

export interface EntityStudentUsageRegistration {
  created?: number;
  no_create?: number;
  registered?: number;
}

export interface EntityStudentsAchievementReportResponse {
  assessment_ids?: string[];
  items?: EntityStudentAchievementReportItem[];
}

export interface EntityStudentsPerformanceReportItem {
  achieved_names?: string[];
  attend?: boolean;
  not_achieved_names?: string[];
  not_attempted_names?: string[];
  student_id?: string;
  student_name?: string;
}

export interface EntitySummaryNode {
  count?: number;
  duration?: number;
}

export interface EntityTeacherLoadAssignmentRequest {
  class_id_list?: string[];

  /** one of study, home_fun */
  class_type_list?: string[];
  duration?: string;
  teacher_id_list?: string[];
}

export interface EntityTeacherLoadAssignmentResponseItem {
  avg_days_of_pending_assignment?: number;
  count_of_classes?: number;
  count_of_completed_assignment?: number;
  count_of_pending_assignment?: number;
  count_of_scheduled_assignment?: number;
  count_of_students?: number;
  feedback_percentage?: number;
  teacher_id?: string;

  /** TeacherName just used by font-end: generate swagger json --> generate typescript class */
  teacher_name?: string;
}

export interface EntityTeacherLoadLesson {
  completed_in_class_lessons?: number;
  completed_live_Lessons?: number;
  missed_in_class_lessons?: number;
  missed_live_lessons?: number;
  number_of_classes?: number;
  number_of_students?: number;
  teacher_id?: string;
  total_scheduled?: number;
}

export interface EntityTeacherLoadLessonRequest {
  class_ids?: string[];
  duration?: string;
  teacher_ids?: string[];
}

export interface EntityTeacherLoadLessonSummary {
  completed_in_class_lessons?: EntitySummaryNode;
  completed_live_lessons?: EntitySummaryNode;
  missed_in_class_lessons?: EntitySummaryNode;
  missed_live_lessons?: EntitySummaryNode;
}

export interface EntityTeacherLoadMissedLesson {
  class_id?: string;
  class_type?: string;
  end_date?: number;
  no_of_student?: number;
  start_date?: number;
  title?: string;
}

export interface EntityTeacherLoadMissedLessonsRequest {
  class_ids: string[];
  duration: string;
  page: number;
  page_size: number;
  teacher_id: string;
}

export interface EntityTeacherLoadMissedLessonsResponse {
  list?: EntityTeacherLoadMissedLesson[];
  total?: number;
}

export interface EntityTeacherManualFile {
  id?: string;
  name?: string;
}

export interface EntityTeacherReport {
  categories?: EntityTeacherReportCategory[];
}

export interface EntityTeacherReportCategory {
  items?: string[];
  name?: string;
}

export interface EntityUpdateAssessmentArgs {
  action?: "save" | "complete";
  attendance_ids?: string[];
  content_outcomes?: EntityUpdateAssessmentContentOutcomeArgs[];
  id?: string;
  lesson_materials?: EntityUpdateAssessmentContentArgs[];
  outcomes?: EntityUpdateAssessmentOutcomeArgs[];
  student_view_items?: EntityUpdateAssessmentH5PStudent[];
}

export interface EntityUpdateAssessmentContentArgs {
  checked?: boolean;
  comment?: string;
  id?: string;
}

export interface EntityUpdateAssessmentContentOutcomeArgs {
  attendance_ids?: string[];
  content_id?: string;
  none_achieved?: boolean;
  outcome_id?: string;
}

export interface EntityUpdateAssessmentH5PLessonMaterial {
  achieved_score?: number;

  /** add: 2021.06.24 */
  h5p_id?: string;
  lesson_material_id?: string;

  /** add: 2021.06.24 */
  sub_h5p_id?: string;
}

export interface EntityUpdateAssessmentH5PStudent {
  comment?: string;
  lesson_materials?: EntityUpdateAssessmentH5PLessonMaterial[];
  student_id?: string;
}

export interface EntityUpdateAssessmentOutcomeArgs {
  attendance_ids?: string[];
  none_achieved?: boolean;
  outcome_id?: string;
  skip?: boolean;
}

export interface EntityUpdateFolderRequest {
  description?: string;
  keywords?: string[];
  name?: string;
  thumbnail?: string;
}

export interface EntityUpdateHomeFunStudyOutcomeArgs {
  outcome_id?: string;
  status?: string;
}

export interface EntityUserSettingJsonContent {
  cms_page_size: number;
}

export interface EntityVisibilitySetting {
  createAt?: number;
  createID?: string;
  deleteAt?: number;
  deleteID?: string;
  group?: string;
  id?: string;
  name?: string;
  number?: number;
  updateAt?: number;
  updateID?: string;
}

export interface ExternalAge {
  id?: string;
  name?: string;
  status?: string;
  system?: boolean;
}

export interface ExternalCategory {
  id?: string;
  name?: string;
  status?: string;
  system?: boolean;
}

export interface ExternalGrade {
  id?: string;
  name?: string;
  status?: string;
  system?: boolean;
}

export interface ExternalProgram {
  group_name?: string;
  id?: string;
  name?: string;
  status?: string;
  system?: boolean;
}

export interface ExternalSubCategory {
  id?: string;
  name?: string;
  status?: string;
  system?: boolean;
}

export interface ExternalSubject {
  id?: string;
  name?: string;
  status?: string;
  system?: boolean;
}

export interface ModelAge {
  age_id?: string;
  age_name?: string;
}

export interface ModelAuthorView {
  author_id?: string;
  author_name?: string;
}

export interface ModelCategory {
  category_id?: string;
  category_name?: string;
}

export interface ModelCreateMilestoneView {
  age?: ModelAge[];
  age_ids?: string[];
  ancestor_id?: string;
  author?: ModelAuthorView;
  category?: ModelCategory[];
  category_ids?: string[];
  create_at?: number;
  description?: string;
  grade?: ModelGrade[];
  grade_ids?: string[];
  last_edited_at?: number;
  last_edited_by?: string;
  latest_id?: string;
  locked_by?: string;
  locked_location?: string[];
  milestone_id?: string;
  milestone_name?: string;
  organization?: ModelOrganizationView;
  outcome_ancestor_ids?: string[];
  outcome_count?: number;
  outcomes?: ModelOutcomeView[];
  program?: ModelProgram[];
  program_ids?: string[];
  reject_reason?: string;
  shortcode?: string;
  source_id?: string;
  status?: string;
  sub_category?: ModelSubCategory[];
  subcategory_ids?: string[];
  subject?: ModelSubject[];
  subject_ids?: string[];
  type?: string;
  with_publish?: boolean;
}

export interface ModelDevelopmental {
  developmental_id?: string;
  developmental_name?: string;
}

export interface ModelGrade {
  grade_id?: string;
  grade_name?: string;
}

export interface ModelMilestone {
  milestone_id?: string;
  milestone_name?: string;
}

export interface ModelMilestoneBulkRejectRequest {
  milestone_ids?: string[];
  reject_reason?: string;
}

export interface ModelMilestoneDetailView {
  age?: ModelAge[];
  author?: ModelAuthorView;
  category?: ModelCategory[];
  create_at?: number;
  description?: string;
  grade?: ModelGrade[];
  milestone_id?: string;
  milestone_name?: string;
  organization?: ModelOrganizationView;
  outcomes?: ModelMilestoneOutcomeView[];
  program?: ModelProgram[];
  reject_reason?: string;
  shortcode?: string;
  status?: string;
  sub_category?: ModelSubCategory[];
  subject?: ModelSubject[];
  type?: string;
}

export interface ModelMilestoneList {
  ids?: string[];
}

export interface ModelMilestoneOutcomeView {
  ancestor_id?: string;
  assumed?: boolean;
  developmental?: ModelDevelopmental[];
  outcome_id?: string;
  outcome_name?: string;
  program?: ModelProgram[];
  sets?: ModelOutcomeSetCreateView[];
  shortcode?: string;
}

export interface ModelMilestoneView {
  author?: ModelAuthorView;
  category?: ModelCategory[];
  create_at?: number;
  last_edited_at?: number;
  last_edited_by?: string;
  locked_by?: string;
  locked_location?: string[];
  milestone_id?: string;
  milestone_name?: string;
  outcome_count?: number;
  program?: ModelProgram[];
  shortcode?: string;
  status?: string;
  type?: string;
}

export interface ModelOrganizationView {
  organization_id?: string;
  organization_name?: string;
}

export interface ModelOutcomeBulkRejectRequest {
  outcome_ids?: string[];
  reject_reason?: string;
}

export interface ModelOutcomeCreateResponse {
  age?: string[];
  ancestor_id?: string;
  assumed?: boolean;
  author_id?: string;
  author_name?: string;
  created_at?: number;
  description?: string;
  developmental?: string[];
  estimated_time?: number;
  grade?: string[];
  keywords?: string[];
  locked_by?: string;
  organization_id?: string;
  organization_name?: string;
  outcome_id?: string;
  outcome_name?: string;
  program?: string[];
  publish_scope?: string;
  publish_status?: string;
  reject_reason?: string;
  shortcode?: string;
  skills?: string[];
  source_id?: string;
  subject?: string[];
  updated_at?: number;
}

export interface ModelOutcomeCreateView {
  age?: string[];
  assumed?: boolean;
  description?: string;
  developmental?: string[];
  estimated_time?: number;
  grade?: string[];
  keywords?: string[];
  organization_id?: string;
  outcome_id?: string;
  outcome_name?: string;
  program?: string[];
  sets?: ModelOutcomeSetCreateView[];
  shortcode?: string;
  skills?: string[];
  subject?: string[];
}

export interface ModelOutcomeDetailView {
  age?: ModelAge[];
  ancestor_id?: string;
  assumed?: boolean;
  author_id?: string;
  author_name?: string;
  created_at?: number;
  description?: string;
  developmental?: ModelDevelopmental[];
  grade?: ModelGrade[];
  keywords?: string[];
  last_edited_at?: number;
  last_edited_by?: string;
  locked_by?: string;
  locked_location?: string[];
  milestones?: ModelMilestone[];
  organization_id?: string;
  organization_name?: string;
  outcome_id?: string;
  outcome_name?: string;
  program?: ModelProgram[];
  publish_status?: string;
  reject_reason?: string;
  sets?: ModelOutcomeSetCreateView[];
  shortcode?: string;
  skills?: ModelSkill[];
  subject?: ModelSubject[];
  update_at?: number;
}

export interface ModelOutcomeIDList {
  outcome_ids?: string[];
}

export interface ModelOutcomeRejectReq {
  reject_reason?: string;
}

export interface ModelOutcomeSetCreateView {
  set_id?: string;
  set_name?: string;
}

export interface ModelOutcomeView {
  ancestor_id?: string;
  assumed?: boolean;
  author_id?: string;
  author_name?: string;
  created_at?: number;
  developmental?: ModelDevelopmental[];
  last_edited_at?: number;
  last_edited_by?: string;
  locked_by?: string;
  locked_location?: string[];
  outcome_id?: string;
  outcome_name?: string;
  program?: ModelProgram[];
  publish_status?: string;
  sets?: ModelOutcomeSetCreateView[];
  shortcode?: string;
  update_at?: number;
}

export interface ModelProgram {
  program_id?: string;
  program_name?: string;
}

export interface ModelPublishOutcomeReq {
  scope?: string;
}

export interface ModelPublishedOutcomeView {
  age_ids?: string[];
  assumed?: boolean;
  category_ids?: string[];
  grade_ids?: string[];
  outcome_id?: string;
  outcome_name?: string;
  program_ids?: string[];
  sets?: ModelOutcomeSetCreateView[];
  shortcode?: string;
  sub_category_ids?: string[];
  subject_ids?: string[];
}

export interface ModelSearchMilestoneResponse {
  milestones?: ModelCreateMilestoneView[];
  total?: number;
}

export interface ModelSearchOutcomeResponse {
  list?: ModelOutcomeView[];
  total?: number;
}

export interface ModelSearchPublishedOutcomeResponse {
  list?: ModelPublishedOutcomeView[];
  total?: number;
}

export interface ModelSkill {
  skill_id?: string;
  skill_name?: string;
}

export interface ModelSubCategory {
  sub_category_id?: string;
  sub_category_name?: string;
}

export interface ModelSubject {
  subject_id?: string;
  subject_name?: string;
}

export type RequestParams = Omit<RequestInit, "body" | "method"> & {
  secure?: boolean;
};

export type RequestQueryParamsType = Record<string | number, any>;

type ApiConfig<SecurityDataType> = {
  baseUrl?: string;
  baseApiParams?: RequestParams;
  securityWorker?: (securityData: SecurityDataType) => RequestParams;
};

enum BodyType {
  Json,
}

class HttpClient<SecurityDataType> {
  public baseUrl: string = "//https://kl2-test.kidsloop.net/v1";
  private securityData: SecurityDataType = null as any;
  private securityWorker: ApiConfig<SecurityDataType>["securityWorker"] = (() => {}) as any;

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor({ baseUrl, baseApiParams, securityWorker }: ApiConfig<SecurityDataType> = {}) {
    this.baseUrl = baseUrl || this.baseUrl;
    this.baseApiParams = baseApiParams || this.baseApiParams;
    this.securityWorker = securityWorker || this.securityWorker;
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data;
  };

  private addQueryParam(query: RequestQueryParamsType, key: string) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(Array.isArray(query[key]) ? query[key].join(",") : query[key]);
  }

  protected addQueryParams(rawQuery?: RequestQueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys.length
      ? `?${keys
          .map((key) =>
            typeof query[key] === "object" && !Array.isArray(query[key])
              ? this.addQueryParams(query[key] as object).substring(1)
              : this.addQueryParam(query, key)
          )
          .join("&")}`
      : "";
  }

  private bodyFormatters: Record<BodyType, (input: any) => any> = {
    [BodyType.Json]: JSON.stringify,
  };

  private mergeRequestOptions(params: RequestParams, securityParams?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params,
      ...(securityParams || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params.headers || {}),
        ...((securityParams && securityParams.headers) || {}),
      },
    };
  }

  private safeParseResponse = <T = any, E = any>(response: Response): Promise<T> =>
    response
      .json()
      .then((data) => data)
      .catch((e) => response.text);

  public request = <T = any, E = any>(
    path: string,
    method: string,
    { secure, ...params }: RequestParams = {},
    body?: any,
    bodyType?: BodyType,
    secureByDefault?: boolean
  ): Promise<T> =>
    fetch(`${this.baseUrl}${path}`, {
      // @ts-ignore
      ...this.mergeRequestOptions(params, (secureByDefault || secure) && this.securityWorker(this.securityData)),
      method,
      body: body ? this.bodyFormatters[bodyType || BodyType.Json](body) : null,
    }).then(async (response) => {
      const data = await this.safeParseResponse<T, E>(response);
      if (!response.ok) throw data;
      return data;
    });
}

/**
 * @title KidsLoop 2.0 REST API
 * @version 1.0.0
 * @baseUrl //https://kl2-test.kidsloop.net/v1
 * "KidsLoop 2.0 backend rest api
 */
export class Api<SecurityDataType = any> extends HttpClient<SecurityDataType> {
  ages = {
    /**
     * @tags age
     * @name getAge
     * @summary getAge
     * @request GET:/ages
     * @description get age
     */
    getAge: (query?: { program_id?: string }, params?: RequestParams) =>
      this.request<ExternalAge[], ApiInternalServerErrorResponse>(`/ages${this.addQueryParams(query)}`, "GET", params),
  };
  assessments = {
    /**
     * @tags assessments
     * @name listAssessment
     * @summary list assessments
     * @request GET:/assessments
     * @description list assessments
     */
    listAssessment: (
      query?: {
        status?: string;
        teacher_name?: string;
        class_type?: "OnlineClass" | "OfflineClass";
        page?: number;
        page_size?: number;
        order_by?: "class_end_time" | "-class_end_time" | "complete_time" | "-complete_time";
      },
      params?: RequestParams
    ) =>
      this.request<EntityListAssessmentsResult, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/assessments${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags assessments
     * @name addAssessment
     * @summary add assessments
     * @request POST:/assessments
     * @description add assessments
     */
    addAssessment: (assessment: EntityAddClassAndLiveAssessmentArgs, params?: RequestParams) =>
      this.request<EntityAddAssessmentResult, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/assessments`,
        "POST",
        params,
        assessment
      ),

    /**
     * @tags assessments
     * @name getAssessment
     * @summary get assessment detail
     * @request GET:/assessments/{id}
     * @description get assessment detail
     */
    getAssessment: (id: string, params?: RequestParams) =>
      this.request<
        EntityAssessmentDetail,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse
      >(`/assessments/${id}`, "GET", params),

    /**
     * @tags assessments
     * @name updateAssessment
     * @summary update assessment
     * @request PUT:/assessments/{id}
     * @description update assessment
     */
    updateAssessment: (id: string, update_assessment_command: EntityUpdateAssessmentArgs, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/assessments/${id}`,
        "PUT",
        params,
        update_assessment_command
      ),
  };
  assessmentsForStudent = {
    /**
     * @tags assessments
     * @name getStudentAssessments
     * @summary get student assessments
     * @request GET:/assessments_for_student
     * @description get student assessments
     */
    getStudentAssessments: (
      query: {
        type: string;
        status?: string;
        order_by?: string;
        teacher_id?: string;
        assessment_id?: string;
        schedule_ids?: string;
        create_at_ge?: string;
        create_at_le?: string;
        update_at_le?: string;
        complete_at_ge?: string;
        complete_at_le?: string;
        page?: string;
        page_size?: string;
      },
      params?: RequestParams
    ) =>
      this.request<EntitySearchStudentAssessmentsResponse, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/assessments_for_student${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  assessmentsForTest = {
    /**
     * @tags assessments
     * @name addAssessmentForTest
     * @summary add assessments for test
     * @request POST:/assessments_for_test
     * @description add assessments for test
     */
    addAssessmentForTest: (assessment: EntityAddClassAndLiveAssessmentArgs, params?: RequestParams) =>
      this.request<EntityAddAssessmentResult, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/assessments_for_test`,
        "POST",
        params,
        assessment
      ),
  };
  assessmentsSummary = {
    /**
     * @tags assessments
     * @name getAssessmentsSummary
     * @summary get assessments summary
     * @request GET:/assessments_summary
     * @description get assessments summary
     */
    getAssessmentsSummary: (query?: { status?: string; teacher_name?: string }, params?: RequestParams) =>
      this.request<EntityAssessmentsSummary, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/assessments_summary${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  bulk = {
    /**
     * @tags learning_outcomes
     * @name deleteOutcomeBulk
     * @summary bulk delete learning outcome
     * @request DELETE:/bulk/learning_outcomes
     * @description bulk delete learning outcomes
     */
    deleteOutcomeBulk: (id_list: ModelOutcomeIDList, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/bulk/learning_outcomes`,
        "DELETE",
        params,
        id_list
      ),
  };
  bulkApprove = {
    /**
     * @tags learning_outcomes
     * @name approveLearningOutcomesBulk
     * @summary bulk approve learning outcome
     * @request PUT:/bulk_approve/learning_outcomes
     * @description approve learning outcomes
     */
    approveLearningOutcomesBulk: (id_list: ModelOutcomeIDList, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/bulk_approve/learning_outcomes`,
        "PUT",
        params,
        id_list
      ),

    /**
     * @tags milestone
     * @name bulkApproveMilestone
     * @summary bulk approve milestone
     * @request PUT:/bulk_approve/milestones
     * @description bulk approve milestone
     */
    bulkApproveMilestone: (id_list: ModelMilestoneList, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/bulk_approve/milestones`,
        "PUT",
        params,
        id_list
      ),
  };
  bulkPublish = {
    /**
     * @tags learning_outcomes
     * @name publishLearningOutcomesBulk
     * @summary publish bulk learning outcome
     * @request PUT:/bulk_publish/learning_outcomes
     * @description submit publish learning outcomes
     */
    publishLearningOutcomesBulk: (id_list: ModelOutcomeIDList, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/bulk_publish/learning_outcomes`,
        "PUT",
        params,
        id_list
      ),

    /**
     * @tags milestone
     * @name publishMilestonesBulk
     * @summary publish bulk milestone
     * @request PUT:/bulk_publish/milestones
     * @description submit publish milestones
     */
    publishMilestonesBulk: (id_list: ModelMilestoneList, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/bulk_publish/milestones`,
        "PUT",
        params,
        id_list
      ),
  };
  bulkReject = {
    /**
     * @tags learning_outcomes
     * @name rejectLearningOutcomesBulk
     * @summary bulk reject learning outcome
     * @request PUT:/bulk_reject/learning_outcomes
     * @description reject learning outcomes
     */
    rejectLearningOutcomesBulk: (bulk_reject_list: ModelOutcomeBulkRejectRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/bulk_reject/learning_outcomes`,
        "PUT",
        params,
        bulk_reject_list
      ),

    /**
     * @tags milestone
     * @name bulkRejectMilestone
     * @summary bulk reject milestone
     * @request PUT:/bulk_reject/milestones
     * @description bulk reject milestone
     */
    bulkRejectMilestone: (bulk_reject_list: ModelMilestoneBulkRejectRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/bulk_reject/milestones`,
        "PUT",
        params,
        bulk_reject_list
      ),
  };
  classesMembers = {
    /**
     * @tags classAddMembersEvent
     * @name classAddMembersEvent
     * @summary classAddMembersEvent
     * @request POST:/classes_members
     * @description add members to class
     */
    classAddMembersEvent: (event: EntityClassEventBody, params?: RequestParams) =>
      this.request<ApiSuccessRequestResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/classes_members`,
        "POST",
        params,
        event
      ),

    /**
     * @tags classDeleteMembersEvent
     * @name classDeleteMembersEvent
     * @summary classDeleteMembersEvent
     * @request DELETE:/classes_members
     * @description class delete members
     */
    classDeleteMembersEvent: (event: EntityClassEventBody, params?: RequestParams) =>
      this.request<ApiSuccessRequestResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/classes_members`,
        "DELETE",
        params,
        event
      ),
  };
  contents = {
    /**
     * @tags content
     * @name searchContents
     * @summary queryContent
     * @request GET:/contents
     * @description query content by condition (Inherent & unchangeable)
     */
    searchContents: (
      query?: {
        name?: string;
        author?: string;
        content_type?: string;
        scope?: string;
        program_group?: string;
        submenu?: string;
        program?: string;
        content_name?: string;
        path?: string;
        source_type?: string;
        publish_status?: "published" | "draft" | "pending" | "rejected" | "archive";
        order_by?: "id" | "-id" | "content_name" | "-content_name" | "create_at" | "-create_at" | "update_at" | "-update_at";
        page_size?: number;
        page?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityQueryContentResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags content
     * @name createContent
     * @summary createContent
     * @request POST:/contents
     * @description create lesson plan, lesson material or assets
     */
    createContent: (content: EntityCreateContentRequest, params?: RequestParams) =>
      this.request<ApiCreateContentResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/contents`, "POST", params, content),

    /**
     * @tags content
     * @name getContentById
     * @summary getContent
     * @request GET:/contents/{content_id}
     * @description get a content by id (Inherent & unchangeable)
     */
    getContentById: (content_id: string, params?: RequestParams) =>
      this.request<EntityContentInfoWithDetails, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents/${content_id}`,
        "GET",
        params
      ),

    /**
     * @tags content
     * @name updateContent
     * @summary updateContent
     * @request PUT:/contents/{content_id}
     * @description update a content data
     */
    updateContent: (content_id: string, contentData: EntityCreateContentRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/contents/${content_id}`, "PUT", params, contentData),

    /**
     * @tags content
     * @name deleteContent
     * @summary deleteContent
     * @request DELETE:/contents/{content_id}
     * @description delete a content
     */
    deleteContent: (content_id: string, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/contents/${content_id}`, "DELETE", params),

    /**
     * @tags content
     * @name getContentLiveToken
     * @summary getContentLiveToken
     * @request GET:/contents/{content_id}/live/token
     * @description get content live token
     */
    getContentLiveToken: (content_id: string, params?: RequestParams) =>
      this.request<EntityLiveTokenView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/contents/${content_id}/live/token`,
        "GET",
        params
      ),

    /**
     * @tags content
     * @name lockContent
     * @summary lockContent
     * @request PUT:/contents/{content_id}/lock
     * @description lock a content to edit
     */
    lockContent: (content_id: string, params?: RequestParams) =>
      this.request<ApiCreateContentResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents/${content_id}/lock`,
        "PUT",
        params
      ),

    /**
     * @tags content
     * @name publishContent
     * @summary publishContent
     * @request PUT:/contents/{content_id}/publish
     * @description publish a content
     */
    publishContent: (content_id: string, data: ApiPublishContentRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/contents/${content_id}/publish`, "PUT", params, data),

    /**
     * @tags content
     * @name publishContentWithAssets
     * @summary publishContentWithAssets
     * @request PUT:/contents/{content_id}/publish/assets
     * @description publish a content with assets
     */
    publishContentWithAssets: (content_id: string, data: ApiPublishContentRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents/${content_id}/publish/assets`,
        "PUT",
        params,
        data
      ),

    /**
     * @tags content
     * @name approveContentReview
     * @summary approve content
     * @request PUT:/contents/{content_id}/review/approve
     * @description approve content by id
     */
    approveContentReview: (content_id: string, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/contents/${content_id}/review/approve`,
        "PUT",
        params
      ),

    /**
     * @tags content
     * @name rejectContentReview
     * @summary reject content
     * @request PUT:/contents/{content_id}/review/reject
     * @description reject content by id
     */
    rejectContentReview: (content_id: string, RejectReasonRequest: ApiRejectReasonRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/contents/${content_id}/review/reject`,
        "PUT",
        params,
        RejectReasonRequest
      ),

    /**
     * @tags content
     * @name getContentsStatistics
     * @summary contentDataCount
     * @request GET:/contents/{content_id}/statistics
     * @description get content data count
     */
    getContentsStatistics: (content_id: string, params?: RequestParams) =>
      this.request<EntityContentStatisticsInfo, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents/${content_id}/statistics`,
        "GET",
        params
      ),
  };
  contentsAuth = {
    /**
     * @tags content
     * @name addAuthedContent
     * @summary addAuthedContent
     * @request POST:/contents_auth
     * @description add authed content to org
     */
    addAuthedContent: (content: EntityAddAuthedContentRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/contents_auth`, "POST", params, content),

    /**
     * @tags content
     * @name deleteAuthedContent
     * @summary deleteAuthedContent
     * @request DELETE:/contents_auth
     * @description delete authed content to org
     */
    deleteAuthedContent: (content: EntityDeleteAuthedContentRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/contents_auth`, "DELETE", params, content),

    /**
     * @tags content
     * @name batchAddAuthedContent
     * @summary batchAddAuthedContent
     * @request POST:/contents_auth/batch
     * @description batch add authed content to org
     */
    batchAddAuthedContent: (content: EntityBatchAddAuthedContentRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/contents_auth/batch`, "POST", params, content),

    /**
     * @tags content
     * @name batchDeleteAuthedContent
     * @summary batchDeleteAuthedContent
     * @request DELETE:/contents_auth/batch
     * @description batch delete authed content to org
     */
    batchDeleteAuthedContent: (content: EntityBatchDeleteAuthedContentByOrgsRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/contents_auth/batch`, "DELETE", params, content),

    /**
     * @tags content
     * @name getContentAuthedOrg
     * @summary getContentAuthedOrg
     * @request GET:/contents_auth/content
     * @description get content authed org list
     */
    getContentAuthedOrg: (query?: { content_id?: string }, params?: RequestParams) =>
      this.request<EntityAuthedOrgList, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents_auth/content${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags content
     * @name getOrgAuthedContent
     * @summary getOrgAuthedContent
     * @request GET:/contents_auth/org
     * @description get org authed content list
     */
    getOrgAuthedContent: (query?: { org_id?: string }, params?: RequestParams) =>
      this.request<EntityAuthedContentRecordInfoResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents_auth/org${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  contentsAuthed = {
    /**
     * @tags content
     * @name queryAuthContent
     * @summary queryAuthContent
     * @request GET:/contents_authed
     * @description query authed content by condition
     */
    queryAuthContent: (
      query?: {
        name?: string;
        content_type?: string;
        program?: string;
        content_name?: string;
        program_group?: string;
        submenu?: string;
        source_type?: string;
        order_by?: "id" | "-id" | "content_name" | "-content_name" | "create_at" | "-create_at" | "update_at" | "-update_at";
        page_size?: number;
        page?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityQueryContentResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents_authed${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  contentsBulk = {
    /**
     * @tags content
     * @name deleteContentBulk
     * @summary deleteContentBulk
     * @request DELETE:/contents_bulk
     * @description delete contents bulk
     */
    deleteContentBulk: (contentIds: ApiContentBulkOperateRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/contents_bulk`, "DELETE", params, contentIds),

    /**
     * @tags content
     * @name publishContentBulk
     * @summary publishContentBulk
     * @request PUT:/contents_bulk/publish
     * @description publish contents bulk
     */
    publishContentBulk: (contentIds: ApiContentBulkOperateRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/contents_bulk/publish`, "PUT", params, contentIds),
  };
  contentsFolders = {
    /**
     * @tags content
     * @name queryFolderContent
     * @summary queryFolderContent
     * @request GET:/contents_folders
     * @description query content by condition
     */
    queryFolderContent: (
      query?: {
        name?: string;
        author?: string;
        content_type?: string;
        scope?: string;
        content_name?: string;
        submenu?: string;
        program?: string;
        program_group?: string;
        path?: string;
        source_type?: string;
        publish_status?: "published" | "draft" | "pending" | "rejected" | "archive";
        order_by?: "id" | "-id" | "content_name" | "-content_name" | "create_at" | "-create_at" | "update_at" | "-update_at";
        page_size?: number;
        page?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityFolderContentInfoWithDetailsResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents_folders${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  contentsLessonPlans = {
    /**
     * @tags content
     * @name getLessonPlansCanSchedule
     * @summary getLessonPlansCanSchedule
     * @request GET:/contents_lesson_plans
     * @description get lesson plans for schedule
     */
    getLessonPlansCanSchedule: (params?: RequestParams) =>
      this.request<EntityLessonPlanForSchedule[], ApiInternalServerErrorResponse>(`/contents_lesson_plans`, "GET", params),
  };
  contentsPending = {
    /**
     * @tags content
     * @name searchPendingContents
     * @summary queryPendingContent
     * @request GET:/contents_pending
     * @description query pending content by condition
     */
    searchPendingContents: (
      query?: {
        name?: string;
        author?: string;
        content_type?: string;
        scope?: string;
        program?: string;
        submenu?: string;
        content_name?: string;
        program_group?: string;
        source_type?: string;
        publish_status?: "published" | "draft" | "pending" | "rejected" | "archive";
        order_by?: "id" | "-id" | "content_name" | "-content_name" | "create_at" | "-create_at" | "update_at" | "-update_at";
        page_size?: number;
        page?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityQueryContentResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents_pending${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  contentsPrivate = {
    /**
     * @tags content
     * @name searchPrivateContents
     * @summary queryPrivateContent
     * @request GET:/contents_private
     * @description query private content by condition
     */
    searchPrivateContents: (
      query?: {
        name?: string;
        author?: string;
        content_type?: string;
        program?: string;
        program_group?: string;
        content_name?: string;
        submenu?: string;
        source_type?: string;
        scope?: string;
        publish_status?: "published" | "draft" | "pending" | "rejected" | "archive";
        order_by?: "id" | "-id" | "content_name" | "-content_name" | "create_at" | "-create_at" | "update_at" | "-update_at";
        page_size?: number;
        page?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityQueryContentResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents_private${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  contentsResources = {
    /**
     * @tags content
     * @name getContentResourceUploadPath
     * @summary getContentResourceUploadPath
     * @request GET:/contents_resources
     * @description get path to upload resource
     */
    getContentResourceUploadPath: (query: { partition: string; extension: string }, params?: RequestParams) =>
      this.request<any, string | ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents_resources${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags content
     * @name getContentResourcePath
     * @summary getContentResourcePath
     * @request GET:/contents_resources/{resource_id}
     * @description get the path of a resource
     */
    getContentResourcePath: (resource_id: string, params?: RequestParams) =>
      this.request<any, string | ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents_resources/${resource_id}`,
        "GET",
        params
      ),

    /**
     * @tags content
     * @name getDownloadPath
     * @summary getDownloadPath
     * @request GET:/contents_resources/{resource_id}/download
     * @description get the path of a resource url
     */
    getDownloadPath: (resource_id: string, params?: RequestParams) =>
      this.request<ApiDownloadPathResource, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents_resources/${resource_id}/download`,
        "GET",
        params
      ),
  };
  contentsReview = {
    /**
     * @tags content
     * @name approveContentReviewBulk
     * @summary approve content bulk
     * @request PUT:/contents_review/approve
     * @description approve content bulk
     */
    approveContentReviewBulk: (RejectReasonRequest: ApiRejectReasonBulkRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/contents_review/approve`,
        "PUT",
        params,
        RejectReasonRequest
      ),

    /**
     * @tags content
     * @name rejectContentReviewBulk
     * @summary reject content bulk
     * @request PUT:/contents_review/reject
     * @description reject content bulk
     */
    rejectContentReviewBulk: (RejectReasonRequest: ApiRejectReasonBulkRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/contents_review/reject`,
        "PUT",
        params,
        RejectReasonRequest
      ),
  };
  crypto = {
    /**
     * @tags crypto
     * @name generateH5pJWT
     * @summary generateH5pJWT
     * @request GET:/crypto/h5p/jwt
     * @description generate JWT for h5p
     */
    generateH5PJwt: (query?: { sub?: string; content_id?: string }, params?: RequestParams) =>
      this.request<ApiTokenResponse, ApiInternalServerErrorResponse>(`/crypto/h5p/jwt${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags crypto
     * @name h5pSignature
     * @summary h5pSignature
     * @request GET:/crypto/h5p/signature
     * @description signature url for h5p
     */
    h5PSignature: (query?: { url?: string }, params?: RequestParams) =>
      this.request<ApiSignatureResponse, ApiInternalServerErrorResponse>(
        `/crypto/h5p/signature${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  developmentals = {
    /**
     * @tags developmental
     * @name getDevelopmental
     * @summary getDevelopmental
     * @request GET:/developmentals
     * @description get developmental
     */
    getDevelopmental: (query?: { program_id?: string; subject_ids?: string }, params?: RequestParams) =>
      this.request<ExternalCategory[], ApiInternalServerErrorResponse>(`/developmentals${this.addQueryParams(query)}`, "GET", params),
  };
  folders = {
    /**
     * @tags folder
     * @name createFolder
     * @summary createFolder
     * @request POST:/folders
     * @description create folder
     */
    createFolder: (content: EntityCreateFolderRequest, params?: RequestParams) =>
      this.request<ApiCreateFolderResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/folders`, "POST", params, content),

    /**
     * @tags folder
     * @name removeFolderItemBulk
     * @summary removeFolderItemBulk
     * @request DELETE:/folders/items
     * @description remove folder items bulk
     */
    removeFolderItemBulk: (content: EntityRemoveItemBulk, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/folders/items`, "DELETE", params, content),

    /**
     * @tags folder
     * @name moveFolderItemBulk
     * @summary moveFolderItemBulk
     * @request PUT:/folders/items/bulk/move
     * @description bulk move folder item
     */
    moveFolderItemBulk: (content: EntityMoveFolderIDBulkRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/folders/items/bulk/move`, "PUT", params, content),

    /**
     * @tags folder
     * @name getFolderItemByID
     * @summary getFolderItemByID
     * @request GET:/folders/items/details/{item_id}
     * @description get a folder item by id
     */
    getFolderItemById: (item_id: string, params?: RequestParams) =>
      this.request<EntityFolderItemInfo, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/folders/items/details/${item_id}`,
        "GET",
        params
      ),

    /**
     * @tags folder
     * @name updateFolderItem
     * @summary updateFolderItem
     * @request PUT:/folders/items/details/{item_id}
     * @description update folder item info
     */
    updateFolderItem: (item_id: string, content: EntityUpdateFolderRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/folders/items/details/${item_id}`,
        "PUT",
        params,
        content
      ),

    /**
     * @tags folder
     * @name listFolderItems
     * @summary listFolderItems
     * @request GET:/folders/items/list/{item_id}
     * @description list folder items (deprecated)
     */
    listFolderItems: (item_id: string, query?: { item_type?: number }, params?: RequestParams) =>
      this.request<ApiFolderItemsResponse, ApiInternalServerErrorResponse>(
        `/folders/items/list/${item_id}${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags folder
     * @name moveFolderItem
     * @summary moveFolderItem
     * @request PUT:/folders/items/move
     * @description move folder item
     */
    moveFolderItem: (content: EntityMoveFolderRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/folders/items/move`, "PUT", params, content),

    /**
     * @tags folder
     * @name searchOrgFolderItems
     * @summary searchOrgFolderItems
     * @request GET:/folders/items/search/org
     * @description search folder items in org
     */
    searchOrgFolderItems: (
      query?: {
        name?: string;
        item_type?: number;
        owner_type?: number;
        partition?: string;
        parent_id?: string;
        path?: string;
        order_by?: "id" | "-id" | "create_at" | "-create_at" | "update_at" | "-update_at";
        page?: number;
        page_size?: number;
      },
      params?: RequestParams
    ) =>
      this.request<ApiFolderItemsResponseWithTotal, ApiInternalServerErrorResponse>(
        `/folders/items/search/org${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags folder
     * @name searchPrivateFolderItems
     * @summary searchPrivateFolderItems
     * @request GET:/folders/items/search/private
     * @description search user's private folder items
     */
    searchPrivateFolderItems: (
      query?: {
        name?: string;
        item_type?: number;
        owner_type?: number;
        partition?: string;
        parent_id?: string;
        path?: string;
        order_by?: "id" | "-id" | "create_at" | "-create_at" | "update_at" | "-update_at";
        page?: number;
        page_size?: number;
      },
      params?: RequestParams
    ) =>
      this.request<ApiFolderItemsResponseWithTotal, ApiInternalServerErrorResponse>(
        `/folders/items/search/private${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags folder
     * @name removeFolderItem
     * @summary removeFolderItem
     * @request DELETE:/folders/items/{item_id}
     * @description remove folder item
     */
    removeFolderItem: (item_id: string, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/folders/items/${item_id}`, "DELETE", params),

    /**
     * @tags folder
     * @name getFoldersSharedRecords
     * @summary getFoldersSharedRecords
     * @request GET:/folders/share
     * @description get folders shared records
     */
    getFoldersSharedRecords: (query?: { folder_ids?: string }, params?: RequestParams) =>
      this.request<EntityFolderShareRecords, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/folders/share${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags folder
     * @name shareFolders
     * @summary shareFolders
     * @request PUT:/folders/share
     * @description share folders to org
     */
    shareFolders: (content: EntityShareFoldersRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/folders/share`, "PUT", params, content),
  };
  grades = {
    /**
     * @tags grade
     * @name getGrade
     * @summary getGrade
     * @request GET:/grades
     * @description get grade
     */
    getGrade: (query?: { program_id?: string }, params?: RequestParams) =>
      this.request<ExternalGrade[], ApiInternalServerErrorResponse>(`/grades${this.addQueryParams(query)}`, "GET", params),
  };
  homeFunStudies = {
    /**
     * @tags homeFunStudies
     * @name listHomeFunStudies
     * @summary list home fun studies
     * @request GET:/home_fun_studies
     * @description list home fun studies
     */
    listHomeFunStudies: (
      query?: {
        query?: string;
        status?: "all" | "in_progress" | "complete";
        order_by?: "latest_feedback_at" | "-latest_feedback_at" | "complete_at" | "-complete_at";
        page?: number;
        page_size?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityListHomeFunStudiesResult, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/home_fun_studies${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags homeFunStudies
     * @name getHomeFunStudy
     * @summary get home fun study
     * @request GET:/home_fun_studies/{id}
     * @description get home fun study detail
     */
    getHomeFunStudy: (id: string, params?: RequestParams) =>
      this.request<
        EntityGetHomeFunStudyResult,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse
      >(`/home_fun_studies/${id}`, "GET", params),

    /**
     * @tags homeFunStudies
     * @name assessHomeFunStudy
     * @summary assess home fun study
     * @request PUT:/home_fun_studies/{id}/assess
     * @description assess home fun study
     */
    assessHomeFunStudy: (id: string, assess_home_fun_study_args: EntityAssessHomeFunStudyArgs, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/home_fun_studies/${id}/assess`,
        "PUT",
        params,
        assess_home_fun_study_args
      ),
  };
  internal = {
    /**
     * @tags content
     * @name queryContentInternal
     * @summary queryContentInternal
     * @request GET:/internal/contents
     * @description query content internal
     */
    queryContentInternal: (
      query?: {
        org_id?: string;
        content_ids?: string;
        content_type?: number;
        plan_id?: string;
        source_id?: string;
        order_by?: "id" | "-id" | "content_name" | "-content_name" | "create_at" | "-create_at" | "update_at" | "-update_at";
        page_size?: number;
        page?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityContentSimplifiedList, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/internal/contents${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags schedule
     * @name queryScheduleInternal
     * @summary queryScheduleInternal
     * @request GET:/internal/schedules
     * @description query schedule internal
     */
    queryScheduleInternal: (
      query?: {
        schedule_ids?: string;
        order_by?: "create_at" | "-create_at" | "start_at" | "-start_at";
        page?: number;
        page_size?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityScheduleSimplifiedPageView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/internal/schedules${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  learningOutcomes = {
    /**
     * @tags learning_outcomes
     * @name searchLearningOutcomes
     * @summary search learning outcome
     * @request GET:/learning_outcomes
     * @description search learning outcomes
     */
    searchLearningOutcomes: (
      query?: {
        outcome_name?: string;
        description?: string;
        keywords?: string;
        shortcode?: string;
        author_name?: string;
        set_name?: string;
        search_key?: string;
        assumed?: number;
        publish_status?: "draft" | "pending" | "published" | "rejected";
        page?: number;
        page_size?: number;
        order_by?: "name" | "-name" | "created_at" | "-created_at" | "updated_at" | "-updated_at";
      },
      params?: RequestParams
    ) =>
      this.request<
        ModelSearchOutcomeResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse
      >(`/learning_outcomes${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags learning_outcomes
     * @name createLearningOutcomes
     * @summary createLearningOutcome
     * @request POST:/learning_outcomes
     * @description Create learning outcomes
     */
    createLearningOutcomes: (outcome: ModelOutcomeCreateView, params?: RequestParams) =>
      this.request<ModelOutcomeCreateResponse, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/learning_outcomes`,
        "POST",
        params,
        outcome
      ),

    /**
     * @tags learning_outcomes
     * @name getLearningOutcomesById
     * @summary getLearningOutcome
     * @request GET:/learning_outcomes/{outcome_id}
     * @description learning outcomes info
     */
    getLearningOutcomesById: (outcome_id: string, params?: RequestParams) =>
      this.request<ModelOutcomeDetailView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/learning_outcomes/${outcome_id}`,
        "GET",
        params
      ),

    /**
     * @tags learning_outcomes
     * @name updateLearningOutcomes
     * @summary update learning outcome
     * @request PUT:/learning_outcomes/{outcome_id}
     * @description update learning outcomes by id
     */
    updateLearningOutcomes: (outcome_id: string, outcome: ModelOutcomeCreateView, params?: RequestParams) =>
      this.request<
        string,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiConflictResponse | ApiInternalServerErrorResponse
      >(`/learning_outcomes/${outcome_id}`, "PUT", params, outcome),

    /**
     * @tags learning_outcomes
     * @name deleteLearningOutcome
     * @summary delete learning outcome
     * @request DELETE:/learning_outcomes/{outcome_id}
     * @description delete learning outcomes by id
     */
    deleteLearningOutcome: (outcome_id: string, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/learning_outcomes/${outcome_id}`,
        "DELETE",
        params
      ),

    /**
     * @tags learning_outcomes
     * @name approveLearningOutcomes
     * @summary approve learning outcome
     * @request PUT:/learning_outcomes/{outcome_id}/approve
     * @description approve learning outcomes
     */
    approveLearningOutcomes: (outcome_id: string, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/learning_outcomes/${outcome_id}/approve`,
        "PUT",
        params
      ),

    /**
     * @tags learning_outcomes
     * @name lockLearningOutcomes
     * @summary lock learning outcome
     * @request PUT:/learning_outcomes/{outcome_id}/lock
     * @description edit published learning outcomes
     */
    lockLearningOutcomes: (outcome_id: string, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/learning_outcomes/${outcome_id}/lock`,
        "PUT",
        params
      ),

    /**
     * @tags learning_outcomes
     * @name publishLearningOutcomes
     * @summary publish learning outcome
     * @request PUT:/learning_outcomes/{outcome_id}/publish
     * @description submit publish learning outcomes
     */
    publishLearningOutcomes: (outcome_id: string, PublishOutcomeRequest: ModelPublishOutcomeReq, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/learning_outcomes/${outcome_id}/publish`,
        "PUT",
        params,
        PublishOutcomeRequest
      ),

    /**
     * @tags learning_outcomes
     * @name rejectLearningOutcomes
     * @summary reject learning outcome
     * @request PUT:/learning_outcomes/{outcome_id}/reject
     * @description reject learning outcomes
     */
    rejectLearningOutcomes: (outcome_id: string, OutcomeRejectReq: ModelOutcomeRejectReq, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/learning_outcomes/${outcome_id}/reject`,
        "PUT",
        params,
        OutcomeRejectReq
      ),
  };
  lessonTypes = {
    /**
     * @tags lessonType
     * @name getLessonType
     * @summary getLessonType
     * @request GET:/lesson_types
     * @description get lessonType
     */
    getLessonType: (params?: RequestParams) =>
      this.request<EntityLessonType[], ApiInternalServerErrorResponse>(`/lesson_types`, "GET", params),

    /**
     * @tags lessonType
     * @name getLessonTypeByID
     * @summary getLessonTypeByID
     * @request GET:/lesson_types/{id}
     * @description get lessonType by id
     */
    getLessonTypeById: (id: string, params?: RequestParams) =>
      this.request<EntityLessonType, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/lesson_types/${id}`, "GET", params),
  };
  milestones = {
    /**
     * @tags milestone
     * @name searchMilestone
     * @summary search milestone
     * @request GET:/milestones
     * @description search milestone
     */
    searchMilestone: (
      query?: {
        search_key?: string;
        name?: string;
        description?: string;
        shortcode?: string;
        status?: "draft" | "pending" | "published" | "rejected";
        author_id?: string;
        page?: number;
        page_size?: number;
        order_by?: "name" | "-name" | "created_at" | "-created_at" | "updated_at" | "-updated_at";
      },
      params?: RequestParams
    ) =>
      this.request<ModelSearchMilestoneResponse, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/milestones${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags milestone
     * @name createMilestone
     * @summary create milestone
     * @request POST:/milestones
     * @description Create milestone
     */
    createMilestone: (milestone: ModelCreateMilestoneView, params?: RequestParams) =>
      this.request<ModelMilestoneView, ApiBadRequestResponse | ApiForbiddenResponse | ApiConflictResponse | ApiInternalServerErrorResponse>(
        `/milestones`,
        "POST",
        params,
        milestone
      ),

    /**
     * @tags milestone
     * @name deleteMilestone
     * @summary delete milestone
     * @request DELETE:/milestones
     * @description delete milestone
     */
    deleteMilestone: (milestones: ModelMilestoneList, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/milestones`,
        "DELETE",
        params,
        milestones
      ),

    /**
     * @tags milestone
     * @name obtainMilestone
     * @summary get milestone by id
     * @request GET:/milestones/{milestone_id}
     * @description milestone info
     */
    obtainMilestone: (milestone_id: string, params?: RequestParams) =>
      this.request<ModelMilestoneDetailView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/milestones/${milestone_id}`,
        "GET",
        params
      ),

    /**
     * @tags milestone
     * @name updateMilestone
     * @summary update milestone
     * @request PUT:/milestones/{milestone_id}
     * @description update milestone info
     */
    updateMilestone: (milestone_id: string, milestone: ModelCreateMilestoneView, params?: RequestParams) =>
      this.request<
        string,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiConflictResponse | ApiInternalServerErrorResponse
      >(`/milestones/${milestone_id}`, "PUT", params, milestone),

    /**
     * @tags milestone
     * @name occupyMilestone
     * @summary lock milestone
     * @request PUT:/milestones/{milestone_id}/occupy
     * @description occupy before edit
     */
    occupyMilestone: (milestone_id: string, params?: RequestParams) =>
      this.request<
        string,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiConflictResponse | ApiInternalServerErrorResponse
      >(`/milestones/${milestone_id}/occupy`, "PUT", params),
  };
  organizationPermissions = {
    /**
     * @tags permission
     * @name hasOrganizationPermissions
     * @summary hasOrganizationPermissions
     * @request POST:/organization_permissions
     * @description has organization permission
     */
    hasOrganizationPermissions: (PermissionNames: ApiHasPermissionRequest, params?: RequestParams) =>
      this.request<ApiHasPermissionResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/organization_permissions`,
        "POST",
        params,
        PermissionNames
      ),
  };
  organizationsPropertys = {
    /**
     * @tags organizationProperty
     * @name getOrganizationPropertyByID
     * @summary getOrganizationPropertyByID
     * @request GET:/organizations_propertys/{id}
     * @description get organization property by id
     */
    getOrganizationPropertyById: (id: string, params?: RequestParams) =>
      this.request<EntityOrganizationProperty, ApiInternalServerErrorResponse>(`/organizations_propertys/${id}`, "GET", params),
  };
  organizationsRegion = {
    /**
     * @tags organizationProperty
     * @name getOrganizationByHeadquarterForDetails
     * @summary getOrganizationByHeadquarterForDetails
     * @request GET:/organizations_region
     * @description get organization region by user org
     */
    getOrganizationByHeadquarterForDetails: (params?: RequestParams) =>
      this.request<ApiOrganizationRegionInfoResponse, ApiInternalServerErrorResponse>(`/organizations_region`, "GET", params),
  };
  pendingLearningOutcomes = {
    /**
     * @tags learning_outcomes
     * @name searchPendingLearningOutcomes
     * @summary search pending learning outcome
     * @request GET:/pending_learning_outcomes
     * @description search pending learning outcomes
     */
    searchPendingLearningOutcomes: (
      query?: {
        outcome_name?: string;
        description?: string;
        keywords?: string;
        shortcode?: string;
        author_name?: string;
        search_key?: string;
        assumed?: number;
        publish_status?: "draft" | "pending" | "published" | "rejected";
        page?: number;
        page_size?: number;
        order_by?: "name" | "-name" | "created_at" | "-created_at" | "updated_at" | "-updated_at";
      },
      params?: RequestParams
    ) =>
      this.request<ModelSearchOutcomeResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/pending_learning_outcomes${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  pendingMilestones = {
    /**
     * @tags milestone
     * @name searchPendingMilestone
     * @summary search pending milestone
     * @request GET:/pending_milestones
     * @description search pending milestone
     */
    searchPendingMilestone: (
      query?: {
        search_key?: string;
        name?: string;
        description?: string;
        shortcode?: string;
        status?: "draft" | "pending" | "published" | "rejected";
        author_id?: string;
        page?: number;
        page_size?: number;
        order_by?: "name" | "-name" | "created_at" | "-created_at" | "updated_at" | "-updated_at";
      },
      params?: RequestParams
    ) =>
      this.request<ModelSearchMilestoneResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/pending_milestones${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  ping = {
    /**
     * @tags common
     * @name ping
     * @summary Ping
     * @request GET:/ping
     * @description Ping and test service
     */
    ping: (params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/ping`, "GET", params),
  };
  privateLearningOutcomes = {
    /**
     * @tags learning_outcomes
     * @name searchPrivateLearningOutcomes
     * @summary search private learning outcome
     * @request GET:/private_learning_outcomes
     * @description search private learning outcomes
     */
    searchPrivateLearningOutcomes: (
      query?: {
        outcome_name?: string;
        description?: string;
        keywords?: string;
        shortcode?: string;
        author_name?: string;
        search_key?: string;
        assumed?: number;
        publish_status?: "draft" | "pending" | "published" | "rejected";
        page?: number;
        page_size?: number;
        order_by?: "name" | "-name" | "created_at" | "-created_at" | "updated_at" | "-updated_at";
      },
      params?: RequestParams
    ) =>
      this.request<ModelSearchOutcomeResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/private_learning_outcomes${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  privateMilestones = {
    /**
     * @tags milestone
     * @name searchPrivateMilestone
     * @summary search private milestone
     * @request GET:/private_milestones
     * @description search private milestone
     */
    searchPrivateMilestone: (
      query?: {
        search_key?: string;
        name?: string;
        description?: string;
        shortcode?: string;
        status?: "draft" | "pending" | "published" | "rejected";
        author_id?: string;
        page?: number;
        page_size?: number;
        order_by?: "name" | "-name" | "created_at" | "-created_at" | "updated_at" | "-updated_at";
      },
      params?: RequestParams
    ) =>
      this.request<ModelSearchMilestoneResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/private_milestones${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  programs = {
    /**
     * @tags program
     * @name getProgram
     * @summary getProgram
     * @request GET:/programs
     * @description get program
     */
    getProgram: (params?: RequestParams) => this.request<ExternalProgram[], ApiInternalServerErrorResponse>(`/programs`, "GET", params),
  };
  programsGroups = {
    /**
     * @tags program
     * @name getProgramGroup
     * @summary getProgramGroup
     * @request GET:/programs_groups
     * @description get program groups
     */
    getProgramGroup: (params?: RequestParams) => this.request<string[], ApiInternalServerErrorResponse>(`/programs_groups`, "GET", params),
  };
  publishedLearningOutcomes = {
    /**
     * @tags learning_outcomes
     * @name searchPublishedLearningOutcomes
     * @summary search published learning outcome
     * @request POST:/published_learning_outcomes
     * @description search published learning outcome with outcome sets
     */
    searchPublishedLearningOutcomes: (order_by: EntityOutcomeCondition, params?: RequestParams) =>
      this.request<
        ModelSearchPublishedOutcomeResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse
      >(`/published_learning_outcomes`, "POST", params, order_by),
  };
  reports = {
    /**
     * @tags reports/learningSummary
     * @name queryAssignmentsSummary
     * @summary query live classes summary
     * @request GET:/reports/learning_summary/assignments
     * @description query live classes summary
     */
    queryAssignmentsSummary: (
      query?: {
        year?: number;
        week_start?: number;
        week_end?: number;
        school_id?: string;
        class_id?: string;
        teacher_id?: string;
        student_id?: string;
        subject_id?: string;
      },
      params?: RequestParams
    ) =>
      this.request<EntityQueryAssignmentsSummaryResult, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/learning_summary/assignments${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reports/learningSummary
     * @name queryLiveClassesSummary
     * @summary query live classes summary
     * @request GET:/reports/learning_summary/live_classes
     * @description query live classes summary
     */
    queryLiveClassesSummary: (
      query?: {
        year?: number;
        week_start?: number;
        week_end?: number;
        school_id?: string;
        class_id?: string;
        teacher_id?: string;
        student_id?: string;
        subject_id?: string;
      },
      params?: RequestParams
    ) =>
      this.request<EntityQueryLiveClassesSummaryResult, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/learning_summary/live_classes${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reports/learningSummary
     * @name queryLearningSummaryTimeFilter
     * @summary query learning summary time filter
     * @request GET:/reports/learning_summary/time_filter
     * @description query learning summary time filter
     */
    queryLearningSummaryTimeFilter: (
      query: {
        time_offset: number;
        summary_type: "live_class" | "assignment";
        school_ids?: string;
        teacher_id?: string;
        student_id?: string;
      },
      params?: RequestParams
    ) =>
      this.request<EntityLearningSummaryFilterYear[], ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/learning_summary/time_filter${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reports
     * @name listStudentsPerformanceReport
     * @summary list student performance report
     * @request GET:/reports/performance/students
     * @description list student performance report
     */
    listStudentsPerformanceReport: (query: { teacher_id: string; class_id: string; lesson_plan_id: string }, params?: RequestParams) =>
      this.request<
        EntityListStudentsPerformanceReportResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse
      >(`/reports/performance/students${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags reports
     * @name getStudentPerformanceReport
     * @summary get student performance report
     * @request GET:/reports/performance/students/{id}
     * @description get student performance report
     */
    getStudentPerformanceReport: (
      id: string,
      query: { teacher_id: string; class_id: string; lesson_plan_id: string },
      params?: RequestParams
    ) =>
      this.request<
        EntityGetStudentPerformanceReportResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse
      >(`/reports/performance/students/${id}${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags reports/studentProgress
     * @name getAssignmentsCompletion
     * @summary getAssignmentsCompletion
     * @request POST:/reports/student_progress/assignment_completion
     */
    getAssignmentsCompletion: (request: EntityAssignmentRequest, params?: RequestParams) =>
      this.request<EntityAssignmentCompletionRate[], ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/student_progress/assignment_completion`,
        "POST",
        params,
        request
      ),

    /**
     * @tags reports/studentProgress
     * @name getLearnOutcomeClassAttendance
     * @summary getClassAttendance
     * @request POST:/reports/student_progress/class_attendance
     */
    getLearnOutcomeClassAttendance: (request: EntityClassAttendanceRequest, params?: RequestParams) =>
      this.request<EntityClassAttendanceResponse, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/student_progress/class_attendance`,
        "POST",
        params,
        request
      ),

    /**
     * @tags reports/studentProgress
     * @name getLearnOutcomeAchievement
     * @summary getLearnOutcomeAchievement
     * @request POST:/reports/student_progress/learn_outcome_achievement
     */
    getLearnOutcomeAchievement: (request: EntityLearnOutcomeAchievementRequest, params?: RequestParams) =>
      this.request<EntityLearnOutcomeAchievementResponse, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/student_progress/learn_outcome_achievement`,
        "POST",
        params,
        request
      ),

    /**
     * @tags reports/studentUsage
     * @name getStudentUsageClassRegistrationReport
     * @summary get student usage of class registration report
     * @request GET:/reports/student_usage/class_registration
     * @description get student usage of class registration report
     */
    getStudentUsageClassRegistrationReport: (
      query: { organization_id: string; class_id_list?: string[]; time_range_list?: string[] },
      params?: RequestParams
    ) =>
      this.request<EntityStudentUsageRegistration[], ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/reports/student_usage/class_registration${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reports/studentUsage
     * @name getClassesAssignments
     * @summary get Classes&Assignments Report
     * @request POST:/reports/student_usage/classes_assignments
     * @description get Classes&Assignments Report
     */
    getClassesAssignments: (classes_assignments: EntityClassesAssignmentsViewRequest, params?: RequestParams) =>
      this.request<EntityClassesAssignmentsView[], ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/student_usage/classes_assignments`,
        "POST",
        params,
        classes_assignments
      ),

    /**
     * @tags reports/studentUsage
     * @name getClassesAssignmentsUnattended
     * @summary get Classes&Assignments Report
     * @request POST:/reports/student_usage/classes_assignments/{class_id}/unattended
     * @description get Classes&Assignments unattended
     */
    getClassesAssignmentsUnattended: (
      class_id: string,
      unattended: EntityClassesAssignmentsUnattendedViewRequest,
      params?: RequestParams
    ) =>
      this.request<
        EntityClassesAssignmentsUnattendedStudentsView[],
        ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse
      >(`/reports/student_usage/classes_assignments/${class_id}/unattended`, "POST", params, unattended),

    /**
     * @tags reports/studentUsage
     * @name getClassesAssignmentsOverview
     * @summary get Classes&Assignments Report
     * @request POST:/reports/student_usage/classes_assignments_overview
     * @description get Classes&Assignments overview
     */
    getClassesAssignmentsOverview: (overview: EntityClassesAssignmentOverViewRequest, params?: RequestParams) =>
      this.request<EntityClassesAssignmentOverView[], ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/student_usage/classes_assignments_overview`,
        "POST",
        params,
        overview
      ),

    /**
     * @tags reports/studentUsage
     * @name getStudentUsageMaterialReport
     * @summary get student usage of material report
     * @request POST:/reports/student_usage/material
     * @description get student usage of material report
     */
    getStudentUsageMaterialReport: (request: EntityStudentUsageMaterialReportRequest, params?: RequestParams) =>
      this.request<EntityStudentUsageMaterialReportResponse, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/student_usage/material`,
        "POST",
        params,
        request
      ),

    /**
     * @tags reports/studentUsage
     * @name getStudentUsageMaterialViewCountReport
     * @summary get student usage of material report
     * @request POST:/reports/student_usage/material_view_count
     * @description get student usage of material report
     */
    getStudentUsageMaterialViewCountReport: (request: EntityStudentUsageMaterialViewCountReportRequest, params?: RequestParams) =>
      this.request<
        EntityStudentUsageMaterialViewCountReportResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse
      >(`/reports/student_usage/material_view_count`, "POST", params, request),

    /**
     * @tags reports/studentUsage
     * @name getStudentUsageOrganizationRegistrationReport
     * @summary get student usage of organization registration report
     * @request GET:/reports/student_usage/organization_registration
     * @description get student usage of organization registration report
     */
    getStudentUsageOrganizationRegistrationReport: (query: { organization_id: string }, params?: RequestParams) =>
      this.request<EntityStudentUsageRegistration, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/reports/student_usage/organization_registration${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reports
     * @name listStudentsAchievementReport
     * @summary list student report
     * @request GET:/reports/students
     * @description list student report
     */
    listStudentsAchievementReport: (
      query: {
        teacher_id: string;
        class_id: string;
        lesson_plan_id: string;
        status?: "all" | "achieved" | "not_achieved" | "not_attempted";
        sort_by?: "desc" | "asc";
      },
      params?: RequestParams
    ) =>
      this.request<EntityStudentsAchievementReportResponse, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/students${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reports
     * @name getStudentAchievementReport
     * @summary get student report
     * @request GET:/reports/students/{id}
     * @description get student report
     */
    getStudentAchievementReport: (
      id: string,
      query: { teacher_id: string; class_id: string; lesson_plan_id: string },
      params?: RequestParams
    ) =>
      this.request<
        EntityStudentAchievementReportResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse
      >(`/reports/students/${id}${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags reports/teacherLoad
     * @name getTeacherLoadReportOfAssignment
     * @summary list teaching load report
     * @request POST:/reports/teacher_load/assignments
     * @description list teaching load report
     */
    getTeacherLoadReportOfAssignment: (request: EntityTeacherLoadAssignmentRequest, params?: RequestParams) =>
      this.request<
        EntityTeacherLoadAssignmentResponseItem[],
        ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse
      >(`/reports/teacher_load/assignments`, "POST", params, request),

    /**
     * @tags reports/teacherLoad
     * @name listTeacherLoadLessons
     * @summary get teacher load Report
     * @request POST:/reports/teacher_load/lessons_list
     * @description teacher load list
     */
    listTeacherLoadLessons: (overview: EntityTeacherLoadLessonRequest, params?: RequestParams) =>
      this.request<EntityTeacherLoadLesson[], ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/teacher_load/lessons_list`,
        "POST",
        params,
        overview
      ),

    /**
     * @tags reports/teacherLoad
     * @name summaryTeacherLoadLessons
     * @summary get teacher load Report
     * @request POST:/reports/teacher_load/lessons_summary
     * @description teacher load summary
     */
    summaryTeacherLoadLessons: (overview: EntityTeacherLoadLessonRequest, params?: RequestParams) =>
      this.request<EntityTeacherLoadLessonSummary, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/teacher_load/lessons_summary`,
        "POST",
        params,
        overview
      ),

    /**
     * @tags reports/teacherLoad
     * @name listTeacherMissedLessons
     * @summary get teacher missed lessons
     * @request POST:/reports/teacher_load/missed_lessons
     * @description teacher missed lessons
     */
    listTeacherMissedLessons: (overview: EntityTeacherLoadMissedLessonsRequest, params?: RequestParams) =>
      this.request<EntityTeacherLoadMissedLessonsResponse, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/teacher_load/missed_lessons`,
        "POST",
        params,
        overview
      ),

    /**
     * @tags reports
     * @name getTeacherReport
     * @summary get teacher report
     * @request GET:/reports/teachers/{id}
     * @description get teacher report
     */
    getTeacherReport: (id: string, params?: RequestParams) =>
      this.request<
        EntityTeacherReport,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse
      >(`/reports/teachers/${id}`, "GET", params),

    /**
     * @tags reports
     * @name listTeachingLoadReport
     * @summary list teaching load report
     * @request POST:/reports/teaching_loading
     * @description list teaching load report
     */
    listTeachingLoadReport: (teaching_load: EntityReportListTeachingLoadArgs, params?: RequestParams) =>
      this.request<EntityReportListTeachingLoadResult, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/teaching_loading`,
        "POST",
        params,
        teaching_load
      ),
  };
  schedules = {
    /**
     * @tags schedule
     * @name querySchedule
     * @summary querySchedule
     * @request GET:/schedules
     * @description query schedule
     */
    querySchedule: (
      query: {
        teacher_name?: string;
        time_zone_offset: number;
        start_at?: number;
        order_by?: "create_at" | "-create_at" | "start_at" | "-start_at" | "schedule_at";
        page?: number;
        page_size?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntitySchedulePageView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags schedule
     * @name addSchedule
     * @summary addSchedule
     * @request POST:/schedules
     * @description add a schedule data
     */
    addSchedule: (scheduleData: EntityScheduleAddView, params?: RequestParams) =>
      this.request<
        ApiSuccessRequestResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiConflictResponse | ApiInternalServerErrorResponse
      >(`/schedules`, "POST", params, scheduleData),

    /**
     * @tags schedule
     * @name getScheduleByID
     * @summary getScheduleByID
     * @request GET:/schedules/{schedule_id}
     * @description get schedule by id, excluding deleted
     */
    getScheduleById: (schedule_id: string, params?: RequestParams) =>
      this.request<EntityScheduleDetailsView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules/${schedule_id}`,
        "GET",
        params
      ),

    /**
     * @tags schedule
     * @name updateSchedule
     * @summary updateSchedule
     * @request PUT:/schedules/{schedule_id}
     * @description update a schedule data
     */
    updateSchedule: (schedule_id: string, scheduleData: EntityScheduleUpdateView, params?: RequestParams) =>
      this.request<
        ApiSuccessRequestResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiConflictResponse | ApiInternalServerErrorResponse
      >(`/schedules/${schedule_id}`, "PUT", params, scheduleData),

    /**
     * @tags schedule
     * @name deleteSchedule
     * @summary deleteSchedule
     * @request DELETE:/schedules/{schedule_id}
     * @description delete a schedule data
     */
    deleteSchedule: (schedule_id: string, query: { repeat_edit_options: "only_current" | "with_following" }, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules/${schedule_id}${this.addQueryParams(query)}`,
        "DELETE",
        params
      ),

    /**
     * @tags schedule
     * @name getScheduleLiveToken
     * @summary getScheduleLiveToken
     * @request GET:/schedules/{schedule_id}/live/token
     * @description get schedule live token
     */
    getScheduleLiveToken: (schedule_id: string, query: { live_token_type: "preview" | "live" }, params?: RequestParams) =>
      this.request<EntityLiveTokenView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules/${schedule_id}/live/token${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags schedule
     * @name getScheduleNewestFeedbackByOperator
     * @summary getScheduleNewestFeedbackByOperator
     * @request GET:/schedules/{schedule_id}/operator/newest_feedback
     * @description get schedule newest feedback by operator
     */
    getScheduleNewestFeedbackByOperator: (schedule_id: string, params?: RequestParams) =>
      this.request<EntityScheduleFeedbackView, ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules/${schedule_id}/operator/newest_feedback`,
        "GET",
        params
      ),

    /**
     * @tags schedule
     * @name updateScheduleShowOption
     * @summary updateScheduleShowOption
     * @request PUT:/schedules/{schedule_id}/show_option
     * @description update schedule show option
     */
    updateScheduleShowOption: (schedule_id: string, query?: { show_option?: "hidden" | "visible" }, params?: RequestParams) =>
      this.request<ApiIDResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules/${schedule_id}/show_option${this.addQueryParams(query)}`,
        "PUT",
        params
      ),

    /**
     * @tags schedule
     * @name updateStatus
     * @summary updateStatus
     * @request PUT:/schedules/{schedule_id}/status
     * @description update schedule status
     */
    updateStatus: (schedule_id: string, query: { status: "NotStart" | "Started" | "Closed" }, params?: RequestParams) =>
      this.request<ApiIDResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules/${schedule_id}/status${this.addQueryParams(query)}`,
        "PUT",
        params
      ),
  };
  schedulesFeedbacks = {
    /**
     * @tags scheduleFeedback
     * @name queryFeedback
     * @summary queryFeedback
     * @request GET:/schedules_feedbacks
     * @description query feedback list
     */
    queryFeedback: (query?: { schedule_id?: string; user_id?: string }, params?: RequestParams) =>
      this.request<EntityScheduleFeedbackView[], ApiInternalServerErrorResponse>(
        `/schedules_feedbacks${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags scheduleFeedback
     * @name addScheduleFeedback
     * @summary addScheduleFeedback
     * @request POST:/schedules_feedbacks
     * @description add ScheduleFeedback
     */
    addScheduleFeedback: (feedback: EntityScheduleFeedbackAddInput, params?: RequestParams) =>
      this.request<ApiSuccessRequestResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules_feedbacks`,
        "POST",
        params,
        feedback
      ),
  };
  schedulesFilter = {
    /**
     * @tags schedule
     * @name getScheduleFilterClasses
     * @summary get schedule filter classes
     * @request GET:/schedules_filter/classes
     * @description get schedule filter classes
     */
    getScheduleFilterClasses: (query?: { school_id?: string }, params?: RequestParams) =>
      this.request<EntityScheduleFilterClass[], ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/schedules_filter/classes${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags schedule
     * @name getProgramsInScheduleFilter
     * @summary get schedule filter programs
     * @request GET:/schedules_filter/programs
     * @description get schedule filter programs
     */
    getProgramsInScheduleFilter: (params?: RequestParams) =>
      this.request<EntityScheduleShortInfo[], ApiInternalServerErrorResponse>(`/schedules_filter/programs`, "GET", params),

    /**
     * @tags schedule
     * @name getScheduleFilterSchool
     * @summary get schedule filter schools
     * @request GET:/schedules_filter/schools
     * @description get get schedule filter schools
     */
    getScheduleFilterSchool: (params?: RequestParams) =>
      this.request<EntityScheduleFilterSchool[], ApiInternalServerErrorResponse>(`/schedules_filter/schools`, "GET", params),

    /**
     * @tags schedule
     * @name getSubjectsInScheduleFilter
     * @summary get schedule filter subjects
     * @request GET:/schedules_filter/subjects
     * @description get schedule filter subjects
     */
    getSubjectsInScheduleFilter: (query: { program_id: string }, params?: RequestParams) =>
      this.request<EntityScheduleShortInfo[], ApiInternalServerErrorResponse>(
        `/schedules_filter/subjects${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  schedulesLessonPlans = {
    /**
     * @tags schedule
     * @name getLessonPlans
     * @summary get lessonPlans by teacher and class
     * @request GET:/schedules_lesson_plans
     * @description get lessonPlans by teacher and class
     */
    getLessonPlans: (query: { teacher_id: string; class_id: string }, params?: RequestParams) =>
      this.request<EntityScheduleShortInfo[], ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules_lesson_plans${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
  schedulesTimeView = {
    /**
     * @tags schedule
     * @name getScheduleTimeView
     * @summary getScheduleTimeView
     * @request GET:/schedules_time_view
     * @description get schedule time view
     */
    getScheduleTimeView: (
      query: {
        view_type: "day" | "work_week" | "week" | "month" | "year" | "full_view";
        time_at?: number;
        time_zone_offset?: number;
        school_ids?: string;
        teacher_ids?: string;
        class_ids?: string;
        subject_ids?: string;
        program_ids?: string;
        class_types?: string;
        due_at_eq?: number;
        start_at_ge?: number;
        end_at_le?: number;
        filter_option?: "any_time" | "only_mine";
        order_by?: "create_at" | "-create_at" | "start_at" | "-start_at";
      },
      params?: RequestParams
    ) =>
      this.request<EntityScheduleListView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules_time_view${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags schedule
     * @name postScheduleTimeView
     * @summary postScheduleTimeView
     * @request POST:/schedules_time_view
     * @description post schedule time view
     */
    postScheduleTimeView: (queryData: EntityScheduleTimeViewQuery, params?: RequestParams) =>
      this.request<EntityScheduleListView, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/schedules_time_view`,
        "POST",
        params,
        queryData
      ),

    /**
     * @tags schedule
     * @name getScheduledDates
     * @summary getScheduledDates
     * @request GET:/schedules_time_view/dates
     * @description get schedules dates(format:2006-01-02)
     */
    getScheduledDates: (
      query: {
        view_type: "day" | "work_week" | "week" | "month" | "year";
        time_at: number;
        time_zone_offset: number;
        school_ids?: string;
        teacher_ids?: string;
        class_ids?: string;
        subject_ids?: string;
        program_ids?: string;
      },
      params?: RequestParams
    ) =>
      this.request<string[], ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/schedules_time_view/dates${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags schedule
     * @name postScheduledDates
     * @summary postScheduledDates
     * @request POST:/schedules_time_view/dates
     * @description get schedules dates(format:2006-01-02)
     */
    postScheduledDates: (queryData: EntityScheduleTimeViewQuery, params?: RequestParams) =>
      this.request<string[], ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/schedules_time_view/dates`,
        "POST",
        params,
        queryData
      ),

    /**
     * @tags schedule
     * @name getScheduleTimeViewList
     * @summary getScheduleTimeViewList
     * @request POST:/schedules_time_view/list
     * @description get schedule time view list without relation info
     */
    getScheduleTimeViewList: (queryData: EntityScheduleTimeViewListRequest, params?: RequestParams) =>
      this.request<EntityScheduleTimeViewListResponse, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/schedules_time_view/list`,
        "POST",
        params,
        queryData
      ),
  };
  schedulesView = {
    /**
     * @tags schedule
     * @name getSchedulePopupByID
     * @summary getSchedulePopupByID
     * @request GET:/schedules_view/{schedule_id}
     * @description get schedule popup info by id
     */
    getSchedulePopupById: (schedule_id: string, params?: RequestParams) =>
      this.request<EntityScheduleViewDetail, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules_view/${schedule_id}`,
        "GET",
        params
      ),
  };
  sets = {
    /**
     * @tags outcome_set
     * @name pullOutcomeSet
     * @summary getOutcomeSet
     * @request GET:/sets
     * @description outcome_set info
     */
    pullOutcomeSet: (
      query: {
        set_name: string;
        page?: number;
        page_size?: number;
        order_by?: "name" | "-name" | "created_at" | "-created_at" | "updated_at" | "-updated_at";
      },
      params?: RequestParams
    ) =>
      this.request<ApiPullOutcomeSetResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/sets${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags outcome_set
     * @name createOutcomeSet
     * @summary createOutcomeSet
     * @request POST:/sets
     * @description Create learning outcome sets
     */
    createOutcomeSet: (outcome: ModelOutcomeSetCreateView, params?: RequestParams) =>
      this.request<
        ModelOutcomeSetCreateView,
        ApiBadRequestResponse | ApiUnAuthorizedResponse | ApiForbiddenResponse | ApiConflictResponse | ApiInternalServerErrorResponse
      >(`/sets`, "POST", params, outcome),

    /**
     * @tags outcome_set
     * @name bulkBindOutcomeSet
     * @summary bind learning outcome set
     * @request POST:/sets/bulk_bind
     * @description bulk bind learning outcome
     */
    bulkBindOutcomeSet: (outcome: ApiBulkBindOutcomeSetRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/sets/bulk_bind`,
        "POST",
        params,
        outcome
      ),
  };
  shortcode = {
    /**
     * @tags shortcode
     * @name generateShortcode
     * @summary generate Shortcode
     * @request POST:/shortcode
     * @description generate shortcode
     */
    generateShortcode: (kind: ApiShortcodeRequest, params?: RequestParams) =>
      this.request<
        ApiShortcodeResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiConflictResponse | ApiInternalServerErrorResponse
      >(`/shortcode`, "POST", params, kind),
  };
  skills = {
    /**
     * @tags skill
     * @name getSkill
     * @summary getSkill
     * @request GET:/skills
     * @description get skill
     */
    getSkill: (query?: { program_id?: string; developmental_id?: string }, params?: RequestParams) =>
      this.request<ExternalSubCategory[], ApiInternalServerErrorResponse>(`/skills${this.addQueryParams(query)}`, "GET", params),
  };
  studentUsageRecord = {
    /**
     * @tags usageRecord
     * @name studentUsageRecord
     * @summary student usage record
     * @request POST:/student_usage_record/event
     * @description student usage record
     */
    studentUsageRecord: (milestone: EntityJwtToken, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/student_usage_record/event`,
        "POST",
        params,
        milestone
      ),
  };
  studyAssessments = {
    /**
     * @tags studyAssessments
     * @name listStudyAssessments
     * @summary list study assessments
     * @request GET:/study_assessments
     * @description list study assessments
     */
    listStudyAssessments: (
      query?: {
        query?: string;
        query_type?: "all" | "class_name" | "teacher_name";
        status?: "all" | "in_progress" | "complete";
        order_by?: "create_at" | "-create_at" | "complete_time" | "-complete_time";
        page?: number;
        page_size?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityListStudyAssessmentsResult, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/study_assessments${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags studyAssessments
     * @name getStudyAssessmentDetail
     * @summary get study assessment detail
     * @request GET:/study_assessments/{id}
     * @description get study assessment detail
     */
    getStudyAssessmentDetail: (id: string, params?: RequestParams) =>
      this.request<
        EntityAssessmentDetail,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse
      >(`/study_assessments/${id}`, "GET", params),

    /**
     * @tags studyAssessments
     * @name updateStudyAssessment
     * @request PUT:/study_assessments/{id}
     * @description update study assessment
     */
    updateStudyAssessment: (id: string, update_assessment_args: EntityUpdateAssessmentArgs, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/study_assessments/${id}`,
        "PUT",
        params,
        update_assessment_args
      ),
  };
  subjects = {
    /**
     * @tags subject
     * @name getSubject
     * @summary getSubject
     * @request GET:/subjects
     * @description get subjects
     */
    getSubject: (query?: { program_id?: string }, params?: RequestParams) =>
      this.request<ExternalSubject[], ApiInternalServerErrorResponse>(`/subjects${this.addQueryParams(query)}`, "GET", params),
  };
  userSettings = {
    /**
     * @tags userSetting
     * @name getUserSettingByOperator
     * @summary getUserSettingByOperator
     * @request GET:/user_settings
     * @description get user setting by user id
     */
    getUserSettingByOperator: (params?: RequestParams) =>
      this.request<EntityUserSettingJsonContent, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/user_settings`, "GET", params),

    /**
     * @tags userSetting
     * @name setUserSetting
     * @summary setUserSetting
     * @request POST:/user_settings
     * @description set user setting
     */
    setUserSetting: (userSetting: EntityUserSettingJsonContent, params?: RequestParams) =>
      this.request<ApiIDResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/user_settings`, "POST", params, userSetting),
  };
  users = {
    /**
     * @tags user
     * @name checkAccount
     * @summary checkAccount
     * @request GET:/users/check_account
     * @description check account register
     */
    checkAccount: (query: { account: string }, params?: RequestParams) =>
      this.request<ApiCheckAccountResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/users/check_account${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags user
     * @name forgottenPassword
     * @summary forget password
     * @request POST:/users/forgotten_pwd
     * @description forget password
     */
    forgottenPassword: (outcome: ApiForgottenPasswordRequest, params?: RequestParams) =>
      this.request<any, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/users/forgotten_pwd`, "POST", params, outcome),

    /**
     * @tags user
     * @name userLogin
     * @summary login
     * @request POST:/users/login
     * @description user login
     */
    userLogin: (outcome: ApiLoginRequest, params?: RequestParams) =>
      this.request<ApiLoginResponse, ApiBadRequestResponse | ApiUnAuthorizedResponse | ApiInternalServerErrorResponse>(
        `/users/login`,
        "POST",
        params,
        outcome
      ),

    /**
     * @tags user
     * @name userRegister
     * @summary register
     * @request POST:/users/register
     * @description user register
     */
    userRegister: (outcome: ApiRegisterRequest, params?: RequestParams) =>
      this.request<
        ApiLoginResponse,
        ApiBadRequestResponse | ApiUnAuthorizedResponse | ApiConflictResponse | ApiInternalServerErrorResponse
      >(`/users/register`, "POST", params, outcome),

    /**
     * @tags user
     * @name resetPassword
     * @summary reset password
     * @request POST:/users/reset_password
     * @description reset password after login
     */
    resetPassword: (outcome: ApiResetPasswordRequest, params?: RequestParams) =>
      this.request<any, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/users/reset_password`, "POST", params, outcome),

    /**
     * @tags user
     * @name inviteNotify
     * @summary invite notify
     * @request POST:/users/send_code
     * @description send verify code or uri
     */
    inviteNotify: (outcome: ApiSendCodeRequest, params?: RequestParams) =>
      this.request<any, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/users/send_code`, "POST", params, outcome),
  };
  visibilitySettings = {
    /**
     * @tags visibilitySetting
     * @name getVisibilitySetting
     * @summary getVisibilitySetting
     * @request GET:/visibility_settings
     * @description get visibilitySetting
     */
    getVisibilitySetting: (query: { content_type: string }, params?: RequestParams) =>
      this.request<EntityVisibilitySetting[], ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/visibility_settings${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags visibilitySetting
     * @name getVisibilitySettingByID
     * @summary getVisibilitySettingByID
     * @request GET:/visibility_settings/{id}
     * @description get visibilitySetting by id
     */
    getVisibilitySettingById: (id: string, params?: RequestParams) =>
      this.request<EntityVisibilitySetting, ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/visibility_settings/${id}`,
        "GET",
        params
      ),
  };
}
