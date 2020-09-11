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
import { AssessmentState, getAssessment, updateAssessment } from "../../reducers/assessment";
import LayoutPair from "../ContentEdit/Layout";
import { AssessmentHeader } from "./AssessmentHeader";
import { NoOutComesList, OutcomesFilter, OutcomesFilterProps } from "./filterOutcomes";
import { OutcomesTable } from "./OutcomesTable";
import { Summary } from "./Summary";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  const filterOutcomes = query.get("filterOutcomes") || undefined;
  return { id, filterOutcomes };
};
const filterOutcomeslist = (list: AssessmentState["assessmentDetail"]["outcome_attendance_maps"], value: string) => {
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
  const { filterOutcomes = "all", id } = useQuery();
  const assessmentDetail = useSelector<RootState, RootState["assessment"]["assessmentDetail"]>(
    (state) => state.assessment.assessmentDetail
  );
  const formMethods = useForm<UpdateAssessmentRequestDataOmitAction>();
  const { handleSubmit, reset, watch } = formMethods;
  const formValue = watch();
  debugger;
  const { attendances } = useMemo(() => ModelAssessment.toDetail(assessmentDetail, formValue), [assessmentDetail, formValue]);
  const filteredOutcomelist = useMemo(() => filterOutcomeslist(assessmentDetail.outcome_attendance_maps, filterOutcomes), [
    assessmentDetail,
    filterOutcomes,
  ]);
  const handleAssessmentSave = useMemo(
    () =>
      handleSubmit((value) => {
        if (id) {
          const data: UpdateAssessmentRequestData = { ...value, action: "save" };
          dispatch(updateAssessment({ id, data }));
        }
      }),
    [handleSubmit, id, dispatch]
  );
  const handleAssessmentComplete = useMemo(
    () =>
      handleSubmit((value) => {
        if (id) {
          const data: UpdateAssessmentRequestData = { ...value, action: "complete" };
          dispatch(updateAssessment({ id, data }));
        }
      }),
    [handleSubmit, id, dispatch]
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
      dispatch(getAssessment({ id }));
    }
  }, [filterOutcomes, dispatch, id]);
  useEffect(() => {
    if (assessmentDetail.id) {
      reset(ModelAssessment.toRequest(assessmentDetail));
    }
  }, [assessmentDetail, reset]);
  const rightsideArea = (
    <>
      <OutcomesFilter value={filterOutcomes} onChange={handleFilterOutcomes} />
      {filteredOutcomelist && filteredOutcomelist.length > 0 ? (
        <OutcomesTable outcomesList={filteredOutcomelist} attendanceList={attendances} formMethods={formMethods} />
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
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        <Summary assessmentDetail={assessmentDetail} formMethods={formMethods} selectedAttendence={attendances} />
        {rightsideArea}
      </LayoutPair>
    </>
  );
}
AssessmentsEdit.routeBasePath = "/assessments/assessments-detail";
