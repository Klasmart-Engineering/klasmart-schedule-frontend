import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { EntityOutcomeAttendanceMap } from "../../api/api.auto";
import { UpdateAssessmentRequestData } from "../../api/type";
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
import { Summary } from "./Summary";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  const editindex: number = Number(query.get("editindex") || 0);
  const filterOutcomes = query.get("filterOutcomes") || undefined;
  return { id, filterOutcomes, editindex };
};

function AssessmentsEditIner() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { filterOutcomes = "all", id, editindex } = useQuery();
  const { assessmentDetail, my_id } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const formMethods = useForm<UpdateAssessmentRequestDataOmitAction>();
  const { handleSubmit, reset, watch } = formMethods;
  // 切换的时候formValue的数据是旧的
  const formValue = watch();
  const { attendances } = useMemo(() => ModelAssessment.toDetail(assessmentDetail, formValue), [assessmentDetail, formValue]);
  const filteredOutcomelist = assessmentDetail.outcome_attendance_maps;
  const isMyAssessmentlist = assessmentDetail.teachers?.filter((item) => item.id === my_id);
  const isMyAssessment = isMyAssessmentlist && isMyAssessmentlist.length > 0;
  const editable = isMyAssessment || !(assessmentDetail.status === "complete");
  const handleAssessmentSave = useMemo(
    () =>
      handleSubmit(async (value) => {
        if (id) {
          const data: UpdateAssessmentRequestData = { ...value, action: "save" };
          const { payload } = ((await dispatch(updateAssessment({ id, data }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof updateAssessment>
          >;
          if (payload) {
            dispatch(actSuccess(d("Save Successfully.").t("assess_msg_save_successfully")));
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
          const data: UpdateAssessmentRequestData = { ...value, action: "complete" };
          const errorlist: EntityOutcomeAttendanceMap[] | undefined =
            data.outcome_attendance_maps &&
            data.outcome_attendance_maps.filter(
              (item) => !item.none_achieved && !item.skip && (!item.attendance_ids || item.attendance_ids.length === 0)
            );
          if (data.action === "complete" && errorlist && errorlist.length > 0)
            return Promise.reject(dispatch(actWarning(d("Please fill in all the information.").t("assess_msg_missing_infor"))));
          const { payload } = ((await dispatch(updateAssessment({ id, data }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof updateAssessment>
          >;
          if (payload) {
            dispatch(actSuccess(d("Complete Successfully.").t("assess_msg_compete_successfully")));
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
  const rightsideArea = (
    <>
      <OutcomesFilter value={filterOutcomes} onChange={handleFilterOutcomes} />
      {filteredOutcomelist && filteredOutcomelist.length > 0 ? (
        <OutcomesTable
          outcomesList={filteredOutcomelist}
          attendanceList={attendances}
          formMethods={formMethods}
          formValue={formValue}
          filterOutcomes={filterOutcomes}
          editable={editable}
        />
      ) : (
        <NoOutComesList />
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
        assessmentDetail={assessmentDetail}
        isMyAssessment={isMyAssessment}
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        <Summary assessmentDetail={assessmentDetail} formMethods={formMethods} isMyAssessment={isMyAssessment} />
        {rightsideArea}
      </LayoutPair>
    </>
  );
}
export function AssessmentsEdit() {
  const { id, editindex } = useQuery();
  // debugger;
  return <AssessmentsEditIner key={`${id}${editindex}`}></AssessmentsEditIner>;
}
AssessmentsEdit.routeBasePath = "/assessments/assessments-detail";
