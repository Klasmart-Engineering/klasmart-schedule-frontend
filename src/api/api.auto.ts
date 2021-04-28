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

export interface ApiAge {
  age_id?: string;
  age_name?: string;
}

export type ApiBadRequestResponse = ApiResponse;

export interface ApiBulkBindOutcomeSetRequest {
  outcome_ids?: string[];
  set_ids?: string[];
}

export interface ApiCheckAccountResponse {
  status?: string;
}

export type ApiConflictResponse = ApiResponse;

export interface ApiCreateContentResponse {
  id?: string;
}

export interface ApiCreateFolderResponse {
  id?: string;
}

export interface ApiDevelopmental {
  developmental_id?: string;
  developmental_name?: string;
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

export type ApiForbiddenResponse = ApiResponse;

export interface ApiForgottenPasswordRequest {
  auth_code?: string;
  auth_to?: string;
  password?: string;
}

export interface ApiGrade {
  grade_id?: string;
  grade_name?: string;
}

export interface ApiIDResponse {
  id?: string;
}

export type ApiInternalServerErrorResponse = ApiResponse;

export interface ApiLoginRequest {
  auth_code?: string;
  auth_to?: string;
  auth_type?: string;
}

export interface ApiLoginResponse {
  token?: string;
}

export type ApiNotFoundResponse = ApiResponse;

export interface ApiOrganizationRegionInfoResponse {
  orgs?: EntityRegionOrganizationInfo[];
}

export interface ApiOutcomeBulkRejectRequest {
  outcome_ids?: string[];
  reject_reason?: string;
}

export interface ApiOutcomeCreateResponse {
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

export interface ApiOutcomeCreateView {
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
  sets?: ApiOutcomeSetCreateView[];
  shortcode?: string;
  skills?: string[];
  subject?: string[];
}

export interface ApiOutcomeIDList {
  outcome_ids?: string[];
}

export interface ApiOutcomeRejectReq {
  reject_reason?: string;
}

export interface ApiOutcomeSearchResponse {
  list?: ApiOutcomeView[];
  total?: number;
}

export interface ApiOutcomeSetCreateView {
  set_id?: string;
  set_name?: string;
}

export interface ApiOutcomeView {
  age?: ApiAge[];
  ancestor_id?: string;
  assumed?: boolean;
  author_id?: string;
  author_name?: string;
  created_at?: number;
  description?: string;
  developmental?: ApiDevelopmental[];
  estimated_time?: number;
  grade?: ApiGrade[];
  keywords?: string[];
  latest_id?: string;
  locked_by?: string;
  organization_id?: string;
  organization_name?: string;
  outcome_id?: string;
  outcome_name?: string;
  program?: ApiProgram[];
  publish_scope?: string;
  publish_status?: string;
  reject_reason?: string;
  sets?: ApiOutcomeSetCreateView[];
  shortcode?: string;
  skills?: ApiSkill[];
  source_id?: string;
  subject?: ApiSubject[];
  update_at?: number;
}

export interface ApiProgram {
  program_id?: string;
  program_name?: string;
}

export interface ApiPublishContentRequest {
  scope?: string[];
}

export interface ApiPublishOutcomeReq {
  scope?: string;
}

export interface ApiPullOutcomeSetResponse {
  sets?: ApiOutcomeSetCreateView[];
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

export interface ApiResponse {
  data?: object;
  label?: string;
}

export interface ApiSendCodeRequest {
  email?: string;
  mobile?: string;
}

export interface ApiShortcodeResponse {
  shortcode?: string;
}

export interface ApiSignatureResponse {
  url?: string;
}

export interface ApiSkill {
  skill_id?: string;
  skill_name?: string;
}

export interface ApiSubject {
  subject_id?: string;
  subject_name?: string;
}

export type ApiSuccessRequestResponse = ApiResponse;

export interface ApiTokenResponse {
  token?: string;
}

export type ApiUnAuthorizedResponse = ApiResponse;

export interface ApiContentBulkOperateRequest {
  id?: string[];
}

export interface EntityActivityFlashCards {
  cards_number?: number;
  play_records?: EntityActivityFlashCardsPlayRecord[];
}

export interface EntityActivityFlashCardsPlayRecord {
  correct_cards_count?: number;
  duration?: number;
  end_time?: number;
  start_time?: number;
}

export interface EntityActivityImagePair {
  paris_number?: number;
  play_records?: EntityActivityImagePairPlayRecord[];
  play_times?: number;
}

export interface EntityActivityImagePairPlayRecord {
  correct_pairs_count?: number;
  duration?: number;
  end_time?: number;
  start_time?: number;
}

export interface EntityActivityImageSequencing {
  cards_number?: number;
  play_records?: EntityActivityImageSequencingPlayRecord[];
  play_times?: number;
}

export interface EntityActivityImageSequencingPlayRecord {
  correct_cards_count?: number;
  duration?: number;
  end_time?: number;
  start_time?: number;
}

export interface EntityActivityMemoryGame {
  pairs_number?: number;
  play_records?: EntityActivityMemoryGamePlayRecord[];
  play_times?: number;
}

export interface EntityActivityMemoryGamePlayRecord {
  clicks_count?: number;
  duration?: number;
  end_time?: number;
  start_time?: number;
}

export interface EntityAddAssessmentArgs {
  attendance_ids?: string[];
  class_end_time?: number;
  class_length?: number;
  schedule_id?: string;
}

export interface EntityAddAssessmentResult {
  id?: string;
}

export interface EntityAddAuthedContentRequest {
  content_id?: string;
  from_folder_id?: string;
  org_id?: string;
}

export interface EntityAssessHomeFunStudyArgs {
  action?: "save" | "complete";
  assess_comment?: string;
  assess_feedback_id?: string;
  assess_score?: 1 | 2 | 3 | 4 | 5;
  id?: string;
}

export interface EntityAssessmentClass {
  id?: string;
  name?: string;
}

export interface EntityAssessmentContentView {
  checked?: boolean;
  comment?: string;
  id?: string;
  name?: string;
  outcome_ids?: string[];
}

export interface EntityAssessmentDetail {
  class?: EntityAssessmentClass;
  class_end_time?: number;
  class_length?: number;
  complete_time?: number;
  id?: string;
  materials?: EntityAssessmentContentView[];
  number_of_outcomes?: number;
  outcome_attendances?: EntityOutcomeAttendances[];
  plan?: EntityAssessmentContentView;
  program?: EntityAssessmentProgram;
  room_id?: string;
  status?: string;
  students?: EntityAssessmentStudent[];
  subjects?: EntityAssessmentSubject[];
  teachers?: EntityAssessmentTeacher[];
  title?: string;
}

export interface EntityAssessmentItem {
  class_end_time?: number;
  complete_time?: number;
  id?: string;
  program?: EntityAssessmentProgram;
  status?: string;
  subjects?: EntityAssessmentSubject[];
  teachers?: EntityAssessmentTeacher[];
  title?: string;
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

export interface EntityAssessmentSubject {
  id?: string;
  name?: string;
}

export interface EntityAssessmentTeacher {
  id?: string;
  name?: string;
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
  folder_i_ds?: string[];
  org_ids?: string[];
}

export interface EntityClassEventBody {
  token?: string;
}

export interface EntityClassType {
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

export interface EntityContentInfoWithDetailsResponse {
  list?: EntityContentInfoWithDetails[];
  total?: number;
}

export interface EntityContentStatisticsInfo {
  outcomes_count?: number;
  subcontent_count?: number;
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

export interface EntityCreateFolderItemRequest {
  link?: string;
  owner_type?: number;

