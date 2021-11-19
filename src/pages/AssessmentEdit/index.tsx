import { getAssessment, updateAssessment } from "@reducers/assessments";
import { RootState } from "@reducers/index";
import { actSuccess, actWarning } from "@reducers/notify";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep, uniq } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { EntityUpdateAssessmentH5PStudent } from "../../api/api.auto";
import PermissionType from "../../api/PermissionType";
import { AssessmentStatus, FinalOutcomeList, UpdateAssessmentRequestData } from "../../api/type";
import { LessonPlanAndScore } from "../../components/AssessmentLessonPlanAndScore";
import { NoOutcome } from "../../components/TipImages";
import { usePermission } from "../../hooks/usePermission";
import { d } from "../../locale/LocaleManager";
import { ModelAssessment, UpdateAssessmentRequestDataOmitAction } from "../../models/ModelAssessment";
import { setQuery } from "../../models/ModelContentDetailForm";
import LayoutPair from "../ContentEdit/Layout";
import { AssessmentHeader } from "./AssessmentHeader";
import { OutcomesFilter, OutcomesFilterProps } from "./filterOutcomes";
import { OutcomesTable } from "./OutcomesTable";
import { Summary } from "./Summary";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  const editindex: number = Number(query.get("editindex") || 0);
  const filterOutcomes = query.get("filterOutcomes") || "all";
  // const radioValue = query.get("radioValue") || RadioValue.lessonPlan;
  const classType = query.get("classType");
  return { id, filterOutcomes, editindex, classType };
};

