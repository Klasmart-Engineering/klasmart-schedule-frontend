import { MenuItem, TextField } from "@material-ui/core";
import React, { ChangeEvent } from "react";
import { d } from "../../locale/LocaleManager";
export enum AssessmentTypeValues {
  class = "OfflineClass",
  live = "OnlineClass",
  homeFun = "homeFun",
  study = "study",
}
export interface options {
  label?: string;
  value?: string;
}
export const assessmentTypes = () => {
  return [
    { label: d("Class").t("schedule_detail_offline_class"), value: AssessmentTypeValues.class },
    { label: d("Live").t("schedule_detail_online_class"), value: AssessmentTypeValues.live },
    { label: d("Study").t("assess_study_list_study"), value: AssessmentTypeValues.study },
    { label: d("Study / Home Fun").t("assess_class_type_homefun"), value: AssessmentTypeValues.homeFun },
  ];
};
const menuItemList = (list: options[]) =>
  list.map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
export interface AssessmentTypeProps {
  type: AssessmentTypeValues;
  onChangeAssessmentType: (assessmentType: AssessmentTypeValues) => any;
}
export function AssessmentType(props: AssessmentTypeProps) {
  const { type, onChangeAssessmentType } = props;
  const handleChangeAssessmentType = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeAssessmentType(event.target.value as AssessmentTypeValues);
  };
  return (
    <TextField
      style={{ width: 160, marginLeft: 10 }}
      size="small"
      onChange={handleChangeAssessmentType}
      label={d("Content Type").t("library_label_contentType")}
      value={type}
      select
      SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
    >
      {menuItemList(assessmentTypes())}
    </TextField>
  );
}
