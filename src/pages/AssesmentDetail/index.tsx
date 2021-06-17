import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { AssessmentStatus, UpdataStudyAssessmentRequestData } from "../../api/type";
import { PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { ModelAssessment, UpdateStudyAssessmentDataOmitAction } from "../../models/ModelAssessment";
import { setQuery } from "../../models/ModelContentDetailForm";
import { AppDispatch, RootState } from "../../reducers";
import { AsyncTrunkReturned, completeStudyAssessment, getStudyAssessmentDetail, updateStudyAssessment } from "../../reducers/assessments";
import { actSuccess } from "../../reducers/notify";
import LayoutPair from "../ContentEdit/Layout";
import DetailForm from "./DetailForm";
import { DetailHeader } from "./DetailHeader";
import { DetailTable } from "./DetailTable";
import { EntityUpdateAssessmentH5PStudent } from "../../api/api.auto";

export const useQueryDetail = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const scheduleId = query.get("schedule_id") || "";
  const id = query.get("id") || "";
  const editindex: number = Number(query.get("editindex") || 0);
  return { scheduleId, id, editindex };
};

export function AssessmentDetail() {
  const { id, editindex } = useQueryDetail();
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
  const { handleSubmit, watch, reset } = formMethods;
  const formValue = watch();
  const { attendance_ids, lesson_materials } = formValue;
  const { students } = useMemo(() => ModelAssessment.toDetail(studyAssessmentDetail, formValue), [studyAssessmentDetail, formValue]);
  const [autocompleteValue, setChangeAutocompleteValue] = React.useState<
    {
      id: string | number;
      title: string;
    }[]
  >([{ id: 1, title: "Select All" }]);
  const [autocompleteLabel, setChangeAutocompleteLabel] = React.useState<string>("View by Student");
  const [studentViewItems, setStudentViewItems] = React.useState<EntityUpdateAssessmentH5PStudent[] | undefined>(
    ModelAssessment.toGetStudentViewItems(studyAssessmentDetail, attendance_ids, lesson_materials)
  );
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

  const changeAutocompleteDimensionValue = (label: string) => {
    setChangeAutocompleteLabel(label);
  };
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
          editable={editable}
          complete_rate={complete_rate}
        />
        <DetailTable
          autocompleteLabel={autocompleteLabel}
          studentViewItems={filter_student_view_items}
          isComplete={isComplete}
          editable={editable}
          changeAutocompleteDimensionValue={changeAutocompleteDimensionValue}
          changeAutocompleteValue={changeAutocompleteValue}
          lesson_materials={lesson_materials}
          students={students}
          studyAssessmentDetail={studyAssessmentDetail}
          changeAssessmentTableDetail={changeAssessmentTableDetail}
        />
      </LayoutPair>
    </>
  );
}
AssessmentDetail.routeBasePath = "/assessments/detail";
