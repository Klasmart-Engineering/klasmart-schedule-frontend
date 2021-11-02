import { IWeeks } from "..";
import api from "../../../api";
import { Maybe, Status } from "../../../api/api-ko-schema.auto";

type NonOnlyNull<T> = T extends null ? never : T;
type NonNullRecordValue<T> = {
  [K in keyof T]: NonOnlyNull<T[K]>;
};
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;
export type QueryLearningSummaryCondition = NonNullRecordValue<NonNullable<Parameters<typeof api.reports.queryLiveClassesSummary>[0]>> & {
  lessonIndex?: number;
};
export type QueryLearningSummaryConditionChangeHandler = (value: QueryLearningSummaryCondition) => any;
export type QueryLearningSummaryConditionBaseProps = {
  onChange: QueryLearningSummaryConditionChangeHandler;
  value: QueryLearningSummaryCondition;
};
export enum ReportType {
  live = "live_class",
  assignment = "assignment",
}
export type LiveClassesSummaryResult = AsyncReturnType<typeof api.reports.queryLiveClassesSummary>;
export type LiveClassesSummaryResultItem = NonNullable<LiveClassesSummaryResult["items"]>[0];
export type AssignmentSummaryResult = AsyncReturnType<typeof api.reports.queryAssignmentsSummary>;
export type AssignmentSummaryResultItem = NonNullable<AssignmentSummaryResult["items"]>[0];

export type ReportInfoBaseProps = {
  liveClassSummary: LiveClassesSummaryResult;
  assignmentSummary: AssignmentSummaryResult;
  reportType: QueryLearningSummaryTimeFilterCondition["summary_type"];
  onChangeLessonIndex: (index: number) => void;
};
export type QueryLearningSummaryTimeFilterCondition = NonNullRecordValue<
  NonNullable<Parameters<typeof api.reports.queryLearningSummaryTimeFilter>[0]>
>;
export type QueryLearningSummaryRemainingFilterCondition = {
  class_id?: string;
  class_name?: string;
  school_id?: string;
  school_name?: string;
  student_id?: string;
  student_name?: string;
  subject_id?: string;
  subject_name?: string;
  teacher_id?: string;
  teacher_name?: string;
  week_end?: number;
  week_start?: number;
  year?: number;
};
export type ArrProps = {
  id: string | undefined;
  name: string | undefined;
};
export type TimeFilter = {
  week_start?: number;
  week_end?: number;
  year?: number;
  years?: number[];
  weeks?: IWeeks[];
  school_id?: string;
};
export enum OutcomeStatus {
  achieved = "achieved",
  not_achieved = "not_achieved",
  partially = "partially",
}
export interface ISelect {
  label: string;
  value: string;
}
export type UserType = {
  id: string;
  name: string;
  classes: {
    id: string;
    name: string;
    status: Maybe<Status> | undefined;
    students: {
      id: string;
      name: string;
    }[];
  }[];
};
