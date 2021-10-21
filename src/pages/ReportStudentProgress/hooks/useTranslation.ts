import { d } from "../../../locale/LocaleManager";

export default function useTranslation() {
  const allValue = "all";
  const noneValue = "none";
  const selectAllOption = [{ value: allValue, label: d("All").t("report_label_all") }] as MutiSelect.ISelect[];
  const selectNoneSchoolOption = [{ value: noneValue, label: d("None").t("report_label_none") }] as MutiSelect.ISelect[];

  return {
    allValue,
    noneValue,
    selectAllOption,
    selectNoneSchoolOption,
  };
}
