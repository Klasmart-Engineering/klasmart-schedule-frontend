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

export type ApiBadRequestResponse = ApiErrorResponse;

export type ApiConflictResponse = ApiErrorResponse;

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

export interface ApiErrorResponse {
  data?: object;
  label?: string;
}

export interface ApiFolderItemsResponse {
  items?: EntityFolderItem[];
}

export interface ApiFolderItemsResponseWithTotal {
  items?: EntityFolderItem[];
  total?: number;
}

export type ApiForbiddenResponse = ApiErrorResponse;

export type ApiForgottenPasswordRequest = object;

export interface ApiGrade {
  grade_id?: string;
  grade_name?: string;
}

export type ApiInternalServerErrorResponse = ApiErrorResponse;

export interface ApiLoginRequest {
  auth_code?: string;
  auth_to?: string;
  auth_type?: string;
}

export interface ApiLoginResponse {
  token?: string;
}

export type ApiNotFoundResponse = ApiErrorResponse;

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
  scope?: string;
}

export interface ApiPublishOutcomeReq {
  scope?: string;
}

export interface ApiRegisterRequest {
  /** 当前是电话号码 */
  account?: string;

  /** 注册类型 */
  act_type?: string;

  /** 验证码 */
  auth_code?: string;

  /** 密码 */
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

export type ApiResetPasswordRequest = object;

export interface ApiSendCodeRequest {
  email?: string;
  mobile?: string;
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

export interface ApiTokenResponse {
  token?: string;
}

export type ApiUnAuthorizedResponse = ApiErrorResponse;

export interface ApiContentBulkOperateRequest {
  id?: string[];
}

export interface EntityAddAssessmentCommand {
  attendance_ids?: string[];
  class_end_time?: number;
  class_length?: number;
  schedule_id?: string;
}

export interface EntityAddAssessmentResult {
  id?: string;
}

export interface EntityAge {
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

export interface EntityAssessmentAttendanceView {
  checked?: boolean;
  id?: string;
  name?: string;
}

export interface EntityAssessmentDetailView {
  attendances?: EntityAssessmentAttendanceView[];
  class_end_time?: number;
  class_length?: number;
  complete_time?: number;
  id?: string;
  number_of_activities?: number;
  number_of_outcomes?: number;
  outcome_attendance_maps?: EntityOutcomeAttendanceMapView[];
  status?: string;
  subject?: EntityAssessmentSubject;
  teachers?: EntityAssessmentTeacher[];
  title?: string;
}

export interface EntityAssessmentListView {
  class_end_time?: number;
  complete_time?: number;
  id?: string;
  program?: EntityAssessmentProgram;
  status?: string;
  subject?: EntityAssessmentSubject;
  teachers?: EntityAssessmentTeacher[];
  title?: string;
}

export interface EntityAssessmentProgram {
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
  publish_scope?: string;
  publish_scope_name?: string;
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
  teacher_manual?: string;
  teacher_manual_name?: string;
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
  publish_scope?: string;
  self_study?: boolean;
  skills?: string[];
  source_type?: string;
  subject?: string[];
  suggest_time?: number;
  teacher_manual?: string;
  teacher_manual_name?: string;
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
  name?: string;
  owner_type?: number;
  parent_id?: string;
  partition?: string;
  thumbnail?: string;
}

export interface EntityDevelopmental {
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

export interface EntityFolderContent {
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
  keywords?: string;
  name?: string;
  publish_status?: string;
  thumbnail?: string;
  update_at?: number;
}

export interface EntityFolderContentInfoWithDetailsResponse {
  list?: EntityFolderContent[];
  total?: number;
}

export interface EntityFolderIdWithFileType {
  folder_file_type?: "content" | "folder";
  id?: string;
}

export interface EntityFolderItem {
  create_at?: number;
  creator?: string;
  dir_path?: string;
  editor?: string;
  id?: string;
  item_type?: number;
  items_count?: number;
  link?: string;
  name?: string;
  owner?: string;
  owner_type?: number;
  parent_id?: string;
  partition?: string;
  thumbnail?: string;
  update_at?: number;
}

export interface EntityFolderItemInfo {
  create_at?: number;
  creator?: string;
  dir_path?: string;
  editor?: string;
  id?: string;
  item_type?: number;
  items?: EntityFolderItem[];
  items_count?: number;
  link?: string;
  name?: string;
  owner?: string;
  owner_type?: number;
  parent_id?: string;
  partition?: string;
  thumbnail?: string;
  update_at?: number;
}

export interface EntityGrade {
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

export interface EntityIDResponse {
  id?: string;
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
  items?: EntityAssessmentListView[];
  total?: number;
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

export interface EntityOutcome {
  age?: string;
  ancestor_id?: string;
  assumed?: boolean;
  author?: string;
  author_name?: string;
  created_at?: number;
  deleted_at?: number;
  description?: string;
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
  shortcode?: string;
  skills?: string;
  source_id?: string;
  subject?: string;
  updated_at?: number;
  version?: number;
}

export interface EntityOutcomeAttendanceMap {
  attendance_ids?: string[];
  none_achieved?: boolean;
  outcome_id?: string;
  skip?: boolean;
}

export interface EntityOutcomeAttendanceMapView {
  assumed?: boolean;
  attendance_ids?: string[];
  none_achieved?: boolean;
  outcome_id?: string;
  outcome_name?: string;
  skip?: boolean;
}

export interface EntityProgram {
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

export interface EntityScheduleAddView {
  attachment?: EntityScheduleShortInfo;
  class_id: string;
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";
  description?: string;
  due_at?: number;
  end_at: number;
  is_all_day?: boolean;
  is_force?: boolean;
  is_repeat?: boolean;
  lesson_plan_id?: string;
  org_id?: string;
  program_id?: string;
  repeat?: EntityRepeatOptions;
  start_at: number;
  subject_id?: string;

