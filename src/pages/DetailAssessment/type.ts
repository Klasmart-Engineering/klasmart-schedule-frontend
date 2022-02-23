import { UpdataAssessmentData } from "../ListAssessment/types";

export type UpdateAssessmentDataOmitAction = Omit<UpdataAssessmentData, "action">;

export enum StudentParticipate {
  Participate = "Participate",
  NotParticipate = "NotParticipate",
}

export enum OutcomeStatus {
  Unknown = "Unknown",
  NotCovered = "NotCovered",
  NotAchieved = "NotAchieved",
  Achieved = "Achieved",
}

export interface OutcomeBaseProps {
  assumed?: boolean;
  outcome_id?: string;
  outcome_name?: string;
  status?: "Unknown" | "NotCovered" | "NotAchieved" | "Achieved";
}

export interface StudenmtViewItemResultOutcomeProps extends OutcomeBaseProps {
  // assumed?: boolean;
  // outcome_id?: string;
  // outcome_name?: string;
  // status?: "Default" | "NotCovered" | "NotAchieved" | "Achieved";
  assigned_to?: ("LessonPlan" | "LessonMaterial" | undefined)[];
}
export interface MaterialViewItemStudentProps {
  student_id?: string;
  student_name?: string;
  answer?: string;
  score?: number;
  attempted?: boolean;
  // file_type?: string;
  // max_score?: number;
}
export interface MaterialViewItemResultOutcomeProps extends OutcomeBaseProps {
  attendance_ids?: string[];
}
export interface ResultBaseProps {
  answer?: string;
  attempted?: boolean;
  content_id?: string;
  score?: number;
  sub_content_id?: string;

  content_name?: string;
  content_type?: "LessonPlan" | "LessonMaterial" | "Unknown";
  content_subtype?: string;
  file_type?: "Unknown" | "HasChildContainer" | "NotChildContainer" | "SupportScoreStandAlone" | "NotSupportScoreStandAlone";
  max_score?: number;
  number?: string;
  parent_id?: string;
  h5p_id?: string;
  status?: "Covered" | "NotCovered";
}
export interface StudenmtViewItemResultProps extends ResultBaseProps {
  outcomes?: StudenmtViewItemResultOutcomeProps[];
}
export interface MaterialViewItemResultProps extends ResultBaseProps {
  outcomes?: MaterialViewItemResultOutcomeProps[];
  students?: MaterialViewItemStudentProps[];
}
export interface StudentViewItemsProps {
  status?: "Participate" | "NotParticipate";
  student_id?: string;
  student_name?: string;
  reviewer_comment?: string;
  result?: StudenmtViewItemResultProps[];
}

export type OverAllOutcomesItem = {
  assigned_to?: ("LessonPlan" | "LessonMaterial" | undefined)[];
  assumed?: boolean;
  attendance_ids?: string[];
  checked?: boolean;
  none_achieved?: boolean;
  outcome_id?: string;
  outcome_name?: string;
  skip?: boolean;
  partial_attendance_ids?: string[];
  not_attendance_ids?: string[];
  associated_contents?: string[];
};

export interface EditScoreProps {
  fileType: StudenmtViewItemResultProps["file_type"];
  attempted?: boolean;
  score?: number;
  // handleChangeScore: (score?: number, indexSub?: number, student_id?: string) => void;
  editable?: boolean;
  isSubjectiveActivity: boolean;
  maxScore?: number;
  isComplete?: boolean;
  studentId?: string;
  contentId?: string;
  subType?: string;
  onChangeScore: (score?: number, studentId?: string, contentId?: string) => void;
}
export enum FileTypes {
  Unknown = "Unknown",
  HasChildContainer = "HasChildContainer",
  NotChildContainer = "NotChildContainer",
  SupportScoreStandAlone = "SupportScoreStandAlone",
  NotSupportScoreStandAlone = "NotSupportScoreStandAlone",
}
export interface SubDimensionOptions {
  id: string;
  name: string;
}
