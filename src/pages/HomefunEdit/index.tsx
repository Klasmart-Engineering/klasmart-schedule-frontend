import { unwrapResult } from "@reduxjs/toolkit";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { ExtendedRequestParams } from "../../api";
import { EntityAssessHomeFunStudyArgs, EntityHomeFunStudyOutcome } from "../../api/api.auto";
import { AssessmentStatus, AssessmentUpdateAction } from "../../api/type";
import { d } from "../../locale/LocaleManager";
import { setQuery } from "../../models/ModelContentDetailForm";
import { AppDispatch, RootState } from "../../reducers";
import { onLoadHomefunDetail, updateHomefun, UpdateHomefunAction, UpdateHomefunParams } from "../../reducers/assessments";
import { actAsyncConfirm } from "../../reducers/confirm";
import { actError, actSuccess } from "../../reducers/notify";
import { AssessmentHeader } from "../AssessmentEdit/AssessmentHeader";
import LayoutPair from "../ContentEdit/Layout";
import { Assignment } from "./Assignment";
import { Summary } from "./Summary";
import { LessonPlan } from "./LessonPlan";
import { Box } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  const editindex: number = Number(query.get("editindex") || 0);
  return { id, editindex };
};

function AssessmentsHomefunEditIner() {
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const { id, editindex } = useQuery();
  const { homefunDetail, homefunFeedbacks, hasPermissionOfHomefun } = useSelector<RootState, RootState["assessments"]>(
    (state) => state.assessments
  );
  const formMethods = useForm<EntityAssessHomeFunStudyArgs>();
  const { handleSubmit } = formMethods;
  const editable = hasPermissionOfHomefun && homefunDetail.status === AssessmentStatus.in_progress;
  const handleAssessmentSaveOrComplete = (action: AssessmentUpdateAction, message: string) =>
    handleSubmit(async (value) => {
      if (!id) return;
      const onError: ExtendedRequestParams["onError"] = async (content) => {
        if (content === d("A new version of the assignment has been submitted, please refresh").t("assess_msg_new_version")) {
          await dispatch(actAsyncConfirm({ content, hideCancel: true }));
          return history.replace({
            search: setQuery(history.location.search, { id, editindex: editindex + 1 }),
          });
        }
        dispatch(actError(content));
      };
      const data: UpdateHomefunParams = { ...value, id, action, onError };
      await dispatch(updateHomefun(data) as UpdateHomefunAction).then(unwrapResult);
      dispatch(actSuccess(message));
      history.replace({
        search: setQuery(history.location.search, { id, editindex: editindex + 1 }),
      });
    });
  // const handleLeave = useMemo<PromptProps["message"]>(
  //   () => (location) => {
  //     return location.pathname === AssessmentsHomefunEdit.routeBasePath ? false : d("Discard unsaved changes?").t("assess_msg_discard");
  //   },
  //   []
  // );
  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);
  useEffect(() => {
    id && dispatch(onLoadHomefunDetail({ id, metaLoading: true }));
  }, [dispatch, id, editindex]);

  const [check, setCheck] = React.useState("LessonPlan");

  const outcomesList: EntityHomeFunStudyOutcome[] = [
    {
      assumed: true,
      outcome_id: "55523523525345",
      outcome_name: "xiaopengyou",
      status: "achieved",
    },
    {
      assumed: true,
      outcome_id: "55523523525345",
      outcome_name: "xiaopengyou",
      status: "achieved",
    },
    {
      assumed: true,
      outcome_id: "55523523525345",
      outcome_name: "xiaopengyou",
      status: "achieved",
    },
    {
      assumed: true,
      outcome_id: "55523523525345",
      outcome_name: "xiaopengyou",
      status: "achieved",
    },
    {
      assumed: true,
      outcome_id: "55523523525345",
      outcome_name: "xiaopengyou",
      status: "achieved",
    },
  ];

  return (
    <>
      <AssessmentHeader
        name={d("Assessment Details").t("assess_assessment_details")}
        onSave={handleAssessmentSaveOrComplete(AssessmentUpdateAction.save, d("Saved Successfully.").t("assess_msg_save_successfully"))}
        onComplete={handleAssessmentSaveOrComplete(
          AssessmentUpdateAction.complete,
          d("Completed Successfully.").t("assess_msg_compete_successfully")
        )}
        onBack={handleGoBack}
        editable={editable}
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        <Summary detail={homefunDetail} feedbacks={homefunFeedbacks} />
        <Box>
          <RadioGroup
            value={check}
            onChange={(e) => {
              setCheck(e.target.value);
            }}
            row
            aria-label="position"
            name="position"
            defaultValue="top"
          >
            <FormControlLabel
              value="Assignment"
              control={<Radio color="primary" />}
              label="Learning Outcomes Assessment"
              labelPlacement="end"
              style={{ fontSize: "20px" }}
            />
            <FormControlLabel
              value="LessonPlan"
              control={<Radio color="primary" />}
              label="Assignment Assessment"
              labelPlacement="end"
              style={{ fontSize: "20px", marginLeft: "20px" }}
            />
          </RadioGroup>
          {check === "Assignment" && (
            <Assignment feedbacks={homefunFeedbacks} detail={homefunDetail} formMethods={formMethods} editable={editable} />
          )}
          {check === "LessonPlan" && (
            <LessonPlan
              feedbacks={homefunFeedbacks}
              detail={homefunDetail}
              formMethods={formMethods}
              editable={editable}
              outcomesList={outcomesList}
            />
          )}
        </Box>
      </LayoutPair>
      {/* <Prompt message={handleLeave} when={isDirty} /> */}
    </>
  );
}
export function AssessmentsHomefunEdit() {
  const { id, editindex } = useQuery();
  return <AssessmentsHomefunEditIner key={`${id}${editindex}`}></AssessmentsHomefunEditIner>;
}
AssessmentsHomefunEdit.routeBasePath = "/assessments/homefun-edit";
