import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { GetAssessmentResultOutcomeAttendanceMap, UpdateAssessmentRequestData } from "../../api/type";
import { DynamicTable } from "../../components/DynamicTable";
import { PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { ModelAssessment, UpdateAssessmentRequestDataOmitAction } from "../../models/ModelAssessment";
import { setQuery } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned, getAssessment, updateAssessment } from "../../reducers/assessments";
import { actSuccess, actWarning } from "../../reducers/notify";
import LayoutPair from "../ContentEdit/Layout";
import { AssessmentHeader } from "./AssessmentHeader";
import { NoOutComesList, OutcomesFilter, OutcomesFilterProps } from "./filterOutcomes";
import { OutcomesTable } from "./OutcomesTable";
import RadioHeader, { RadioValue } from "./RadioHeader";
import { Summary } from "./Summary";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  const editindex: number = Number(query.get("editindex") || 0);
  const filterOutcomes = query.get("filterOutcomes") || "all";
  const radioValue = query.get("radioValue") || RadioValue.lessonPlan;
  return { id, filterOutcomes, editindex, radioValue };
};

function AssessmentsEditIner() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { filterOutcomes, id, editindex, radioValue } = useQuery();
  const perm_439 = usePermission(PermissionType.edit_in_progress_assessment_439);
  const { assessmentDetail, my_id } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const formMethods = useForm<UpdateAssessmentRequestDataOmitAction>();
  const { handleSubmit, reset, watch, setValue } = formMethods;
  const formValue = watch();
  const { lesson_materials, student_view_items, attendance_ids } = formValue;
  const { students } = useMemo(() => ModelAssessment.toDetail(assessmentDetail, formValue), [assessmentDetail, formValue]);
  // 切换到另一个assessmentDetail的时候watch到的的数据先是变为空然后变成上一次assessment Detail的数据
  // const filteredOutcomelist = assessmentDetail.outcome_attendances;
  const filteredOutcomelist = useMemo(() => {
    if (lesson_materials) {
      const new_lesson_materials = ModelAssessment.toMaterial(assessmentDetail.lesson_materials, lesson_materials);
      const outcome = ModelAssessment.filterOutcomeList(assessmentDetail, new_lesson_materials);
      return outcome;
    } else {
      const outcome = ModelAssessment.filterOutcomeList(assessmentDetail, assessmentDetail.lesson_materials);
      setTimeout(() => setValue("outcomes", outcome), 100);
      return outcome;
    }
  }, [assessmentDetail, lesson_materials, setValue]);
  const filter_student_view_items = useMemo(() => {
    const res = ModelAssessment.toGetStudentViewItems(assessmentDetail, attendance_ids, lesson_materials);
    return ModelAssessment.toGetStudentViewFormItems(res, student_view_items);
  }, [assessmentDetail, attendance_ids, lesson_materials, student_view_items]);
  const isMyAssessmentlist = assessmentDetail.teachers?.filter((item) => item.id === my_id);
  const isMyAssessment = isMyAssessmentlist && isMyAssessmentlist.length > 0;
  const editable = isMyAssessment && perm_439 && assessmentDetail.status === "in_progress";
  const handleAssessmentSave = useMemo(
    () =>
      handleSubmit(async (value) => {
        if (id) {
          const student_view_items = ModelAssessment.toUpdateH5pStudentView(value.student_view_items);
          const formValue = { ...value, student_view_items };
          const data: UpdateAssessmentRequestData = { ...formValue, action: "save" };
          const { payload } = ((await dispatch(updateAssessment({ id, data }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof updateAssessment>
          >;
          if (payload) {
            dispatch(actSuccess(d("Saved Successfully.").t("assess_msg_save_successfully")));
            history.replace({
              search: setQuery(history.location.search, { id: payload, editindex: editindex + 1 }),
            });
          }
        }
      }),
    [handleSubmit, id, dispatch, history, editindex]
  );
  const handleAssessmentComplete = useMemo(
    () =>
      handleSubmit(async (value) => {
        if (id) {
          const student_view_items = ModelAssessment.toUpdateH5pStudentView(value.student_view_items);
          const formValue = { ...value, student_view_items };
          const data: UpdateAssessmentRequestData = { ...formValue, action: "complete" };
          const errorlist: GetAssessmentResultOutcomeAttendanceMap[] | undefined =
            data.outcomes &&
            data.outcomes.filter((item) => !item.none_achieved && !item.skip && (!item.attendance_ids || item.attendance_ids.length === 0));
          if (data.action === "complete" && errorlist && errorlist.length > 0)
            return Promise.reject(dispatch(actWarning(d("Please fill in all the information.").t("assess_msg_missing_infor"))));
          const { payload } = ((await dispatch(updateAssessment({ id, data }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof updateAssessment>
          >;
          if (payload) {
            dispatch(actSuccess(d("Completed Successfully.").t("assess_msg_compete_successfully")));
            history.replace({
              search: setQuery(history.location.search, { id: payload, editindex: editindex + 1 }),
            });
          }
        }
      }),
    [handleSubmit, id, dispatch, history, editindex]
  );
  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleFilterOutcomes = useMemo<OutcomesFilterProps["onChange"]>(
    () => (value) => {
      history.replace({
        search: setQuery(history.location.search, { filterOutcomes: value }),
      });
    },
    [history]
  );
  const handleChangeRadio = (value: RadioValue) => {
    history.replace({
      search: setQuery(history.location.search, { radioValue: value }),
    });
  };
  useEffect(() => {
    if (id) {
      dispatch(getAssessment({ id, metaLoading: true }));
    }
  }, [dispatch, id, editindex]);
  useEffect(() => {
    if (assessmentDetail.id) {
      reset(ModelAssessment.toRequest(assessmentDetail));
    }
  }, [assessmentDetail, reset]);

  const TableCellData = [
    `${d("No").t("assess_detail_no")}.`,
    d("Lesson Material Name").t("assess_detail_lesson_material_name"),
    d("Lesson Material Type").t("assess_detail_lesson_material_type"),
    d("Answer").t("assess_detail_answer"),
    "Score / Full Marks",
    d("Learning Outcomes").t("library_label_learning_outcomes"),
  ];

  const rightsideArea = (
    <>
      <RadioHeader value={radioValue as RadioValue} onChange={handleChangeRadio} />
      {radioValue === RadioValue.lessonPlan && (
        <>
          <OutcomesFilter value={filterOutcomes} onChange={handleFilterOutcomes} />
          {filteredOutcomelist && filteredOutcomelist.length > 0 ? (
            <OutcomesTable
              outcomesList={filteredOutcomelist}
              attendanceList={students}
              formMethods={formMethods}
              formValue={formValue}
              filterOutcomes={filterOutcomes}
              editable={editable}
            />
          ) : (
            <NoOutComesList />
          )}
        </>
      )}
      {radioValue === RadioValue.score && (
        <>
          <DynamicTable
            studentViewItems={filter_student_view_items}
            tableCellData={TableCellData}
            formMethods={formMethods}
            isComplete={false}
            editable={editable}
            name="student_view_items"
            tableType="live"
          />
        </>
      )}
    </>
  );

  return (
    <>
      <AssessmentHeader
        name={d("Assessment Details").t("assess_assessment_details")}
        onSave={handleAssessmentSave}
        onBack={handleGoBack}
        onComplete={handleAssessmentComplete}
        editable={editable}
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        <Summary
          assessmentDetail={assessmentDetail}
          formMethods={formMethods}
          isMyAssessment={isMyAssessment}
          outcomesList={filteredOutcomelist}
        />
        {rightsideArea}
      </LayoutPair>
    </>
  );
}
export function AssessmentsEdit() {
  const { id, editindex } = useQuery();
  return <AssessmentsEditIner key={`${id}${editindex}`}></AssessmentsEditIner>;
}
AssessmentsEdit.routeBasePath = "/assessments/assessments-detail";
