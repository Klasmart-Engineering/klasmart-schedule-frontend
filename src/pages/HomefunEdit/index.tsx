import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { EntityAssessHomeFunStudyArgs, EntityOutcomeAttendanceMap } from "../../api/api.auto";
import { AssessmentStatus, UpdateAssessmentRequestData } from "../../api/type";
import { d } from "../../locale/LocaleManager";
import { setQuery } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned, onLoadHomefunDetail, updateAssessment } from "../../reducers/assessments";
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
  return { id, editindex };
};

function AssessmentsHomefunEditIner() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id, editindex } = useQuery();
  const { homefunDetail, homefunFeedbacks, hasPermissionOfHomefun } = useSelector<RootState, RootState["assessments"]>(
    (state) => state.assessments
  );
  console.log("homefunDetail, homefunFeedbacks, hasPermissionOfHomefun = ", homefunDetail, homefunFeedbacks, hasPermissionOfHomefun);
  const formMethods = useForm<EntityAssessHomeFunStudyArgs>();
  const { handleSubmit } = formMethods;
  const editable = hasPermissionOfHomefun && homefunDetail.status === AssessmentStatus.in_progress;
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
    id && dispatch(onLoadHomefunDetail({ id, metaLoading: true }));
  }, [dispatch, id, editindex]);

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
        <Summary detail={homefunDetail} feedbacks={homefunFeedbacks} />
        <Assignment feedbacks={homefunFeedbacks} detail={homefunDetail} formMethods={formMethods} />
      </LayoutPair>
    </>
  );
}
export function AssessmentsHomefunEdit() {
  const { id, editindex } = useQuery();
  return <AssessmentsHomefunEditIner key={`${id}${editindex}`}></AssessmentsHomefunEditIner>;
}
AssessmentsHomefunEdit.routeBasePath = "/assessments/homefun-edit";
