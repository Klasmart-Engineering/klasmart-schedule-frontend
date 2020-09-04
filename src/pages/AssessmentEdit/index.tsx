import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import assessmentDetail from "../../mocks/assessmentDetail.json";
import LayoutPair from "../ContentEdit/Layout";
import { AssessmentHeader } from "./AssessmentHeader";
import { OutcomesTable } from "./OutcomesTable";
import { Summary } from "./Summary";
export interface SummaryDetail {
  title: string;
  attendence: string[];
  subject: string;
  teacher: string;
  classEndTime: number;
  classLength: number;
  numberofActivities: number;
  numberofLearningOutcomes: number;
  completeTime: number;
}
export interface Attendence {
  id: string;
  name: string;
}
export interface Outcomes {
  id: string;
  name?: string;
  shortcode: string;
  assumed: boolean;
  author: string;
}
export interface AssessmentDetail {
  summary: SummaryDetail;
  outcomes: Outcomes[];
  attendenceList: Attendence[];
}
const { summary, outcomes, attendenceList } = assessmentDetail;

export function AssessmentsDetail() {
  const history = useHistory();
  const handleAssessmentSave = () => {};
  const handleAssessmentComplete = () => {};
  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleOK = () => {
    // todo filter attendencelist
  };
  const rightsideArea = <OutcomesTable outcomesList={outcomes} attendenceList={attendenceList}></OutcomesTable>;

  return (
    <>
      <AssessmentHeader
        name="Assessment Details"
        onSave={handleAssessmentSave}
        onBack={handleGoBack}
        onComplete={handleAssessmentComplete}
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        <Summary SummaryDetail={summary} onOk={handleOK} attendenceList={attendenceList} />
        {rightsideArea}
      </LayoutPair>
    </>
  );
}
AssessmentsDetail.routeBasePath = "/assessments/assessments-detail";
