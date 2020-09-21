import api from "../../../api";
import { ApiOutcomeIDList } from "../../../api/api.auto";

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

export type AssesmentQueryCondition = NonNullRecordValue<NonNullable<Parameters<typeof api.assessments.listAssessment>[0]>>;
export type AssesmentQueryConditionChangeHandler = (value: AssesmentQueryCondition) => any;
export type AssesmentQueryConditionBaseProps = {
  onChange: AssesmentQueryConditionChangeHandler;
  value: AssesmentQueryCondition;
};

export enum BulkListFormKey {
  CHECKED_BULK_IDS = "CHECKED_BULK_IDS",
}

export interface BulkListForm {
  [BulkListFormKey.CHECKED_BULK_IDS]: NonNullable<ApiOutcomeIDList["outcome_ids"]>;
}

export enum HeaderCategory {
  assessment = "assessments",
  outcome = "outcome",
}
