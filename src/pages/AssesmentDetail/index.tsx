import { completeStudyAssessment, getStudyAssessmentDetail, updateStudyAssessment } from "@reducers/assessments";
import { AppDispatch, RootState } from "@reducers/index";
import { actSuccess, actWarning } from "@reducers/notify";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep, uniq } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { EntityAssessmentStudentViewH5PItem, EntityUpdateAssessmentH5PStudent } from "../../api/api.auto";
import PermissionType from "../../api/PermissionType";
import { AssessmentStatus, FinalOutcomeList, UpdataStudyAssessmentRequestData } from "../../api/type";
import { LessonPlanAndScore } from "../../components/AssessmentLessonPlanAndScore";
import { usePermission } from "../../hooks/usePermission";
import { d } from "../../locale/LocaleManager";
import { ModelAssessment, UpdateStudyAssessmentDataOmitAction } from "../../models/ModelAssessment";
import { setQuery } from "../../models/ModelContentDetailForm";
import LayoutPair from "../ContentEdit/Layout";
import DetailForm from "./DetailForm";
import { DetailHeader } from "./DetailHeader";

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
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const formMethods = useForm<UpdateStudyAssessmentDataOmitAction>();
  const { studyAssessmentDetail, my_id } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const perm = usePermission([PermissionType.edit_in_progress_assessment_439]);
  const perm_439 = perm.edit_in_progress_assessment_439;
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
  const [autocompleteValue, setChangeAutocompleteValue] = React.useState<{ id: string | number; title: string }[]>([
    { id: 1, title: "Select All" },
  ]);
  const [autocompleteLabel, setChangeAutocompleteLabel] = React.useState<number>(1);
  const [studentViewItems, setStudentViewItems] = React.useState<EntityUpdateAssessmentH5PStudent[] | undefined>([]);
  const init_student_view_items = useMemo(() => {
    return ModelAssessment.toGetStudentViewItems(studyAssessmentDetail, attendance_ids, lesson_materials);
  }, [lesson_materials, attendance_ids, studyAssessmentDetail]);
  const filter_student_view_items: EntityAssessmentStudentViewH5PItem[] = useMemo(() => {
    // const res = ModelAssessment.toGetStudentViewItems(studyAssessmentDetail, attendance_ids, lesson_materials);
    return ModelAssessment.toGetStudentViewFormItems(init_student_view_items, studentViewItems, autocompleteValue, autocompleteLabel);
  }, [init_student_view_items, studentViewItems, autocompleteValue, autocompleteLabel]);

  const complete_rate = useMemo(() => {
    const res = ModelAssessment.toGetStudentViewItems(studyAssessmentDetail, attendance_ids, lesson_materials);
    const { all, attempt } = ModelAssessment.toGetCompleteRate(res);
    if (all === 0) return d("N/A").t("assess_column_n_a");
    if (attempt === 0) return "0";
    return `${Math.round((attempt / all) * 100)}%`;
  }, [lesson_materials, attendance_ids, studyAssessmentDetail]);

  /** score assessment 部分 在学生角度下加上 attendanceIds 字段 **/
  const contentOutcomes = useMemo(() => {
    let contentOutcomes = ModelAssessment.genContentOutcomes(filter_student_view_items);
    setValue("content_outcomes", contentOutcomes);
    return contentOutcomes;
  }, [filter_student_view_items, setValue]);

  const finalOutcomeList = useMemo(() => {
    let newFinalOutcomeList: FinalOutcomeList[] = cloneDeep(filteredOutcomelist) ?? [];
    newFinalOutcomeList?.forEach((outcome) => {
      let curOutcomes = contentOutcomes.filter((co) => co.outcome_id === outcome.outcome_id);
      if (curOutcomes.length) {
        /** 如果找到了 则直接赋值， 没有找到说明是 lesson plan 则不用修改 **/
        outcome.partial_ids = [];
        outcome.attendance_ids = [];
        let allIds = uniq(curOutcomes.map((co) => co.attendance_ids).flat());
        allIds.forEach((id) => {
          if (curOutcomes.filter((co) => co.attendance_ids?.find((i) => i === id)).length === curOutcomes.length)
            outcome.attendance_ids?.push(id!);
          else outcome.partial_ids?.push(id!);
        });
        /** 如果下面都选了 none_achieved 则上面也要选中 none_achieved **/
        outcome.none_achieved = curOutcomes.filter((co) => co.none_achieved).length === curOutcomes.length;
      }
    });
    return newFinalOutcomeList;
  }, [filteredOutcomelist, contentOutcomes]);

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
          const { payload } = (await dispatch(updateStudyAssessment({ id, data }))) as unknown as PayloadAction<
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
        const student_view_items = ModelAssessment.toUpdateH5pStudentView(init_student_view_items, filter_student_view_items);
        const formValue = { ...value, student_view_items };
        const data: UpdataStudyAssessmentRequestData = { ...formValue, action: "complete" };
        const errorlist =
          data.outcomes &&
          data.outcomes.filter((item) => !item.none_achieved && !item.skip && (!item.attendance_ids || item.attendance_ids.length === 0));
        if (errorlist && errorlist.length) {
          const finalErrs = errorlist.filter((err) => {
            return finalOutcomeList.find((item) => item.outcome_id === err.outcome_id)?.partial_ids?.length === 0;
          });
          if (finalErrs && finalErrs.length) {
            console.log(finalErrs);
            return Promise.reject(dispatch(actWarning(d("Please fill in all the information.").t("assess_msg_missing_infor"))));
          }
        }
        const { payload } = (await dispatch(completeStudyAssessment({ id, data, filter_student_view_items }))) as unknown as PayloadAction<
          AsyncTrunkReturned<typeof updateStudyAssessment>
        >;
        if (payload) {
          dispatch(actSuccess(d("Completed Successfully.").t("assess_msg_compete_successfully")));
          history.replace({
            search: setQuery(history.location.search, { editindex: editindex + 1 }),
          });
        }
      }),
    [handleSubmit, finalOutcomeList, dispatch, init_student_view_items, filter_student_view_items, id, history, editindex]
  );

  const changeAutocompleteValue = useMemo(
    () =>
      (
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      await dispatch(getStudyAssessmentDetail({ id, metaLoading: true }));
      setLoading(false);
    })();
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
      <LayoutPair breakpoint="md" leftWidth={603} rightWidth={1205} spacing={32} basePadding={0} padding={40}>
        <DetailForm
          assessmentDetail={studyAssessmentDetail}
          formMethods={formMethods}
          isMyAssessment={isMyAssessment}
          editable={editable as boolean}
          complete_rate={complete_rate}
        />
        <div style={{ position: "relative" }}>
          <LessonPlanAndScore
            initLoading={loading}
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
            filterOutcomes={filterOutcomes}
            filteredOutcomelist={finalOutcomeList}
            formMethods={formMethods}
            formValue={formValue}
            contentOutcomes={contentOutcomes}
          />
        </div>
      </LayoutPair>
    </>
  );
}
AssessmentDetail.routeBasePath = "/assessments/detail";
