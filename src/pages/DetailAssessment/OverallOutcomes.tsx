import { Box, Checkbox, FormControlLabel, makeStyles, Table, TableBody, TableCell, TableContainer, TableRow } from "@material-ui/core";
import { ChangeEvent } from "react";
import { AchievedTooltips } from "../../components/DynamicTable";
import { PLField, PLTableHeader } from "../../components/PLTable";
import { d } from "../../locale/LocaleManager";
import { DetailAssessmentResult } from "../ListAssessment/types";
import { OverAllOutcomesItem } from "./type";

const useStyles = makeStyles({
  tableContainer: {
    marginTop: 5,
    maxHeight: 830,
    marginBottom: 20,
  },
  table: {
    minWidth: 900,
    fontSize: "14px !important",
  },
  checkBoxUi: {
    fontSize: "14px !important",
  },
  tableCellLine: {
    wordBreak: "break-all",
    "&:not(:last-child)": {
      // borderRight: "1px solid #ebebeb",
    },
  },
  assessActionline: {
    borderLeft: "1px solid #ebebeb",
  },
  tablecellError: {
    padding: 0,
    paddingBottom: 16,
  },
  partially_checked: {
    width: 18,
    height: 18,
    margin: 3,
    borderRadius: 3,
    backgroundColor: "#0E78D5",
    boxShadow: "0 0 2px #0E78D5",
  },
  disabled: {
    "& $partially_checked": {
      backgroundColor: "#ababab",
      boxShadow: "0 0 2px #ababab",
    },
  },
});
export interface OverallOutcomesProps {
  attendanceList: DetailAssessmentResult["students"];
  overallOutcomes: OverAllOutcomesItem[];
  editable: boolean;
  onChangeAllAchieved: (checked: boolean, outcome_id?: string) => void;
  onChangeNoneAchieved: (checked: boolean, outcome_id?: string) => void;
  onChangeStudentStatus: (checked: boolean, student_id?: string, outcome_id?: string) => void;
  onChangeNotCovered: (checked: boolean, outcome_id?: string) => void;
}
export function OverallOutcomes(props: OverallOutcomesProps) {
  const css = useStyles();
  const {
    attendanceList,
    overallOutcomes,
    editable,
    onChangeAllAchieved,
    onChangeNoneAchieved,
    onChangeStudentStatus,
    onChangeNotCovered,
  } = props;
  const OutcomesHeader: PLField[] = [
    {
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
      width: 150,
      value: "name",
      text: d("Learning Outcomes").t("library_label_learning_outcomes"),
    },
    {
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
      width: 120,
      value: "assignTo",
      text: d("Assigned to").t("assessment_assigned_to"),
    },
    { align: "center", style: { backgroundColor: "#F2F5F7" }, width: 100, value: "assumed", text: d("Assumed").t("assess_label_assumed") },
    {
      align: "center",
      style: { backgroundColor: "#F2F5F7" },
      value: "actions",
      text: (
        <div className="flex_align_center flex_justify_center">
          <span>{d("Assessing Actions").t("assess_option_assessing_actions")}</span>
          <AchievedTooltips showPartially />
        </div>
      ),
    },
  ];

  const handleChangeAllAchieved = (event: ChangeEvent<HTMLInputElement>, id?: string) => {
    onChangeAllAchieved(event.target.checked, id);
  };
  const handleChangeNoneAchieved = (event: ChangeEvent<HTMLInputElement>, id?: string) => {
    onChangeNoneAchieved(event.target.checked, id);
  };
  const handleChangeStudentStauts = (event: ChangeEvent<HTMLInputElement>, student_id?: string, outcome_id?: string) => {
    onChangeStudentStatus(event.target.checked, student_id, outcome_id);
  };
  const handleChangeNotCovered = (event: ChangeEvent<HTMLInputElement>, id?: string) => {
    onChangeNotCovered(event.target.checked, id);
  };
  const rows = overallOutcomes.map((outcome, index) => (
    <TableRow
      key={outcome.outcome_id}
      style={
        {
          // display: (filterOutcomes === "assumed" && !outcome.assumed) || (filterOutcomes === "unassumed" && outcome.assumed) ? "none" : "",
        }
      }
    >
      <TableCell className={css.tableCellLine} align="center">
        &ensp; {outcome.outcome_name} &ensp;
      </TableCell>
      <TableCell className={css.tableCellLine} align="center">
        &ensp;{" "}
        {outcome.assigned_to?.map((a) => (
          <div key={a}>
            {a === "LessonMaterial"
              ? d("Lesson Material").t("library_label_lesson_material")
              : d("Lesson Plan").t("library_label_lesson_plan")}
          </div>
        ))}{" "}
        &ensp;
      </TableCell>
      <TableCell className={css.tableCellLine} align="center">
        &ensp; {outcome.assumed ? d("Yes").t("assess_label_yes") : ""} &ensp;
      </TableCell>
      <TableCell className={css.tablecellError}>
        <Box display="flex" alignItems="center" p={2} pb={0}>
          <Box width={180} fontSize={14} style={{ flex: "none" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={outcome.skip ? false : outcome.attendance_ids && outcome.attendance_ids?.length === attendanceList?.length}
                  onChange={(e) => handleChangeAllAchieved(e, outcome.outcome_id)}
                  name="award"
                  color="primary"
                />
              }
              label={d("All Achieved").t("assess_option_all_achieved")}
              disabled={!editable}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={outcome.none_achieved}
                  color="primary"
                  onChange={(e) => handleChangeNoneAchieved(e, outcome.outcome_id)}
                />
              }
              label={d("None Achieved").t("assess_option_none_achieved")}
              disabled={!editable}
            />
            <FormControlLabel
              control={<Checkbox checked={outcome.skip} color="primary" onChange={(e) => handleChangeNotCovered(e, outcome.outcome_id)} />}
              label={d("Not Covered").t("assess_option_not_attempted")}
              disabled={!editable}
            />
          </Box>
          <Box px={3} className={css.assessActionline}>
            {attendanceList?.map((student) => (
              <FormControlLabel
                key={student.student_id}
                control={
                  <Checkbox
                    onChange={(e) => handleChangeStudentStauts(e, student.student_id, outcome.outcome_id)}
                    indeterminate={outcome.partial_attendance_ids?.some((p) => p === student.student_id)}
                    indeterminateIcon={<div className={css.partially_checked} />}
                    color="primary"
                    checked={outcome.attendance_ids && outcome.attendance_ids?.indexOf(student.student_id!) >= 0}
                  />
                }
                label={student.student_name}
                disabled={outcome.skip || !editable}
                className={outcome.skip || !editable ? css.disabled : ""}
              />
            ))}
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  ));
  return (
    <TableContainer className={css.tableContainer}>
      <Table className={css.table} stickyHeader>
        <PLTableHeader fields={OutcomesHeader} style={{ height: 80 }} />
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}
