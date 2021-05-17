import { PayloadAction } from "@reduxjs/toolkit";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { UpdataStudyAssessmentRequestData } from "../../api/type";
import { d } from "../../locale/LocaleManager";
import { ModelAssessment, UpdateStudyAssessmentDataOmitAction } from "../../models/ModelAssessment";
import { setQuery } from "../../models/ModelContentDetailForm";
import { AppDispatch, RootState } from "../../reducers";
import { AsyncTrunkReturned, completeStudyAssessment, getStudyAssessmentDetail, updateStudyAssessment } from "../../reducers/assessments";
import { actSuccess } from "../../reducers/notify";
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
  const editindex: number = Number(query.get("editindex") || 0);
  return { scheduleId, id, editindex };
};

export function AssessmentDetail() {
  const { id, editindex } = useQueryDetail();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const formMethods = useForm<UpdateStudyAssessmentDataOmitAction>();
  const { studyAssessmentDetail } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);

  const editable = true;
  const {
    handleSubmit,
    // formState: { isDirty },
    // getValues,
    watch,
  } = formMethods;
  const formValue = watch();
  const { student_ids, lesson_materials } = formValue;
  const student_view_items = useMemo(() => {
    const res = ModelAssessment.toGetStudentViewItems(studyAssessmentDetail, student_ids, lesson_materials);
    return res;
  }, [studyAssessmentDetail, student_ids, lesson_materials]);
  console.log(student_view_items);
  const handleGoBack = useCallback(async () => {
    history.goBack();
  }, [history]);
  const handleDetailSave = useMemo(
    () =>
      handleSubmit(async (value) => {
        console.log(value);
        if (id) {
          const data: UpdataStudyAssessmentRequestData = { ...value, action: "save" };
          const { payload } = ((await dispatch(updateStudyAssessment({ id, data }))) as unknown) as PayloadAction<
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
    [handleSubmit, id, dispatch, history, editindex]
  );
  const handleDetailComplete = useMemo(
    () =>
      handleSubmit(async (value) => {
        // if (id) {
        const data: UpdataStudyAssessmentRequestData = { ...value, action: "complete" };
        // const errorlist: EntityOutcomeAttendances[] | undefined =
        //   data.outcome_attendances &&
        //   data.outcome_attendances.filter(
        //     (item) => !item.none_achieved && !item.skip && (!item.attendance_ids || item.attendance_ids.length === 0)
        //   );
        // if (data.action === "complete" && errorlist && errorlist.length > 0)
        //   return Promise.reject(dispatch(actWarning(d("Please fill in all the information.").t("assess_msg_missing_infor"))));
        // const { payload } = ((await dispatch(updateStudyAssessment({ id, data }))) as unknown) as PayloadAction<
        //   AsyncTrunkReturned<typeof updateStudyAssessment>
        // >;
        // if (payload) {
        //   dispatch(actSuccess(d("Completed Successfully.").t("assess_msg_compete_successfully")));
        //   history.replace({
        //     search: setQuery(history.location.search, { id: payload, editindex: editindex + 1 }),
        //   });
        // }

        // const info = "You cannot change the assessment after clicking Complete";
        // const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content: info, hideCancel: true })));
        // if(isConfirmed) {
        debugger;
        const { payload } = ((await dispatch(completeStudyAssessment({ id, data }))) as unknown) as PayloadAction<
          AsyncTrunkReturned<typeof updateStudyAssessment>
        >;
        if (payload) {
          history.replace({
            search: setQuery(history.location.search, { id: payload, editindex: editindex + 1 }),
          });
        }
        // }
        // }
      }),
    [handleSubmit, id, dispatch, history, editindex]
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
        editable={editable}
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        <DetailForm assessmentDetail={studyAssessmentDetail} formMethods={formMethods} />
        <DetailTable
          handleElasticLayerControl={handleElasticLayerControl}
          studentViewItems={student_view_items}
          formMethods={formMethods}
        />
      </LayoutPair>
      <ResourcesView elasticLayerControlData={elasticLayerControlData} handleElasticLayerControl={handleElasticLayerControl} />
    </>
  );
}
AssessmentDetail.routeBasePath = "/assessments/detail";
