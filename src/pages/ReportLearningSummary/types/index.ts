export type QueryLearningSummaryCondition = {
  year?: string | undefined;
  week?: string | undefined;
  school?: string | undefined;
  class_id?: string | undefined;
  teacher_id?: string | undefined;
  student_id?: string | undefined;
  subject_id?: string | undefined;
};

export enum ReportType {
  live = "live",
  assignment = "assignment",
}
