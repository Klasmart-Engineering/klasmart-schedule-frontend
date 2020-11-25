import api from ".";

type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

export enum ContentType {
  image = 31,
  video = 32,
  audio = 33,
  doc = 34,
  assets = 3,
  plan = 2,
  material = 1,
}
export enum MaterialType {
  h5p = 1,
  fromFile = 2,
  fromAssets = 3,
}

export enum PublishStatus {
  published = "published",
  pending = "pending",
  draft = "draft",
  rejected = "rejected",
  archive = "archive",
  assets = "assets",
}

export enum Author {
  self = "{self}",
}

export enum OrderBy {
  id = "id",
  _id = "-id",
  created_at = "create_at",
  _created_at = "-create_at",
  updated_at = "update_at",
  _updated_at = "-update_at",
  content_name = "content_name",
  _content_name = "-content_name",
}

export enum OutcomePublishStatus {
  published = "published",
  pending = "pending",
  draft = "draft",
  rejected = "rejected",
}

export enum OutcomeOrderBy {
  name = "name",
  _name = "-name",
  created_at = "created_at",
  _created_at = "-created_at",
  updated_at = "updated_at",
  _updated_at = "-updated_at",
}

export enum AssessmentStatus {
  all = "all",
  in_progress = "in_progress",
  complete = "complete",
}

export enum AssessmentOrderBy {
  class_end_time = "class_end_time",
  _class_end_time = "-class_end_time",
  complete_time = "complete_time",
  _complete_time = "-complete_time",
}

export type ListAssessmentRequest = Parameters<typeof api.assessments.listAssessment>[0];
export type ListAssessmentResult = NonNullable<AsyncReturnType<typeof api.assessments.listAssessment>>;
export type ListAssessmentResultItem = NonNullable<ListAssessmentResult["items"]>[0];

export type GetAssessmentRequest = Parameters<typeof api.assessments.getAssessment>[0];
export type GetAssessmentResult = NonNullable<AsyncReturnType<typeof api.assessments.getAssessment>>;
export type GetAssessmentResultAttendance = NonNullable<GetAssessmentResult["attendances"]>[0];
export type GetAssessmentResultOutcomeAttendanceMap = NonNullable<GetAssessmentResult["outcome_attendance_maps"]>[0];

export type UpdateAssessmentRequestId = Parameters<typeof api.assessments.updateAssessment>[0];
export type UpdateAssessmentRequestData = Parameters<typeof api.assessments.updateAssessment>[1];
export type UpdateAssessmentRequestDatAattendanceIds = NonNullable<UpdateAssessmentRequestData>["attendance_ids"];

export enum SearchContentsRequestContentType {
  material = "1",
  plan = "2",
  assets = "3",
  materialandplan = "1,2",
}

export enum H5pSub {
  delete = "delete",
  download = "download",
  edit = "edit",
  new = "new",
  view = "view",
}
