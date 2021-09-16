import { d } from "../../../locale/LocaleManager";
import { ISelect } from "../components/ClassFilter";

export default function useTranslation() {
  const allValue = "all";

  const noneValue = "none";

  const selectAllOption = [{ value: allValue, label: d("All").t("report_label_all") }] as ISelect[];

  const selectNoneSchoolOption = [{ value: noneValue, label: d("None").t("report_label_none") }] as ISelect[];

  const MaterialUsageConData = [
    { value: allValue, label: d("All").t("report_label_all") },
    { value: "h5p", label: "H5P" },
    { value: "image", label: d("Image").t("library_label_image") },
    { value: "video", label: d("Video").t("library_label_video") },
    { value: "audio", label: d("Audio").t("library_label_audio") },
    { value: "document", label: d("Document").t("library_label_document") },
  ];
  const viewType: Record<string, string> = {
    h5p: d("No. of H5P viewed.").t("report_student_usage_h5p_viewed"),
    audio: d("Audio listened").t("report_student_usage_audio_listened"),
    video: d("Video viewed").t("report_student_usage_video_viewed"),
    image: d("Images viewed").t("report_student_usage_images_viewed"),
    document: d("Document viewed").t("report_student_usage_document_viewed"),
  };
  const months: Record<string, string> = {
    January: d("January").t("schedule_calendar_january"),
    February: d("February").t("schedule_calendar_february"),
    March: d("March").t("schedule_calendar_march"),
    April: d("April").t("schedule_calendar_april"),
    May: d("May").t("schedule_calendar_may"),
    June: d("June").t("schedule_calendar_june"),
    July: d("July").t("schedule_calendar_july"),
    August: d("August").t("schedule_calendar_august"),
    September: d("September").t("schedule_calendar_september"),
    October: d("October").t("schedule_calendar_october"),
    November: d("November").t("schedule_calendar_november"),
    December: d("December").t("schedule_calendar_december"),
  };

  return {
    MaterialUsageConData,
    viewType,
    months,
    allValue,
    noneValue,
    selectAllOption,
    selectNoneSchoolOption,
  };
}
