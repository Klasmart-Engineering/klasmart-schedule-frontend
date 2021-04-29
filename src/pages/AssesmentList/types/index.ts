import api from "../../../api";

type NonOnlyNull<T> = T extends null ? never : T;
type NonNullRecordValue<T> = {
  [K in keyof T]: NonOnlyNull<T[K]>;
};

export type OutcomeQueryCondition = NonNullRecordValue<NonNullable<Parameters<typeof api.learningOutcomes.searchLearningOutcomes>[0]>>;
export type OutcomeQueryConditionChangeHandler = (value: OutcomeQueryCondition) => any;
export type OutcomeQueryConditionBaseProps = {
  onChange: OutcomeQueryConditionChangeHandler;
  value: OutcomeQueryCondition;
};

export type AssessmentQueryCondition = NonNullRecordValue<NonNullable<Parameters<typeof api.assessments.listAssessment>[0]>>;
export type AssessmentQueryConditionChangeHandler = (value: AssessmentQueryCondition) => any;
export type AssessmentQueryConditionBaseProps = {
  onChange: AssessmentQueryConditionChangeHandler;
  value: AssessmentQueryCondition;
};

export enum BulkListFormKey {
  CHECKED_BULK_IDS = "CHECKED_BULK_IDS",
}

export type GetApiOutcomeIdList = NonNullRecordValue<NonNullable<Parameters<typeof api.bulk.deleteOutcomeBulk>[0]>>;
export interface BulkListForm {
  [BulkListFormKey.CHECKED_BULK_IDS]: GetApiOutcomeIdList["outcome_ids"];
}

export enum HeaderCategory {
  assessment = "assessments",
  outcome = "outcome",
}
