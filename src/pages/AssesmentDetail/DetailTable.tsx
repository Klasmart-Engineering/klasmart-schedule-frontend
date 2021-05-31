import React from "react";
import { EntityH5PAssessmentStudentViewItem } from "../../api/api.auto";
import { UseFormMethods } from "react-hook-form";
import { UpdateAssessmentRequestDataOmitAction, UpdateStudyAssessmentDataOmitAction } from "../../models/ModelAssessment";
import { DynamicTable } from "../../components/DynamicTable";
import { d } from "../../locale/LocaleManager";

interface tableProps {
  studentViewItems?: EntityH5PAssessmentStudentViewItem[];
  formMethods: UseFormMethods<UpdateStudyAssessmentDataOmitAction>;
  formValue?: UpdateAssessmentRequestDataOmitAction;
  editable: boolean;
  isComplete: boolean;
}

export function DetailTable(props: tableProps) {
  const { studentViewItems, formMethods, editable, isComplete } = props;
  const TableCellData = [
    `${d("No").t("assess_detail_no")}.`,
    d("Lesson Material Name").t("assess_detail_lesson_material_name"),
    d("Lesson Material Type").t("assess_detail_lesson_material_type"),
    d("Answer").t("assess_detail_answer"),
    "Score / Full Marks",
    d("Percentage").t("assess_detail_percentage"),
  ];
  return (
    <DynamicTable
      studentViewItems={studentViewItems}
      tableCellData={TableCellData}
      formMethods={formMethods}
      isComplete={isComplete}
      editable={editable}
    />
  );
}
