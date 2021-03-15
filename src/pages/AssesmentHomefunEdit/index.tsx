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
import { AssessmentHeader } from "../AssessmentEdit/AssessmentHeader";
import LayoutPair from "../ContentEdit/Layout";
import { Assignment } from "./Assignment";
import { Summary } from "./Summary";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  const editindex: number = Number(query.get("editindex") || 0);
  const filterOutcomes = query.get("filterOutcomes") || "all";
  return { id, filterOutcomes, editindex };
};

function AssessmentsHomefunEditIner() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id, editindex } = useQuery();
  const { assessmentDetail, my_id } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const formMethods = useForm<UpdateAssessmentRequestDataOmitAction>();
  const { handleSubmit, reset } = formMethods;
  const isMyAssessmentlist = assessmentDetail.teachers?.filter((item) => item.id === my_id);
  const isMyAssessment = isMyAssessmentlist && isMyAssessmentlist.length > 0;
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
        <Assignment />
      </LayoutPair>
    </>
  );
}
export function AssessmentsHomefunEdit() {
  const { id, editindex } = useQuery();
  return <AssessmentsHomefunEditIner key={`${id}${editindex}`}></AssessmentsHomefunEditIner>;
}
AssessmentsHomefunEdit.routeBasePath = "/assessments/assessments-homefun-edit";