  /** ID string `json:"id"` */
  parent_folder_id?: string;

  /** ItemType  ItemType  `json:"item_type"` */
  partition?: string;
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

export interface EntityCreateH5PEventRequest {
  extends?: object;
  local_content_id?: string;
  local_library_name?: string;
  local_library_version?: string;
  material_id?: string;
  play_id?: string;
  schedule_id?: string;
  time?: number;
  user_id?: string;
  verb_id?: string;
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
  schedule_id?: string;
  status?: string;
  student_id?: string;
  student_name?: string;
  subject_name?: string;
  teacher_ids?: string[];
  teacher_names?: string[];
  title?: string;
}

export interface EntityGetStudentPerformanceH5PReportResponse {
  items?: EntityStudentPerformanceH5PReportItem[];
}

export interface EntityGetStudentPerformanceReportResponse {
  assessment_ids?: string[];
  items?: EntityStudentPerformanceReportItem[];
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

  /** debug */
  schedule_id?: string;
  status?: string;
  student_name?: string;
  teacher_names?: string[];
  title?: string;
}

export interface EntityListStudentsPerformanceH5PReportResponse {
  items?: EntityStudentsPerformanceH5PReportItem[];
}

export interface EntityListStudentsPerformanceReportResponse {
  assessment_ids?: string[];
  items?: EntityStudentsPerformanceReportItem[];
}

export interface EntityLiveTokenView {
  token?: string;
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
  ancestor_id?: string;
  assumed?: boolean;
  author?: string;
  author_name?: string;
  created_at?: number;
  deleted_at?: number;
  description?: string;

