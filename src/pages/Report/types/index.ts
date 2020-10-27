export type QueryCondition = {
  category?: string | undefined;
  teacher?: string | undefined;
  class_search?: string | undefined;
  lesson_plain_id?: string | undefined;
  filter?: string | undefined;
  order_by?: string | undefined;
};
export type QueryConditionChangeHandler = (value: QueryCondition) => any;
export type QueryConditionBaseProps = {
  onChange: QueryConditionChangeHandler;
  value: QueryCondition;
};
export enum ReportFilter {
  achieved = "achieved",
  not_achieved = "not_achieved",
  not_attempted = "not_attempted",
  all = "all",
}
export enum ReportOrderBy {
  ascending = "ascending",
  descending = "descending",
}
