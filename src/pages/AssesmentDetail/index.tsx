import React, { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router";
import { DetailHeader } from "./DetailHeader";
import { d } from "../../locale/LocaleManager";
import LayoutPair from "../ContentEdit/Layout";
import { DetailFrom } from "./DetailForm";
import { DetailTable } from "./DetailTable";

export const useQueryDetail = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const scheduleId = query.get("schedule_id") || "";
  return { scheduleId };
};

export function AssessmentDetail() {
  const query = useQueryDetail();
  console.log(query.scheduleId);
  const history = useHistory();
  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleDetailComplete = useMemo(
    () => () => {
      console.log("complete");
    },
    []
  );
  const handleDetailSave = useMemo(
    () => async () => {
      console.log("save");
    },
    []
  );
  return (
    <>
      <DetailHeader
        name={d("Assessment Details").t("assess_assessment_details")}
        onBack={handleGoBack}
        onComplete={handleDetailComplete}
        onSave={handleDetailSave}
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        <DetailFrom />
        <DetailTable />
      </LayoutPair>
    </>
  );
}
AssessmentDetail.routeBasePath = "/assessments/detail";
