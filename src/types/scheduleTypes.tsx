import {
  EntityScheduleDetailsView,
  EntityScheduleFilterClass,
  EntityScheduleLessonPlan,
  EntityScheduleListView,
  EntityScheduleViewDetail,
  ModelOutcomeSetCreateView,
} from "../api/api.auto";
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

export type memberType = "Admin" | "School" | "Teacher" | "Student";

export type classTypeLabel =
  | "schedule_detail_online_class"
  | "schedule_detail_offline_class"
  | "schedule_detail_homework"
  | "schedule_detail_task";

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
  showScheduleInfo?: boolean;
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
  class_types: string[];
  class_ids: string[];
  subject_ids: string[];
  program_ids: string[];
  user_ids: string[];
}

export interface ClassOptionsItem {
  id?: string;
  name?: string;
  enable?: boolean;
}

export interface EntityLessonPlanShortInfo {
  title?: string;
  id?: string;
  name?: string;
}

export interface ParticipantsShortInfo {
  student: ClassOptionsItem[];
  teacher: ClassOptionsItem[];
}

export interface RolesData {
  user_id: string;
  user_name: string;
  school_memberships?: EntityScheduleSchoolsInfo;
}

export interface ClassesData {
  students: RolesData[];
  teachers: RolesData[];
}

export interface ParticipantsData {
  classes: ClassesData;
  total?: number;
  hash: {
    teacher?: string;
    student?: string;
  };
  next: {
    teacher?: boolean;
    student?: boolean;
  };
}

export interface EntityScheduleShortInfo {
  id?: string;
  name?: string;
}

export interface EntityScheduleSchoolsInfo {
  school_id: string;
  school_name: string;
}

export interface EntityScheduleClassInfo extends ClassesData {
  class_id?: string;
  class_name?: string;
  status: string;
  schools: EntityScheduleSchoolsInfo[];
}

export interface EntityScheduleClassesInfo extends ClassesData {
  class_id: string;
  class_name: string;
  status: string;
}

export interface EntityScheduleSchoolInfo {
  school_id: string;
  school_name: string;
  classes: EntityScheduleClassesInfo[];
}

export interface ConflictsData {
  class_roster_teachers: EntityScheduleShortInfo[];
  class_roster_students: EntityScheduleShortInfo[];
  participants_teachers: EntityScheduleShortInfo[];
  participants_students: EntityScheduleShortInfo[];
}

export interface ChangeParticipants {
  type: string;
  data: ParticipantsShortInfo;
}

export interface scheduleInfoViewProps {
  end: Date;
  id: string;
  start: Date;
  title: string;
  is_repeat: boolean;
  lesson_plan_id: string;
  status: string;
  class_type: string;
  class_id: string;
  due_at: number;
  exist_feedback: boolean;
  is_home_fun: boolean;
  is_hidden: boolean;
  role_type: string;
  exist_assessment: boolean;
  complete_assessment: boolean;
  lesson_plan: EntityScheduleLessonPlan;
  class_type_label: EntityScheduleShortInfo;
}

export interface FilterDataItemsProps {
  id: string;
  name: string;
  isCheck: boolean;
  isOnlyMine: boolean;
  child: FilterDataItemsProps[];
  showIcon?: boolean;
  existData: string[];
  isHide: boolean;
  onLyMineData: string[];
}

export interface ScheduleEditExtend extends EntityScheduleDetailsView {
  class_id: string;
  lesson_plan_id: string;
  complete_assessment: boolean;
  lesson_plan: EntityScheduleLessonPlan;
}

export interface EntityScheduleViewDetailExtend extends EntityScheduleViewDetail {
  complete_assessment?: boolean;
}

export interface EntityScheduleListViewExtend extends EntityScheduleListView {
  lesson_plan?: EntityScheduleLessonPlan;
}

export interface FilterItemInfo {
  label: string;
  self_id: string;
  school_id: string;
}

export interface filterOptionItem {
  classType: EntityScheduleShortInfo[];
  programs: EntityScheduleShortInfo[];
  others: EntityScheduleFilterClass[];
}

export interface FilterClasses {
  class_id: string;
  name: string;
  showIcon: boolean;
}

export interface FilterSchoolInfo {
  school_name: string;
  school_id: string;
  classes: FilterClasses[];
  onlyMine: boolean;
}

export interface LearningContentList {
  id: string;
  name: string;
  shortCode: string;
  assumed: boolean;
  learningOutcomeSet: ModelOutcomeSetCreateView[];
  select: boolean;
  category_ids: string[];
  sub_category_ids: string[];
}
export interface LearningContentListForm {
  search_type: string;
  search_value: string;
  is_assumed: boolean;
  content_list: LearningContentList[];
  page: number;
}

export interface LearningComesFilterQuery {
  programs: string[];
  subjects: string[];
  categorys: string[];
  subs: string[];
  ages: string[];
  grades: string[];
}

export enum ParticipantValue {
  student = "Student",
  teacher = "Teacher",
}
export type ParticipantString = {
  key: "Student" | "Teacher";
};
export type ParticipantRoleId = {
  Student?: string;
  Teacher?: string;
};

export interface LessonPlanFilterQuery {
  programs: string[];
  subjects: string[];
  categorys: string[];
  subs: string[];
  ages: string[];
  grades: string[];
  group_names: string[];
  page: number;
  pages: number;
  lesson_plan_name: string;
}
