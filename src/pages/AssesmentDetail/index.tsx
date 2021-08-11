import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { EntityUpdateAssessmentH5PStudent } from "../../api/api.auto";
import { AssessmentStatus, UpdataStudyAssessmentRequestData } from "../../api/type";
import { PermissionType, usePermission } from "../../components/Permission";
import { NoOutcome } from "../../components/TipImages";
import { d } from "../../locale/LocaleManager";
import { ModelAssessment, UpdateStudyAssessmentDataOmitAction } from "../../models/ModelAssessment";
import { setQuery } from "../../models/ModelContentDetailForm";
import { AppDispatch, RootState } from "../../reducers";
import { AsyncTrunkReturned, completeStudyAssessment, getStudyAssessmentDetail, updateStudyAssessment } from "../../reducers/assessments";
import { actSuccess } from "../../reducers/notify";
import { OutcomesFilter, OutcomesFilterProps } from "../AssessmentEdit/filterOutcomes";
import { OutcomesTable } from "../AssessmentEdit/OutcomesTable";
import RadioHeader, { RadioValue } from "../AssessmentEdit/RadioHeader";
import LayoutPair from "../ContentEdit/Layout";
import DetailForm from "./DetailForm";
import { DetailHeader } from "./DetailHeader";
import { DetailTable } from "./DetailTable";

export const useQueryDetail = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const scheduleId = query.get("schedule_id") || "";
  const id = query.get("id") || "";
  const editindex: number = Number(query.get("editindex") || 0);
  const filterOutcomes = query.get("filterOutcomes") || "all";
  return { scheduleId, id, editindex, filterOutcomes };
};

