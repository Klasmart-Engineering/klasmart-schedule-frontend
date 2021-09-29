import { d, t } from "../../../locale/LocaleManager";

export default function useTranslation() {
  const allValue = "all";
  const noneValue = "none";
  const selectAllOption = [{ value: allValue, label: d("All").t("report_label_all") }] as MutiSelect.ISelect[];
  const selectNoneSchoolOption = [{ value: noneValue, label: d("None").t("report_label_none") }] as MutiSelect.ISelect[];
  const lessonLang = {
    lessonTitle: d("Total Lessons (Live and In Class) Scheduled").t("report_teaching_load_lesson_title"),
    teacher: d("Teacher").t("report_label_teacher"),
    menuItem1: t("report_teaching_load_lesson_menu_item", { days: 7 }),
    menuItem2: t("report_teaching_load_lesson_menu_item", { days: 30 }),
    noOfClasses: d("No.of Classes").t("report_teaching_load_classes_column"),
    noOfStudent: d("No.of Student").t("report_teaching_load_student_column"),
    current: d("current").t("report_teaching_load_current"),
    liveCompleted: d("Live Lessons Completed").t("report_teaching_load_lesson_live_completed"),
    inClassCompleted: d("In Class Lessons Completed").t("report_teaching_load_lesson_in_class_completed"),
    liveMissed: d("Live Lessons Missed").t("report_teaching_load_lesson_live_missed"),
    inClassMidded: d("In Class Lessons Missed").t("report_teaching_load_lesson_in_class_missed"),
    hrs: d("hrs").t("report_label_hrs_lower"),
    mins: d("mins").t("report_label_mins_lower"),
    totalScheduled: d("Total Scheduled").t("report_teaching_load_lesson_total_scheduled"),
  };

  const lessonColors = ["#005096", "#0E78D5", "#CC8685", "#E9BEBD"];

  return {
    allValue,
    noneValue,
    selectAllOption,
    selectNoneSchoolOption,
    lessonLang,
    lessonColors,
  };
}
