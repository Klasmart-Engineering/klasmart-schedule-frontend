import api from "../../../api";
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;
type NonOnlyNull<T> = T extends null ? never : T;
type NonNullRecordValue<T> = {
  [K in keyof T]: NonOnlyNull<T[K]>;
};
export type AssessmentQueryCondition = NonNullRecordValue<NonNullable<Parameters<typeof api.assessmentsV2.queryAssessmentV2>[0]>>;

// export type NoStatusAssessmentQueryCondition = Omit<AssessmentQueryCondition, "status">;
// export interface CustomAssessmentQueryCondition extends NoStatusAssessmentQueryCondition {
//   status?: "all" | "in_progress" | "complete"
// }
export enum SearchListFormKey {
  EXECT_SEARCH = "EXECT_SEARCH",
  SEARCH_TEXT = "SEARCH_TEXT",
}
export interface SearchListForm {
  [SearchListFormKey.EXECT_SEARCH]: NonNullable<AssessmentQueryCondition["query_type"]>;
  [SearchListFormKey.SEARCH_TEXT]: NonNullable<AssessmentQueryCondition["query_key"]>;
}
export type AssessmentQueryConditionChangeHandler = (value: AssessmentQueryCondition) => any;
export type AssessmentQueryConditionBaseProps = {
  onChange: AssessmentQueryConditionChangeHandler;
  value: AssessmentQueryCondition;
};

export enum AssessmentOrderBy {}

export type AssessmentListResult = NonNullable<AsyncReturnType<typeof api.assessmentsV2.queryAssessmentV2>["assessments"]>;
export type DetailAssessmentResult = NonNullable<AsyncReturnType<typeof api.assessmentsV2.getAssessmentDetailV2>>;
export type UpdataAssessmentData = Parameters<typeof api.assessmentsV2.updateAssessmentV2>[1];
export enum ContentType {
  LessonPlan = "LessonPlan",
  LessonMaterial = "LessonMaterial",
  ScheduleAttachment = "ScheduleAttachment",
  Unknown = "Unknow",
}
export type DetailAssessmentResultContent = NonNullable<DetailAssessmentResult["contents"]>[0];
export type DetailAssessmentResultOutcome = NonNullable<DetailAssessmentResult["outcomes"]>[0];
export type DetailAssessmentResultStudent = NonNullable<DetailAssessmentResult["students"]>[0];
export type DetailAssessmentStudentResult = NonNullable<DetailAssessmentResultStudent["results"]>[0];
export type DetailAssessmentResultFeedback = NonNullable<DetailAssessmentStudentResult["student_feed_backs"]>[0];
export type DetailAssessmentResultAssignment = NonNullable<DetailAssessmentResultFeedback["assignments"]>[0];

export enum AssessmentStatus {
  all = "all",
  in_progress = "InComplete",
  complete = "Complete",
}

export enum AssessmentStatusValues {
  class_live_homefun_all = "Started,Draft,Complete",
  study_all = "NotStarted,Started,Draft,Complete",
  class_live_homefun_inprogress = "Started,Draft",
  study_inprogress = "NotStarted,Started,Draft",
  complete = "Complete",
}
