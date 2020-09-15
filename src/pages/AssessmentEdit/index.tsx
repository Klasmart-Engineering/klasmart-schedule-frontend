import { PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { LearningOutcomes } from "../../api/api";
import { UpdateAssessmentRequestData } from "../../api/type";
import { ModelAssessment, UpdateAssessmentRequestDataOmitAction } from "../../models/ModelAssessment";
import { setQuery } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned, getAssessment, IAssessmentState, updateAssessment } from "../../reducers/assessments";
import { actSuccess } from "../../reducers/notify";
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
const filterOutcomeslist = (list: IAssessmentState["assessmentDetail"]["outcome_attendance_maps"], value: string) => {
  if (value === "all" || value === null) return list;
  let newList = cloneDeep(list);
  if (!newList) return list;
  return newList.filter((item: LearningOutcomes) => {
    return value === "assumed" ? item.assumed === true : item.assumed === false;
  });
};

export function AssessmentsEdit() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { filterOutcomes = "all", id, editindex } = useQuery();
  const assessmentDetail = useSelector<RootState, RootState["assessments"]["assessmentDetail"]>(
    (state) => state.assessments.assessmentDetail
  );
  const formMethods = useForm<UpdateAssessmentRequestDataOmitAction>();
  const { handleSubmit, reset, watch } = formMethods;
  const formValue = watch();
  const { attendances } = useMemo(() => ModelAssessment.toDetail(assessmentDetail, formValue), [assessmentDetail, formValue]);
  const filteredOutcomelist = useMemo(() => filterOutcomeslist(assessmentDetail.outcome_attendance_maps, filterOutcomes), [
    assessmentDetail,
    filterOutcomes,
  ]);
  const handleAssessmentSave = useMemo(
    () =>
      handleSubmit(async (value) => {
        if (id) {
          const data: UpdateAssessmentRequestData = { ...value, action: "save" };
          const { payload } = ((await dispatch(updateAssessment({ id, data }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof updateAssessment>
          >;
          if (payload) {
            dispatch(actSuccess("Save successfully"));
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
          const { payload } = ((await dispatch(updateAssessment({ id, data }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof updateAssessment>
          >;
          if (payload) {
            dispatch(actSuccess("Complete successfully"));
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
  }, [filterOutcomes, dispatch, id, editindex]);
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
          status={assessmentDetail.status}
        />
      ) : (
        <NoOutComesList />
      )}
    </>
  );

  return (
    <>
      <AssessmentHeader
        name="Assessment Details"
        onSave={handleAssessmentSave}
        onBack={handleGoBack}
        onComplete={handleAssessmentComplete}
        assessmentDetail={assessmentDetail}
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        <Summary assessmentDetail={assessmentDetail} formMethods={formMethods} />
        {rightsideArea}
      </LayoutPair>
    </>
  );
}
AssessmentsEdit.routeBasePath = "/assessments/assessments-detail";
