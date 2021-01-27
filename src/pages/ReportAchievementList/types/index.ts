export type QueryCondition = {
  category?: string | undefined;
  teacher_id?: string | undefined;
  class_id?: string | undefined;
  lesson_plan_id?: string | undefined;
  status?: ReportFilter;
  sort_by?: ReportOrderBy;
  student_id?: string | undefined;
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
  ascending = "asc",
  descending = "desc",
}

export enum StatusColor {
  achieved = "#8693f0",
  not_achieved = "#fe9b9b",
  not_attempted = "#dadada",
}
export interface ClassItem {
  class_id: string;
  class_name: string;
}
export interface ClassList {
  user: {
    classesTeaching: ClassItem[];
  };
}
export const ALL_STUDENT = "all";
