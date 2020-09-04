import { Box, FormControl, makeStyles, Select, Typography } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
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
export interface AssessmentDetailProps {
  summary: SummaryDetail;
  outcomesList: Outcomes[];
  attendenceList: Attendence[];
}
const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");
  const filterOutcomes = query.get("filterOutcomes");
  return { id, filterOutcomes };
};
const handleOutcomeslist = (list: Outcomes[], value: string) => {
  // todo:
  if (value === "all" || value === null) return list;
  return list.filter((item: Outcomes) => {
    return value === "assumed" ? (item.assumed = true) : (item.assumed = true);
  });
};
const { summary, outcomesList, attendenceList } = assessmentDetail;

export function AssessmentsDetail() {
  const history = useHistory();
  let { filterOutcomes = "all" } = useQuery();
  if (!filterOutcomes) filterOutcomes = "all";
  const outcomesListInner = handleOutcomeslist(outcomesList, filterOutcomes);
  const handleAssessmentSave = () => {};
  const handleAssessmentComplete = () => {};
  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);
  const handleOK = () => {
    // todo filter attendencelist
  };
  const handleFilterOutcomes = useMemo<OutcomesFilterProps["onChange"]>(
    () => (value) => {
      history.replace({
        search: setQuery(history.location.search, { filterOutcomes: value }),
      });
    },
    [history]
  );

  const rightsideArea =
    outcomesListInner.length > 0 ? (
      <>
        <OutcomesFilter value={filterOutcomes} onChange={handleFilterOutcomes} />
        <OutcomesTable outcomesList={outcomesListInner} attendenceList={attendenceList} />
      </>
    ) : (
      <NoOutComesList />
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
        <Summary SummaryDetail={summary} onOk={handleOK} attendenceList={attendenceList} />
        {rightsideArea}
      </LayoutPair>
    </>
  );
}
AssessmentsDetail.routeBasePath = "/assessments/assessments-detail";