export function AssessmentDetail() {
  const { id, editindex, filterOutcomes } = useQueryDetail();
  const [radioValue, setRadioValue] = useState(RadioValue.lessonPlan);
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const formMethods = useForm<UpdateStudyAssessmentDataOmitAction>();
  const { studyAssessmentDetail, my_id } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const perm_439 = usePermission(PermissionType.edit_in_progress_assessment_439);
  const isMyAssessmentlist = studyAssessmentDetail.teachers?.filter((item) => item.id === my_id);
  const isMyAssessment = Boolean(isMyAssessmentlist && isMyAssessmentlist.length > 0);
  const hasRemainTime = studyAssessmentDetail.remaining_time ? studyAssessmentDetail.remaining_time > 0 : false;
  const isInProgress = studyAssessmentDetail.status === AssessmentStatus.in_progress;
  const isComplete = studyAssessmentDetail.status === AssessmentStatus.complete;
  const editable = isMyAssessment && perm_439 && !hasRemainTime && isInProgress;
  const { handleSubmit, watch, reset, setValue } = formMethods;
  const formValue = watch();
  const { attendance_ids, lesson_materials } = formValue;
  const { students } = useMemo(() => ModelAssessment.toDetail(studyAssessmentDetail, formValue), [studyAssessmentDetail, formValue]);
  const filteredOutcomelist = useMemo(() => {
    if (lesson_materials) {
      const new_lesson_materials = ModelAssessment.toMaterial(studyAssessmentDetail.lesson_materials, lesson_materials);
      const outcome = ModelAssessment.filterOutcomeList(studyAssessmentDetail, new_lesson_materials);
      return outcome;
    } else {
      const outcome = ModelAssessment.filterOutcomeList(studyAssessmentDetail, studyAssessmentDetail.lesson_materials);
      setTimeout(() => setValue("outcomes", outcome), 100);
      return outcome;
    }
  }, [lesson_materials, studyAssessmentDetail, setValue]);
  const [autocompleteValue, setChangeAutocompleteValue] = React.useState<
    {
      id: string | number;
      title: string;
    }[]
  >([{ id: 1, title: "Select All" }]);
  const [autocompleteLabel, setChangeAutocompleteLabel] = React.useState<number>(1);
  const [studentViewItems, setStudentViewItems] = React.useState<EntityUpdateAssessmentH5PStudent[] | undefined>([]);
  const init_student_view_items = useMemo(() => {
    return ModelAssessment.toGetStudentViewItems(studyAssessmentDetail, attendance_ids, lesson_materials);
  }, [lesson_materials, attendance_ids, studyAssessmentDetail]);
  const filter_student_view_items = useMemo(() => {
    const res = ModelAssessment.toGetStudentViewItems(studyAssessmentDetail, attendance_ids, lesson_materials);
    return ModelAssessment.toGetStudentViewFormItems(res, studentViewItems, autocompleteValue, autocompleteLabel);
  }, [studyAssessmentDetail, attendance_ids, lesson_materials, studentViewItems, autocompleteValue, autocompleteLabel]);

  const complete_rate = useMemo(() => {
    const res = ModelAssessment.toGetStudentViewItems(studyAssessmentDetail, attendance_ids, lesson_materials);
    const { all, attempt } = ModelAssessment.toGetCompleteRate(res);
    if (all === 0) return d("N/A").t("assess_column_n_a");
    if (attempt === 0) return "0";
    return `${Math.round((attempt / all) * 100)}%`;
  }, [lesson_materials, attendance_ids, studyAssessmentDetail]);
  const handleGoBack = useCallback(async () => {
    history.goBack();
  }, [history]);
  const handleDetailSave = useMemo(
    () =>
      handleSubmit(async (value) => {
        const student_view_items = ModelAssessment.toUpdateH5pStudentView(init_student_view_items, filter_student_view_items);
        const formValue = { ...value, student_view_items };
        if (id) {
          const data: UpdataStudyAssessmentRequestData = { ...formValue, action: "save" };
          const { payload } = ((await dispatch(updateStudyAssessment({ id, data }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof updateStudyAssessment>
          >;
          if (payload) {
            dispatch(actSuccess(d("Saved Successfully.").t("assess_msg_save_successfully")));
            history.replace({
              search: setQuery(history.location.search, { id: payload, editindex: editindex + 1 }),
            });
          }
        }
      }),
    [handleSubmit, init_student_view_items, filter_student_view_items, id, dispatch, history, editindex]
  );
  const handleDetailComplete = useMemo(
    () =>
      handleSubmit(async (value) => {
        // if (id) {
        const student_view_items = ModelAssessment.toUpdateH5pStudentView(init_student_view_items, filter_student_view_items);
        const formValue = { ...value, student_view_items };
        const data: UpdataStudyAssessmentRequestData = { ...formValue, action: "complete" };
        const { payload } = ((await dispatch(
          completeStudyAssessment({ id, data, filter_student_view_items })
        )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof updateStudyAssessment>>;
        if (payload) {
          dispatch(actSuccess(d("Completed Successfully.").t("assess_msg_compete_successfully")));
          history.replace({
            search: setQuery(history.location.search, { editindex: editindex + 1 }),
          });
        }
      }),
    [handleSubmit, init_student_view_items, filter_student_view_items, dispatch, id, history, editindex]
  );

  const changeAutocompleteValue = useMemo(
    () => (
      value: {
        id: string | number;
        title: string;
      }[]
    ) => {
      setChangeAutocompleteValue(value);
    },
    []
  );

  const changeAutocompleteDimensionValue = (label: number) => {
    setChangeAutocompleteLabel(label);
  };
  const handleChangeRadio = (value: RadioValue) => {
    setRadioValue(value);
  };
  const handleFilterOutcomes = useMemo<OutcomesFilterProps["onChange"]>(
    () => (value) => {
      history.replace({
        search: setQuery(history.location.search, { filterOutcomes: value }),
      });
    },
    [history]
  );
  useEffect(() => {
    dispatch(getStudyAssessmentDetail({ id, metaLoading: true }));
  }, [dispatch, id, editindex]);

  useEffect(() => {
    if (studyAssessmentDetail.id) {
      reset(ModelAssessment.toStudyRequest(studyAssessmentDetail));
    }
  }, [reset, studyAssessmentDetail]);

  const changeAssessmentTableDetail = (value?: EntityUpdateAssessmentH5PStudent[]) => {
    setStudentViewItems(value);
  };
  return (
    <>
      <DetailHeader
        name={d("Assessment Details").t("assess_assessment_details")}
        onBack={handleGoBack}
        onComplete={handleDetailComplete}
        onSave={handleDetailSave}
        editable={editable}
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        <DetailForm
          assessmentDetail={studyAssessmentDetail}
          formMethods={formMethods}
          isMyAssessment={isMyAssessment}
          editable={editable as boolean}
          complete_rate={complete_rate}
        />
        <div style={{ position: "relative" }}>
          <RadioHeader value={radioValue as RadioValue} onChange={handleChangeRadio} />
          <div style={{ visibility: radioValue === RadioValue.score ? "visible" : "hidden", position: "absolute", width: "100%" }}>
            <DetailTable
              autocompleteLabel={autocompleteLabel}
              studentViewItems={filter_student_view_items}
              isComplete={isComplete}
              editable={editable as boolean}
              changeAutocompleteDimensionValue={changeAutocompleteDimensionValue}
              changeAutocompleteValue={changeAutocompleteValue}
              lesson_materials={lesson_materials}
              students={students}
              studyAssessmentDetail={studyAssessmentDetail}
              changeAssessmentTableDetail={changeAssessmentTableDetail}
            />
          </div>
          <div style={{ visibility: radioValue === RadioValue.lessonPlan ? "visible" : "hidden", position: "absolute", width: "100%" }}>
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
              filteredOutcomelist && <NoOutcome />
            )}
          </div>
        </div>
      </LayoutPair>
    </>
  );
}
AssessmentDetail.routeBasePath = "/assessments/detail";
