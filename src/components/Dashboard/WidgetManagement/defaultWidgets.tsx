import { WidgetType } from "../../../components/Dashboard/models/widget.model";

import { ReactElement } from "react";

export type Widgets = { [P: string]: ReactElement };

export type Layout = { i: WidgetType; x: number; y: number; h: number; w: number };

export type Layouts = { [P: string]: Layout[] };

export enum WidgetView {
  TEACHER = `teacher`,
  STUDENT = `student`,
  DEFAULT = `default`,
}

export const defaultTeacherLgLayout: Layout[] = [
  /* eslint-disable */
  { i: WidgetType.SCHEDULE, x: 0, y: 0, h: 2, w: 12 },
  { i: WidgetType.NEXTCLASS, x: 0, y: 1, h: 3, w: 4 },
  { i: WidgetType.ATTENDANCERATE, x: 4, y: 1, h: 3, w: 4 },
  { i: WidgetType.PENDINGASSESSMENTS, x: 8, y: 1, h: 3, w: 4 },
  { i: WidgetType.TEACHERLOAD, x: 0, y: 2, h: 3, w: 4 },
  { i: WidgetType.CONTENTSTATUS, x: 4, y: 2, h: 3, w: 4 },
  /* eslint-enable */
];

export const defaultTeacherMdLayout: Layout[] = [
  /* eslint-disable */
  { i: WidgetType.SCHEDULE, x: 0, y: 0, h: 2, w: 12 },
  { i: WidgetType.NEXTCLASS, x: 0, y: 1, h: 3, w: 6 },
  { i: WidgetType.ATTENDANCERATE, x: 6, y: 1, h: 3, w: 6 },
  { i: WidgetType.PENDINGASSESSMENTS, x: 0, y: 2, h: 3, w: 6 },
  { i: WidgetType.TEACHERLOAD, x: 6, y: 2, h: 3, w: 6 },
  { i: WidgetType.CONTENTSTATUS, x: 0, y: 3, h: 3, w: 6 },
  /* eslint-enable */
];

export const defaultTeacherSmLayout: Layout[] = [
  /* eslint-disable */
  { i: WidgetType.SCHEDULE, x: 0, y: 4, h: 3, w: 12 },
  { i: WidgetType.NEXTCLASS, x: 0, y: 0, h: 4, w: 12 },
  { i: WidgetType.ATTENDANCERATE, x: 0, y: 8, h: 3, w: 12 },
  { i: WidgetType.PENDINGASSESSMENTS, x: 0, y: 12, h: 3, w: 12 },
  { i: WidgetType.TEACHERLOAD, x: 0, y: 16, h: 3, w: 12 },
  { i: WidgetType.CONTENTSTATUS, x: 0, y: 20, h: 3, w: 12 },
  /* eslint-enable */
];

export const defaultStudentLgLayout: Layout[] = [
  /* eslint-disable */
  { i: WidgetType.STUDENTSCHEDULE, x: 0, y: 0, h: 6, w: 6 },
  { i: WidgetType.FEEDBACK, x: 7, y: 0, h: 3, w: 6 },
  { i: WidgetType.STUDENTATTENDANCE, x: 7, y: 7, h: 3, w: 6 },
  { i: WidgetType.ACHIEVEMENT, x: 7, y: 11, h: 3, w: 6 },
  { i: WidgetType.ADAPTIVELEARNING, x: 0, y: 7, h: 3, w: 6 },
  { i: WidgetType.LEARNINGOUTCOME, x: 7, y: 4, h: 3, w: 6 },
  { i: WidgetType.COMPLETION, x: 0, y: 14, h: 3, w: 6 },
  /* eslint-enable */
];

export const defaultStudentMdLayout: Layout[] = [
  /* eslint-disable */
  { i: WidgetType.STUDENTSCHEDULE, x: 0, y: 0, h: 6, w: 6 },
  { i: WidgetType.FEEDBACK, x: 7, y: 0, h: 3, w: 6 },
  { i: WidgetType.STUDENTATTENDANCE, x: 7, y: 7, h: 3, w: 6 },
  { i: WidgetType.ACHIEVEMENT, x: 7, y: 11, h: 3, w: 6 },
  { i: WidgetType.ADAPTIVELEARNING, x: 0, y: 7, h: 3, w: 6 },
  { i: WidgetType.LEARNINGOUTCOME, x: 7, y: 4, h: 3, w: 6 },
  { i: WidgetType.COMPLETION, x: 0, y: 14, h: 3, w: 6 },
  /* eslint-enable */
];

export const defaultStudentSmLayout: Layout[] = [
  /* eslint-disable */
  { i: WidgetType.STUDENTSCHEDULE, x: 0, y: 0, h: 4, w: 12 },
  { i: WidgetType.FEEDBACK, x: 0, y: 5, h: 3, w: 12 },
  { i: WidgetType.STUDENTATTENDANCE, x: 0, y: 17, h: 4, w: 12 },
  { i: WidgetType.ACHIEVEMENT, x: 0, y: 26, h: 3, w: 12 },
  { i: WidgetType.ADAPTIVELEARNING, x: 0, y: 13, h: 3, w: 12 },
  { i: WidgetType.LEARNINGOUTCOME, x: 0, y: 9, h: 3, w: 12 },
  { i: WidgetType.COMPLETION, x: 0, y: 22, h: 3, w: 12 },
  /* eslint-enable */
];