  /** Abandoned */
  teacher_ids: string[];
  time_zone_offset?: number;
  title: string;
  version?: number;
}

export interface EntityScheduleDetailsView {
  attachment?: EntityScheduleShortInfo;
  class?: EntityScheduleShortInfo;
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";
  description?: string;
  due_at?: number;
  end_at?: number;
  id?: string;
  is_all_day?: boolean;
  is_repeat?: boolean;
  lesson_plan?: EntityScheduleShortInfo;
  member_teachers?: EntityScheduleShortInfo[];
  org_id?: string;
  program?: EntityScheduleShortInfo;
  repeat?: EntityRepeatOptions;
  start_at?: number;
  status?: "NotStart" | "Started" | "Closed";
  student_count?: number;
  subject?: EntityScheduleShortInfo;
  teachers?: EntityScheduleShortInfo[];
  title?: string;
  version?: number;
}

export interface EntityScheduleListView {
  class_id?: string;
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";
  end_at?: number;
  id?: string;
  is_repeat?: boolean;
  lesson_plan_id?: string;
  start_at?: number;
  status?: "NotStart" | "Started" | "Closed";
  title?: string;
}

export interface EntitySchedulePageView {
  data?: EntityScheduleSearchView[];
  total?: number;
}

export interface EntityScheduleSearchView {
  class?: EntityScheduleShortInfo;
  end_at?: number;
  id?: string;
  lesson_plan?: EntityScheduleShortInfo;
  member_teachers?: EntityScheduleShortInfo[];
  program?: EntityScheduleShortInfo;
  start_at?: number;
  student_count?: number;
  subject?: EntityScheduleShortInfo;
  teachers?: EntityScheduleShortInfo[];
  title?: string;
}

export interface EntityScheduleShortInfo {
  id?: string;
  name?: string;
}

export interface EntityScheduleUpdateView {
  attachment?: EntityScheduleShortInfo;
  class_id: string;
  class_type?: "OnlineClass" | "OfflineClass" | "Homework" | "Task";
  description?: string;
  due_at?: number;
  end_at: number;
  id?: string;
  is_all_day?: boolean;
  is_force?: boolean;
  is_repeat?: boolean;
  lesson_plan_id?: string;
  org_id?: string;
  program_id?: string;
  repeat?: EntityRepeatOptions;
  repeat_edit_options?: "only_current" | "with_following";
  start_at: number;
  subject_id?: string;

