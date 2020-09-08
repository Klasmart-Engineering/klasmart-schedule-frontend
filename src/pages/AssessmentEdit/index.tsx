import { Box, FormControl, makeStyles, Select, Typography } from "@material-ui/core";
import { cloneDeep } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import noOutcomes from "../../assets/icons/noLearningOutcomes.svg";
import assessmentDetail from "../../mocks/assessmentDetail.json";
import { setQuery } from "../../models/ModelContentDetailForm";
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
        No Learning Outcomes available.
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

export interface Attendence {
  id: string;
  name: string;
}
export interface Outcomes {
  outcome_id: string;
  outcome_name: string;
  assumed: boolean;
  attendence_ids: Attendence[];
}
export interface AssessmentDetailProps {
  id: string;
  title: string;
  class_id: string;
  attendences: Attendence[];
  subject: string;
  teacher: string;
  class_end_time: number;
  class_length: number;
  number_of_activities: number;
  number_of_outcomes: number;
  complete_time: number;
  outcome_attendence_maps: Outcomes[];
}
const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  const filterOutcomes = query.get("filterOutcomes");
  return { id, filterOutcomes };
};
const handleOutcomeslist = (list: AssessmentDetailProps["outcome_attendence_maps"], value: string) => {
  if (value === "all" || value === null) return list;
  let newList = cloneDeep(list);
  return newList.filter((item: Outcomes) => {
    return value === "assumed" ? item.assumed === true : item.assumed === false;
  });
};
let { outcome_attendence_maps, attendences } = assessmentDetail;

export function AssessmentsDetail() {
  const history = useHistory();
  let { filterOutcomes = "all" } = useQuery();
  if (!filterOutcomes) filterOutcomes = "all";
  const outcomesListInner = handleOutcomeslist(outcome_attendence_maps, filterOutcomes);
  const formMethods = useForm<AssessmentDetailProps>();
  const { handleSubmit, watch, getValues } = formMethods;

  let [selectedAttendence, SetSelectedAttendence] = useState(attendences);
  const handleAssessmentSave = () => {};
  const handleAssessmentComplete = () => {};
  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleOK = useMemo(
    () =>
      handleSubmit((data) => {
        SetSelectedAttendence(data.attendences);
      }),
    [handleSubmit]
  );
  const handleFilterOutcomes = useMemo<OutcomesFilterProps["onChange"]>(
    () => (value) => {
      history.replace({
        search: setQuery(history.location.search, { filterOutcomes: value }),
      });
    },
    [history]
  );
  useEffect(() => {
    // todo:dispatch() 重新渲染页面
  }, [filterOutcomes]);
  watch();
  console.log(getValues());

  const rightsideArea = (
    <>
      <OutcomesFilter value={filterOutcomes} onChange={handleFilterOutcomes} />
      {outcomesListInner.length > 0 ? (
        <OutcomesTable outcomesList={outcomesListInner} attendenceList={selectedAttendence} formMethods={formMethods} />
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
        <Summary assessmentDetail={assessmentDetail} onOk={handleOK} formMethods={formMethods} selectedAttendence={selectedAttendence} />
        {rightsideArea}
      </LayoutPair>
    </>
  );
}
AssessmentsDetail.routeBasePath = "/assessments/assessments-detail";
