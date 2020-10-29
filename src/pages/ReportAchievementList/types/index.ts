export type QueryCondition = {
  category?: string | undefined;
  teacher_id?: string | undefined;
  class_id?: string | undefined;
  lesson_plan_id?: string | undefined;
  lesson_plan_name?: string | undefined;
  status?: ReportFilter;
  order_by?: ReportOrderBy;
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

export enum StatusColor {
  achieved = "#8693f0",
  not_achieved = "#fe9b9b",
  not_attempted = "#dadada",
}
