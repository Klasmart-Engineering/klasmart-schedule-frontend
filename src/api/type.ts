import api from ".";

type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

export enum ContentType {
  image = 10,
  video = 11,
  audio = 12,
  doc = 13,
  assets = 3,
  plan = 2,
  material = 1,
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
  created_at = "created_at",
  _created_at = "-created_at",
  updated_at = "updated_at",
  _updated_at = "-updated_at",
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

export enum Assets {
  assets_type = "3",
  assets_name = "Assets",
}