export function AssessmentsEdit() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { filterOutcomes, id, editindex, classType } = useQuery();
  const perm = usePermission([PermissionType.edit_in_progress_assessment_439]);
  const perm_439 = perm.edit_in_progress_assessment_439;
  const { assessmentDetail, my_id } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const isLive = classType ? classType === "OnlineClass" : assessmentDetail.schedule?.class_type === "OnlineClass";
  const formMethods = useForm<UpdateAssessmentRequestDataOmitAction>();
  const { handleSubmit, reset, watch, setValue } = formMethods;
  const formValue = watch();
  const { lesson_materials, attendance_ids, outcomes } = formValue;
  console.log("outcomes", outcomes);
  const [autocompleteValue, setChangeAutocompleteValue] = React.useState<
    {
      id: string | number;
      title: string;
    }[]
  >([{ id: 1, title: "Select All" }]);
  const [autocompleteLabel, setChangeAutocompleteLabel] = React.useState<number>(1);
  const [studentViewItems, setStudentViewItems] = React.useState<EntityUpdateAssessmentH5PStudent[] | undefined>([]);
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
  const init_student_view_items = useMemo(() => {
    return ModelAssessment.toGetStudentViewItems(assessmentDetail, attendance_ids, lesson_materials);
  }, [assessmentDetail, attendance_ids, lesson_materials]);

  const filter_student_view_items = useMemo(() => {
    // const res = ModelAssessment.toGetStudentViewItems(assessmentDetail, attendance_ids, lesson_materials);
    return ModelAssessment.toGetStudentViewFormItems(init_student_view_items, studentViewItems, autocompleteValue, autocompleteLabel);
  }, [init_student_view_items, studentViewItems, autocompleteValue, autocompleteLabel]);

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

  const isMyAssessmentlist = assessmentDetail.teachers?.filter((item) => item.id === my_id);
  const isMyAssessment = isMyAssessmentlist && isMyAssessmentlist.length > 0;
  const editable = isMyAssessment && perm_439 && assessmentDetail.status === "in_progress";
  const isComplete = assessmentDetail.status === AssessmentStatus.complete;
  const handleAssessmentSave = useMemo(
    () =>
      handleSubmit(async (value) => {
        const student_view_items = ModelAssessment.toUpdateH5pStudentView(init_student_view_items, filter_student_view_items);
        const formValue = { ...value, student_view_items };
        if (id) {
          const data: UpdateAssessmentRequestData = { ...formValue, action: "save" };
          const { payload } = (await dispatch(updateAssessment({ id, data }))) as unknown as PayloadAction<
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
    [handleSubmit, id, init_student_view_items, filter_student_view_items, dispatch, history, editindex]
  );
  const handleAssessmentComplete = useMemo(
    () =>
      handleSubmit(async (value) => {
        if (id) {
          const student_view_items = ModelAssessment.toUpdateH5pStudentView(init_student_view_items, filter_student_view_items);
          const formValue = { ...value, student_view_items };
          const data: UpdateAssessmentRequestData = { ...formValue, action: "complete" };
          const errorlist =
            data.outcomes &&
            data.outcomes.filter((item) => !item.none_achieved && !item.skip && (!item.attendance_ids || item.attendance_ids.length === 0));
          console.log("errorlist:", errorlist);
          if (errorlist && errorlist.length && isLive) {
            const finalErrs = errorlist.filter((err) => {
              return finalOutcomeList.find((item) => item.outcome_id === err.outcome_id)?.partial_ids?.length === 0;
            });
            if (finalErrs && finalErrs.length) {
              return Promise.reject(dispatch(actWarning(d("Please fill in all the information.").t("assess_msg_missing_infor"))));
            }
          }
          if (!isLive && errorlist && errorlist.length) {
            return Promise.reject(dispatch(actWarning(d("Please fill in all the information.").t("assess_msg_missing_infor"))));
          }
          const { payload } = (await dispatch(updateAssessment({ id, data }))) as unknown as PayloadAction<
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
    [handleSubmit, id, init_student_view_items, filter_student_view_items, isLive, dispatch, finalOutcomeList, history, editindex]
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        await dispatch(getAssessment({ id, metaLoading: true }));
        setLoading(false);
      })();
    }
  }, [dispatch, id, editindex]);
  useEffect(() => {
    if (assessmentDetail.id) {
      reset(ModelAssessment.toRequest(assessmentDetail));
    }
  }, [assessmentDetail, reset]);

  const changeAutocompleteValue = useMemo(
    () => (value: { id: string | number; title: string }[]) => {
      setChangeAutocompleteValue(value);
    },
    []
  );

  const changeAutocompleteDimensionValue = (label: number) => {
    setChangeAutocompleteLabel(label);
  };

  const changeAssessmentTableDetail = (value?: EntityUpdateAssessmentH5PStudent[]) => {
    setStudentViewItems(value);
  };

  const rightsideArea = isLive ? (
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
      studyAssessmentDetail={assessmentDetail}
      changeAssessmentTableDetail={changeAssessmentTableDetail}
      filterOutcomes={filterOutcomes}
      filteredOutcomelist={finalOutcomeList}
      formMethods={formMethods}
      formValue={formValue}
      contentOutcomes={contentOutcomes}
    />
  ) : (
    <>
      <OutcomesFilter value={filterOutcomes} onChange={handleFilterOutcomes} />
      {filteredOutcomelist && filteredOutcomelist.length > 0 ? (
        <OutcomesTable
          outcomesList={filteredOutcomelist}
          attendanceList={students}
          formMethods={formMethods}
          formValue={formValue}
          filterOutcomes={filterOutcomes}
          editable={editable as boolean}
        />
      ) : (
        filteredOutcomelist && <NoOutcome />
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
      <LayoutPair breakpoint="md" leftWidth={603} rightWidth={1205} spacing={32} basePadding={0} padding={40}>
        <Summary
          assessmentDetail={assessmentDetail}
          formMethods={formMethods}
          isMyAssessment={isMyAssessment}
          outcomesList={filteredOutcomelist}
          lessonMaterials={lesson_materials}
        />
        {rightsideArea}
      </LayoutPair>
    </>
  );
}
AssessmentsEdit.routeBasePath = "/assessments/assessments-detail";
