export type QueryCondition = {
  category?: string | undefined;
  teacher?: string | undefined;
  class_search?: string | undefined;
  lesson_plan?: string | undefined;
  filter?: string | undefined;
  order_by?: string | undefined;
};
export type QueryConditionChangeHandler = (value: QueryCondition) => any;
export type QueryConditionBaseProps = {
  onChange: QueryConditionChangeHandler;
  value: QueryCondition;
};
