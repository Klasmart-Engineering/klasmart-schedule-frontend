import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { d } from "../../locale/LocaleManager";
import { AppDispatch, RootState } from "../../reducers";
import { getStudyAssessmentDetail } from "../../reducers/assessments";
import LayoutPair from "../ContentEdit/Layout";
import DetailForm from "./DetailForm";
import { DetailHeader } from "./DetailHeader";
import { DetailTable } from "./DetailTable";
import ResourcesView from "./ResourcesView";
import { ElasticLayerControl } from "./types";

export const useQueryDetail = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const scheduleId = query.get("schedule_id") || "";
  const id = query.get("id") || "";
  return { scheduleId, id };
};

export function AssessmentDetail() {
  const { id } = useQueryDetail();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const { studyAssessmentDetail } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
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
  const [elasticLayerControlData, setElasticLayerControlData] = React.useState<ElasticLayerControl>({
    link: "",
    openStatus: false,
    type: "",
  });
  const handleElasticLayerControl = (elasticLayerControlData: ElasticLayerControl) => {
    setElasticLayerControlData(elasticLayerControlData);
  };
  useEffect(() => {
    dispatch(getStudyAssessmentDetail({ id }));
  }, [dispatch, id]);
  return (
    <>
      <DetailHeader
        name={d("Assessment Details").t("assess_assessment_details")}
        onBack={handleGoBack}
        onComplete={handleDetailComplete}
        onSave={handleDetailSave}
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        <DetailForm assessmentDetail={studyAssessmentDetail} />
        <DetailTable handleElasticLayerControl={handleElasticLayerControl} />
      </LayoutPair>
      <ResourcesView elasticLayerControlData={elasticLayerControlData} handleElasticLayerControl={handleElasticLayerControl} />
    </>
  );
}
AssessmentDetail.routeBasePath = "/assessments/detail";
