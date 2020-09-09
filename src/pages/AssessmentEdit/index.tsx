import { Box, FormControl, makeStyles, Select, Typography } from "@material-ui/core";
import { cloneDeep } from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { LearningOutcomes } from "../../api/api";
import noOutcomes from "../../assets/icons/noLearningOutcomes.svg";
import { setQuery } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import { AssessmentState, getAssessment } from "../../reducers/assessment";
import LayoutPair from "../ContentEdit/Layout";
import { AssessmentHeader } from "./AssessmentHeader";
import { OutcomesTable } from "./OutcomesTable";
import { Summary } from "./Summary";

const useStyles = makeStyles(({ palette, shadows }) => ({
  noOutComesImage: {
    marginTop: 100,
    marginBottom: 20,
    width: 578,
    height: 578,
  },
  emptyDesc: {
    position: "absolute",
    bottom: 100,
  },
  selectButton: {
    width: 160,
    marginBotton: 20,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
  },
}));

export function NoOutComesList() {
  const css = useStyles();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" position="relative">
      <img className={css.noOutComesImage} alt="empty" src={noOutcomes} />
      <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
        No learning outcome is available.
      </Typography>
    </Box>
  );
}
interface OutcomesFilterProps {
  value: string;
  onChange?: (vale: OutcomesFilterProps["value"]) => any;
}
function OutcomesFilter(props: OutcomesFilterProps) {
  const css = useStyles();
  const { value = "all", onChange } = props;
  const handleChange = useCallback(
    (e) => {
      if (onChange) onChange(e.target.value);
    },
    [onChange]
  );
  return (
    <Box display="flex" justifyContent="flex-end" mb={2}>
      <FormControl variant="outlined" size="small" className={css.selectButton}>
        <Select native defaultValue={value} onChange={handleChange}>
          <option value="all">All </option>
          <option value="assumed">Assumed </option>
          <option value="unassumed">Unassumed </option>
        </Select>
      </FormControl>
    </Box>
  );
}

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  const filterOutcomes = query.get("filterOutcomes");
  return { id, filterOutcomes };
};
const handleOutcomeslist = (list: AssessmentState["assessmentDetail"]["outcome_attendance_maps"], value: string) => {
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
  let { filterOutcomes = "all", id } = useQuery();
  if (!filterOutcomes) filterOutcomes = "all";
  const assessmentDetail = useSelector<RootState, RootState["assessment"]["assessmentDetail"]>(
    (state) => state.assessment.assessmentDetail
  );
  let { outcome_attendance_maps, attendances } = assessmentDetail;
  const outcomesListInner = handleOutcomeslist(outcome_attendance_maps, filterOutcomes);
  const formMethods = useForm<AssessmentState["assessmentDetail"]>();
  const { handleSubmit, reset } = formMethods;
  const handleAssessmentSave = useMemo(
    () =>
      handleSubmit((value) => {
        // const {id, attendances, outcome_attendance_maps} = value
        if (id) {
          // const data= {action: "save", attendance_ids: attendances?.map(v=>v.id),
          // outcome_attendance_maps: outcome_attendance_maps?.map(v => {outcome_id: v.outcome_id, attendance_ids:v.attendance_ids}) }
          // dispatch(updateAssessment({id, data }))
        }
        console.log("value=", value);
      }),
    [handleSubmit, id]
  );
  const handleAssessmentComplete = () => {};
  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleOK = useMemo(() => handleSubmit((data) => {}), [handleSubmit]);
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
    reset(assessmentDetail);
  }, [assessmentDetail, reset]);
  (window as any).reset = reset;
  // watch();
  // console.log(getValues());
  const rightsideArea = (
    <>
      <OutcomesFilter value={filterOutcomes} onChange={handleFilterOutcomes} />
      {outcomesListInner && outcomesListInner.length > 0 ? (
        <OutcomesTable outcomesList={outcomesListInner} attendanceList={attendances} formMethods={formMethods} />
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
        <Summary assessmentDetail={assessmentDetail} onOk={handleOK} formMethods={formMethods} selectedAttendence={attendances} />
        {rightsideArea}
      </LayoutPair>
    </>
  );
}
AssessmentsEdit.routeBasePath = "/assessments/assessments-detail";
