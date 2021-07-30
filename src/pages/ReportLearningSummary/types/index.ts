import api from "../../../api";
type NonOnlyNull<T> = T extends null ? never : T;
type NonNullRecordValue<T> = {
  [K in keyof T]: NonOnlyNull<T[K]>;
};
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;
export type QueryLearningSummaryCondition = NonNullRecordValue<NonNullable<Parameters<typeof api.reports.queryLiveClassesSummary>[0]>>;
export type QueryLearningSummaryConditionChangeHandler = (value: QueryLearningSummaryCondition) => any;
export type QueryLearningSummaryConditionBaseProps = {
  onChange: QueryLearningSummaryConditionChangeHandler;
  value: QueryLearningSummaryCondition;
};
export enum ReportType {
  live = "live",
  assignment = "assignment",
}
export type LiveClassesSummaryResult = AsyncReturnType<typeof api.reports.queryLiveClassesSummary>;
export type LiveClassesSummaryResultItem = NonNullable<LiveClassesSummaryResult["items"]>[0];
export type AssignmentSummaryResult = AsyncReturnType<typeof api.reports.queryAssignmentsSummary>;
export type AssignmentSummaryResultItem = NonNullable<AssignmentSummaryResult["items"]>[0];

export type ReportInfoBaseProps = {
  liveClassSummary: LiveClassesSummaryResult;
  assignmentSummary: AssignmentSummaryResult;
  reportType: ReportType;
};
