import React from "react";
import {
  EntityAssessmentDetail,
  EntityAssessmentDetailContent,
  EntityAssessmentStudent,
  EntityAssessmentStudentViewH5PItem,
  EntityUpdateAssessmentH5PStudent,
} from "../../api/api.auto";
import { DynamicTable } from "../../components/DynamicTable";
import { d } from "../../locale/LocaleManager";
import { ModelAssessment } from "../../models/ModelAssessment";
import MultipleSelectGroup from "../../components/MultipleSelectGroup";

interface MultipleChildProps {
  id: string | number;
  title: string;
}

interface MultipleGroupProps {
  changeAutocompleteValue: (value: MultipleChildProps[]) => void;
  changeAutocompleteDimensionValue: (value: number) => void;
  studyAssessmentDetail: EntityAssessmentDetail;
  students: EntityAssessmentStudent[] | undefined;
  lesson_materials: EntityAssessmentDetailContent[] | undefined;
}

interface tableProps extends MultipleGroupProps {
  studentViewItems?: EntityAssessmentStudentViewH5PItem[];
  editable: boolean;
  isComplete: boolean;
  autocompleteLabel: number;
  changeAssessmentTableDetail?: (value?: EntityUpdateAssessmentH5PStudent[]) => void;
}

export function DetailTable(props: tableProps) {
  const {
    studentViewItems,
    editable,
    isComplete,
    changeAutocompleteValue,
    changeAutocompleteDimensionValue,
    studyAssessmentDetail,
    students,
    lesson_materials,
    autocompleteLabel,
    changeAssessmentTableDetail,
  } = props;
  const TableCellDataDefault = [
    `${d("No").t("assess_detail_no")}.`,
    d("Lesson Material Name").t("assess_detail_lesson_material_name"),
    d("Lesson Material Type").t("assess_detail_lesson_material_type"),
    d("Answer").t("assess_detail_answer"),
    d("Score / Full Marks").t("assess_detail_score_full_marks"),
    d("Percentage").t("assess_detail_percentage"),
  ];
  const TableCellDataMaterials = [
    "Student Name",
    d("Answer").t("assess_detail_answer"),
    d("Score / Full Marks").t("assess_detail_score_full_marks"),
    d("Learning Outcomes").t("library_label_learning_outcomes"),
  ];
  return (
    <>
      <MultipleSelectGroup
        groupCollect={ModelAssessment.MultipleSelectSet(
          students,
          lesson_materials ?? studyAssessmentDetail.lesson_materials,
          studyAssessmentDetail.lesson_materials
        )}
        changeAutocompleteValue={changeAutocompleteValue}
        changeAutocompleteDimensionValue={changeAutocompleteDimensionValue}
      />
      <DynamicTable
        studentViewItems={studentViewItems}
        tableCellData={autocompleteLabel === 1 ? TableCellDataDefault : TableCellDataMaterials}
        isComplete={isComplete}
        editable={editable}
        name="student_view_items"
        tableType="study"
        autocompleteLabel={autocompleteLabel}
        changeAssessmentTableDetail={changeAssessmentTableDetail}
        lesson_materials={lesson_materials ?? studyAssessmentDetail.lesson_materials}
      />
    </>
  );
}
