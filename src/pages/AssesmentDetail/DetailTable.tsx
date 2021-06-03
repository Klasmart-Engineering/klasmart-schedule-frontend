import React from "react";
import { UseFormMethods } from "react-hook-form";
import { EntityAssessmentStudentViewH5PItem } from "../../api/api.auto";
import { DynamicTable } from "../../components/DynamicTable";
import { d } from "../../locale/LocaleManager";
import { UpdateAssessmentRequestDataOmitAction, UpdateStudyAssessmentDataOmitAction } from "../../models/ModelAssessment";

interface tableProps {
  studentViewItems?: EntityAssessmentStudentViewH5PItem[];
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
      name="student_view_items"
      tableType="study"
    />
  );
}