  /** Abandoned */
  teacher_ids: string[];
  time_zone_offset?: number;
  title: string;
  version?: number;
}

export interface EntitySkill {
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

export interface EntityStudentReport {
  assessment_ids?: string[];
  attend?: boolean;
  categories?: EntityStudentReportCategory[];
  student_name?: string;
}

export interface EntityStudentReportCategory {
  achieved_items?: string[];
  name?: string;
  not_achieved_items?: string[];
  not_attempted_items?: string[];
}

export interface EntityStudentReportItem {
  achieved_count?: number;
  attend?: boolean;
  not_achieved_count?: number;
  not_attempted_count?: number;
  student_id?: string;
  student_name?: string;
}

export interface EntityStudentsReport {
  assessment_ids?: string[];
  items?: EntityStudentReportItem[];
}

export interface EntitySubject {
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

export interface EntityTeacherReport {
  categories?: EntityTeacherReportCategory[];
}

export interface EntityTeacherReportCategory {
  items?: string[];
  name?: string;
}

export interface EntityUpdateAssessmentCommand {
  action?: "save" | "complete";
  attendance_ids?: string[];
  id?: string;
  outcome_attendance_maps?: EntityOutcomeAttendanceMap[];
}

export interface EntityUpdateFolderRequest {
  name?: string;
  thumbnail?: string;
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

export interface ExternalClass {
  id?: string;
  name?: string;
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
      this.request<EntityAge[], ApiInternalServerErrorResponse>(`/ages${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags age
     * @name addAge
     * @summary addAge
     * @request POST:/ages
     * @description add age
     */
    addAge: (age: EntityAge, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiInternalServerErrorResponse>(`/ages`, "POST", params, age),

    /**
     * @tags age
     * @name getAgeByID
     * @summary getAgeByID
     * @request GET:/ages/{id}
     * @description get age by id
     */
    getAgeById: (id: string, params?: RequestParams) =>
      this.request<EntityAge, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/ages/${id}`, "GET", params),

