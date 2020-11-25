import {
  Box,
  Checkbox,
  FormControlLabel,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import React, { useMemo } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { GetAssessmentResultOutcomeAttendanceMap } from "../../api/type";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { d } from "../../locale/LocaleManager";
import { UpdateAssessmentRequestDataOmitAction } from "../../models/ModelAssessment";
import { IAssessmentState } from "../../reducers/assessments";
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
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  tableCellLine: {
    "&:not(:last-child)": {
      borderRight: "1px solid #ebebeb",
    },
  },
  assessActionline: {
    borderLeft: "1px solid #ebebeb",
  },
  tablecellError: {
    padding: 0,
    paddingBottom: 16,
  },
});
interface mergeHandlerProps<T> extends Array<(arg: T) => any> {}

const mergeHanlder = <T extends unknown>(handlers: mergeHandlerProps<T>): any => {
  return function (arg: T) {
    handlers.forEach((handler) => handler(arg));
  };
};

interface AssessActionProps {
  outcome: GetAssessmentResultOutcomeAttendanceMap;
  attendanceList: IAssessmentState["assessmentDetail"]["attendances"];
  formMethods: UseFormMethods<IAssessmentState["assessmentDetail"]>;
  index: number;
  formValue: UpdateAssessmentRequestDataOmitAction;
  editable: boolean;
}

const AssessAction = (props: AssessActionProps) => {
  const css = useStyles();
  const {
    outcome: { outcome_id, attendance_ids },
    formMethods: { control, setValue },
    index,
    attendanceList,
    formValue,
    editable,
  } = props;
  const skip: boolean = (formValue.outcome_attendance_maps && formValue.outcome_attendance_maps[index].skip) || false;
  const none_achieved: boolean = (formValue.outcome_attendance_maps && formValue.outcome_attendance_maps[index].none_achieved) || false;
  const allValue: string[] = formValue.attendance_ids || [];
  const checked_attendance_ids = useMemo(() => allValue && attendance_ids?.filter((item) => allValue.indexOf(item) >= 0), [
    allValue,
    attendance_ids,
  ]);
  const funSetValue = useMemo(
    () => (name: string, value: boolean | string[]) => {
      setValue(`outcome_attendance_maps[${index}].${name}`, value);
    },
    [index, setValue]
  );
  const handleChangeSkip = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    funSetValue(name, e.target.checked);

    if (e.target.checked) {
      if (name === "skip") {
        funSetValue("none_achieved", false);
      }
      funSetValue("attendance_ids", []);
    }
  };

  const handleChangeStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      funSetValue("none_achieved", false);
    }
  };

  return (
    <Controller
      name={`outcome_attendance_maps[${index}].attendance_ids`}
      control={control}
      defaultValue={checked_attendance_ids || []}
      render={({ ref, ...props }) => (
        <CheckboxGroup
          allValue={allValue}
          {...props}
          render={(selectedContentGroupContext) => (
            <Box display="flex" alignItems="center" p={2} pb={0} {...{ ref }}>
              <Box width={500} fontSize={14}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedContentGroupContext.isAllvalue || false}
                      onChange={mergeHanlder([selectedContentGroupContext.registerAllChange, handleChangeStudent])}
                      name="award"
                      color="primary"
                    />
                  }
                  label={d("All Achieved").t("assess_option_all_achieved")}
                  disabled={skip || editable}
                />
                <Controller
                  name={`outcome_attendance_maps[${index}].none_achieved`}
                  defaultValue={none_achieved || false}
                  control={control}
                  render={(props: { value: boolean | undefined }) => (
                    <FormControlLabel
                      control={<Checkbox checked={props.value} onChange={(e) => handleChangeSkip(e, "none_achieved")} color="primary" />}
                      label={d("None Achieved").t("assess_option_none_achieved")}
                      disabled={skip || editable}
                    />
                  )}
                />
                <Controller
                  name={`outcome_attendance_maps[${index}].skip`}
                  defaultValue={skip || false}
                  control={control}
                  render={(props: { value: boolean | undefined }) => (
                    <FormControlLabel
                      control={<Checkbox checked={props.value} onChange={(e) => handleChangeSkip(e, "skip")} color="primary" />}
                      label={d("Not Attempted").t("assess_option_not_attempted")}
                      disabled={editable}
                    />
                  )}
                />
              </Box>
              <Box px={3} className={css.assessActionline}>
                {attendanceList &&
                  attendanceList.map((item) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          value={item.id}
                          checked={selectedContentGroupContext.hashValue[item.id as string] || false}
                          onChange={mergeHanlder([selectedContentGroupContext.registerChange, handleChangeStudent])}
                        />
                      }
                      label={item.name}
                      key={item.id}
                      disabled={skip || editable}
                    />
                  ))}
                <Controller
                  as={TextField}
                  control={control}
                  disabled
                  name={`outcome_attendance_maps[${index}].outcome_id`}
                  defaultValue={outcome_id}
                  style={{
                    display: "none",
                  }}
                />
              </Box>
            </Box>
          )}
        />
      )}
    />
  );
};

interface OutcomesTableProps {
  outcomesList: IAssessmentState["assessmentDetail"]["outcome_attendance_maps"];
  attendanceList: IAssessmentState["assessmentDetail"]["attendances"];
  formMethods: UseFormMethods<IAssessmentState["assessmentDetail"]>;
  formValue: UpdateAssessmentRequestDataOmitAction;
  editable: boolean;
  filterOutcomes: string;
}
export function OutcomesTable(props: OutcomesTableProps) {
  const css = useStyles();
  const { outcomesList, attendanceList, formMethods, formValue, editable, filterOutcomes } = props;
  const rows =
    outcomesList &&
    outcomesList.map((outcome, index) => (
      <TableRow
        key={outcome.outcome_id}
        style={{
          display: (filterOutcomes === "assumed" && !outcome.assumed) || (filterOutcomes === "unassumed" && outcome.assumed) ? "none" : "",
        }}
      >
        <TableCell className={css.tableCellLine} align="center">
          {outcome.outcome_name}
        </TableCell>
        <TableCell className={css.tableCellLine} align="center">
          {outcome.assumed ? d("Yes").t("assess_label_yes") : ""}
        </TableCell>
        <TableCell className={css.tablecellError}>
          <AssessAction
            outcome={outcome}
            attendanceList={attendanceList}
            formMethods={formMethods}
            index={index}
            formValue={formValue}
            editable={editable}
          ></AssessAction>
        </TableCell>
      </TableRow>
    ));
  return (
    <TableContainer className={css.tableContainer}>
      <Table className={css.table} stickyHeader>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell width={150} align="center">
              {d("Learning Outcomes").t("library_label_learning_outcomes")}
            </TableCell>
            <TableCell width={80} align="center">
              {d("Assumed").t("assess_label_assumed")}
            </TableCell>
            <TableCell align="center">{d("Assessing Actions").t("assess_option_assessing_actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}