  /** Category */
  developmental?: string;
  extra?: number;
  grade?: string;
  keywords?: string;
  latest_id?: string;
  locked_by?: string;
  organization_id?: string;
  outcome_id?: string;
  outcome_name?: string;
  program?: string;
  publish_scope?: string;
  publish_status?: string;
  reject_reason?: string;
  sets?: EntitySet[];
  shortcode?: string;

  /** SubCategory */
  skills?: string;
  source_id?: string;
  subject?: string;
  updated_at?: number;
  version?: number;
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

export interface EntityOutcomeAttendances {
  assumed?: boolean;
  attendance_ids?: string[];
  checked?: boolean;
  none_achieved?: boolean;
  outcome_id?: string;
  outcome_name?: string;
  skip?: boolean;
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
  description?: string;
  due_at?: number;
  end_at?: number;
  exist_feedback?: boolean;
  id?: string;
  is_all_day?: boolean;
  is_hidden?: boolean;
  is_home_fun?: boolean;
  is_repeat?: boolean;
  lesson_plan?: EntityScheduleLessonPlan;
  org_id?: string;
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
  due_at?: number;
  end_at?: number;
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

export interface EntityScheduleViewDetail {
  attachment?: EntityScheduleShortInfo;
  class?: EntityScheduleShortInfo;
  class_id?: string;
  class_type?: EntityScheduleShortInfo;
  due_at?: number;
  end_at?: number;
  exist_feedback?: boolean;
  id?: string;
  is_hidden?: boolean;
  is_home_fun?: boolean;
  is_repeat?: boolean;
  lesson_plan?: EntityScheduleLessonPlan;
  lesson_plan_id?: string;
  role_type?: "Student" | "Teacher" | "Unknown";
  room_id?: string;
  start_at?: number;
  status?: "NotStart" | "Started" | "Closed";
  students?: EntityScheduleShortInfo[];
  teachers?: EntityScheduleShortInfo[];
  title?: string;
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

export interface EntityStudentPerformanceH5PReportItem {
  activity_flash_cards?: EntityActivityFlashCards;
  activity_image_pair?: EntityActivityImagePair;
  activity_image_sequencing?: EntityActivityImageSequencing;
  activity_memory_game?: EntityActivityMemoryGame;
  activity_type?: "H5P.ImageSequencing" | "H5P.MemoryGame" | "H5P.ImagePair" | "H5P.Flashcards";
  avg_spent_time?: number;
  material_id?: string;
  material_name?: string;
  total_spent_time?: number;
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

export interface EntityStudentsAchievementReportResponse {
  assessment_ids?: string[];
  items?: EntityStudentAchievementReportItem[];
}

export interface EntityStudentsPerformanceH5PReportItem {
  attend?: boolean;
  spent_time?: number;
  student_id?: string;
  student_name?: string;
}

export interface EntityStudentsPerformanceReportItem {
  achieved_names?: string[];
  attend?: boolean;
  not_achieved_names?: string[];
  not_attempted_names?: string[];
  student_id?: string;
  student_name?: string;
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
  id?: string;
  materials?: EntityUpdateAssessmentMaterialArgs[];
  outcome_attendances?: EntityUpdateOutcomeAttendancesArgs[];
}

export interface EntityUpdateAssessmentMaterialArgs {
  checked?: boolean;
  comment?: string;
  id?: string;
}

export interface EntityUpdateFolderRequest {
  description?: string;
  keywords?: string[];
  name?: string;
  thumbnail?: string;
}

export interface EntityUpdateOutcomeAttendancesArgs {
  attendance_ids?: string[];
  none_achieved?: boolean;
  outcome_id?: string;
  skip?: boolean;
}

export interface EntityUserSettingJsonContent {
  cms_page_size: number;
}

export interface EntityVisibilitySetting {
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
    addAssessment: (assessment: EntityAddAssessmentArgs, params?: RequestParams) =>
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
  assessmentsForTest = {
    /**
     * @tags assessments
     * @name addAssessmentForTest
     * @summary add assessments for test
     * @request POST:/assessments_for_test
     * @description add assessments for test
     */
    addAssessmentForTest: (assessment: EntityAddAssessmentArgs, params?: RequestParams) =>
      this.request<EntityAddAssessmentResult, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/assessments_for_test`,
        "POST",
        params,
        assessment
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
    deleteOutcomeBulk: (id_list: ApiOutcomeIDList, params?: RequestParams) =>
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
    approveLearningOutcomesBulk: (id_list: ApiOutcomeIDList, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/bulk_approve/learning_outcomes`,
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
    publishLearningOutcomesBulk: (id_list: ApiOutcomeIDList, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/bulk_publish/learning_outcomes`,
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
    rejectLearningOutcomesBulk: (bulk_reject_list: ApiOutcomeBulkRejectRequest, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/bulk_reject/learning_outcomes`,
        "PUT",
        params,
        bulk_reject_list
      ),
  };
  classTypes = {
    /**
     * @tags classType
     * @name getClassType
     * @summary getClassType
     * @request GET:/class_types
     * @description get class type
     */
    getClassType: (params?: RequestParams) =>
      this.request<EntityClassType[], ApiInternalServerErrorResponse>(`/class_types`, "GET", params),

    /**
     * @tags classType
     * @name getClassTypeByID
     * @summary getClassTypeByID
     * @request GET:/class_types/{id}
     * @description get classType by id
     */
    getClassTypeById: (id: string, params?: RequestParams) =>
      this.request<EntityClassType, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/class_types/${id}`, "GET", params),
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
      this.request<EntityContentInfoWithDetailsResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
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
     * @name copyContent
     * @summary copyContent
     * @request POST:/contents/copy
     * @description copy lesson plan, lesson material
     */
    copyContent: (content: EntityCreateContentRequest, params?: RequestParams) =>
      this.request<ApiCreateContentResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents/copy`,
        "POST",
        params,
        content
      ),

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
        source_type?: string;
        order_by?: "id" | "-id" | "content_name" | "-content_name" | "create_at" | "-create_at" | "update_at" | "-update_at";
        page_size?: number;
        page?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityContentInfoWithDetailsResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
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
      this.request<EntityContentInfoWithDetailsResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
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
        source_type?: string;
        scope?: string;
        publish_status?: "published" | "draft" | "pending" | "rejected" | "archive";
        order_by?: "id" | "-id" | "content_name" | "-content_name" | "create_at" | "-create_at" | "update_at" | "-update_at";
        page_size?: number;
        page?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityContentInfoWithDetailsResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
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
     * @name addFolderItem
     * @summary addFolderItem
     * @request POST:/folders/items
     * @description create folder item
     */
    addFolderItem: (content: EntityCreateFolderItemRequest, params?: RequestParams) =>
      this.request<ApiCreateFolderResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/folders/items`,
        "POST",
        params,
        content
      ),

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
  h5P = {
    /**
     * @tags h5p
     * @name createH5PEvent
     * @summary createH5PEvent
     * @request POST:/h5p/events
     * @description create h5p event
     */
    createH5PEvent: (content: EntityCreateH5PEventRequest, params?: RequestParams) =>
      this.request<ApiCreateContentResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/h5p/events`,
        "POST",
        params,
        content
      ),
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
        ApiOutcomeSearchResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse
      >(`/learning_outcomes${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags learning_outcomes
     * @name createLearningOutcomes
     * @summary createLearningOutcome
     * @request POST:/learning_outcomes
     * @description Create learning outcomes
     */
    createLearningOutcomes: (outcome: ApiOutcomeCreateView, params?: RequestParams) =>
      this.request<ApiOutcomeCreateResponse, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
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
      this.request<ApiOutcomeView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
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
    updateLearningOutcomes: (outcome_id: string, outcome: ApiOutcomeCreateView, params?: RequestParams) =>
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
    publishLearningOutcomes: (outcome_id: string, PublishOutcomeRequest: ApiPublishOutcomeReq, params?: RequestParams) =>
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
    rejectLearningOutcomes: (outcome_id: string, OutcomeRejectReq: ApiOutcomeRejectReq, params?: RequestParams) =>
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
      this.request<ApiOutcomeSearchResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/pending_learning_outcomes${this.addQueryParams(query)}`,
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
      this.request<ApiOutcomeSearchResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/private_learning_outcomes${this.addQueryParams(query)}`,
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
  reports = {
    /**
     * @tags reports
     * @name listStudentsPerformanceH5PReport
     * @summary list student performance h5p report
     * @request GET:/reports/performance/h5p/students
     * @description list student performance h5p report
     */
    listStudentsPerformanceH5PReport: (query: { teacher_id: string; class_id: string; lesson_plan_id: string }, params?: RequestParams) =>
      this.request<
        EntityListStudentsPerformanceH5PReportResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse
      >(`/reports/performance/h5p/students${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags reports
     * @name getStudentPerformanceH5PReport
     * @summary get student performance h5p report
     * @request GET:/reports/performance/h5p/students/{id}
     * @description get student performance h5p report
     */
    getStudentPerformanceH5PReport: (
      id: string,
      query: { teacher_id: string; class_id: string; lesson_plan_id: string },
      params?: RequestParams
    ) =>
      this.request<
        EntityGetStudentPerformanceH5PReportResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse
      >(`/reports/performance/h5p/students/${id}${this.addQueryParams(query)}`, "GET", params),

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
     * @request GET:/reports/teaching_loading
     * @description list teaching load report
     */
    listTeachingLoadReport: (
      query: {
        school_id?: string;
        teacher_ids?: string;
        class_ids?: string;
        time_offset: string;
        page?: number;
        size?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityReportListTeachingLoadResult, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/teaching_loading${this.addQueryParams(query)}`,
        "GET",
        params
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
        order_by?: "create_at" | "-create_at" | "start_at" | "-start_at";
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
     * @description get schedule by id
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
     * @name getClassTypesInScheduleFilter
     * @summary get schedule filter classTypes
     * @request GET:/schedules_filter/class_types
     * @description get schedule filter classTypes
     */
    getClassTypesInScheduleFilter: (params?: RequestParams) =>
      this.request<EntityScheduleShortInfo[], ApiInternalServerErrorResponse>(`/schedules_filter/class_types`, "GET", params),

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
     * @summary getLearningOutcome
     * @request GET:/sets
     * @description learning outcomes info
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
    createOutcomeSet: (outcome: ApiOutcomeSetCreateView, params?: RequestParams) =>
      this.request<
        ApiOutcomeSetCreateView,
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
     * @tags learning_outcomes
     * @name generateShortcode
     * @summary generate Shortcode
     * @request POST:/shortcode
     * @description generate shortcode
     */
    generateShortcode: (params?: RequestParams) =>
      this.request<
        ApiShortcodeResponse,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiConflictResponse | ApiInternalServerErrorResponse
      >(`/shortcode`, "POST", params),
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
