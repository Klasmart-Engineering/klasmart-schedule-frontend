import { AssessmentTypeValues } from "../../components/AssessmentType";
import { PLField } from "../../components/PLTable";
import { d } from "../../locale/LocaleManager";

export function assessmentHeader(type?: string): PLField[] {
  const classAndLiveHeader: PLField[] = [
    {
      text: d("Assessment Title").t("assess_column_title"),
      value: "title",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Lesson Plan").t("library_label_lesson_plan"),
      value: "content",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Subject").t("assess_column_subject"),
      value: "subject",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Program").t("assess_column_program"),
      value: "program",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Status").t("assess_filter_column_status"),
      value: "status",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Teacher").t("assess_column_teacher"),
      value: "teacher",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Class End Time").t("assess_column_class_end_time"),
      value: "classendtime",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Complete Time").t("assess_column_complete_time"),
      value: "completetime",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
  ];
  const studyHeader: PLField[] = [
    {
      text: d("Study Title").t("assess_list_study_title"),
      value: "title",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Lesson Plan").t("library_label_lesson_plan"),
      value: "content",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Teacher Name").t("schedule_label_teacher_name"),
      value: "teacher",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Class Name").t("assess_detail_class_name"),
      value: "class",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Due Date").t("assess_column_due_date"),
      value: "duedate",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Completion Rate").t("assess_list_completion_rate"),
      value: "completeionrate",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Assessment Remaining").t("assess_list_assessment_remaining"),
      value: "assessmentremaining",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Complete Time").t("assess_column_complete_time"),
      value: "completetime",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
  ];
  const homefunHeader: PLField[] = [
    {
      text: d("Assessment Title").t("assess_column_title"),
      value: "title",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Teacher").t("assess_column_teacher"),
      value: "teacher",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Student").t("schedule_time_conflict_student"),
      value: "student",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Status").t("assess_filter_column_status"),
      value: "status",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Due Date").t("assess_column_due_date"),
      value: "duedate",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Submit Time").t("assess_column_submit_time"),
      value: "submittime",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Assessment Score").t("assess_column_assessment_score"),
      value: "assessmentscore",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Complete Time").t("assess_column_complete_time"),
      value: "completetime",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
  ];
  const reviewHeader: PLField[] = [
    {
      text: "Title",
      value: "title",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Teacher Name").t("schedule_label_teacher_name"),
      value: "teacher",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Class Name").t("assess_detail_class_name"),
      value: "class",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Due Date").t("assess_column_due_date"),
      value: "duedate",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
    {
      text: d("Completion Rate").t("assess_list_completion_rate"),
      value: "completetime",
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
    },
  ];
  switch (type) {
    case AssessmentTypeValues.class:
    case AssessmentTypeValues.live:
      return classAndLiveHeader;
    case AssessmentTypeValues.study:
      return studyHeader;
    case AssessmentTypeValues.homeFun:
      return homefunHeader;
    case AssessmentTypeValues.review:
      return reviewHeader;
    default:
      return classAndLiveHeader;
  }
}
