import api from "../../../api";
import { ApiOutcomeIDList } from "../../../api/api.auto";

type NonOnlyNull<T> = T extends null ? never : T;
type NonNullRecordValue<T> = {
  [K in keyof T]: NonOnlyNull<T[K]>;
};

export type OutcomeQueryCondition = NonNullRecordValue<NonNullable<Parameters<typeof api.learningOutcomes.searchLearningOutcomes>[0]>> & {
  is_unpub?: string;
  exect_search?: string;
};
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
  SEARCH_TEXT_KEY = "SEARCH_TEXT_KEY",
  EXECT_SEARCH = "EXECT_SEARCH",
}

export interface BulkListForm {
  [BulkListFormKey.CHECKED_BULK_IDS]: NonNullable<ApiOutcomeIDList["outcome_ids"]>;
  [BulkListFormKey.SEARCH_TEXT_KEY]: string;
  [BulkListFormKey.EXECT_SEARCH]: string;
}

export enum HeaderCategory {
  assessment = "assessments",
  outcome = "outcome",
  milestones = "milestones",
  standards = "standards",
}

export enum OutcomeListExectSearch {
  all = "all",
  loName = "loName",
  shortCode = "shortCode",
  author = "author",
  loSet = "loSet",
  keyWord = "keyWord",
  description = "description",
}
