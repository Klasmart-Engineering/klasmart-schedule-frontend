import api from "../../../api";

type NonOnlyNull<T> = T extends null ? never : T;
type NonNullRecordValue<T> = {
  [K in keyof T]: NonOnlyNull<T[K]>;
};

export type MilestoneQueryCondition = NonNullRecordValue<NonNullable<Parameters<typeof api.milestones.searchMilestone>[0]>> & {
  is_unpub?: string;
};

export enum MilestoneListExectSearch {
  all = "search_key",
  description = "description",
  name = "name",
  shortcode = "shortcode",
}
export type MilestoneQueryConditionChangeHandler = (value: MilestoneQueryCondition) => any;
export type MilestoneQueryConditionBaseProps = {
  onChange: MilestoneQueryConditionChangeHandler;
  value: MilestoneQueryCondition;
};

export enum BulkListFormKey {
  CHECKED_BULK_IDS = "CHECKED_BULK_IDS",
  SEARCH_TEXT_KEY = "SEARCH_TEXT_KEY",
  EXECT_SEARCH = "EXECT_SEARCH",
}

export interface BulkListForm {
  [BulkListFormKey.CHECKED_BULK_IDS]: NonNullRecordValue<NonNullable<Parameters<typeof api.milestones.deleteMilestone>[0]["ids"]>>;
  [BulkListFormKey.SEARCH_TEXT_KEY]: string;
  [BulkListFormKey.EXECT_SEARCH]: string;
}
