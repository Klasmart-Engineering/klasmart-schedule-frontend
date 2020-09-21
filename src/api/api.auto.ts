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

export interface ApiDevelopmental {
  developmental_id?: string;
  developmental_name?: string;
}

export interface ApiErrorResponse {
  label?: "unknown";
}

export type ApiForbiddenResponse = ApiErrorResponse;

export interface ApiGrade {
  grade_id?: string;
  grade_name?: string;
}

export type ApiInternalServerErrorResponse = ApiErrorResponse;

export type ApiNotFoundResponse = ApiErrorResponse;

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

export interface ApiRejectReasonRequest {
  reject_reason?: string[];
}

export interface ApiSkill {
  skill_id?: string;
  skill_name?: string;
}

export interface ApiSubject {
  subject_id?: string;
  subject_name?: string;
}

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

export interface EntityAssessmentAttendanceView {
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

export interface EntityContentInfoWithDetails {
  age?: string[];
  age_name?: string[];
  author?: string;
  author_name?: string;
  content_type?: number;
  content_type_name?: string;
  created_at?: number;
  data?: string;
  description?: string;
  developmental?: string[];
  developmental_name?: string[];
  extra?: string;
  grade?: string[];
  grade_name?: string[];
  id?: string;
  keywords?: string[];
  latest_id?: string;
  locked_by?: string;
  name?: string;
  org?: string;
  org_name?: string;
  outcome_entities?: EntityOutcome[];
  outcomes?: string[];
  program?: string[];
  program_name?: string[];
  publish_scope?: string;
  publish_status?: string;
  reject_reason?: string[];
  skills?: string[];
  skills_name?: string[];
  source_id?: string;
  subject?: string[];
  subject_name?: string[];
  suggest_time?: number;
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
  extra?: string;
  grade?: string[];
  keywords?: string[];
  name?: string;
  outcomes?: string[];
  program?: string[];
  publish_scope?: string;
  skills?: string[];
  subject?: string[];
  suggest_time?: number;
  thumbnail?: string;
}

export interface EntityIDResponse {
  id?: string;
}

export interface EntityListAssessmentsResult {
  items?: EntityAssessmentListView[];
  total?: number;
}

export interface EntityLiveTokenView {
  token?: string;
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
  outcome_id?: string;
  skip?: boolean;
}

export interface EntityOutcomeAttendanceMapView {
  assumed?: boolean;
  attendance_ids?: string[];
  outcome_id?: string;
  outcome_name?: string;
  skip?: boolean;
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
  lesson_plan_id: string;
  org_id?: string;
  program_id: string;
  repeat?: EntityRepeatOptions;
  start_at: number;
  subject_id: string;
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
  org_id?: string;
  program?: EntityScheduleShortInfo;
  repeat?: EntityRepeatOptions;
  start_at?: number;
  status?: "NotStart" | "Started" | "Closed";
  subject?: EntityScheduleShortInfo;
  teachers?: EntityScheduleShortInfo[];
  title?: string;
  version?: number;
}

export interface EntityScheduleListView {
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
  program?: EntityScheduleShortInfo;
  start_at?: number;
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
  lesson_plan_id: string;
  org_id?: string;
  program_id: string;
  repeat?: EntityRepeatOptions;
  repeat_edit_options?: "only_current" | "with_following";
  start_at: number;
  subject_id: string;
  teacher_ids: string[];
  time_zone_offset?: number;
  title: string;
  version?: number;
}

export interface EntityUpdateAssessmentCommand {
  action?: "save" | "complete";
  attendance_ids?: string[];
  id?: string;
  outcome_attendance_maps?: EntityOutcomeAttendanceMap[];
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
      this.request<EntityListAssessmentsResult, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
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
      this.request<EntityAddAssessmentResult, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
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
      this.request<EntityAssessmentDetailView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/assessments/${id}`,
        "GET",
        params
      ),

    /**
     * @tags assessments
     * @name updateAssessment
     * @summary update assessment
     * @request PUT:/assessments/{id}
     * @description update assessment
     */
    updateAssessment: (id: string, update_assessment_command: EntityUpdateAssessmentCommand, params?: RequestParams) =>
      this.request<string, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/assessments/${id}`,
        "PUT",
        params,
        update_assessment_command
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
     * @name searchPendingContents
     * @summary queryPendingContent
     * @request GET:/contents/pending
     * @description query pending content by condition
     */
    searchPendingContents: (
      query?: {
        name?: string;
        author?: string;
        content_type?: string;
        scope?: string;
        publish_status?: "published" | "draft" | "pending" | "rejected";
        order_by?: "name" | "-name" | "create_at， -create_at";
        page_size?: number;
        page?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityContentInfoWithDetailsResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents/pending${this.addQueryParams(query)}`,
        "GET",
        params
      ),

    /**
     * @tags content
     * @name searchPrivateContents
     * @summary queryPrivateContent
     * @request GET:/contents/private
     * @description query private content by condition
     */
    searchPrivateContents: (
      query?: {
        name?: string;
        author?: string;
        content_type?: string;
        scope?: string;
        publish_status?: "published" | "draft" | "pending" | "rejected";
        order_by?: "name" | "-name" | "create_at， -create_at";
        page_size?: number;
        page?: number;
      },
      params?: RequestParams
    ) =>
      this.request<EntityContentInfoWithDetailsResponse, ApiBadRequestResponse | ApiInternalServerErrorResponse>(
        `/contents/private${this.addQueryParams(query)}`,
        "GET",
        params
      ),

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
        order_by?: "name" | "-name" | "created_at" | "-created_at";
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
        order_by?: "name" | "-name" | "created_at" | "-created_at";
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
        order_by?: "name" | "-name" | "created_at" | "-created_at";
      },
      params?: RequestParams
    ) =>
      this.request<ApiOutcomeSearchResponse, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/private_learning_outcomes${this.addQueryParams(query)}`,
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
      query: { view_type: "day" | "work_week" | "week" | "month"; time_at: number; time_zone_offset: number },
      params?: RequestParams
    ) =>
      this.request<EntityScheduleListView, ApiBadRequestResponse | ApiNotFoundResponse | ApiInternalServerErrorResponse>(
        `/schedules_time_view${this.addQueryParams(query)}`,
        "GET",
        params
      ),
  };
}
