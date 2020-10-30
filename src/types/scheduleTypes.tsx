import { MockOptionsItem } from "../api/extra";

export type timestampType = {
  start: number;
  end: number;
};

export interface RouteParams {
  rightside: "scheduleTable" | "scheduleList";
  model: "edit" | "preview";
}

export type modeViewType = "month" | "day" | "work_week" | "week";

export type repeatOptionsType = "only_current" | "with_following";

export type FilterType = "Schools" | "Teacher" | "Classes" | "Subjects" | "Programs";

type endType = {
  type: string;
  after_count: number;
  after_time: number;
};

type dailyType = {
  interval: number;
  end: endType;
};

type weeklyType = {
  interval: number;
  on: string[];
  end: endType;
};

type monthlyType = {
  interval: number;
  on_type: string;
  on_date_day: number;
  on_week_seq: string;
  on_week: string;
  end: endType;
};

type yearlyType = {
  interval: number;
  on_type: string;
  on_date_month: number;
  on_date_day: number;
  on_week_month: number;
  on_week_seq: string;
  on_week: string;
  end: endType;
};

export interface stateProps {
  type: string;
  daily: dailyType;
  weekly: weeklyType;
  monthly: monthlyType;
  yearly: yearlyType;
}

export interface AlertDialogProps {
  title?: string;
  text?: string;
  radios?: Array<any>;
  buttons: Array<any>;
  openStatus: boolean;
  handleClose: (text: string) => any;
  handleChange: (value: number) => any;
  radioValue?: number;
  customizeTemplate?: any;
  enableCustomization?: boolean;
}

export interface ScheduleFilterProps {
  name: FilterType;
  child: MockOptionsItem[];
  label:
    | "schedule_filter_schools"
    | "schedule_filter_teachers"
    | "schedule_filter_classes"
    | "schedule_filter_programs"
    | "schedule_filter_subjects";
}

export interface FilterQueryTypeProps {
  org_ids: string;
  teacher_ids: string;
  class_ids: string;
  subject_ids: string;
  program_ids: string;
}
