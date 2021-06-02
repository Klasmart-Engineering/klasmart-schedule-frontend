import api from ".";
import { apiGetContentTypeList } from "./extra";

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
  folder = 10,
}

export enum ContentFileType {
  image = 1,
  video = 2,
  audio = 3,
  doc = 7,
  h5p = 5,
  h5pExtend = 6,
  pdf = 4,
}

export enum ContentInputSourceType {
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

export enum AssessmentUpdateAction {
  save = "save",
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
export type GetAssessmentResultAttendance = NonNullable<GetAssessmentResult["students"]>[0];
export type GetAssessmentResultOutcomeAttendanceMap = NonNullable<GetAssessmentResult["outcomes"]>[0];

export type UpdateAssessmentRequestId = Parameters<typeof api.assessments.updateAssessment>[0];
export type UpdateAssessmentRequestData = Parameters<typeof api.assessments.updateAssessment>[1];
export type UpdateAssessmentRequestDatAattendanceIds = NonNullable<UpdateAssessmentRequestData>["attendance_ids"];
export type UpdateAssessmentRequestDataLessonMaterials = NonNullable<UpdateAssessmentRequestData>["lesson_materials"];

export enum SearchContentsRequestContentType {
  material = "1",
  plan = "2",
  assets = "3",
  materialandplan = "1,2,10",
  folder = "10",
  assetsandfolder = "3,10",
}

export enum H5pSub {
  delete = "delete",
  download = "download",
  edit = "edit",
  new = "new",
  view = "view",
}

export enum FolderPartition {
  assets = "assets",
  plansAndMaterials = "plans and materials",
}

export enum FolderItemType {
  folder = 1,
  file = 2,
}

export enum FolderOwnerType {
  org = 1,
  private = 2,
}

export enum FolderFileTyoe {
  folder = "folder",
  content = "content",
}

export type ContentTypeList = AsyncReturnType<typeof apiGetContentTypeList>;

export enum HomeFunAssessmentOrderBy {
  latest_feedback_at = "latest_feedback_at",
  _latest_feedback_at = "-latest_feedback_at",
  complete_at = "complete_at",
  _complete_at = "-complete_at",
}

export enum HomeFunAssessmentStatus {
  all = "all",
  in_progress = "in_progress",
  complete = "complete",
}

export type GetOutcomeListResult = AsyncReturnType<typeof api.learningOutcomes.searchLearningOutcomes>;
export type GetOutcomeList = NonNullable<GetOutcomeListResult["list"]>;
export type GetOutcomeDetail = NonNullable<GetOutcomeListResult["list"]>[0];
export type OutcomeSetResult = NonNullable<AsyncReturnType<typeof api.sets.pullOutcomeSet>["sets"]>;

export enum MilestoneStatus {
  published = "published",
  unpublished = "draft",
}
export enum MilestoneOrderBy {
  name = "name",
  _name = "-name",
  created_at = "created_at",
  _created_at = "-created_at",
  updated_at = "updated_at",
  _updated_at = "-updated_at",
}

export type SearchMilestonneResult = AsyncReturnType<typeof api.milestones.searchMilestone>;
export type MilestoneListResult = SearchMilestonneResult["milestones"];
export type MilestoneDetailResult = NonNullable<MilestoneListResult>[0];

export enum StudyAssessmentOrderBy {
  create_at = "create_at",
  _create_at = "-create_at",
  complete_at = "complete_time",
  _complete_at = "-complete_time",
}

export type ListStudyAssessment = AsyncReturnType<typeof api.studyAssessments.listStudyAssessments>["items"];
export type ListStudyAssessmentItem = NonNullable<ListStudyAssessment>[0];
export type DetailStudyAssessment = AsyncReturnType<typeof api.studyAssessments.getStudyAssessmentDetail>;

export type UpdataStudyAssessmentRequestData = Parameters<typeof api.studyAssessments.updateStudyAssessment>[1];
export type UpdateStudyAssessmentStudentIds = NonNullable<UpdataStudyAssessmentRequestData["student_ids"]>;
export enum ExectSeachType {
  all = "all",
  class_name = "class_name",
  teacher_name = "teacher_name",
}
