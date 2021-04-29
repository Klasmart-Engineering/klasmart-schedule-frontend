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

export type HomeFunAssessmentQueryCondition = NonNullRecordValue<NonNullable<Parameters<typeof api.homeFunStudies.listHomeFunStudies>[0]>>;
export type HomeFuAssessmentQueryConditionChangeHandler = (value: HomeFunAssessmentQueryCondition) => any;
export type HomeFunAssessmentQueryConditionBaseProps = {
  onChange: HomeFuAssessmentQueryConditionChangeHandler;
  value: HomeFunAssessmentQueryCondition;
};

export enum BulkListFormKey {
  CHECKED_BULK_IDS = "CHECKED_BULK_IDS",
}

export type GetOutcomeIDList = Parameters<typeof api.bulk.deleteOutcomeBulk>[0];
export interface BulkListForm {
  [BulkListFormKey.CHECKED_BULK_IDS]: NonNullRecordValue<NonNullable<GetOutcomeIDList["outcome_ids"]>>;
}

export enum HeaderCategory {
  assessment = "assessments",
  outcome = "outcome",
}
