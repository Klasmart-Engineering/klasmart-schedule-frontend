import { d, t } from "../../../locale/LocaleManager";

export default function useTranslation() {
  const allValue = "all";
  const noneValue = "none";
  const selectAllOption = [{ value: allValue, label: d("All").t("report_label_all") }] as MutiSelect.ISelect[];
  const selectNoneSchoolOption = [{ value: noneValue, label: d("None").t("report_label_none") }] as MutiSelect.ISelect[];
  const lessonLang = {
    lessonTitle: d("Total Lessons (Live and In Class) Scheduled").t("report_label_total_lessons"),
    teacher: d("Teacher").t("report_label_teacher"),
    menuItem1: t("report_label_past_7_days"),
    menuItem2: t("report_label_past_30_days"),
    noOfClasses: t("report_label_classes_number"),
    noOfStudent: t("report_label_students_number"),
    current: t("report_label_current"),
    liveCompleted: d("Live Lessons Completed").t("report_label_live_lessons_completed"),
    inClassCompleted: d("In Class Lessons Completed").t("report_label_in_class_lessons_completed"),
    liveMissed: d("Live Lessons Missed").t("report_label_live_lessons_missed"),
    inClassMidded: d("In Class Lessons Missed").t("report_label_in_class_lessons_Missed"),
    hrs: d("hrs").t("report_label_hrs"),
    mins: d("mins").t("report_label_mins"),
    totalScheduled: d("Total Scheduled").t("report_label_total_scheduled"),
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
