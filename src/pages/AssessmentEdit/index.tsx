import { Box, FormControl, makeStyles, Select, Typography } from "@material-ui/core";
import { cloneDeep } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
const handleOutcomeslist = (list: AssessmentState["outcome_attendance_maps"], value: string) => {
  if (value === "all" || value === null) return list;
  let newList = cloneDeep(list);
  if (!newList) return list;
  return newList.filter((item: LearningOutcomes) => {
    return value === "assumed" ? item.assumed === true : item.assumed === false;
  });
};

export function AssessmentsDetail() {
  const history = useHistory();
  const dispatch = useDispatch();
  let { filterOutcomes = "all", id } = useQuery();
  if (!filterOutcomes) filterOutcomes = "all";
  const assessmentDetail = useSelector<RootState, RootState["assessment"]>((state) => state.assessment);
  let { outcome_attendance_maps, attendances } = assessmentDetail;
  const outcomesListInner = handleOutcomeslist(outcome_attendance_maps, filterOutcomes);
  const formMethods = useForm<AssessmentState>();
  const { handleSubmit, watch, getValues } = formMethods;

  let [selectedAttendence, SetSelectedAttendence] = useState(attendances);
  const handleAssessmentSave = () => {};
  const handleAssessmentComplete = () => {};
  const handleGoBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleOK = useMemo(
    () =>
      handleSubmit((data) => {
        SetSelectedAttendence(data.attendances);
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
    if (id) {
      dispatch(getAssessment({ id }));
    }
  }, [filterOutcomes, dispatch, id]);
  watch();
  console.log(getValues());

  const rightsideArea = (
    <>
      <OutcomesFilter value={filterOutcomes} onChange={handleFilterOutcomes} />
      {outcomesListInner && outcomesListInner.length > 0 ? (
        <OutcomesTable outcomesList={outcomesListInner} attendanceList={selectedAttendence} formMethods={formMethods} />
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