    /**
     * @tags age
     * @name updateAge
     * @summary updateAge
     * @request PUT:/ages/{id}
     * @description updateAge
     */
    updateAge: (id: string, age: EntityAge, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/ages/${id}`, "PUT", params, age),

    /**
     * @tags age
     * @name deleteAge
     * @summary deleteAge
     * @request DELETE:/ages/{id}
     * @description deleteAge
     */
    deleteAge: (id: string, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiInternalServerErrorResponse>(`/ages/${id}`, "DELETE", params),
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
    addAssessment: (assessment: EntityAddAssessmentCommand, params?: RequestParams) =>
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
        EntityAssessmentDetailView,
        ApiBadRequestResponse | ApiForbiddenResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse
      >(`/assessments/${id}`, "GET", params),

    /**
     * @tags assessments
     * @name updateAssessment
     * @summary update assessment
     * @request PUT:/assessments/{id}
     * @description update assessment
     */
    updateAssessment: (id: string, update_assessment_command: EntityUpdateAssessmentCommand, params?: RequestParams) =>
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
    addAssessmentForTest: (assessment: EntityAddAssessmentCommand, params?: RequestParams) =>
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
  contents = {
    /**
     * @tags content
     * @name searchContents
     * @summary queryContent
     * @request GET:/contents
     * @description query content by condition
     */
    searchContents: (
      query?: {
        name?: string;
        author?: string;
        content_type?: string;
        scope?: string;
        program?: string;
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
     * @name getContentById
     * @summary getContent
     * @request GET:/contents/{content_id}
     * @description get a content by id
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
    getContentLiveToken: (content_id: string, class_id: string, params?: RequestParams) =>
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
        program?: string;
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
    getDevelopmental: (query?: { program_id?: string }, params?: RequestParams) =>
      this.request<EntityDevelopmental[], ApiInternalServerErrorResponse>(`/developmentals${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags developmental
     * @name addDevelopmental
     * @summary addDevelopmental
     * @request POST:/developmentals
     * @description addDevelopmental
     */
    addDevelopmental: (developmental: EntityDevelopmental, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiInternalServerErrorResponse>(`/developmentals`, "POST", params, developmental),

    /**
     * @tags developmental
     * @name getDevelopmentalByID
     * @summary getDevelopmentalByID
     * @request GET:/developmentals/{id}
     * @description get developmental by id
     */
    getDevelopmentalById: (id: string, params?: RequestParams) =>
      this.request<EntityDevelopmental, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/developmentals/${id}`, "GET", params),

    /**
     * @tags developmental
     * @name updateDevelopmental
     * @summary updateDevelopmental
     * @request PUT:/developmentals/{id}
     * @description updateDevelopmental
     */
    updateDevelopmental: (id: string, developmental: EntityDevelopmental, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/developmentals/${id}`,
        "PUT",
        params,
        developmental
      ),

    /**
     * @tags developmental
     * @name deleteDevelopmental
     * @summary deleteDevelopmental
     * @request DELETE:/developmentals/{id}
     * @description deleteDevelopmental
     */
    deleteDevelopmental: (id: string, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiInternalServerErrorResponse>(`/developmentals/${id}`, "DELETE", params),
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
      this.request<EntityGrade[], ApiInternalServerErrorResponse>(`/grades${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags grade
     * @name addGrade
     * @summary addGrade
     * @request POST:/grades
     * @description addGrade
     */
    addGrade: (grade: EntityGrade, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiInternalServerErrorResponse>(`/grades`, "POST", params, grade),

    /**
     * @tags grade
     * @name getGradeByID
     * @summary getGradeByID
     * @request GET:/grades/{id}
     * @description get grade by id
     */
    getGradeById: (id: string, params?: RequestParams) =>
      this.request<EntityGrade, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/grades/${id}`, "GET", params),

    /**
     * @tags grade
     * @name updateGrade
     * @summary updateGrade
     * @request PUT:/grades/{id}
     * @description updateGrade
     */
    updateGrade: (id: string, grade: EntityGrade, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/grades/${id}`, "PUT", params, grade),

    /**
     * @tags grade
     * @name deleteGrade
     * @summary deleteGrade
     * @request DELETE:/grades/{id}
     * @description deleteGrade
     */
    deleteGrade: (id: string, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiInternalServerErrorResponse>(`/grades/${id}`, "DELETE", params),
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
        `/learning_outcomes${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags learning_outcomes
     * @name createLearningOutcomes
     * @summary createOutcome
     * @request POST:/learning_outcomes
     * @description Create learning outcomes
     */
    createLearningOutcomes: (outcome: ApiOutcomeCreateView, params?: RequestParams) =>
      this.request<ApiOutcomeCreateResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
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
      this.request<string, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/learning_outcomes/${outcome_id}`,
        "PUT",
        params,
        outcome
      ),

    /**
     * @tags learning_outcomes
     * @name deleteLearningOutcome
     * @summary delete learning outcome
     * @request DELETE:/learning_outcomes/{outcome_id}
     * @description delete learning outcomes by id
     */
    deleteLearningOutcome: (outcome_id: string, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
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
    getProgram: (params?: RequestParams) => this.request<EntityProgram[], ApiInternalServerErrorResponse>(`/programs`, "GET", params),

    /**
     * @tags program
     * @name addProgram
     * @summary addProgram
     * @request POST:/programs
     * @description addProgram
     */
    addProgram: (program: EntityProgram, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiInternalServerErrorResponse>(`/programs`, "POST", params, program),

    /**
     * @tags program
     * @name getProgramByID
     * @summary getProgramByID
     * @request GET:/programs/{id}
     * @description get program by id
     */
    getProgramById: (id: string, params?: RequestParams) =>
      this.request<EntityProgram, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/programs/${id}`, "GET", params),

    /**
     * @tags program
     * @name updateProgram
     * @summary updateProgram
     * @request PUT:/programs/{id}
     * @description updateProgram
     */
    updateProgram: (id: string, program: EntityProgram, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/programs/${id}`, "PUT", params, program),

    /**
     * @tags program
     * @name deleteProgram
     * @summary deleteProgram
     * @request DELETE:/programs/{id}
     * @description deleteProgram
     */
    deleteProgram: (id: string, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiInternalServerErrorResponse>(`/programs/${id}`, "DELETE", params),

    /**
     * @tags program
     * @name SetAge
     * @summary SetAge
     * @request PUT:/programs/{id}/ages
     * @description SetAge
     */
    setAge: (id: string, query: { age_ids: string }, params?: RequestParams) =>
      this.request<string, ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/programs/${id}/ages${this.addQueryParams(query)}`,
        "PUT",
        params
      ),

    /**
     * @tags program
     * @name SetDevelopmental
     * @summary SetDevelopmental
     * @request PUT:/programs/{id}/developments
     * @description SetDevelopmental
     */
    setDevelopmental: (id: string, query: { development_ids: string }, params?: RequestParams) =>
      this.request<string, ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/programs/${id}/developments${this.addQueryParams(query)}`,
        "PUT",
        params
      ),

    /**
     * @tags program
     * @name SetGrade
     * @summary SetGrade
     * @request PUT:/programs/{id}/grades
     * @description SetGrade
     */
    setGrade: (id: string, query: { grade_ids: string }, params?: RequestParams) =>
      this.request<string, ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/programs/${id}/grades${this.addQueryParams(query)}`,
        "PUT",
        params
      ),

    /**
     * @tags program
     * @name SetSkill
     * @summary SetSkill
     * @request PUT:/programs/{id}/skills
     * @description SetSkill
     */
    setSkill: (id: string, query: { development_id: string; skill_ids: string }, params?: RequestParams) =>
      this.request<string, ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/programs/${id}/skills${this.addQueryParams(query)}`,
        "PUT",
        params
      ),

    /**
     * @tags program
     * @name SetSubject
     * @summary SetSubject
     * @request PUT:/programs/{id}/subjects
     * @description SetSubject
     */
    setSubject: (id: string, query: { subject_ids: string }, params?: RequestParams) =>
      this.request<string, ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/programs/${id}/subjects${this.addQueryParams(query)}`,
        "PUT",
        params
      ),
  };
  reports = {
    /**
     * @tags reports
     * @name listStudentsReport
     * @summary list student report
     * @request GET:/reports/students
     * @description list student report
     */
    listStudentsReport: (
      query: {
        teacher_id: string;
        class_id: string;
        lesson_plan_id: string;
        status?: "all" | "achieved" | "not_achieved" | "not_attempted";
        sort_by?: "desc" | "asc";
      },
      params?: RequestParams
    ) =>
      this.request<EntityStudentsReport, ApiBadRequestResponse | ApiForbiddenResponse | ApiInternalServerErrorResponse>(
        `/reports/students${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags reports
     * @name getStudentReport
     * @summary get student report
     * @request GET:/reports/students/{id}
     * @description get student report
     */
    getStudentReport: (id: string, query: { teacher_id: string; class_id: string; lesson_plan_id: string }, params?: RequestParams) =>
      this.request<
        EntityStudentReport,
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
      this.request<EntityIDResponse, ApiBadRequestResponse | ApiConflictResponse | ApiInternalServerErrorResponse>(
        `/schedules`,
        "POST",
        params,
        scheduleData
      ),

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
      this.request<EntityIDResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiConflictResponse | ApiInternalServerErrorResponse>(
        `/schedules/${schedule_id}`,
        "PUT",
        params,
        scheduleData
      ),

    /**
     * @tags schedule
     * @name deleteSchedule
     * @summary deleteSchedule
     * @request DELETE:/schedules/{schedule_id}
     * @description delete a schedule data
     */
    deleteSchedule: (schedule_id: string, query: { repeat_edit_options: "only_current" | "with_following" }, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
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
    getScheduleLiveToken: (schedule_id: string, params?: RequestParams) =>
      this.request<EntityLiveTokenView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules/${schedule_id}/live/token`,
        "GET",
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
      this.request<EntityIDResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules/${schedule_id}/status${this.addQueryParams(query)}`,
        "PUT",
        params
      ),
  };
  schedulesLessonPlans = {
    /**
     * @tags reports
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
  schedulesParticipate = {
    /**
     * @tags schedule
     * @name getParticipateClass
     * @summary getParticipateClass
     * @request GET:/schedules_participate/class
     * @description get participate Class
     */
    getParticipateClass: (params?: RequestParams) =>
      this.request<ExternalClass[], ApiInternalServerErrorResponse>(`/schedules_participate/class`, "GET", params),
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
        view_type: "day" | "work_week" | "week" | "month";
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
      this.request<EntityScheduleListView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules_time_view${this.addQueryParams(query)}`,
        "GET",
        params
      ),
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
      this.request<EntitySkill[], ApiInternalServerErrorResponse>(`/skills${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags skill
     * @name addSkill
     * @summary addSkill
     * @request POST:/skills
     * @description addSkill
     */
    addSkill: (skill: EntitySkill, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiInternalServerErrorResponse>(`/skills`, "POST", params, skill),

    /**
     * @tags skill
     * @name getSkillByID
     * @summary getSkillByID
     * @request GET:/skills/{id}
     * @description get skill by id
     */
    getSkillById: (id: string, params?: RequestParams) =>
      this.request<EntitySkill, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/skills/${id}`, "GET", params),

    /**
     * @tags skill
     * @name updateSkill
     * @summary updateSkill
     * @request PUT:/skills/{id}
     * @description updateSkill
     */
    updateSkill: (id: string, skill: EntitySkill, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/skills/${id}`, "PUT", params, skill),

    /**
     * @tags skill
     * @name deleteSkill
     * @summary deleteSkill
     * @request DELETE:/skills/{id}
     * @description deleteSkill
     */
    deleteSkill: (id: string, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiInternalServerErrorResponse>(`/skills/${id}`, "DELETE", params),
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
      this.request<EntitySubject[], ApiInternalServerErrorResponse>(`/subjects${this.addQueryParams(query)}`, "GET", params),

    /**
     * @tags subject
     * @name addSubject
     * @summary addSubject
     * @request POST:/subjects
     * @description addSubject
     */
    addSubject: (subject: EntitySubject, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiInternalServerErrorResponse>(`/subjects`, "POST", params, subject),

    /**
     * @tags subject
     * @name getSubjectByID
     * @summary getSubjectByID
     * @request GET:/subjects/{id}
     * @description get subjects by id
     */
    getSubjectById: (id: string, params?: RequestParams) =>
      this.request<EntitySubject, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/subjects/${id}`, "GET", params),

    /**
     * @tags subject
     * @name updateSubject
     * @summary updateSubject
     * @request PUT:/subjects/{id}
     * @description updateSubject
     */
    updateSubject: (id: string, subject: EntitySubject, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiNotFoundResponse | ApiInternalServerErrorResponse>(`/subjects/${id}`, "PUT", params, subject),

    /**
     * @tags subject
     * @name deleteSubject
     * @summary deleteSubject
     * @request DELETE:/subjects/{id}
     * @description deleteSubject
     */
    deleteSubject: (id: string, params?: RequestParams) =>
      this.request<EntityIDResponse, ApiInternalServerErrorResponse>(`/subjects/${id}`, "DELETE", params),
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
      this.request<EntityIDResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/user_settings`, "POST", params, userSetting),
  };
  users = {
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
     * @name sendCode
     * @summary send verify code
     * @request POST:/users/verification
     * @description send verify code or uri
     */
    sendCode: (outcome: ApiSendCodeRequest, params?: RequestParams) =>
      this.request<any, ApiBadRequestResponse | ApiInternalServerErrorResponse>(`/users/verification`, "POST", params, outcome),
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
