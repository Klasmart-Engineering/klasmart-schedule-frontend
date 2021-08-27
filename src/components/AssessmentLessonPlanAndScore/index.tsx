import React from "react";
import {
  EntityAssessmentDetail,
  EntityAssessmentDetailContent,
  EntityAssessmentStudent,
  EntityAssessmentStudentViewH5PItem,
  EntityUpdateAssessmentContentOutcomeArgs,
  EntityUpdateAssessmentH5PStudent,
} from "../../api/api.auto";
import { DynamicTable } from "../DynamicTable";
import { d } from "../../locale/LocaleManager";
import { ModelAssessment } from "../../models/ModelAssessment";
import MultipleSelectGroup from "../MultipleSelectGroup";
import { OutcomesFilterProps } from "../../pages/AssessmentEdit/filterOutcomes";
import { OutcomesTable, OutcomesTableProps } from "./OutcomesTable";
import { NoOutcome } from "../TipImages";
import { makeStyles, TextField, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { Controller } from "react-hook-form";

const useStyles = makeStyles(({ palette, breakpoints }) => ({
  lps_title: {
    fontWeight: "bolder",
    marginBottom: 10,
  },
  spaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

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

  /** score **/
  filterOutcomes: OutcomesFilterProps["value"];
  filteredOutcomelist: OutcomesTableProps["outcomesList"];
  formMethods: OutcomesTableProps["formMethods"];
  formValue: OutcomesTableProps["formValue"];
  contentOutcomes: EntityUpdateAssessmentContentOutcomeArgs[];
}

export function LessonPlanAndScore(props: tableProps) {
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

    filterOutcomes,
    filteredOutcomelist,
    formMethods,
    formValue,
    contentOutcomes,
  } = props;

  const css = useStyles();
  const { breakpoints } = useTheme();
  const xs = useMediaQuery(breakpoints.down("xs"));
  const radioTypography = xs ? "subtitle2" : "h6";
  const { control } = formMethods;

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

      <>
        <Typography variant={radioTypography} className={css.lps_title}>
          {d("Lesson Plan Assessment").t("assess_detail_lesson_plan_assessment")}
        </Typography>
        {filteredOutcomelist && filteredOutcomelist.length > 0 ? (
          <OutcomesTable
            outcomesList={filteredOutcomelist}
            attendanceList={students}
            formMethods={formMethods}
            formValue={formValue}
            filterOutcomes={filterOutcomes}
            editable={editable}
            studentViewItems={studentViewItems}
            changeAssessmentTableDetail={changeAssessmentTableDetail}
          />
        ) : (
          filteredOutcomelist && <NoOutcome />
        )}
      </>

      <>
        <Typography variant={radioTypography} className={css.lps_title}>
          {d("Score Assessment").t("assess_detail_score_assessment")}
        </Typography>
        <DynamicTable
          formMethods={formMethods}
          formValue={formValue}
          studentViewItems={studentViewItems}
          isComplete={isComplete}
          editable={editable}
          name="student_view_items"
          tableType="study"
          autocompleteLabel={autocompleteLabel}
          changeAssessmentTableDetail={changeAssessmentTableDetail}
          lesson_materials={lesson_materials ?? studyAssessmentDetail.lesson_materials}
        />
      </>

      <Controller
        as={TextField}
        control={control}
        disabled
        name={`content_outcomes`}
        defaultValue={contentOutcomes}
        style={{ display: "none" }}
      />
    </>
  );
}
